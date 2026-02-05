
import { Convention, Indicator, FederalGroup, HRRequest, ProvinceResponse, CompiledRecord, SDG, UPRStat, Department, User, UserRole, DepartmentTask, ViolationEntry } from './types';

export const CONVENTIONS: Convention[] = [
    {id:'icerd',title:'ICERD',icon:'📜',fullName:'International Convention on the Elimination of All Forms of Racial Discrimination',urdu:'نسلی امتیاز کی تمام اقسام کے خاتمے کا بین الاقوامی کنونشن',adopted:'1965',ratified:'1966',articles:'25',implementation:'72'},
    {id:'iccpr',title:'ICCPR',icon:'⚖️',fullName:'International Covenant on Civil and Political Rights',urdu:'شہری اور سیاسی حقوق کا بین الاقوامی معاہدہ',adopted:'1966',ratified:'2010',articles:'53',implementation:'68'},
    {id:'icescr',title:'ICESCR',icon:'🏛️',fullName:'International Covenant on Economic, Social and Cultural Rights',urdu:'معاشی، سماجی اور ثقافتی حقوق کا بین الاقوامی معاہدہ',adopted:'1966',ratified:'2008',articles:'31',implementation:'55'},
    {id:'cedaw',title:'CEDAW',icon:'👩',fullName:'Convention on the Elimination of All Forms of Discrimination against Women',urdu:'خواتین کے خلاف امتیاز کی تمام اقسام کے خاتمے کا کنونشن',adopted:'1979',ratified:'1996',articles:'30',implementation:'65'},
    {id:'cat',title:'CAT',icon:'🛡️',fullName:'Convention against Torture and Other Cruel Treatment',urdu:'تشدد اور دیگر ظالمانہ سلوک کے خلاف کنونشن',adopted:'1984',ratified:'2010',articles:'33',implementation:'58'},
    {id:'crc',title:'CRC',icon:'👶',fullName:'Convention on the Rights of the Child',urdu:'بچوں کے حقوق کا کنونشن',adopted:'1989',ratified:'1990',articles:'54',implementation:'61'},
    {id:'crpd',title:'CRPD',icon:'♿',fullName:'Convention on the Rights of Persons with Disabilities',urdu:'معذور افراد کے حقوق کا کنونشن',adopted:'2006',ratified:'2011',articles:'50',implementation:'52'}
];

export const INDICATORS: Indicator[] = [
    {icon:'🏥',title:'Right to Health',desc:'Access to healthcare services',v1:'78%',l1:'Coverage',v2:'15',l2:'Programs'},
    {icon:'📚',title:'Right to Education',desc:'Universal access to quality education',v1:'62%',l1:'Literacy',v2:'28',l2:'Initiatives'},
    {icon:'💼',title:'Right to Work',desc:'Fair employment opportunities',v1:'5.8%',l1:'Unemployment',v2:'12',l2:'Policies'},
    {icon:'🏠',title:'Right to Housing',desc:'Adequate housing for all',v1:'45%',l1:'Adequate',v2:'8',l2:'Projects'},
    {icon:'🍎',title:'Right to Food',desc:'Access to nutritious food',v1:'36%',l1:'Food Security',v2:'19',l2:'Programs'}
];

export const SDGS: SDG[] = [
    {icon:'🎯',title:'No Poverty',desc:'End poverty everywhere',v1:'24.3%',l1:'Poverty Rate',v2:'2030',l2:'Target'},
    {icon:'🌾',title:'Zero Hunger',desc:'End hunger, achieve food security',v1:'20.3%',l1:'Undernourished',v2:'7',l2:'Programs'},
    {icon:'💪',title:'Good Health',desc:'Ensure healthy lives',v1:'62',l1:'Life Expectancy',v2:'15',l2:'Initiatives'},
    {icon:'🎓',title:'Quality Education',desc:'Inclusive quality education',v1:'22.8M',l1:'Out of School',v2:'12',l2:'Programs'}
];

export const UPR_STATS: UPRStat[] = [
    {icon:'📊',title:'Total Recommendations',desc:'Received in latest cycle',v1:'302',l1:'Total',v2:'2023',l2:'Year'},
    {icon:'✅',title:'Accepted',desc:'For implementation',v1:'253',l1:'Accepted',v2:'83.7%',l2:'Rate'},
    {icon:'📝',title:'Noted',desc:'For consideration',v1:'49',l1:'Noted',v2:'16.3%',l2:'Rate'},
    {icon:'⚡',title:'Implementation',desc:'Current progress',v1:'45%',l1:'Progress',v2:'114',l2:'Done'}
];

