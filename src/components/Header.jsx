export default function Header() {
  return (
    <header className="header-card">
      <div className="logo-mark">U</div>

      <div className="header-copy">
        <p className="eyebrow">Detect cringe. Rewrite human.</p>
        <h1>UncringeAI</h1>
        <p>
          Analyze your text or screenshot before you post it. Get a cringe score,
          clear diagnosis, and a more human rewrite using your own OpenAI API key.
        </p>
      </div>

      <div className="header-pill">
        <strong>Bring your own key</strong>
        <span>Each visitor enters their own OpenAI key, so usage and billing stay with that user.</span>
      </div>
    </header>
  );
}
