import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    LogOut,
    Bell,
    ChevronRight,
    TrendingUp,
    GraduationCap,
    School,
    Activity,
    DollarSign,
    FileText,
    Download,
    Eye,
    Megaphone,
    Upload,
    Star,
    Settings
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useToast } from "../../components/Lasiru/ToastProvider";
import "../../Styles/Lasiru/AdminDashboard.css";
import LectureManagement from "../../components/Lasiru/LectureManagement";
import StudentManagement from "../../components/Lasiru/StudentManagement";
import AnnouncementManagement from "../../components/Lasiru/AnnouncementManagement";
import ReviewManagement from "../../components/Lasiru/ReviewManagement";
import MaterialUpload from "../../components/sadeepa/MaterialUpload";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import { getDashboardStats, getAllLecturers, getAllStudents } from "../../api/Lasiru/adminApi";

const COLORS = ['#12b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({
        totals: { students: 0, lecturers: 0, active: 0, total: 0 },
        growth: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
            showToast("error", "Failed to load dashboard statistics");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("success", "Logged out successfully");
        navigate("/login");
    };

    // --- PDF Report Generation ---
    const generatePDFReport = async (type) => {
        try {
            const doc = new jsPDF();
            const timestamp = new Date().toLocaleString();

            doc.setFontSize(22);
            doc.setTextColor(18, 185, 129); // Primary color
            doc.text("EduVault", 14, 20);

            doc.setFontSize(18);
            doc.setTextColor(30, 41, 59); // Dark grey
            doc.text(`${type}`, 14, 30);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Report Generation Date: ${timestamp}`, 14, 40);
            doc.text(`Authorized by: ${user.name || "Administrator"}`, 14, 46);
            doc.line(14, 52, 196, 52);

            if (type === "Lecturer Directory") {
                const data = await getAllLecturers();
                const tableData = data.map((l, index) => [
                    index + 1,
                    l.name,
                    l.email,
                    l.isActive ? "Active" : "Inactive",
                    new Date(l.createdAt).toLocaleDateString()
                ]);

                autoTable(doc, {
                    startY: 60,
                    head: [['#', 'Name', 'Email Address', 'Status', 'Joined Date']],
                    body: tableData,
                    theme: 'striped',
                    headStyles: { fillColor: [18, 185, 129], textColor: [255, 255, 255] },
                });
            }
            else if (type === "Student Roster") {
                const data = await getAllStudents();
                const tableData = data.map((s, index) => [
                    index + 1,
                    s.nicNumber || "N/A",
                    s.name,
                    s.email,
                    s.isActive ? "Active" : "Inactive"
                ]);

                autoTable(doc, {
                    startY: 60,
                    head: [['#', 'NIC Number', 'Full Name', 'Email Address', 'Status']],
                    body: tableData,
                    theme: 'grid',
                    headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
                });
            }
            else if (type === "System Overview") {
                const tableData = [
                    ["Platform Summary", ""],
                    ["Total Registered Users", stats.totals.total],
                    ["Active Students", stats.totals.students],
                    ["Registered Lecturers", stats.totals.lecturers],
                    ["Current Active Sessions", stats.totals.active],
                    ["Revenue Analysis", "$2.8M (Platform Growth Estimate)"]
                ];

                autoTable(doc, {
                    startY: 60,
                    head: [['Metric', 'Value']],
                    body: tableData,
                    theme: 'plain',
                    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
                    styles: { fontSize: 12, cellPadding: 5 }
                });
            }

            const fileName = `EduVault_${type.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            showToast("success", "PDF Report generated and downloaded");
        } catch (error) {
            console.error("PDF Generation Error:", error);
            showToast("error", "Error generating PDF. Please try again.");
        }
    };

    const renderOverview = () => {
        const donutData = [
            { name: 'Students', value: stats.totals.students },
            { name: 'Lecturers', value: stats.totals.lecturers },
            { name: 'Admins', value: 1 },
        ];

        return (
            <div className="admin-overview" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
                    padding: '2.5rem', 
                    borderRadius: '2rem', 
                    color: 'white', 
                    marginBottom: '2.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>Welcome back, {user.name || "Admin"}! 👋</h1>
                        <p style={{ opacity: 0.8, fontSize: '1.1rem', marginTop: '0.5rem', maxWidth: '600px' }}>
                            Here's what's happening with the platform today. You have {stats.totals.active} users active right now.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="admin-btn admin-btn-primary" onClick={() => setActiveTab('reports')}>
                                <FileText size={18} /> View Reports
                            </button>
                            <button className="admin-btn admin-btn-ghost" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none' }} onClick={() => navigate("/")}>
                                <Eye size={18} /> Preview Site
                            </button>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div style={{ 
                        position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', 
                        background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', filter: 'blur(40px)' 
                    }} />
                </div>

                <div className="stats-grid">
                    <div className="stat-card" style={{ transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                            <Users size={24} />
                        </div>
                        <div className="stat-info">
                            <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#1e293b' }}>{stats.totals.total}</h3>
                            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Total Users</p>
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#10b981' }}>
                                <TrendingUp size={16} /> <span>12% growth</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card" style={{ transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                            <BookOpen size={24} />
                        </div>
                        <div className="stat-info">
                            <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#1e293b' }}>{stats.totals.lecturers + stats.totals.students}</h3>
                            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Total Enrollments</p>
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#3b82f6' }}>
                                <GraduationCap size={16} /> <span>New courses active</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card" style={{ transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f3ff', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-info">
                            <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#1e293b' }}>$2.8M</h3>
                            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Revenue</p>
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#8b5cf6' }}>
                                <Activity size={16} /> <span>8.2% vs last month</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card" style={{ transition: 'transform 0.3s ease', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff7ed', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                            <Activity size={24} />
                        </div>
                        <div className="stat-info">
                            <h3 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 800, color: '#1e293b' }}>{stats.totals.active}</h3>
                            <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontWeight: 500, fontSize: '0.95rem' }}>Active Now</p>
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#f59e0b' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s infinite' }}></div>
                                <span>Real-time tracking</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="charts-container">
                    <div className="chart-card" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>User Growth Trend</h3>
                            <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                                <option>Last 30 Days</option>
                                <option>Last 6 Months</option>
                            </select>
                        </div>
                        <div style={{ width: '100%', height: 300, marginTop: '2rem' }}>
                            <ResponsiveContainer>
                                <AreaChart data={stats.growth}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="users" stroke="#10b981" fill="url(#colorUsers)" strokeWidth={4} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="chart-card" style={{ borderRadius: '1.5rem', padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Enrollment Distribution</h3>
                        <div style={{ width: '100%', height: 250, marginTop: '2rem', position: 'relative' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={donutData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                                        {donutData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{stats.totals.total}</span>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total</span>
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                            {donutData.map((d, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i % COLORS.length] }}></div>
                                    <span style={{ color: '#64748b' }}>{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
                `}</style>
            </div>
        );
    };

    const renderReports = () => {
        const reports = [
            { title: "System Overview", desc: "Overall platform statistics and performance metrics.", color: "#8b5cf6" },
            { title: "Lecturer Directory", desc: "Complete list of all registered lecturers and their status.", color: "#12b981" },
            { title: "Student Roster", desc: "Detailed list of enrolled students with IDs and contact info.", color: "#3b82f6" },
        ];

        return (
            <div className="admin-reports">
                <div style={{ marginBottom: "2.5rem" }}>
                    <h2 style={{ margin: 0 }}>Report Center</h2>
                    <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Generate professional PDF reports for your specific modules.</p>
                </div>
                <div className="reports-grid">
                    {reports.map((r) => (
                        <div className="report-card" key={r.title}>
                            <div style={{ color: r.color }}><FileText size={32} /></div>
                            <div className="report-info">
                                <h3 style={{ margin: 0 }}>{r.title}</h3>
                                <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.5rem" }}>{r.desc}</p>
                            </div>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                                <button className="admin-btn admin-btn-primary" style={{ flex: 1 }} onClick={() => generatePDFReport(r.title)}>
                                    <Download size={18} /> Export PDF
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderPlaceholder = (title, icon) => (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            textAlign: 'center',
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem'
        }}>
            <div style={{ background: '#f1f5f9', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#64748b' }}>
                {icon}
            </div>
            <h2 style={{ margin: 0 }}>{title}</h2>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '1rem 0 2rem' }}>
                The {title.toLowerCase()} management system is under development for future implementation.
            </p>
            <button className="admin-btn admin-btn-ghost" disabled>
                Stay Tuned
            </button>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case "lecturers": return <LectureManagement onUpdate={fetchStats} />;
            case "students": return <StudentManagement onUpdate={fetchStats} />;
            case "reports": return renderReports();
            case "materials": return <MaterialUpload />;
            case 'announcement':
                return <AnnouncementManagement />;
            case "reviews":
                return <ReviewManagement />;
            default:
                return renderOverview();
        }
    };

    return (
        <div className="admin-dashboard-container">
            <aside className="admin-sidebar" id="admin-sidebar">
                <div className="admin-logo">
                    <div className="lasiru-logo-icon" style={{ background: '#12b981' }}>
                        <BookOpen size={20} color="white" />
                    </div>
                    <span>EduVault</span>
                </div>

                <nav className="admin-nav">
                    <div className="nav-section-title">Main</div>
                    <div className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
                        <div className="nav-item-content"><LayoutDashboard size={20} /> Overview</div>
                        {activeTab === "overview" && <ChevronRight size={16} />}
                    </div>

                    <div className="nav-section-title">Directory</div>
                    <div className={`admin-nav-item ${activeTab === "lecturers" ? "active" : ""}`} onClick={() => setActiveTab("lecturers")}>
                        <div className="nav-item-content"><GraduationCap size={20} /> Lecturers</div>
                        {activeTab === "lecturers" && <ChevronRight size={16} />}
                    </div>
                    <div className={`admin-nav-item ${activeTab === "students" ? "active" : ""}`} onClick={() => setActiveTab("students")}>
                        <div className="nav-item-content"><School size={20} /> Students</div>
                        {activeTab === "students" && <ChevronRight size={16} />}
                    </div>

                    <div className="nav-section-title">Academic</div>
                    <div className={`admin-nav-item ${activeTab === "materials" ? "active" : ""}`} onClick={() => setActiveTab("materials")}>
                        <div className="nav-item-content"><Upload size={20} /> Materials</div>
                        {activeTab === "materials" && <ChevronRight size={16} />}
                    </div>

                    <div className="nav-section-title">Business</div>
                    <div className={`admin-nav-item ${activeTab === "reports" ? "active" : ""}`} onClick={() => setActiveTab("reports")}>
                        <div className="nav-item-content"><FileText size={20} /> Reports</div>
                        {activeTab === "reports" && <ChevronRight size={16} />}
                    </div>

                    <div className="nav-section-title">Communication</div>
                    <div className={`admin-nav-item ${activeTab === "announcement" ? "active" : ""}`} onClick={() => setActiveTab("announcement")}>
                        <div className="nav-item-content"><Megaphone size={20} /> Announcement</div>
                        {activeTab === "announcement" && <ChevronRight size={16} />}
                    </div>

                    <div className="nav-section-title">Feedback</div>
                    <div className={`admin-nav-item ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>
                        <div className="nav-item-content"><Star size={20} /> Reviews</div>
                        {activeTab === "reviews" && <ChevronRight size={16} />}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div
                        style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", cursor: "pointer" }}
                        onClick={() => navigate("/profile")}
                        title="View My Profile"
                    >
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div>
                            <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>{user.name || "Admin"}</div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Administrator</div>
                        </div>
                    </div>
                    <div className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} /> Sign Out
                    </div>
                </div>
            </aside>

            <main className="admin-main-content">
                <DashboardHeader
                    title="Admin Dashboard"
                    showSearch={activeTab === 'lecturers' || activeTab === 'students' || activeTab === 'announcement' || activeTab === 'reviews'}
                    onSearchChange={(val) => console.log("Searching for:", val)}
                />

                <div className="admin-scroll-container">
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p style={{ color: '#64748b', margin: '0.5rem 0 0' }}>Manage your platform components from one place.</p>
                    </div>
                    {loading && activeTab === 'overview' ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
                    ) : renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;