const textFallback = {
  mode: "text",
  cringeScore: 72,
  diagnosis: "The text sounds polished enough to trigger a mild authenticity alarm.",
  diagnosisBadge: "ChatGPT Smell",
  summary: "Demo fallback: the wording feels generic, slightly dramatic, and less human than it could be.",
  metrics: {
    chatgptSmell: 82,
    buzzwordDensity: 74,
    fakeHumility: 68,
    corporateRobotLevel: 71,
    humanClarity: 52,
    riskLevel: "High"
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
      phrase: "great humility and endless gratitude",
      whyItFeelsCringe: "It announces sincerity instead of letting the message feel sincere on its own.",
      betterAlternative: "Say what happened plainly and let the feeling come through naturally."
    },
    {
      phrase: "revolutionizing the way",
      whyItFeelsCringe: "Classic hype copy. It raises defenses before trust has a chance to form.",
      betterAlternative: "Describe the practical improvement in one sentence."
    }
  ],
  whatYouActuallyMean: "You want to sound thoughtful and impressive without sounding scripted.",
  uncringedVersion:
    "I'm happy to share this update. It took a lot of work, I learned a lot, and I'm grateful to the people who helped along the way.",
  directVersion:
    "Here's the update: this milestone matters to me, and I'm grateful for the support that helped me reach it.",
  softVersion:
    "I'm really glad to share this moment. It means a lot, and I appreciate everyone who helped me get here.",
  visualIssues: [],
  textIssuesFromImage: [],
  doNotSendWarning: "If the goal is to sound genuine, avoid posting this version unchanged.",
  finalAdvice:
    "Because AI analysis is unavailable, treat this as a demo read. Being more specific and slightly less polished will usually sound more human.",
  detectedText: ""
};

const screenshotFallback = {
  mode: "screenshot",
  cringeScore: 58,
  diagnosis: "The image likely has some signal, but the visual and wording may feel overworked or busy.",
  diagnosisBadge: "Trying Too Hard",
  summary:
    "Demo fallback: this screenshot may be clear enough to function, but it would probably land better with simpler wording and less visual noise.",
  metrics: {
    chatgptSmell: 61,
    buzzwordDensity: 47,
    fakeHumility: 18,
    corporateRobotLevel: 39,
    humanClarity: 63,
    riskLevel: "Medium"
  },
  mainIssues: [
    {
      label: "Overprocessed vibe",
      explanation: "The presentation may be doing a little too much compared with the message."
    },
    {
      label: "Visual competition",
      explanation: "Too many things pulling at attention can make the content feel less confident."
    }
  ],
  problematicPhrases: [
    {
      phrase: "impact-driven visionary copy",
      whyItFeelsCringe: "Big claims in a visual can make the whole thing feel less trustworthy.",
      betterAlternative: "Use a concrete headline and a simpler supporting line."
    }
  ],
  whatYouActuallyMean: "You want this to look credible, clear, and easy to understand at a glance.",
  uncringedVersion:
    "Simplify the layout, keep one main message, and rewrite the visible copy so it sounds specific and calm.",
  directVersion:
    "Reduce clutter, tighten the copy, and make the main point obvious immediately.",
  softVersion:
    "A cleaner layout and more natural wording would make this feel more confident.",
  visualIssues: [
    {
      label: "Potential layout overload",
      explanation: "If the screen contains too many competing elements, the message can feel try-hard instead of polished."
    },
    {
      label: "Style-to-substance imbalance",
      explanation: "Strong visuals with vague copy can create a high-effort, low-trust impression."
    }
  ],
  textIssuesFromImage: [
    {
      label: "Generic visible copy",
      explanation: "Short headline-style text often becomes cliché when it aims for impact without specifics."
    }
  ],
  doNotSendWarning:
    "If this screenshot contains personal or sensitive details, review them manually before sharing.",
  finalAdvice:
    "Because AI analysis is unavailable, treat this as a demo read. Simpler wording and cleaner hierarchy are the safest improvements.",
  detectedText: "Visible text could not be reliably extracted in fallback mode."
};

export const fallbackResultByMode = {
  text: textFallback,
  screenshot: screenshotFallback
};
