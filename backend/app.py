from http import client

from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import bcrypt, random, datetime, threading
from email_utils import send_otp_email
from bson import ObjectId
from flask import send_from_directory
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import bcrypt, random, datetime, threading, time
from email_utils import send_otp_email  # make sure this function works
from bson import ObjectId
import requests
import os
import base64
import cv2
import numpy as np
from deepface import DeepFace
import threading
import time
from dotenv import load_dotenv
from period_email_service import send_period_reminder
import threading
import requests





load_dotenv()

app = Flask(__name__)
CORS(app)



mongo_uri = os.getenv("MONGO_URI")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")



app.config["MONGO_URI"] = mongo_uri

mongo = PyMongo(app)

try:
    mongo.db.command("ping")
    print("✅ MongoDB Connected")
    print("Database:", mongo.db.name)
except Exception as e:
    print("❌ MongoDB Error:", e)

# -------------------- HELPERS --------------------


def check_period_reminders():
    try:
        users = mongo.db.user_profiles.find()
    except Exception as e:
        print("❌ Cannot access MongoDB:", e)
        return

    today = datetime.datetime.utcnow().date()
    today_string = today.strftime("%Y-%m-%d")

    print("📅 TODAY:", today)

    for user in users:

        email = user.get("email")
        predicted_start = user.get("predicted_period_start")
        last_reminder_sent = user.get("last_reminder_sent")

        print("----")
        print("USER:", email)
        print("PREDICTED:", predicted_start)
        print("LAST REMINDER:", last_reminder_sent)

        # Skip incomplete profiles
        if not email or not predicted_start:
            print("⏭️ Missing email or predicted date")
            continue

        # Convert predicted date
        try:
            predicted_date = datetime.datetime.strptime(
                predicted_start,
                "%Y-%m-%d"
            ).date()
        except Exception as e:
            print("❌ INVALID PREDICTED DATE:", e)
            continue

        # Calculate days until period
        diff = (predicted_date - today).days

        print("📊 DAYS DIFFERENCE:", diff)

        # ==================================================
        # 🛑 PREVENT DUPLICATE EMAIL ON SAME DAY
        # ==================================================

        if last_reminder_sent == today_string:
            print("⏭️ Reminder already sent today")
            continue

        # ==================================================
        # 📧 CREATE REMINDER
        # ==================================================

        subject = None
        message = None

        # -----------------------------------------------
        # 🩷 2 DAYS LEFT
        # -----------------------------------------------

        if diff == 2:

            subject = "🌸 Period Reminder - 2 Days Left"

            message = (
                "🩷 Your period is expected in 2 days.\n\n"
                "Please take care of yourself and stay prepared. 💖"
            )

        # -----------------------------------------------
        # 🩷 1 DAY LEFT
        # -----------------------------------------------

        elif diff == 1:

            subject = "🌸 Period Reminder - Tomorrow"

            message = (
                "🩷 Your period is expected tomorrow.\n\n"
                "Please stay prepared and take care of yourself. 💖"
            )

        # -----------------------------------------------
        # 🔴 TODAY
        # -----------------------------------------------

        elif diff == 0:

            subject = "🌸 Period Expected Today"

            message = (
                "🔴 Your period is expected today.\n\n"
                "Please remember to log your period in HerCare "
                "once it starts. 💖"
            )

        # -----------------------------------------------
        # ⚠️ PERIOD LATE
        # -----------------------------------------------

        elif diff < 0:

            days_late = abs(diff)

            subject = (
                f"⚠️ Period Reminder - "
                f"{days_late} Day(s) Late"
            )

            message = (
                f"⚠️ Your period is {days_late} day(s) late.\n\n"
                "If your period has started, please log the "
                "date in your HerCare period tracker. 💖\n\n"
                "If it has not started yet, you will continue "
                "to receive a daily reminder until you log it."
            )

        # -----------------------------------------------
        # 🟡 MORE THAN 2 DAYS AWAY
        # -----------------------------------------------

        else:

            print(
                f"⏳ Period is {diff} days away."
            )

            continue

        # ==================================================
        # 📧 SEND EMAIL
        # ==================================================

        try:

            print("🔥 SENDING PERIOD REMINDER")
            print("📧 TO:", email)
            print("📧 SUBJECT:", subject)

            send_email_async(
                email,
                subject,
                message
            )

            # ==================================================
            # ✅ SAVE LAST REMINDER DATE
            # ==================================================

            mongo.db.user_profiles.update_one(
                {"_id": user["_id"]},
                {
                    "$set": {
                        "last_reminder_sent": today_string
                    }
                }
            )

            print(
                "✅ Reminder recorded:",
                today_string
            )

        except Exception as e:

            print(
                "❌ PERIOD REMINDER ERROR:",
                str(e)
            )




