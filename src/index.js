export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle /secure and /secure/
    if (pathname === "/secure" || pathname === "/secure/") {
      const email = request.headers.get("cf-access-authenticated-user-email") || "unknown@example.com";
      const country = request.cf?.country || "XX";
      const timestamp = new Date().toISOString();

      return new Response(`
        <html>
          <body>
            <p>${email} authenticated at ${timestamp} from 
              <a href="/secure/${country}">${country}</a>
            </p>
          </body>
        </html>
      `, {
        headers: { "Content-Type": "text/html" }
      });
    }

    // Handle /secure/{COUNTRY} only if logged in
    // Might be inconsequential given auth, only worry is the binding cookie (CF_Authorization) not being instant sometimes
    const match = pathname.match(/^\/secure\/([A-Z]{2})$/i);
    if (match) {
      const email = request.headers.get("cf-access-authenticated-user-email");
      if (!email) {
        return new Response("Unauthorized", { status: 401 });
      }

      const countryCode = match[1].toUpperCase();
      try {
        const object = await env.COUNTRY_FLAGS.get(`${countryCode}.svg`);
        if (!object || !object.body) {
          return new Response("Flag not found", { status: 404 });
        }

        return new Response(object.body, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "no-store"
          }
        });
      } catch {
        return new Response("Error fetching flag", { status: 500 });
      }
    }

    // Fallback
    return new Response("Not found", { status: 404 });
  }
};
