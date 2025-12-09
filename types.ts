
export enum UserRole {
    FEDERAL_ADMIN = 'federal_admin',
    PROVINCIAL_ADMIN = 'provincial_admin',
    SECTOR_ADMIN = 'sector_admin'
}

export interface User {
    id?: string;
    username: string;
    role: UserRole;
    province?: string; // For Provincial & Sector Admins
    sectorId?: string; // Only for Sector Admins
    sectorName?: string; // Only for Sector Admins
    name: string;
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

// --- Sector Management Types ---
export interface Sector {
    id: string;
    name: string;
    type: 'health' | 'education' | 'law' | 'social' | 'labor';
}

export type SectorTaskStatus = 'assigned' | 'submitted';

export interface SectorTask {
    taskId: string;
    reqId: string;      // Linked Federal Request
    province: string;
    sectorId: string;
    sectorName: string;
    status: SectorTaskStatus;
    assignedDate: string;
    submissionDate?: string;
    responseData?: string; // The data returned by the sector
    attachmentUrl?: string; // Link to uploaded file/doc
}