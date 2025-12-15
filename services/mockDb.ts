
import { 
    INITIAL_REQUESTS, 
    INITIAL_FEDERAL_GROUPS, 
    INITIAL_RESPONSES, 
    INITIAL_COMPILED_RECORDS,
    INITIAL_CREATED_USERS,
    INITIAL_DEPARTMENT_TASKS,
    DEFAULT_USERS
} from '../constants';
import { HRRequest, ProvinceResponse, CompiledRecord, FederalGroup, DepartmentTask, User, UserRole } from '../types';

// Simple in-memory storage for the session
class MockDatabase {
    private requests: HRRequest[] = [...INITIAL_REQUESTS];
    private federalGroups: FederalGroup[] = [...INITIAL_FEDERAL_GROUPS];
    private responses: ProvinceResponse[] = [...INITIAL_RESPONSES];
    private compiledRecords: CompiledRecord[] = [...INITIAL_COMPILED_RECORDS];
    private departmentTasks: DepartmentTask[] = [...INITIAL_DEPARTMENT_TASKS]; 
    
    // Users: Combine Default Root Accounts + Created Users
    private users: User[] = [...DEFAULT_USERS, ...INITIAL_CREATED_USERS];

    // --- Authentication ---
    authenticate(username: string): User | undefined {
        // Case-insensitive matching for username
        return this.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    }

    // --- User Management Operations ---
    
    // Get users managed by a specific scope (Federal or specific Province)
    getUsersByScope(province: string | undefined): User[] {
        if (!province) {
            // Federal Scope: Get users where role is FEDERAL_ADMIN (clones), DEPARTMENT_ADMIN (fed depts), or VIEWER (fed)
            // But exclude the root "federal" account to prevent deleting it
            return this.users.filter(u => 
                (u.role === UserRole.FEDERAL_ADMIN || 
                 (u.province === 'Federal' && (u.role === UserRole.DEPARTMENT_ADMIN || u.role === UserRole.VIEWER))
                ) && u.username !== 'federal'
            );
        } else {
            // Provincial Scope: Get users matching the province
            // Exclude root provincial accounts
            const rootUsernames = DEFAULT_USERS.map(du => du.username);
            return this.users.filter(u => 
                u.province === province && 
                !rootUsernames.includes(u.username)
            );
        }
    }

    addUser(user: User) {
        this.users.push(user);
    }
    
    deleteUser(userId: string) {
        this.users = this.users.filter(u => u.id !== userId);
    }
    
    // Kept for backward compatibility if needed, but getDepartmentUsers is now covered by getUsersByScope
    getDepartmentUsers(province: string): User[] {
        return this.users.filter(u => u.province === province && u.role === UserRole.DEPARTMENT_ADMIN);
    }
    
    // Prov Users are now default, but if Federal creates one (unlikely with new requirement), this handles it
    getProvincialUsers(): User[] {
         return this.users.filter(u => u.role === UserRole.PROVINCIAL_ADMIN && u.username !== 'federal');
    }
    
    // Prov User CRUD (Legacy/Federal management of provs if needed)
    addProvincialUser(user: User) { this.users.push(user); }
    updateProvincialUser(id: string, updates: Partial<User>) { this.users = this.users.map(u => u.id === id ? { ...u, ...updates } : u); }
    deleteProvincialUser(id: string) { this.users = this.users.filter(u => u.id !== id); }


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

    // --- Department Task Operations ---
    getDepartmentTasks(reqId: string, province: string): DepartmentTask[] {
        return this.departmentTasks.filter(t => t.reqId === reqId && t.province === province);
    }
    
    // For Department User View
    getTasksForDepartment(province: string, departmentId: string): DepartmentTask[] {
        return this.departmentTasks.filter(t => t.province === province && t.departmentId === departmentId);
    }

    assignDepartmentTask(task: DepartmentTask) {
        this.departmentTasks.push(task);
    }

    submitDepartmentTask(taskId: string, data: string, attachmentUrl?: string) {
        this.departmentTasks = this.departmentTasks.map(t => 
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
    simulateDepartmentSubmission(reqId: string) {
        this.departmentTasks = this.departmentTasks.map(t => 
            t.reqId === reqId ? { 
                ...t, 
                status: 'submitted', 
                responseData: `Data received from ${t.departmentName} regarding ${reqId}. Compliance met.`,
                submissionDate: new Date().toISOString().split('T')[0]
            } : t
        );
    }
}

export const db = new MockDatabase();
