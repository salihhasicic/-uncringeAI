const tabs = [
  { id: "text", label: "Text Analyzer" },
  { id: "screenshot", label: "Screenshot Analyzer" }
];

export default function AnalyzerTabs({ mode, onChange }) {
  return (
    <div className="tab-row" role="tablist" aria-label="Analyzer mode">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={mode === tab.id}
          className={`tab-button ${mode === tab.id ? "active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
