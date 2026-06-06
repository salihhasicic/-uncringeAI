import { useEffect, useState } from "react";
import AnalyzerTabs from "./components/AnalyzerTabs";
import ApiKeyPanel from "./components/ApiKeyPanel";
import Header from "./components/Header";
import LoadingState from "./components/LoadingState";
import ResultDashboard from "./components/ResultDashboard";
import ScreenshotAnalyzer from "./components/ScreenshotAnalyzer";
import TextAnalyzer from "./components/TextAnalyzer";
import { fallbackResultByMode } from "./utils/fallbackResult";

const CUSTOM_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
const OPENAI_KEY_STORAGE_KEY = "uncringeai.openaiApiKey";

function getApiUrl(endpoint) {
  if (CUSTOM_API_BASE_URL) {
    return `${CUSTOM_API_BASE_URL}/api/${endpoint}`;
  }

  if (import.meta.env.DEV) {
    return `http://localhost:3001/api/${endpoint}`;
  }

  return `/api/${endpoint}`;
}

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(OPENAI_KEY_STORAGE_KEY) || "");
  const [mode, setMode] = useState("text");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [lastInput, setLastInput] = useState("");

  useEffect(() => {
    const cleanApiKey = apiKey.trim();

    if (!cleanApiKey) {
      localStorage.removeItem(OPENAI_KEY_STORAGE_KEY);
      return;
    }

    localStorage.setItem(OPENAI_KEY_STORAGE_KEY, cleanApiKey);
  }, [apiKey]);

  const panelTitle = isLoading
    ? "Running the cringe diagnostics"
    : result
      ? result.mode === "screenshot"
        ? "Screenshot verdict"
        : "Text verdict"
      : "Results appear here";

  function getRequiredApiKey() {
    const cleanApiKey = apiKey.trim();

    if (!cleanApiKey) {
      setError("Please enter your OpenAI API key first.");
      setNotice("");
      return null;
    }

    return cleanApiKey;
  }

  function buildApiHeaders(cleanApiKey, headers = {}) {
    return {
      ...headers,
      "x-openai-api-key": cleanApiKey
    };
  }

  async function handleTextAnalyze({ text, context, tone }) {
    const cleanApiKey = getRequiredApiKey();
    if (!cleanApiKey) {
      return;
    }

    setIsLoading(true);
    setError("");
    setNotice("");
    setLastInput(text);

    try {
      const response = await fetch(getApiUrl("analyze-text"), {
        method: "POST",
        headers: buildApiHeaders(cleanApiKey, {
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ text, context, tone })
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Text analysis failed.");
        setResult(null);
        return;
      }

      setResult({
        ...payload,
        originalInput: text
      });

      if (payload.fallback) {
        setNotice("AI analysis is currently unavailable. Showing demo fallback result.");
      }
    } catch (requestError) {
      setNotice("AI analysis is currently unavailable. Showing demo fallback result.");
      setError(requestError.message || "We could not analyze that text right now.");
      setResult({
        ...fallbackResultByMode.text,
        originalInput: text,
        fallback: true
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleScreenshotAnalyze({ image, context, goal }) {
    const cleanApiKey = getRequiredApiKey();
    if (!cleanApiKey) {
      return;
    }

    setIsLoading(true);
    setError("");
    setNotice("");
    setLastInput("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("context", context);
      if (goal) {
        formData.append("goal", goal);
      }

      const response = await fetch(getApiUrl("analyze-screenshot"), {
        method: "POST",
        headers: buildApiHeaders(cleanApiKey),
        body: formData
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || "Screenshot analysis failed.");
        setResult(null);
        return;
      }

      setResult(payload);

      if (payload.fallback) {
        setNotice("AI analysis is currently unavailable. Showing demo fallback result.");
      }
    } catch (requestError) {
      setNotice("AI analysis is currently unavailable. Showing demo fallback result.");
      setError(requestError.message || "We could not analyze that screenshot right now.");
      setResult({
        ...fallbackResultByMode.screenshot,
        fallback: true
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="page">
        <Header />

        <section className="workspace">
          <div className="workspace-panel input-panel">
            <ApiKeyPanel
              apiKey={apiKey}
              onChange={setApiKey}
              onClear={() => setApiKey("")}
            />

            <AnalyzerTabs mode={mode} onChange={setMode} />

            {mode === "text" ? (
              <TextAnalyzer onAnalyze={handleTextAnalyze} disabled={isLoading} />
            ) : (
              <ScreenshotAnalyzer onAnalyze={handleScreenshotAnalyze} disabled={isLoading} />
            )}
          </div>

          <div className="workspace-panel result-panel">
            <div className="panel-heading">
              <p className="eyebrow">Analysis Output</p>
              <h2>{panelTitle}</h2>
              <p className="panel-copy">
                Scores, problem spots, and the less-cringe version all land here.
              </p>
            </div>

            {notice ? <div className="notice-banner">{notice}</div> : null}
            {error ? <div className="error-banner">{error}</div> : null}

            {isLoading ? (
              <LoadingState mode={mode} />
            ) : (
              <ResultDashboard result={result} mode={mode} originalInput={lastInput} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