def send_email_async(to_email, subject, message=None):
    print("📧 EMAIL FUNCTION CALLED")

    def task():
        try:
            if message is None:
                print("🔐 Sending OTP email...")
                send_otp_email(to_email, subject)
            else:
                print("🌸 Sending PERIOD email...")
                send_period_email(
                    to_email,
                    subject,
                    message
                )

        except Exception as e:
            print("❌ EMAIL ERROR:", str(e))

    threading.Thread(target=task, daemon=True).start()


def run_scheduler():
    while True:
        try:
            check_period_reminders()
        except Exception as e:
            print("❌ SCHEDULER ERROR:", e)

        time.sleep(43200)  # 12 hours


threading.Thread(
    target=run_scheduler,
    daemon=True
).start()






# -------------------- BASIC --------------------

@app.route("/")
def home():
    return "Backend is running 🚀"

# -------------------- AUTH --------------------

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory('static/images', filename)


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    )

    otp = str(random.randint(100000, 999999))

    # Store OTP
    mongo.db.otps.insert_one({
        "email": email,
        "otp": otp,
        "expires_at": (
            datetime.datetime.now(datetime.timezone.utc)
            + datetime.timedelta(minutes=5)
        )
    })

    # Send OTP
    send_email_async(email, otp)

    # Create user
    mongo.db.users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_pw,
        "is_verified": False,
        "onboarding_completed": False
    })

    return jsonify({
        "message": "OTP sent to email",
        "redirect": "onboarding"
    }), 200



@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json()

    email = data.get("email")
    otp = str(data.get("otp"))

    print("📩 Incoming:", email, otp)

    record = mongo.db.otps.find_one({"email": email})

    if not record:
        return jsonify({"message": "No OTP found"}), 400

    print("📦 DB OTP:", record["otp"])

    if str(record["otp"]) != otp:
        return jsonify({"message": "Invalid OTP"}), 400

    expires_at = record["expires_at"]

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=datetime.timezone.utc)

    if expires_at < datetime.datetime.now(datetime.timezone.utc):
        return jsonify({"message": "OTP expired"}), 400

    # ✅ verify user
    mongo.db.users.update_one(
        {"email": email},
        {"$set": {"is_verified": True}}
    )

    mongo.db.otps.delete_one({"email": email})

    user = mongo.db.users.find_one({"email": email})

    return jsonify({
        "message": "Email verified",
        "name": user["name"],
        "email": user["email"],
        "onboarding_completed": user.get("onboarding_completed", False)
    }), 200




@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    # Find user by email
    user = mongo.db.users.find_one({"email": email})

    # Check credentials
    if not user or not bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    # Ensure onboarding is marked as complete
    mongo.db.user_profiles.update_one(
        {"email": email},
        {"$set": {"onboardingComplete": True}},
        upsert=True
    )

    # Get next period info (optional)
    profile = mongo.db.user_profiles.find_one({"email": email})
    next_period = profile.get("next_predicted_period", "") if profile else ""

    # Send login email
    send_period_email(
    email,
    "Login Successful 🎉",
    f"""
    You logged in successfully 💖

    📅 Next expected period: {next_period}

    Stay healthy 🌸
    """
)

    # ✅ Force redirect to dashboard
    return jsonify({
        "message": "Login successful",
        "email": email,
        "redirect": "dashboard"  # Always go to dashboard
    }), 200

# -------------------- ONBOARDING --------------------


from email_utils import send_period_email   # ✅ use this instead

