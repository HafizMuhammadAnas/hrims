
import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../services/mockDb';
import { ProvinceResponse, CompiledRecord } from '../types';
import { Search, Eye, ChevronLeft, ChevronRight, ArrowUpDown, Save, X, Filter, FileText, Send, Clock, CheckCircle, MoreVertical, Edit, Trash2, Download, Printer } from 'lucide-react';

export const ReviewResponses: React.FC = () => {
    // Data & State
    const [responses, setResponses] = useState(db.getResponses());
    const [viewingResponse, setViewingResponse] = useState<ProvinceResponse | null>(null);
    
    // Filter & Search State
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [federalIdFilter, setFederalIdFilter] = useState('');
    
    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: keyof ProvinceResponse, direction: 'asc' | 'desc' } | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Review Logic State (for Modal)
    const [reviewStatus, setReviewStatus] = useState<ProvinceResponse['reviewStatus']>('pending');
    const [reviewComments, setReviewComments] = useState('');

    // --- Helpers ---
    const refreshData = () => {
        setResponses(db.getResponses());
    };

    const handleSort = (key: keyof ProvinceResponse) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getRowColor = (status: string) => {
        switch (status) {
            case 'pending': return 'var(--ylw)'; // Light Yellow/Orange
            case 'accepted': return 'var(--grn)'; // Light Green
            case 'needs-modification': return '#FFF8E1'; // Slightly different yellow
            case 'rejected': return 'var(--red)'; // Light Red
            default: return 'transparent';
        }
    };

    const handleExportCSV = () => {
        if (!processedData.length) return;
        const headers = ['Response ID', 'Request ID', 'Federal ID', 'Province', 'Title', 'Submission Date', 'Status'];
        const csvContent = [
            headers.join(','),
            ...processedData.map(r => 
                [r.resId, r.reqId, r.federalId, r.province, `"${r.title}"`, r.submissionDate, r.reviewStatus].join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `responses_export_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const uniqueFederalIds = useMemo(() => Array.from(new Set(responses.map(r => r.federalId))), [responses]);

    // --- Derived Data (Filter -> Sort -> Paginate) ---
    const processedData = useMemo(() => {
        let data = [...responses];

        // 1. Filter
        if (searchText) {
            const lower = searchText.toLowerCase();
            data = data.filter(r => 
                r.resId.toLowerCase().includes(lower) ||
                r.reqId.toLowerCase().includes(lower) ||
                r.federalId.toLowerCase().includes(lower) ||
                r.province.toLowerCase().includes(lower) ||
                r.title.toLowerCase().includes(lower)
            );
        }
        if (statusFilter) {
            data = data.filter(r => r.reviewStatus === statusFilter);
        }
        if (federalIdFilter) {
            data = data.filter(r => r.federalId === federalIdFilter);
        }

        // 2. Sort
        if (sortConfig) {
            data.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return data;
    }, [responses, searchText, statusFilter, federalIdFilter, sortConfig]);

    // 3. Paginate
    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // --- Actions ---
    const openViewModal = (res: ProvinceResponse) => {
        setViewingResponse(res);
        setReviewStatus(res.reviewStatus);
        setReviewComments(res.comments || '');
    };

    const closeViewModal = () => {
        setViewingResponse(null);
    };

    const saveReview = () => {
        if (viewingResponse) {
            db.updateResponseStatus(viewingResponse.resId, reviewStatus, reviewComments);
            refreshData();
            closeViewModal();
        }
    };

    return (
        <div>
            {!viewingResponse ? (
                /* --- Table View --- */
                <div className="table-container">
                    <div className="table-header">
                        <div>
                            <h2>Review Province Responses</h2>
                            <p className="text-lt" style={{fontSize: '13px'}}>Evaluate incoming reports from provinces</p>
                        </div>
                        
                        <div className="search-bar" style={{flexWrap: 'wrap'}}>
                            <div style={{position: 'relative'}}>
                                <input 
                                    type="text" 
                                    placeholder="Search IDs, Province..." 
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{paddingLeft: '35px', width: '200px'}}
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
                                <option value="accepted">Accepted</option>
                                <option value="needs-modification">Needs Mod</option>
                                <option value="rejected">Rejected</option>
                            </select>

                             <div style={{position: 'relative'}}>
                                <input 
                                    list="fedIdOptions" 
                                    placeholder="Filter Federal ID"
                                    value={federalIdFilter}
                                    onChange={e => setFederalIdFilter(e.target.value)}
                                    style={{padding: '10px 15px', border: '2px solid var(--bdr)', borderRadius: '8px', width: '150px'}}
                                />
                                <datalist id="fedIdOptions">
                                    {uniqueFederalIds.map(id => <option key={id} value={id} />)}
                                </datalist>
                             </div>

                             <button className="btn btn-secondary" onClick={handleExportCSV} title="Export CSV">
                                <Download size={16} />
                             </button>
                             <button className="btn btn-secondary" onClick={() => window.print()} title="Print">
                                <Printer size={16} />
                             </button>
                        </div>
                    </div>

                    <div className="stats-row" style={{gridTemplateColumns: 'repeat(4, auto)', gap: '10px', marginBottom: '20px'}}>
                        <div style={{padding: '10px 20px', background: '#FFF3E0', borderRadius: '8px', textAlign: 'center'}}>
                            <strong>{responses.filter(r => r.reviewStatus === 'pending').length}</strong><br/><small>Pending</small>
                        </div>
                        <div style={{padding: '10px 20px', background: '#E8F5E9', borderRadius: '8px', textAlign: 'center'}}>
                            <strong>{responses.filter(r => r.reviewStatus === 'accepted').length}</strong><br/><small>Accepted</small>
                        </div>
                        <div style={{padding: '10px 20px', background: '#E3F2FD', borderRadius: '8px', textAlign: 'center'}}>
                            <strong>{responses.filter(r => r.reviewStatus === 'needs-modification').length}</strong><br/><small>Needs Mod</small>
                        </div>
                        <div style={{padding: '10px 20px', background: '#FFEBEE', borderRadius: '8px', textAlign: 'center'}}>
                            <strong>{responses.filter(r => r.reviewStatus === 'rejected').length}</strong><br/><small>Rejected</small>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('resId')} style={{cursor: 'pointer'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        Response ID <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th onClick={() => handleSort('reqId')} style={{cursor: 'pointer'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        Request ID <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th onClick={() => handleSort('federalId')} style={{cursor: 'pointer'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        Federal ID <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th onClick={() => handleSort('province')} style={{cursor: 'pointer'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        Province <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th>Title</th>
                                <th onClick={() => handleSort('submissionDate')} style={{cursor: 'pointer'}}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                                        Date <ArrowUpDown size={14} />
                                    </div>
                                </th>
                                <th>Status</th>
                                <th style={{textAlign: 'center'}}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(r => (
                                <tr key={r.resId} style={{ backgroundColor: getRowColor(r.reviewStatus) }}>
                                    <td style={{fontWeight: 500}}>{r.resId}</td>
                                    <td className="text-lt">{r.reqId}</td>
                                    <td className="text-lt">{r.federalId}</td>
                                    <td>{r.province}</td>
                                    <td>{r.title}</td>
                                    <td>{r.submissionDate}</td>
                                    <td>
                                        <span className={`status-badge status-${r.reviewStatus}`}>
                                            {r.reviewStatus.replace('-', ' ').toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <button 
                                            className="btn btn-secondary" 
                                            style={{padding: '6px 12px', fontSize: '13px', background: '#fff', border: '1px solid var(--bdr)'}}
                                            onClick={() => openViewModal(r)}
                                        >
                                            <Eye size={14} /> View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{textAlign: 'center', padding: '30px', color: '#757575'}}>
                                        No responses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px', gap: '10px'}}>
                            <button 
                                className="btn btn-secondary" 
                                style={{padding: '8px 12px'}}
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span style={{fontSize: '14px', color: '#757575'}}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button 
                                className="btn btn-secondary" 
                                style={{padding: '8px 12px'}}
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* --- Detail Modal Template --- */
                <div className="record-detail">
                    <div className="record-header">
                        <div className="record-title-section">
                            <h1>{viewingResponse.title}</h1>
                            <div className="record-meta">
                                <span className="meta-tag">{viewingResponse.resId}</span>
                                <span className="meta-tag">Request ID: {viewingResponse.reqId}</span>
                                <span className="meta-tag">{viewingResponse.province}</span>
                                <span className={`status-badge status-${viewingResponse.reviewStatus}`} style={{borderRadius:'20px'}}>
                                    {viewingResponse.reviewStatus.toUpperCase().replace('-', ' ')}
                                </span>
                            </div>
                        </div>
                        <div className="action-btns">
                            <button className="btn btn-secondary" onClick={closeViewModal}>
                                <X size={16} /> Close
                            </button>
                        </div>
                    </div>

                    <div className="record-content">
                         <div className="content-section">
                            <h3>Basic Information</h3>
                            <div className="detail-grid">
                                <div className="detail-label">Response ID:</div><div className="detail-value">{viewingResponse.resId}</div>
                                <div className="detail-label">Request ID:</div><div className="detail-value">{viewingResponse.reqId}</div>
                                <div className="detail-label">Federal Group ID:</div><div className="detail-value">{viewingResponse.federalId}</div>
                                <div className="detail-label">Province:</div><div className="detail-value">{viewingResponse.province}</div>
                                <div className="detail-label">Submission Date:</div><div className="detail-value">{viewingResponse.submissionDate}</div>
                            </div>
                        </div>

                        <div className="content-section">
                            <h3>Response Content</h3>
                            <div style={{background: '#fff', padding: '15px', borderRadius: '8px', border: '1px solid var(--bdr)', lineHeight: 1.6}}>
                                {viewingResponse.content}
                            </div>
                        </div>

                        {/* Status Update Section */}
                        <div className="content-section" style={{borderLeftColor: 'var(--pk-green)'}}>
                            <h3>Review Action</h3>
                            <div className="form-row" style={{marginBottom: 0}}>
                                <div className="form-field">
                                    <label>Update Status</label>
                                    <select 
                                        value={reviewStatus} 
                                        onChange={(e) => setReviewStatus(e.target.value as any)}
                                        style={{padding: '12px', borderRadius: '8px', border: '2px solid var(--bdr)'}}
                                    >
                                        <option value="pending">Pending Review</option>
                                        <option value="accepted">Accepted (Ready for Compilation)</option>
                                        <option value="needs-modification">Needs Modification</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                            
                            {(reviewStatus === 'needs-modification' || reviewStatus === 'rejected') && (
                                <div className="form-field" style={{marginTop: '15px'}}>
                                    <label>Comments / Instructions</label>
                                    <textarea 
                                        value={reviewComments}
                                        onChange={(e) => setReviewComments(e.target.value)}
                                        placeholder="Enter instructions for the province..."
                                        style={{minHeight: '80px'}}
                                    />
                                </div>
                            )}

                            <div style={{marginTop: '20px', textAlign: 'right'}}>
                                <button className="btn btn-primary" onClick={saveReview}>
                                    <Save size={16} /> Update Status
                                </button>
                            </div>
                        </div>

                        <div className="content-section">
                            <h3>Documents & Attachments</h3>
                            <div className="resources-grid">
                                <a href="#" className="resource-link" onClick={(e) => e.preventDefault()}>
                                    <span className="resource-icon">📄</span>
                                    <div className="resource-text"><div className="resource-title">Official Report</div><div className="resource-type">PDF Document</div></div>
                                </a>
                                <a href="#" className="resource-link" onClick={(e) => e.preventDefault()}>
                                    <span className="resource-icon">📊</span>
                                    <div className="resource-text"><div className="resource-title">Data Annexure</div><div className="resource-type">Excel File</div></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CompilationCenter: React.FC = () => {
    const federalGroups = db.getFederalGroups();
    const responses = db.getResponses();
    const [searchId, setSearchId] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [compilationMode, setCompilationMode] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<CompiledRecord | null>(null);
    const [summaryText, setSummaryText] = useState('');

    const handleSearch = () => {
        const group = federalGroups.find(g => g.federalId === searchId);
        if (group) {
            setSelectedGroup(group.federalId);
            setCompilationMode(false);
            setCurrentRecord(null);
        } else {
            alert('Federal ID not found!');
        }
    };

    const handleCompile = () => {
        if(!selectedGroup) return;
        const group = federalGroups.find(g => g.federalId === selectedGroup);
        if(!group) return;

        const linkedResponses = responses.filter(r => r.federalId === selectedGroup && r.reviewStatus === 'accepted');
        
        const newRecord: CompiledRecord = {
            compId: `COMP-${Math.floor(Math.random() * 10000)}`,
            federalId: group.federalId,
            title: `Compiled Report - ${group.title}`,
            provinces: linkedResponses.map(r => r.province),
            compilationDate: new Date().toISOString().split('T')[0],
            submittedTo: '',
            submissionDate: '',
            status: 'draft',
            summary: ''
        };

        // Don't save to DB yet, just set state for preview
        setCurrentRecord(newRecord);
        setSummaryText('');
        setCompilationMode(true);
    };

    const handleSaveDraft = () => {
        if (!currentRecord) return;
        const recordToSave = { ...currentRecord, summary: summaryText };
        db.addCompiledRecord(recordToSave);
        alert(`Saved as Draft: ${recordToSave.compId}`);
        // Reset state
        setCompilationMode(false);
        setSelectedGroup(null);
        setCurrentRecord(null);
    };

    const handleSubmitMinistry = () => {
        if (!currentRecord) return;
        const recordToSave = { 
            ...currentRecord, 
            summary: summaryText, 
            status: 'submitted' as const, 
            submissionDate: new Date().toISOString().split('T')[0],
            submittedTo: 'Ministry of Human Rights',
            attachment: `${currentRecord.compId}-Final.pdf`
        };
        db.addCompiledRecord(recordToSave);
        alert(`Submitted to Ministry: ${recordToSave.compId}`);
        // Reset state
        setCompilationMode(false);
        setSelectedGroup(null);
        setCurrentRecord(null);
    };

    const group = federalGroups.find(g => g.federalId === selectedGroup);
    const linkedResponses = selectedGroup ? responses.filter(r => r.federalId === selectedGroup) : [];
    const acceptedCount = linkedResponses.filter(r => r.reviewStatus === 'accepted').length;
    const isReady = group && acceptedCount > 0 && acceptedCount === linkedResponses.length;

    // Get the responses that would be included in the compilation
    const includedResponses = selectedGroup ? responses.filter(r => r.federalId === selectedGroup && r.reviewStatus === 'accepted') : [];

    return (
        <div>
            {/* Main Compilation Dashboard (Search & Status) */}
            {!compilationMode && (
                <>
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-card-value">{federalGroups.length}</div>
                            <div className="stat-card-label">Total Federal Groups</div>
                        </div>
                        <div className="stat-card" style={{borderLeftColor: '#4CAF50'}}>
                            <div className="stat-card-value" style={{color: '#4CAF50'}}>{federalGroups.filter(g => g.status === 'completed').length}</div>
                            <div className="stat-card-label">Completed Groups</div>
                        </div>
                    </div>

                    <div className="search-section">
                        <h3 style={{color: 'var(--pk-green)', marginBottom: '20px'}}>Search Federal ID to Compile</h3>
                        <div className="search-bar" style={{alignItems: 'flex-end'}}>
                            <div className="form-field">
                                <label>Enter Federal ID</label>
                                <input 
                                    type="text" 
                                    list="fedIds" 
                                    placeholder="e.g. FED-001" 
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                                <datalist id="fedIds">
                                    {federalGroups.map(g => <option key={g.federalId} value={g.federalId} />)}
                                </datalist>
                            </div>
                            <button className="btn btn-primary" onClick={handleSearch}>
                                <Search size={18} /> Search
                            </button>
                        </div>
                    </div>

                    {selectedGroup && group && (
                        <div className="results-section">
                            <div className="table-header" style={{borderBottom: '2px solid #E0E0E0', paddingBottom: '15px'}}>
                                <div>
                                    <h3 style={{color: 'var(--pk-green)'}}>Linked Responses for {group.federalId}</h3>
                                    <p className="text-lt">{group.title}</p>
                                </div>
                                <div>
                                    {isReady ? (
                                        <span className="status-badge status-accepted">✅ Ready for Compilation</span>
                                    ) : (
                                        <span className="status-badge status-needs-modification">⚠️ Pending Responses</span>
                                    )}
                                </div>
                            </div>

                            <div style={{marginTop: '20px'}}>
                                {linkedResponses.map(r => (
                                    <div key={r.resId} className={`result-card ${r.reviewStatus === 'accepted' ? 'selected' : ''}`}>
                                        <div>
                                            <h4>{r.province} - {r.title}</h4>
                                            <div style={{display: 'flex', gap: '15px', marginTop: '5px', fontSize: '13px', color: '#757575'}}>
                                                <span>ID: {r.resId}</span>
                                                <span>Date: {r.submissionDate}</span>
                                                <span className={`status-badge status-${r.reviewStatus}`}>{r.reviewStatus.toUpperCase()}</span>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={r.reviewStatus === 'accepted'} disabled />
                                    </div>
                                ))}
                            </div>

                            <div style={{textAlign: 'center', marginTop: '30px'}}>
                                <button 
                                    className="btn btn-primary" 
                                    disabled={!isReady}
                                    style={{opacity: isReady ? 1 : 0.5, cursor: isReady ? 'pointer' : 'not-allowed'}}
                                    onClick={handleCompile}
                                >
                                    📋 Compile All Responses
                                </button>
                                {!isReady && <p style={{color: '#F44336', marginTop: '10px', fontSize: '13px'}}>All responses must be accepted before compilation.</p>}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Compilation View Mode (Draft/Edit) */}
            {compilationMode && currentRecord && (
                <div className="record-detail">
                    {/* Header */}
                    <div className="record-header">
                        <div className="record-title-section">
                            <h1>{currentRecord.title}</h1>
                            <div className="record-meta">
                                <span className="meta-tag">{currentRecord.compId}</span>
                                <span className="meta-tag">{currentRecord.federalId}</span>
                                <span className={`status-badge status-${currentRecord.status}`} style={{borderRadius:'20px'}}>
                                    {currentRecord.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="action-btns" style={{display:'flex', gap:'10px'}}>
                             <button className="btn btn-secondary" onClick={() => setCompilationMode(false)}>
                                <ArrowUpDown size={16} style={{transform: 'rotate(90deg)'}}/> Back
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="record-content">
                        {/* 1. Details */}
                        <div className="content-section">
                            <h3>Compilation Details</h3>
                            <div className="detail-grid">
                                <div className="detail-label">Federal ID:</div><div className="detail-value">{currentRecord.federalId}</div>
                                <div className="detail-label">Provinces:</div><div className="detail-value">{currentRecord.provinces.join(', ')}</div>
                                <div className="detail-label">Compilation Date:</div><div className="detail-value">{currentRecord.compilationDate}</div>
                                <div className="detail-label">Submitted To:</div><div className="detail-value">{currentRecord.submittedTo || 'Not submitted yet'}</div>
                                <div className="detail-label">Submission Date:</div><div className="detail-value">{currentRecord.submissionDate || '-'}</div>
                                <div className="detail-label">Attachment:</div><div className="detail-value">{currentRecord.attachment || 'Pending generation'}</div>
                            </div>
                        </div>

                        {/* 2. Province Responses */}
                        <div>
                             <h3 style={{color: 'var(--pk-green)', marginBottom: '15px', fontSize: '18px', fontWeight: 600}}>Province Responses Included</h3>
                             {includedResponses.map(res => (
                                 <div key={res.resId} style={{marginBottom: '20px', border: '2px solid var(--blue)', borderRadius: '10px', overflow: 'hidden'}}>
                                     <div style={{background: '#FAFAFA', padding: '15px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                         <span style={{fontSize: '20px'}}>🏛️</span>
                                         <h4 style={{margin: 0, color: 'var(--pk-green)', fontWeight: 600}}>{res.province}</h4>
                                     </div>
                                     <div style={{padding: '20px', background: '#fff', fontSize: '14px', lineHeight: 1.6, color: '#333'}}>
                                         {res.content}
                                     </div>
                                 </div>
                             ))}
                        </div>

                        {/* 3. Federal Summary Edit */}
                        <div className="content-section" style={{borderLeftColor: 'var(--pk-green)', background: '#E8F5E9'}}>
                            <h3>Federal Executive Summary</h3>
                            <p style={{fontSize: '13px', color: '#555', marginBottom: '10px'}}>Provide a consolidated summary of the provincial findings to be included in the final report.</p>
                            <textarea 
                                value={summaryText}
                                onChange={(e) => setSummaryText(e.target.value)}
                                style={{width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '120px'}}
                                placeholder="Enter executive summary..."
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
                             <button className="btn btn-secondary" onClick={handleSaveDraft}>
                                 <FileText size={16} /> Save as Draft
                             </button>
                             <button className="btn btn-primary" onClick={handleSubmitMinistry}>
                                 <Send size={16} /> Submit to Ministry
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const CompiledRecords: React.FC = () => {
    const [records, setRecords] = useState(db.getCompiledRecords());
    const [searchText, setSearchText] = useState('');
    const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
    const [viewingRecord, setViewingRecord] = useState<CompiledRecord | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [summaryText, setSummaryText] = useState('');

    const refreshRecords = () => {
        setRecords(db.getCompiledRecords());
    };

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!event.target.closest('.dropdown-menu')) {
                setDropdownOpenId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleDropdown = (id: string) => {
        if (dropdownOpenId === id) setDropdownOpenId(null);
        else setDropdownOpenId(id);
    };

    const handleView = (record: CompiledRecord) => {
        setViewingRecord(record);
        setIsEditing(false);
        setDropdownOpenId(null);
    };

    const handleEdit = (record: CompiledRecord) => {
        setViewingRecord(record);
        setIsEditing(true);
        setSummaryText(record.summary || '');
        setDropdownOpenId(null);
    };

    const handleDelete = (compId: string) => {
        if (confirm('Are you sure you want to delete this compilation? This cannot be undone.')) {
            db.deleteCompiledRecord(compId);
            refreshRecords();
            setDropdownOpenId(null);
        }
    };

    const handleDownload = (record: CompiledRecord) => {
        alert(`Downloading ${record.attachment || 'report'}...`);
        setDropdownOpenId(null);
    };

    const handleSaveUpdate = () => {
        if (!viewingRecord) return;
        db.updateCompiledRecord(viewingRecord.compId, { summary: summaryText });
        alert('Record updated successfully.');
        refreshRecords();
        setViewingRecord(null); // Return to list
    };

    const handleSubmitUpdate = () => {
        if (!viewingRecord) return;
        db.updateCompiledRecord(viewingRecord.compId, { 
            summary: summaryText, 
            status: 'submitted', 
            submissionDate: new Date().toISOString().split('T')[0],
            submittedTo: 'Ministry of Human Rights',
            attachment: `${viewingRecord.compId}-Final.pdf`
        });
        alert('Record submitted successfully.');
        refreshRecords();
        setViewingRecord(null); // Return to list
    };

    const handleCloseModal = () => {
        setViewingRecord(null);
        setIsEditing(false);
    };

    const handleExportCSV = () => {
        if (!filteredRecords.length) return;
        const headers = ['Compilation ID', 'Federal ID', 'Title', 'Provinces', 'Date', 'Status', 'Submitted To'];
        const csvContent = [
            headers.join(','),
            ...filteredRecords.map(r => 
                [r.compId, r.federalId, `"${r.title}"`, `"${r.provinces.join('|')}"`, r.compilationDate, r.status, `"${r.submittedTo}"`].join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `compiled_records_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const filteredRecords = records.filter(r => 
        r.title.toLowerCase().includes(searchText.toLowerCase()) || 
        r.compId.toLowerCase().includes(searchText.toLowerCase()) ||
        r.federalId.toLowerCase().includes(searchText.toLowerCase())
    );

    // Get included responses content for the viewing record
    const includedResponses = viewingRecord ? db.getResponses().filter(r => r.federalId === viewingRecord.federalId && viewingRecord.provinces.includes(r.province)) : [];

    return (
        <div>
            {!viewingRecord ? (
                /* --- List View --- */
                <div className="table-container">
                    <div className="table-header">
                        <div>
                            <h2>Compiled Records</h2>
                            <p className="text-lt" style={{fontSize: '13px'}}>Archive of generated federal reports</p>
                        </div>
                        <div className="search-bar" style={{flexWrap: 'wrap'}}>
                            <div style={{position: 'relative'}}>
                                <input 
                                    type="text" 
                                    placeholder="Search Records..." 
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    style={{paddingLeft: '35px', width: '300px'}}
                                />
                                <Search size={16} style={{position: 'absolute', left: '10px', top: '12px', color: '#757575'}} />
                            </div>
                            <button className="btn btn-secondary" onClick={handleExportCSV} title="Export CSV">
                                <Download size={16} />
                            </button>
                            <button className="btn btn-secondary" onClick={() => window.print()} title="Print">
                                <Printer size={16} />
                            </button>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Compilation ID</th>
                                <th>Federal ID</th>
                                <th>Title</th>
                                <th>Provinces Included</th>
                                <th>Compilation Date</th>
                                <th>Submitted To</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th style={{textAlign: 'center'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map(r => (
                                <tr key={r.compId} style={{backgroundColor: r.status === 'submitted' ? '#E8F5E9' : '#F5F5F5'}}>
                                    <td style={{fontWeight: 500}}>{r.compId}</td>
                                    <td className="text-lt">{r.federalId}</td>
                                    <td>{r.title}</td>
                                    <td>{r.provinces.join(', ')}</td>
                                    <td>{r.compilationDate}</td>
                                    <td>{r.submittedTo || '-'}</td>
                                    <td>{r.submissionDate || '-'}</td>
                                    <td>
                                        <span className={`status-badge status-${r.status}`}>
                                            {r.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <div className="dropdown-menu">
                                            <button className="three-dots" onClick={() => toggleDropdown(r.compId)}>
                                                <MoreVertical size={16} />
                                            </button>
                                            <div className={`dropdown-content ${dropdownOpenId === r.compId ? 'show' : ''}`}>
                                                <button className="dropdown-item" onClick={() => handleView(r)}>
                                                    <Eye size={14} /> View
                                                </button>
                                                
                                                {r.status === 'draft' ? (
                                                    <>
                                                        <button className="dropdown-item" onClick={() => handleEdit(r)}>
                                                            <Edit size={14} /> Edit & Submit
                                                        </button>
                                                        <div className="dropdown-divider"></div>
                                                        <button className="dropdown-item danger" onClick={() => handleDelete(r.compId)}>
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button className="dropdown-item" onClick={() => handleDownload(r)}>
                                                            <Download size={14} /> Download
                                                        </button>
                                                        <div className="dropdown-divider"></div>
                                                        <button className="dropdown-item danger" onClick={() => handleDelete(r.compId)}>
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRecords.length === 0 && (
                                <tr><td colSpan={9} style={{textAlign: 'center', padding: '30px', color: '#777'}}>No records found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* --- Detail / Edit View (Reuse Compilation Design) --- */
                <div className="record-detail">
                    <div className="record-header">
                        <div className="record-title-section">
                            <h1>{viewingRecord.title}</h1>
                            <div className="record-meta">
                                <span className="meta-tag">{viewingRecord.compId}</span>
                                <span className="meta-tag">{viewingRecord.federalId}</span>
                                <span className={`status-badge status-${viewingRecord.status}`} style={{borderRadius:'20px'}}>
                                    {viewingRecord.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="action-btns">
                            <button className="btn btn-secondary" onClick={handleCloseModal}>
                                <ChevronLeft size={16} /> Back
                            </button>
                        </div>
                    </div>

                    <div className="record-content">
                        {/* 1. Details */}
                        <div className="content-section">
                            <h3>Compilation Details</h3>
                            <div className="detail-grid">
                                <div className="detail-label">Federal ID:</div><div className="detail-value">{viewingRecord.federalId}</div>
                                <div className="detail-label">Provinces:</div><div className="detail-value">{viewingRecord.provinces.join(', ')}</div>
                                <div className="detail-label">Compilation Date:</div><div className="detail-value">{viewingRecord.compilationDate}</div>
                                <div className="detail-label">Submitted To:</div><div className="detail-value">{viewingRecord.submittedTo || 'Not submitted yet'}</div>
                                <div className="detail-label">Submission Date:</div><div className="detail-value">{viewingRecord.submissionDate || '-'}</div>
                                <div className="detail-label">Attachment:</div><div className="detail-value">{viewingRecord.attachment || 'Pending generation'}</div>
                            </div>
                        </div>

                         {/* 2. Province Responses */}
                         <div>
                             <h3 style={{color: 'var(--pk-green)', marginBottom: '15px', fontSize: '18px', fontWeight: 600}}>Province Responses Included</h3>
                             {includedResponses.map(res => (
                                 <div key={res.resId} style={{marginBottom: '20px', border: '2px solid var(--blue)', borderRadius: '10px', overflow: 'hidden'}}>
                                     <div style={{background: '#FAFAFA', padding: '15px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px'}}>
                                         <span style={{fontSize: '20px'}}>🏛️</span>
                                         <h4 style={{margin: 0, color: 'var(--pk-green)', fontWeight: 600}}>{res.province}</h4>
                                     </div>
                                     <div style={{padding: '20px', background: '#fff', fontSize: '14px', lineHeight: 1.6, color: '#333'}}>
                                         {res.content}
                                     </div>
                                 </div>
                             ))}
                        </div>

                        {/* 3. Federal Summary (Edit or View) */}
                        <div className="content-section" style={{borderLeftColor: 'var(--pk-green)', background: '#E8F5E9'}}>
                            <h3>Federal Executive Summary</h3>
                            {isEditing ? (
                                <>
                                    <p style={{fontSize: '13px', color: '#555', marginBottom: '10px'}}>Provide a consolidated summary of the provincial findings to be included in the final report.</p>
                                    <textarea 
                                        value={summaryText}
                                        onChange={(e) => setSummaryText(e.target.value)}
                                        style={{width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ccc', minHeight: '120px'}}
                                        placeholder="Enter executive summary..."
                                    />
                                </>
                            ) : (
                                <p style={{lineHeight: 1.6, whiteSpace: 'pre-wrap'}}>{viewingRecord.summary || 'No summary provided.'}</p>
                            )}
                        </div>

                        {/* Actions Footer */}
                        {isEditing && (
                            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
                                <button className="btn btn-secondary" onClick={handleSaveUpdate}>
                                    <FileText size={16} /> Save Changes
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmitUpdate}>
                                    <Send size={16} /> Submit to Ministry
                                </button>
                            </div>
                        )}
                        
                        {!isEditing && viewingRecord.status === 'submitted' && (
                             <div style={{display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
                                <button className="btn btn-primary" onClick={() => handleDownload(viewingRecord)}>
                                    <Download size={16} /> Download Report
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};