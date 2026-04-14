import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    LogOut,
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
    Star
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
                    s.studentId || "N/A",
                    s.name,
                    s.email,
                    s.isActive ? "Active" : "Inactive"
                ]);

                autoTable(doc, {
                    startY: 60,
                    head: [['#', 'Student ID', 'Full Name', 'Email Address', 'Status']],
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
                    padding: '3rem',
                    borderRadius: '2rem',
                    color: 'white',
                    marginBottom: '3rem',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                        <h1 style={{ fontSize: '2.8rem', margin: 0, fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome back, {user.name || "Admin"}! 👋</h1>
                        <p style={{ opacity: 0.8, fontSize: '1.1rem', marginTop: '1rem', lineHeight: 1.6 }}>
                            Here's what's happening with the platform today. You have {stats.totals.active} users actively engaged right now. Keep up the great work!
                        </p>
                        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2.5rem' }}>
                            <button className="admin-btn admin-btn-primary" onClick={() => setActiveTab('reports')} style={{ background: '#10b981', padding: '0.8rem 1.5rem', border: 'none', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
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
                    <div className="stat-card">
                        <div style={{ color: '#12b981', marginBottom: '1rem' }}><Users size={24} /></div>
                        <div className="stat-info">
                            <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totals.total}</h3>
                            <p style={{ margin: '0.25rem 0', color: '#64748b' }}>Total Users</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div style={{ color: '#3b82f6', marginBottom: '1rem' }}><BookOpen size={24} /></div>
                        <div className="stat-info">
                            <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totals.lecturers + stats.totals.students}</h3>
                            <p style={{ margin: '0.25rem 0', color: '#64748b' }}>Total Enrollments</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div style={{ color: '#8b5cf6', marginBottom: '1rem' }}><DollarSign size={24} /></div>
                        <div className="stat-info">
                            <h3 style={{ margin: 0, fontSize: '2rem' }}>$2.8M</h3>
                            <p style={{ margin: '0.25rem 0', color: '#64748b' }}>Revenue</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div style={{ color: '#f59e0b', marginBottom: '1rem' }}><Activity size={24} /></div>
                        <div className="stat-info">
                            <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totals.active}</h3>
                            <p style={{ margin: '0.25rem 0', color: '#64748b' }}>Active Now</p>
                        </div>
                    </div>
                </div>

                <div className="charts-container">
                    <div className="chart-card">
                        <h3>User Growth Trend</h3>
                        <div style={{ width: '100%', height: 300, marginTop: '1.5rem' }}>
                            <ResponsiveContainer>
                                <AreaChart data={stats.growth}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
                    <div className="chart-card">
                        <h3>Distribution</h3>
                        <div style={{ width: '100%', height: 250, marginTop: '1.5rem' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={donutData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {donutData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div >
            </div >
        );
    };

    const renderReports = () => {
        const reports = [
            {
                title: "System Overview",
                desc: "Overall platform statistics and performance metrics.",
                color: "#8b5cf6",
                iconBg: "rgba(139, 92, 246, 0.1)",
                icon: <Activity size={32} />
            },
            {
                title: "Lecturer Directory",
                desc: "Complete list of all registered lecturers and their status.",
                color: "#12b981",
                iconBg: "rgba(18, 185, 129, 0.1)",
                icon: <Users size={32} />
            },
            {
                title: "Student Roster",
                desc: "Detailed list of enrolled students with IDs and contact info.",
                color: "#3b82f6",
                iconBg: "rgba(59, 130, 246, 0.1)",
                icon: <School size={32} />
            },
        ];

        return (
            <div className="admin-reports">
                <div style={{ marginBottom: "3rem", animation: "slideDown 0.5s ease-out" }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Report Center</h2>
                    <p style={{ color: "#64748b", fontSize: '1.1rem', marginTop: "0.75rem", maxWidth: '600px' }}>
                        Access comprehensive platform data and generate high-fidelity PDF reports for your specific needs.
                    </p>
                </div>

                <div className="reports-grid">
                    {reports.map((r, idx) => (
                        <div className="report-card premium-card" key={r.title} style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both` }}>
                            <div className="report-card-icon-wrapper" style={{ background: r.iconBg, color: r.color }}>
                                {r.icon}
                            </div>
                            <div className="report-info">
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>{r.title}</h3>
                                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>{r.desc}</p>
                            </div>
                            <div className="report-actions">
                                <button
                                    className="premium-action-btn"
                                    onClick={() => generatePDFReport(r.title)}
                                    style={{ '--accent-color': r.color }}
                                >
                                    <Download size={20} />
                                    <span>Download Report</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <style>{`
                    @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                `}</style>
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
            case "courses": return renderPlaceholder("All Courses", <BookOpen size={48} />);
            case "announcement": return <AnnouncementManagement />;
            case "reviews": return <ReviewManagement />;
            default: return renderOverview();
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
                    <div className={`admin-nav-item ${activeTab === "courses" ? "active" : ""}`} onClick={() => setActiveTab("courses")}>
                        <div className="nav-item-content"><BookOpen size={20} /> All Courses</div>
                        {activeTab === "courses" && <ChevronRight size={16} />}
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
                    showSearch={activeTab === 'lecturers' || activeTab === 'students' || activeTab === 'announcement'}
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