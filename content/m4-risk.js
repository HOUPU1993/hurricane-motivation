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
  notes: [
    "Risk communication: no data yet for the way warnings are delivered, or for risk training."
  ],
  dimensions: [
    {
      name: "Actual risk exposure",
      pathways: [
        {
          id: "4.1",
          title: "Distance to predicted storm",
          metrics: [
            { name: "Distance to predicted storm track", measure: "Distance from CBG to forecast track", source: ["nhc"], sign: "-" }
          ],
          chains: [
            { dir: "neg", chain: "predicted distance to CBG(+) → perceived risk(-) → evacuation motivation(-)" }
          ]
        },
        {
          id: "4.2",
          title: "Historical flooding frequency",
          metrics: [
            { name: "Historical flooding annual frequency", source: ["nri"], sign: "?" }
          ],
          chains: [
            { dir: "pos", chain: "flood exposure frequency(+) → perceived risk(+) → evacuation motivation(+)" },
            {
              dir: "ns",
              chain: "flood exposure frequency(+) → perceived risk(+) → evacuation motivation(?)",
              evidence: "[@horney2010b] found that neither floodplain designation nor perceived property flood risk was significantly associated with evacuation during Hurricane Isabel. This study does not directly test event-specific observed inundation."
            }
          ]
        },
        {
          id: "4.3",
          title: "Actual wind speed / distance to actual storm",
          metrics: [
            { name: "Distance to actual storm track / wind speed", measure: "Distance from CBG to best track", source: ["nhc"], sign: "-" }
          ],
          chains: [
            { dir: "neg", chain: "actual distance to CBG(+) → actual risk(-) → evacuation motivation(-)" }
          ]
        },
        {
          id: "4.4",
          title: "Actual flooding caused by the hurricane",
          metrics: [
            { name: "Observed flooding", source: ["modis"], sign: "?" }
          ],
          chains: [
            { dir: "pos", chain: "actual flooding(+) → actual risk(+) → evacuation motivation(+)" },
            {
              dir: "ns",
              chain: "flood exposure frequency(+) → actual risk(+) → evacuation motivation(?)",
              evidence: "[@horney2010b] found that neither floodplain designation nor perceived property flood risk was significantly associated with evacuation during Hurricane Isabel. This study does not directly test event-specific observed inundation."
            }
          ]
        }
      ]
    },
    {
      name: "Risk communication",
      pathways: [
        {
          id: "4.5",
          title: "Official warning",
          metrics: [
            { name: "Warning type", measure: "Mandatory vs. voluntary order" },
            { name: "Warning timing", measure: "Time of order relative to landfall" },
            { name: "Warning delivery", measure: "No data" }
          ],
          evidence: "[@liu2025] found higher evacuation rates in the predicted landfall region during Hurricane Ian, potentially associated with earlier evacuation orders, while [@pham2020] identified evacuation-order timing as a significant predictor of departure timing during Hurricane Matthew."
        },
        {
          id: "4.6",
          title: "Risk training",
          metrics: [
            { name: "Risk training", measure: "No data" }
          ]
        }
      ]
    }
  ]
});