@app.route("/onboarding", methods=["POST"])
def onboarding():
    data = request.get_json()

    email = data.get("email")
    display_name = data.get("displayName")
    age = data.get("age")
    last_period = data.get("lastPeriodDate")
    period_regular = data.get("periodRegular")
    medical_issues = data.get("medicalIssues", [])
    cycle_length = data.get("cycleLength")

    # ✅ Basic validation
    if not email or not age or not last_period:
        return jsonify({"error": "Required fields missing"}), 400

    # ✅ Age validation
    try:
        age = int(age)
    except:
        return jsonify({"error": "Invalid age"}), 400

    # ✅ Cycle length handling
    if not cycle_length:
        cycle_length = 28
    else:
        try:
            cycle_length = int(cycle_length)
        except:
            cycle_length = 28

    if cycle_length < 20 or cycle_length > 40:
        cycle_length = 28

    # ✅ Convert last period date
    try:
        last_date_obj = datetime.datetime.strptime(last_period, "%Y-%m-%d")
    except:
        return jsonify({"error": "Invalid date format"}), 400

    # 🔮 Predict next period
    next_period = last_date_obj + datetime.timedelta(days=cycle_length)

    # ✅ Save / Update profile
    mongo.db.user_profiles.update_one(
        {"email": email},
        {
            "$set": {
                "display_name": display_name or "User",
                "age": age,
                "period_regular": period_regular,
                "medical_issues": medical_issues,
                "average_cycle_length": cycle_length,
                "predicted_period_start": next_period.strftime("%Y-%m-%d"),  # ✅ FIXED KEY
                "created_at": datetime.datetime.utcnow()
            },
            "$setOnInsert": {
                "period_dates": [last_period]
            }
        },
        upsert=True
    )

    # 🔒 Mark onboarding completed
    mongo.db.users.update_one(
        {"email": email},
        {"$set": {"onboarding_completed": True}}
    )

    # ✅ Get user name fallback
    user = mongo.db.users.find_one({"email": email})
    fallback_name = user.get("name", "User") if user else "User"

    final_name = display_name if display_name else fallback_name

    # 📧 SEND EMAIL (SMTP VERSION)
    try:
        subject = "Welcome to HerCare 💖"
        message = f"""
🌸 Welcome to HerCare, {final_name}!

Your next predicted period: {next_period.strftime('%Y-%m-%d')}
Cycle Length: {cycle_length} days

🩷 We'll remind you before your next cycle!

✨ Stay healthy, stay strong ✨
        """

        send_period_email(email, subject, message)

    except Exception as e:
        print("❌ EMAIL ERROR:", str(e))

    return jsonify({
        "message": "Onboarding completed",
        "display_name": final_name,
        "next_period": next_period.strftime("%Y-%m-%d"),
        "cycle_length": cycle_length
    }), 200





# community



@app.route("/community/post", methods=["POST"])
def create_post():
    data = request.get_json()

    email = data.get("email")
    content = data.get("content")

    if not all([email, content]):
        return jsonify({"error": "Missing data"}), 400

    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    post = {
        "user_email": email,
        "user_name": user["name"],
        "content": content,
        "created_at": datetime.datetime.utcnow(),
        "likes": [],
        "saved_by": []
    }

    mongo.db.community_posts.insert_one(post)
    return jsonify({"message": "Post created"}), 201

@app.route("/community/posts", methods=["GET"])
def get_posts():
    email = request.args.get("email")

    posts = []
    for post in mongo.db.community_posts.find().sort("created_at", -1):
        posts.append({
            "id": str(post["_id"]),
            "user": post["user_name"],
            "email": post["user_email"],
            "content": post["content"],
            "likes": len(post["likes"]),
            "liked_by_me": email in post["likes"],
            "saved_by_me": email in post["saved_by"],
            "created_at": post["created_at"].isoformat()
        })
    return jsonify(posts), 200



@app.route("/community/like", methods=["POST"])
def like_post():
    data = request.get_json()
    post_id = data.get("post_id")
    email = data.get("email")

    post = mongo.db.community_posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        return jsonify({"error": "Post not found"}), 404

    if email in post["likes"]:
        mongo.db.community_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$pull": {"likes": email}}
        )
    else:
        mongo.db.community_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$addToSet": {"likes": email}}
        )

    return jsonify({"message": "Like updated"}), 200


@app.route("/community/save", methods=["POST"])
def save_post():
    data = request.get_json()
    post_id = data.get("post_id")
    email = data.get("email")

    post = mongo.db.community_posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        return jsonify({"error": "Post not found"}), 404

    if email in post["saved_by"]:
        mongo.db.community_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$pull": {"saved_by": email}}
        )
    else:
        mongo.db.community_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$addToSet": {"saved_by": email}}
        )

    return jsonify({"message": "Save updated"}), 200



