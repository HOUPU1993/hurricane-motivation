HM.mechanism({
  id: "m3",
  code: "M3",
  title: "Emotion-Attachment-Related Motivation",
  short: "Emotional attachment",
  status: "mixed",
  question: "Does emotion-related motivation really exist?",
  summary: [
    "Existing studies suggest that attachment to home and community may influence hurricane evacuation decisions. Longer residential tenure can strengthen emotional attachment through personal memories and familiarity with the local environment [@dimasso2019], and has been associated with lower evacuation likelihood in some studies [@thompson2017].",
    "Regarding community attachment, [@horney2010a] found that stronger neighborhood cohesion was associated with lower evacuation, while [@collins2017] found that residents who stayed reported more dependable social support. Together, these findings suggest that **emotional ties to home and community may contribute to lower evacuation motivation**."
  ],
  children: [
    {
      label: "Attachment to home / community",
      kind: "dimension",
      children: [
        {
          label: "Tenure length",
          kind: "metric",
          metric: { name: "Tenure length", measure: "Years in current residence (ACS B25038, B25039, B07001)", source: ["acs"], sign: "-" },
          hypotheses: [
            {
              dir: "neg",
              chain: "tenure length(+) → personal memory / familiar spatial environment / recognition of local culture and lifestyle → evacuation motivation(-)",
              evidence: "[@dimasso2019] explain how longer residence can foster emotional bonds through memories and everyday routines. [@thomas2016] identify relationships between residential duration and relocation intentions. [@thompson2017] summarize evidence that longer residence is often associated with lower disaster evacuation likelihood, although findings are inconsistent."
            }
          ]
        }
      ]
    },
    {
      label: "Attachment to community",
      kind: "dimension",
      children: [
        {
          label: "Neighborhood cohesion",
          kind: "metric",
          metric: { name: "Neighborhood cohesion", measure: "Residence and monthly mobility location clusters — time-frequency co-present event strength", source: ["gps"], sign: "?" },
          hypotheses: [
            {
              dir: "neg",
              chain: "neighborhood cohesion(+) → dependability of social support(+) → evacuation motivation(-)",
              evidence: "[@horney2010a] found that areas with higher neighborhood cohesion had lower evacuation during Hurricane Isabel. [@collins2017] found that residents who sheltered in place during Hurricane Matthew reported greater perceived dependability of social support."
            },
            {
              dir: "pos",
              chain: "neighborhood cohesion(+) → risk perception(+) → evacuation motivation(+)",
              evidence: "[@sadri2017] found that characteristics of interpersonal social ties, including contact frequency, discussion topics, and geographic proximity, significantly influenced joint evacuation decisions during Hurricane Sandy."
            }
          ]
        }
      ]
    }
  ]
});
