export default function BeforeAfter({ mode, originalInput, detectedText, rewritten }) {
  const screenshotOriginal =
    detectedText && detectedText !== "Visible text could not be reliably extracted in fallback mode."
      ? detectedText
      : "No reliable text was extracted from the screenshot, so focus on the rewrite and issue list.";

  return (
    <section className="card">
      <h3 className="section-title">Before / After</h3>
      <div className="comparison-grid">
        <article className="comparison-pane">
          <div className="split-label">
            {mode === "screenshot" ? "Screenshot content / detected text" : "Original text"}
          </div>
          <pre>{mode === "screenshot" ? screenshotOriginal : originalInput || "No original text provided."}</pre>
        </article>

        <article className="comparison-pane">
          <div className="split-label">Uncringed version</div>
          <pre>{rewritten}</pre>
        </article>
      </div>
    </section>
  );
}
