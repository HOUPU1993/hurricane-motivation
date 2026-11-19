/*
 * Mechanism schema. A mechanism is a tree: each node can hold children, hypotheses,
 * a metric definition, evidence and context. Node ids are generated from position.
 *
 * HM.mechanism({
 *   id: "m1", code: "M1",
 *   title: "...", short: "...",        // short = label in the flow figure
 *   status: "consistent" | "mixed" | "in-progress",
 *   question: "...",
 *   summary: ["text with [@key] citations and **bold**", ...],
 *   notes: ["open issue", ...],
 *   children: [ node, ... ]
 * });
 *
 * node = {
 *   label: "Short label shown in the tree",
 *   title: "Optional longer title shown in the inspector",
 *   kind: "dimension" | "group" | "mediator" | "metric" | "factor",   // "mediator" is shown as "evidence-backed chain"
 *   open: false,                                   // start collapsed (default: open)
 *   hypotheses: [{ dir: "pos" | "neg" | "ns", chain: "a(+) → b(+) → evacuation motivation(-)", evidence: "..." }],
 *   metric: { name, measure, source: ["acs"], sign: "+" | "-" | "?" },
 *   evidence: "...",                               // evidence not tied to one hypothesis
 *   table: { columns: [...], rows: [[...], ...] },
 *   note: "...",
 *   children: [ node, ... ]
 * }
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
    "Metrics and data sources for the M1 mediators are not yet specified.",
    "Family evacuation plan: the chain includes “trust in government(−)”, while Lazo et al. (2015) indicate that having an evacuation plan increases the intention to evacuate. Check the chain direction."
  ],
  children: [
    {
      label: "House preparation",
      title: "Hurricane experience → house preparation → evacuation motivation",
      kind: "mediator",
      hypotheses: [
        {
          dir: "neg",
          chain: "hurricane experience(+) → house preparation(+) → evacuation motivation(-)",
          evidence: "[@peacock2003] used survey data to show that **more hurricane experience** is associated with **more motivation to prepare the house** to mitigate damage, such as shutters and envelope coverage. [@hasan2012] studied three hurricanes using survey data and found that households with **window protection measures** (storm shutters, metal panels, or plywood sheets) are **less likely to evacuate** than households without protection measures."
        },
        {
          dir: "ns",
          chain: "hurricane experience(+) → house preparation(?) → evacuation motivation(?)",
          evidence: "[@rincon2001] surveyed people who experienced Hurricane Andrew and found **no significant correlation between hurricane experience and house preparation**."
        }
      ]
    },
    {
      label: "False alarms → trust",
      title: "Hurricane experience → repeated false alarms (cry-wolf effect) → trust in government → evacuation motivation",
      kind: "mediator",
      hypotheses: [
        {
          dir: "neg",
          chain: "hurricane experience(+) → repeated false alarms(+) → trust in government(-) → evacuation motivation(-)",
          evidence: "[@rigos2019] found that previous **false alarms** may **decrease the authority’s credibility** and decrease evacuation motivation."
        },
        {
          dir: "ns",
          chain: "hurricane experience(+) → repeated false alarms(+) → trust in government(?) → evacuation motivation(?)",
          evidence: "[@huang2016] and [@dowcutter1998] found that previous **“unnecessary” evacuations (“false alarms”) have no effect on hurricane evacuation decisions**. One potential reason is that hurricanes do not threaten people frequently enough to decrease the authority’s credibility."
        }
      ]
    },
    {
      label: "Family evacuation plan",
      title: "Hurricane experience → family evacuation plan → evacuation motivation",
      kind: "mediator",
      hypotheses: [
        {
          dir: "neg",
          chain: "hurricane experience(+) → family evacuation plan(+) → trust in government(-) → evacuation motivation(-)",
          evidence: "[@halim2021] and [@horney2008] found that families with **past hurricane experience** prefer to make a **household evacuation plan** in advance, and [@lazo2015] reports that respondents who have previously developed an **evacuation plan are more likely to intend to evacuate**."
        }
      ]
    },
    {
      label: "Optimistic bias",
      title: "Hurricane experience → survival experience bias / optimistic bias → evacuation motivation",
      kind: "mediator",
      hypotheses: [
        {
          dir: "neg",
          chain: "hurricane experience(+) → survival experience bias / optimistic bias(+) → evacuation motivation(-)",
          evidence: "[@dillon2011] and [@eisenman2007] found that people who experienced a past hurricane with **less property damage tend to underestimate the likelihood of damage** in a future hurricane, even if their prior outcome was due to luck rather than any action they took. [@kates1962] referred to these people as “prisoners of experience”."
        }
      ]
    }
  ]
});
