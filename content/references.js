/*
 * Bibliography (APA 7th edition) and data sources.
 *
 * Cite anywhere in content text with [@key]. The in-text label (e.g. "Stein et al. (2010)")
 * and the reference-list entry are generated from these fields.
 *
 * Fields
 *   type:    "article" | "report" | "conference" | "web" | "book"
 *   authors: ["Family, I. I.", ...]   (APA form, in published order; up to 20)
 *   year, suffix ("a"/"b" for same authors + same year), date (web pages)
 *   title:   sentence case
 *   journal, volume, issue, pages ("235–248" or "Article 4268")
 *   publisher, number (report/series number), event (conference), site (web)
 *   doi, url
 *   label:   optional override of the in-text label
 *   flag:    optional warning shown in the reference list
 *   embed:   optional true/false to force the viewer to try (or skip) showing the page
 * Every entry below was checked against Crossref or the publisher record on 2026-11-19.
 */
HM.references({
  botzen2019: { type: "article", authors: ["Botzen, W. J. W.", "Kunreuther, H.", "Michel-Kerjan, E."], year: 2019,
    title: "Protecting against disaster risks: Why insurance and prevention may be complements",
    journal: "Journal of Risk and Uncertainty", volume: "59", issue: "2", pages: "151–169", doi: "10.1007/s11166-019-09312-6" },

  collins2017: { type: "article", authors: ["Collins, J.", "Ersing, R.", "Polen, A."], year: 2017,
    title: "Evacuation decision-making during Hurricane Matthew: An assessment of the effects of social connections",
    journal: "Weather, Climate, and Society", volume: "9", issue: "4", pages: "769–776", doi: "10.1175/WCAS-D-17-0047.1" },

  collins2018: { type: "article", authors: ["Collins, J.", "Ersing, R.", "Polen, A.", "Saunders, M.", "Senkbeil, J."], year: 2018,
    title: "The effects of social connections on evacuation decision making during Hurricane Irma",
    journal: "Weather, Climate, and Society", volume: "10", issue: "3", pages: "459–469", doi: "10.1175/WCAS-D-17-0119.1" },

  dimasso2019: { type: "article", authors: ["Di Masso, A.", "Williams, D. R.", "Raymond, C. M.", "Buchecker, M.", "Degenhardt, B.", "Devine-Wright, P.", "Hertzog, A.", "Lewicka, M.", "Manzo, L.", "Shahrad, A.", "Stedman, R.", "Verbrugge, L.", "von Wirth, T."], year: 2019,
    title: "Between fixities and flows: Navigating place attachments in an increasingly mobile world",
    journal: "Journal of Environmental Psychology", volume: "61", pages: "125–133", doi: "10.1016/j.jenvp.2019.01.006" },

  dillon2011: { type: "article", authors: ["Dillon, R. L.", "Tinsley, C. H.", "Cronin, M."], year: 2011,
    title: "Why near-miss events can decrease an individual’s protective response to hurricanes",
    journal: "Risk Analysis", volume: "31", issue: "3", pages: "440–449", doi: "10.1111/j.1539-6924.2010.01506.x" },

  dowcutter1998: { type: "article", authors: ["Dow, K.", "Cutter, S. L."], year: 1998,
    title: "Crying wolf: Repeat responses to hurricane evacuation orders",
    journal: "Coastal Management", volume: "26", issue: "4", pages: "237–252", doi: "10.1080/08920759809362356" },

  eisenman2007: { type: "article", authors: ["Eisenman, D. P.", "Cordasco, K. M.", "Asch, S.", "Golden, J. F.", "Glik, D."], year: 2007,
    title: "Disaster planning and risk communication with vulnerable communities: Lessons from Hurricane Katrina",
    journal: "American Journal of Public Health", volume: "97", issue: "Suppl. 1", pages: "S109–S115", doi: "10.2105/AJPH.2005.084335" },

  fippinger2024: { type: "web", authors: ["Fippinger, K."], year: 2024, date: "2024, February 7",
    title: "Hurricane Ian in Florida: A mitigation success story for building codes",
    site: "Building Safety Journal, International Code Council",
    url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/hurricane-ian-in-florida-a-mitigation-success-story-for-building-codes/" },

  halim2021: { type: "article", authors: ["Halim, N.", "Jiang, F.", "Khan, M.", "Meng, S.", "Mozumder, P."], year: 2021,
    title: "Household evacuation planning and preparation for future hurricanes: Role of utility service disruptions",
    journal: "Transportation Research Record", volume: "2675", issue: "10", pages: "1000–1011", doi: "10.1177/03611981211014529" },

  hasan2012: { type: "article", authors: ["Hasan, S.", "Mesa-Arango, R.", "Ukkusuri, S.", "Murray-Tuite, P."], year: 2012,
    title: "Transferability of hurricane evacuation choice model: Joint model estimation combining multiple data sources",
    journal: "Journal of Transportation Engineering", volume: "138", issue: "5", pages: "548–556", doi: "10.1061/(ASCE)TE.1943-5436.0000365" },

  horney2008: { type: "article", authors: ["Horney, J. A.", "Snider, C. J.", "Malone, S.", "Gammons, L.", "Ramsey, S."], year: 2008,
    title: "Factors associated with hurricane preparedness: Results of a pre-hurricane assessment",
    journal: "Journal of Disaster Research", volume: "3", issue: "2", pages: "143–149", doi: "10.20965/jdr.2008.p0143",
    url: "https://www.fujipress.jp/jdr/dr/dsstr000300020143/" },

  horney2010a: { type: "article", authors: ["Horney, J. A.", "MacDonald, P. D. M.", "Van Willigen, M.", "Berke, P. R.", "Kaufman, J. S."], year: 2010, suffix: "a",
    title: "Factors associated with evacuation from Hurricane Isabel in North Carolina, 2003",
    journal: "International Journal of Mass Emergencies & Disasters", volume: "28", issue: "1", pages: "33–58", doi: "10.1177/028072701002800102" },

  horney2010b: { type: "article", authors: ["Horney, J. A.", "MacDonald, P. D. M.", "Van Willigen, M.", "Berke, P. R.", "Kaufman, J. S."], year: 2010, suffix: "b",
    title: "Individual actual or perceived property flood risk: Did it predict evacuation from Hurricane Isabel in North Carolina, 2003?",
    journal: "Risk Analysis", volume: "30", issue: "3", pages: "501–511", doi: "10.1111/j.1539-6924.2009.01341.x" },

  huang2016: { type: "article", authors: ["Huang, S.-K.", "Lindell, M. K.", "Prater, C. S."], year: 2016,
    title: "Who leaves and who stays? A review and statistical meta-analysis of hurricane evacuation studies",
    journal: "Environment and Behavior", volume: "48", issue: "8", pages: "991–1029", doi: "10.1177/0013916515578485" },

  karaye2019: { type: "article", authors: ["Karaye, I. M.", "Horney, J. A.", "Retchless, D. P.", "Ross, A. D."], year: 2019,
    title: "Determinants of hurricane evacuation from a large representative sample of the U.S. Gulf Coast",
    journal: "International Journal of Environmental Research and Public Health", volume: "16", issue: "21", pages: "Article 4268", doi: "10.3390/ijerph16214268",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6861906/" },

  kates1962: { type: "report", authors: ["Kates, R. W."], year: 1962,
    title: "Hazard and choice perception in flood plain management", number: "Research Paper No. 78",
    publisher: "Department of Geography, University of Chicago", url: "https://www.proquest.com/docview/302254676" },

  kousky2020: { type: "article", authors: ["Kousky, C.", "Palim, M.", "Pan, Y."], year: 2020,
    title: "Flood damage and mortgage credit risk: A case study of Hurricane Harvey",
    journal: "Journal of Housing Research", volume: "29", issue: "sup1", pages: "S86–S120", doi: "10.1080/10527001.2020.1840131" },

  lazo2015: { type: "article", authors: ["Lazo, J. K.", "Bostrom, A.", "Morss, R. E.", "Demuth, J. L.", "Lazrus, H."], year: 2015,
    title: "Factors affecting hurricane evacuation intentions",
    journal: "Risk Analysis", volume: "35", issue: "10", pages: "1837–1857", doi: "10.1111/risa.12407" },

  liao2026: { type: "report", authors: ["Liao, Y.", "Mulder, P."], year: 2026,
    title: "What’s at stake? Understanding the role of home equity in flood insurance demand", number: "RFF Working Paper 21-25, updated May 13, 2026",
    publisher: "Resources for the Future", url: "https://media.rff.org/documents/WP_21-25_Updated_2026-05-13.pdf" },

  liu2025: { type: "article", authors: ["Liu, L.", "Zhang, X.", "Jiang, S.", "Zhao, X."], year: 2025,
    title: "Hurricane evacuation analysis with large-scale mobile device location data during Hurricane Ian",
    journal: "Transportation Research Part D: Transport and Environment", volume: "139", pages: "Article 104559", doi: "10.1016/j.trd.2024.104559" },

  morss2016: { type: "article", authors: ["Morss, R. E.", "Demuth, J. L.", "Lazo, J. K.", "Dickinson, K.", "Lazrus, H.", "Morrow, B. H."], year: 2016,
    title: "Understanding public hurricane evacuation decisions and responses to forecast and warning messages",
    journal: "Weather and Forecasting", volume: "31", issue: "2", pages: "395–417", doi: "10.1175/WAF-D-15-0066.1" },

  na2022: { type: "article", authors: ["Na, H. S.", "Grace, R."], year: 2022,
    title: "Influence of social networks and opportunities for social support on evacuation destination decision-making",
    journal: "Safety Science", volume: "147", pages: "Article 105564", doi: "10.1016/j.ssci.2021.105564" },

  nahb2019: { type: "web", authors: ["National Association of Home Builders"], label: "NAHB (2019)", year: 2019,
    title: "Damage assessment from Hurricanes Harvey and Irma: Results—Florida", site: "NAHB",
    url: "https://www.nahb.org/advocacy/top-priorities/building-codes/Construction-Codes-Standards-Research/damage-assessment-from-hurricanes-harvey-and-irma/results-florida" },

  peacock2003: { type: "article", authors: ["Peacock, W. G."], year: 2003,
    title: "Hurricane mitigation status and factors influencing mitigation status among Florida’s single-family homeowners",
    journal: "Natural Hazards Review", volume: "4", issue: "3", pages: "149–158", doi: "10.1061/(ASCE)1527-6988(2003)4:3(149)" },

  pham2020: { type: "article", authors: ["Pham, E. O.", "Emrich, C. T.", "Li, Z.", "Mitchem, J.", "Cutter, S. L."], year: 2020,
    title: "Evacuation departure timing during Hurricane Matthew",
    journal: "Weather, Climate, and Society", volume: "12", issue: "2", pages: "235–248", doi: "10.1175/WCAS-D-19-0030.1" },

  pham2020b: { type: "report", authors: ["Wilmot, C. G.", "Gudishala, R."], year: 2013, label: "[source to verify]",
    title: "Development of a time-dependent hurricane evacuation model for the New Orleans area", number: "Report No. FHWA/LA.12/494",
    publisher: "Louisiana Transportation Research Center", url: "https://rosap.ntl.bts.gov/view/dot/25769",
    flag: "Cited in the notes as “Pham (2020)” for a 300-household survey (23% stayed to protect the house, 15% to prevent loss). The linked document is this 2013 report by Wilmot and Gudishala, which does not report that survey. The original source needs to be identified." },

  rigos2019: { type: "article", authors: ["Rigos, A.", "Mohlin, E.", "Ronchi, E."], year: 2019,
    title: "The cry wolf effect in evacuation: A game-theoretic approach",
    journal: "Physica A: Statistical Mechanics and Its Applications", volume: "526", pages: "Article 120890", doi: "10.1016/j.physa.2019.04.126" },

  rincon2001: { type: "article", authors: ["Rincon, E.", "Linares, M. Y.-R.", "Greenberg, B."], year: 2001,
    title: "Effect of previous experience of a hurricane on preparedness for future hurricanes",
    journal: "The American Journal of Emergency Medicine", volume: "19", issue: "4", pages: "276–279", doi: "10.1053/ajem.2001.22668" },

  sadri2017: { type: "article", authors: ["Sadri, A. M.", "Ukkusuri, S. V.", "Gladwin, H."], year: 2017,
    title: "Modeling joint evacuation decisions in social networks: The case of Hurricane Sandy",
    journal: "Journal of Choice Modelling", volume: "25", pages: "50–60", doi: "10.1016/j.jocm.2017.02.002" },

  solis2009: { type: "conference", authors: ["Solís, D.", "Thomas, M. H.", "Letson, D."], year: 2009,
    title: "Determinants of household hurricane evacuation choice in Florida",
    event: "Southern Agricultural Economics Association Annual Meeting, Atlanta, GA, United States",
    doi: "10.22004/ag.econ.45338", url: "https://ageconsearch.umn.edu/record/45338" },

  stein2010: { type: "article", authors: ["Stein, R. M.", "Dueñas-Osorio, L.", "Subramanian, D."], year: 2010,
    title: "Who evacuates when hurricanes approach? The role of risk, information, and location",
    journal: "Social Science Quarterly", volume: "91", issue: "3", pages: "816–834", doi: "10.1111/j.1540-6237.2010.00721.x" },

  tanim2022: { type: "article", authors: ["Tanim, S. H.", "Wiernik, B. M.", "Reader, S.", "Hu, Y."], year: 2022,
    title: "Predictors of hurricane evacuation decisions: A meta-analysis",
    journal: "Journal of Environmental Psychology", volume: "79", pages: "Article 101742", doi: "10.1016/j.jenvp.2021.101742" },

  thomas2016: { type: "article", authors: ["Thomas, M. J.", "Stillwell, J. C. H.", "Gould, M. I."], year: 2016,
    title: "Modelling the duration of residence and plans for future residential relocation: A multilevel analysis",
    journal: "Transactions of the Institute of British Geographers", volume: "41", issue: "3", pages: "297–312", doi: "10.1111/tran.12123" },

  thompson2017: { type: "article", authors: ["Thompson, R. R.", "Garfin, D. R.", "Silver, R. C."], year: 2017,
    title: "Evacuation from natural disasters: A systematic review of the literature",
    journal: "Risk Analysis", volume: "37", issue: "4", pages: "812–839", doi: "10.1111/risa.12654" },

  weller2016: { type: "article", authors: ["Weller, S. C.", "Baer, R.", "Prochaska, J."], year: 2016,
    title: "Should I stay or should I go? Response to the Hurricane Ike evacuation order on the Texas Gulf Coast",
    journal: "Natural Hazards Review", volume: "17", issue: "3", pages: "Article 04016003", doi: "10.1061/(ASCE)NH.1527-6996.0000217" }
});

/*
 * Data sources, cited in APA dataset style. Reference from a metric with source: ["acs", ...].
 * Fields: label (short chip text), apa (full reference), url, note.
 */
HM.sources({
  acs:      { label: "ACS 5-year", url: "https://data.census.gov/",
              apa: "U.S. Census Bureau. (n.d.). <i>American Community Survey 5-year estimates</i> (Tables B25035, B25036, B25038, B25039, B07001) [Data set]." },
  infutor:  { label: "Infutor", apa: "Infutor Data Solutions. (n.d.). <i>Property and residential history records</i> [Data set; proprietary]." },
  gps:      { label: "Mobile GPS data", apa: "Mobile device location data (provider to be specified) [Data set; proprietary]. Residence and monthly mobility location clusters." },
  nsi:      { label: "USACE NSI", url: "https://www.hec.usace.army.mil/confluence/nsi/technicalreferences/latest/technical-documentation",
              apa: "U.S. Army Corps of Engineers, Hydrologic Engineering Center. (n.d.). <i>National Structure Inventory (NSI): Technical documentation</i> [Data set].",
              note: "Attribute table: https://www.hec.usace.army.mil/confluence/nsi/userguides/survey-tool/attribute-guide" },
  nhc:      { label: "NHC GIS", url: "https://www.nhc.noaa.gov/gis/",
              apa: "National Hurricane Center. (n.d.). <i>GIS data: Forecast track and best track</i> [Data set]. National Oceanic and Atmospheric Administration." },
  nri:      { label: "FEMA NRI", url: "https://resilience.climate.gov/datasets/FEMA::national-risk-index-census-tracts/about",
              apa: "Federal Emergency Management Agency. (n.d.). <i>National Risk Index: Census tracts</i> [Data set]." },
  modis:    { label: "NASA LANCE MODIS", url: "https://lance.modaps.eosdis.nasa.gov/flood/viewer/",
              apa: "NASA Land, Atmosphere Near real-time Capability for EOS. (n.d.). <i>MODIS near real-time global flood product</i> [Data set]." },
  floodins: { label: "Flood insurance rates", url: "https://www.insuranceforgood.org/flood-insurance",
              apa: "<i>Flood insurance</i> [Web page]. (n.d.). insuranceforgood.org." }
});
