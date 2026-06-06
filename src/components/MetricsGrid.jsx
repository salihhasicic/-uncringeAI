const metricConfig = [
  {
    key: "chatgptSmell",
    label: "ChatGPT Smell",
    caption: "How strongly the wording feels machine-polished."
  },
  {
    key: "buzzwordDensity",
    label: "Buzzword Density",
    caption: "How much hype language is clogging the signal."
  },
  {
    key: "fakeHumility",
    label: "Fake Humility",
    caption: "How much performative modesty is leaking through."
  },
  {
    key: "corporateRobotLevel",
    label: "Corporate Robot Level",
    caption: "How much this sounds like it escaped a brand deck."
  },
  {
    key: "humanClarity",
    label: "Human Clarity",
    caption: "Higher is better. This is the one you want up."
  }
];

export default function MetricsGrid({ metrics }) {
  return (
    <section className="card">
      <h3 className="section-title">Cringe Metrics</h3>
      <div className="metrics-grid">
        {metricConfig.map((metric) => (
          <article key={metric.key} className="metric-card">
            <div className="metric-head">
              <h4>{metric.label}</h4>
              <span>{metrics[metric.key]}%</span>
            </div>
            <div className="metric-bar">
              <div className="metric-bar-fill" style={{ width: `${metrics[metric.key]}%` }} />
            </div>
            <p className="metric-caption">{metric.caption}</p>
          </article>
        ))}

        <article className="metric-card">
          <div className="metric-head">
            <h4>Risk Level</h4>
            <span>{metrics.riskLevel}</span>
          </div>
          <div className="metric-bar">
            <div
              className="metric-bar-fill"
              style={{
                width:
                  metrics.riskLevel === "High"
                    ? "92%"
                    : metrics.riskLevel === "Medium"
                      ? "64%"
                      : "34%"
              }}
            />
          </div>
          <p className="metric-caption">The odds this lands awkwardly if you post it unchanged.</p>
        </article>
      </div>
    </section>
  );
}
