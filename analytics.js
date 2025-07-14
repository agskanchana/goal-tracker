// Analytics Dashboard Script for Manager-Only Access
// Handles workload analysis and other analytics features

// Supabase Configuration (shared with main app)
const SUPABASE_URL = 'https://hkdoxjjlsrgbxeqefqdz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZG94ampsc3JnYnhlcWVmcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzE3ODEsImV4cCI6MjA2Njk0Nzc4MX0.6CsK7mJyiiXO6c8t2wwlcmp8nlo3_3xOS52PRg4c4a4';

// Initialize Supabase
let supabase;
try {
    if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        console.warn('Supabase credentials not configured. Using demo mode.');
        supabase = null;
    }
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
    supabase = null;
}

// Global Variables
let currentUser = null;
let projects = [];
let users = [];

// Holiday data for working day calculations
let usHolidays = [];
let slHolidays = [];

// Project Status Weights for Workload Calculation
const PROJECT_STATUS_WEIGHTS = {
    'WP conversion - Pending': 10,
    'WP conversion QA': 8,
    'WP conversion QA - Fixing': 7,
    'Page Creation - Pending': 6,
    'Page creation QA': 5,
    'Page creation QA - Fixing': 4,
    'Page creation QA - Verifying': 3,
    'Golive Approval Pending': 2,
    'Golive QA': 1,
    'Golive QA - Fixing': 0,
    'Live': 0,
    'Completed': 0
};

// Demo data for when Supabase is not configured
const demoData = {
    users: [
        {
            id: 1,
            name: 'System Manager',
            email: 'manager@ekwa.com',
            role: 'manager',
            work_schedule: 'US',
            password: 'password'
        },
        {
            id: 7,
            name: 'Anfas',
            email: 'anfas@ekwa.com',
            role: 'webmaster_level_1',
            work_schedule: 'US',
            password: 'password'
        },
        {
            id: 8,
            name: 'Janith',
            email: 'janith@ekwa.com',
            role: 'webmaster_level_1',
            work_schedule: 'US',
            password: 'password'
        },
        {
            id: 9,
            name: 'Menuka',
            email: 'menuka@ekwa.com',
            role: 'webmaster_level_1',
            work_schedule: 'US',
            password: 'password'
        },
        {
            id: 10,
            name: 'Themiya',
            email: 'themiya@ekwa.com',
            role: 'webmaster_level_2',
            work_schedule: 'US',
            password: 'password'
        },
        {
            id: 11,
            name: 'Dilusha',
            email: 'dilusha@ekwa.com',
            role: 'webmaster_level_2',
            work_schedule: 'US',
            password: 'password'
        },
        {
            id: 12,
            name: 'Sivaraj',
            email: 'sivaraj@ekwa.com',
            role: 'webmaster_level_2',
            work_schedule: 'US',
            password: 'password'
        },
        {
            id: 13,
            name: 'Janaka',
            email: 'janaka@ekwa.com',
            role: 'webmaster_level_2',
            work_schedule: 'US',
            password: 'password'
        }
    ],
    projects: [
        {
            id: 1,
            project_name: 'EKWA Marketing Website',
            ticket_link: 'https://example.com/ticket/1',
            design_approved_date: '2025-01-15',
            assigned_webmaster: 7, // Anfas
            webmaster_assigned_date: '2025-01-20',
            target_date: '2025-02-15',
            project_status: 'WP conversion - Pending',
            signed_up_date: '2025-01-10',
            contract_start_date: '2025-01-15',
            date_sent_to_wp_qa: null,
            date_sent_to_golive_qa: null,
            created_at: '2025-01-15'
        },
        {
            id: 2,
            project_name: 'Client Portal Updates',
            ticket_link: 'https://example.com/ticket/2',
            design_approved_date: '2025-01-20',
            assigned_webmaster: 8, // Janith
            webmaster_assigned_date: '2025-01-22',
            target_date: '2025-02-20',
            project_status: 'Page creation QA',
            signed_up_date: '2025-01-18',
            contract_start_date: '2025-01-20',
            date_sent_to_wp_qa: '2025-02-05',
            date_sent_to_golive_qa: null,
            created_at: '2025-01-20'
        },
        {
            id: 3,
            project_name: 'Landing Page Optimization',
            ticket_link: 'https://example.com/ticket/3',
            design_approved_date: '2025-01-10',
            assigned_webmaster: 11, // Dilusha
            webmaster_assigned_date: '2025-01-12',
            target_date: '2025-02-10',
            project_status: 'Live',
            signed_up_date: '2025-01-08',
            contract_start_date: '2025-01-10',
            date_sent_to_wp_qa: '2025-01-20',
            date_sent_to_golive_qa: '2025-02-15',
            created_at: '2025-01-10'
        },
        {
            id: 4,
            project_name: 'E-commerce Integration',
            ticket_link: 'https://example.com/ticket/4',
            design_approved_date: '2025-01-25',
            assigned_webmaster: 7, // Anfas
            webmaster_assigned_date: '2025-01-27',
            target_date: '2025-02-25',
            project_status: 'WP conversion QA - Fixing',
            signed_up_date: '2025-01-23',
            contract_start_date: '2025-01-25',
            date_sent_to_wp_qa: '2025-02-10',
            date_sent_to_golive_qa: null,
            created_at: '2025-01-25'
        },
        {
            id: 5,
            project_name: 'Mobile Responsiveness',
            ticket_link: 'https://example.com/ticket/5',
            design_approved_date: '2025-01-28',
            assigned_webmaster: 12, // Sivaraj
            webmaster_assigned_date: '2025-01-30',
            target_date: '2025-02-28',
            project_status: 'Page creation QA - Verifying',
            signed_up_date: '2025-01-26',
            contract_start_date: '2025-01-28',
            date_sent_to_wp_qa: '2025-02-08',
            date_sent_to_golive_qa: '2025-02-25',
            created_at: '2025-01-28'
        },
        {
            id: 6,
            project_name: 'SEO Optimization Project',
            ticket_link: 'https://example.com/ticket/6',
            design_approved_date: '2025-02-01',
            assigned_webmaster: 13, // Janaka
            webmaster_assigned_date: '2025-02-03',
            target_date: '2025-03-01',
            project_status: 'WP conversion QA',
            signed_up_date: '2025-01-30',
            contract_start_date: '2025-02-01',
            date_sent_to_wp_qa: '2025-02-12',
            date_sent_to_golive_qa: null,
            created_at: '2025-02-01'
        },
        {
            id: 7,
            project_name: 'Corporate Rebrand Website',
            ticket_link: 'https://example.com/ticket/7',
            design_approved_date: '2024-12-15',
            assigned_webmaster: 11, // Dilusha
            webmaster_assigned_date: '2024-12-18',
            target_date: '2025-01-15',
            project_status: 'Completed',
            signed_up_date: '2024-12-10',
            contract_start_date: '2024-12-15',
            date_sent_to_wp_qa: '2025-01-05',
            date_sent_to_golive_qa: '2025-01-25',
            created_at: '2024-12-15'
        },
        {
            id: 8,
            project_name: 'Real Estate Portal',
            ticket_link: 'https://example.com/ticket/8',
            design_approved_date: '2024-12-20',
            assigned_webmaster: 12, // Sivaraj
            webmaster_assigned_date: '2024-12-22',
            target_date: '2025-01-20',
            project_status: 'Live',
            signed_up_date: '2024-12-18',
            contract_start_date: '2024-12-20',
            date_sent_to_wp_qa: '2025-01-08',
            date_sent_to_golive_qa: '2025-01-30',
            created_at: '2024-12-20'
        }
    ]
};

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const userInfo = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');

