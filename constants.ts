
import { Convention, Indicator, FederalGroup, HRRequest, ProvinceResponse, CompiledRecord, SDG, UPRStat, Sector, User, UserRole, SectorTask } from './types';

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

export const SECTORS: Sector[] = [
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
    {id:'REQ-2024-0203',title:'Labor Rights in Textile Sector',conv:'ICESCR',prov:'Sindh',date:'2024-05-10',status:'pending', federalGroupId: 'FED-003'},
];

export const INITIAL_FEDERAL_GROUPS: FederalGroup[] = [
    {federalId:'FED-001',title:'Women Rights National Assessment 2024',linkedRequests:['REQ-2024-0150','REQ-2024-0151','REQ-2024-0152','REQ-2024-0153'],conv:'CEDAW',date:'2024-01-10',status:'in-progress'},
    {federalId:'FED-002',title:'Child Protection Survey Q1 2024',linkedRequests:['REQ-2024-0154','REQ-2024-0155'],conv:'CRC',date:'2024-02-01',status:'completed'},
    {federalId:'FED-003',title:'Disability Rights Implementation Review',linkedRequests:['REQ-2024-0156','REQ-2024-0157','REQ-2024-0158'],conv:'CRPD',date:'2024-03-01',status:'pending'}
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

// New Mock Data for Sector Flow
export const INITIAL_SECTOR_USERS: User[] = [
    { id: 'USR-SEC-001', username: 'health.punjab', name: 'Dr. Arif Alvi', role: UserRole.SECTOR_ADMIN, province: 'Punjab', sectorId: 'SEC-HEALTH', sectorName: 'Department of Health' },
    { id: 'USR-SEC-002', username: 'edu.punjab', name: 'Ms. Fatima Jinnah', role: UserRole.SECTOR_ADMIN, province: 'Punjab', sectorId: 'SEC-EDU', sectorName: 'Department of Education' },
    { id: 'USR-SEC-003', username: 'law.punjab', name: 'Adv. Aitzaz Ahsan', role: UserRole.SECTOR_ADMIN, province: 'Punjab', sectorId: 'SEC-LAW', sectorName: 'Ministry of Law & Justice' },
    { id: 'USR-SEC-004', username: 'sw.punjab', name: 'Abdul Sattar Edhi', role: UserRole.SECTOR_ADMIN, province: 'Punjab', sectorId: 'SEC-SW', sectorName: 'Social Welfare Department' },
];

export const INITIAL_SECTOR_TASKS: SectorTask[] = [
    // Scenario 2: Monitoring (REQ-0201) - Mixed Status
    { 
        taskId: 'TSK-1001', reqId: 'REQ-2024-0201', province: 'Punjab', sectorId: 'SEC-EDU', sectorName: 'Department of Education', 
        status: 'submitted', assignedDate: '2024-03-01', submissionDate: '2024-03-05', 
        responseData: 'Enrollment increased by 15% in targeted districts. 50 new schools operational.', attachmentUrl: 'http://data.edu.pk/report.pdf' 
    },
    { 
        taskId: 'TSK-1002', reqId: 'REQ-2024-0201', province: 'Punjab', sectorId: 'SEC-SW', sectorName: 'Social Welfare Department', 
        status: 'assigned', assignedDate: '2024-03-01' 
    },

    // Scenario 3: Compilation Ready (REQ-0202) - All Submitted
    { 
        taskId: 'TSK-2001', reqId: 'REQ-2024-0202', province: 'Punjab', sectorId: 'SEC-LAW', sectorName: 'Ministry of Law & Justice', 
        status: 'submitted', assignedDate: '2024-03-10', submissionDate: '2024-03-15', 
        responseData: 'Legal aid provided to 500 under-trial prisoners. Overcrowding reduced by 5%.', attachmentUrl: 'http://law.gov.pk/prison-stats.xlsx' 
    },
    { 
        taskId: 'TSK-2002', reqId: 'REQ-2024-0202', province: 'Punjab', sectorId: 'SEC-POLICE', sectorName: 'Police Department', 
        status: 'submitted', assignedDate: '2024-03-10', submissionDate: '2024-03-14', 
        responseData: 'Sanitation facilities upgraded in 3 Central Jails. New medical units established.', attachmentUrl: 'http://police.punjab.gov.pk/jails.pdf' 
    },
    
    // History for Sector User (Health)
    { 
        taskId: 'TSK-0099', reqId: 'REQ-2024-0150', province: 'Punjab', sectorId: 'SEC-HEALTH', sectorName: 'Department of Health', 
        status: 'submitted', assignedDate: '2024-01-20', submissionDate: '2024-01-25', 
        responseData: 'Women health centers operational in 36 districts.', attachmentUrl: 'http://health.punjab.gov.pk/women.pdf' 
    }
];
