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
    Megaphone
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
import "jspdf-autotable";
import { useToast } from "../../components/Lasiru/ToastProvider";
import "../../Styles/Lasiru/AdminDashboard.css";
import LectureManagement from "../../components/Lasiru/LectureManagement";
import StudentManagement from "../../components/Lasiru/StudentManagement";
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
                
                doc.autoTable({
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
                
                doc.autoTable({
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
                
                doc.autoTable({
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
            <div className="admin-overview">
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
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="users" stroke="#12b981" fill="#12b981" fillOpacity={0.1} strokeWidth={3} />
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
                </div>
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
            case "courses": return renderPlaceholder("All Courses", <BookOpen size={48} />);
            case "announcement": return renderPlaceholder("Announcements", <Megaphone size={48} />);
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
                </nav>

                <div className="sidebar-footer">
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
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
                <header className="admin-header">
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Admin Dashboard</h1>
                        <p style={{ color: '#64748b', margin: '0.5rem 0 0' }}>Manage your platform components from one place.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Bell size={24} style={{ color: '#64748b', cursor: 'pointer' }} />
                        <div onClick={() => navigate("/")} style={{ color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}>← Back to Site</div>
                    </div>
                </header>

                <div className="admin-scroll-container">
                    {loading && activeTab === 'overview' ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>
                    ) : renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
