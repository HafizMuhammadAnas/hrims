
import React, { useState, useEffect } from 'react';
import { User, UserRole, HRRequest, RequestStatus } from '../types';
import { db } from '../services/mockDb';
import { CONVENTIONS } from '../constants';
import { HRIMS_CATEGORIES } from '../hrimsCategories';
import { Plus, Search, Eye, Save, X, MoreVertical, Edit, Trash2, Printer, Download } from 'lucide-react';

interface RequestsProps {
    user: User;
}

const Requests: React.FC<RequestsProps> = ({ user }) => {
    const [allRequests, setAllRequests] = useState<HRRequest[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<HRRequest[]>([]);
    
    // UI States
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);
    const [viewingRequest, setViewingRequest] = useState<HRRequest | null>(null);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);

    // Create/Edit Form State
    const [formData, setFormData] = useState<Partial<HRRequest>>({
        title: '',
        conv: CONVENTIONS[0].title,
        prov: 'Punjab',
        date: '',
        details: '',
        status: 'pending',
        categoryId: '',
        subcategoryId: '',
        indicatorId: ''
    });

    // HRIMS Mapping State
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
    const [selectedIndicator, setSelectedIndicator] = useState<string>('');

    // Get available subcategories based on selected category
    const availableSubcategories = selectedCategory 
        ? HRIMS_CATEGORIES.find(c => c.id === selectedCategory)?.subcategories || []
        : [];

    // Get available indicators based on selected subcategory
    const availableIndicators = selectedSubcategory && selectedCategory
        ? HRIMS_CATEGORIES.find(c => c.id === selectedCategory)
            ?.subcategories.find(s => s.id === selectedSubcategory)?.indicators || []
        : [];

    useEffect(() => {
        refreshRequests();
    }, [user]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!event.target.closest('.dropdown-menu')) {
                setDropdownOpenId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = allRequests;

        // 1. Search Filter (All fields)
        if (searchText) {
            const lowerSearch = searchText.toLowerCase();
            result = result.filter(r => 
                r.id.toLowerCase().includes(lowerSearch) ||
                r.title.toLowerCase().includes(lowerSearch) ||
                r.conv.toLowerCase().includes(lowerSearch) ||
                r.prov.toLowerCase().includes(lowerSearch) ||
                r.status.toLowerCase().includes(lowerSearch)
            );
        }

        // 2. Status Filter
        if (statusFilter) {
            result = result.filter(r => r.status === statusFilter);
        }

        setFilteredRequests(result);
    }, [searchText, statusFilter, allRequests]);

    const refreshRequests = () => {
        const data = db.getRequests(user.role === UserRole.PROVINCIAL_ADMIN ? user.province : undefined);
        setAllRequests(data);
    };

    const toggleDropdown = (id: string) => {
        if (dropdownOpenId === id) setDropdownOpenId(null);
        else setDropdownOpenId(id);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const req: HRRequest = {
            id: `REQ-2024-${Math.floor(Math.random() * 10000)}`,
            title: formData.title!,
            conv: formData.conv!,
            prov: formData.prov!,
            date: formData.date!,
            details: formData.details,
            status: 'pending',
            categoryId: selectedCategory,
            subcategoryId: selectedSubcategory,
            indicatorId: selectedIndicator
        };
        db.addRequest(req);
        closeModals();
        refreshRequests();
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!viewingRequest) return;

        db.updateRequest(viewingRequest.id, {
            title: formData.title,
            conv: formData.conv,
            prov: formData.prov,
            date: formData.date,
            details: formData.details,
            status: formData.status as RequestStatus,
            categoryId: selectedCategory,
            subcategoryId: selectedSubcategory,
            indicatorId: selectedIndicator
        });
        
        closeModals();
        refreshRequests();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
            db.deleteRequest(id);
            refreshRequests();
            setDropdownOpenId(null);
        }
    };

    const handleExportCSV = () => {
        if (!filteredRequests.length) return;
        const headers = ['ID', 'Title', 'Convention', 'Province', 'Due Date', 'Status', 'Details'];
        const csvContent = [
            headers.join(','),
            ...filteredRequests.map(r => 
                [r.id, r.title, r.conv, r.prov, r.date, r.status, `"${r.details?.replace(/"/g, '""') || ''}"`].join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `requests_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const openCreateModal = () => {
        setFormData({
            title: '',
            conv: CONVENTIONS[0].title,
            prov: 'Punjab',
            date: '',
            details: '',
            status: 'pending',
            categoryId: '',
            subcategoryId: '',
            indicatorId: ''
        });
        setSelectedCategory('');
        setSelectedSubcategory('');
        setSelectedIndicator('');
        setModalMode('create');
        setViewingRequest(null);
    };

    const openViewModal = (req: HRRequest) => {
        setViewingRequest(req);
        setFormData({ ...req });
        setSelectedCategory(req.categoryId || '');
        setSelectedSubcategory(req.subcategoryId || '');
        setSelectedIndicator(req.indicatorId || '');
        setModalMode('view');
        setDropdownOpenId(null);
    };

    const openEditModal = (req: HRRequest) => {
        setViewingRequest(req);
        setFormData({ ...req });
        setSelectedCategory(req.categoryId || '');
        setSelectedSubcategory(req.subcategoryId || '');
        setSelectedIndicator(req.indicatorId || '');
        setModalMode('edit');
        setDropdownOpenId(null);
    };

    const closeModals = () => {
        setModalMode(null);
        setViewingRequest(null);
    };

    const getRowColor = (status: string) => {
        switch (status) {
            case 'pending': return 'var(--ylw)'; // Light Yellow
            case 'in-progress': return 'var(--lt-cyan)'; // Cyan/Blueish for work in progress
            case 'completed': return 'var(--grn)'; // Light Green
            case 'overdue': return 'var(--red)'; // Light Red
            default: return 'transparent';
        }
    };

    const getConventionFullName = (shortName: string) => {
        const c = CONVENTIONS.find(conv => conv.title === shortName);
        return c ? `${c.title} - ${c.fullName}` : shortName;
    };

    return (
        <div>
            {/* View Mode (Table) */}
            {!modalMode && (
                <div className="table-container">
                    <div className="table-header">
                        <div>
                            <h2>{user.role === UserRole.FEDERAL_ADMIN ? 'All Requests' : 'Incoming Requests'}</h2>
                            <p className="text-lt" style={{fontSize: '13px'}}>
                                {user.role === UserRole.FEDERAL_ADMIN ? 'Manage requests sent to provinces' : 'View and respond to requests from Federal Ministry'}
                            </p>
                        </div>
                        <div className="search-bar" style={{flexWrap:'wrap'}}>
                            <div style={{position: 'relative'}}>
                                <input 
                                    type="text" 
                                    placeholder="Search by ID, Title, Convention..." 
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{paddingLeft: '35px'}}
                                />
                                <Search size={16} style={{position: 'absolute', left: '10px', top: '12px', color: '#757575'}} />
                            </div>
                            
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{
                                    padding: '10px 15px',
                                    border: '2px solid var(--bdr)',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="overdue">Overdue</option>
                            </select>

                            <div style={{display: 'flex', gap: '10px'}}>
                                <button className="btn btn-secondary" onClick={handleExportCSV} title="Export to CSV">
                                    <Download size={16} /> CSV
                                </button>
                                <button className="btn btn-secondary" onClick={() => window.print()} title="Print Table">
                                    <Printer size={16} /> Print
                                </button>
                                {user.role === UserRole.FEDERAL_ADMIN && (
                                    <button className="btn btn-primary" onClick={openCreateModal}>
                                        <Plus size={16} /> New Request
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Convention</th>
                                <th>Province</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th style={{textAlign: 'center'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(r => (
                                <tr key={r.id} style={{ backgroundColor: getRowColor(r.status) }}>
                                    <td>{r.id}</td>
                                    <td>{r.title}</td>
                                    <td>{r.conv}</td>
                                    <td>{r.prov}</td>
                                    <td>{r.date}</td>
                                    <td>
                                        <span className={`status-badge status-${r.status}`}>
                                            {r.status.toUpperCase().replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <div className="dropdown-menu">
                                            <button className="three-dots" onClick={() => toggleDropdown(r.id)}>
                                                <MoreVertical size={16} />
                                            </button>
                                            <div className={`dropdown-content ${dropdownOpenId === r.id ? 'show' : ''}`}>
                                                <button className="dropdown-item" onClick={() => openViewModal(r)}>
                                                    <Eye size={14} /> View Details
                                                </button>
                                                {user.role === UserRole.FEDERAL_ADMIN && (
                                                    <>
                                                        <button className="dropdown-item" onClick={() => openEditModal(r)}>
                                                            <Edit size={14} /> Edit Request
                                                        </button>
                                                        <div className="dropdown-divider"></div>
                                                        <button className="dropdown-item danger" onClick={() => handleDelete(r.id)}>
                                                            <Trash2 size={14} /> Delete Request
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{textAlign: 'center', color: '#757575', padding: '40px'}}>
                                        No requests found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View Details Mode */}
            {modalMode === 'view' && viewingRequest && (
                <div className="record-detail">
                    <div className="record-header">
                        <div className="record-title-section">
                            <h1>{viewingRequest.title}</h1>
                            <div className="record-meta">
                                <span className="meta-tag">{viewingRequest.id}</span>
                                <span className="meta-tag">{viewingRequest.conv}</span>
                                <span className="meta-tag">{viewingRequest.prov}</span>
                                <span className={`status-badge status-${viewingRequest.status}`} style={{borderRadius:'20px'}}>
                                    {viewingRequest.status.charAt(0).toUpperCase() + viewingRequest.status.slice(1).replace('-', ' ')}
                                </span>
                            </div>
                        </div>
                        <div className="action-btns" style={{display:'flex', gap:'10px'}}>
                            {user.role === UserRole.FEDERAL_ADMIN && (
                                <button className="btn btn-primary" onClick={() => setModalMode('edit')}>
                                    Edit
                                </button>
                            )}
                            <button className="btn btn-secondary" onClick={closeModals}>
                                Close
                            </button>
                            <button className="btn btn-secondary" onClick={() => window.print()}>
                                Print
                            </button>
                        </div>
                    </div>
                    <div className="record-content">
                        <div className="content-section">
                            <h3>Request Information</h3>
                            <div className="detail-grid">
                                <div className="detail-label">Request ID:</div><div className="detail-value">{viewingRequest.id}</div>
                                <div className="detail-label">Title:</div><div className="detail-value">{viewingRequest.title}</div>
                                <div className="detail-label">Convention:</div><div className="detail-value">{getConventionFullName(viewingRequest.conv)}</div>
                                <div className="detail-label">Province:</div><div className="detail-value">{viewingRequest.prov}</div>
                                <div className="detail-label">Due Date:</div><div className="detail-value">{viewingRequest.date}</div>
                                <div className="detail-label">Status:</div><div className="detail-value"><span className={`status-badge status-${viewingRequest.status}`} style={{borderRadius:'20px'}}>{viewingRequest.status.charAt(0).toUpperCase() + viewingRequest.status.slice(1).replace('-', ' ')}</span></div>
                                {viewingRequest.categoryId && (
                                    <>
                                        <div className="detail-label">Category:</div>
                                        <div className="detail-value">
                                            {HRIMS_CATEGORIES.find(c => c.id === viewingRequest.categoryId)?.name || viewingRequest.categoryId}
                                        </div>
                                        {viewingRequest.subcategoryId && (
                                            <>
                                                <div className="detail-label">Subcategory:</div>
                                                <div className="detail-value">
                                                    {HRIMS_CATEGORIES.find(c => c.id === viewingRequest.categoryId)
                                                        ?.subcategories.find(s => s.id === viewingRequest.subcategoryId)?.name || viewingRequest.subcategoryId}
                                                </div>
                                                {viewingRequest.indicatorId && (
                                                    <>
                                                        <div className="detail-label">Indicator:</div>
                                                        <div className="detail-value">
                                                            {HRIMS_CATEGORIES.find(c => c.id === viewingRequest.categoryId)
                                                                ?.subcategories.find(s => s.id === viewingRequest.subcategoryId)
                                                                ?.indicators.find(i => i.id === viewingRequest.indicatorId)?.text || viewingRequest.indicatorId}
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="content-section">
                            <h3>Request Details</h3>
                            <p style={{lineHeight:1.8}}>
                                {viewingRequest.details || `This request was sent to ${viewingRequest.prov} province for ${viewingRequest.conv} convention related data collection and reporting. The province is expected to respond by ${viewingRequest.date}.`}
                            </p>
                        </div>
                        <div className="content-section">
                            <h3>Timeline</h3>
                            <div className="detail-grid">
                                <div className="detail-label">Created Date:</div><div className="detail-value">{viewingRequest.date}</div>
                                <div className="detail-label">Due Date:</div><div className="detail-value">{viewingRequest.date}</div>
                                <div className="detail-label">Last Updated:</div><div className="detail-value">{new Date().toLocaleDateString()}</div>
                            </div>
                        </div>
                        <div className="content-section">
                            <h3>Attachments</h3>
                            <div className="resources-grid">
                                <a href="#" className="resource-link" onClick={(e) => e.preventDefault()}>
                                    <span className="resource-icon">📄</span>
                                    <div className="resource-text"><div className="resource-title">Request Document</div><div className="resource-type">PDF Document</div></div>
                                </a>
                                <a href="#" className="resource-link" onClick={(e) => e.preventDefault()}>
                                    <span className="resource-icon">📋</span>
                                    <div className="resource-text"><div className="resource-title">Data Template</div><div className="resource-type">Excel Template</div></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create / Edit Form Mode */}
            {(modalMode === 'create' || modalMode === 'edit') && (
                <div className="form-container">
                    <div className="form-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h2>{modalMode === 'create' ? 'Submit New Request / نئی درخواست' : 'Edit Request / درخواست میں ترمیم'}</h2>
                        <button onClick={closeModals} style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--txt-lt)'}}>
                            <X size={24} />
                        </button>
                    </div>
                    
                    <form onSubmit={modalMode === 'create' ? handleCreate : handleUpdate}>
                        <div className="form-row">
                            <div className="form-field">
                                <label>Request ID</label>
                                <input 
                                    type="text" 
                                    value={viewingRequest ? viewingRequest.id : 'Auto-generated'} 
                                    readOnly 
                                    style={{background: '#F5F5F5'}}
                                />
                            </div>
                            <div className="form-field">
                                <label>Title / عنوان *</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="Enter request title"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label>Convention *</label>
                                <select 
                                    value={formData.conv}
                                    onChange={e => setFormData({...formData, conv: e.target.value})}
                                >
                                    {CONVENTIONS.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Province / صوبہ *</label>
                                <select 
                                    value={formData.prov}
                                    onChange={e => setFormData({...formData, prov: e.target.value})}
                                    disabled={modalMode !== 'create' && user.role !== UserRole.FEDERAL_ADMIN} 
                                >
                                    <option value="Punjab">Punjab</option>
                                    <option value="Sindh">Sindh</option>
                                    <option value="KPK">KPK</option>
                                    <option value="Balochistan">Balochistan</option>
                                    <option value="Islamabad">Islamabad</option>
                                    <option value="GB">GB</option>
                                    <option value="AJK">AJK</option>
                                </select>
                            </div>
                        </div>

                        {/* HRIMS Category Mapping */}
                        <div className="form-row">
                            <div className="form-field">
                                <label>Category / زمرہ *</label>
                                <select 
                                    value={selectedCategory}
                                    onChange={e => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedSubcategory(''); // Reset subcategory when category changes
                                        setSelectedIndicator(''); // Reset indicator when category changes
                                    }}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {HRIMS_CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Subcategory / ذیلی زمرہ *</label>
                                <select 
                                    value={selectedSubcategory}
                                    onChange={e => {
                                        setSelectedSubcategory(e.target.value);
                                        setSelectedIndicator(''); // Reset indicator when subcategory changes
                                    }}
                                    required
                                    disabled={!selectedCategory}
                                >
                                    <option value="">Select Subcategory</option>
                                    {availableSubcategories.map(sub => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label>Indicator / اشارہ *</label>
                                <select 
                                    value={selectedIndicator}
                                    onChange={e => setSelectedIndicator(e.target.value)}
                                    required
                                    disabled={!selectedSubcategory}
                                >
                                    <option value="">Select Indicator</option>
                                    {availableIndicators.map(ind => (
                                        <option key={ind.id} value={ind.id} title={ind.text}>
                                            {ind.text.length > 80 ? ind.text.substring(0, 80) + '...' : ind.text}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Due Date *</label>
                                <input 
                                    required
                                    type="date" 
                                    value={formData.date}
                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            {modalMode === 'edit' && (
                                <div className="form-field">
                                    <label>Status</label>
                                    <select 
                                        value={formData.status}
                                        onChange={e => setFormData({...formData, status: e.target.value as RequestStatus})}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="form-row">
                             <div className="form-field full">
                                <label>Details</label>
                                <textarea 
                                    placeholder="Enter details..."
                                    style={{minHeight: '100px'}}
                                    value={formData.details}
                                    onChange={e => setFormData({...formData, details: e.target.value})}
                                ></textarea>
                             </div>
                        </div>

                        <div className="form-buttons">
                            <button type="button" className="btn btn-secondary" onClick={closeModals}>Cancel</button>
                            {(modalMode === 'create' || user.role === UserRole.FEDERAL_ADMIN) && (
                                <button type="submit" className="btn btn-primary">
                                    <Save size={18} /> {modalMode === 'create' ? 'Submit Request' : 'Save Changes'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Requests;