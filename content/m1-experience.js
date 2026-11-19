/*
 * Mechanism schema (all fields except id/code/title are optional):
 *
 * HM.mechanism({
 *   id: "m1",                       // used in the URL: #/m/m1
 *   code: "M1",
 *   title: "...", short: "...",      // short = label in the navigation / figure
 *   status: "mixed",                 // "consistent" | "mixed" | "in-progress"
 *   question: "...",
 *   summary: ["paragraph with [@key] citations and **bold**", ...],
 *   notes: ["open issue", ...],      // shown as an "Open notes" box
 *   dimensions: [{
 *     name: "...",
 *     intro: { dir, chain, evidence },             // optional dimension-level hypothesis
 *     pathways: [{
 *       id: "1.1", title: "...",
 *       metrics: [{ name, measure, source: ["acs"], sign: "+" | "-" | "?" }],
 *       chains:  [{ dir: "pos" | "neg" | "ns", chain: "a(+) → b(+) → c(-)", evidence: "..." }],
 *       evidence: "...",              // evidence not tied to a single chain
 *       table: { columns: [...], rows: [[...], ...] },
 *       note: "..."
 *     }]
 *   }]
 * });
 */
HM.mechanism({
  id: "m1",
  code: "M1",
  title: "Hurricane Experience-driven Motivation",
  short: "Hurricane experience",
  status: "mixed",
  question: "Is there any real influence of hurricane experience on evacuation outcomes?",
  summary: [
    "Overall, more hurricane experience is associated with lower evacuation outcomes. [@pham2020] studied Hurricane Matthew and found that the evacuation rate of households with hurricane experience was half that of households without it.",
    "However, [@huang2016] summarized 21 studies in a meta-analysis and found that the correlation between hurricane experience and evacuation outcomes is not stable. To understand why, hurricane experience can be **decomposed into mediators** that may influence evacuation outcomes."
  ],
  notes: [
    "Metrics and data sources for the M1 pathways are not yet specified.",
    "Pathway 1.3: the chain includes “trust in government(−)”, while the cited evidence (Lazo 2015) indicates that having an evacuation plan increases the intention to evacuate. Check the chain direction."
  ],
  dimensions: [
    {
      name: "Mediators of hurricane experience",
      pathways: [
        {
          id: "1.1",
          title: "Hurricane experience → house preparation → evacuation motivation",
          chains: [
            {
              dir: "neg",
              chain: "hurricane experience(+) → house preparation(+) → evacuation motivation(-)",
              evidence: "[@peacock2003] used survey data to show that **more hurricane experience** is associated with **more motivation to prepare the house** to mitigate damage, such as shutters and envelope coverage. [@hasan2012] studied three hurricanes using survey data and found that households with **window protection measures** (storm shutters, metal panels, or plywood sheets) are **less likely to evacuate** than households without protection measures."
            },
            {
              dir: "ns",
              chain: "hurricane experience(+) → house preparation(?) → evacuation motivation(?)",
              evidence: "[@rincon2001] surveyed people who experienced Hurricane Andrew and found **no significant correlation between hurricane experience and house preparation**. They also found that fewer people evacuate to government shelters because of bad prior experiences, especially families with children under 13."
            }
          ]
        },
        {
          id: "1.2",
          title: "Hurricane experience → repeated false alarms (cry-wolf effect) → trust in government → evacuation motivation",
          chains: [
            {
              dir: "neg",
              chain: "hurricane experience(+) → repeated false alarms(+) → trust in government(-) → evacuation motivation(-)",
              evidence: "[@rigos2019] found that previous **false alarms** may **decrease the authority’s credibility** and decrease evacuation motivation."
            },
            {
              dir: "ns",
              chain: "hurricane experience(+) → repeated false alarms(+) → trust in government(?) → evacuation motivation(?)",
              evidence: "[@huang2016] and [@cryingwolf2015] found that previous **“unnecessary” evacuations (“false alarms”) have no effect on hurricane evacuation decisions**. One potential reason is that hurricanes do not threaten people frequently enough to decrease the authority’s credibility."
            }
          ]
        },
        {
          id: "1.3",
          title: "Hurricane experience → family evacuation plan → evacuation motivation",
          chains: [
            {
              dir: "neg",
              chain: "hurricane experience(+) → family evacuation plan(+) → trust in government(-) → evacuation motivation(-)",
              evidence: "[@halim2021] and [@horney2008] found that families with **past hurricane experience** prefer to make a **household evacuation plan** in advance, and [@lazo2015] reports that respondents who have previously developed an **evacuation plan are more likely to intend to evacuate**."
            }
          ]
        },
        {
          id: "1.4",
          title: "Hurricane experience → survival / optimistic bias → evacuation motivation",
          chains: [
            {
              dir: "neg",
              chain: "hurricane experience(+) → survival experience bias / optimistic bias(+) → evacuation motivation(-)",
              evidence: "[@dillon2011] and [@eisenman2007] found that people who experienced a past hurricane with **less property damage tend to underestimate the likelihood of damage** in a future hurricane, even if their prior outcome was due to luck rather than any action they took. [@kates1962] referred to these people as “prisoners of experience”."
            }
          ]
        }
      ]
    }
  ]
});
