import BeforeAfter from "./BeforeAfter";
import MetricsGrid from "./MetricsGrid";

function IssueList({ title, items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="card">
      <h3 className="section-title">{title}</h3>
      <div className="issues-list">
        {items.map((item, index) => (
          <article key={`${item.label}-${index}`} className="issue-item">
            <h4>{item.label}</h4>
            <p>{item.explanation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PhraseList({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <section className="card">
      <h3 className="section-title">Problematic Phrases</h3>
      <div className="phrase-grid">
        {items.map((item, index) => (
          <article key={`${item.phrase}-${index}`} className="phrase-card">
            <strong>{item.phrase}</strong>
            <p>
              <span className="split-label">Why it feels cringe</span>
              {item.whyItFeelsCringe}
            </p>
            <p>
              <span className="split-label">Better alternative</span>
              {item.betterAlternative}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function RewriteVersions({ result }) {
  return (
    <section className="card">
      <h3 className="section-title">Rewrite Versions</h3>
      <div className="rewrite-grid">
        <article className="rewrite-card">
          <h4>Uncringed Version</h4>
          <pre>{result.uncringedVersion}</pre>
        </article>
        <article className="rewrite-card">
          <h4>Direct Version</h4>
          <pre>{result.directVersion}</pre>
        </article>
        <article className="rewrite-card">
          <h4>Soft Version</h4>
          <pre>{result.softVersion}</pre>
        </article>
      </div>
    </section>
  );
}

function AdviceCard({ result }) {
  return (
    <section className="card">
      <h3 className="section-title">Warning / Final Advice</h3>
      <div className="issues-list">
        <article className="issue-item">
          <h4>Do Not Send Warning</h4>
          <p>{result.doNotSendWarning}</p>
        </article>
        <article className="issue-item">
          <h4>Final Advice</h4>
          <p>{result.finalAdvice}</p>
        </article>
      </div>
    </section>
  );
}

function EmptyState({ mode }) {
  return (
    <div className="empty-state">
      <div className="empty-state-inner">
        <p className="eyebrow">Ready when you are</p>
        <h3>{mode === "text" ? "Paste the message you want checked" : "Upload the screenshot you want judged"}</h3>
        <p>
          UncringeAI will score the cringe, flag the weird bits, and rewrite the message
          so it sounds more natural.
        </p>
      </div>
    </div>
  );
}

export default function ResultDashboard({ result, mode, originalInput }) {
  if (!result) {
    return <EmptyState mode={mode} />;
  }

  return (
    <div className="results-stack">
      <section className="hero-score card">
        <div className="score-ring" style={{ "--score": result.cringeScore }}>
          <span>{result.cringeScore}%</span>
        </div>

        <div>
          <div className="badge-row">
            <span className="score-badge">{result.diagnosisBadge}</span>
            <span className="risk-pill">Cringe Score</span>
            <span className="risk-pill">Risk {result.metrics.riskLevel}</span>
          </div>
          <h3 className="section-title">{result.diagnosis}</h3>
          <p>{result.summary}</p>
        </div>
      </section>

      <MetricsGrid metrics={result.metrics} />

      <IssueList title="Main Issues" items={result.mainIssues} />

      {result.mode === "screenshot" ? (
        <>
          <IssueList title="Visual Issues" items={result.visualIssues} />
          <IssueList title="Text Issues From Image" items={result.textIssuesFromImage} />
        </>
      ) : null}

      <PhraseList items={result.problematicPhrases} />

      <BeforeAfter
        mode={result.mode}
        originalInput={originalInput}
        detectedText={result.detectedText}
        rewritten={result.uncringedVersion}
      />

      <section className="card">
        <h3 className="section-title">What You Actually Mean</h3>
        <div className="comparison-pane">
          <pre>{result.whatYouActuallyMean}</pre>
        </div>
      </section>

      <RewriteVersions result={result} />
      <AdviceCard result={result} />
    </div>
  );
}
