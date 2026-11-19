HM.mechanism({
  id: "m5",
  code: "M5",
  title: "Socially Influenced Motivation",
  short: "Social influence",
  status: "consistent",
  question: "",
  summary: [
    "Socially influenced evacuation motivation may operate through two primary mechanisms: **peer evacuation pressure** and **interregional connectivity**.",
    "First, observing more peers evacuating may encourage individuals to make similar decisions through risk communication, coordinated evacuation, and psychological pressure. [@huang2016] identified observations of others’ behavior as a significant predictor of household evacuation decisions.",
    "Second, stronger interregional connectivity between higher-risk and lower-risk areas may facilitate evacuation by improving access to risk information and temporary shelter opportunities. [@collins2018] found that evacuees during Hurricane Irma relied more heavily on information from friends and family than non-evacuees. [@na2022] found that the geographic distribution of family and friends significantly influenced planned evacuation destinations: evacuees lacking social support at their destinations planned to travel about twice as far as those with such support."
  ],
  dimensions: [
    {
      name: "Social influence",
      pathways: [
        {
          id: "5.1",
          title: "Peer evacuation influence",
          metrics: [
            { name: "Peer evacuation exposure", measure: "P<sub>i</sub> = Σ<sub>j</sub>(w<sub>ij</sub> · E<sub>j</sub>) / Σ<sub>j</sub> w<sub>ij</sub>", source: ["gps"], sign: "+" }
          ],
          chains: [
            {
              dir: "pos",
              chain: "peer evacuation pressure(+) → risk communication / coordinated evacuation / psychological pressure(+) → evacuation motivation(+)",
              evidence: "[@huang2016] identified observations of other people’s behavior as a consistently significant predictor of household evacuation across hurricane evacuation studies."
            }
          ]
        },
        {
          id: "5.2",
          title: "Interregional social connections (higher-risk → lower-risk area)",
          metrics: [
            { name: "Interregional connectivity", measure: "OD flow from higher-risk area to lower-risk area", source: ["gps"], sign: "+" }
          ],
          chains: [
            {
              dir: "pos",
              chain: "interregional social connections(+) → risk communication / temporary shelter opportunity(+) → evacuation motivation(+)",
              evidence: "[@collins2018] found that evacuees during Hurricane Irma had denser and more diverse social networks and relied more heavily on information from friends and family than non-evacuees. [@na2022] found that evacuees lacking social support at their destinations planned to travel about twice as far as those with such support."
            }
          ]
        }
      ]
    }
  ]
});
