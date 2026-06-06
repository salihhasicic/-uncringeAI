import OpenAI from "openai";

export const supportedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp"
];

export const localUploadLimitBytes = 8 * 1024 * 1024;
export const netlifyUploadLimitBytes = Math.floor(4.5 * 1024 * 1024);

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "mode",
    "cringeScore",
    "diagnosis",
    "diagnosisBadge",
    "summary",
    "metrics",
    "mainIssues",
    "problematicPhrases",
    "whatYouActuallyMean",
    "uncringedVersion",
    "directVersion",
    "softVersion",
    "visualIssues",
    "textIssuesFromImage",
    "doNotSendWarning",
    "finalAdvice",
    "detectedText"
  ],
  properties: {
    mode: {
      type: "string",
      enum: ["text", "screenshot"]
    },
    cringeScore: {
      type: "number"
    },
    diagnosis: {
      type: "string"
    },
    diagnosisBadge: {
      type: "string"
    },
    summary: {
      type: "string"
    },
    metrics: {
      type: "object",
      additionalProperties: false,
      required: [
        "chatgptSmell",
        "buzzwordDensity",
        "fakeHumility",
        "corporateRobotLevel",
        "humanClarity",
        "riskLevel"
      ],
      properties: {
        chatgptSmell: { type: "number" },
        buzzwordDensity: { type: "number" },
        fakeHumility: { type: "number" },
        corporateRobotLevel: { type: "number" },
        humanClarity: { type: "number" },
        riskLevel: {
          type: "string",
          enum: ["Low", "Medium", "High"]
        }
      }
    },
    mainIssues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "explanation"],
        properties: {
          label: { type: "string" },
          explanation: { type: "string" }
        }
      }
    },
    problematicPhrases: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["phrase", "whyItFeelsCringe", "betterAlternative"],
        properties: {
          phrase: { type: "string" },
          whyItFeelsCringe: { type: "string" },
          betterAlternative: { type: "string" }
        }
      }
    },
    whatYouActuallyMean: {
      type: "string"
    },
    uncringedVersion: {
      type: "string"
    },
    directVersion: {
      type: "string"
    },
    softVersion: {
      type: "string"
    },
    visualIssues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "explanation"],
        properties: {
          label: { type: "string" },
          explanation: { type: "string" }
        }
      }
    },
    textIssuesFromImage: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "explanation"],
        properties: {
          label: { type: "string" },
          explanation: { type: "string" }
        }
      }
    },
    doNotSendWarning: {
      type: "string"
    },
    finalAdvice: {
      type: "string"
    },
    detectedText: {
      type: "string"
    }
  }
};

let cachedApiKey = null;
let cachedClient = null;

function getClient(apiKey) {
  if (!apiKey) {
    throw createHttpError("Please enter your OpenAI API key to run the analysis.");
  }

  if (cachedClient && cachedApiKey === apiKey) {
    return cachedClient;
  }

  cachedApiKey = apiKey;
  cachedClient = new OpenAI({ apiKey });
  return cachedClient;
}

function createHttpError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function clampNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function normalizeRiskLevel(value) {
  if (value === "Low" || value === "Medium" || value === "High") {
    return value;
  }
  return "Medium";
}

function safeString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function normalizeApiKey(apiKey) {
  return safeString(apiKey);
}

function requireApiKey(apiKey) {
  const cleanApiKey = normalizeApiKey(apiKey);

  if (!cleanApiKey) {
    throw createHttpError("Please enter your OpenAI API key to run the analysis.");
  }

  if (!cleanApiKey.startsWith("sk-")) {
    throw createHttpError("That does not look like a valid OpenAI API key. It should start with sk-.");
  }

  return cleanApiKey;
}

function normalizeIssueList(list) {
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .map((item) => ({
      label: safeString(item?.label, "Needs work"),
      explanation: safeString(item?.explanation, "The model did not provide details.")
    }))
    .slice(0, 6);
}

function normalizePhrases(list) {
  if (!Array.isArray(list)) {
    return [];
  }
  return list
    .map((item) => ({
      phrase: safeString(item?.phrase, "Not provided"),
      whyItFeelsCringe: safeString(
        item?.whyItFeelsCringe,
        "The phrasing feels a bit too polished or unnatural."
      ),
      betterAlternative: safeString(
        item?.betterAlternative,
        "Try saying it more directly and specifically."
      )
    }))
    .slice(0, 6);
}

