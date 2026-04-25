import { getStore } from "@netlify/blobs";

const STORE_NAME = "songjeong-uri-workspace";
const STATE_KEY = "current-state";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const toJson = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {})
    }
  });

export default async function handler(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  const store = getStore(STORE_NAME);

  if (request.method === "GET") {
    const record = await store.get(STATE_KEY, {
      type: "json",
      consistency: "strong"
    });

    return toJson(
      record || {
        data: null,
        updatedAt: null
      }
    );
  }

  if (request.method === "PUT") {
    let payload;

    try {
      payload = await request.json();
    } catch {
      return toJson({ error: "JSON 형식이 올바르지 않습니다." }, { status: 400 });
    }

    if (!payload || typeof payload !== "object" || !payload.data) {
      return toJson({ error: "저장할 데이터가 없습니다." }, { status: 400 });
    }

    const record = {
      data: payload.data,
      updatedAt: new Date().toISOString(),
      clientId: payload.clientId || "unknown"
    };

    await store.setJSON(STATE_KEY, record);
    return toJson({ ok: true, updatedAt: record.updatedAt });
  }

  return toJson({ error: "지원하지 않는 요청입니다." }, { status: 405 });
}
