import { createHealthResponse } from "../../server/analysis.js";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
}

export default async function handler() {
  return jsonResponse(createHealthResponse());
}

export const config = {
  path: "/api/health"
};