export const DEPARTMENTS: Department[] = [
    { id: 'SEC-HEALTH', name: 'Department of Health', type: 'health' },
    { id: 'SEC-EDU', name: 'Department of Education', type: 'education' },
    { id: 'SEC-LAW', name: 'Ministry of Law & Justice', type: 'law' },
    { id: 'SEC-SW', name: 'Social Welfare Department', type: 'social' },
    { id: 'SEC-LABOR', name: 'Labor & Human Resource Dept', type: 'labor' },
    { id: 'SEC-POLICE', name: 'Police Department', type: 'law' },
];

// Initial Data
export const INITIAL_REQUESTS: HRRequest[] = [
    {id:'REQ-2024-0150',title:'Women Rights Assessment',conv:'CEDAW',prov:'Punjab',date:'2024-01-15',status:'completed', federalGroupId: 'FED-001'},
    {id:'REQ-2024-0151',title:'Child Labor Investigation',conv:'CRC',prov:'Sindh',date:'2024-02-20',status:'pending', federalGroupId: 'FED-001'},
    {id:'REQ-2024-0152',title:'Torture Prevention Measures',conv:'CAT',prov:'Balochistan',date:'2024-01-10',status:'overdue', federalGroupId: 'FED-001'},
    {id:'REQ-2024-0153',title:'Disability Rights Implementation',conv:'CRPD',prov:'KPK',date:'2024-02-28',status:'pending', federalGroupId: 'FED-001'},
    {id:'REQ-2024-0154',title:'Economic Rights Survey',conv:'ICESCR',prov:'Islamabad',date:'2024-01-20',status:'completed', federalGroupId: 'FED-002'},
    {id:'REQ-2024-0155',title:'Political Rights Review',conv:'ICCPR',prov:'GB',date:'2024-03-05',status:'pending', federalGroupId: 'FED-002'},
    // New Mock Requests for Workflow Testing (Punjab)
    {id:'REQ-2024-0200',title:'Healthcare Accessibility Audit',conv:'ICESCR',prov:'Punjab',date:'2024-04-15',status:'pending', details: 'Conduct a full audit of rural healthcare centers regarding accessibility for disabled persons.', federalGroupId: 'FED-003'},
    {id:'REQ-2024-0201',title:'Girls Education Enrollment Stats',conv:'CRC',prov:'Punjab',date:'2024-04-20',status:'in-progress', details: 'Provide detailed statistics on primary school enrollment for girls in Southern Punjab.', federalGroupId: 'FED-003'},
    {id:'REQ-2024-0202',title:'Prison Conditions Survey',conv:'CAT',prov:'Punjab',date:'2024-04-25',status:'in-progress', details: 'Report on overcrowding and sanitation in central jails.', federalGroupId: 'FED-003'},
    {id:'REQ-2024-0203',title:'Labor Rights in Textile Department',conv:'ICESCR',prov:'Sindh',date:'2024-05-10',status:'pending', federalGroupId: 'FED-003'},
    // New Mock Requests for Federal Department Workflow
    {id:'REQ-2024-0300',title:'National Health Database Integrity Check',conv:'ICESCR',prov:'Federal',date:'2024-05-01',status:'pending', details: 'Verify the integrity of the national health database and report on access disparities.', federalGroupId: 'FED-004'},
    {id:'REQ-2024-0301',title:'Federal Education Curriculum Review',conv:'CRC',prov:'Federal',date:'2024-05-05',status:'pending', details: 'Review the single national curriculum for inclusivity compliance.', federalGroupId: 'FED-004'},
];

