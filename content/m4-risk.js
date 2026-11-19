HM.mechanism({
  id: "m4",
  code: "M4",
  title: "Self-Risk Assessment Motivation",
  short: "Risk assessment",
  status: "mixed",
  question: "",
  summary: [
    "Existing studies suggest that perceived hurricane risk and official risk communication influence evacuation decisions. [@huang2016] identified risk-area residence, expected personal impacts, and official warnings as consistent predictors of evacuation. [@morss2016] found that storm surge impact information increased evacuation intentions, while [@pham2020] found that evacuation order timing influenced departure timing.",
    "However, **objective hazard exposure does not always correspond to perceived risk or evacuation behavior**, as illustrated by [@horney2010b]."
  ],
  children: [
    {
      label: "Actual risk exposure",
      kind: "dimension",
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
        },
        {
          label: "Distance to actual storm",
          title: "Actual wind speed / distance to actual storm",
          kind: "metric",
          metric: { name: "Distance to actual storm track / wind speed", measure: "Distance from CBG to NHC best track", source: ["nhc"], sign: "-" },
          hypotheses: [
            { dir: "neg", chain: "actual distance to CBG(+) → actual risk(-) → evacuation motivation(-)" }
          ]
        },
        {
          label: "Actual flooding",
          title: "Actual flooding caused by the hurricane",
          kind: "metric",
          metric: { name: "Observed flooding", measure: "Observed flooding caused by the hurricane", source: ["modis"], sign: "?" },
          hypotheses: [
            { dir: "pos", chain: "actual flooding(+) → actual risk(+) → evacuation motivation(+)" }
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
            { label: "Way of delivery", kind: "metric", metric: { name: "Warning delivery", measure: "No data" } }
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
