/*
 * Bibliography and data sources.
 * Cite a reference anywhere in content text with [@key], e.g. "[@peacock2003] found ...".
 * Fields: label (in-text form), url, note (optional),
 *   doi / pii / pmcid / pmid (optional): identifier used to load the citation record and abstract in the viewer,
 *   embed (optional true/false): force the viewer to try (or skip) showing the page itself.
 */
HM.references({
  pham2020:     { doi: "10.1175/WCAS-D-19-0030.1", label: "Pham et al. (2020a)", url: "https://journals.ametsoc.org/view/journals/wcas/12/2/wcas-d-19-0030.1.xml", note: "Hurricane Matthew; evacuation order timing and departure timing." },
  pham2020b:    { label: "Pham (2020b)", url: "https://rosap.ntl.bts.gov/view/dot/25769", note: "Survey of 300 households; reasons for staying in place." },
  huang2016:    { doi: "10.1177/0013916515578485", label: "Huang et al. (2016)", url: "https://doi.org/10.1177/0013916515578485", note: "Review and meta-analysis of hurricane evacuation studies." },
  peacock2003:  { doi: "10.1061/(ASCE)1527-6988(2003)4:3(149)", label: "Peacock (2003)", url: "https://ascelibrary.org/doi/epdf/10.1061/%28ASCE%291527-6988%282003%294%3A3%28149%29" },
  hasan2012:    { doi: "10.1061/(ASCE)TE.1943-5436.0000365", label: "Hasan et al. (2012)", url: "https://ascelibrary.org/doi/full/10.1061/%28ASCE%29TE.1943-5436.0000365", note: "Pre-print: https://www.cecs.ucf.edu/shasan/wp-content/uploads/2020/09/2012_Pre-print_Hasan_Transferability.pdf" },
  rincon2001:   { pii: "S073567570104414X", label: "Rincon (2001)", url: "https://www.sciencedirect.com/science/article/pii/S073567570104414X" },
  rigos2019:    { pii: "S0378437119304649", label: "Rigos (2019)", url: "https://www.sciencedirect.com/science/article/pii/S0378437119304649" },
  cryingwolf2015: { label: "“Crying wolf” (2015)", url: "https://books.google.com/books?id=IlquBAAAQBAJ&pg=PA209", note: "Crying wolf: Repeat responses to hurricane evacuation orders. Author to be added." },
  halim2021:    { doi: "10.1177/03611981211014529", label: "Halim (2021)", url: "https://journals.sagepub.com/doi/10.1177/03611981211014529" },
  horney2008:   { label: "Horney (2008)", url: "https://d1wqtxts1xzle7.cloudfront.net/55673985/2008_-_Factors_associated_with_hurricane_preparedness_-_Results_of_a_pre-hurricane_asssessment-libre.pdf", note: "Factors associated with hurricane preparedness: results of a pre-hurricane assessment. The original link was a signed, expiring download URL; replace with a stable DOI." },
  lazo2015:     { doi: "10.1111/risa.12407", label: "Lazo (2015)", url: "https://onlinelibrary.wiley.com/doi/10.1111/risa.12407" },
  dillon2011:   { doi: "10.1111/j.1539-6924.2010.01506.x", label: "Dillon et al. (2011)", url: "https://onlinelibrary.wiley.com/doi/full/10.1111/j.1539-6924.2010.01506.x" },
  eisenman2007: { doi: "10.2105/AJPH.2005.084335", label: "Eisenman (2007)", url: "https://ajph.aphapublications.org/doi/full/10.2105/AJPH.2005.084335" },
  kates1962:    { label: "Kates (1962)", url: "https://www.proquest.com/docview/302254676" },
  solis2010:    { label: "Solís et al. (2010)", url: "https://ageconsearch.umn.edu/bitstream/45338/2/DS.MT.DL.SAEA.2008.pdf" },
  karaye2019:   { pmcid: "PMC6861906", label: "Karaye et al. (2019)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6861906/" },
  tanim2022:    { pii: "S027249442100195X", label: "Tanim et al. (2022)", url: "https://www.sciencedirect.com/science/article/pii/S027249442100195X" },
  weller2016:   { doi: "10.1061/(ASCE)NH.1527-6996.0000217", label: "Weller (2016)", url: "https://ascelibrary.org/doi/10.1061/%28ASCE%29NH.1527-6996.0000217" },
  liao2026:     { label: "Liao (2026)", url: "https://media.rff.org/documents/WP_21-25_Updated_2026-05-13.pdf", note: "RFF working paper 21-25 (updated 2026-05-13)." },
  botzen2019:   { doi: "10.1007/s11166-019-09312-6", label: "Botzen (2019)", url: "https://link.springer.com/article/10.1007/s11166-019-09312-6" },
  kousky2020:   { doi: "10.1080/10527001.2020.1840131", label: "Kousky (2020)", url: "https://www.tandfonline.com/doi/full/10.1080/10527001.2020.1840131" },
  fema_ian:     { label: "FEMA report on Hurricane Ian", url: "https://www.iccsafe.org/building-safety-journal/bsj-technical/hurricane-ian-in-florida-a-mitigation-success-story-for-building-codes/", note: "Summarized in ICC Building Safety Journal: “Hurricane Ian in Florida: a mitigation success story for building codes”." },
  nahb2019:     { label: "NAHB (2019)", url: "https://www.nahb.org/advocacy/top-priorities/building-codes/Construction-Codes-Standards-Research/damage-assessment-from-hurricanes-harvey-and-irma/results-florida", note: "Damage assessment from Hurricanes Harvey and Irma: Florida results." },
  robert2010:   { doi: "10.1111/j.1540-6237.2010.00721.x", label: "Robert (2010)", url: "https://onlinelibrary.wiley.com/doi/10.1111/j.1540-6237.2010.00721.x" },
  dimasso2019:  { pii: "S027249441830207X", label: "Di Masso et al. (2019)", url: "https://www.sciencedirect.com/science/article/pii/S027249441830207X" },
  thompson2017: { doi: "10.1111/risa.12654", label: "Thompson et al. (2017)", url: "https://doi.org/10.1111/risa.12654" },
  thomas2016:   { doi: "10.1111/tran.12123", label: "Thomas et al. (2016)", url: "https://rgs-ibg.onlinelibrary.wiley.com/doi/10.1111/tran.12123" },
  horney2010a:  { doi: "10.1177/028072701002800102", label: "Horney et al. (2010a)", url: "https://doi.org/10.1177/028072701002800102", note: "Neighborhood cohesion and evacuation during Hurricane Isabel." },
  horney2010b:  { pmid: "20136748", label: "Horney et al. (2010b)", url: "https://pubmed.ncbi.nlm.nih.gov/20136748/", note: "Floodplain designation, perceived property flood risk and evacuation during Hurricane Isabel." },
  collins2017:  { doi: "10.1175/WCAS-D-17-0047.1", label: "Collins et al. (2017)", url: "https://doi.org/10.1175/WCAS-D-17-0047.1" },
  sadri2017:    { pii: "S1755534517300313", label: "Sadri et al. (2017)", url: "http://linkinghub.elsevier.com/retrieve/pii/S1755534517300313" },
  morss2016:    { doi: "10.1175/WAF-D-15-0066.1", label: "Morss et al. (2016)", url: "https://doi.org/10.1175/WAF-D-15-0066.1" },
  liu2025:      { pii: "S1361920924005169", label: "Liu et al. (2025)", url: "https://www.sciencedirect.com/science/article/pii/S1361920924005169" },
  collins2018:  { doi: "10.1175/WCAS-D-17-0119.1", label: "Collins et al. (2018)", url: "https://doi.org/10.1175/WCAS-D-17-0119.1" },
  na2022:       { pii: "S0925753521004069", label: "Na and Grace (2022)", url: "https://www.sciencedirect.com/science/article/pii/S0925753521004069" }
});

