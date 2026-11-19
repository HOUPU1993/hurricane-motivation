HM.mechanism({
  id: "m2",
  code: "M2",
  title: "Property-Attachment Related Motivation",
  short: "Property attachment",
  status: "mixed",
  question: "Does property-related motivation really exist?",
  summary: [
    "Existing studies have identified associations between residential property characteristics and hurricane evacuation behavior. Regarding housing conditions, [@solis2010] found that residents of mobile homes and flood-prone areas were more likely to evacuate, and [@karaye2019] reported a significantly higher evacuation tendency among mobile home residents. A meta-analysis by [@tanim2022] further identified mobile home occupancy as a strong positive predictor of evacuation. The underlying mechanism may relate to psychological safety and population vulnerability.",
    "Regarding financial ties to property, [@solis2010] found that homeowners were less likely to evacuate than non-homeowners. Homeowners differ from others in two important ways: they usually have **more financial ties to their property**, and they tend to have **longer tenure, higher income, or older age**. [@karaye2019] found that flood insurance coverage was associated with lower evacuation tendency."
  ],
  notes: [
    "Pham (2020b): the 15% reason is written as “preventing loss from roofers” in the notes; check whether “looters” is meant.",
    "Building type: single-family, multi-family and apartment households have uncertain expected signs."
  ],
  dimensions: [
    {
      name: "Financial ties to property",
      intro: {
        dir: "neg",
        chain: "predicted personal house stake loss(+) → perceived loss if evacuate(+) → evacuation motivation(-)",
        evidence: "[@pham2020b] surveyed 300 households: 23% of households who stayed in place explained that they wanted to prevent storm damage to their house, and 15% to prevent loss from roofers. The survey-based analysis of [@weller2016] also shows that the motivation to protect the house is an important reason for non-evacuation."
      },
      pathways: [
        {
          id: "2.1",
          title: "Mortgage-free homeowners (paid off)",
          metrics: [
            { name: "Pct. of mortgage-free homeowners (paid off)", measure: "Share of homeowners whose mortgage has been paid off", sign: "-" }
          ],
          chains: [
            { dir: "neg", chain: "mortgage-free homeowners, paid off(+) → tenure length / older residents(+) → evacuation motivation(-)" }
          ]
        },
        {
          id: "2.2",
          title: "Mortgage-free homeowners (cash purchase)",
          metrics: [
            { name: "Pct. of mortgage-free homeowners (cash purchase)", measure: "Share of homeowners who bought the house in cash", sign: "+" }
          ],
          chains: [
            { dir: "pos", chain: "mortgage-free homeowners, cash buyers(+) → very wealthy households(+) → multiple resources in the U.S.(+) → evacuation motivation(+)" }
          ]
        },
        {
          id: "2.3",
          title: "Active mortgage, positive equity (remaining mortgage < house value)",
          metrics: [
            { name: "Loan-to-value ratio", measure: "remaining mortgage / house value", sign: "-" }
          ],
          chains: [
            {
              dir: "neg",
              chain: "predicted personal house stake loss(+) → perceived loss if evacuate(+) → evacuation motivation(-)",
              evidence: "[@liao2026] found that higher **home equity** increases the motivation to purchase **flood insurance**. [@karaye2019] found that owners with **flood insurance may prefer to stay in place**; a potential reason is that flood insurance may decrease risk perception. [@botzen2019] shows a correlation between **insurance and long-term flood prevention**."
            }
          ]
        },
        {
          id: "2.4",
          title: "Negative equity (remaining mortgage > house value)",
          metrics: [
            { name: "Pct. of negative-equity homeowners", measure: "Share of homeowners whose remaining mortgage exceeds house value", sign: "-" }
          ],
          chains: [
            {
              dir: "neg",
              chain: "negative-equity homeowners(+) → lower income(+) → evacuation motivation(-)",
              evidence: "[@liao2026] concludes that lower-equity owners with a mortgage have less motivation to protect their house because they can shift loss risk to the lender by defaulting on debt. [@kousky2020] studied Hurricane Harvey and found a significant correlation between house damage and mortgage credit risk."
            }
          ]
        },
        {
          id: "2.5",
          title: "Flood insurance coverage",
          metrics: [
            { name: "Flood insurance coverage rate", measure: "Pct. of households with flood insurance", source: ["floodins"], sign: "-" }
          ],
          chains: [
            {
              dir: "neg",
              chain: "flood insurance coverage(+) → risk perception(-) → evacuation motivation(-)",
              evidence: "[@karaye2019] found that owners with **flood insurance may prefer to stay in place** compared with those without insurance; a potential reason is that flood insurance may decrease risk perception."
            }
          ]
        }
      ]
    },
    {
      name: "House characteristics",
      pathways: [
        {
          id: "2.6",
          title: "Building code era / house age",
          metrics: [
            { name: "pct_house_before1974", measure: "Share of housing units built before 1974", source: ["acs", "infutor"], sign: "+" },
            { name: "pct_house_1974_1994", measure: "Built 1974–1994", source: ["acs", "infutor"] },
            { name: "pct_house_1994_2002", measure: "Built 1994–2002", source: ["acs", "infutor"] },
            { name: "pct_house_after_2002", measure: "Built after 2002", source: ["acs", "infutor"] }
          ],
          chains: [
            {
              dir: "pos",
              chain: "house age(+) → more safety concern(-) → evacuation motivation(+)",
              evidence: "The [@fema_ian] found that newer, elevated homes experienced less flood damage than older homes; significant changes can be observed among homes built before 1974, within the 1990s, and after 2002. In Lee County, a house built in 1973 had about seven feet of flooding on its lowest floor, while a house built in 2006 was flooded mainly in the enclosed space below its lowest floor. An analysis of about 1,100 Florida homes affected by Hurricane Irma found significantly less damage to roof and wall coverings in homes built after 1994 [@nahb2019]."
            }
          ],
          note: "ACS tables B25035 (median year built) or B25036 (tenure by year built).",
          table: {
            columns: ["Year", "Policy", "Change", "Metric"],
            rows: [
              ["before 1974", "—", "No statewide minimum building code.", "pct_house_before1974"],
              ["1974", "State Minimum Building Code Law", "Required local governments to adopt and enforce minimum building safety standards, while allowing local variations in building codes.", "pct_house_1974_1994"],
              ["1994", "South Florida Building Code revision", "After Hurricane Andrew (1992): strengthened requirements for roofs, windows, building envelopes and other wind resistance in Miami-Dade and Broward Counties.", "pct_house_1994_2002"],
              ["1994", "HUD Manufactured Home Wind Standards", "Strengthened construction requirements for newly manufactured homes, including structural connections and roof systems.", "pct_house_1994_2002"],
              ["2002", "Florida Building Code (FBC)", "Established a unified statewide code with strengthened hurricane-resistant construction standards, replacing the fragmented local code system.", "pct_house_after_2002"]
            ]
          }
        },
        {
          id: "2.7",
          title: "Building type",
          metrics: [
            { name: "Pct. of mobile home households", sign: "+" },
            { name: "Pct. of single-family households", sign: "?" },
            { name: "Pct. of multi-family households", sign: "?" },
            { name: "Pct. of apartment households", sign: "?" }
          ],
          chains: [
            {
              dir: "pos",
              chain: "mobile home household(+) → evacuation motivation(+)",
              evidence: "[@karaye2019] and [@tanim2022] found that residents of mobile homes had a significantly higher evacuation tendency than residents of single-family homes."
            }
          ]
        },
        {
          id: "2.8",
          title: "Building location",
          metrics: [
            { name: "Official evacuation zone", sign: "+", source: ["fema_zone"] },
            { name: "FEMA flood zone", sign: "+", source: ["fema_zone"] },
            { name: "Low-lying area", sign: "+" }
          ],
          chains: [
            {
              dir: "pos",
              chain: "high risk perception(+) → evacuation motivation(+)",
              evidence: "[@robert2010] highlights that people living in an evacuation zone are significantly more likely to evacuate."
            }
          ]
        },
        {
          id: "2.9",
          title: "Structural protection",
          metrics: [
            { name: "Window protection (wind)", sign: "-", source: ["nsi"] },
            { name: "Roof protection (wind)", sign: "-", source: ["nsi"] },
            { name: "Ground elevation and foundation type (flooding)", sign: "-", source: ["nsi"] }
          ],
          chains: [
            {
              dir: "neg",
              chain: "structural protection(+) → perceived home safety(+) → evacuation motivation(-)",
              evidence: "[@hasan2012] found that households with window protection measures (storm shutters, metal panels, or plywood sheets on windows) are less likely to evacuate than households without protection measures."
            }
          ]
        }
      ]
    }
  ]
});
