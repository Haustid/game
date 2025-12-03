// Worker – daily category API
const MASTER_DATA = [                     // ← your full list (one object per day)
  { date: "2025-01-01", category: "FRUITS",        words: ["APPLE","BANANA","CHERRY","DATE","FIG"] },
  { date: "2025-01-02", category: "ANIMALS",       words: ["LION","TIGER","BEAR","WOLF","FOX"] },
  // ... add 1000+ days here or load from KV for huge lists
];

const SECRET_KEY = "yoursupersecretkey12345";   // change this!

export default {
  async fetch(request, env, ctx) {
    // Cloudflare automatically checks Access — if it fails, it returns 403
    const auth = request.headers.get("Cf-Access-Authenticated");
    if (!auth && return new Response("Forbidden", {status: 403});
    
    // Simple but extremely effective protection
    if (url.searchParams.get("key") !== SECRET_KEY) {
      return new Response("Forbidden", { status: 403 });
    }

    // Optional: also check Origin header matches your site
    const origin = request.headers.get("Origin") || "";
    if (!origin.includes("https://hint-1fffc2.webflow.io") && !origin.includes("yoursite.com")) {
      return new Response("Forbidden", { status: 403 });
    }

    const today = new Date().toISOString().slice(0,10);   // "2025-11-30"
    
    const todaysEntry = MASTER_DATA.find(e => e.date === today) 
                     || MASTER_DATA[0];                   // fallback

    return new Response(JSON.stringify(todaysEntry), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://hint-1fffc2.webflow.io",   // or your Webflow domain
        "Cache-Control": "no-store"
      }
    });
  }
};