import {
  analyzeScreenshotInput,
  getErrorMessage,
  getErrorStatus,
  netlifyUploadLimitBytes,
  validateImageUpload
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
    const formData = await request.formData();
    const image = formData.get("image");
    const context = formData.get("context");
    const goal = formData.get("goal");

    if (!image || typeof image.arrayBuffer !== "function") {
      return jsonResponse({ error: "Please upload an image to analyze." }, 400);
    }

    validateImageUpload({
      mimeType: image.type,
      size: image.size,
      maxSizeBytes: netlifyUploadLimitBytes,
      uploadContext: "Netlify deployment"
    });

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const result = await analyzeScreenshotInput({
      imageBuffer,
      mimeType: image.type,
      size: image.size,
      context: typeof context === "string" ? context : "Screenshot",
      goal: typeof goal === "string" ? goal : "",
      apiKey: request.headers.get("x-openai-api-key")
    });

    return jsonResponse(result);
  } catch (error) {
    return jsonResponse({ error: getErrorMessage(error) }, getErrorStatus(error));
  }
}

export const config = {
  path: "/api/analyze-screenshot"
};