export const INITIAL_FEDERAL_GROUPS: FederalGroup[] = [
    {federalId:'FED-001',title:'Women Rights National Assessment 2024',linkedRequests:['REQ-2024-0150','REQ-2024-0151','REQ-2024-0152','REQ-2024-0153'],conv:'CEDAW',date:'2024-01-10',status:'in-progress'},
    {federalId:'FED-002',title:'Child Protection Survey Q1 2024',linkedRequests:['REQ-2024-0154','REQ-2024-0155'],conv:'CRC',date:'2024-02-01',status:'completed'},
    {federalId:'FED-003',title:'Disability Rights Implementation Review',linkedRequests:['REQ-2024-0156','REQ-2024-0157','REQ-2024-0158'],conv:'CRPD',date:'2024-03-01',status:'pending'},
    {federalId:'FED-004',title:'Federal Internal Compliance Audit',linkedRequests:['REQ-2024-0300','REQ-2024-0301'],conv:'ICESCR',date:'2024-04-01',status:'pending'}
];

export const INITIAL_RESPONSES: ProvinceResponse[] = [
    {resId:'RES-2024-001',reqId:'REQ-2024-0150',federalId:'FED-001',province:'Punjab',title:'Women Rights Assessment - Punjab Report',submissionDate:'2024-02-15',reviewStatus:'pending',comments:'',content:'Punjab has implemented 15 new women protection centers across major districts. Literacy programs have reached 50,000 women. Economic empowerment initiatives show 30% increase in women workforce participation.'},
    {resId:'RES-2024-002',reqId:'REQ-2024-0151',federalId:'FED-001',province:'Sindh',title:'Women Rights Assessment - Sindh Report',submissionDate:'2024-02-18',reviewStatus:'accepted',comments:'Good comprehensive report',content:'Sindh reports establishment of 12 women protection centers. Legal aid provided to 2,500 women. Skill development programs trained 8,000 women in various trades.'},
    {resId:'RES-2024-003',reqId:'REQ-2024-0152',federalId:'FED-001',province:'Balochistan',title:'Women Rights Assessment - Balochistan Report',submissionDate:'2024-02-20',reviewStatus:'needs-modification',comments:'Please include district-wise breakdown',content:'Balochistan has initiated 5 new protection centers. Awareness campaigns conducted in 20 districts. Mobile registration units deployed for women CNIC registration.'},
    {resId:'RES-2024-004',reqId:'REQ-2024-0153',federalId:'FED-001',province:'KPK',title:'Women Rights Assessment - KPK Report',submissionDate:'2024-02-22',reviewStatus:'pending',comments:'',content:'KPK established 8 women protection centers. Educational scholarships provided to 15,000 girls. Women employment in government increased by 20%.'},
    {resId:'RES-2024-005',reqId:'REQ-2024-0154',federalId:'FED-002',province:'Islamabad',title:'Child Protection Survey - ICT Report',submissionDate:'2024-03-01',reviewStatus:'accepted',comments:'Excellent detailed report',content:'ICT child protection unit handled 450 cases. All schools now have child protection policies. Street children rehabilitation program reached 800 children.'},
    {resId:'RES-2024-006',reqId:'REQ-2024-0155',federalId:'FED-002',province:'GB',title:'Child Protection Survey - GB Report',submissionDate:'2024-03-05',reviewStatus:'accepted',comments:'Well documented',content:'GB child welfare initiatives cover all 10 districts. Child labor monitoring committees established. School enrollment increased by 15%.'}
];

export const INITIAL_COMPILED_RECORDS: CompiledRecord[] = [
    {compId:'COMP-2024-001',federalId:'FED-002',title:'Child Protection Survey Q1 2024 - Compiled Report',provinces:['Islamabad','GB'],compilationDate:'2024-03-10',submittedTo:'Ministry of Human Rights',submissionDate:'2024-03-12',status:'submitted',attachment:'COMP-2024-001-Final.pdf', summary: 'Consolidated findings indicate positive trends in child protection across the reporting regions.'},
    {compId:'COMP-2024-002',federalId:'FED-001',title:'Women Rights National Assessment 2024 - Draft',provinces:['Punjab','Sindh','Balochistan','KPK'],compilationDate:'2024-02-25',submittedTo:'',submissionDate:'',status:'draft',attachment:'', summary: 'Draft report awaiting final inputs.'}
];

