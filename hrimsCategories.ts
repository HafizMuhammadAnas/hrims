// HRIMS Categories, Subcategories, and Indicators Mapping
// Based on the document: Categories for HRIMS.docx.pdf

export interface HRIMSIndicator {
    id: string;
    text: string;
}

export interface HRIMSSubcategory {
    id: string;
    name: string;
    indicators: HRIMSIndicator[];
}

export interface HRIMSCategory {
    id: string;
    name: string;
    subcategories: HRIMSSubcategory[];
}

export const HRIMS_CATEGORIES: HRIMSCategory[] = [
    {
        id: 'legal-institutional',
        name: 'Legal & Institutional Framework',
        subcategories: [
            {
                id: 'legal-reforms',
                name: 'Legal Reforms',
                indicators: [
                    { id: 'ind-1-1-1', text: 'No. and detail of laws passed by the Provinces and Federation in compliance with Human Rights Treaties ratified by Pakistan.' },
                    { id: 'ind-1-1-2', text: 'No. and detail of Policies/strategies introduced at Federal and Provincial levels in compliance with Human Rights Treaties ratified by Pakistan.' }
                ]
            },
            {
                id: 'judicial-oversight',
                name: 'Judicial Oversight and Remedy',
                indicators: [
                    { id: 'ind-1-2-1', text: 'No. of Complaints invoked along with final outcome with detail of remedies provided under Article 184 (3) and 199 of the Constitution before the Provincial High Courts and SC.' }
                ]
            },
            {
                id: 'trainings-capacity',
                name: 'Trainings and Capacity building',
                indicators: [
                    { id: 'ind-1-3-1', text: 'No. of training sessions provided to judges, lawyers and law enforcement officials on the provisions of the Human Rights treaties/international standards including Mendez Principal, Mandela Rules and their justiciability.' }
                ]
            },
            {
                id: 'nhris-functioning',
                name: 'Effective functioning of NHRIs',
                indicators: [
                    { id: 'ind-1-4-1', text: 'No. of complaints received along with detail of final outcome (reparation/remedy) of complaints including referrals made by NCHR, NCRC, NCSW, Commission on Protection of Journalists, Commission on Enforced Disappearances.' },
                    { id: 'ind-1-4-2', text: 'No. and details of visits to public institutions including jails, hospitals, educational institutes and others as per mandate of NHRIs.' },
                    { id: 'ind-1-4-3', text: 'No. and detail of policy papers published on important human rights issues.' }
                ]
            }
        ]
    },
    {
        id: 'equality-non-discrimination',
        name: 'Equality and Non-discrimination',
        subcategories: [
            {
                id: 'gender-equality',
                name: 'Gender equality',
                indicators: [
                    { id: 'ind-2-1-1', text: 'No. and detail of complaints registered and relief provided in cases of violence against women, transgender community all across Pakistan. Specific details on following categories be provided disaggregated on the basis of age, disability, ethnicity, urban/ rural areas: i. Rape, ii. Gang rape, iii. Murder/femicide, iv. Infanticide, v. Honour killings, vi. Dowry related deaths, vii. Acid attack, viii. Molestation, ix. Incest, x. Kidnappings, xi. Harassment/threats, xii. Harassment at workplace, xiii. Domestic violence, xiv. Technology facilitated violence against women/ online harassment.' },
                    { id: 'ind-2-1-2', text: 'Gender parity in education, labour force participation and leadership position.' },
                    { id: 'ind-2-1-3', text: 'Female to male ratio in education.' }
                ]
            },
            {
                id: 'religious-minorities',
                name: 'Religious minorities',
                indicators: []
            },
            {
                id: 'ethnic-minorities',
                name: 'Ethnic minorities',
                indicators: []
            },
            {
                id: 'caste-discrimination',
                name: 'Caste-based discrimination',
                indicators: []
            },
            {
                id: 'older-persons',
                name: 'Older persons',
                indicators: []
            },
            {
                id: 'refugees-migrants',
                name: 'Refugees/migrants',
                indicators: []
            },
            {
                id: 'persons-disabilities',
                name: 'Persons with disabilities',
                indicators: []
            },
            {
                id: 'non-discrimination-services',
                name: 'Non-discrimination in access to public services',
                indicators: []
            }
        ]
    },
    {
        id: 'right-life-integrity',
        name: 'Right to Life & Integrity',
        subcategories: [
            {
                id: 'death-penalty',
                name: 'Death penalty (scope, safeguards, juveniles, PWD)',
                indicators: [
                    { id: 'ind-3-1-1', text: 'Total number of persons (juveniles, women, and PWDs, transgender, foreign nationals) on death row.' }
                ]
            },
            {
                id: 'extrajudicial-killings',
                name: 'Extrajudicial killings (police, military, counter-terrorism)',
                indicators: [
                    { id: 'ind-3-2-1', text: 'Total number of custodial deaths subjected to independent judicial and administrative inquiry No. of reported extra judicial killings investigated annually by external and internal oversight bodies.' }
                ]
            },
            {
                id: 'custodial-deaths',
                name: 'Custodial deaths',
                indicators: []
            },
            {
                id: 'maternal-mortality',
                name: 'Maternal mortality',
                indicators: []
            },
            {
                id: 'environmental-deaths',
                name: 'Environmental/climate-related deaths',
                indicators: []
            },
            {
                id: 'honour-killings',
                name: 'Honour killings, acid attacks, dowry deaths',
                indicators: [
                    { id: 'ind-3-6-1', text: 'Number of cases of honour killings, acid attacks, dowry deaths, prosecuted each year.' }
                ]
            }
        ]
    },
    {
        id: 'freedom-torture',
        name: 'Freedom from Torture & Ill-Treatment',
        subcategories: [
            {
                id: 'legal-definition',
                name: 'Legal definition and criminalization',
                indicators: []
            },
            {
                id: 'safeguards-custody',
                name: 'Safeguards in custody (lawyer, family, doctor access)',
                indicators: []
            },
            {
                id: 'investigation-prosecution',
                name: 'Investigation and prosecution of torture',
                indicators: [
                    { id: 'ind-4-3-1', text: 'Total number of cases' }
                ]
            },
            {
                id: 'coerced-confessions',
                name: 'Exclusion of coerced confessions',
                indicators: []
            },
            {
                id: 'independent-oversight',
                name: 'Independent oversight (Commissions, Judicial Officers etc)',
                indicators: []
            },
            {
                id: 'custodial-sexual-violence',
                name: 'Custodial sexual violence',
                indicators: []
            },
            {
                id: 'rehabilitation-victims',
                name: 'Rehabilitation of victims',
                indicators: []
            },
            {
                id: 'training-officials',
                name: 'Training of officials (Istanbul Protocol)',
                indicators: []
            }
        ]
    },
    {
        id: 'liberty-security',
        name: 'Liberty, Security & Due Process',
        subcategories: [
            {
                id: 'arbitrary-arrest',
                name: 'Arbitrary arrest and detention',
                indicators: []
            },
            {
                id: 'habeas-corpus',
                name: 'Habeas corpus remedies',
                indicators: []
            },
            {
                id: 'pre-trial-detention',
                name: 'Length of pre-trial detention',
                indicators: []
            },
            {
                id: 'fair-trial',
                name: 'Fair trial rights',
                indicators: [
                    { id: 'ind-5-4-1', text: 'Review the legislation relating to prisons to ensure that it accords with the United Nations Standard Minimum Rules for the Treatment of Prisoners (the Nelson Mandela Rules) (UPR)' }
                ]
            },
            {
                id: 'military-courts',
                name: 'Military courts jurisdiction',
                indicators: []
            },
            {
                id: 'witness-protection',
                name: 'Witness protection programs',
                indicators: []
            },
            {
                id: 'counter-terrorism',
                name: 'Counter-terrorism laws and safeguards',
                indicators: []
            },
            {
                id: 'juvenile-justice',
                name: 'Juvenile justice',
                indicators: []
            }
        ]
    },
    {
        id: 'access-justice',
        name: 'Access to Justice & Judiciary',
        subcategories: [
            {
                id: 'independence-courts',
                name: 'Independence of courts',
                indicators: []
            },
            {
                id: 'case-backlog',
                name: 'Case backlog and delays',
                indicators: []
            },
            {
                id: 'legal-aid',
                name: 'Legal aid availability',
                indicators: []
            },
            {
                id: 'access-women-minorities',
                name: 'Access to justice for women and minorities',
                indicators: []
            },
            {
                id: 'disability-friendly-courts',
                name: 'Disability-friendly courts',
                indicators: []
            },
            {
                id: 'specialized-courts',
                name: 'Specialized courts (family, anti-terrorism, child courts)',
                indicators: []
            },
            {
                id: 'alternative-dispute',
                name: 'Alternative dispute resolution',
                indicators: []
            },
            {
                id: 'protection-defenders',
                name: 'Protection of human rights defenders in litigation',
                indicators: []
            }
        ]
    },
    {
        id: 'fundamental-freedoms',
        name: 'Fundamental Freedoms',
        subcategories: [
            {
                id: 'freedom-expression',
                name: 'Freedom of Expression and Media',
                indicators: [
                    { id: 'ind-7-1-1', text: 'Constitutional and statutory safeguards for media freedom; protection of journalists and digital defenders (cases only); regulation of cyber harassment, hate speech, and disinformation under PECA and relevant provincial laws; institutional independence of PEMRA and PTA.' }
                ]
            },
            {
                id: 'freedom-assembly',
                name: 'Freedom of Assembly',
                indicators: [
                    { id: 'ind-7-2-1', text: 'Legal and administrative frameworks for peaceful assembly; mechanisms for police coordination; compliance with international standards on use of force; protection of protestors and accountability measure.' }
                ]
            },
            {
                id: 'freedom-association',
                name: 'Freedom of Association - number of pending cases for registration of NGOs',
                indicators: [
                    { id: 'ind-7-3-1', text: 'Registration and regulation of civil society, labour unions, and NGOs; transparency of registration under Societies, Trade Union, and Trust/Charities Acts; barriers to collective bargaining and NGO operations' }
                ]
            },
            {
                id: 'freedom-religion',
                name: 'Freedom of Religion - number of cases registered and pending cases pertaining to blasphemy under S 294 etc',
                indicators: [
                    { id: 'ind-7-4-1', text: 'Legal guarantees for religious freedom; safeguards against forced conversions; regulation of religious institutions; promotion of interfaith harmony and inclusive education. Effectively apply and implement existing legislative protections against blasphemy laws' }
                ]
            },
            {
                id: 'privacy-data',
                name: 'Right to Privacy and Data Protection',
                indicators: [
                    { id: 'ind-7-5-1', text: 'Constitutional right to privacy; establishment of data protection authority; monitoring of surveillance practices; digital privacy and data handling compliance under emerging legal frameworks.' }
                ]
            }
        ]
    },
    {
        id: 'participation-public',
        name: 'Participation and Public Life',
        subcategories: [
            {
                id: 'electoral-participation',
                name: 'Electoral Participation (disaggregated data based on ethnicities, gender, other vulnerabilities, age and area)',
                indicators: [
                    { id: 'ind-8-1-1', text: 'Universal suffrage; inclusivity of voter registration; representation of women, minorities, and PWDs, Transgender; area wise segregation electoral transparency and integrity; Compartmentalization of elections' }
                ]
            },
            {
                id: 'political-representation',
                name: 'Political Representation',
                indicators: [
                    { id: 'ind-8-2-1', text: 'Mechanisms for reserved seats; promotion of women and minority candidates; enforcement of political financing transparency.' }
                ]
            },
            {
                id: 'access-public-office',
                name: 'Access to Public Office and Civil Service',
                indicators: [
                    { id: 'ind-8-3-1', text: 'Merit-based recruitment; diversity inclusion in civil services; training on rights-based governance and accountability.' }
                ]
            },
            {
                id: 'civil-society',
                name: 'Civil Society and Human Rights Defenders',
                indicators: [
                    { id: 'ind-8-4-1', text: 'Legal protection for CSOs; enabling environment for advocacy and NGO participation in policymaking; coordination with MoHR.' }
                ]
            }
        ]
    },
    {
        id: 'refugees-asylum',
        name: 'Refugees, Asylum Seekers, and Statelessness',
        subcategories: [
            {
                id: 'asylum-procedures',
                name: 'Asylum Procedures and Protection',
                indicators: [
                    { id: 'ind-9-1-1', text: 'Legal and procedural framework for asylum under SAFRON and UNHCR coordination; non-refoulement safeguards and humane treatment.' }
                ]
            },
            {
                id: 'refugee-documentation',
                name: 'Refugee Documentation and Access to Services - Number of PoRs issued to refugees',
                indicators: [
                    { id: 'ind-9-2-1', text: 'Registration and documentation for refugees; access to health, education, and livelihoods; gender-sensitive protection approaches.' }
                ]
            },
            {
                id: 'statelessness-prevention',
                name: 'Statelessness Prevention and Reduction No. of Bengalis, Biharis etc',
                indicators: [
                    { id: 'ind-9-3-1', text: 'Legal recognition and documentation processes; strengthening of NADRA birth registration; reforms to reduce statelessness.' }
                ]
            },
            {
                id: 'migrant-workers',
                name: 'Migrant Workers',
                indicators: [
                    { id: 'ind-9-4-1', text: 'Regulation of overseas recruitment; bilateral agreements ensuring migrant safety; pre-departure training and labour protections.' }
                ]
            }
        ]
    },
    {
        id: 'work-conditions',
        name: 'Work and Just Conditions',
        subcategories: [
            {
                id: 'right-work',
                name: 'Right to Work',
                indicators: [
                    { id: 'ind-10-1-1', text: 'Constitutional and legal guarantees for employment; equal opportunities for women and PWDs etc; promotion of skills development and entrepreneurship.' }
                ]
            },
            {
                id: 'safe-working',
                name: 'Safe and Fair Working Conditions',
                indicators: [
                    { id: 'ind-10-2-1', text: 'Enforcement of occupational safety and health laws; labour inspections; elimination of child and bonded labour.' }
                ]
            },
            {
                id: 'wages-benefits',
                name: 'Wages and Benefits',
                indicators: [
                    { id: 'ind-10-3-1', text: 'Minimum wage enforcement; bridging informal sector protections; collective bargaining mechanisms for fair labour practices.' }
                ]
            },
            {
                id: 'workplace-harassment',
                name: 'Workplace Harassment and Discrimination',
                indicators: [
                    { id: 'ind-10-4-1', text: 'Enforcement of the Harassment Act; compliance audits and training; improved access to workplace redress mechanisms.' }
                ]
            }
        ]
    },
    {
        id: 'social-security',
        name: 'Social Security and Protection',
        subcategories: [
            {
                id: 'social-assistance',
                name: 'Social Assistance',
                indicators: [
                    { id: 'ind-11-1-1', text: 'Integration of BISP, Ehsaas, and provincial programmes; inclusion of marginalized and vulnerable groups.' }
                ]
            }
        ]
    },
    {
        id: 'education',
        name: 'Education',
        subcategories: [
            {
                id: 'right-education',
                name: 'Right to Education',
                indicators: [
                    { id: 'ind-12-1-1', text: 'Universal access to quality education; enrollment rates; literacy programs.' }
                ]
            }
        ]
    },
    {
        id: 'housing',
        name: 'Housing',
        subcategories: [
            {
                id: 'right-housing',
                name: 'Right to Adequate Housing',
                indicators: [
                    { id: 'ind-13-1-1', text: 'Access to adequate housing; housing policies and programs.' }
                ]
            }
        ]
    },
    {
        id: 'food-water',
        name: 'Food and Water',
        subcategories: [
            {
                id: 'right-food',
                name: 'Right to Food',
                indicators: [
                    { id: 'ind-14-1-1', text: 'Food security; nutrition programs; access to safe food.' }
                ]
            },
            {
                id: 'right-water',
                name: 'Right to Water',
                indicators: [
                    { id: 'ind-14-2-1', text: 'Access to clean water; water quality and availability.' }
                ]
            }
        ]
    },
    {
        id: 'women-rights',
        name: 'Women Rights',
        subcategories: [
            {
                id: 'violence-against-women',
                name: 'Violence against Women',
                indicators: [
                    { id: 'ind-15-1-1', text: 'Cases of violence against women; protection mechanisms; support services.' }
                ]
            },
            {
                id: 'economic-empowerment',
                name: 'Economic Empowerment',
                indicators: [
                    { id: 'ind-15-2-1', text: 'Access to land ownership, credit, and education in rural areas; rural women cooperatives and initiatives' }
                ]
            },
            {
                id: 'personal-laws',
                name: 'Discriminatory Personal Laws',
                indicators: [
                    { id: 'ind-15-3-1', text: 'Review of marriage, divorce, and inheritance laws; case outcomes reflecting gender equality' }
                ]
            }
        ]
    },
    {
        id: 'minority-rights',
        name: 'Minority Rights',
        subcategories: [
            {
                id: 'anti-discrimination',
                name: 'Anti-Discrimination Legislation',
                indicators: [
                    { id: 'ind-16-1-1', text: 'Existence and enforcement of anti-discrimination laws; complaints registered under these laws' }
                ]
            },
            {
                id: 'hate-speech',
                name: 'Hate Speech and Incitement Protection',
                indicators: [
                    { id: 'ind-16-2-1', text: 'Number of prosecutions related to hate speech; monitoring mechanisms in media and digital spaces' }
                ]
            },
            {
                id: 'violence-minorities',
                name: 'Violence against Minorities',
                indicators: [
                    { id: 'ind-16-3-1', text: 'Reported cases and accountability outcomes; state protection mechanisms for targeted groups' }
                ]
            },
            {
                id: 'access-education-jobs',
                name: 'Access to Education and Jobs',
                indicators: [
                    { id: 'ind-16-4-1', text: 'Minority representation in schools, universities, and public employment including judiciary and civil services' }
                ]
            },
            {
                id: 'representation-public',
                name: 'Representation in Public Life',
                indicators: [
                    { id: 'ind-16-5-1', text: 'Number of minority representatives in local and national governance structures' }
                ]
            },
            {
                id: 'segregation',
                name: 'Segregation and Ghettoization',
                indicators: [
                    { id: 'ind-16-6-1', text: 'Studies or reports on spatial segregation; initiatives for social integration' }
                ]
            },
            {
                id: 'caste-descent',
                name: 'Caste and Descent-Based Discrimination',
                indicators: [
                    { id: 'ind-16-7-1', text: 'Existence of policies prohibiting caste and religious-based exclusion; complaints registered and resolved' }
                ]
            },
            {
                id: 'land-rights',
                name: 'Land Rights and Forced Displacement',
                indicators: [
                    { id: 'ind-16-8-1', text: 'Incidents of displacement; land restitution or compensation programs for affected minorities' }
                ]
            },
            {
                id: 'welfare-schemes',
                name: 'Welfare Schemes',
                indicators: [
                    { id: 'ind-16-9-1', text: 'Details of welfare schemes for minorities including refurbishment of places of worship etc' }
                ]
            }
        ]
    },
    {
        id: 'disability-rights',
        name: 'Disability Rights',
        subcategories: [
            {
                id: 'accessibility-spaces',
                name: 'Accessibility of Public Spaces',
                indicators: [
                    { id: 'ind-17-1-1', text: 'Audit reports on public buildings\' accessibility; compliance with accessibility standards' }
                ]
            },
            {
                id: 'accessible-ict',
                name: 'Accessible ICT and Transport',
                indicators: [
                    { id: 'ind-17-2-1', text: 'Percentage of public transport and government websites compliant with accessibility standards' }
                ]
            },
            {
                id: 'legal-capacity',
                name: 'Legal Capacity and Decision-Making Support',
                indicators: [
                    { id: 'ind-17-3-1', text: 'Existence of supported decision-making mechanisms; guardianship law reforms' }
                ]
            },
            {
                id: 'inclusive-education',
                name: 'Inclusive Education',
                indicators: [
                    { id: 'ind-17-4-1', text: 'Enrollment of children with disabilities in mainstream education; teacher training on inclusive pedagogy' }
                ]
            },
            {
                id: 'employment-inclusion',
                name: 'Employment and Workplace Inclusion',
                indicators: [
                    { id: 'ind-17-5-1', text: 'Employment rate of PWDs; workplace accommodations and quotas' }
                ]
            },
            {
                id: 'independent-living',
                name: 'Independent Living and Community Support',
                indicators: [
                    { id: 'ind-17-6-1', text: 'Number of community-based support programs; availability of assistive devices' }
                ]
            },
            {
                id: 'social-protection-pwd',
                name: 'Social Protection for PWD',
                indicators: [
                    { id: 'ind-17-7-1', text: 'Coverage under disability allowance schemes; eligibility criteria and accessibility of benefits' }
                ]
            },
            {
                id: 'access-justice-pwd',
                name: 'Access to Justice',
                indicators: [
                    { id: 'ind-17-8-1', text: 'Legal aid provided to PWDs; accessibility of courts and police stations' }
                ]
            },
            {
                id: 'participation-political',
                name: 'Participation in Political Life',
                indicators: [
                    { id: 'ind-17-9-1', text: 'Voter accessibility; representation of PWDs in political and decision-making bodies' }
                ]
            },
            {
                id: 'disability-data',
                name: 'Disability Data and Monitoring',
                indicators: [
                    { id: 'ind-17-10-1', text: 'Disaggregated data collection systems; periodic national disability surveys' }
                ]
            }
        ]
    },
    {
        id: 'culture-language',
        name: 'Culture, Language & Science',
        subcategories: [
            {
                id: 'cultural-life',
                name: 'Right to Participate in Cultural Life',
                indicators: [
                    { id: 'ind-18-1-1', text: 'Participation of citizens in cultural events; funding and promotion of cultural institutions' }
                ]
            },
            {
                id: 'scientific-progress',
                name: 'Access to Scientific Progress',
                indicators: [
                    { id: 'ind-18-2-1', text: 'Research and innovation funding; dissemination of scientific knowledge; access to technologies' }
                ]
            },
            {
                id: 'mother-tongue',
                name: 'Mother-Tongue Education',
                indicators: [
                    { id: 'ind-18-3-1', text: 'Number of schools offering instruction in mother tongues; teacher training for local languages' }
                ]
            },
            {
                id: 'cultural-heritage',
                name: 'Protection of Cultural Heritage',
                indicators: [
                    { id: 'ind-18-4-1', text: 'Inventory of protected sites; laws and enforcement measures to prevent cultural destruction' }
                ]
            },
            {
                id: 'minority-languages',
                name: 'Minority Languages',
                indicators: [
                    { id: 'ind-18-5-1', text: 'Preservation and promotion initiatives for minority languages; documentation programs; TV and radio shows' }
                ]
            },
            {
                id: 'digital-inclusion',
                name: 'Internet/Digital Inclusion',
                indicators: [
                    { id: 'ind-18-6-1', text: 'Percentage of population with internet access; gender and rural-urban digital divide' }
                ]
            }
        ]
    },
    {
        id: 'environment-climate',
        name: 'Environment, Climate & Business',
        subcategories: [
            {
                id: 'environmental-health',
                name: 'Environmental Health',
                indicators: [
                    { id: 'ind-19-1-1', text: 'Air and water quality indices; pollution-related morbidity and mortality rates; environmental inspections conducted' }
                ]
            },
            {
                id: 'climate-impacts',
                name: 'Climate Change Impacts on Rights',
                indicators: [
                    { id: 'ind-19-2-1', text: 'Number of climate-related disasters; adaptation and resilience programs for vulnerable populations; Number of studies and surveys conducted; capacity of NDMA and PDMAs' }
                ]
            },
            {
                id: 'clean-water-env',
                name: 'Right to Clean Water and Environment',
                indicators: [
                    { id: 'ind-19-3-1', text: 'Access to safe drinking water; water contamination levels; sanitation coverage' }
                ]
            },
            {
                id: 'business-human-rights',
                name: 'Business and Human Rights',
                indicators: [
                    { id: 'ind-19-4-1', text: 'Implementation of the UN Guiding Principles on Business and Human Rights; corporate human rights due diligence reports; progress on NAP-BHR; number of capacity building and awareness campaigns' }
                ]
            },
            {
                id: 'land-rights-development',
                name: 'Land Rights and Displacement by Development',
                indicators: [
                    { id: 'ind-19-5-1', text: 'Number of people displaced by development projects; rehabilitation and compensation frameworks; laws governing such cases' }
                ]
            },
            {
                id: 'corporate-accountability',
                name: 'Corporate Accountability and Due Diligence',
                indicators: [
                    { id: 'ind-19-6-1', text: 'Number of corporate human rights violations investigated and remedied; sustainability reporting compliance' }
                ]
            },
            {
                id: 'environmental-justice',
                name: 'Environmental Justice in Marginalized Areas',
                indicators: [
                    { id: 'ind-19-7-1', text: 'Impact assessments in low-income or minority areas; participation of affected communities in environmental decision-making' }
                ]
            },
            {
                id: 'environmental-legislation',
                name: 'Environmental Legislation and Governance',
                indicators: [
                    { id: 'ind-19-8-1', text: 'Number and scope of environmental protection laws; effectiveness of enforcement mechanisms; establishment and functioning of environmental tribunals and ombuds institutions' }
                ]
            },
            {
                id: 'sustainable-resources',
                name: 'Sustainable Resource Management',
                indicators: [
                    { id: 'ind-19-9-1', text: 'Policies and programs for sustainable forestry, fisheries, and land use; monitoring of natural resource exploitation; community-based resource management initiatives.' }
                ]
            },
            {
                id: 'biodiversity',
                name: 'Biodiversity and Ecosystem Protection',
                indicators: [
                    { id: 'ind-19-10-1', text: 'Number of protected areas and their management plans; endangered species monitoring; integration of biodiversity in national development planning' }
                ]
            },
            {
                id: 'climate-mitigation',
                name: 'Climate Mitigation and Energy Transition',
                indicators: [
                    { id: 'ind-19-11-1', text: 'National GHG emissions data; renewable energy share in total production; existence of carbon pricing or offset mechanisms; incentives for green technologies.' }
                ]
            },
            {
                id: 'disaster-risk',
                name: 'Disaster Risk Reduction and Management',
                indicators: [
                    { id: 'ind-19-12-1', text: 'Implementation of NDMA and PDMA plans; early warning systems; allocation of emergency funds; community-based disaster preparedness' }
                ]
            },
            {
                id: 'sustainable-infrastructure',
                name: 'Sustainable Infrastructure and Urban Planning',
                indicators: [
                    { id: 'ind-19-13-1', text: 'Number of green buildings certified; inclusion of environmental safeguards in infrastructure projects; sustainable transport systems' }
                ]
            },
            {
                id: 'indigenous-rights',
                name: 'Indigenous and Local Community Rights',
                indicators: [
                    { id: 'ind-19-14-1', text: 'Participation of indigenous and local communities in environmental decision-making; free, prior, and informed consent (FPIC) for development projects' }
                ]
            },
            {
                id: 'environmental-education',
                name: 'Environmental Education and Public Awareness',
                indicators: [
                    { id: 'ind-19-15-1', text: 'Integration of environmental education into curricula; awareness campaigns on climate change and sustainability; community outreach programs.' }
                ]
            },
            {
                id: 'environmental-data',
                name: 'Environmental Data and Transparency',
                indicators: [
                    { id: 'ind-19-16-1', text: 'Public availability of environmental impact assessments (EIAs); establishment of centralized data systems on pollution, emissions, and environmental spending' }
                ]
            },
            {
                id: 'just-transition',
                name: 'Just Transition and Green Jobs',
                indicators: [
                    { id: 'ind-19-17-1', text: 'Number of workers employed in renewable energy and sustainable sectors; policies supporting retraining of workers in fossil fuel industries' }
                ]
            },
            {
                id: 'access-environmental-justice',
                name: 'Access to Environmental Justice',
                indicators: [
                    { id: 'ind-19-18-1', text: 'Number of environmental cases filed and adjudicated; availability of legal aid for environmental litigation; functioning of environmental courts or tribunals' }
                ]
            }
        ]
    },
    {
        id: 'health',
        name: 'Health',
        subcategories: [
            {
                id: 'universal-health',
                name: 'Universal Health Coverage',
                indicators: [
                    { id: 'ind-20-1-1', text: 'Health security (monetary based) and insurance; strengthening primary care and rural health infrastructure; budget accountability.' }
                ]
            },
            {
                id: 'maternal-child',
                name: 'Maternal and Child Health',
                indicators: [
                    { id: 'ind-20-2-1', text: 'Antenatal and neonatal health standards; skilled birth attendance; maternal mortality reduction initiatives.' }
                ]
            },
            {
                id: 'srhr',
                name: 'Sexual and Reproductive Health and Rights (SRHR) - Percentage of contraceptive prevalence rate - Number of cases registered under 338A,B & C)',
                indicators: [
                    { id: 'ind-20-3-1', text: 'Access to family planning; adolescent health and awareness; prevention of GBV and harmful traditional practices;' }
                ]
            },
            {
                id: 'mental-health',
                name: 'Mental Health',
                indicators: [
                    { id: 'ind-20-4-1', text: 'Integration of mental health in primary healthcare; public awareness and stigma reduction campaigns; psychosocial support initiatives.' }
                ]
            },
            {
                id: 'hiv-aids',
                name: 'HIV/AIDS and Communicable Diseases',
                indicators: [
                    { id: 'ind-20-5-1', text: 'Prevalence and incidence rates; availability of testing and treatment centres; public awareness initiatives; national HIV/AIDS strategy implementation.' }
                ]
            },
            {
                id: 'ncd',
                name: 'Non-Communicable Diseases',
                indicators: [
                    { id: 'ind-20-6-1', text: 'Prevalence of major NCDs (cancer, diabetes, cardiovascular); existence of national NCD strategy; screening and prevention programs.' }
                ]
            },
            {
                id: 'disability-inclusive-health',
                name: 'Disability-Inclusive Health Services',
                indicators: [
                    { id: 'ind-20-7-1', text: 'Accessibility audits of hospitals; training for medical staff on disability inclusion; health cards or insurance coverage for PWDs.' }
                ]
            },
            {
                id: 'abortion-care',
                name: 'Abortion and Post-Abortion Care',
                indicators: [
                    { id: 'ind-20-8-1', text: 'Number of facilities offering safe abortion or post-abortion care; data on complications and mortality; policy alignment with women\'s health standards.' }
                ]
            },
            {
                id: 'contraception',
                name: 'Access to Contraception',
                indicators: [
                    { id: 'ind-20-9-1', text: 'Contraceptive prevalence rate; availability of family planning commodities; outreach initiatives for rural areas.' }
                ]
            },
            {
                id: 'health-budgets',
                name: 'Health Budgets and Financing',
                indicators: [
                    { id: 'ind-20-10-1', text: 'Proportion of national/provincial budget allocated to health; disaggregated provincial health expenditure; donor contributions to health sector.' }
                ]
            }
        ]
    }
];