export function createFallbackResult(mode, context, originalInput = "") {
  const isScreenshot = mode === "screenshot";
  const sourceText = safeString(originalInput);

  return {
    mode,
    cringeScore: isScreenshot ? 58 : 72,
    diagnosis: isScreenshot
      ? "The image likely has some signal, but the visual and wording may feel overworked or busy."
      : "The text sounds polished enough to trigger a mild authenticity alarm.",
    diagnosisBadge: isScreenshot ? "Trying Too Hard" : "ChatGPT Smell",
    summary: isScreenshot
      ? "Demo fallback: this screenshot may be clear enough to function, but it would probably land better with simpler wording and less visual noise."
      : "Demo fallback: the wording feels generic, slightly dramatic, and less human than it could be.",
    metrics: {
      chatgptSmell: isScreenshot ? 61 : 82,
      buzzwordDensity: isScreenshot ? 47 : 74,
      fakeHumility: isScreenshot ? 18 : 68,
      corporateRobotLevel: isScreenshot ? 39 : 71,
      humanClarity: isScreenshot ? 63 : 52,
      riskLevel: isScreenshot ? "Medium" : "High"
    },
    mainIssues: [
      {
        label: "Overprocessed vibe",
        explanation: "It reads like it was optimized for impression before clarity."
      },
      {
        label: "Low specificity",
        explanation: "There are not enough concrete details to make the message feel grounded."
      },
      {
        label: "Emotional oversteer",
        explanation: "The tone reaches for significance a little faster than the content earns it."
      }
    ],
    problematicPhrases: [
      {
        phrase: safeString(sourceText.split(/[.!?\n]/)[0], "Great humility and endless gratitude"),
        whyItFeelsCringe: "It announces sincerity instead of letting the message feel sincere on its own.",
        betterAlternative: "Keep the emotion, but say what happened in plain language."
      },
      {
        phrase: "revolutionizing the way",
        whyItFeelsCringe: "This is classic hype language and usually lowers trust.",
        betterAlternative: "Explain the actual improvement in one concrete sentence."
      }
    ],
    whatYouActuallyMean: isScreenshot
      ? "You want this to look credible, clear, and easy to understand at a glance."
      : "You want to sound thoughtful and impressive without sounding scripted.",
    uncringedVersion: isScreenshot
      ? "Simplify the layout, keep one main message, and rewrite the visible copy so it sounds specific and calm."
      : "I'm happy to share this update. It took a lot of work, I learned a lot, and I'm grateful to the people who helped along the way.",
    directVersion: isScreenshot
      ? "Reduce clutter, tighten the copy, and make the main point obvious immediately."
      : "Here's the update: this milestone matters to me, and I'm grateful for the support that helped me reach it.",
    softVersion: isScreenshot
      ? "A cleaner layout and more natural wording would make this feel more confident."
      : "I'm really glad to share this moment. It means a lot, and I appreciate everyone who helped me get here.",
    visualIssues: isScreenshot
      ? [
          {
            label: "Potential layout overload",
            explanation: "If the screen contains too many competing elements, the message can feel try-hard instead of polished."
          },
          {
            label: "Style-to-substance imbalance",
            explanation: "Strong visuals with vague copy can create a high-effort, low-trust impression."
          }
        ]
      : [],
    textIssuesFromImage: isScreenshot
      ? [
          {
            label: "Generic visible copy",
            explanation: "Short headline-style text often becomes cliche when it aims for impact without specifics."
          }
        ]
      : [],
    doNotSendWarning: isScreenshot
      ? "If this screenshot contains personal or sensitive details, review them manually before sharing."
      : "If the goal is to sound genuine, avoid posting this version unchanged.",
    finalAdvice: isScreenshot
      ? `Because AI analysis is unavailable, treat this as a demo read. For ${context || "this context"}, simpler wording and cleaner hierarchy are the safest improvements.`
      : `Because AI analysis is unavailable, treat this as a demo read. For ${context || "this context"}, being more specific and slightly less polished will usually sound more human.`,
    detectedText: isScreenshot
      ? "Visible text could not be reliably extracted in fallback mode."
      : sourceText,
    fallback: true
  };
}

function extractJsonFromContent(content) {
  if (!content) {
    throw new Error("OpenAI returned empty content.");
  }

  const trimmed = content.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  return JSON.parse(withoutFence);
}

