import {
  analyzeTextInput,
  getErrorMessage,
  getErrorStatus
} from "../../server/analysis.js";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });
}

export default async function handler(request) {
  try {
    const body = await request.json();
    const result = await analyzeTextInput({
      ...(body ?? {}),
      apiKey: request.headers.get("x-openai-api-key")
    });
    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ error: getErrorMessage(error) }, getErrorStatus(error));
  }
}

export const config = {
  path: "/api/analyze-text"
};