@app.route("/community/comment", methods=["POST"])
def add_comment():
    data = request.get_json()

    post_id = data.get("post_id")
    email = data.get("email")
    comment = data.get("comment")

    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    mongo.db.community_comments.insert_one({
        "post_id": ObjectId(post_id),
        "user_email": email,
        "user_name": user["name"],
        "comment": comment,
        "created_at": datetime.datetime.utcnow()
    })

    return jsonify({"message": "Comment added"}), 201


@app.route("/community/comments/<post_id>", methods=["GET"])
def get_comments(post_id):
    comments = []
    for c in mongo.db.community_comments.find(
        {"post_id": ObjectId(post_id)}
    ).sort("created_at", 1):
        comments.append({
            "user": c["user_name"],
            "comment": c["comment"],
            "created_at": c["created_at"].isoformat()
        })
    return jsonify(comments), 200


@app.route("/community/post/<post_id>", methods=["DELETE"])
def delete_post(post_id):
    data = request.get_json()
    email = data.get("email")

    post = mongo.db.community_posts.find_one({"_id": ObjectId(post_id)})

    if not post:
        return jsonify({"error": "Post not found"}), 404

    if post["user_email"] != email:
        return jsonify({"error": "Unauthorized"}), 403

    mongo.db.community_posts.delete_one({"_id": ObjectId(post_id)})
    mongo.db.community_comments.delete_many({"post_id": ObjectId(post_id)})

    return jsonify({"message": "Post deleted"}), 200





# ==================================================
# 🌸 WELLNESS / MINDFULNESS SECTION (NEW)
# ==================================================

@app.route("/wellness/categories", methods=["GET"])
def wellness_categories():
    return jsonify([
        "yoga",
        "meditation",
        "exercise",
        "period"
    ])

@app.route("/wellness/programs/<category>", methods=["GET"])
def get_wellness_programs(category):
    programs = []
    for p in mongo.db.wellness_programs.find({"category": category}):
        programs.append({
            "id": str(p["_id"]),
            "title": p["title"],
            "duration": p["duration"],
            "poses_count": len(p["poses"])
        })
    return jsonify(programs), 200


@app.route("/wellness/program/<program_id>", methods=["GET"])
def get_wellness_program(program_id):
    p = mongo.db.wellness_programs.find_one({"_id": ObjectId(program_id)})
    if not p:
        return jsonify({"error": "Program not found"}), 404

    p["_id"] = str(p["_id"])
    return jsonify(p), 200


@app.route("/wellness/seed", methods=["POST"])
def seed_wellness():
    mongo.db.wellness_programs.delete_many({})

    mongo.db.wellness_programs.insert_many([
        {
            "category": "period",
            "title": "Period Pain Relief",
            "duration": "3 min",
            "poses": [
                {"name": "Supported Child’s Pose", "time": 60, "image": "child_pose.jpg"},
                {"name": "Supported Pigeon Pose", "time": 60, "image": "pigeon_pose.jpg"},
                {"name": "Reclining Bound Angle Pose", "time": 60, "image": "bound_angle.jpg"}
            ]
        },
        {
            "category": "yoga",
            "title": "Stress Relief Yoga",
            "duration": "5 min",
            "poses": [
                {"name": "Cat Cow Pose", "time": 90, "image": "cat_cow.jpg"},
                {"name": "Child Pose", "time": 90, "image": "child_pose.jpg"}
            ]
        },
        {
            "category": "meditation",
            "title": "Calm Breathing",
            "duration": "3 min",
            "poses": [
                {"name": "Deep Breathing", "time": 180, "image": "breathing.jpg"}
            ]
        }
    ])

    return jsonify({"message": "Wellness programs seeded"}), 201

# 



#new added


# ================= CHATBOT ROUTE =================
@app.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        user_message = request.json.get("message")

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are a friendly women's health assistant."},
                    {"role": "user", "content": user_message}
                ]
            }
        )

        data = response.json()
        reply = data.get("choices", [{}])[0].get("message", {}).get("content", "No response")

        return jsonify({"reply": reply})

    except Exception as e:
        print(e)
        return jsonify({"reply": "Server error"}), 200




# period tracker



