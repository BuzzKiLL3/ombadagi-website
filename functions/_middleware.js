// Markdown for agents: requests that prefer text/markdown get /index.md for the homepage.
// Browsers (Accept: text/html) keep getting HTML.
function wantsMarkdown(accept) {
  if (!accept) return false;
  let md = -1, html = -1;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().toLowerCase().split(";");
    const qp = params.find(p => p.trim().startsWith("q="));
    const q = qp ? parseFloat(qp.split("=")[1]) : 1;
    if (type === "text/markdown") md = Math.max(md, q);
    if (type === "text/html") html = Math.max(html, q);
  }
  return md > 0 && md >= html;
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);
  const isPage = url.pathname === "/" || url.pathname === "/index.html";

  if (isPage && (request.method === "GET" || request.method === "HEAD") &&
      wantsMarkdown(request.headers.get("Accept"))) {
    const asset = await env.ASSETS.fetch(new URL("/index.md", url.origin));
    if (asset.ok) {
      const body = await asset.text();
      const tokens = Math.ceil(body.length / 4);
      return new Response(request.method === "HEAD" ? null : body, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "x-markdown-tokens": String(tokens),
          "Vary": "Accept",
          "Cache-Control": "public, max-age=300",
          "Link": '</.well-known/api-catalog>; rel="api-catalog"',
          "X-Content-Type-Options": "nosniff"
        }
      });
    }
  }

  const res = await next();
  if (isPage) {
    const out = new Response(res.body, res);
    out.headers.append("Vary", "Accept");
    return out;
  }
  return res;
}
