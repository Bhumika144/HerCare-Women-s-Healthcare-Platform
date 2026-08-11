import { useEffect, useState } from "react";
import api from "../api";
import "../styles/Articles.css";

export default function Articles() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // ❤️ 🔖 Store user interactions
  const [interactions, setInteractions] = useState({});

  useEffect(() => {
    fetchArticles();
    fetchInteractions();
  }, []);

  // =========================
  // FETCH ARTICLES
  // =========================

  const fetchArticles = async () => {
    try {
      const res = await api.get("/articles");
      setArticles(res.data);
    } catch (err) {
      console.error("❌ ARTICLE FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH LIKE + SAVE DATA
  // =========================

  const fetchInteractions = async () => {
    if (!user?.email) return;

    try {
      const res = await api.get(
        `/articles/interactions/${user.email}`
      );

      const interactionMap = {};

      res.data.forEach((item) => {
        interactionMap[item.article_id] = {
          liked: item.liked || false,
          saved: item.saved || false
        };
      });

      setInteractions(interactionMap);

    } catch (err) {
      console.error("❌ INTERACTION FETCH ERROR:", err);
    }
  };

  // =========================
  // LIKE ARTICLE
  // =========================

  const handleLike = async (articleId) => {
    if (!user?.email) return;

    try {
      const res = await api.post("/articles/like", {
        email: user.email,
        article_id: articleId
      });

      setInteractions((prev) => ({
        ...prev,
        [articleId]: {
          ...prev[articleId],
          liked: res.data.liked
        }
      }));

    } catch (err) {
      console.error("❌ LIKE ERROR:", err);
    }
  };

  // =========================
  // SAVE ARTICLE
  // =========================

  const handleSave = async (articleId) => {
    if (!user?.email) return;

    try {
      const res = await api.post("/articles/save", {
        email: user.email,
        article_id: articleId
      });

      setInteractions((prev) => ({
        ...prev,
        [articleId]: {
          ...prev[articleId],
          saved: res.data.saved
        }
      }));

    } catch (err) {
      console.error("❌ SAVE ERROR:", err);
    }
  };

  // =========================
  // FILTER ARTICLES
  // =========================

  const filteredArticles = articles.filter((article) => {

    const matchesCategory =
      activeCategory === "All" ||
      article.category === activeCategory;

    const searchText = search.toLowerCase();

    const matchesSearch =
      article.title.toLowerCase().includes(searchText) ||
      article.description.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="articles-page">

      {/* =========================
          HERO SECTION
      ========================== */}

      <section className="articles-hero">

        <div className="articles-hero-content">

          <span className="articles-small-title">
            HERCARE WELLNESS
          </span>

          <h1>
            Learn. Understand.
            <br />
            <span>Take Care of You. 🌸</span>
          </h1>

          <p>
            Explore trusted wellness resources covering
            menstrual health and mental wellbeing.
          </p>

        </div>

        <div className="articles-hero-image">

          <img
            src="/src/assets/images/Article.png"
            alt="Woman reading a wellness article"
          />

        </div>

      </section>


      {/* =========================
          SEARCH
      ========================== */}

      <div className="articles-search">

        <span>🔍</span>

        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* =========================
          CATEGORY TABS
      ========================== */}

      <div className="article-tabs">

        <button
          className={activeCategory === "All" ? "active" : ""}
          onClick={() => setActiveCategory("All")}
        >
          ✨ All
        </button>

        <button
          className={
            activeCategory === "Menstrual Health"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveCategory("Menstrual Health")
          }
        >
          🌸 Menstrual Health
        </button>

        <button
          className={
            activeCategory === "Mental Wellness"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveCategory("Mental Wellness")
          }
        >
          🧠 Mental Wellness
        </button>

      </div>


      {/* =========================
          ARTICLE SECTION
      ========================== */}

      <section className="articles-section">

        <div className="articles-section-header">

          <div>

            <span>EXPLORE</span>

            <h2>
              {activeCategory === "All"
                ? "Wellness Articles"
                : activeCategory}
            </h2>

          </div>

          <p>
            {filteredArticles.length} article
            {filteredArticles.length !== 1 ? "s" : ""}
          </p>

        </div>


        {/* LOADING */}

        {loading && (
          <div className="articles-loading">
            Loading articles... 🌸
          </div>
        )}


        {/* NO RESULTS */}

        {!loading && filteredArticles.length === 0 && (

          <div className="no-articles">

            <div>🔎</div>

            <h3>No articles found</h3>

            <p>
              Try searching with another keyword.
            </p>

          </div>

        )}


        {/* =========================
            ARTICLE CARDS
        ========================== */}

        {!loading && filteredArticles.length > 0 && (

          <div className="articles-grid">

            {filteredArticles.map((article) => {

              const liked =
                interactions[article.id]?.liked || false;

              const saved =
                interactions[article.id]?.saved || false;

              return (

                <article
                  className="article-card"
                  key={article.id}
                >

                  {/* TOP */}

                  <div className="article-card-top">

                    <div className="article-icon">

                      {article.category === "Menstrual Health"
                        ? "🌸"
                        : "🧠"}

                    </div>

                    <span className="article-tag">
                      {article.tag}
                    </span>

                  </div>


                  {/* CONTENT */}

                  <div className="article-card-content">

                    <h3>
                      {article.title}
                    </h3>

                    <p>
                      {article.description}
                    </p>

                  </div>


                  {/* FOOTER */}

                  <div className="article-card-footer">

                    <span className="article-source">
                      Source: {article.source}
                    </span>


                    {/* ACTION BUTTONS */}

                    <div className="article-actions">

                      {/* LIKE */}

                      <button
                        className={`article-action-btn ${
                          liked ? "liked" : ""
                        }`}
                        onClick={() =>
                          handleLike(article.id)
                        }
                        title={
                          liked
                            ? "Unlike article"
                            : "Like article"
                        }
                      >
                        {liked ? "❤️" : "🤍"}
                      </button>


                      {/* SAVE */}

                      <button
                        className={`article-action-btn ${
                          saved ? "saved" : ""
                        }`}
                        onClick={() =>
                          handleSave(article.id)
                        }
                        title={
                          saved
                            ? "Remove from saved"
                            : "Save article"
                        }
                      >
                        {saved ? "🔖" : "📑"}
                      </button>


                      {/* READ */}

                      <a
                        href={article.article_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="read-article-btn"
                      >
                        Read Full Article
                        <span>→</span>
                      </a>

                    </div>

                  </div>

                </article>

              );

            })}

          </div>

        )}

      </section>

    </div>
  );
}