// Initialize the analytics dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeAnalytics();
});

async function initializeAnalytics() {
    console.log('Initializing analytics dashboard...');

    // Check for existing session in localStorage (same as main app)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);
            if (user && user.role === 'manager') {
                await loginSuccess(user);
                return;
            }
        } catch (error) {
            console.log('Invalid stored user data:', error);
            localStorage.removeItem('currentUser');
        }
    }

    // Show login screen
    showScreen('loginScreen');
    setupEventListeners();
}

function setupEventListeners() {
    console.log('Setting up initial event listeners...');

    // Login form
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showLoginError('Please enter both email and password.');
        return;
    }

    try {
        let user = null;

        if (supabase) {
            // Use custom users table for authentication (same as main app)
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .single();

            if (userError || !userData) {
                throw new Error('Invalid credentials');
            }
            user = userData;
        } else {
            // Demo authentication
            user = demoData.users.find(u => u.email === email && u.password === password);
        }

        if (user && user.role === 'manager') {
            await loginSuccess(user);
        } else if (user) {
            showLoginError('Access denied. This dashboard is for managers only.');
        } else {
            showLoginError('Invalid email or password.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showLoginError('Login failed. Please try again.');
    }
}

async function loginSuccess(user) {
    currentUser = user;
    console.log('Manager logged in:', user.name);

    // Store user in localStorage (same as main app)
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Update user info display
    if (userInfo) {
        userInfo.innerHTML = `
            <i class="fas fa-user"></i> ${user.name} (${user.role})
        `;
    }

    // Load initial data
    await loadData();
    console.log('Initial data loaded. Projects:', projects.length, 'Users:', users.length);

    // Show dashboard
    showScreen('dashboard');

    // Setup event listeners after dashboard is shown
    setupDashboardEventListeners();

    // Load workload analysis by default
    loadWorkloadData();
}

function setupDashboardEventListeners() {
    console.log('Setting up dashboard event listeners...');

    // Tab navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    console.log('Found nav tabs:', navTabs.length);

    navTabs.forEach((tab, index) => {
        console.log(`Setting up tab ${index}:`, tab.dataset.tab);
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = tab.dataset.tab;
            console.log('Tab clicked:', tabName);
            switchTab(tabName);
        });
    });

    // Refresh buttons
    const refreshWorkloadBtn = document.getElementById('refreshWorkloadBtn');
    if (refreshWorkloadBtn) {
        refreshWorkloadBtn.addEventListener('click', loadWorkloadData);
    }

    const refreshPerformanceBtn = document.getElementById('refreshPerformanceBtn');
    if (refreshPerformanceBtn) {
        refreshPerformanceBtn.addEventListener('click', loadPerformanceData);
    }

    const refreshCompletionBtn = document.getElementById('refreshCompletionBtn');
    if (refreshCompletionBtn) {
        refreshCompletionBtn.addEventListener('click', loadCompletionData);
    }

    const refreshActiveProjectsBtn = document.getElementById('refreshActiveProjectsBtn');
    if (refreshActiveProjectsBtn) {
        refreshActiveProjectsBtn.addEventListener('click', loadActiveProjectsData);
    }

    const refreshDesignApprovedBtn = document.getElementById('refreshDesignApprovedBtn');
    if (refreshDesignApprovedBtn) {
        refreshDesignApprovedBtn.addEventListener('click', loadDesignApprovedData);
    }

    const applyDesignApprovedFilter = document.getElementById('applyDesignApprovedFilter');
    if (applyDesignApprovedFilter) {
        applyDesignApprovedFilter.addEventListener('click', loadDesignApprovedData);
    }

    // Period filters
    const performancePeriod = document.getElementById('performancePeriod');
    if (performancePeriod) {
        performancePeriod.addEventListener('change', loadPerformanceData);
    }

    const completionPeriod = document.getElementById('completionPeriod');
    if (completionPeriod) {
        completionPeriod.addEventListener('change', loadCompletionData);
    }

    // Set default reference date to today for Design Approved tab
    const referenceDateInput = document.getElementById('referenceDate');
    if (referenceDateInput) {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        referenceDateInput.value = formattedToday;
    }

    console.log('Dashboard event listeners set up successfully');
}

