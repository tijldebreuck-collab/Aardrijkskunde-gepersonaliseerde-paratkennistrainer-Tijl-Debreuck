const countryIdMap: Record<number, string> = {
  242: "wd-l-242", // Fiji
  834: "wd-l-834", // Tanzania
  732: "wd-l-732", // W. Sahara
  124: "wd-l-124", // Canada
  840: "wd-l-840", // United States of America
  398: "wd-l-398", // Kazakhstan
  860: "wd-l-860", // Uzbekistan
  598: "wd-l-598", // Papua New Guinea
  360: "wd-l-360", // Indonesia
  32: "wd-l-32", // Argentina
  152: "wd-l-152", // Chile
  180: "wd-l-180", // Dem. Rep. Congo
  706: "wd-l-706", // Somalia
  404: "wd-l-404", // Kenya
  729: "wd-l-729", // Sudan
  148: "wd-l-148", // Chad
  332: "wd-l-332", // Haiti
  214: "wd-l-214", // Dominican Rep.
  643: "wd-l-643", // Russia
  44: "wd-l-44", // Bahamas
  238: "wd-l-238", // Falkland Is.
  578: "wd-l-578", // Norway
  304: "wd-l-304", // Greenland
  260: "wd-l-260", // Fr. S. Antarctic Lands
  626: "wd-l-626", // Timor-Leste
  710: "wd-l-710", // South Africa
  426: "wd-l-426", // Lesotho
  484: "wd-l-484", // Mexico
  858: "wd-l-858", // Uruguay
  76: "wd-l-76", // Brazil
  68: "wd-l-68", // Bolivia
  604: "wd-l-604", // Peru
  170: "wd-l-170", // Colombia
  591: "wd-l-591", // Panama
  188: "wd-l-188", // Costa Rica
  558: "wd-l-558", // Nicaragua
  340: "wd-l-340", // Honduras
  222: "wd-l-222", // El Salvador
  320: "wd-l-320", // Guatemala
  84: "wd-l-84", // Belize
  862: "wd-l-862", // Venezuela
  328: "wd-l-328", // Guyana
  740: "wd-l-740", // Suriname
  250: "wd-l-250", // France
  218: "wd-l-218", // Ecuador
  630: "wd-l-630", // Puerto Rico
  388: "wd-l-388", // Jamaica
  192: "wd-l-192", // Cuba
  716: "wd-l-716", // Zimbabwe
  72: "wd-l-72", // Botswana
  516: "wd-l-516", // Namibia
  686: "wd-l-686", // Senegal
  466: "wd-l-466", // Mali
  478: "wd-l-478", // Mauritania
  204: "wd-l-204", // Benin
  562: "wd-l-562", // Niger
  566: "wd-l-566", // Nigeria
  120: "wd-l-120", // Cameroon
  768: "wd-l-768", // Togo
  288: "wd-l-288", // Ghana
  384: "wd-l-384", // Côte d'Ivoire
  324: "wd-l-324", // Guinea
  624: "wd-l-624", // Guinea-Bissau
  430: "wd-l-430", // Liberia
  694: "wd-l-694", // Sierra Leone
  854: "wd-l-854", // Burkina Faso
  140: "wd-l-140", // Central African Rep.
  178: "wd-l-178", // Congo
  266: "wd-l-266", // Gabon
  226: "wd-l-226", // Eq. Guinea
  894: "wd-l-894", // Zambia
  454: "wd-l-454", // Malawi
  508: "wd-l-508", // Mozambique
  748: "wd-l-748", // eSwatini
  24: "wd-l-24", // Angola
  108: "wd-l-108", // Burundi
  376: "wd-l-376", // Israel
  422: "wd-l-422", // Lebanon
  450: "wd-l-450", // Madagascar
  275: "wd-l-275", // Palestine
  270: "wd-l-270", // Gambia
  788: "wd-l-788", // Tunisia
  12: "wd-l-12", // Algeria
  400: "wd-l-400", // Jordan
  784: "wd-l-784", // United Arab Emirates
  634: "wd-l-634", // Qatar
  414: "wd-l-414", // Kuwait
  368: "wd-l-368", // Iraq
  512: "wd-l-512", // Oman
  548: "wd-l-548", // Vanuatu
  116: "wd-l-116", // Cambodia
  764: "wd-l-764", // Thailand
  418: "wd-l-418", // Laos
  104: "wd-l-104", // Myanmar
  704: "wd-l-704", // Vietnam
  408: "wd-l-408", // North Korea
  410: "wd-l-410", // South Korea
  496: "wd-l-496", // Mongolia
  356: "wd-l-356", // India
  50: "wd-l-50", // Bangladesh
  64: "wd-l-64", // Bhutan
  524: "wd-l-524", // Nepal
  586: "wd-l-586", // Pakistan
  4: "wd-l-4", // Afghanistan
  762: "wd-l-762", // Tajikistan
  417: "wd-l-417", // Kyrgyzstan
  795: "wd-l-795", // Turkmenistan
  364: "wd-l-364", // Iran
  760: "wd-l-760", // Syria
  51: "wd-l-51", // Armenia
  752: "wd-l-752", // Sweden
  112: "wd-l-112", // Belarus
  804: "wd-l-804", // Ukraine
  616: "wd-l-616", // Poland
  40: "wd-l-40", // Austria
  348: "wd-l-348", // Hungary
  498: "wd-l-498", // Moldova
  642: "wd-l-642", // Romania
  440: "wd-l-440", // Lithuania
  428: "wd-l-428", // Latvia
  233: "wd-l-233", // Estonia
  276: "wd-l-276", // Germany
  100: "wd-l-100", // Bulgaria
  300: "wd-l-300", // Greece
  792: "wd-l-792", // Turkey
  8: "wd-l-8", // Albania
  191: "wd-l-191", // Croatia
  756: "wd-l-756", // Switzerland
  442: "wd-l-442", // Luxembourg
  56: "wd-l-56", // Belgium
  528: "wd-l-528", // Netherlands
  620: "wd-l-620", // Portugal
  724: "wd-l-724", // Spain
  372: "wd-l-372", // Ireland
  540: "wd-l-540", // New Caledonia
  90: "wd-l-90", // Solomon Is.
  554: "wd-l-554", // New Zealand
  36: "wd-l-36", // Australia
  144: "wd-l-144", // Sri Lanka
  156: "wd-l-156", // China
  158: "wd-l-158", // Taiwan
  380: "wd-l-380", // Italy
  208: "wd-l-208", // Denmark
  826: "wd-l-826", // United Kingdom
  352: "wd-l-352", // Iceland
  31: "wd-l-31", // Azerbaijan
  268: "wd-l-268", // Georgia
  608: "wd-l-608", // Philippines
  458: "wd-l-458", // Malaysia
  96: "wd-l-96", // Brunei
  705: "wd-l-705", // Slovenia
  246: "wd-l-246", // Finland
  703: "wd-l-703", // Slovakia
  203: "wd-l-203", // Czechia
  232: "wd-l-232", // Eritrea
  392: "wd-l-392", // Japan
  600: "wd-l-600", // Paraguay
  887: "wd-l-887", // Yemen
  682: "wd-l-682", // Saudi Arabia
  10: "wd-l-10", // Antarctica
  196: "wd-l-196", // Cyprus
  504: "wd-l-504", // Morocco
  818: "wd-l-818", // Egypt
  434: "wd-l-434", // Libya
  231: "wd-l-231", // Ethiopia
  262: "wd-l-262", // Djibouti
  800: "wd-l-800", // Uganda
  646: "wd-l-646", // Rwanda
  70: "wd-l-70", // Bosnia and Herz.
  807: "wd-l-807", // Macedonia
  688: "wd-l-688", // Serbia
  499: "wd-l-499", // Montenegro
  780: "wd-l-780", // Trinidad and Tobago
  728: "wd-l-728", // S. Sudan
};