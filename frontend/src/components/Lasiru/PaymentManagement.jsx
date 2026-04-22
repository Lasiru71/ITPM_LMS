import React, { useState, useEffect } from "react";
import { DollarSign, CheckCircle, XCircle, Trash2, Search, Filter, Eye } from "lucide-react";
import api from "../../services/api";
import { useToast } from "./ToastProvider";

const PaymentManagement = () => {
    const { showToast } = useToast();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");

    const [selectedPayment, setSelectedPayment] = useState(null);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const res = await api.get("/payments");
            setPayments(res.data);
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to load payments");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'delete') {
                if (!window.confirm("Delete this payment?")) return;
                await api.delete(`/payments/${id}`);
                showToast("success", "Payment deleted");
            } else {
                await api.put(`/payments/${action}/${id}`);
                showToast("success", `Payment ${action}ed`);
            }
            setSelectedPayment(null);
            fetchPayments();
        } catch (error) {
            showToast("error", "Action failed");
        }
    };

    const filtered = payments.filter(p => {
        const matchesSearch = (p.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === "ALL" || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        approved: payments.filter(p => p.status === "APPROVED").length,
        pending: payments.filter(p => p.status === "PENDING").length,
        rejected: payments.filter(p => p.status === "REJECTED").length,
    };

    const renderDetailModal = () => {
        if (!selectedPayment) return null;
        const p = selectedPayment;
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                    <button onClick={() => setSelectedPayment(null)} style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
                    
                    <h2 style={{ margin: '0 0 1.5rem' }}>Transaction Details</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Student ID</div>
                            <div style={{ fontWeight: 600 }}>{p.studentId}</div>
                        </div>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Course</div>
                            <div style={{ fontWeight: 600 }}>{p.course?.title || 'N/A'}</div>
                        </div>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Amount</div>
                            <div style={{ fontWeight: 700, color: '#10b981', fontSize: '1.2rem' }}>$ {(p.amount || 0).toLocaleString()}</div>
                        </div>
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Method</div>
                            <div style={{ fontWeight: 600 }}>{p.method}</div>
                        </div>
                    </div>

                    {p.method === 'CARD' && p.cardDetails && (
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1rem', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DollarSign size={18} color="#3b82f6" /> Card Information
                            </h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Cardholder</div>
                                    <div style={{ fontWeight: 500 }}>{p.cardDetails.cardName}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Card Number</div>
                                    <div style={{ fontWeight: 500 }}>**** **** **** {p.cardDetails.cardLast4}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {p.method === 'BANK_TRANSFER' && p.slipImage && (
                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                            <h3 style={{ fontSize: '1rem', margin: '0 0 1rem' }}>Bank Transfer Slip</h3>
                            <div style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
                                <img 
                                    src={`${p.slipImage}`} 
                                    alt="Payment Slip"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => window.open(`${p.slipImage}`, '_blank')}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>Click image to view full size</p>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        {p.status === 'PENDING' ? (
                            <>
                                <button className="admin-btn admin-btn-ghost" onClick={() => handleAction(p._id, 'reject')} style={{ borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <XCircle size={18} /> Reject Payment
                                </button>
                                <button className="admin-btn admin-btn-primary" onClick={() => handleAction(p._id, 'approve')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CheckCircle size={18} /> Approve Payment
                                </button>
                            </>
                        ) : (
                            <button className="admin-btn admin-btn-ghost" onClick={() => setSelectedPayment(null)}>Close</button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="payment-management" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {renderDetailModal()}
            <div className="stats-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid #10b981' }}>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Approved</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.approved}</div>
                </div>
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Pending</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.pending}</div>
                </div>
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', borderLeft: '4px solid #ef4444' }}>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Rejected</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stats.rejected}</div>
                </div>
            </div>

            <div className="table-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search student or course..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                    />
                </div>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', minWidth: '150px' }}
                >
                    <option value="ALL">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            <div className="table-container" style={{ background: 'white', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>Student</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>Course</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>Amount</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>Method</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.85rem', color: '#64748b' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{p.studentId}</div>
                                </td>
                                <td style={{ padding: '1rem', color: '#475569' }}>{p.course?.title || 'N/A'}</td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>$ {(p.amount || 0).toLocaleString()}</td>
                                <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{p.method}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ 
                                        padding: '0.25rem 0.75rem', 
                                        borderRadius: '1rem', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 600,
                                        background: p.status === 'APPROVED' ? '#ecfdf5' : p.status === 'PENDING' ? '#fffbeb' : '#fef2f2',
                                        color: p.status === 'APPROVED' ? '#059669' : p.status === 'PENDING' ? '#d97706' : '#dc2626'
                                    }}>
                                        {p.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button onClick={() => setSelectedPayment(p)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }} title="View Details"><Eye size={18} /></button>
                                        {p.status === 'PENDING' && (
                                            <>
                                                <button onClick={() => handleAction(p._id, 'approve')} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer' }} title="Approve"><CheckCircle size={18} /></button>
                                                <button onClick={() => handleAction(p._id, 'reject')} style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer' }} title="Reject"><XCircle size={18} /></button>
                                            </>
                                        )}
                                        <button onClick={() => handleAction(p._id, 'delete')} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} title="Delete"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentManagement;
