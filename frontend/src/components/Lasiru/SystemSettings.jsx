import React, { useState, useEffect } from "react";
import { Save, RefreshCcw, Globe, Mail, Phone, MapPin, ShieldAlert } from "lucide-react";
import { useToast } from "./ToastProvider";

const SystemSettings = () => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: "EduVault",
        logoUrl: "",
        contactEmail: "support@eduvault.com",
        contactPhone: "+94 11 234 5678",
        address: "123 Academic Way, Colombo, Sri Lanka",
        maintenanceMode: false,
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem("systemSettings");
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Mocking API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            localStorage.setItem("systemSettings", JSON.stringify(settings));
            showToast("success", "System settings updated successfully");
        } catch (error) {
            showToast("error", "Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset to default settings?")) {
            const defaults = {
                siteName: "EduVault",
                logoUrl: "",
                contactEmail: "support@eduvault.com",
                contactPhone: "+94 11 234 5678",
                address: "123 Academic Way, Colombo, Sri Lanka",
                maintenanceMode: false,
            };
            setSettings(defaults);
            localStorage.setItem("systemSettings", JSON.stringify(defaults));
            showToast("info", "Settings reset to defaults");
        }
    };

    return (
        <div className="system-settings-container" style={{ padding: '1rem' }}>
            <div className="settings-card" style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ margin: 0 }}>Global Configuration</h2>
                        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Manage your platform's core identity and status.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="admin-btn admin-btn-ghost" onClick={handleReset} disabled={loading}>
                            <RefreshCcw size={18} /> Reset
                        </button>
                        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={loading}>
                            <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="settings-section">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Globe size={20} color="#3b82f6" /> Identity Settings
                        </h3>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Platform Name</label>
                            <input 
                                type="text" 
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Logo URL (Optional)</label>
                            <input 
                                type="text" 
                                name="logoUrl"
                                value={settings.logoUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail size={20} color="#12b981" /> Contact Information
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Support Email</label>
                            <input 
                                type="email" 
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Contact Phone</label>
                            <input 
                                type="text" 
                                name="contactPhone"
                                value={settings.contactPhone}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShieldAlert size={20} color="#ef4444" /> Advanced Controls
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: '#fef2f2', borderRadius: '1rem', border: '1px solid #fee2e2' }}>
                        <div>
                            <h4 style={{ margin: 0, color: '#991b1b' }}>Maintenance Mode</h4>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#b91c1c' }}>When enabled, only administrators can access the platform.</p>
                        </div>
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                            <input 
                                type="checkbox" 
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span className="slider round" style={{ 
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                backgroundColor: settings.maintenanceMode ? '#ef4444' : '#ccc', 
                                transition: '.4s', borderRadius: '34px' 
                            }}>
                                <span style={{ 
                                    position: 'absolute', content: '""', height: '18px', width: '18px', left: '4px', bottom: '4px', 
                                    backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                    transform: settings.maintenanceMode ? 'translateX(24px)' : 'none'
                                }}></span>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