@app.route("/dashboard/<email>", methods=["GET"])
def dashboard(email):
    profile = mongo.db.user_profiles.find_one({"email": email})

    # ❌ No profile
    if not profile:
        return jsonify({
            "next_predicted_period": "",
            "predicted_period_days": [],
            "avg_cycle": 28
        })

    period_dates = profile.get("period_dates", [])
    avg_cycle = profile.get("average_cycle_length", 28)  # ✅ FIXED KEY

    # ✅ Safe int conversion
    try:
        avg_cycle = int(avg_cycle)
    except:
        avg_cycle = 28

    # ❌ No period data
    if not period_dates:
        return jsonify({
            "next_predicted_period": "",
            "predicted_period_days": [],
            "avg_cycle": avg_cycle
        })

    # ✅ SORT DATES
    sorted_dates = sorted(period_dates)

    # ✅ LAST DATE
    last_date_str = sorted_dates[-1]
    last_date = datetime.datetime.strptime(last_date_str, "%Y-%m-%d")

    # ✅ SMART CYCLE CALCULATION (if enough data)
    if len(sorted_dates) >= 2:
        diffs = []
        for i in range(1, len(sorted_dates)):
            d1 = datetime.datetime.strptime(sorted_dates[i], "%Y-%m-%d")
            d0 = datetime.datetime.strptime(sorted_dates[i - 1], "%Y-%m-%d")
            diff_days = (d1 - d0).days

            # ✅ Ignore unrealistic cycles
            if 20 <= diff_days <= 40:
                diffs.append(diff_days)

        if diffs:
            avg_cycle = sum(diffs) // len(diffs)

    # ✅ NEXT PERIOD CALCULATION
    next_period = last_date + datetime.timedelta(days=avg_cycle)

    # 💗 PREDICTED 5-DAY WINDOW
    predicted_days = []
    for i in range(5):
        d = next_period + datetime.timedelta(days=i)
        predicted_days.append(d.strftime("%Y-%m-%d"))

    # ✅ UPDATE DB (SYNC WITH OTHER APIS)
    mongo.db.user_profiles.update_one(
        {"email": email},
        {
            "$set": {
                "predicted_period_start": next_period.strftime("%Y-%m-%d"),
                "predicted_period_days": predicted_days,
                "average_cycle_length": avg_cycle   # ✅ CONSISTENT KEY
            }
        }
    )

    return jsonify({
        "next_predicted_period": next_period.strftime("%Y-%m-%d"),
        "predicted_period_days": predicted_days,
        "avg_cycle": avg_cycle
    })


from email_utils import send_period_email
from email_utils import send_period_email




