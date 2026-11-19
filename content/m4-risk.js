HM.mechanism({
  id: "m4",
  code: "M4",
  title: "Self-Risk Assessment Motivation",
  short: "Risk assessment",
  status: "mixed",
  question: "",
  summary: [
    "Existing studies suggest that perceived hurricane risk and official risk communication influence evacuation decisions. [@huang2016] identified risk-area residence, expected personal impacts, and official warnings as consistent predictors of evacuation. [@morss2016] found that storm surge impact information increased evacuation intentions, while [@pham2020] found that evacuation order timing influenced departure timing.",
    "However, **objective hazard exposure does not always correspond to perceived risk or evacuation behavior**, as illustrated by [@horney2010b].",
    "Risk exposure is therefore examined in three stages: **before** the hurricane (perceived risk from forecasts and past flooding), **during** the hurricane (actual exposure to the storm), and **after** the hurricane (impacts at home such as flooding, house damage and power outage)."
  ],
  children: [
    {
      label: "Risk exposure by stage",
      title: "Risk exposure across hurricane stages",
      kind: "dimension",
      note: "Exposure is split by stage: before landfall people evacuate because of perceived risk, during landfall because of actual risk exposure, and after landfall because their home is affected.",
      children: [
        {
          label: "Before: perceived risk",
          title: "Stage 1 · Before the hurricane — perceived risk",
          kind: "group",
          note: "People evacuate because of perceived risk, formed from forecasts and past flood exposure.",
          children: [
            {
              label: "Distance to predicted storm",
              kind: "metric",
              metric: { name: "Distance to predicted storm track", measure: "Distance from CBG to NHC forecast track", source: ["nhc"], sign: "-" },
              hypotheses: [
                { dir: "neg", chain: "predicted distance to CBG(+) → perceived risk(-) → evacuation motivation(-)" }
              ]
            },
            {
              label: "Historical flooding frequency",
              kind: "metric",
              metric: { name: "Historical flooding annual frequency", source: ["nri"], sign: "?" },
              hypotheses: [
                { dir: "pos", chain: "flood exposure frequency(+) → perceived risk(+) → evacuation motivation(+)" },
                {
                  dir: "ns",
                  chain: "flood exposure frequency(+) → perceived risk(+) → evacuation motivation(?)",
                  evidence: "[@horney2010b] found that neither floodplain designation nor perceived property flood risk was significantly associated with evacuation during Hurricane Isabel. This study does not directly test event-specific observed inundation."
                }
              ]
            }
          ]
        },
        {
          label: "During: actual exposure",
          title: "Stage 2 · During the hurricane — actual risk exposure",
          kind: "group",
          note: "People evacuate because of the actual risk they are exposed to as the storm arrives.",
          children: [
            {
              label: "Distance to actual storm",
              title: "Actual wind speed / distance to actual storm",
              kind: "metric",
              metric: { name: "Distance to actual storm track / wind speed", measure: "Distance from CBG to NHC best track", source: ["nhc"], sign: "-" },
              hypotheses: [
                { dir: "neg", chain: "actual distance to CBG(+) → actual risk(-) → evacuation motivation(-)" }
              ]
            }
          ]
        },
        {
          label: "After: impacts at home",
          title: "Stage 3 · After the hurricane — impacts at home",
          kind: "group",
          note: "People evacuate because their home is affected (post-impact evacuation).",
          hypotheses: [
            {
              dir: "pos",
              chain: "impacts at home(+) → home habitability(-) → evacuation motivation(+)",
              evidence: "[@shen2024] modeled pre- and post-impact evacuation during Hurricane Ida and found that demographics and housing characteristics predicted pre-impact evacuation but not post-impact evacuation, while **residential damage and the duration of utility outages** were significant situational factors for **post-impact evacuation**."
            }
          ],
          children: [
            {
              label: "Actual flooding",
              title: "Actual flooding caused by the hurricane",
              kind: "metric",
              metric: { name: "Observed flooding", measure: "Observed flooding caused by the hurricane", source: ["modis"], sign: "+" },
              hypotheses: [
                {
                  dir: "pos",
                  chain: "actual flooding(+) → home flooded(+) → evacuation motivation(+)",
                  evidence: "Using large-scale mobility data for Hurricane Harvey, [@hong2021] show that many residents in the west Houston area near the reservoirs were **forced to leave their homes due to flooding during and after** the storm."
                }
              ]
            },
            {
              label: "House damage",
              kind: "metric",
              metric: { name: "House damage", measure: "Residential damage caused by the hurricane", sign: "+" },
              hypotheses: [
                {
                  dir: "pos",
                  chain: "house damage(+) → home habitability(-) → evacuation motivation(+)",
                  evidence: "[@shen2024] found that **residential damage** was a significant factor for **post-impact evacuation** during Hurricane Ida."
                }
              ]
            },
            {
              label: "Power outage",
              kind: "metric",
              metric: { name: "Power outage", measure: "Duration of power outage at home", sign: "+" },
              hypotheses: [
                {
                  dir: "pos",
                  chain: "power outage duration(+) → home habitability(-) → evacuation motivation(+)",
                  evidence: "[@shen2024] found that the **durations of power and water outages had additive effects** on the probability of post-impact evacuation during Hurricane Ida. [@lamadrid2025] found that the decision to evacuate before Hurricane Irma was affected by the prospect of **losing access to critical infrastructure services, primarily electricity**."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      label: "Risk communication",
      kind: "dimension",
      children: [
        {
          label: "Official warning",
          kind: "group",
          children: [
            { label: "Type (mandatory)", kind: "metric", metric: { name: "Warning type", measure: "Mandatory vs. voluntary evacuation order" } },
            { label: "Timing", kind: "metric", metric: { name: "Warning timing", measure: "Timing of the evacuation order" },
              evidence: "[@liu2025] found higher evacuation rates in the predicted landfall region during Hurricane Ian, potentially associated with earlier evacuation orders, while [@pham2020] identified evacuation-order timing as a significant predictor of departure timing during Hurricane Matthew." },
            { label: "Warning delivery", kind: "metric", metric: { name: "Warning delivery", measure: "No data" } }
          ]
        },
        {
          label: "Risk training",
          kind: "metric",
          metric: { name: "Risk training", measure: "No data" }
        }
      ]
    }
  ]
});
