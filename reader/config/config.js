const base_api_url =
  process.env.NODE_ENV === "production"
    ? "https://e-news-dkp7.onrender.com"
    : "http://localhost:5000";

export { base_api_url };