// DEFAULT SYSTEM USERS (ROOT ACCOUNTS)
export const DEFAULT_USERS: User[] = [
    { id: 'USR-FED-000', username: 'federal', name: 'Federal Ministry Admin', role: UserRole.FEDERAL_ADMIN },
    { id: 'USR-PROV-001', username: 'punjab admin', name: 'Punjab Focal Person', role: UserRole.PROVINCIAL_ADMIN, province: 'Punjab' },
    { id: 'USR-PROV-002', username: 'sindh admin', name: 'Sindh Focal Person', role: UserRole.PROVINCIAL_ADMIN, province: 'Sindh' },
    { id: 'USR-PROV-003', username: 'kpk admin', name: 'KPK Focal Person', role: UserRole.PROVINCIAL_ADMIN, province: 'KPK' },
    { id: 'USR-PROV-004', username: 'balochistan admin', name: 'Balochistan Focal Person', role: UserRole.PROVINCIAL_ADMIN, province: 'Balochistan' },
    { id: 'USR-PROV-005', username: 'islamabad admin', name: 'Islamabad Focal Person', role: UserRole.PROVINCIAL_ADMIN, province: 'Islamabad' },
    { id: 'USR-PROV-006', username: 'gb admin', name: 'GB Focal Person', role: UserRole.PROVINCIAL_ADMIN, province: 'GB' },
    { id: 'USR-PROV-007', username: 'ajk admin', name: 'AJK Focal Person', role: UserRole.PROVINCIAL_ADMIN, province: 'AJK' },
];

// Initial Data for created users (for demo)
export const INITIAL_CREATED_USERS: User[] = [
    // Example: Punjab Admin created a department user
    { id: 'USR-SEC-001', username: 'health.punjab', name: 'Dr. Arif Alvi', role: UserRole.DEPARTMENT_ADMIN, province: 'Punjab', departmentId: 'SEC-HEALTH', departmentName: 'Department of Health', email: 'arif@health.punjab.pk', contactNumber: '0300-1112222' },
];

export const INITIAL_DEPARTMENT_TASKS: DepartmentTask[] = [
    // Scenario 2: Monitoring (REQ-0201) - Mixed Status
    { 
        taskId: 'TSK-1001', reqId: 'REQ-2024-0201', province: 'Punjab', departmentId: 'SEC-EDU', departmentName: 'Department of Education', 
        status: 'submitted', assignedDate: '2024-03-01', submissionDate: '2024-03-05', 
        responseData: 'Enrollment increased by 15% in targeted districts. 50 new schools operational.', attachmentUrl: 'http://data.edu.pk/report.pdf' 
    },
    { 
        taskId: 'TSK-1002', reqId: 'REQ-2024-0201', province: 'Punjab', departmentId: 'SEC-SW', departmentName: 'Social Welfare Department', 
        status: 'assigned', assignedDate: '2024-03-01' 
    },

    // Scenario 3: Compilation Ready (REQ-0202) - All Submitted
    { 
        taskId: 'TSK-2001', reqId: 'REQ-2024-0202', province: 'Punjab', departmentId: 'SEC-LAW', departmentName: 'Ministry of Law & Justice', 
        status: 'submitted', assignedDate: '2024-03-10', submissionDate: '2024-03-15', 
        responseData: 'Legal aid provided to 500 under-trial prisoners. Overcrowding reduced by 5%.', attachmentUrl: 'http://law.gov.pk/prison-stats.xlsx' 
    },
    { 
        taskId: 'TSK-2002', reqId: 'REQ-2024-0202', province: 'Punjab', departmentId: 'SEC-POLICE', departmentName: 'Police Department', 
        status: 'submitted', assignedDate: '2024-03-10', submissionDate: '2024-03-14', 
        responseData: 'Sanitation facilities upgraded in 3 Central Jails. New medical units established.', attachmentUrl: 'http://police.punjab.gov.pk/jails.pdf' 
    },
    
    // History for Department User (Health)
    { 
        taskId: 'TSK-0099', reqId: 'REQ-2024-0150', province: 'Punjab', departmentId: 'SEC-HEALTH', departmentName: 'Department of Health', 
        status: 'submitted', assignedDate: '2024-01-20', submissionDate: '2024-01-25', 
        responseData: 'Women health centers operational in 36 districts.', attachmentUrl: 'http://health.punjab.gov.pk/women.pdf' 
    }
];