async function handleLogout() {
    try {
        currentUser = null;
        projects = [];
        users = [];

        // Clear localStorage (same as main app)
        localStorage.removeItem('currentUser');

        // Clear forms
        if (loginForm) {
            loginForm.reset();
        }
        clearLoginError();

        // Show login screen
        showScreen('loginScreen');

        console.log('Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function loadData() {
    try {
        // Load holiday data first
        await loadHolidayData();

        if (supabase) {
            // Load from Supabase
            const [projectsResult, usersResult] = await Promise.all([
                supabase.from('projects').select('*'),
                supabase.from('users').select('*')
            ]);

            if (projectsResult.error) throw projectsResult.error;
            if (usersResult.error) throw usersResult.error;

            projects = projectsResult.data || [];
            users = usersResult.data || [];
        } else {
            // Use demo data
            projects = [...demoData.projects];
            users = [...demoData.users];
        }

        console.log('Data loaded:', { projects: projects.length, users: users.length, holidays: usHolidays.length + slHolidays.length });
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to demo data
        projects = [...demoData.projects];
        users = [...demoData.users];
    }
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function showLoginError(message) {
    if (loginError) {
        loginError.textContent = message;
        loginError.style.display = 'block';
    }
}

function clearLoginError() {
    if (loginError) {
        loginError.textContent = '';
        loginError.style.display = 'none';
    }
}

function switchTab(tabName) {
    console.log('Switching to tab:', tabName);

    // Get DOM elements
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Update nav tabs
    navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update tab content
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}Tab`);
    });

    // Load data for specific tabs
    if (tabName === 'workload') {
        loadWorkloadData();
    } else if (tabName === 'performance') {
        console.log('Loading performance data...');
        loadPerformanceData();
    } else if (tabName === 'completion') {
        console.log('Loading completion data...');
        loadCompletionData();
    } else if (tabName === 'active-projects') {
        console.log('Loading active projects data...');
        loadActiveProjectsData();
    } else if (tabName === 'design-approved') {
        console.log('Loading design approved data...');
        loadDesignApprovedData();
    }
}

async function loadWorkloadData() {
    console.log('Loading workload data...');

    try {
        // Ensure data is loaded
        if (projects.length === 0 || users.length === 0) {
            await loadData();
        }

        // Get webmasters only
        const webmasters = users.filter(user =>
            user.role && (
                user.role.includes('webmaster') ||
                user.role === 'webmaster_level_1' ||
                user.role === 'webmaster_level_2'
            )
        );

        // Calculate workload for each webmaster
        const workloadData = webmasters.map(webmaster => {
            const webmasterProjects = projects.filter(project =>
                project.assigned_webmaster === webmaster.id
            );

            // Calculate workload score and filter projects with weight > 0
            let totalScore = 0;
            const statusBreakdown = {};
            const activeProjects = []; // Projects with weight > 0

            webmasterProjects.forEach(project => {
                const weight = PROJECT_STATUS_WEIGHTS[project.project_status] || 0;
                totalScore += weight;

                // Only include projects with weight > 0 in breakdown
                if (weight > 0) {
                    activeProjects.push(project);

                    if (!statusBreakdown[project.project_status]) {
                        statusBreakdown[project.project_status] = {
                            count: 0,
                            totalWeight: 0,
                            projects: []
                        };
                    }
                    statusBreakdown[project.project_status].count++;
                    statusBreakdown[project.project_status].totalWeight += weight;
                    statusBreakdown[project.project_status].projects.push(project);
                }
            });

            return {
                webmaster,
                projects: webmasterProjects,
                activeProjects,
                totalScore,
                statusBreakdown
            };
        });

        // Sort by workload (ascending - lowest workload first)
        workloadData.sort((a, b) => a.totalScore - b.totalScore);

        // Update summary statistics
        updateWorkloadSummary(workloadData);

        // Render workload grid
        renderWorkloadGrid(workloadData);

    } catch (error) {
        console.error('Error loading workload data:', error);
        document.getElementById('workloadGrid').innerHTML = `
            <div class="error-message">
                <p>Error loading workload data. Please try refreshing.</p>
            </div>
        `;
    }
}

function updateWorkloadSummary(workloadData) {
    const statsContainer = document.getElementById('workloadStats');
    if (!statsContainer) return;

    const totalProjects = projects.filter(p =>
        PROJECT_STATUS_WEIGHTS[p.project_status] > 0
    ).length;

    const totalWorkload = workloadData.reduce((sum, data) => sum + data.totalScore, 0);
    const averageWorkload = workloadData.length > 0 ? (totalWorkload / workloadData.length).toFixed(1) : 0;
    const recommendedWebmaster = workloadData.length > 0 ? workloadData[0].webmaster.name : '-';

    statsContainer.innerHTML = `
        <div class="stat-card">
            <span class="stat-value">${totalProjects}</span>
            <span class="stat-label">Total Active Projects</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${totalWorkload}</span>
            <span class="stat-label">Total Workload Points</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${averageWorkload}</span>
            <span class="stat-label">Average Workload per Webmaster</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${recommendedWebmaster}</span>
            <span class="stat-label">Recommended for New Project</span>
        </div>
    `;
}

function renderWorkloadGrid(workloadData) {
    const gridContainer = document.getElementById('workloadGrid');
    if (!gridContainer) return;

    if (workloadData.length === 0) {
        gridContainer.innerHTML = `
            <div class="no-projects">
                <p>No webmasters found.</p>
            </div>
        `;
        return;
    }

    const gridHTML = workloadData.map(data => {
        const { webmaster, totalScore, statusBreakdown } = data;

        // Determine workload level
        let workloadClass = 'workload-low';
        if (totalScore > 50) workloadClass = 'workload-critical';
        else if (totalScore > 30) workloadClass = 'workload-high';
        else if (totalScore > 15) workloadClass = 'workload-medium';

        // Create status breakdown HTML with project names
        const statusHTML = Object.entries(statusBreakdown)
            .sort(([,a], [,b]) => b.totalWeight - a.totalWeight)
            .map(([status, info]) => `
                <div class="status-section">
                    <div class="status-item">
                        <span class="status-name">${status}</span>
                        <div class="status-count">
                            <span class="project-count">${info.count} project${info.count !== 1 ? 's' : ''}</span>
                            <span class="weight-score">${info.totalWeight} pts</span>
                        </div>
                    </div>
                    <div class="project-list">
                        ${info.projects.map(project => `
                            <div class="project-item">
                                <a href="${project.ticket_link}" target="_blank" class="project-link">
                                    <i class="fas fa-external-link-alt"></i> ${project.project_name}
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');

        return `
            <div class="webmaster-card">
                <div class="webmaster-header">
                    <span class="webmaster-name">${webmaster.name}</span>
                    <span class="workload-score ${workloadClass}">${totalScore}</span>
                </div>
                <div class="project-breakdown">
                    ${statusHTML || '<div class="no-projects">No active projects</div>'}
                </div>
            </div>
        `;
    }).join('');

    gridContainer.innerHTML = gridHTML;
}

// Performance Analytics Functions
async function loadPerformanceData() {
    console.log('Loading performance data...');

    try {
        // Ensure data is loaded
        if (projects.length === 0 || users.length === 0) {
            await loadData();
        }

        const periodSelect = document.getElementById('performancePeriod');
        const period = periodSelect ? periodSelect.value : 'all';

        // Filter projects based on selected period
        const filteredProjects = filterProjectsByPeriod(projects, period);

        // Get webmasters only
        const webmasters = users.filter(user =>
            user.role && (
                user.role.includes('webmaster') ||
                user.role === 'webmaster_level_1' ||
                user.role === 'webmaster_level_2'
            )
        );

        // Calculate WP conversion performance for each webmaster
        const performanceData = webmasters.map(webmaster => {
            const webmasterProjects = filteredProjects.filter(project =>
                project.assigned_webmaster === webmaster.id &&
                project.webmaster_assigned_date &&
                project.date_sent_to_wp_qa
            );

            const conversionTimes = webmasterProjects.map(project => {
                const assignedDate = new Date(project.webmaster_assigned_date);
                const sentToQADate = new Date(project.date_sent_to_wp_qa);

                // Calculate working days instead of calendar days
                const workingDays = getWorkingDaysBetween(assignedDate, sentToQADate, webmaster.work_schedule || 'US');

                return {
                    project,
                    days: workingDays,
                    calendarDays: Math.ceil((sentToQADate - assignedDate) / (1000 * 60 * 60 * 24)) // Keep for reference
                };
            });

            const totalConversions = conversionTimes.length;
            const avgConversionTime = totalConversions > 0
                ? (conversionTimes.reduce((sum, ct) => sum + ct.days, 0) / totalConversions).toFixed(1)
                : 0;

            return {
                webmaster,
                totalConversions,
                avgConversionTime: parseFloat(avgConversionTime),
                conversionTimes,
                fastestConversion: totalConversions > 0 ? Math.min(...conversionTimes.map(ct => ct.days)) : 0,
                slowestConversion: totalConversions > 0 ? Math.max(...conversionTimes.map(ct => ct.days)) : 0
            };
        });

        // Update performance statistics
        updatePerformanceStats(performanceData, period);

        // Render performance grid
        renderPerformanceGrid(performanceData);

    } catch (error) {
        console.error('Error loading performance data:', error);
        document.getElementById('wpConversionTimeGrid').innerHTML = `
            <div class="error-message">
                <p>Error loading performance data. Please try refreshing.</p>
            </div>
        `;
    }
}

async function loadCompletionData() {
    console.log('Loading completion data...');

    try {
        // Ensure data is loaded
        if (projects.length === 0 || users.length === 0) {
            await loadData();
        }

        const periodSelect = document.getElementById('completionPeriod');
        const period = periodSelect ? periodSelect.value : 'all';

        // Filter projects based on selected period
        const filteredProjects = filterProjectsByPeriod(projects, period);

        // Get webmasters only
        const webmasters = users.filter(user =>
            user.role && (
                user.role.includes('webmaster') ||
                user.role === 'webmaster_level_1' ||
                user.role === 'webmaster_level_2'
            )
        );

        // Calculate completion statistics for each webmaster
        const completionData = webmasters.map(webmaster => {
            // WP Conversions completed (sent to WP QA)
            const wpConversions = filteredProjects.filter(project =>
                project.assigned_webmaster === webmaster.id &&
                project.date_sent_to_wp_qa
            );

            // Projects completed (sent to Golive QA)
            const completedProjects = filteredProjects.filter(project =>
                project.assigned_webmaster === webmaster.id &&
                project.date_sent_to_golive_qa
            );

            // Calculate average completion times using working days
            const projectCompletionTimes = completedProjects
                .filter(p => p.webmaster_assigned_date && p.date_sent_to_golive_qa)
                .map(project => {
                    const assignedDate = new Date(project.webmaster_assigned_date);
                    const completedDate = new Date(project.date_sent_to_golive_qa);
                    // Use working days instead of calendar days
                    return getWorkingDaysBetween(assignedDate, completedDate, webmaster.work_schedule || 'US');
                });

            const avgProjectCompletionTime = projectCompletionTimes.length > 0
                ? (projectCompletionTimes.reduce((sum, time) => sum + time, 0) / projectCompletionTimes.length).toFixed(1)
                : 0;

            return {
                webmaster,
                wpConversionsCount: wpConversions.length,
                completedProjectsCount: completedProjects.length,
                avgProjectCompletionTime: parseFloat(avgProjectCompletionTime),
                wpConversions,
                completedProjects
            };
        });

        // Update completion statistics
        updateCompletionStats(completionData, period);

        // Render completion analysis grid
        renderCompletionGrid(completionData);

    } catch (error) {
        console.error('Error loading completion data:', error);
        document.getElementById('completionAnalysisGrid').innerHTML = `
            <div class="error-message">
                <p>Error loading completion data. Please try refreshing.</p>
            </div>
        `;
    }
}

function filterProjectsByPeriod(projects, period) {
    if (period === 'all') return projects;

    const days = parseInt(period);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return projects.filter(project => {
        const createdDate = new Date(project.created_at);
        return createdDate >= cutoffDate;
    });
}

async function loadActiveProjectsData() {
    console.log('Loading active projects data...');

    try {
        // Ensure data is loaded
        if (projects.length === 0 || users.length === 0) {
            await loadData();
        }

        // Define kickoff-related statuses
        const kickoffStatuses = [
            'WP conversion - Pending',
            'WP conversion QA',
            'WP conversion QA - Fixing',
            'Page Creation - Pending',
            'Page creation QA',
            'Page creation QA - Fixing',
            'Page creation QA - Verifying',
            'Golive Approval Pending'
        ];

        // Filter projects in kickoff statuses
        const activeProjects = projects.filter(project =>
            kickoffStatuses.includes(project.project_status) && project.design_approved_date
        );        // Calculate duration from Design Approved Date for each project
        const projectsWithDuration = activeProjects.map(project => {
            const designApprovedDate = new Date(project.design_approved_date);
            const today = new Date();

            // Calculate calendar days since Design Approved Date
            const calendarDays = Math.ceil((today - designApprovedDate) / (1000 * 60 * 60 * 24));

            // Determine if project exceeds target (using calendar days: ~30 days = 1 month)
            let ratingClass = 'good';
            let ratingText = 'On Track';

            if (calendarDays > 30) {
                ratingClass = 'overdue';
                ratingText = 'Overdue';
            } else if (calendarDays > 25) {
                ratingClass = 'warning';
                ratingText = 'Warning';
            }

            return {
                ...project,
                daysActive: calendarDays,
                ratingClass,
                ratingText
            };
        });

        // Sort by duration (longest first)
        projectsWithDuration.sort((a, b) => b.daysActive - a.daysActive);

        // Update statistics
        updateActiveProjectsStats(projectsWithDuration);

        // Render projects list
        renderActiveProjectsList(projectsWithDuration);

    } catch (error) {
        console.error('Error loading active projects data:', error);
        document.getElementById('activeProjectsList').innerHTML = `
            <div class="error-message">
                <p>Error loading active projects data. Please try refreshing.</p>
            </div>
        `;
    }
}

function updateActiveProjectsStats(projectsWithDuration) {
    const statsContainer = document.getElementById('activeProjectsStats');
    if (!statsContainer) return;

    const totalProjects = projectsWithDuration.length;
    const overdueProjects = projectsWithDuration.filter(p => p.daysActive > 30).length;
    const averageDays = totalProjects > 0
        ? (projectsWithDuration.reduce((sum, p) => sum + p.daysActive, 0) / totalProjects).toFixed(1)
        : 0;
    const longestActive = totalProjects > 0 ? Math.max(...projectsWithDuration.map(p => p.daysActive)) : 0;

    // Update stat values
    document.getElementById('totalActiveProjects').textContent = totalProjects;
    document.getElementById('overdueProjects').textContent = overdueProjects;
    document.getElementById('averageDaysActive').textContent = averageDays;
    document.getElementById('longestActiveProject').textContent = longestActive;
}

function renderActiveProjectsList(projectsWithDuration) {
    const container = document.getElementById('activeProjectsList');
    if (!container) return;

    if (projectsWithDuration.length === 0) {
        container.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-check-circle"></i>
                <p>No active projects in kickoff statuses!</p>
            </div>
        `;
        return;
    }

    const projectsHtml = projectsWithDuration.map(project => {
        const designApprovedDate = new Date(project.design_approved_date);
        const formattedDate = designApprovedDate.toLocaleDateString();

        // Generate ticket link if ticket_link exists
        const ticketLink = project.ticket_link
            ? `<a href="${project.ticket_link}" target="_blank">${project.project_name}</a>`
            : project.project_name;

        return `
            <div class="project-item ${project.ratingClass}">
                <div class="project-info">
                    <div class="project-name">${ticketLink}</div>
                    <div class="project-status">${project.project_status}</div>
                    <div class="project-dates">
                        Design Approved: ${formattedDate}
                        ${project.assigned_webmaster ? ` | Webmaster: ${getUserName(project.assigned_webmaster)}` : ''}
                    </div>
                </div>
                <div class="project-duration">
                    <div class="duration-value ${project.ratingClass}">${project.daysActive}</div>
                    <div class="duration-label">Calendar Days</div>
                    <div class="target-indicator ${project.ratingClass}">${project.ratingText}</div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = projectsHtml;
}

function getUserName(userId) {
    const user = users.find(u => u.id === userId);
    return user ? user.name || user.email : 'Unknown';
}

function updatePerformanceStats(performanceData, period) {
    const statsContainer = document.getElementById('performanceStats');
    if (!statsContainer) return;

    const totalConversions = performanceData.reduce((sum, data) => sum + data.totalConversions, 0);
    const avgTimeOverall = performanceData.length > 0
        ? (performanceData.reduce((sum, data) => sum + (data.avgConversionTime * data.totalConversions), 0) / totalConversions).toFixed(1)
        : 0;

    const fastestWebmaster = performanceData.reduce((fastest, current) =>
        current.avgConversionTime > 0 && (fastest.avgConversionTime === 0 || current.avgConversionTime < fastest.avgConversionTime)
            ? current : fastest
    , { webmaster: { name: '-' }, avgConversionTime: 0 });

    const slowestWebmaster = performanceData.reduce((slowest, current) =>
        current.avgConversionTime > slowest.avgConversionTime ? current : slowest
    , { webmaster: { name: '-' }, avgConversionTime: 0 });

    const periodText = period === 'all' ? 'All Time' : `Last ${period} days`;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <span class="stat-value">${totalConversions}</span>
            <span class="stat-label">WP Conversions (${periodText})</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${avgTimeOverall || 0}</span>
            <span class="stat-label">Avg Working Days per Conversion</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${fastestWebmaster.webmaster.name}</span>
            <span class="stat-label">Fastest Avg (${fastestWebmaster.avgConversionTime} working days)</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${slowestWebmaster.webmaster.name}</span>
            <span class="stat-label">Slowest Avg (${slowestWebmaster.avgConversionTime} working days)</span>
        </div>
    `;
}

function updateCompletionStats(completionData, period) {
    const statsContainer = document.getElementById('completionStatsGrid');
    if (!statsContainer) return;

    const totalWPConversions = completionData.reduce((sum, data) => sum + data.wpConversionsCount, 0);
    const totalCompletedProjects = completionData.reduce((sum, data) => sum + data.completedProjectsCount, 0);

    const topWPConverter = completionData.reduce((top, current) =>
        current.wpConversionsCount > top.wpConversionsCount ? current : top
    , { webmaster: { name: '-' }, wpConversionsCount: 0 });

    const topProjectCompleter = completionData.reduce((top, current) =>
        current.completedProjectsCount > top.completedProjectsCount ? current : top
    , { webmaster: { name: '-' }, completedProjectsCount: 0 });

    const periodText = period === 'all' ? 'All Time' : `Last ${period} days`;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <span class="stat-value">${totalWPConversions}</span>
            <span class="stat-label">Total WP Conversions (${periodText})</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${totalCompletedProjects}</span>
            <span class="stat-label">Total Projects Completed (${periodText})</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${topWPConverter.webmaster.name}</span>
            <span class="stat-label">Top WP Converter (${topWPConverter.wpConversionsCount} conversions)</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">${topProjectCompleter.webmaster.name}</span>
            <span class="stat-label">Top Project Completer (${topProjectCompleter.completedProjectsCount} projects)</span>
        </div>
    `;
}

function renderPerformanceGrid(performanceData) {
    const gridContainer = document.getElementById('wpConversionTimeGrid');
    if (!gridContainer) return;

    if (performanceData.length === 0) {
        gridContainer.innerHTML = `
            <div class="no-projects">
                <p>No performance data found.</p>
            </div>
        `;
        return;
    }

    // Sort by average conversion time (fastest first)
    performanceData.sort((a, b) => {
        if (a.avgConversionTime === 0) return 1;
        if (b.avgConversionTime === 0) return -1;
        return a.avgConversionTime - b.avgConversionTime;
    });

    const gridHTML = performanceData.map(data => {
        const { webmaster, totalConversions, avgConversionTime, fastestConversion, slowestConversion, conversionTimes } = data;

        // Determine performance indicator (adjusted for working days)
        let performanceClass = 'time-average';
        if (avgConversionTime > 0 && avgConversionTime <= 5) performanceClass = 'time-fast';  // 5 working days = fast
        else if (avgConversionTime > 10) performanceClass = 'time-slow';  // 10+ working days = slow

        // Recent conversions list
        const recentConversions = conversionTimes
            .sort((a, b) => new Date(b.project.date_sent_to_wp_qa) - new Date(a.project.date_sent_to_wp_qa))
            .slice(0, 5)
            .map(ct => `
                <div class="project-item">
                    <div class="project-info-row">
                        <a href="${ct.project.ticket_link}" target="_blank" class="project-link">
                            <i class="fas fa-external-link-alt"></i> ${ct.project.project_name}
                        </a>
                        <span class="time-indicator ${ct.days <= 5 ? 'time-fast' : ct.days <= 10 ? 'time-average' : 'time-slow'}">
                            ${ct.days} working days
                        </span>
                    </div>
                    <div class="project-dates">
                        <div class="date-info">
                            <span class="date-label">Assigned:</span>
                            <span class="date-value">${formatDate(ct.project.webmaster_assigned_date)}</span>
                        </div>
                        <div class="date-info">
                            <span class="date-label">Sent to WP QA:</span>
                            <span class="date-value">${formatDate(ct.project.date_sent_to_wp_qa)}</span>
                        </div>
                    </div>
                </div>
            `).join('');

        return `
            <div class="webmaster-card">
                <div class="webmaster-header">
                    <span class="webmaster-name">${webmaster.name}</span>
                    <span class="time-indicator ${performanceClass}">${avgConversionTime || 0} working days avg</span>
                </div>
                <div class="performance-metrics">
                    <div class="performance-metric">
                        <div class="metric-label">Total WP Conversions</div>
                        <div class="metric-value">${totalConversions}</div>
                    </div>
                    <div class="performance-metric">
                        <div class="metric-label">Fastest / Slowest (working days)</div>
                        <div class="metric-value">${fastestConversion || 0} / ${slowestConversion || 0} days</div>
                    </div>
                </div>
                <div class="project-breakdown">
                    <h5>Recent Conversions:</h5>
                    ${recentConversions || '<div class="no-projects">No conversions found</div>'}
                </div>
            </div>
        `;
    }).join('');

    gridContainer.innerHTML = gridHTML;
}

function renderCompletionGrid(completionData) {
    const gridContainer = document.getElementById('completionAnalysisGrid');
    if (!gridContainer) return;

    if (completionData.length === 0) {
        gridContainer.innerHTML = `
            <div class="no-projects">
                <p>No completion data found.</p>
            </div>
        `;
        return;
    }

    // Sort by total completed projects (highest first)
    completionData.sort((a, b) => b.completedProjectsCount - a.completedProjectsCount);

    const gridHTML = completionData.map(data => {
        const { webmaster, wpConversionsCount, completedProjectsCount, avgProjectCompletionTime, completedProjects } = data;

        // Recent completed projects
        const recentCompletions = completedProjects
            .sort((a, b) => new Date(b.date_sent_to_golive_qa) - new Date(a.date_sent_to_golive_qa))
            .slice(0, 5)
            .map(project => `
                <div class="project-item">
                    <a href="${project.ticket_link}" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i> ${project.project_name}
                    </a>
                    <span class="completion-date">${formatCompletionDate(project.date_sent_to_golive_qa)}</span>
                </div>
            `).join('');

        return `
            <div class="webmaster-card">
                <div class="webmaster-header">
                    <span class="webmaster-name">${webmaster.name}</span>
                    <span class="workload-score workload-low">${completedProjectsCount}</span>
                </div>
                <div class="performance-metrics">
                    <div class="performance-metric">
                        <div class="metric-label">WP Conversions Completed</div>
                        <div class="metric-value">${wpConversionsCount}</div>
                    </div>
                    <div class="performance-metric">
                        <div class="metric-label">Avg Project Completion Time</div>
                        <div class="metric-value">${avgProjectCompletionTime || 0} working days</div>
                    </div>
                </div>
                <div class="project-breakdown">
                    <h5>Recent Completions:</h5>
                    ${recentCompletions || '<div class="no-projects">No completed projects found</div>'}
                </div>
            </div>
        `;
    }).join('');

    gridContainer.innerHTML = gridHTML;
}

// Working day calculation functions
function isWorkingDay(date, workSchedule) {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();

    // Check if it's a weekend (Saturday = 6, Sunday = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false;
    }

    // Check holidays based on work schedule
    const dateString = dateObj.toISOString().split('T')[0];

    if (workSchedule === 'US') {
        return !usHolidays.some(holiday => holiday.date === dateString);
    } else {
        return !slHolidays.some(holiday => holiday.date === dateString);
    }

    return true;
}

function getWorkingDaysBetween(startDate, endDate, workSchedule) {
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;

    while (currentDate < end) {
        if (isWorkingDay(currentDate, workSchedule)) {
            workingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return workingDays;
}

// Load holiday data for working day calculations
async function loadHolidayData() {
    try {
        // Load US holidays
        const usResponse = await fetch('us-leaves.json');
        if (usResponse.ok) {
            usHolidays = await usResponse.json();
        }

        // Load Sri Lankan holidays
        const slResponse = await fetch('sl-leaves.json');
        if (slResponse.ok) {
            slHolidays = await slResponse.json();
        }

        console.log('Holiday data loaded:', { us: usHolidays.length, sl: slHolidays.length });
    } catch (error) {
        console.error('Error loading holiday data:', error);
        usHolidays = [];
        slHolidays = [];
    }
}

// Utility function to format dates
function formatDate(dateString) {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Additional utility function to format completion date for display
function formatCompletionDate(dateString) {
    if (!dateString) return 'Not completed';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    return `${formattedDate} (${diffDays} days ago)`;
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PROJECT_STATUS_WEIGHTS,
        loadWorkloadData,
        calculateWorkload: (projects, webmasterId) => {
            return projects
                .filter(p => p.assigned_webmaster === webmasterId)
                .reduce((sum, p) => sum + (PROJECT_STATUS_WEIGHTS[p.project_status] || 0), 0);
        }
    };
}

async function loadDesignApprovedData() {
    console.log('Loading design approved data...');

    try {
        // Ensure data is loaded
        if (projects.length === 0 || users.length === 0) {
            await loadData();
        }

        // Get filter parameters
        const referenceDateInput = document.getElementById('referenceDate');
        const monthsPeriodSelect = document.getElementById('monthsPeriod');

        // Use today if no reference date provided
        const referenceDate = referenceDateInput.value
            ? new Date(referenceDateInput.value)
            : new Date();

        const monthsBack = parseInt(monthsPeriodSelect.value) || 1;

        // Calculate start date (X months back from reference date)
        const startDate = new Date(referenceDate);
        startDate.setMonth(startDate.getMonth() - monthsBack);

        // Filter projects with design_approved_date within the period
        const filteredProjects = projects.filter(project => {
            if (!project.design_approved_date) return false;

            const designApprovedDate = new Date(project.design_approved_date);
            return designApprovedDate >= startDate && designApprovedDate <= referenceDate;
        });

        // Sort by design approved date (most recent first)
        filteredProjects.sort((a, b) => new Date(b.design_approved_date) - new Date(a.design_approved_date));

        // Calculate analytics
        const analyticsData = calculateDesignApprovedAnalytics(filteredProjects, referenceDate);

        // Update UI
        updateDesignApprovedStats(analyticsData);
        updatePeriodInfo(startDate, referenceDate, monthsBack);
        renderDesignApprovedList(filteredProjects);

    } catch (error) {
        console.error('Error loading design approved data:', error);
        document.getElementById('designApprovedList').innerHTML = `
            <div class="error-message">
                <p>Error loading design approved data. Please try refreshing.</p>
            </div>
        `;
    }
}

function calculateDesignApprovedAnalytics(projects, referenceDate) {
    const totalProjects = projects.length;

    // Calculate average days from design approved to webmaster assigned
    const projectsWithAssignment = projects.filter(p => p.webmaster_assigned_date && p.design_approved_date);
    const avgDesignToStart = projectsWithAssignment.length > 0
        ? (projectsWithAssignment.reduce((sum, project) => {
            const designDate = new Date(project.design_approved_date);
            const assignDate = new Date(project.webmaster_assigned_date);
            const days = Math.ceil((assignDate - designDate) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0) / projectsWithAssignment.length).toFixed(1)
        : 0;

    // Count completed projects (those with golive QA date)
    const completedProjects = projects.filter(p => p.date_sent_to_golive_qa).length;

    // Count still active projects (not completed and not live)
    const stillActiveProjects = projects.filter(p =>
        !p.date_sent_to_golive_qa &&
        p.project_status !== 'Live' &&
        p.project_status !== 'Completed'
    ).length;

    return {
        totalProjects,
        avgDesignToStart,
        completedProjects,
        stillActiveProjects
    };
}

function updateDesignApprovedStats(analyticsData) {
    document.getElementById('totalDesignApproved').textContent = analyticsData.totalProjects;
    document.getElementById('averageDesignToStart').textContent = analyticsData.avgDesignToStart || 0;
    document.getElementById('completedFromDesign').textContent = analyticsData.completedProjects;
    document.getElementById('stillActiveFromDesign').textContent = analyticsData.stillActiveProjects;
}

function updatePeriodInfo(startDate, endDate, monthsBack) {
    const periodElement = document.getElementById('periodText');
    if (!periodElement) return;

    const startDateStr = startDate.toLocaleDateString();
    const endDateStr = endDate.toLocaleDateString();

    periodElement.textContent = `${startDateStr} to ${endDateStr} (${monthsBack} month${monthsBack > 1 ? 's' : ''} back)`;
}

function renderDesignApprovedList(projects) {
    const container = document.getElementById('designApprovedList');
    if (!container) return;

    if (projects.length === 0) {
        container.innerHTML = `
            <div class="no-data-message">
                <i class="fas fa-calendar-times"></i>
                <p>No projects with Design Approved Date in the selected period.</p>
            </div>
        `;
        return;
    }

    const projectsHtml = projects.map(project => {
        const designApprovedDate = new Date(project.design_approved_date);
        const formattedDesignDate = designApprovedDate.toLocaleDateString();

        // Calculate days since design approved
        const today = new Date();
        const daysSinceDesign = Math.ceil((today - designApprovedDate) / (1000 * 60 * 60 * 24));

        // Determine status color
        let statusClass = 'good';
        if (project.project_status === 'Completed' || project.project_status === 'Live') {
            statusClass = 'good';
        } else if (daysSinceDesign > 60) {
            statusClass = 'overdue';
            console.log('Project overdue:', project.project_name, daysSinceDesign);
        } else if (daysSinceDesign > 30) {
            statusClass = 'warning';
        }

        // Generate ticket link
        const ticketLink = project.ticket_link
            ? `<a href="${project.ticket_link}" target="_blank">${project.project_name}</a>`
            : project.project_name;

        // Format additional dates
        const webmasterAssignedDate = project.webmaster_assigned_date
            ? new Date(project.webmaster_assigned_date).toLocaleDateString()
            : 'Not assigned';

        const goliveDate = project.date_sent_to_golive_qa
            ? new Date(project.date_sent_to_golive_qa).toLocaleDateString()
            : '-';

        return `
            <div class="project-item ${statusClass}">
                <div class="project-info">
                    <div class="project-name">${ticketLink}</div>
                    <div class="project-status">${project.project_status}</div>
                    <div class="project-dates">
                        Design Approved: ${formattedDesignDate} |
                        Webmaster Assigned: ${webmasterAssignedDate} |
                        ${project.assigned_webmaster ? ` Webmaster: ${getUserName(project.assigned_webmaster)} |` : ''}
                        Golive QA: ${goliveDate}
                    </div>
                </div>
                <div class="project-duration">
                    <div class="duration-value ${statusClass}">${daysSinceDesign}</div>
                    <div class="duration-label">Days Since Design</div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = projectsHtml;
}
