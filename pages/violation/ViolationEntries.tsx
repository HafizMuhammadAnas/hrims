import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDb';
import { ViolationEntry } from '../../types';
import { PROVINCE_DISTRICTS, getDistrictsByProvince } from '../../provinceDistricts';
import { VIOLATION_CATEGORIES, getSubCategoriesByCategory, getIndicatorsBySubCategory, MONITORING_STATUS_OPTIONS } from '../../violationCategories';
import { Plus, Edit, Trash2, Eye, X, Calendar, Clock, MapPin, AlertTriangle, FileText } from 'lucide-react';

const ViolationEntries: React.FC = () => {
    const [entries, setEntries] = useState<ViolationEntry[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState<ViolationEntry | null>(null);
    const [viewingEntry, setViewingEntry] = useState<ViolationEntry | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        entryNumber: '',
        title: '',
        eventDate: '',
        eventTime: '',
        eventYear: new Date().getFullYear().toString(),
        province: '',
        district: '',
        violationCategory: '',
        violationSubCategory: '',
        violationIndicator: '',
        monitoringStatus: '',
        description: ''
    });

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = () => {
        const allEntries = db.getAllViolationEntries();
        setEntries(allEntries);
    };

    const handleAddNew = () => {
        const entryNumber = db.generateEntryNumber();
        setFormData({
            entryNumber,
            title: '',
            eventDate: '',
            eventTime: '',
            eventYear: new Date().getFullYear().toString(),
            province: '',
            district: '',
            violationCategory: '',
            violationSubCategory: '',
            monitoringStatus: '',
            description: ''
        });
        setEditingEntry(null);
        setShowForm(true);
    };

    const handleEdit = (entry: ViolationEntry) => {
        setFormData({
            entryNumber: entry.entryNumber,
            title: entry.title,
            eventDate: entry.eventDate,
            eventTime: entry.eventTime || '',
            eventYear: entry.eventYear,
            province: entry.province,
            district: entry.district || '',
            violationCategory: entry.violationCategory,
            violationSubCategory: entry.violationSubCategory || '',
            violationIndicator: entry.violationIndicator || '',
            monitoringStatus: entry.monitoringStatus,
            description: entry.description
        });
        setEditingEntry(entry);
        setShowForm(true);
    };

    const handleView = (entry: ViolationEntry) => {
        setViewingEntry(entry);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this violation entry?')) {
            db.deleteViolationEntry(id);
            loadEntries();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const entryData: ViolationEntry = {
            id: editingEntry?.id || `violation-${Date.now()}`,
            entryNumber: formData.entryNumber,
            title: formData.title,
            eventDate: formData.eventDate,
            eventTime: formData.eventTime || undefined,
            eventYear: formData.eventYear,
            province: formData.province,
            district: formData.district || undefined,
            violationCategory: formData.violationCategory,
            violationSubCategory: formData.violationSubCategory || undefined,
            monitoringStatus: formData.monitoringStatus,
            description: formData.description,
            createdAt: editingEntry?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (editingEntry) {
            db.updateViolationEntry(entryData.id, entryData);
        } else {
            db.addViolationEntry(entryData);
        }

        setShowForm(false);
        setEditingEntry(null);
        loadEntries();
    };

    const availableDistricts = formData.province ? getDistrictsByProvince(formData.province) : [];
    const availableSubCategories = formData.violationCategory 
        ? getSubCategoriesByCategory(formData.violationCategory) 
        : [];
    const availableIndicators = formData.violationCategory && formData.violationSubCategory
        ? getIndicatorsBySubCategory(formData.violationCategory, formData.violationSubCategory)
        : [];

    const getCategoryName = (categoryId: string) => {
        const category = VIOLATION_CATEGORIES.find(c => c.id === categoryId);
        return category ? category.name : categoryId;
    };

    const getSubCategoryName = (categoryId: string, subCategoryId: string) => {
        const category = VIOLATION_CATEGORIES.find(c => c.id === categoryId);
        if (!category) return subCategoryId;
        const subCategory = category.subCategories.find(sc => sc.id === subCategoryId);
        return subCategory ? subCategory.name : subCategoryId;
    };

    const getIndicatorName = (categoryId: string, subCategoryId: string, indicatorId: string) => {
        const category = VIOLATION_CATEGORIES.find(c => c.id === categoryId);
        if (!category) return indicatorId;
        const subCategory = category.subCategories.find(sc => sc.id === subCategoryId);
        if (!subCategory || !subCategory.indicators) return indicatorId;
        const indicator = subCategory.indicators.find(i => i.id === indicatorId);
        return indicator ? indicator.name : indicatorId;
    };

    const getMonitoringStatusLabel = (status: string) => {
        const option = MONITORING_STATUS_OPTIONS.find(o => o.value === status);
        return option ? option.label : status;
    };

    if (showForm) {
        return (
            <div className="form-container" style={{maxWidth: '1000px'}}>
                <div className="form-header" style={{flexWrap: 'wrap', gap: '15px'}}>
                    <h2 style={{flex: 1, minWidth: '200px'}}>{editingEntry ? 'Edit Violation Entry' : 'Add New Violation Entry'}</h2>
                    <button onClick={() => { setShowForm(false); setEditingEntry(null); }} className="btn btn-secondary">
                        <X size={16} /> Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Entry Number */}
                    <div className="form-row">
                        <div className="form-field">
                            <label>Entry Number *</label>
                            <input 
                                type="text" 
                                value={formData.entryNumber}
                                placeholder="EWS-53453542"
                                disabled
                                style={{background: '#f5f5f5'}}
                            />
                        </div>
                        <div className="form-field">
                            <label>Title *</label>
                            <input 
                                type="text" 
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                required
                                placeholder="Enter violation title"
                            />
                        </div>
                    </div>

                    {/* Event/Case Date */}
                    <div className="form-row">
                        <div className="form-field">
                            <label>Date*</label>
                            <input 
                                type="date" 
                                value={formData.eventDate}
                                onChange={e => setFormData({...formData, eventDate: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label>Time ~ وقت</label>
                            <input 
                                type="time" 
                                value={formData.eventTime}
                                onChange={e => setFormData({...formData, eventTime: e.target.value})}
                            />
                        </div>
                        <div className="form-field">
                            <label>Year ~ سال *</label>
                            <input 
                                type="number" 
                                value={formData.eventYear}
                                onChange={e => setFormData({...formData, eventYear: e.target.value})}
                                required
                                min="2000"
                                max={new Date().getFullYear() + 1}
                            />
                        </div>
                    </div>

                    {/* Geographic Location */}
                    <div className="form-row">
                        <div className="form-field">
                            <label>Geographic Location ~ جغرافیائی مقام - Province *</label>
                            <select 
                                value={formData.province}
                                onChange={e => {
                                    setFormData({...formData, province: e.target.value, district: ''});
                                }}
                                required
                            >
                                <option value="">- None -</option>
                                {PROVINCE_DISTRICTS.map(p => (
                                    <option key={p.id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>District ~ ضلع</label>
                            <select 
                                value={formData.district}
                                onChange={e => setFormData({...formData, district: e.target.value})}
                                disabled={!formData.province || availableDistricts.length === 0}
                            >
                                <option value="">- None -</option>
                                {availableDistricts.map(d => (
                                    <option key={d.id} value={d.name}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Violation Categories */}
                    <div className="form-row">
                        <div className="form-field">
                            <label>Violation Category *</label>
                            <select 
                                value={formData.violationCategory}
                                onChange={e => {
                                    setFormData({...formData, violationCategory: e.target.value, violationSubCategory: '', violationIndicator: ''});
                                }}
                                required
                            >
                                <option value="">- Select Category -</option>
                                {VIOLATION_CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Violation Sub-Category</label>
                            <select 
                                value={formData.violationSubCategory}
                                onChange={e => {
                                    setFormData({...formData, violationSubCategory: e.target.value, violationIndicator: ''});
                                }}
                                disabled={!formData.violationCategory || availableSubCategories.length === 0}
                            >
                                <option value="">- None -</option>
                                {availableSubCategories.map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Violation Indicator</label>
                            <select 
                                value={formData.violationIndicator}
                                onChange={e => setFormData({...formData, violationIndicator: e.target.value})}
                                disabled={!formData.violationSubCategory || availableIndicators.length === 0}
                            >
                                <option value="">- None -</option>
                                {availableIndicators.map(ind => (
                                    <option key={ind.id} value={ind.id}>{ind.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Monitoring Status */}
                    <div className="form-row">
                        <div className="form-field">
                            <label>Monitoring Status ~ مانیٹرنگ کی حالت *</label>
                            <select 
                                value={formData.monitoringStatus}
                                onChange={e => setFormData({...formData, monitoringStatus: e.target.value})}
                                required
                            >
                                {MONITORING_STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Violation Description */}
                    <div className="form-row">
                        <div className="form-field full">
                            <label>Violation Description ~ خلاف ورزی کی تفصیل *</label>
                            <textarea 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                required
                                placeholder="Enter detailed violation description..."
                                style={{minHeight: '200px'}}
                            />
                            <p style={{fontSize: '12px', color: '#666', marginTop: '5px'}}>
                                You can enter detailed description of the violation here. Rich text formatting is supported.
                            </p>
                        </div>
                    </div>

                    <div className="form-buttons">
                        <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingEntry(null); }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingEntry ? 'Update Entry' : 'Create Entry'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (viewingEntry) {
        return (
            <div className="form-container" style={{maxWidth: '1000px'}}>
                <div className="form-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>Violation Entry Details</h2>
                    <button onClick={() => setViewingEntry(null)} className="btn btn-secondary">
                        <X size={16} /> Close
                    </button>
                </div>

                <div className="record-detail">
                    <div className="record-header">
                        <div className="record-title-section">
                            <h1>{viewingEntry.title}</h1>
                            <div className="record-meta">
                                <span className="meta-tag">{viewingEntry.entryNumber}</span>
                                <span className="meta-tag">{getCategoryName(viewingEntry.violationCategory)}</span>
                                <span className="meta-tag">{getMonitoringStatusLabel(viewingEntry.monitoringStatus)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="record-content">
                        <div className="content-section">
                            <h3>Event Information</h3>
                            <div className="detail-grid">
                                <div className="detail-label">Event Date</div>
                                <div className="detail-value">{viewingEntry.eventDate}</div>
                                {viewingEntry.eventTime && (
                                    <>
                                        <div className="detail-label">Event Time</div>
                                        <div className="detail-value">{viewingEntry.eventTime}</div>
                                    </>
                                )}
                                <div className="detail-label">Year</div>
                                <div className="detail-value">{viewingEntry.eventYear}</div>
                            </div>
                        </div>

                        <div className="content-section">
                            <h3>Geographic Location</h3>
                            <div className="detail-grid">
                                <div className="detail-label">Province</div>
                                <div className="detail-value">{viewingEntry.province}</div>
                                {viewingEntry.district && (
                                    <>
                                        <div className="detail-label">District</div>
                                        <div className="detail-value">{viewingEntry.district}</div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="content-section">
                            <h3>Violation Details</h3>
                            <div className="detail-grid">
                                <div className="detail-label">Category</div>
                                <div className="detail-value">{getCategoryName(viewingEntry.violationCategory)}</div>
                                {viewingEntry.violationSubCategory && (
                                    <>
                                        <div className="detail-label">Sub-Category</div>
                                        <div className="detail-value">{getSubCategoryName(viewingEntry.violationCategory, viewingEntry.violationSubCategory)}</div>
                                    </>
                                )}
                                {viewingEntry.violationIndicator && (
                                    <>
                                        <div className="detail-label">Indicator</div>
                                        <div className="detail-value">{getIndicatorName(viewingEntry.violationCategory, viewingEntry.violationSubCategory || '', viewingEntry.violationIndicator)}</div>
                                    </>
                                )}
                                <div className="detail-label">Monitoring Status</div>
                                <div className="detail-value">{getMonitoringStatusLabel(viewingEntry.monitoringStatus)}</div>
                            </div>
                        </div>

                        <div className="content-section">
                            <h3>Description</h3>
                            <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.8}}>{viewingEntry.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="table-header" style={{marginBottom: '24px'}}>
                <div>
                    <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#01411C', marginBottom: '4px'}}>Violation Entries</h2>
                    <p style={{fontSize: '14px', color: '#666', margin: 0}}>Manage and track all violation entries in the database</p>
                </div>
                <button 
                    onClick={handleAddNew} 
                    className="btn btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(1, 65, 28, 0.2)',
                        transition: 'all 0.2s'
                    }}
                >
                    <Plus size={18} /> Add New Entry
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Entries</p>
                            <p className="text-2xl font-bold text-[#01411C]">{entries.length}</p>
                        </div>
                        <div className="bg-[#01411C]/10 p-3 rounded-lg">
                            <FileText className="text-[#01411C]" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Resolved</p>
                            <p className="text-2xl font-bold text-green-600">
                                {entries.filter(e => e.monitoringStatus === 'resolved').length}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <CheckCircle className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">In Progress</p>
                            <p className="text-2xl font-bold text-yellow-600">
                                {entries.filter(e => e.monitoringStatus === 'in-progress').length}
                            </p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {entries.length === 0 ? (
                <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                    <AlertTriangle size={48} style={{margin: '0 auto 20px', opacity: 0.5}} />
                    <p>No violation entries found. Click "Add Entry" to create a new entry.</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block" style={{overflowX: 'auto'}}>
                        <table style={{minWidth: '900px'}}>
                            <thead>
                                <tr>
                                    <th>Entry Number</th>
                                    <th>Title</th>
                                    <th>Event Date</th>
                                    <th>Province</th>
                                    <th>Category</th>
                                    <th>Monitoring Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(entry => (
                                    <tr key={entry.id}>
                                        <td>{entry.entryNumber}</td>
                                        <td>{entry.title}</td>
                                        <td>{entry.eventDate}</td>
                                        <td>{entry.province}</td>
                                        <td>{getCategoryName(entry.violationCategory)}</td>
                                        <td>
                                            <span className={`status-badge ${
                                                entry.monitoringStatus === 'resolved' ? 'status-completed' :
                                                entry.monitoringStatus === 'confirmed-verified' ? 'status-accepted' :
                                                entry.monitoringStatus === 'dismissed' ? 'status-rejected' :
                                                entry.monitoringStatus === 'in-progress' ? 'status-pending' :
                                                'status-draft'
                                            }`}>
                                                {getMonitoringStatusLabel(entry.monitoringStatus)}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                                                <button 
                                                    onClick={() => handleView(entry)}
                                                    className="btn btn-secondary"
                                                    style={{padding: '6px 12px', fontSize: '12px'}}
                                                    title="View"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleEdit(entry)}
                                                    className="btn btn-secondary"
                                                    style={{padding: '6px 12px', fontSize: '12px'}}
                                                    title="Edit"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(entry.id)}
                                                    className="btn btn-secondary"
                                                    style={{padding: '6px 12px', fontSize: '12px', color: '#F44336'}}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {entries.map(entry => (
                            <div key={entry.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 mb-1" style={{fontSize: '16px'}}>{entry.title}</h3>
                                        <p className="text-sm text-gray-500">{entry.entryNumber}</p>
                                    </div>
                                    <span className={`status-badge ${
                                        entry.monitoringStatus === 'resolved' ? 'status-completed' :
                                        entry.monitoringStatus === 'confirmed-verified' ? 'status-accepted' :
                                        entry.monitoringStatus === 'dismissed' ? 'status-rejected' :
                                        entry.monitoringStatus === 'in-progress' ? 'status-pending' :
                                        'status-draft'
                                    }`} style={{fontSize: '11px', padding: '4px 10px'}}>
                                        {getMonitoringStatusLabel(entry.monitoringStatus)}
                                    </span>
                                </div>
                                
                                <div className="space-y-2 mb-3" style={{fontSize: '14px'}}>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Event Date:</span>
                                        <span className="text-gray-800 font-medium">{entry.eventDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Province:</span>
                                        <span className="text-gray-800 font-medium">{entry.province}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category:</span>
                                        <span className="text-gray-800 font-medium text-right" style={{maxWidth: '60%'}}>
                                            {getCategoryName(entry.violationCategory)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-gray-200">
                                    <button 
                                        onClick={() => handleView(entry)}
                                        className="btn btn-secondary flex-1"
                                        style={{padding: '8px', fontSize: '12px', justifyContent: 'center'}}
                                    >
                                        <Eye size={14} style={{marginRight: '4px'}} /> View
                                    </button>
                                    <button 
                                        onClick={() => handleEdit(entry)}
                                        className="btn btn-secondary flex-1"
                                        style={{padding: '8px', fontSize: '12px', justifyContent: 'center'}}
                                    >
                                        <Edit size={14} style={{marginRight: '4px'}} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(entry.id)}
                                        className="btn btn-secondary flex-1"
                                        style={{padding: '8px', fontSize: '12px', justifyContent: 'center', color: '#F44336'}}
                                    >
                                        <Trash2 size={14} style={{marginRight: '4px'}} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ViolationEntries;

