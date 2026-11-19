/*
 * Content manifest.
 * Add a new file to `files` (in display order) and it will appear on the site.
 * Each mechanism file calls HM.mechanism({...}); see m1-experience.js for the schema.
 */
HM.boot({
  site: {
    title: "Motivation-centered Framework for Studying Hurricane Evacuation Outcomes",
    kicker: "Research notes · Urban Data Research Lab, UCSB",
    author: "Houpu Li",
    updated: "2026-11-19",
    intro: [
      "Evacuation outcomes are often modeled as a direct response to hazard and demographic variables. This framework instead places **evacuation motivation** at the center: each mechanism describes a source of motivation, the mediators through which it acts, the metrics that measure it, and the evidence for its direction.",
      "Select a mechanism in the overview to unfold its structure, then select any node to inspect its hypotheses, metric construction, evidence and data sources."
    ]
  },
  files: [
    "content/references.js",
    "content/m1-experience.js",
    "content/m2-property.js",
    "content/m3-emotion.js",
    "content/m4-risk.js",
    "content/m5-social.js",
    "content/m6-other.js"
  ]
});
