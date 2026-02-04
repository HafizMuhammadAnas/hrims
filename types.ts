
export enum UserRole {
    FEDERAL_ADMIN = 'federal_admin',
    PROVINCIAL_ADMIN = 'provincial_admin',
    DEPARTMENT_ADMIN = 'department_admin',
    VIEWER = 'viewer'
}

export interface User {
    id?: string;
    username: string;
    role: UserRole;
    province?: string; // For Provincial & Department Admins
    departmentId?: string; // Only for Department Admins
    departmentName?: string; // Only for Department Admins
    name: string;
    email?: string;
    contactNumber?: string;
}

export type RequestStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
export type ReviewStatus = 'pending' | 'accepted' | 'needs-modification' | 'rejected';
export type CompilationStatus = 'draft' | 'submitted' | 'acknowledged';

export interface Convention {
    id: string;
    title: string;
    icon: string;
    fullName: string;
    urdu: string;
    adopted: string;
    ratified: string;
    articles: string;
    implementation: string;
}

export interface HRRequest {
    id: string;
    title: string;
    conv: string;
    prov: string; // Target province
    date: string; // Due date
    status: RequestStatus;
    details?: string;
    federalGroupId?: string; // Links to a wider federal initiative
    categoryId?: string; // HRIMS Category
    subcategoryId?: string; // HRIMS Subcategory
    indicatorId?: string; // HRIMS Indicator
}

export interface FederalGroup {
    federalId: string;
    title: string;
    linkedRequests: string[]; // IDs of HRRequest
    conv: string;
    date: string;
    status: 'pending' | 'completed' | 'in-progress';
}

export interface ProvinceResponse {
    resId: string;
    reqId: string;
    federalId: string;
    province: string;
    title: string;
    submissionDate: string;
    reviewStatus: ReviewStatus;
    comments: string;
    content: string;
}

export interface CompiledRecord {
    compId: string;
    federalId: string;
    title: string;
    provinces: string[];
    compilationDate: string;
    submittedTo: string;
    submissionDate: string;
    status: CompilationStatus;
    attachment?: string;
    summary?: string;
}

export interface Indicator {
    icon: string;
    title: string;
    desc: string;
    v1: string;
    l1: string;
    v2: string;
    l2: string;
}

export interface SDG {
    icon: string;
    title: string;
    desc: string;
    v1: string;
    l1: string;
    v2: string;
    l2: string;
}

export interface UPRStat {
    icon: string;
    title: string;
    desc: string;
    v1: string;
    l1: string;
    v2: string;
    l2: string;
}

// --- Department Management Types ---
export interface Department {
    id: string;
    name: string;
    type: 'health' | 'education' | 'law' | 'social' | 'labor';
}

export type DepartmentTaskStatus = 'assigned' | 'submitted';

export interface DepartmentTask {
    taskId: string;
    reqId: string;      // Linked Federal Request
    province: string;
    departmentId: string;
    departmentName: string;
    status: DepartmentTaskStatus;
    assignedDate: string;
    submissionDate?: string;
    responseData?: string; // The data returned by the department
    attachmentUrl?: string; // Link to uploaded file/doc
    categoryId?: string; // HRIMS Category
    subcategoryId?: string; // HRIMS Subcategory
    indicatorId?: string; // HRIMS Indicator
}

// --- Violation Database Types ---
export interface ViolationEntry {
    id: string;
    entryNumber: string; // e.g., "EWS-53453542"
    title: string;
    eventDate: string; // Date
    eventTime?: string; // Time (e.g., "05:10pm")
    eventYear: string; // Year
    province: string; // Geographic Location - Province
    district?: string; // Geographic Location - District
    violationCategory: string; // Category ID
    violationSubCategory?: string; // Sub-category ID (if applicable)
    monitoringStatus: string; // Monitoring Status
    description: string; // Rich text description
    createdAt: string; // Entry creation date
    updatedAt?: string; // Last update date
}
