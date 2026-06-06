import { useState } from "react";
import { exampleButtons } from "../data/examples";

const contexts = [
  "LinkedIn Post",
  "Dating Bio",
  "Customer Email",
  "Instagram Caption",
  "Startup Pitch",
  "WhatsApp Message",
  "Application Text",
  "University Text"
];

const tones = [
  "Professional",
  "Casual",
  "Direct",
  "Friendly",
  "Less ChatGPT",
  "Confident",
  "Warm"
];

export default function TextAnalyzer({ onAnalyze, disabled }) {
  const [text, setText] = useState("");
  const [context, setContext] = useState(contexts[0]);
  const [tone, setTone] = useState("Less ChatGPT");
  const [error, setError] = useState("");

  const isTooLong = text.length > 4000;
  const charCountLabel = `${text.length}/4000 recommended`;

  function applyExample(value) {
    setText(value);
    setError("");
  }

  function submit(event) {
    event.preventDefault();

    if (!text.trim()) {
      setError("Drop in the text first. We need something to de-cringe.");
      return;
    }

    setError("");
    onAnalyze({
      text: text.trim(),
      context,
      tone
    });
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <div className="section-stack">
        <div className="field-header">
          <label htmlFor="text-input">Text to analyze</label>
          <span className={isTooLong ? "warning-text" : "field-hint"}>{charCountLabel}</span>
        </div>

        <div className="example-row">
          {exampleButtons.map((example) => (
            <button
              key={example.label}
              type="button"
              className="example-button"
              onClick={() => applyExample(example.text)}
            >
              {example.label}
            </button>
          ))}
        </div>

        <div className="field">
          <textarea
            id="text-input"
            placeholder="Paste the message, caption, pitch, email, or post you want checked."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>

        {isTooLong ? (
          <div className="warning-text">
            Longer text still works, but the best results usually come from staying under 4000 characters.
          </div>
        ) : null}

        {error ? <div className="error-text">{error}</div> : null}
      </div>

      <div className="grid-two">
        <div className="field">
          <label htmlFor="context-select">Context</label>
          <select
            id="context-select"
            value={context}
            onChange={(event) => setContext(event.target.value)}
          >
            {contexts.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="tone-select">Rewrite tone</label>
          <select id="tone-select" value={tone} onChange={(event) => setTone(event.target.value)}>
            {tones.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={disabled}>
          Uncringe it
        </button>
      </div>
    </form>
  );
}