@app.route("/log-period", methods=["POST"])
def log_period():
    data = request.get_json()

    email = data.get("email")
    new_date = data.get("newPeriodDate")
    symptom = data.get("symptom", "")

    if not email or not new_date:
        return jsonify({"error": "Missing data"}), 400

    # 🔍 Find user's profile
    profile = mongo.db.user_profiles.find_one({"email": email})

    # ✅ Create profile if it does not exist
    if not profile:
        mongo.db.user_profiles.insert_one({
            "email": email,
            "period_dates": [],
            "predicted_period_start": "",
            "predicted_period_days": [],
            "average_cycle_length": 28,
            "last_reminder_sent": None
        })

        profile = mongo.db.user_profiles.find_one({"email": email})

    # 📅 Get previous period dates
    dates = profile.get("period_dates", [])

    # ✅ Avoid duplicate entry
    if new_date in dates:
        return jsonify({
            "message": "Period date already exists",
            "period_dates": dates
        }), 200

    # ➕ Add new period date
    dates.append(new_date)

    # 🔄 Get user's saved cycle length
    cycle_length = profile.get("average_cycle_length", 28)

    try:
        cycle_length = int(cycle_length)
    except:
        cycle_length = 28

    # 🩸 Calculate next predicted period
    last_date_obj = datetime.datetime.strptime(
        new_date,
        "%Y-%m-%d"
    )

    next_period = last_date_obj + datetime.timedelta(
        days=cycle_length
    )

    # 💗 Create 5-day predicted period range
    predicted_days = []

    for i in range(5):
        d = next_period + datetime.timedelta(days=i)
        predicted_days.append(
            d.strftime("%Y-%m-%d")
        )

    # ✅ Update user's profile
    # 🔄 Reset last_reminder_sent because a new period
    # has been logged and a new reminder cycle starts.
    mongo.db.user_profiles.update_one(
        {"email": email},
        {
            "$set": {
                "period_dates": dates,
                "predicted_period_start": next_period.strftime("%Y-%m-%d"),
                "predicted_period_days": predicted_days,
                "average_cycle_length": cycle_length,
                "last_reminder_sent": None
            }
        }
    )

    # ✅ Save period log
    mongo.db.period_logs.insert_one({
        "email": email,
        "date": new_date,
        "symptom": symptom,
        "created_at": datetime.datetime.utcnow()
    })

    # ✅ Save full period history
    mongo.db.period_tracker.update_one(
        {"email": email},
        {
            "$push": {
                "history": {
                    "date": new_date,
                    "symptom": symptom,
                    "logged_at": datetime.datetime.utcnow()
                }
            }
        },
        upsert=True
    )

    # 📧 Send confirmation email
    try:
        today = datetime.datetime.utcnow().date()

        diff = (
            next_period.date() - today
        ).days

        # 🔥 Dynamic reminder message
        if diff == 2:
            reminder_msg = (
                "⏳ Your next period is expected in 2 days!"
            )

        elif diff == 1:
            reminder_msg = (
                "⏳ Your next period is expected tomorrow!"
            )

        elif diff == 0:
            reminder_msg = (
                "🔴 Your period is expected today!"
            )

        elif diff < 0:
            days_late = abs(diff)

            reminder_msg = (
                f"⚠️ Your period is {days_late} day(s) late. "
                "Please log it if your period has started."
            )

        else:
            reminder_msg = (
                f"🗓️ Your next period is expected in "
                f"{diff} days."
            )

        subject = "🌸 Period Logged Successfully"

        message = f"""
You logged your period on {new_date}.

🩸 Next expected period:
{next_period.strftime('%Y-%m-%d')}

📅 Cycle length:
{cycle_length} days

{reminder_msg}

💖 Stay healthy and take care!
        """

        send_period_email(
            email,
            subject,
            message
        )

    except Exception as e:
        print("❌ EMAIL ERROR:", str(e))

    # ✅ Send response to frontend
    return jsonify({
        "message": "Period logged successfully",
        "period_dates": dates,
        "next_period": next_period.strftime("%Y-%m-%d"),
        "predicted_period_days": predicted_days,
        "cycle_length": cycle_length
    }), 200


@app.route("/period-dates/<email>", methods=["GET"])
def get_period_dates(email):
    profile = mongo.db.user_profiles.find_one({"email": email})

    if not profile:
        return jsonify({
            "period_dates": [],
            "predicted_period_days": []
        })

    return jsonify({
        "period_dates": profile.get("period_dates", []),
        "predicted_period_days": profile.get("predicted_period_days", [])
    })



@app.route("/profile/<email>", methods=["GET"])
def get_profile(email):
    profile = mongo.db.user_profiles.find_one({"email": email})

    if not profile:
        return jsonify({"error": "Profile not found"}), 404

    profile["_id"] = str(profile["_id"])
    return jsonify(profile), 200



@app.route("/profile/update", methods=["PUT"])
def update_profile():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email required"}), 400

    mongo.db.user_profiles.update_one(
        {"email": email},
        {
            "$set": {
                "age": data.get("age"),
                "period_regular": data.get("periodRegular"),
                "average_cycle_length": data.get("cycleLength"),
                "medical_issues": data.get("medicalIssues"),
            }
        }
    )

    return jsonify({"message": "Profile updated"}), 200




import requests

@app.route("/ai-suggestions", methods=["POST"])
def ai_suggestions():
    data = request.get_json()

    symptoms = data.get("symptoms", [])
    mood = data.get("mood", "")
    flow = data.get("flow", "")

    try:
        prompt = f"""
Act like a friendly women's health assistant.

User:
Symptoms: {symptoms}
Mood: {mood}
Flow: {flow}

Give response STRICTLY in this format:

🌸 What's happening:
(1 short line only)

💡 Tips:
• Tip 1
• Tip 2

💖 Care:
(1 short comforting line)

Keep it SHORT. No long paragraphs.
"""

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": "You are a women's health assistant."},
                    {"role": "user", "content": prompt}
                ]
            }
        )

        result = response.json()
        ai_text = result["choices"][0]["message"]["content"]

        return jsonify({"suggestion": ai_text})

    except Exception as e:
        print("❌ AI ERROR:", str(e))
        return jsonify({"suggestion": "⚠️ Unable to fetch AI suggestion right now."})





