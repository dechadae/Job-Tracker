import { getStore } from "@netlify/blobs";

const VALID_PAGES = ["graphic", "marcom", "digital", "director"];

export default async (req) => {
  const url = new URL(req.url);
  const page = url.searchParams.get("page");

  if (!page || !VALID_PAGES.includes(page)) {
    return new Response(JSON.stringify({ error: "invalid or missing page" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const store = getStore("job-tracker");

  if (req.method === "GET") {
    const data = await store.get(page, { type: "json" });
    return new Response(JSON.stringify(data || []), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "invalid json body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ error: "expected an array of jobs" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await store.setJSON(page, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = { path: "/api/jobs" };