/*
 * Data sources. Reference a source from a metric with source: ["acs", ...].
 */
HM.sources({
  acs:      { label: "ACS 5-year", url: "https://data.census.gov/", note: "American Community Survey tables (B25035, B25036, B25038, B25039, B07001)." },
  infutor:  { label: "Infutor", note: "Proprietary property / residential history data." },
  gps:      { label: "Mobile GPS data", note: "Residence and monthly mobility location clusters." },
  nsi:      { label: "USACE NSI", url: "https://www.hec.usace.army.mil/confluence/nsi/technicalreferences/latest/technical-documentation", note: "National Structure Inventory. Attribute table: https://www.hec.usace.army.mil/confluence/nsi/userguides/survey-tool/attribute-guide" },
  nhc:      { label: "NHC GIS", url: "https://www.nhc.noaa.gov/gis/", note: "Forecast track and best track." },
  nri:      { label: "FEMA NRI", url: "https://resilience.climate.gov/datasets/FEMA::national-risk-index-census-tracts/about", note: "National Risk Index, census tracts." },
  modis:    { label: "NASA LANCE MODIS", url: "https://lance.modaps.eosdis.nasa.gov/flood/viewer/", note: "Near-real-time flood product." },
  floodins: { label: "Flood insurance rates", url: "https://www.insuranceforgood.org/flood-insurance" }
});