# Add this route to your Flask app.py
@app.route('/dashboard/<email>', methods=['GET'])
def get_dashboard_data(email):
    """
    Get dashboard data for a user including period tracking information
    """
    try:
        user = mongo.db.users.find_one({'email': email})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get period tracking data
        period_dates = user.get('period_dates', [])
        last_period_date = user.get('last_period_date')
        average_cycle_length = user.get('average_cycle_length', 28)
        predicted_period_days = user.get('predicted_period_days', [])
        predicted_period_start = user.get('predicted_period_start')
        
        # Calculate current cycle day
        current_day = 0
        if last_period_date:
            try:
                last_date = datetime.strptime(last_period_date, '%Y-%m-%d').date()
                today = datetime.now().date()
                days_since_last_period = (today - last_date).days
                current_day = days_since_last_period + 1  # Day 1 is the first day of period
            except:
                current_day = 0
        
        # Determine phase based on cycle day
        phase = "Not Tracked"
        if current_day > 0 and average_cycle_length > 0:
            if current_day <= 7:
                phase = "Menstrual Phase"
            elif current_day <= 14:
                phase = "Follicular Phase"
            elif current_day <= 16:
                phase = "Ovulation Phase"
            elif current_day <= average_cycle_length - 5:
                phase = "Luteal Phase"
            else:
                phase = "Premenstrual Phase"
        
        # Get next predicted period date
        next_period_date = None
        if predicted_period_start:
            next_period_date = predicted_period_start
        elif predicted_period_days and len(predicted_period_days) > 0:
            # Sort and get the next future period
            sorted_dates = sorted(predicted_period_days)
            today = datetime.now().date()
            for date_str in sorted_dates:
                try:
                    date_obj = datetime.strptime(date_str, '%Y-%m-%d').date()
                    if date_obj >= today:
                        next_period_date = date_str
                        break
                except:
                    continue
        
        # Prepare response
        response_data = {
            'email': email,
            'name': user.get('name', ''),
            'period_data': {
                'period_dates': period_dates,
                'last_period_date': last_period_date,
                'current_day': current_day,
                'cycle_length': average_cycle_length,
                'predicted_period_date': next_period_date,
                'predicted_period_days': predicted_period_days,
                'days_until_period': (datetime.strptime(next_period_date, '%Y-%m-%d').date() - datetime.now().date()).days if next_period_date else None,
                'phase': phase
            },
            'health_score': 85,  # You can calculate this based on user data
            'mood_trend': 'Stable'  # You can calculate this based on user data
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Error in dashboard data: {str(e)}")
        return jsonify({'error': str(e)}), 500
# -------------------- RUN --------------------






# =====================================================
# 📰 ARTICLES
# =====================================================

@app.route("/articles", methods=["GET"])
def get_articles():
    try:
        category = request.args.get("category")

        query = {
            "is_active": True
        }

        # 🔎 Filter by category if provided
        if category:
            query["category"] = category

        articles = list(
            mongo.db.articles.find(query).sort("created_at", -1)
        )

        result = []

        for article in articles:
            result.append({
                "id": str(article["_id"]),
                "title": article.get("title", ""),
                "description": article.get("description", ""),
                "category": article.get("category", ""),
                "tag": article.get("tag", ""),
                "source": article.get("source", ""),
                "article_url": article.get("article_url", ""),
                "image": article.get("image", ""),
                "likes": article.get("likes", 0)
            })

        return jsonify(result), 200

    except Exception as e:
        print("❌ ARTICLES ERROR:", str(e))
        return jsonify({
            "error": "Unable to fetch articles"
        }), 500



@app.route("/articles/<article_id>", methods=["GET"])
def get_article(article_id):
    try:
        article = mongo.db.articles.find_one({
            "_id": ObjectId(article_id),
            "is_active": True
        })

        if not article:
            return jsonify({
                "error": "Article not found"
            }), 404

        return jsonify({
            "id": str(article["_id"]),
            "title": article.get("title", ""),
            "description": article.get("description", ""),
            "category": article.get("category", ""),
            "tag": article.get("tag", ""),
            "source": article.get("source", ""),
            "article_url": article.get("article_url", ""),
            "image": article.get("image", ""),
            "likes": article.get("likes", 0)
        }), 200

    except Exception as e:
        print("❌ ARTICLE ERROR:", str(e))
        return jsonify({
            "error": "Invalid article ID"
        }), 400



@app.route("/articles/interactions/<email>", methods=["GET"])
def get_article_interactions(email):

    interactions = list(
        mongo.db.article_interactions.find(
            {"email": email},
            {"_id": 0}
        )
    )

    return jsonify(interactions), 200


@app.route("/articles/like", methods=["POST"])
def like_article():

    data = request.get_json()

    email = data.get("email")
    article_id = data.get("article_id")

    if not email or not article_id:
        return jsonify({"error": "Missing data"}), 400

    existing = mongo.db.article_interactions.find_one({
        "email": email,
        "article_id": article_id
    })

    if existing:

        new_status = not existing.get("liked", False)

        mongo.db.article_interactions.update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "liked": new_status,
                    "updated_at": datetime.datetime.utcnow()
                }
            }
        )

    else:

        mongo.db.article_interactions.insert_one({
            "email": email,
            "article_id": article_id,
            "liked": True,
            "saved": False,
            "updated_at": datetime.datetime.utcnow()
        })

        new_status = True

    return jsonify({
        "liked": new_status
    }), 200


