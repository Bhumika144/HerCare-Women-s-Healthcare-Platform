import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===========================
   AUTH & USER
=========================== */

export const signup = (data) => api.post("/signup", data);

export const verifyOtp = (data) => api.post("/verify-otp", data);

export const login = (data) => api.post("/login", data);

export const submitOnboarding = (data) => api.post("/onboarding", data);

/* ===========================
   DASHBOARD
=========================== */

export const getDashboardData = async (email) => {
  try {
    const response = await api.get(`/dashboard/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

/* ===========================
   PERIOD TRACKER
=========================== */

export const getPeriodDates = async (email) => {
  try {
    const response = await api.get(`/period-dates/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching period dates:", error);
    throw error;
  }
};

export const logPeriod = async (email, periodData) => {
  try {
    const response = await api.post('/log-period', {
      email,
      ...periodData
    });
    return response.data;
  } catch (error) {
    console.error("Error logging period:", error);
    throw error;
  }
};

/* ===========================
   COMMUNITY
=========================== */

export const createPost = (data) => api.post("/community/post", data);

export const getPosts = (email) =>
  api.get("/community/posts", { params: { email } });

export const likePost = (data) => api.post("/community/like", data);

export const savePost = (data) => api.post("/community/save", data);

export const addComment = (data) => api.post("/community/comment", data);

export const getComments = (postId) =>
  api.get(`/community/comments/${postId}`);

/* ===========================
   🌸 WELLNESS / MINDFULNESS
=========================== */

// 1️⃣ Get all wellness categories
export const getWellnessCategories = () =>
  api.get("/wellness/categories");

// 2️⃣ Get programs by category (yoga, meditation, exercise, period)
export const getWellnessPrograms = (category) =>
  api.get(`/wellness/programs/${category}`);

// 3️⃣ Get full program with poses
export const getWellnessProgramById = (programId) =>
  api.get(`/wellness/program/${programId}`);

// 4️⃣ (Admin / Dev only) Seed wellness programs
export const seedWellnessPrograms = () =>
  api.post("/wellness/seed");

/* ===========================
   EXPORT DEFAULT
=========================== */

export default api;