function normalizeResult(rawResult, mode, context, originalInput = "") {
  const fallback = createFallbackResult(mode, context, originalInput);
  const raw = rawResult && typeof rawResult === "object" ? rawResult : {};

  return {
    mode,
    cringeScore: clampNumber(raw.cringeScore, fallback.cringeScore),
    diagnosis: safeString(raw.diagnosis, fallback.diagnosis),
    diagnosisBadge: safeString(raw.diagnosisBadge, fallback.diagnosisBadge),
    summary: safeString(raw.summary, fallback.summary),
    metrics: {
      chatgptSmell: clampNumber(raw.metrics?.chatgptSmell, fallback.metrics.chatgptSmell),
      buzzwordDensity: clampNumber(raw.metrics?.buzzwordDensity, fallback.metrics.buzzwordDensity),
      fakeHumility: clampNumber(raw.metrics?.fakeHumility, fallback.metrics.fakeHumility),
      corporateRobotLevel: clampNumber(
        raw.metrics?.corporateRobotLevel,
        fallback.metrics.corporateRobotLevel
      ),
      humanClarity: clampNumber(raw.metrics?.humanClarity, fallback.metrics.humanClarity),
      riskLevel: normalizeRiskLevel(raw.metrics?.riskLevel)
    },
    mainIssues: normalizeIssueList(raw.mainIssues).length
      ? normalizeIssueList(raw.mainIssues)
      : fallback.mainIssues,
    problematicPhrases: normalizePhrases(raw.problematicPhrases).length
      ? normalizePhrases(raw.problematicPhrases)
      : fallback.problematicPhrases,
    whatYouActuallyMean: safeString(raw.whatYouActuallyMean, fallback.whatYouActuallyMean),
    uncringedVersion: safeString(raw.uncringedVersion, fallback.uncringedVersion),
    directVersion: safeString(raw.directVersion, fallback.directVersion),
    softVersion: safeString(raw.softVersion, fallback.softVersion),
    visualIssues: normalizeIssueList(raw.visualIssues),
    textIssuesFromImage: normalizeIssueList(raw.textIssuesFromImage),
    doNotSendWarning: safeString(raw.doNotSendWarning, fallback.doNotSendWarning),
    finalAdvice: safeString(raw.finalAdvice, fallback.finalAdvice),
    detectedText: safeString(
      raw.detectedText,
      mode === "screenshot" ? fallback.detectedText : safeString(originalInput)
    ),
    fallback: false
  };
}

function buildTextMessages(text, context, tone) {
  return [
    {
      role: "system",
      content: `
You are UncringeAI, a witty but fair communication analyst.
Analyze the user's text in context and rewrite it to sound more natural, specific, and human.
Be sharp, but never insulting or personal.
Focus on the effect of the wording, not on the person.
Always return valid JSON matching the schema exactly.
Rules:
- cringeScore and all numeric metrics must be 0 to 100
- humanClarity is higher when the text is better
- riskLevel must be Low, Medium, or High
- diagnosisBadge must be short, witty, and safe
- Include concrete, useful rewrites
- Keep the tone clear, useful, and premium
- If the text is already fine, say so honestly
      `.trim()
    },
    {
      role: "user",
      content: `
Analyze this text for cringe risk.

Context: ${context}
Requested tone for rewrite: ${tone}

Text:
${text}

Return only JSON.
      `.trim()
    }
  ];
}

function buildScreenshotMessages(context, goal, imageDataUrl) {
  return [
    {
      role: "system",
      content: `
You are UncringeAI, a witty but fair multimodal communication analyst.
Analyze screenshots for visible text, tone, visual impression, layout, overload, awkwardness, and cringe signals.
If text is visible, capture only a concise, non-sensitive summary or partial transcription in detectedText.
Do not repeat private personal information, account details, or anything sensitive from the image.
If the image is unclear, say the analysis is limited.
Always return valid JSON matching the schema exactly.
Rules:
- cringeScore and all numeric metrics must be 0 to 100
- humanClarity is higher when the screenshot communicates better
- riskLevel must be Low, Medium, or High
- diagnosisBadge must be short, witty, and safe
- visualIssues and textIssuesFromImage should be specific when possible
- Use uncringedVersion/directVersion/softVersion for better copy or improvement guidance
      `.trim()
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `
Analyze this screenshot.

Context: ${context}
Goal: ${goal || "Not provided"}

Return only JSON.
          `.trim()
        },
        {
          type: "image_url",
          image_url: {
            url: imageDataUrl
          }
        }
      ]
    }
  ];
}