// Initial Violation Entries
export const INITIAL_VIOLATION_ENTRIES: ViolationEntry[] = [
    {
        id: 'violation-001',
        entryNumber: 'EWS-12345678',
        title: 'Journalist Harassment Case in Karachi',
        eventDate: '2024-01-15',
        eventTime: '14:30',
        eventYear: '2024',
        province: 'Sindh',
        district: 'Karachi Central',
        violationCategory: 'protection-life-liberty',
        violationSubCategory: 'journalist',
        monitoringStatus: 'in-progress',
        description: 'A prominent journalist was harassed and threatened while covering a political rally. The incident occurred in broad daylight with multiple witnesses. The journalist has filed a complaint with the police, but no action has been taken yet. The case is being monitored by human rights organizations.',
        createdAt: '2024-01-16T10:00:00Z'
    },
    {
        id: 'violation-002',
        entryNumber: 'EWS-23456789',
        title: 'Gender-Based Violence Incident in Lahore',
        eventDate: '2024-02-10',
        eventTime: '18:45',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Lahore',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'rape',
        monitoringStatus: 'confirmed-verified',
        description: 'A woman human rights defender was subjected to gender-based violence while conducting a field visit in a rural area. The incident was reported to local authorities and verified by independent sources. The victim has received medical assistance and legal support.',
        createdAt: '2024-02-11T09:30:00Z'
    },
    {
        id: 'violation-003',
        entryNumber: 'EWS-34567890',
        title: 'Cyber Harassment of Female Journalist',
        eventDate: '2024-02-20',
        eventTime: '22:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Islamabad',
        violationCategory: 'women-hrds',
        violationSubCategory: 'cyber-crime',
        monitoringStatus: 'resolved',
        description: 'A female journalist faced severe cyber harassment and online threats after publishing an investigative report. The case was reported to FIA cybercrime wing. The perpetrators were identified and legal action was taken. The case has been resolved with appropriate remedies provided.',
        createdAt: '2024-02-21T11:15:00Z',
        updatedAt: '2024-03-01T14:20:00Z'
    },
    {
        id: 'violation-004',
        entryNumber: 'EWS-45678901',
        title: 'Workplace Harassment of HR Defender',
        eventDate: '2024-03-05',
        eventTime: '12:00',
        eventYear: '2024',
        province: 'Sindh',
        district: 'Hyderabad',
        violationCategory: 'women-hrds',
        violationSubCategory: 'harassment-workplace',
        monitoringStatus: 'in-progress',
        description: 'A human rights defender working with an NGO faced workplace harassment from colleagues. The organization has initiated an internal inquiry. The case is ongoing and being monitored for appropriate resolution.',
        createdAt: '2024-03-06T08:45:00Z'
    },
    {
        id: 'violation-005',
        entryNumber: 'EWS-56789012',
        title: 'Torture Case of HR Defender in Custody',
        eventDate: '2024-03-12',
        eventTime: '16:20',
        eventYear: '2024',
        province: 'Khyber Pakhtunkhwa',
        district: 'Peshawar',
        violationCategory: 'protection-life-liberty',
        violationSubCategory: 'torture-hrds-journalists',
        monitoringStatus: 'confirmed-verified',
        description: 'A human rights defender was allegedly tortured while in police custody. Medical examination confirmed injuries consistent with torture. The case has been verified and reported to relevant oversight bodies. Investigation is ongoing.',
        createdAt: '2024-03-13T10:30:00Z'
    },
    {
        id: 'violation-006',
        entryNumber: 'EWS-67890123',
        title: 'Blasphemy Case Against Minority Rights Activist',
        eventDate: '2024-03-18',
        eventTime: '10:15',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Multan',
        violationCategory: 'religious-rights',
        violationSubCategory: 'blasphemy',
        monitoringStatus: 'not-confirmed',
        description: 'A minority rights activist was accused of blasphemy. The case appears to be fabricated and politically motivated. The accused has been granted bail. The case is being monitored closely as it may be used to silence human rights defenders.',
        createdAt: '2024-03-19T09:00:00Z'
    },
    {
        id: 'violation-007',
        entryNumber: 'EWS-78901234',
        title: 'Transgender Rights Violation - GBV',
        eventDate: '2024-03-25',
        eventTime: '20:30',
        eventYear: '2024',
        province: 'Sindh',
        district: 'Karachi East',
        violationCategory: 'transgender-rights',
        violationSubCategory: 'gbv',
        monitoringStatus: 'in-progress',
        description: 'A transgender individual was subjected to gender-based violence. The victim has filed a complaint with the police. Medical and legal assistance has been provided. The case is under investigation.',
        createdAt: '2024-03-26T11:45:00Z'
    },
    {
        id: 'violation-008',
        entryNumber: 'EWS-89012345',
        title: 'Minority Rights Violation - HR Defender',
        eventDate: '2024-04-01',
        eventTime: '15:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Faisalabad',
        violationCategory: 'minority-rights',
        violationSubCategory: 'minorities',
        monitoringStatus: 'dismissed',
        description: 'A human rights defender working on minority rights issues faced threats and intimidation. Initial investigation found insufficient evidence. The case has been dismissed but continues to be monitored for any further developments.',
        createdAt: '2024-04-02T10:20:00Z',
        updatedAt: '2024-04-15T16:30:00Z'
    },
    {
        id: 'violation-009',
        entryNumber: 'EWS-90123456',
        title: 'Journalist Detained Without Charge',
        eventDate: '2024-04-10',
        eventTime: '09:00',
        eventYear: '2024',
        province: 'Balochistan',
        district: 'Quetta',
        violationCategory: 'protection-life-liberty',
        violationSubCategory: 'rights-hrds-journalists-prison',
        monitoringStatus: 'confirmed-verified',
        description: 'A journalist was detained without formal charges for several days. The detention violated due process rights. The journalist was released after intervention by media rights organizations. The case has been verified and documented.',
        createdAt: '2024-04-11T08:30:00Z'
    },
    {
        id: 'violation-010',
        entryNumber: 'EWS-01234567',
        title: 'Sectarian Violence Against HR Defender',
        eventDate: '2024-04-15',
        eventTime: '19:45',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Rawalpindi',
        violationCategory: 'religious-rights',
        violationSubCategory: 'sectarian-violence',
        monitoringStatus: 'in-progress',
        description: 'A human rights defender was targeted in an incident of sectarian violence. The defender was providing legal aid to victims of religious persecution. The case is under investigation by law enforcement agencies.',
        createdAt: '2024-04-16T12:00:00Z'
    },
    // Gender Based Violence Dummy Entries
    {
        id: 'violation-011',
        entryNumber: 'EWS-11234567',
        title: 'Forced Marriage Case in Rural Punjab',
        eventDate: '2024-01-20',
        eventTime: '14:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Multan',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'forced-marriages',
        monitoringStatus: 'confirmed-verified',
        description: 'A young woman was forced into marriage against her will. The case was reported by a local human rights organization. Legal action has been initiated.',
        createdAt: '2024-01-21T10:00:00Z'
    },
    {
        id: 'violation-012',
        entryNumber: 'EWS-21234567',
        title: 'Kidnapping for Ransom Incident',
        eventDate: '2024-02-05',
        eventTime: '20:30',
        eventYear: '2024',
        province: 'Sindh',
        district: 'Karachi Central',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'kidnapping-from-ransom',
        monitoringStatus: 'in-progress',
        description: 'A woman journalist was kidnapped and held for ransom. The case is under investigation by law enforcement agencies.',
        createdAt: '2024-02-06T09:15:00Z'
    },
    {
        id: 'violation-013',
        entryNumber: 'EWS-31234567',
        title: 'Kidnapping Case in KPK',
        eventDate: '2024-02-15',
        eventTime: '16:45',
        eventYear: '2024',
        province: 'Khyber Pakhtunkhwa',
        district: 'Peshawar',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'kidnapping',
        monitoringStatus: 'confirmed-verified',
        description: 'A human rights defender was kidnapped while traveling. The victim was later released after intervention by authorities.',
        createdAt: '2024-02-16T11:30:00Z'
    },
    {
        id: 'violation-014',
        entryNumber: 'EWS-41234567',
        title: 'Public Place Harassment Incident',
        eventDate: '2024-02-25',
        eventTime: '12:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Lahore',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'harassment-public-place',
        monitoringStatus: 'resolved',
        description: 'A woman was harassed at a public place. The perpetrator was identified and legal action was taken.',
        createdAt: '2024-02-26T08:00:00Z'
    },
    {
        id: 'violation-015',
        entryNumber: 'EWS-51234567',
        title: 'Gang Rape Case in Sindh',
        eventDate: '2024-03-01',
        eventTime: '22:00',
        eventYear: '2024',
        province: 'Sindh',
        district: 'Hyderabad',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'gang-rape',
        monitoringStatus: 'confirmed-verified',
        description: 'A serious case of gang rape was reported. Medical examination confirmed the incident. Investigation is ongoing.',
        createdAt: '2024-03-02T10:45:00Z'
    },
    {
        id: 'violation-016',
        entryNumber: 'EWS-61234567',
        title: 'Exploitation of Domestic Workers',
        eventDate: '2024-03-08',
        eventTime: '10:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Faisalabad',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'exploitation-domestic-workers',
        monitoringStatus: 'in-progress',
        description: 'Multiple cases of exploitation of domestic workers were reported. The workers were subjected to abuse and unpaid labor.',
        createdAt: '2024-03-09T09:20:00Z'
    },
    {
        id: 'violation-017',
        entryNumber: 'EWS-71234567',
        title: 'Forced Labor Case',
        eventDate: '2024-03-15',
        eventTime: '15:30',
        eventYear: '2024',
        province: 'Balochistan',
        district: 'Quetta',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'forced-labor',
        monitoringStatus: 'confirmed-verified',
        description: 'Women were found in forced labor conditions. The victims have been rescued and provided with support services.',
        createdAt: '2024-03-16T11:00:00Z'
    },
    {
        id: 'violation-018',
        entryNumber: 'EWS-81234567',
        title: 'Emotional Violence Against HR Defender',
        eventDate: '2024-03-20',
        eventTime: '11:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Rawalpindi',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'emotional-violence',
        monitoringStatus: 'in-progress',
        description: 'A woman human rights defender faced emotional violence and psychological abuse. The case is being monitored.',
        createdAt: '2024-03-21T08:30:00Z'
    },
    {
        id: 'violation-019',
        entryNumber: 'EWS-91234567',
        title: 'Dowry-Related Violence Case',
        eventDate: '2024-03-25',
        eventTime: '18:00',
        eventYear: '2024',
        province: 'Sindh',
        district: 'Karachi East',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'dowry-related-violence',
        monitoringStatus: 'confirmed-verified',
        description: 'A woman was subjected to violence due to dowry-related disputes. The case has been verified and legal action initiated.',
        createdAt: '2024-03-26T10:15:00Z'
    },
    {
        id: 'violation-020',
        entryNumber: 'EWS-10234567',
        title: 'Custodial Rape Incident',
        eventDate: '2024-04-01',
        eventTime: '21:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Lahore',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'custodial-rape',
        monitoringStatus: 'in-progress',
        description: 'A serious case of custodial rape was reported. The incident occurred while the victim was in custody. Investigation is ongoing.',
        createdAt: '2024-04-02T09:45:00Z'
    },
    {
        id: 'violation-021',
        entryNumber: 'EWS-11234568',
        title: 'Beating Incident in Public',
        eventDate: '2024-04-05',
        eventTime: '19:30',
        eventYear: '2024',
        province: 'Khyber Pakhtunkhwa',
        district: 'Peshawar',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'beating',
        monitoringStatus: 'confirmed-verified',
        description: 'A woman was beaten in public. The incident was witnessed by multiple people. The perpetrator has been identified.',
        createdAt: '2024-04-06T08:20:00Z'
    },
    {
        id: 'violation-022',
        entryNumber: 'EWS-12234567',
        title: 'Attempt to Murder Case',
        eventDate: '2024-04-10',
        eventTime: '23:00',
        eventYear: '2024',
        province: 'Sindh',
        district: 'Karachi Central',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'attempt-to-murder',
        monitoringStatus: 'in-progress',
        description: 'An attempt to murder a woman human rights defender was reported. The victim survived with injuries. Case is under investigation.',
        createdAt: '2024-04-11T10:30:00Z'
    },
    {
        id: 'violation-023',
        entryNumber: 'EWS-13234567',
        title: 'Amputation and Hurt Case',
        eventDate: '2024-04-15',
        eventTime: '14:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Multan',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'amputation-hurt',
        monitoringStatus: 'confirmed-verified',
        description: 'A woman was subjected to severe physical harm resulting in amputation. Medical treatment is ongoing.',
        createdAt: '2024-04-16T09:00:00Z'
    },
    {
        id: 'violation-024',
        entryNumber: 'EWS-14234567',
        title: 'Acid Throwing Incident',
        eventDate: '2024-04-20',
        eventTime: '20:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Lahore',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'acid-throwing',
        monitoringStatus: 'in-progress',
        description: 'A woman was attacked with acid. The victim suffered severe burns. Medical treatment and legal action are in progress.',
        createdAt: '2024-04-21T11:15:00Z'
    },
    {
        id: 'violation-025',
        entryNumber: 'EWS-15234567',
        title: 'Abduction Case in Balochistan',
        eventDate: '2024-04-25',
        eventTime: '17:00',
        eventYear: '2024',
        province: 'Balochistan',
        district: 'Quetta',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'abductions',
        monitoringStatus: 'confirmed-verified',
        description: 'A woman was abducted. The case was reported to authorities. The victim was later recovered.',
        createdAt: '2024-04-26T08:45:00Z'
    },
    {
        id: 'violation-026',
        entryNumber: 'EWS-16234567',
        title: 'Trafficking of Women for Prostitution',
        eventDate: '2024-05-01',
        eventTime: '22:30',
        eventYear: '2024',
        province: 'Sindh',
        district: 'Karachi East',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'trafficking-women-prostitution',
        monitoringStatus: 'in-progress',
        description: 'A trafficking ring involving women for prostitution was uncovered. Multiple victims were rescued. Investigation ongoing.',
        createdAt: '2024-05-02T10:00:00Z'
    },
    {
        id: 'violation-027',
        entryNumber: 'EWS-17234567',
        title: 'Trafficking of Girls and Women',
        eventDate: '2024-05-05',
        eventTime: '16:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Faisalabad',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'trafficking-girls-women',
        monitoringStatus: 'confirmed-verified',
        description: 'A case of trafficking involving girls and women was reported. Victims have been rescued and provided support.',
        createdAt: '2024-05-06T09:30:00Z'
    },
    {
        id: 'violation-028',
        entryNumber: 'EWS-18234567',
        title: 'Social and Economic Abuse Case',
        eventDate: '2024-05-10',
        eventTime: '13:00',
        eventYear: '2024',
        province: 'Khyber Pakhtunkhwa',
        district: 'Peshawar',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'social-economic-abuse',
        monitoringStatus: 'in-progress',
        description: 'A woman faced social and economic abuse. The case involves denial of economic rights and social exclusion.',
        createdAt: '2024-05-11T08:15:00Z'
    },
    {
        id: 'violation-029',
        entryNumber: 'EWS-19234567',
        title: 'Sexual Violence Incident',
        eventDate: '2024-05-15',
        eventTime: '21:00',
        eventYear: '2024',
        province: 'Sindh',
        district: 'Hyderabad',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'sexual-violence',
        monitoringStatus: 'confirmed-verified',
        description: 'A case of sexual violence was reported. Medical examination confirmed the incident. Legal action has been initiated.',
        createdAt: '2024-05-16T10:45:00Z'
    },
    {
        id: 'violation-030',
        entryNumber: 'EWS-20234567',
        title: 'Sexual Harassment at Workplace',
        eventDate: '2024-05-20',
        eventTime: '11:30',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Lahore',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'sexual-harassment-workplace',
        monitoringStatus: 'resolved',
        description: 'A case of sexual harassment at workplace was reported. The organization took appropriate action and the case was resolved.',
        createdAt: '2024-05-21T09:00:00Z'
    },
    {
        id: 'violation-031',
        entryNumber: 'EWS-21234567',
        title: 'Setting on Fire Incident',
        eventDate: '2024-05-25',
        eventTime: '19:00',
        eventYear: '2024',
        province: 'Punjab',
        district: 'Rawalpindi',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'setting-on-fire',
        monitoringStatus: 'in-progress',
        description: 'A woman was set on fire. The victim suffered severe burns. Medical treatment is ongoing and investigation is in progress.',
        createdAt: '2024-05-26T10:30:00Z'
    },
    {
        id: 'violation-032',
        entryNumber: 'EWS-22234567',
        title: 'Physical Violence Case',
        eventDate: '2024-05-30',
        eventTime: '15:00',
        eventYear: '2024',
        province: 'Balochistan',
        district: 'Quetta',
        violationCategory: 'women-hrds',
        violationSubCategory: 'gender-based-violence',
        violationIndicator: 'physical-violence',
        monitoringStatus: 'confirmed-verified',
        description: 'A case of severe physical violence was reported. The victim received medical treatment. The case has been verified.',
        createdAt: '2024-05-31T08:20:00Z'
    }
];
