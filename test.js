// Cloudflare Worker – Daily Category API
const MASTER_DATA = [
  { date: "2025-01-01", category: "FRUITS",  words: ["APPLE","BANANA","CHERRY","DATE","FIG"] },
  { date: "2025-01-02", category: "ANIMALS", words: ["LION","TIGER","BEAR","WOLF","FOX"] },
  { date: "2025-12-02", category: "COLORS",  words: ["RED","BLUE","GREEN","YELLOW","PURPLE"] },
  // Add more days...
];

const SECRET_KEY = "yoursupersecretkey12345";   // CHANGE THIS!

export default {
  async fetch(request) {
    const url = new URL(request.url);                     // ← was missing!

    // 1. Check secret key in query string
    if (url.searchParams.get("key") !== SECRET_KEY) {
      return new Response("Forbidden", { status: 403 });
    }

    // 2. Optional: check Origin header (recommended)
    const origin = request.headers.get("origin") || "";
    const allowedOrigins = [
      "https://hint-1fffc2.webflow.io",
      "https://yoursite.com"           // add your custom domain later
    ];
    if (!allowedOrigins.some(o => origin === o)) {
      return new Response("Forbidden", { status: 403 });
    }

    // 3. Find today's entry
    const today = new Date().toISOString().slice(0, 10); // "2025-12-02"
    let todaysEntry = MASTER_DATA.find(e => e.date === today);
    if (!todaysEntry) todaysEntry = MASTER_DATA[0];      // fallback

    // 4. Return valid JSON
    return new Response(JSON.stringify(todaysEntry), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin || "https://hint-1fffc2.webflow.io",
        "Cache-Control": "no-store, no-cache"
      }
    });
  }
};
