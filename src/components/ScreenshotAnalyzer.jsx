import { useEffect, useState } from "react";
import {
  isNetlifyFunctionUploadLimit,
  maxImageSizeBytes,
  maxImageSizeLabel
} from "../utils/uploadLimits";

const contexts = [
  "LinkedIn Screenshot",
  "Social Media Post",
  "Presentation Slide",
  "Chat Screenshot",
  "Website / Landing Page",
  "Flyer / Poster"
];

export default function ScreenshotAnalyzer({ onAnalyze, disabled }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [context, setContext] = useState(contexts[0]);
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return undefined;
    }

    const nextUrl = URL.createObjectURL(image);
    setPreviewUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [image]);

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0];
    setError("");

    if (!nextFile) {
      setImage(null);
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(nextFile.type)) {
      setError("Use a PNG, JPG, JPEG, or WEBP image.");
      return;
    }

    if (nextFile.size > maxImageSizeBytes) {
      setError(`Keep the image under ${maxImageSizeLabel} so the upload can be analyzed.`);
      return;
    }

    setImage(nextFile);
  }

  function submit(event) {
    event.preventDefault();

    if (!image) {
      setError("Upload a screenshot first, then we can judge it fairly.");
      return;
    }

    setError("");
    onAnalyze({ image, context, goal: goal.trim() });
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <div className="upload-card">
        <div className="field">
          <label htmlFor="image-upload">Screenshot upload</label>
          <input
            id="image-upload"
            type="file"
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
          />
          <div className="field-hint">
            Accepted: PNG, JPG, JPEG, WEBP. Max {maxImageSizeLabel}
            {isNetlifyFunctionUploadLimit ? " on Netlify deploys." : "."}
          </div>
        </div>

        {previewUrl ? (
          <div className="preview-frame">
            <img src={previewUrl} alt="Screenshot preview" />
          </div>
        ) : null}
      </div>

      {error ? <div className="error-text">{error}</div> : null}

      <div className="grid-two">
        <div className="field">
          <label htmlFor="screenshot-context">Context</label>
          <select
            id="screenshot-context"
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
          <label htmlFor="goal-input">What are you trying to achieve?</label>
          <input
            id="goal-input"
            type="text"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder="Optional: clearer CTA, more trust, less try-hard, etc."
          />
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={disabled}>
          Analyze screenshot
        </button>
      </div>
    </form>
  );
}
