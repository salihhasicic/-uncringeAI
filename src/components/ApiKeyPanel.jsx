import { useState } from "react";

export default function ApiKeyPanel({ apiKey, onChange, onClear }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="api-key-card">
      <div className="field">
        <div className="field-header">
          <label htmlFor="openai-api-key">Your OpenAI API key</label>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setIsVisible((current) => !current)}
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>

        <input
          id="openai-api-key"
          type={isVisible ? "text" : "password"}
          value={apiKey}
          onChange={(event) => onChange(event.target.value)}
          placeholder="sk-proj-..."
          autoComplete="off"
          spellCheck="false"
        />

        <div className="field-hint">
          Every visitor uses their own key. It stays in this browser and is only sent with
          analysis requests.
        </div>
      </div>

      <div className="button-row">
        <button type="button" className="secondary-button" onClick={onClear} disabled={!apiKey}>
          Clear key
        </button>
      </div>
    </section>
  );
}