async function runOpenAiAnalysis({ apiKey, mode, messages, context, originalInput }) {
  const client = getClient(apiKey);

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "uncringe_analysis",
        strict: true,
        schema: analysisSchema
      }
    },
    messages
  });

  const content = completion.choices?.[0]?.message?.content;
  const parsed = extractJsonFromContent(content);
  return normalizeResult(parsed, mode, context, originalInput);
}

function toOpenAiHttpError(error) {
  const statusCode = Number(error?.status) || Number(error?.statusCode) || 500;

  if (statusCode === 401 || statusCode === 403) {
    return createHttpError(
      "This OpenAI API key was rejected. Please check the key and try again.",
      401
    );
  }

  if (statusCode === 429) {
    return createHttpError(
      "This OpenAI API key has hit a rate limit or quota limit. Please check billing and usage, then try again.",
      429
    );
  }

  if (statusCode >= 400 && statusCode < 500) {
    return createHttpError(
      "OpenAI could not process this request with the provided API key.",
      statusCode
    );
  }

  return null;
}

export function createHealthResponse() {
  return {
    ok: true,
    requiresUserApiKey: true
  };
}

export async function analyzeTextInput({
  text,
  context = "General Text",
  tone = "Less ChatGPT",
  apiKey
}) {
  const cleanText = safeString(text);
  const cleanContext = safeString(context, "General Text");
  const cleanTone = safeString(tone, "Less ChatGPT");
  const cleanApiKey = requireApiKey(apiKey);

  if (!cleanText) {
    throw createHttpError("Please add some text to analyze.");
  }

  try {
    return await runOpenAiAnalysis({
      apiKey: cleanApiKey,
      mode: "text",
      messages: buildTextMessages(cleanText, cleanContext, cleanTone),
      context: cleanContext,
      originalInput: cleanText
    });
  } catch (error) {
    const apiError = toOpenAiHttpError(error);
    if (apiError) {
      throw apiError;
    }

    console.error("Text analysis failed:", error);
    return createFallbackResult("text", cleanContext, cleanText);
  }
}

export function validateImageUpload({
  mimeType,
  size,
  maxSizeBytes = localUploadLimitBytes,
  uploadContext = "upload"
}) {
  if (!supportedMimeTypes.includes(mimeType)) {
    throw createHttpError("Unsupported file type. Use PNG, JPG, JPEG, or WEBP.");
  }

  if (!Number.isFinite(size) || size <= 0) {
    throw createHttpError(`Please upload a valid image for ${uploadContext}.`);
  }

  if (size > maxSizeBytes) {
    const sizeInMb = maxSizeBytes === netlifyUploadLimitBytes ? "4.5MB" : "8MB";
    throw createHttpError(`Image is too large. Please use a file under ${sizeInMb}.`);
  }
}

export async function analyzeScreenshotInput({
  imageBuffer,
  mimeType,
  size,
  context = "Screenshot",
  goal = "",
  apiKey
}) {
  const cleanContext = safeString(context, "Screenshot");
  const cleanGoal = safeString(goal);
  const cleanApiKey = requireApiKey(apiKey);

  if (!imageBuffer) {
    throw createHttpError("Please upload an image to analyze.");
  }

  validateImageUpload({ mimeType, size, maxSizeBytes: localUploadLimitBytes, uploadContext: "analysis" });

  try {
    const base64 = Buffer.from(imageBuffer).toString("base64");
    const imageDataUrl = `data:${mimeType};base64,${base64}`;

    return await runOpenAiAnalysis({
      apiKey: cleanApiKey,
      mode: "screenshot",
      messages: buildScreenshotMessages(cleanContext, cleanGoal, imageDataUrl),
      context: cleanContext,
      originalInput: ""
    });
  } catch (error) {
    const apiError = toOpenAiHttpError(error);
    if (apiError) {
      throw apiError;
    }

    console.error("Screenshot analysis failed:", error);
    return createFallbackResult("screenshot", cleanContext);
  }
}

export function getErrorStatus(error) {
  return error?.statusCode || 500;
}

export function getErrorMessage(error) {
  return error?.message || "Something went wrong on the server.";
}
