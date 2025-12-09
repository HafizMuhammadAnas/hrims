
import { 
    INITIAL_REQUESTS, 
    INITIAL_FEDERAL_GROUPS, 
    INITIAL_RESPONSES, 
    INITIAL_COMPILED_RECORDS,
    INITIAL_SECTOR_USERS,
    INITIAL_SECTOR_TASKS
} from '../constants';
import { HRRequest, ProvinceResponse, CompiledRecord, FederalGroup, SectorTask, User, UserRole } from '../types';

// Simple in-memory storage for the session
class MockDatabase {
    private requests: HRRequest[] = [...INITIAL_REQUESTS];
    private federalGroups: FederalGroup[] = [...INITIAL_FEDERAL_GROUPS];
    private responses: ProvinceResponse[] = [...INITIAL_RESPONSES];
    private compiledRecords: CompiledRecord[] = [...INITIAL_COMPILED_RECORDS];
    private sectorTasks: SectorTask[] = [...INITIAL_SECTOR_TASKS]; 
    private sectorUsers: User[] = [...INITIAL_SECTOR_USERS]; // Store created sector users

    // --- Request Operations ---
    getRequests(province?: string): HRRequest[] {
        // If province is provided, simulate Provincial DB view (only own data)
        if (province) {
            return this.requests.filter(r => r.prov === province);
        }
        // Otherwise simulate Federal DB view (all data)
        return this.requests;
    }
    
    // Get single request
    getRequestById(id: string): HRRequest | undefined {
        return this.requests.find(r => r.id === id);
    }

    addRequest(req: HRRequest) {
        this.requests.push(req);
    }

    updateRequest(id: string, updates: Partial<HRRequest>) {
        this.requests = this.requests.map(r => r.id === id ? { ...r, ...updates } : r);
    }

    deleteRequest(id: string) {
        this.requests = this.requests.filter(r => r.id !== id);
    }

    // --- Federal Groups ---
    getFederalGroups() {
        return this.federalGroups;
    }

    addFederalGroup(group: FederalGroup) {
        this.federalGroups.push(group);
    }

    // --- Response Operations ---
    getResponses(province?: string): ProvinceResponse[] {
        if (province) {
            return this.responses.filter(r => r.province === province);
        }
        return this.responses;
    }

    addResponse(res: ProvinceResponse) {
        this.responses.push(res);
        // Automatically update the request status to completed if pending
        this.updateRequest(res.reqId, { status: 'completed' });
    }

    updateResponseStatus(resId: string, status: ProvinceResponse['reviewStatus'], comments?: string) {
        this.responses = this.responses.map(r => 
            r.resId === resId ? { ...r, reviewStatus: status, comments: comments || r.comments } : r
        );
    }

    // --- Compilation Operations ---
    getCompiledRecords() {
        return this.compiledRecords;
    }

    addCompiledRecord(record: CompiledRecord) {
        this.compiledRecords.push(record);
    }
    
    updateCompiledRecord(compId: string, updates: Partial<CompiledRecord>) {
        this.compiledRecords = this.compiledRecords.map(c => 
            c.compId === compId ? { ...c, ...updates } : c
        );
    }

    deleteCompiledRecord(compId: string) {
        this.compiledRecords = this.compiledRecords.filter(c => c.compId !== compId);
    }

    // --- Sector Task Operations ---
    getSectorTasks(reqId: string, province: string): SectorTask[] {
        return this.sectorTasks.filter(t => t.reqId === reqId && t.province === province);
    }
    
    // For Sector User View
    getTasksForSector(province: string, sectorId: string): SectorTask[] {
        return this.sectorTasks.filter(t => t.province === province && t.sectorId === sectorId);
    }

    assignSectorTask(task: SectorTask) {
        this.sectorTasks.push(task);
    }

    submitSectorTask(taskId: string, data: string, attachmentUrl?: string) {
        this.sectorTasks = this.sectorTasks.map(t => 
            t.taskId === taskId ? { 
                ...t, 
                status: 'submitted', 
                responseData: data,
                submissionDate: new Date().toISOString().split('T')[0],
                attachmentUrl: attachmentUrl
            } : t
        );
    }

    // Simulation helper (kept for provincial admin demo)
    simulateSectorSubmission(reqId: string) {
        this.sectorTasks = this.sectorTasks.map(t => 
            t.reqId === reqId ? { 
                ...t, 
                status: 'submitted', 
                responseData: `Data received from ${t.sectorName} regarding ${reqId}. Compliance met.`,
                submissionDate: new Date().toISOString().split('T')[0]
            } : t
        );
    }
    
    // --- Sector User Management Operations ---
    getSectorUsers(province: string): User[] {
        return this.sectorUsers.filter(u => u.province === province && u.role === UserRole.SECTOR_ADMIN);
    }

    addSectorUser(user: User) {
        this.sectorUsers.push(user);
    }
    
    deleteSectorUser(userId: string) {
        this.sectorUsers = this.sectorUsers.filter(u => u.id !== userId);
    }
}

export const db = new MockDatabase();