@app.route("/articles/save", methods=["POST"])
def save_article():

    data = request.get_json()

    email = data.get("email")
    article_id = data.get("article_id")

    if not email or not article_id:
        return jsonify({"error": "Missing data"}), 400

    existing = mongo.db.article_interactions.find_one({
        "email": email,
        "article_id": article_id
    })

    if existing:

        new_status = not existing.get("saved", False)

        mongo.db.article_interactions.update_one(
            {"_id": existing["_id"]},
            {
                "$set": {
                    "saved": new_status,
                    "updated_at": datetime.datetime.utcnow()
                }
            }
        )

    else:

        mongo.db.article_interactions.insert_one({
            "email": email,
            "article_id": article_id,
            "liked": False,
            "saved": True,
            "updated_at": datetime.datetime.utcnow()
        })

        new_status = True

    return jsonify({
        "saved": new_status
    }), 200


# ---------------------------------------------

def get_recommendation(emotion):

    recommendations = {
        "happy": "Keep up your positive energy 💖",
        "sad": "Try a 5-minute meditation session 🧘",
        "angry": "Take a deep breathing exercise 🌸",
        "fear": "Listen to calming music 🎵",
        "neutral": "Stay hydrated and active 💧",
        "surprise": "Take a moment to relax 🌼",
        "disgust": "Take some time to relax and care for yourself 🌷"
    }

    return recommendations.get(
        emotion,
        "Take care of yourself 💕"
    )

# ----------------------------------------------
@app.route("/emotion-detect", methods=["POST"])
def emotion_detect():

    try:
        data = request.get_json()

        image_data = data.get("image")
        email = data.get("email")

        if not image_data:
            return jsonify({
                "error": "No image received"
            }), 400

        # Remove data:image/jpeg;base64, prefix
        image_data = image_data.split(",")[1]

        # Decode image
        image_bytes = base64.b64decode(image_data)

        np_arr = np.frombuffer(
            image_bytes,
            np.uint8
        )

        frame = cv2.imdecode(
            np_arr,
            cv2.IMREAD_COLOR
        )

        # Detect emotion using DeepFace
        result = DeepFace.analyze(
            frame,
            actions=["emotion"],
            enforce_detection=False
        )

        # Get dominant emotion
        emotion = str(
            result[0]["dominant_emotion"]
        )

        # Convert NumPy float32 to normal Python float
        confidence = float(
            max(result[0]["emotion"].values())
        )

        # Get recommendation
        recommendation = get_recommendation(emotion)

        # Save only emotion data to MongoDB
        mongo.db.emotion_logs.insert_one({
            "email": email,
            "emotion": emotion,
            "confidence": confidence,
            "recommendation": recommendation,
            "timestamp": datetime.datetime.utcnow()
        })

        # Send result to React
        return jsonify({
            "emotion": emotion,
            "confidence": confidence,
            "recommendation": recommendation
        }), 200

    except Exception as e:

        print("Emotion Detection Error:", str(e))

        return jsonify({
            "error": str(e)
        }), 500




if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)




    