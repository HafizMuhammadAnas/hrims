// Violation Categories and Sub-categories Mapping

export interface ViolationSubCategory {
    id: string;
    name: string;
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
        subCategories: []
    },
    {
        id: 'women-hrds',
        name: 'Women HRDs / Journalists',
        subCategories: [
            { id: 'gender-based-violence', name: 'Gender Based Violence' },
            { id: 'cyber-crime', name: 'Cyber Crime' },
            { id: 'harassment-workplace', name: 'Harassment at Workplace' }
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

export const MONITORING_STATUS_OPTIONS = [
    { value: '', label: '- None -' },
    { value: 'confirmed-verified', label: 'Confirmed/Verified' },
    { value: 'dismissed', label: 'Dismissed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-confirmed', label: 'Not Confirmed' },
    { value: 'resolved', label: 'Resolved' }
];

