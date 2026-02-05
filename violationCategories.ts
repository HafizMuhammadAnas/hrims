// Violation Categories and Sub-categories Mapping

export interface ViolationIndicator {
    id: string;
    name: string;
}

export interface ViolationSubCategory {
    id: string;
    name: string;
    indicators?: ViolationIndicator[];
}

export interface ViolationCategory {
    id: string;
    name: string;
    subCategories: ViolationSubCategory[];
}

export const VIOLATION_CATEGORIES: ViolationCategory[] = [
    {
        id: 'labor-rights',
        name: 'Labor Rights of HRDs / Journalists (Violation)',
        subCategories: [
            {
                id: 'violation',
                name: 'Violation',
                indicators: [
                    { id: 'none', name: '- None -' },
                    { id: 'unfair-labour-practice', name: 'Unfair Labour practice' },
                    { id: 'minimum-wages', name: 'Minimum Wages' },
                    { id: 'job-related-issues', name: 'Job related issues' },
                    { id: 'freedom-of-association', name: 'Freedom of association' },
                    { id: 'bonded-labour', name: 'Bonded Labour' },
                    { id: 'domestic-labour', name: 'domestic Labour' }
                ]
            }
        ]
    },
    {
        id: 'women-hrds',
        name: 'Women HRDs / Journalists',
        subCategories: [
            {
                id: 'gender-based-violence',
                name: 'Gender Based Violence',
                indicators: [
                    { id: 'forced-marriages', name: 'Forced Marriages' },
                    { id: 'kidnapping-from-ransom', name: 'Kidnapping from ransom' },
                    { id: 'kidnapping', name: 'Kidnapping' },
                    { id: 'harassment-public-place', name: 'Harassment at Public place' },
                    { id: 'gang-rape', name: 'Gang Rape' },
                    { id: 'exploitation-domestic-workers', name: 'Exploitation of Domestic Workers' },
                    { id: 'forced-labor', name: 'Forced labor' },
                    { id: 'emotional-violence', name: 'Emotional Violence' },
                    { id: 'dowry-related-violence', name: 'Dowry-Related Violence' },
                    { id: 'custodial-rape', name: 'Custodial Rape' },
                    { id: 'beating', name: 'Beating' },
                    { id: 'attempt-to-murder', name: 'Attempt to murder' },
                    { id: 'amputation-hurt', name: 'Amputation/Hurt' },
                    { id: 'acid-throwing', name: 'Acid Throwing' },
                    { id: 'abductions', name: 'Abductions' },
                    { id: 'trafficking-women-prostitution', name: 'Trafficking of Women for Prostitution' },
                    { id: 'trafficking-girls-women', name: 'Trafficking of Girls and Women' },
                    { id: 'social-economic-abuse', name: 'Social and economic abuse' },
                    { id: 'sexual-violence', name: 'Sexual Violence' },
                    { id: 'sexual-harassment-workplace', name: 'Sexual Harassment at Work place' },
                    { id: 'setting-on-fire', name: 'Setting on Fire' },
                    { id: 'rape', name: 'Rape' },
                    { id: 'physical-violence', name: 'Physical Violence' }
                ]
            },
            {
                id: 'cyber-crime',
                name: 'Cyber Crime',
                indicators: [] // No third layer for Cyber Crime
            },
            {
                id: 'harassment-workplace',
                name: 'Harassment at Workplace',
                indicators: [
                    { id: 'intimidation', name: 'Intimidation' },
                    { id: 'sexually-demeaning-attitude', name: 'Sexually Demeaning Attitude' },
                    { id: 'sexual-comments', name: 'Sexual Comments' },
                    { id: 'request-sexual-favor', name: 'Request for Sexual Favor' },
                    { id: 'offensive-gestures-staring', name: 'Offensive Gestures, Staring' }
                ]
            }
        ]
    },
    {
        id: 'protection-life-liberty',
        name: 'Protection of Life Liberty',
        subCategories: [
            { id: 'journalist', name: 'Journalist' },
            { id: 'hr-defenders', name: 'HR Defenders' },
            { id: 'rights-hrds-journalists-prison', name: 'Rights of HRDs / Journalists in Prison' },
            { id: 'torture-hrds-journalists', name: 'Torture on HRDs / Journalists' }
        ]
    },
    {
        id: 'minority-rights',
        name: 'Minority Rights of HRDs / Journalists',
        subCategories: [
            { id: 'minorities', name: 'Minorities' }
        ]
    },
    {
        id: 'religious-rights',
        name: 'Violation of Religious Rights',
        subCategories: [
            { id: 'blasphemy', name: 'Blasphemy' },
            { id: 'sectarian-violence', name: 'Sectarian Violence' }
        ]
    },
    {
        id: 'transgender-rights',
        name: 'Transgender Rights',
        subCategories: [
            { id: 'gbv', name: 'GBV' }
        ]
    }
];

export const getSubCategoriesByCategory = (categoryId: string): ViolationSubCategory[] => {
    const category = VIOLATION_CATEGORIES.find(c => c.id === categoryId);
    return category ? category.subCategories : [];
};

export const getIndicatorsBySubCategory = (categoryId: string, subCategoryId: string): ViolationIndicator[] => {
    const category = VIOLATION_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return [];
    const subCategory = category.subCategories.find(s => s.id === subCategoryId);
    return subCategory && subCategory.indicators ? subCategory.indicators : [];
};

export const MONITORING_STATUS_OPTIONS = [
    { value: '', label: '- None -' },
    { value: 'confirmed-verified', label: 'Confirmed/Verified' },
    { value: 'dismissed', label: 'Dismissed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-confirmed', label: 'Not Confirmed' },
    { value: 'resolved', label: 'Resolved' }
];


