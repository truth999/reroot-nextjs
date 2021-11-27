const factors = [
  {
    name: "diversity",
    sub_factors: [
      { name: "cultural", param: "diversity_cultural" },
      { name: "economic", param: "diversity_economic" },
      { name: "lgbt", param: "diversity_lgbt" },
    ],
  },
  {
    name: "environment",
    sub_factors: [
      { name: "air", param: "environment_air" },
      { name: "noise", param: "environment_noise" },
      { name: "water", param: "environment_water" },
    ],
  },
  {
    name: "housing",
    sub_factors: [
      { name: "mortgage", param: "housing_mortgage" },
      { name: "rent", param: "housing_rent" },
    ],
  },
  {
    name: "immigrant",
    sub_factors: [
      {
        name: "language",
        params: {
          arabic: "immigrant_language_arabic",
          chinese: "immigrant_language_chinese",
          other: "immigrant_language_other",
          spanish: "immigrant_language_spanish",
        },
      },
      {
        name: "origin",
        params: {
          china: "immigrant_origin_china",
          india: "immigrant_origin_india",
          mexico: "immigrant_origin_mexico",
          other: "immigrant_origin_other",
        },
      },
    ],
  },
  {
    name: "opportunity",
    sub_factors: [
      { name: "employment", param: "opportunity_employment" },
      {
        name: "population",
        params: {
          high: "opportunity_population_high",
          low: "opportunity_population_low",
          medium: "opportunity_population_medium",
        },
      },
    ],
  },
  {
    name: "service",
    sub_factors: [
      { name: "banking", param: "service_banking" },
      { name: "internet", param: "service_internet" },
      { name: "library", param: "service_library" },
      { name: "medical", param: "service_medical" },
      { name: "senior", param: "service_senior" },
      { name: "transportation", param: "service_transportation" },
    ],
  },
  {
    name: "tax",
    sub_factors: [
      { name: "education", param: "tax_education" },
      { name: "other", param: "tax_other" },
      { name: "welfare", param: "tax_welfare" },
    ],
  },
  {
    name: "vote",
    sub_factors: [
      { name: "local", param: "vote_local" },
      { name: "national", param: "vote_national" },
    ],
  },
];

export default factors;
