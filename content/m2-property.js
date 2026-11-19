HM.mechanism({
  id: "m2",
  code: "M2",
  title: "Property-Attachment Related Motivation",
  short: "Property attachment",
  status: "mixed",
  question: "Does property-related motivation really exist?",
  summary: [
    "Existing studies have identified associations between residential property characteristics and hurricane evacuation behavior. Regarding housing conditions, [@solis2009] found that residents of mobile homes and flood-prone areas were more likely to evacuate, and [@karaye2019] reported a significantly higher evacuation tendency among mobile home residents. A meta-analysis by [@tanim2022] further identified mobile home occupancy as a strong positive predictor of evacuation. The underlying mechanism may relate to psychological safety and population vulnerability.",
    "Regarding financial ties to property, [@solis2009] found that homeowners were less likely to evacuate than non-homeowners. Homeowners differ from others in two important ways: they usually have **more financial ties to their property**, and they tend to have **longer tenure, higher income, or older age**. [@karaye2019] found that flood insurance coverage was associated with lower evacuation tendency."
  ],
  notes: [
    "The 300-household survey cited as “Pham (2020)” links to a 2013 report by Wilmot and Gudishala that does not contain this survey; the original source needs to be identified. The notes also say “loss from roofers”; check whether “looters” is meant.",
    "Building type: single-family, multi-family and apartment households have uncertain expected directions."
  ],
  children: [
    {
      label: "Financial ties to property",
      kind: "dimension",
      hypotheses: [
        {
          dir: "neg",
          chain: "predicted personal house stake loss(+) → perceived loss if evacuate(+) → evacuation motivation(-)",
          evidence: "[@pham2020b] surveyed 300 households: 23% of households who stayed in place explained that they wanted to prevent storm damage to their house, and 15% to prevent loss from roofers. The survey-based analysis of [@weller2016] also shows that the motivation to protect the house is an important reason for non-evacuation."
        }
      ],
      children: [
        {
          label: "Mortgage status",
          kind: "group",
          note: "Homeowners are split by mortgage status; each branch implies a different stake in the property.",
          children: [
            {
              label: "Mortgage-free",
              title: "Mortgage-free homeowners",
              kind: "group",
              children: [
                {
                  label: "Paid off",
                  title: "Mortgage-free homeowners (mortgage paid off)",
                  kind: "metric",
                  metric: { name: "Pct. of mortgage-free homeowners (paid off)", measure: "Share of owner-occupied units whose mortgage has been paid off", sign: "-" },
                  hypotheses: [
                    { dir: "neg", chain: "mortgage-free homeowners, paid off(+) → tenure length / older residents(+) → evacuation motivation(-)" }
                  ]
                },
                {
                  label: "Cash purchase",
                  title: "Mortgage-free homeowners (cash buyers)",
                  kind: "metric",
                  metric: { name: "Pct. of mortgage-free homeowners (cash purchase)", measure: "Share of owner-occupied units bought in cash", sign: "+" },
                  hypotheses: [
                    { dir: "pos", chain: "mortgage-free homeowners, cash buyers(+) → very wealthy households(+) → multiple resources in the U.S.(+) → evacuation motivation(+)" }
                  ]
                }
              ]
            },
            {
              label: "Active mortgage",
              title: "Active-mortgage homeowners",
              kind: "group",
              children: [
                {
                  label: "Positive equity",
                  title: "Active mortgage, remaining mortgage < house value",
                  kind: "metric",
                  metric: { name: "Loan-to-value ratio", measure: "remaining mortgage / house value  (where remaining mortgage < house value)", sign: "-" },
                  hypotheses: [
                    {
                      dir: "neg",
                      chain: "predicted personal house stake loss(+) → perceived loss if evacuate(+) → evacuation motivation(-)",
                      evidence: "[@liao2026] found that higher **home equity** increases the motivation to purchase **flood insurance**."
                    }
                  ]
                },
                {
                  label: "Negative equity",
                  title: "Active mortgage, remaining mortgage > house value",
                  kind: "metric",
                  metric: { name: "Pct. of negative-equity homeowners", measure: "Share of mortgaged owners whose remaining mortgage exceeds house value", sign: "-" },
                  hypotheses: [
                    {
                      dir: "neg",
                      chain: "negative-equity homeowners(+) → lower income(+) → evacuation motivation(-)",
                      evidence: "[@liao2026] concludes that lower-equity owners with a mortgage have less motivation to protect their house because they can shift loss risk to the lender by defaulting on debt. [@kousky2020] studied Hurricane Harvey and found a significant correlation between house damage and mortgage credit risk."
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: "Flood insurance",
          title: "Flood insurance coverage",
          kind: "metric",
          metric: { name: "Flood insurance coverage rate", measure: "Pct. of households with flood insurance", source: ["floodins"], sign: "-" },
          hypotheses: [
            {
              dir: "neg",
              chain: "flood insurance coverage(+) → risk perception(-) → evacuation motivation(-)",
              evidence: "[@karaye2019] found that owners with **flood insurance may prefer to stay in place** compared with those without insurance; a potential reason is that flood insurance may decrease risk perception. [@botzen2019] shows a correlation between **insurance and long-term flood prevention**."
            }
          ]
        }
      ]
    },
    {
      label: "House characteristics",
      kind: "dimension",
      children: [
        {
          label: "Building code / condition",
          kind: "group",
          open: false,
          hypotheses: [
            {
              dir: "pos",
              chain: "house age(+) → more safety concern(-) → evacuation motivation(+)",
              evidence: "[@fippinger2024], summarizing FEMA’s Mitigation Assessment Team observations after Hurricane Ian, reports that newer, elevated homes experienced less flood damage than older homes; significant changes can be observed among homes built before 1974, within the 1990s, and after 2002. In Lee County, a house built in 1973 had about seven feet of flooding on its lowest floor, while a house built in 2006 was flooded mainly in the enclosed space below its lowest floor. An analysis of about 1,100 Florida homes affected by Hurricane Irma found significantly less damage to roof and wall coverings in homes built after 1994 [@nahb2019]."
            }
          ],
          note: "Year built from ACS B25035 (median year built) or B25036 (tenure by year built), or Infutor property records. Year bins follow Florida building code eras.",
          table: {
            columns: ["Year", "Policy", "Change"],
            rows: [
              ["1974", "State Minimum Building Code Law", "Required local governments to adopt and enforce minimum building safety standards, while allowing local variations in building codes."],
              ["1994", "South Florida Building Code revision", "After Hurricane Andrew (1992): strengthened requirements for roofs, windows, building envelopes and other wind resistance in Miami-Dade and Broward Counties."],
              ["1994", "HUD Manufactured Home Wind Standards", "Strengthened construction requirements for newly manufactured homes, including structural connections and roof systems."],
              ["2002", "Florida Building Code (FBC)", "Established a unified statewide code with strengthened hurricane-resistant construction standards, replacing the fragmented local code system."]
            ]
          },
          children: [
            { label: "Built before 1974", kind: "metric", metric: { name: "pct_house_before1974", measure: "Share of housing units built before 1974 (no statewide minimum code)", source: ["acs", "infutor"], sign: "+" } },
            { label: "Built 1974–1994", kind: "metric", metric: { name: "pct_house_1974_1994", measure: "Share built 1974–1994 (State Minimum Building Code Law)", source: ["acs", "infutor"] } },
            { label: "Built 1994–2002", kind: "metric", metric: { name: "pct_house_1994_2002", measure: "Share built 1994–2002 (South Florida code revision; HUD wind standards)", source: ["acs", "infutor"] } },
            { label: "Built after 2002", kind: "metric", metric: { name: "pct_house_after_2002", measure: "Share built after 2002 (statewide Florida Building Code)", source: ["acs", "infutor"] } }
          ]
        },
        {
          label: "Building type",
          kind: "group",
          open: false,
          children: [
            { label: "Mobile home", kind: "metric", metric: { name: "Pct. of mobile home households", sign: "+" },
              evidence: "[@solis2009] found that residents of mobile homes were more likely to evacuate. [@karaye2019] and [@tanim2022] found that residents of mobile homes had a significantly higher evacuation tendency than residents of single-family homes." },
            { label: "Single-family", kind: "metric", metric: { name: "Pct. of single-family households", sign: "?" } },
            { label: "Multi-family", kind: "metric", metric: { name: "Pct. of multi-family households", sign: "?" } },
            { label: "Apartment", kind: "metric", metric: { name: "Pct. of apartment households", sign: "?" } }
          ]
        },
        {
          label: "Building location",
          kind: "group",
          open: false,
          hypotheses: [
            {
              dir: "pos",
              chain: "high risk perception(+) → evacuation motivation(+)"
            }
          ],
          children: [
            { label: "Official evacuation zone", kind: "metric", metric: { name: "Official evacuation zone", sign: "+" },
              evidence: "[@stein2010] highlights that people living in an evacuation zone are significantly more likely to evacuate." },
            { label: "FEMA flood zone", kind: "metric", metric: { name: "FEMA flood zone", sign: "+" },
              evidence: "[@solis2009] found that residents of flood-prone areas were more likely to evacuate." },
            { label: "Low-lying area", kind: "metric", metric: { name: "Low-lying area", sign: "+" } }
          ]
        },
        {
          label: "Structural protection",
          kind: "group",
          open: false,
          hypotheses: [
            {
              dir: "neg",
              chain: "structural protection(+) → perceived home safety(+) → evacuation motivation(-)"
            }
          ],
          children: [
            { label: "Window protection (wind)", kind: "metric", metric: { name: "Window protection (wind)", sign: "-" },
              evidence: "[@hasan2012] found that households with window protection measures (storm shutters, metal panels, or plywood sheets on windows) are less likely to evacuate than households without protection measures." },
            { label: "Roof protection (wind)", kind: "metric", metric: { name: "Roof protection (wind)", sign: "-" } },
            { label: "Ground elevation (flood)", kind: "metric", metric: { name: "Ground elevation and foundation type (flooding)", source: ["nsi"], sign: "-" } }
          ]
        }
      ]
    }
  ]
});
