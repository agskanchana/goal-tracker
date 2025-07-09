// Supabase Configuration
const SUPABASE_URL = 'https://hkdoxjjlsrgbxeqefqdz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZG94ampsc3JnYnhlcWVmcWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzE3ODEsImV4cCI6MjA2Njk0Nzc4MX0.6CsK7mJyiiXO6c8t2wwlcmp8nlo3_3xOS52PRg4c4a4';

// Initialize Supabase (you'll need to replace with your actual credentials)
let supabase;

// Try to initialize Supabase, but gracefully handle if credentials are not set
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
let leaves = [];
let tasks = []; // Add tasks array

// Holiday data for working day calculations
let usHolidays = [];
let slHolidays = [];

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
            project_name: 'Demo Project 1',
            ticket_link: 'https://example.com/ticket/1',
            design_approved_date: '2025-06-01',
            assigned_webmaster: 11, // Dilusha
            webmaster_assigned_date: '2025-06-10',
            target_date: '2025-06-25',
            project_status: 'Page creation QA',
            signed_up_date: '2025-05-15',
            contract_start_date: '2025-06-01',
            manager_sent_back: false,
            dns_changed_date: '2025-06-30',
            date_sent_to_wp_qa: '2025-06-24',
            date_finished_wp_qa: '2025-06-25',
            date_finished_wp_bugs: '2025-06-26',
            wp_reopened_bugs: false,
            date_sent_to_page_qa: '2025-06-27',
            date_finished_page_qa: '2025-06-28',
            date_finished_page_bugs: '2025-06-29',
            page_reopened_bugs: false,
            issues_after_8_hours: false,
            issues_8_hours_text: null,
            issues_after_10_days: false,
            issues_10_days_text: null,
            created_at: '2025-06-10'
        },
        {
            id: 2,
            project_name: 'Demo Project 2',
            ticket_link: 'https://example.com/ticket/2',
            design_approved_date: '2025-06-15',
            assigned_webmaster: 13, // Janaka
            webmaster_assigned_date: '2025-06-20',
            target_date: '2025-07-10',
            project_status: 'WP conversion - Pending',
            signed_up_date: '2025-06-01',
            contract_start_date: '2025-06-15',
            manager_sent_back: true,
            date_sent_to_wp_qa: '2025-07-11',
            wp_reopened_bugs: true,
            issues_after_8_hours: false,
            issues_8_hours_text: null,
            issues_after_10_days: false,
            issues_10_days_text: null,
            created_at: '2025-06-20'
        },
        {
            id: 3,
            project_name: 'Demo Project 3',
            ticket_link: 'https://example.com/ticket/3',
            design_approved_date: '2025-06-20',
            assigned_webmaster: 12, // Sivaraj
            webmaster_assigned_date: '2025-06-25',
            target_date: '2025-07-15',
            project_status: 'Live',
            signed_up_date: '2025-06-05',
            contract_start_date: '2025-06-20',
            manager_sent_back: false,
            dns_changed_date: '2025-07-05',
            date_sent_to_wp_qa: '2025-07-01',
            date_finished_wp_qa: '2025-07-02',
            date_finished_wp_bugs: '2025-07-03',
            wp_reopened_bugs: false,
            date_sent_to_page_qa: '2025-07-04',
            date_finished_page_qa: '2025-07-05',
            date_finished_page_bugs: '2025-07-06',
            page_reopened_bugs: false,
            issues_after_8_hours: false,
            issues_8_hours_text: null,
            issues_after_10_days: false,
            issues_10_days_text: null,
            created_at: '2025-06-25'
        }
    ],
    leaves: [
        {
            id: 1,
            user_id: 7, // Anfas
            start_date: '2025-01-15',
            end_date: '2025-01-17',
            reason: 'Personal leave',
            created_at: '2024-12-20'
        },
        {
            id: 2,
            user_id: 8, // Janith
            start_date: '2025-02-10',
            end_date: '2025-02-12',
            reason: 'Sick leave',
            created_at: '2025-01-20'
        }
    ],
    tasks: [
        {
            id: 1,
            project_id: 1,
            task_name: 'Task 1',
            description: 'Test task 1',
            sent_date: '2025-06-30',
            ticket_updated_date: '2025-07-01',
            completed_date: null,
            created_at: '2025-06-30'
        },
        {
            id: 2,
            project_id: 1,
            task_name: 'Task 2',
            description: 'Test task 2',
            sent_date: '2025-06-29',
            ticket_updated_date: '2025-07-01',
            completed_date: null,
            created_at: '2025-06-29'
        },
        {
            id: 3,
            project_id: 1,
            task_name: 'Task 5',
            description: 'Test task 5',
            sent_date: '2025-06-18',
            ticket_updated_date: null,
            completed_date: null,
            created_at: '2025-06-18'
        },
        {
            id: 4,
            project_id: 1,
            task_name: 'Task 4',
            description: 'Test task 4',
            sent_date: '2025-06-23',
            ticket_updated_date: null,
            completed_date: null,
            created_at: '2025-06-23'
        }
    ]
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Setup event listeners
    setupEventListeners();

    // Load holiday data first
    await loadHolidayData();

    // Initialize demo data if Supabase is not configured
    if (!supabase) {
        users = [...demoData.users];
        projects = [...demoData.projects];
        leaves = [...demoData.leaves];
        tasks = [...demoData.tasks]; // Initialize tasks demo data

        // Show demo notification
        showDemoNotification();
    }

    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    } else {
        showLogin();
    }
}

function showDemoNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ffeaa7;
        color: #636e72;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        max-width: 300px;
        font-size: 14px;
        border-left: 4px solid #fdcb6e;
    `;
    notification.innerHTML = `
        <strong>Demo Mode</strong><br>
        Supabase not configured. Using demo data.<br>
        Login: manager@example.com / password
    `;
    document.body.appendChild(notification);

    // Auto remove after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 10000);
}

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Add buttons - with debug logging
    const addProjectBtn = document.getElementById('addProjectBtn');
    const addUserBtn = document.getElementById('addUserBtn');
    const addLeaveBtn = document.getElementById('addLeaveBtn');

    console.log('Add buttons found:', {
        addProjectBtn: !!addProjectBtn,
        addUserBtn: !!addUserBtn,
        addLeaveBtn: !!addLeaveBtn
    });

    if (addProjectBtn) addProjectBtn.addEventListener('click', () => openProjectModal());
    if (addUserBtn) addUserBtn.addEventListener('click', () => openUserModal());
    if (addLeaveBtn) addLeaveBtn.addEventListener('click', () => openLeaveModal());

    // Cancel buttons
    document.getElementById('cancelProject').addEventListener('click', closeModals);
    document.getElementById('cancelUser').addEventListener('click', closeModals);
    document.getElementById('cancelLeave').addEventListener('click', closeModals);
    document.getElementById('cancelTask').addEventListener('click', closeModals); // Task cancel

    // Form submissions
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);
    document.getElementById('leaveForm').addEventListener('submit', handleLeaveSubmit);
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit); // Task form

    // Filters
    document.getElementById('statusFilter').addEventListener('change', filterProjects);
    document.getElementById('searchProject').addEventListener('input', filterProjects);

    // Project webmaster filter event listener
    const projectWebmasterFilter = document.getElementById('projectWebmasterFilter');
    if (projectWebmasterFilter) {
        projectWebmasterFilter.addEventListener('change', filterProjects);
    }

    // Issues checkbox event listeners
    const issues8HoursCheckbox = document.getElementById('issuesAfter8Hours');
    const issues10DaysCheckbox = document.getElementById('issuesAfter10Days');

    if (issues8HoursCheckbox) {
        issues8HoursCheckbox.addEventListener('change', function() {
            toggleIssuesContainer('issues8HoursContainer', this.checked);
        });
    }

    if (issues10DaysCheckbox) {
        issues10DaysCheckbox.addEventListener('change', function() {
            toggleIssuesContainer('issues10DaysContainer', this.checked);
        });
    }

    // Goal tracking event listener
    const refreshGoalsBtn = document.getElementById('refreshGoalsBtn');
    if (refreshGoalsBtn) {
        refreshGoalsBtn.addEventListener('click', renderGoalTrackingTab);
    }

    // Webmaster filter event listener
    const webmasterFilter = document.getElementById('webmasterFilter');
    if (webmasterFilter) {
        webmasterFilter.addEventListener('change', renderGoalTrackingTab);
    }

    // Goal evaluation date event listeners
    const goalEvaluationDate = document.getElementById('goalEvaluationDate');
    if (goalEvaluationDate) {
        goalEvaluationDate.addEventListener('change', renderGoalTrackingTab);
    }

    const resetGoalDateBtn = document.getElementById('resetGoalDateBtn');
    if (resetGoalDateBtn) {
        resetGoalDateBtn.addEventListener('click', function() {
            const dateInput = document.getElementById('goalEvaluationDate');
            if (dateInput) {
                dateInput.value = '';
                renderGoalTrackingTab();
            }
        });
    }

    // Holiday calendar event listener
    const holidayYearSelector = document.getElementById('holidayYear');
    if (holidayYearSelector) {
        holidayYearSelector.addEventListener('change', renderHolidayCalendar);
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // Use event delegation for dynamic buttons
    document.addEventListener('click', (e) => {
        // Handle task add button (check for button or icon inside button)
        const taskBtn = e.target.closest('#addTaskBtn');
        if (taskBtn) {
            e.preventDefault();
            e.stopPropagation();
            openTaskModal();
            return;
        }

        // Handle close buttons (check for button or icon inside button)
        const closeBtn = e.target.closest('.close');
        if (closeBtn) {
            e.preventDefault();
            e.stopPropagation();
            closeModals();
            return;
        }
    });
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        let user;

        if (supabase) {
            // Use custom users table for authentication (not Supabase Auth)
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
            // Demo mode authentication
            user = users.find(u => u.email === email && u.password === password);
            if (!user) {
                throw new Error('Invalid credentials');
            }
        }

        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        errorDiv.classList.remove('show');
        showDashboard();

    } catch (error) {
        errorDiv.textContent = error.message || 'Login failed';
        errorDiv.classList.add('show');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    // No need to sign out from Supabase Auth since we're using custom auth
    showLogin();
}

function showLogin() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('dashboard').classList.remove('active');
}

function showDashboard() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');

    // Update UI based on user role
    updateUIForUserRole();

    // Load data
    loadDashboardData();
}

function updateUIForUserRole() {
    const userInfo = document.getElementById('userInfo');
    userInfo.textContent = `${currentUser.name} (${formatRole(currentUser.role)})`;

    // Add role class to body for CSS styling
    document.body.className = `role-${currentUser.role}`;

    // Hide/show elements based on role
    const managerOnlyElements = document.querySelectorAll('.manager-only');
    const usersNavTab = document.getElementById('usersNavTab');
    const leavesNavTab = document.getElementById('leavesNavTab');

    console.log('User role:', currentUser.role);
    console.log('Manager-only elements found:', managerOnlyElements.length);
    console.log('Users nav tab found:', !!usersNavTab);
    console.log('Leaves nav tab found:', !!leavesNavTab);

    if (currentUser.role !== 'manager') {
        managerOnlyElements.forEach(el => el.style.display = 'none');
        if (usersNavTab) usersNavTab.style.display = 'none';
        if (leavesNavTab) leavesNavTab.style.display = 'none';
    } else {
        console.log('Showing manager-only elements');
        managerOnlyElements.forEach((el, index) => {
            // Remove inline display style to let CSS take over
            el.style.display = '';
            console.log(`Manager-only element ${index}:`, el.id || el.className, 'display:', el.style.display);
        });
        if (usersNavTab) usersNavTab.style.display = 'block';
        if (leavesNavTab) leavesNavTab.style.display = 'block';
    }
}

async function loadDashboardData() {
    await loadProjects();
    await loadUsers();
    await loadLeaves();
    await loadTasks(); // Load tasks

    // Load webmasters for project form
    loadWebmastersIntoSelect();
    loadUsersIntoSelect();
    loadWebmastersIntoGoalFilter(); // Load webmasters for goal filter
    loadWebmastersIntoProjectFilter(); // Load webmasters for project filter

    // Check if Goals tab is the active tab and load goals
    const activeTab = document.querySelector('.nav-tab.active');
    if (activeTab && activeTab.getAttribute('data-tab') === 'goals') {
        renderGoalTrackingTab();
    }
}

// Tab Navigation
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');

    // Load goals when goals tab is activated
    if (tabName === 'goals') {
        renderGoalTrackingTab();
    }

    // Load holiday calendar when holidays tab is activated
    if (tabName === 'holidays') {
        renderHolidayCalendar();
    }
}

// Projects Functions
async function loadProjects() {
    try {
        let allProjects = [];

        if (supabase) {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    users:assigned_webmaster(name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            allProjects = data;
        } else {
            // Demo mode - use local data
            allProjects = demoData.projects.map(project => ({
                ...project,
                users: users.find(u => u.id === project.assigned_webmaster)
            }));
        }

        // Filter projects based on user role
        if (currentUser.role === 'manager') {
            // Managers can see all projects
            projects = allProjects;
        } else {
            // Non-managers can only see projects assigned to them
            projects = allProjects.filter(project =>
                project.assigned_webmaster === currentUser.id
            );
        }

        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderProjects() {
    const grid = document.getElementById('projectsGrid');

    if (projects.length === 0) {
        let noDataMessage;
        if (currentUser.role === 'manager') {
            noDataMessage = 'No projects found in the system';
        } else {
            noDataMessage = 'No projects assigned to you';
        }
        grid.innerHTML = `<div class="no-data">${noDataMessage}</div>`;
        return;
    }

    // Add header outside the grid
    let headerInfo = '';
    if (currentUser.role === 'manager') {
        headerInfo = `
            <div class="projects-header">
                <h2>All Projects</h2>
                <p>Viewing all projects in the system (${projects.length} total)</p>
            </div>
        `;
    } else {
        headerInfo = `
            <div class="projects-header">
                <h2>My Assigned Projects</h2>
                <p>Projects assigned to you (${projects.length} total)</p>
            </div>
        `;
    }

    // Insert header before the grid
    const projectsContainer = grid.parentElement;
    const existingHeader = projectsContainer.querySelector('.projects-header');
    if (existingHeader) {
        existingHeader.remove();
    }
    grid.insertAdjacentHTML('beforebegin', headerInfo);

    grid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <div>
                    <div class="project-title">${project.project_name}</div>
                    <small class="text-muted">Created: ${formatDate(project.created_at)}</small>
                </div>
                <span class="project-status status-${project.project_status.toLowerCase().replace(/\s+/g, '-')}">${project.project_status}</span>
            </div>
            <div class="project-info">
                <div class="project-info-item">
                    <span class="project-info-label">Webmaster:</span>
                    <span class="project-info-value">${project.users?.name || 'Not assigned'}</span>
                </div>
                <div class="project-info-item">
                    <span class="project-info-label">Design Approved:</span>
                    <span class="project-info-value">${formatDate(project.design_approved_date)}</span>
                </div>
                <div class="project-info-item">
                    <span class="project-info-label">Target Date:</span>
                    <span class="project-info-value">${formatDate(project.target_date)}</span>
                </div>
                <div class="project-info-item">
                    <span class="project-info-label">Ticket:</span>
                    <span class="project-info-value">
                        <a href="${project.ticket_link}" target="_blank" class="text-primary">View Ticket</a>
                    </span>
                </div>
            </div>
            <div class="project-actions">
                ${currentUser.role === 'manager' ? `
                    <button class="btn btn-primary btn-sm" onclick="editProject(${project.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProject(${project.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                ` : `
                    <button class="btn btn-primary btn-sm" onclick="viewProject(${project.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                `}
            </div>
        </div>
    `).join('');
}

function filterProjects() {
    const statusFilter = document.getElementById('statusFilter').value;
    const webmasterFilter = document.getElementById('projectWebmasterFilter');
    const selectedWebmasterId = webmasterFilter ? webmasterFilter.value : '';
    const searchTerm = document.getElementById('searchProject').value.toLowerCase();

    let filteredProjects = projects;

    if (statusFilter) {
        filteredProjects = filteredProjects.filter(p => p.project_status === statusFilter);
    }

    if (selectedWebmasterId) {
        filteredProjects = filteredProjects.filter(p => p.assigned_webmaster === parseInt(selectedWebmasterId));
    }

    if (searchTerm) {
        filteredProjects = filteredProjects.filter(p =>
            p.project_name.toLowerCase().includes(searchTerm) ||
            p.users?.name.toLowerCase().includes(searchTerm)
        );
    }

    // Temporarily store original projects and render filtered
    const originalProjects = projects;
    projects = filteredProjects;
    renderProjects();
    projects = originalProjects;
}

async function openProjectModal(projectId = null) {
    const modal = document.getElementById('projectModal');
    const title = document.getElementById('projectModalTitle');
    const form = document.getElementById('projectForm');

    if (projectId) {
        title.textContent = 'Edit Project';
        const project = projects.find(p => p.id === projectId);

        // Check if user has permission to access this project
        if (!project) {
            showErrorMessage('Project not found or you do not have permission to access it');
            return;
        }

        if (currentUser.role !== 'manager' && project.assigned_webmaster !== currentUser.id) {
            showErrorMessage('You can only access projects assigned to you');
            return;
        }

        populateProjectForm(project);

        // Set current project ID and load tasks
        currentProjectId = projectId;
        const projectTasks = await loadTasks(projectId);
        renderTasks(projectTasks);
    } else {
        title.textContent = 'Add Project';
        form.reset();

        // Additional clearing for custom fields to ensure no residual data
        const fieldMappings = {
            'project_name': 'projectName',
            'ticket_link': 'ticketLink',
            'design_approved_date': 'designApprovedDate',
            'assigned_webmaster': 'assignedWebmaster',
            'webmaster_assigned_date': 'webmasterAssignedDate',
            'target_date': 'targetDate',
            'project_status': 'projectStatus',
            'signed_up_date': 'signedUpDate',
            'contract_start_date': 'contractStartDate',
            'date_sent_to_wp_qa': 'dateSentToWpQa',
            'date_finished_wp_qa': 'dateFinishedWpQa',
            'date_finished_wp_bugs': 'dateFinishedWpBugs',
            'date_sent_to_page_qa': 'dateSentToPageQa',
            'date_finished_page_qa': 'dateFinishedPageQa',
            'date_finished_page_bugs': 'dateFinishedPageBugs',
            'dns_changed_date': 'dnsChangedDate',
            'date_sent_to_golive_qa': 'dateSentToGoliveQa',
            'date_finished_golive_qa': 'dateFinishedGoliveQa',
            'date_finished_golive_bugs': 'dateFinishedGoliveBugs',
            'manager_sent_back': 'managerSentBack',
            'wp_reopened_bugs': 'wpReopenedBugs',
            'page_reopened_bugs': 'pageReopenedBugs',
            'golive_reopened_bugs': 'goliveReopenedBugs',
            'issues_after_8_hours': 'issuesAfter8Hours',
            'issues_after_10_days': 'issuesAfter10Days',
            'issues_8_hours_text': 'issues8HoursText',
            'issues_10_days_text': 'issues10DaysText'
        };

        // Clear all form fields explicitly
        Object.values(fieldMappings).forEach(formFieldId => {
            const input = document.getElementById(formFieldId);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            }
        });

        // Hide all issue containers
        toggleIssuesContainer('issues8HoursContainer', false);
        toggleIssuesContainer('issues10DaysContainer', false);

        // Set default dates
        document.getElementById('webmasterAssignedDate').value = new Date().toISOString().split('T')[0];

        // Clear tasks section for new project
        currentProjectId = null;
        document.getElementById('tasksList').innerHTML = '<div class="no-data">Save the project first to add tasks</div>';
    }

    modal.classList.add('active');
}

// Function to set up modal-specific event listeners
function populateProjectForm(project) {
    // Map database field names (snake_case) to form field IDs (camelCase)
    const fieldMappings = {
        'project_name': 'projectName',
        'ticket_link': 'ticketLink',
        'design_approved_date': 'designApprovedDate',
        'assigned_webmaster': 'assignedWebmaster',
        'webmaster_assigned_date': 'webmasterAssignedDate',
        'target_date': 'targetDate',
        'project_status': 'projectStatus',
        'signed_up_date': 'signedUpDate',
        'contract_start_date': 'contractStartDate',
        'date_sent_to_wp_qa': 'dateSentToWpQa',
        'date_finished_wp_qa': 'dateFinishedWpQa',
        'date_finished_wp_bugs': 'dateFinishedWpBugs',
        'date_sent_to_page_qa': 'dateSentToPageQa',
        'date_finished_page_qa': 'dateFinishedPageQa',
        'date_finished_page_bugs': 'dateFinishedPageBugs',
        'dns_changed_date': 'dnsChangedDate',
        'date_sent_to_golive_qa': 'dateSentToGoliveQa',
        'date_finished_golive_qa': 'dateFinishedGoliveQa',
        'date_finished_golive_bugs': 'dateFinishedGoliveBugs',
        'manager_sent_back': 'managerSentBack',
        'wp_reopened_bugs': 'wpReopenedBugs',
        'page_reopened_bugs': 'pageReopenedBugs',
        'golive_reopened_bugs': 'goliveReopenedBugs',
        'issues_after_8_hours': 'issuesAfter8Hours',
        'issues_after_10_days': 'issuesAfter10Days',
        'issues_8_hours_text': 'issues8HoursText',
        'issues_10_days_text': 'issues10DaysText'
    };

    // First, clear all form fields to prevent data from previous projects
    Object.values(fieldMappings).forEach(formFieldId => {
        const input = document.getElementById(formFieldId);
        if (input) {
            if (input.type === 'checkbox') {
                input.checked = false;
            } else {
                input.value = '';
            }
        }
    });

    // Hide all issue containers by default
    toggleIssuesContainer('issues8HoursContainer', false);
    toggleIssuesContainer('issues10DaysContainer', false);

    // Now populate with actual project data
    Object.keys(project).forEach(dbKey => {
        const formFieldId = fieldMappings[dbKey] || dbKey;
        const input = document.getElementById(formFieldId);

        if (input && project[dbKey] !== null && project[dbKey] !== undefined) {
            if (input.type === 'checkbox') {
                input.checked = project[dbKey];

                // Show/hide issues containers based on checkbox state
                if (formFieldId === 'issuesAfter8Hours') {
                    toggleIssuesContainer('issues8HoursContainer', project[dbKey]);
                } else if (formFieldId === 'issuesAfter10Days') {
                    toggleIssuesContainer('issues10DaysContainer', project[dbKey]);
                }
            } else {
                input.value = project[dbKey];
            }
        }
    });
}

async function handleProjectSubmit(e) {
    e.preventDefault();

    // Check if user has permission to edit projects
    const title = document.getElementById('projectModalTitle').textContent;
    const isEditing = title === 'Edit Project';

    // For non-managers, only allow viewing (no submission)
    if (currentUser.role !== 'manager') {
        showErrorMessage('You do not have permission to modify project data');
        return;
    }

    const formData = new FormData(e.target);
    const projectData = {};

    // List of date fields that should be explicitly handled
    const dateFields = [
        'design_approved_date', 'webmaster_assigned_date', 'target_date', 'signed_up_date',
        'contract_start_date', 'date_sent_to_wp_qa', 'date_finished_wp_qa', 'date_finished_wp_bugs',
        'date_sent_to_page_qa', 'date_finished_page_qa', 'date_finished_page_bugs',
        'dns_changed_date', 'date_sent_to_golive_qa', 'date_finished_golive_qa', 'date_finished_golive_bugs'
    ];

    // Collect all form data
    for (let [key, value] of formData.entries()) {
        // Convert empty strings to null for date fields and other optional fields
        if (value === '' || value === undefined) {
            projectData[key] = null;
        } else {
            projectData[key] = value;
        }
    }

    // Also check date fields directly from the form elements to ensure empty dates are captured as null
    dateFields.forEach(fieldName => {
        const element = document.querySelector(`[name="${fieldName}"]`);
        if (element) {
            const value = element.value;
            if (value === '' || value === undefined) {
                projectData[fieldName] = null;
            } else if (!projectData.hasOwnProperty(fieldName)) {
                // Only set if not already set by FormData
                projectData[fieldName] = value;
            }
        }
    });

    // Handle checkboxes separately (they won't be in FormData if unchecked)
    // Map camelCase to snake_case for database
    const checkboxMappings = {
        'managerSentBack': 'manager_sent_back',
        'wpReopenedBugs': 'wp_reopened_bugs',
        'pageReopenedBugs': 'page_reopened_bugs',
        'goliveReopenedBugs': 'golive_reopened_bugs',
        'issuesAfter8Hours': 'issues_after_8_hours',
        'issuesAfter10Days': 'issues_after_10_days'
    };

    Object.keys(checkboxMappings).forEach(camelKey => {
        const snakeKey = checkboxMappings[camelKey];
        projectData[snakeKey] = document.getElementById(camelKey).checked;
    });

    // Handle text area fields for issues (ensure they're captured even if empty)
    const issuesText8Hours = document.getElementById('issues8HoursText');
    const issuesText10Days = document.getElementById('issues10DaysText');

    if (issuesText8Hours) {
        projectData['issues_8_hours_text'] = issuesText8Hours.value || null;
    }
    if (issuesText10Days) {
        projectData['issues_10_days_text'] = issuesText10Days.value || null;
    }

    // Convert assigned_webmaster to integer if it exists and is not null
    if (projectData.assigned_webmaster && projectData.assigned_webmaster !== null) {
        projectData.assigned_webmaster = parseInt(projectData.assigned_webmaster);
    }

    // For new projects, remove null values for optional fields (let database handle defaults)
    // For existing projects, keep null values to allow clearing fields
    if (!isEditing) {
        // Only remove null values for new projects
        const requiredFields = ['project_name', 'ticket_link', 'design_approved_date', 'assigned_webmaster', 'webmaster_assigned_date'];
        Object.keys(projectData).forEach(key => {
            if (projectData[key] === null && !requiredFields.includes(key)) {
                delete projectData[key];
            }
        });
    }
    // For editing, keep all null values to allow clearing existing data

    try {
        const title = document.getElementById('projectModalTitle').textContent;
        const isEditing = title === 'Edit Project';
        let savedProjectId = currentProjectId;

        // Debug: Log the data being sent to see null values
        console.log('Project data being saved:', projectData);
        console.log('Is editing:', isEditing);

        if (supabase) {
            if (isEditing) {
                const { data, error } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', currentProjectId);

                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('projects')
                    .insert([projectData])
                    .select();

                if (error) throw error;
                savedProjectId = data[0].id;
                currentProjectId = savedProjectId;
            }
        } else {
            // Demo mode
            if (isEditing) {
                const index = projects.findIndex(p => p.id === currentProjectId);
                if (index > -1) {
                    projects[index] = { ...projects[index], ...projectData };
                }
            } else {
                const newProject = {
                    ...projectData,
                    id: Date.now(),
                    created_at: new Date().toISOString()
                };
                projects.push(newProject);
                savedProjectId = newProject.id;
                currentProjectId = savedProjectId;
            }
        }

        // If this was a new project, enable the task section
        if (!isEditing) {
            document.getElementById('tasksList').innerHTML = '<div class="no-data">No tasks found for this project</div>';
        }

        await loadProjects();
        showSuccessMessage('Project saved successfully!');

        // Keep modal open for task management
        if (!isEditing) {
            // Update modal title to indicate editing mode
            document.getElementById('projectModalTitle').textContent = 'Edit Project';
        }

    } catch (error) {
        console.error('Error saving project:', error);
        showErrorMessage('Error saving project: ' + error.message);
    }
}

function editProject(projectId) {
    openProjectModal(projectId);
}

async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }

    try {
        if (supabase) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) throw error;
        } else {
            // Demo mode
            const index = projects.findIndex(p => p.id === projectId);
            if (index > -1) {
                projects.splice(index, 1);
            }
        }

        await loadProjects();
        showSuccessMessage('Project deleted successfully!');

    } catch (error) {
        console.error('Error deleting project:', error);
        showErrorMessage('Error deleting project: ' + error.message);
    }
}

function viewProject(projectId) {
    openProjectModal(projectId);
    // Make form read-only for non-managers
    const form = document.getElementById('projectForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.disabled = true;
    });
}

// Tasks Functions
let currentProjectId = null;
let currentEditingTaskId = null;

async function loadTasks(projectId = null) {
    try {
        if (supabase) {
            if (projectId) {
                // Load tasks for specific project
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .eq('project_id', projectId)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Also update global tasks array with these project tasks
                data.forEach(projectTask => {
                    const existingIndex = tasks.findIndex(t => t.id === projectTask.id);
                    if (existingIndex > -1) {
                        tasks[existingIndex] = projectTask;
                    } else {
                        tasks.push(projectTask);
                    }
                });

                return data;
            } else {
                // Load all tasks into global array
                const { data, error } = await supabase
                    .from('tasks')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                tasks = data;
                console.log('All tasks loaded:', tasks.length);
            }
        } else {
            // Demo mode
            if (projectId) {
                const projectTasks = tasks.filter(task => task.project_id === projectId);
                return projectTasks;
            } else {
                // Tasks are already loaded from demoData
                console.log('Demo tasks loaded:', tasks.length);
            }
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        if (projectId) {
            return [];
        }
    }
}

function renderTasks(projectTasks) {
    const tasksList = document.getElementById('tasksList');

    if (!projectTasks || projectTasks.length === 0) {
        tasksList.innerHTML = '<div class="no-data">No tasks found for this project</div>';
        return;
    }

    tasksList.innerHTML = projectTasks.map(task => `
        <div class="task-item">
            <div class="task-header">
                <div class="task-name">${task.task_name}</div>
                <div class="task-actions">
                    ${currentUser.role === 'manager' ? `
                        <button class="btn btn-sm btn-primary" onclick="editTask(${task.id})" title="Edit Task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})" title="Delete Task">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            <div class="task-dates">
                <div class="task-date-item">
                    <span class="task-date-label">Sent:</span>
                    <span class="task-date-value">${formatDate(task.sent_date)}</span>
                </div>
                <div class="task-date-item">
                    <span class="task-date-label">Updated:</span>
                    <span class="task-date-value">${formatDate(task.ticket_updated_date)}</span>
                </div>
                <div class="task-date-item">
                    <span class="task-date-label">Completed:</span>
                    <span class="task-date-value ${task.completed_date ? 'completed' : 'pending'}">${formatDate(task.completed_date) || 'Pending'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function openTaskModal(taskId = null) {
    // Check if user has permission to manage tasks
    if (currentUser.role !== 'manager') {
        showErrorMessage('Only managers can add or edit tasks');
        return;
    }

    const modal = document.getElementById('taskModal');
    const title = document.getElementById('taskModalTitle');
    const form = document.getElementById('taskForm');

    if (taskId) {
        title.textContent = 'Edit Task';
        currentEditingTaskId = taskId;
        const task = tasks.find(t => t.id === taskId);

        if (!task) {
            console.error('Task not found with ID:', taskId);
            console.log('Available global tasks:', tasks);
            showErrorMessage('Task not found. Please refresh and try again.');
            return;
        }

        populateTaskForm(task);
    } else {
        title.textContent = 'Add Task';
        currentEditingTaskId = null;
        form.reset();
        // Set default sent date to today
        document.getElementById('taskSentDate').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('active');
}

function populateTaskForm(task) {
    if (!task) {
        console.error('No task provided to populateTaskForm');
        return;
    }

    const fieldMappings = {
        'task_name': 'taskName',
        'description': 'taskDescription',
        'sent_date': 'taskSentDate',
        'ticket_updated_date': 'ticketUpdatedDate',
        'completed_date': 'taskCompletedDate'
    };

    Object.keys(task).forEach(dbKey => {
        const formFieldId = fieldMappings[dbKey] || dbKey;
        const input = document.getElementById(formFieldId);

        if (input && task[dbKey] !== null && task[dbKey] !== undefined) {
            input.value = task[dbKey];
        } else if (!input && fieldMappings[dbKey]) {
            console.warn(`Form field not found: ${formFieldId} for task field: ${dbKey}`);
        }
    });
}

async function handleTaskSubmit(e) {
    e.preventDefault();

    // Check if user has permission to manage tasks
    if (currentUser.role !== 'manager') {
        showErrorMessage('Only managers can add or edit tasks');
        return;
    }

    if (!currentProjectId) {
        showErrorMessage('No project selected for task creation');
        return;
    }

    const formData = new FormData(e.target);
    const taskData = {
        project_id: currentProjectId
    };

    // Collect all form data
    for (let [key, value] of formData.entries()) {
        // Convert empty strings to null for date fields
        if (value === '' || value === undefined) {
            taskData[key] = null;
        } else {
            taskData[key] = value;
        }
    }

    try {
        const title = document.getElementById('taskModalTitle').textContent;
        const isEditing = title === 'Edit Task';

        if (supabase) {
            if (isEditing) {
                // Get task ID from form or current editing context
                const taskId = getCurrentEditingTaskId();
                const { data, error } = await supabase
                    .from('tasks')
                    .update(taskData)
                    .eq('id', taskId);

                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('tasks')
                    .insert([taskData]);

                if (error) throw error;
            }
        } else {
            // Demo mode
            if (isEditing) {
                const taskId = getCurrentEditingTaskId();
                const index = tasks.findIndex(t => t.id === taskId);
                if (index > -1) {
                    tasks[index] = { ...tasks[index], ...taskData };
                }
            } else {
                const newTask = {
                    ...taskData,
                    id: Date.now(),
                    created_at: new Date().toISOString()
                };
                tasks.push(newTask);
            }
        }

        closeModals();
        // Reload tasks for current project
        const projectTasks = await loadTasks(currentProjectId);
        renderTasks(projectTasks);
        showSuccessMessage('Task saved successfully!');

    } catch (error) {
        console.error('Error saving task:', error);
        showErrorMessage('Error saving task: ' + error.message);
    }
}

function getCurrentEditingTaskId() {
    return currentEditingTaskId;
}

function editTask(taskId) {
    // Check if user has permission to edit tasks
    if (currentUser.role !== 'manager') {
        showErrorMessage('Only managers can edit tasks');
        return;
    }

    openTaskModal(taskId);
}

async function deleteTask(taskId) {
    // Check if user has permission to delete tasks
    if (currentUser.role !== 'manager') {
        showErrorMessage('Only managers can delete tasks');
        return;
    }

    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        if (supabase) {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;
        } else {
            // Demo mode
            const index = tasks.findIndex(t => t.id === taskId);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        }

        // Reload tasks for current project
        const projectTasks = await loadTasks(currentProjectId);
        renderTasks(projectTasks);
        showSuccessMessage('Task deleted successfully!');

    } catch (error) {
        console.error('Error deleting task:', error);
        showErrorMessage('Error deleting task: ' + error.message);
    }
}

// Users Functions
async function loadUsers() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            users = data;
        }
        // Demo mode users are already loaded

        renderUsers();
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function renderUsers() {
    const container = document.getElementById('usersList');

    if (users.length === 0) {
        container.innerHTML = '<div class="no-data">No users found</div>';
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="user-header">
                <div class="user-name">${user.name}</div>
                <span class="user-role role-${user.role}">${formatRole(user.role)}</span>
            </div>
            <div class="user-info">
                <div class="user-info-item">
                    <span class="project-info-label">Email:</span>
                    <span class="project-info-value">${user.email}</span>
                </div>
                <div class="user-info-item">
                    <span class="project-info-label">Work Schedule:</span>
                    <span class="project-info-value">${user.work_schedule}</span>
                </div>
            </div>
            ${currentUser.role === 'manager' ? `
                <div class="user-actions">
                    <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function openUserModal(userId = null) {
    // Check if user has permission to manage users
    if (currentUser.role !== 'manager') {
        showErrorMessage('Only managers can add or edit users');
        return;
    }

    const modal = document.getElementById('userModal');
    const title = document.getElementById('userModalTitle');
    const form = document.getElementById('userForm');

    if (userId) {
        title.textContent = 'Edit User';
        const user = users.find(u => u.id === userId);
        populateUserForm(user);
        // Store the user ID for editing
        form.dataset.editingUserId = userId;
    } else {
        title.textContent = 'Add User';
        form.reset();
        // Remove any editing user ID
        delete form.dataset.editingUserId;
    }

    modal.classList.add('active');
}

function populateUserForm(user) {
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('workSchedule').value = user.work_schedule;
    // Don't populate password for security
}

async function handleUserSubmit(e) {
    e.preventDefault();

    // Check if user has permission to manage users
    if (currentUser.role !== 'manager') {
        showErrorMessage('Only managers can add or edit users');
        return;
    }

    const form = e.target;
    const editingUserId = form.dataset.editingUserId;

    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        work_schedule: document.getElementById('workSchedule').value
    };

    // Only include password if it's provided (for new users or password changes)
    const passwordField = document.getElementById('userPassword').value;
    if (passwordField) {
        userData.password = passwordField;
    }

    try {
        const isEditing = !!editingUserId;

        if (supabase) {
            if (isEditing) {
                const { data, error } = await supabase
                    .from('users')
                    .update(userData)
                    .eq('id', editingUserId);

                if (error) throw error;
            } else {
                // In real implementation, you'd hash the password and create auth user
                const { data, error } = await supabase
                    .from('users')
                    .insert([userData]);

                if (error) throw error;
            }
        } else {
            // Demo mode
            if (isEditing) {
                const index = users.findIndex(u => u.id == editingUserId);
                if (index > -1) {
                    users[index] = { ...users[index], ...userData };
                }
            } else {
                const newUser = {
                    ...userData,
                    id: Date.now(),
                    created_at: new Date().toISOString()
                };
                users.push(newUser);
            }
        }

        closeModals();
        await loadUsers();
        loadWebmastersIntoSelect(); // Refresh webmaster dropdown
        showSuccessMessage(isEditing ? 'User updated successfully!' : 'User added successfully!');

    } catch (error) {
        console.error('Error saving user:', error);
        showErrorMessage('Error saving user: ' + error.message);
    }
}

function editUser(userId) {
    // Check if user has permission to edit users
    if (currentUser.role !== 'manager') {
        showErrorMessage('Only managers can edit users');
        return;
    }

    openUserModal(userId);
}

async function deleteUser(userId) {
    // Check if user has permission to delete users
    if (currentUser.role !== 'manager') {
        showErrorMessage('Only managers can delete users');
        return;
    }

    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        if (supabase) {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

            if (error) throw error;
        } else {
            // Demo mode
            const index = users.findIndex(u => u.id === userId);
            if (index > -1) {
                users.splice(index, 1);
            }
        }

        await loadUsers();
        loadWebmastersIntoSelect(); // Refresh webmaster dropdown
        showSuccessMessage('User deleted successfully!');

    } catch (error) {
        console.error('Error deleting user:', error);
        showErrorMessage('Error deleting user: ' + error.message);
    }
}

// Leaves Functions
async function loadLeaves() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('leaves')
                .select(`
                    *,
                    users(name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            leaves = data;
        } else {
            // Demo mode
            leaves = demoData.leaves.map(leave => ({
                ...leave,
                users: users.find(u => u.id === leave.user_id)
            }));
        }

        renderLeaves();
    } catch (error) {
        console.error('Error loading leaves:', error);
    }
}

function renderLeaves() {
    const container = document.getElementById('leavesList');

    if (leaves.length === 0) {
        container.innerHTML = '<div class="no-data">No leaves found</div>';
        return;
    }

    container.innerHTML = `
        <table class="leaves-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Reason</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${leaves.map(leave => `
                    <tr>
                        <td>${leave.users?.name || 'Unknown User'}</td>
                        <td>${formatDate(leave.start_date)}</td>
                        <td>${formatDate(leave.end_date)}</td>
                        <td>${leave.reason || '-'}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteLeave(${leave.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function openLeaveModal() {
    const modal = document.getElementById('leaveModal');
    const form = document.getElementById('leaveForm');
    form.reset();
    modal.classList.add('active');
}

async function handleLeaveSubmit(e) {
    e.preventDefault();

    const leaveData = {
        user_id: parseInt(document.getElementById('leaveUser').value),
        start_date: document.getElementById('leaveStartDate').value,
        end_date: document.getElementById('leaveEndDate').value,
        reason: document.getElementById('leaveReason').value
    };

    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('leaves')
                .insert([leaveData]);

            if (error) throw error;
        } else {
            // Demo mode
            const newLeave = {
                ...leaveData,
                id: Date.now(),
                created_at: new Date().toISOString()
            };
            leaves.push(newLeave);
        }

        closeModals();
        await loadLeaves();
        showSuccessMessage('Leave saved successfully!');

    } catch (error) {
        console.error('Error saving leave:', error);
        showErrorMessage('Error saving leave: ' + error.message);
    }
}

async function deleteLeave(leaveId) {
    if (!confirm('Are you sure you want to delete this leave?')) {
        return;
    }

    try {
        if (supabase) {
            const { error } = await supabase
                .from('leaves')
                .delete()
                .eq('id', leaveId);

            if (error) throw error;
        } else {
            // Demo mode
            const index = leaves.findIndex(l => l.id === leaveId);
            if (index > -1) {
                leaves.splice(index, 1);
            }
        }

        await loadLeaves();
        showSuccessMessage('Leave deleted successfully!');

    } catch (error) {
        console.error('Error deleting leave:', error);
        showErrorMessage('Error deleting leave: ' + error.message);
    }
}

// Load holiday data
async function loadHolidayData() {
    try {
        // Load US holidays
        const usResponse = await fetch('us-leaves.json');
        usHolidays = await usResponse.json();

        // Load SL holidays
        const slResponse = await fetch('sl-leaves.json');
        slHolidays = await slResponse.json();

        console.log('Holiday data loaded successfully');
    } catch (error) {
        console.error('Error loading holiday data:', error);
        // Fallback to empty arrays
        usHolidays = [];
        slHolidays = [];
    }
}

// Holiday Calendar Functions
function renderHolidayCalendar() {
    const container = document.getElementById('holidayCalendarContent');
    const selectedYear = document.getElementById('holidayYear').value;

    if (!container) return;

    // Show user's work schedule info
    const userScheduleInfo = `
        <div class="user-schedule-info">
            <span class="schedule-flag">${currentUser.work_schedule === 'US' ? '🇺🇸' : '🇱🇰'}</span>
            Your work schedule: ${currentUser.work_schedule}
            (showing ${currentUser.work_schedule === 'US' ? 'US Federal' : 'Sri Lankan'} holidays)
        </div>
    `;

    // Filter holidays based on user's work schedule and selected year
    let holidaysToShow = [];

    if (currentUser.work_schedule === 'US') {
        holidaysToShow = usHolidays.filter(holiday =>
            holiday.date.startsWith(selectedYear)
        );
    } else if (currentUser.work_schedule === 'SL') {
        holidaysToShow = slHolidays.filter(holiday =>
            holiday.start.startsWith(selectedYear)
        );
    }

    // Sort holidays by date
    holidaysToShow.sort((a, b) => {
        const dateA = new Date(a.date || a.start);
        const dateB = new Date(b.date || b.start);
        return dateA - dateB;
    });

    let holidayListHTML = '';

    if (holidaysToShow.length === 0) {
        holidayListHTML = '<div class="no-holidays">No holidays found for this year</div>';
    } else {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        holidayListHTML = `
            <div class="holiday-section ${currentUser.work_schedule === 'US' ? 'us-holidays' : 'sl-holidays'}">
                <h3>
                    <span class="flag-icon">${currentUser.work_schedule === 'US' ? '🇺🇸' : '🇱🇰'}</span>
                    ${currentUser.work_schedule === 'US' ? 'US Federal Holidays' : 'Sri Lankan Public Holidays'} ${selectedYear}
                </h3>
                <div class="holiday-list">
                    ${holidaysToShow.map(holiday => {
                        const holidayDate = holiday.date || holiday.start;
                        const holidayName = holiday.name || holiday.summary;
                        const holidayDateObj = new Date(holidayDate);
                        const isToday = holidayDate === todayStr;
                        const isUpcoming = holidayDateObj > today && !isToday;
                        const dayName = holidayDateObj.toLocaleDateString('en-US', { weekday: 'long' });
                        const formattedDate = holidayDateObj.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        });

                        let itemClass = `holiday-item ${currentUser.work_schedule.toLowerCase()}-holiday`;
                        if (isToday) itemClass += ' today';
                        else if (isUpcoming) itemClass += ' upcoming';

                        return `
                            <div class="${itemClass}">
                                <div class="holiday-name">${holidayName}</div>
                                <div class="holiday-date">
                                    ${formattedDate}
                                    <span class="holiday-day">${dayName}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = userScheduleInfo + '<div class="holiday-calendar">' + holidayListHTML + '</div>';
}

// Helper Functions
function loadWebmastersIntoSelect() {
    const select = document.getElementById('assignedWebmaster');
    const webmasters = users.filter(u => u.role.includes('webmaster'));

    select.innerHTML = '<option value="">Select Webmaster</option>' +
        webmasters.map(user => `<option value="${user.id}">${user.name}</option>`).join('');
}

function loadWebmastersIntoGoalFilter() {
    const select = document.getElementById('webmasterFilter');
    if (!select) return;

    const webmasters = users.filter(u => u.role.includes('webmaster'));

    select.innerHTML = '<option value="">All Webmasters</option>' +
        webmasters.map(user => `<option value="${user.id}">${user.name}</option>`).join('');
}

function loadWebmastersIntoProjectFilter() {
    const select = document.getElementById('projectWebmasterFilter');
    if (!select) return;

    const webmasters = users.filter(u => u.role.includes('webmaster'));

    select.innerHTML = '<option value="">All Webmasters</option>' +
        webmasters.map(user => `<option value="${user.id}">${user.name}</option>`).join('');
}

function loadUsersIntoSelect() {
    const select = document.getElementById('leaveUser');

    select.innerHTML = '<option value="">Select User</option>' +
        users.map(user => `<option value="${user.id}">${user.name}</option>`).join('');
}

function formatRole(role) {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
}

function toggleIssuesContainer(containerId, show) {
    const container = document.getElementById(containerId);
    if (container) {
        container.style.display = show ? 'block' : 'none';

        // Clear textarea if hiding
        if (!show) {
            const textarea = container.querySelector('textarea');
            if (textarea) {
                textarea.value = '';
            }
        }
    }
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });

    // Re-enable form inputs (in case they were disabled for view mode)
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.disabled = false;
    });

    // Reset editing states
    currentEditingTaskId = null;
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message show`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
        max-width: 300px;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

// Database Setup Function (to be called once Supabase is configured)
async function setupDatabase() {
    if (!supabase) {
        console.log('Supabase not configured');
        return;
    }

    // This would typically be done through Supabase Dashboard or migrations
    console.log('Database setup should be done through Supabase Dashboard');
}

// Goal Tracking Functions
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
    } else if (workSchedule === 'SL') {
        return !slHolidays.some(holiday => {
            const holidayStart = new Date(holiday.start).toISOString().split('T')[0];
            const holidayEnd = new Date(holiday.end).toISOString().split('T')[0];
            return dateString >= holidayStart && dateString < holidayEnd;
        });
    }

    return true;
}

function addWorkingDays(startDate, workingDays, workSchedule) {
    let currentDate = new Date(startDate);
    let daysAdded = 0;

    while (daysAdded < workingDays) {
        currentDate.setDate(currentDate.getDate() + 1);
        if (isWorkingDay(currentDate, workSchedule)) {
            daysAdded++;
        }
    }

    return currentDate;
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

function getNextMonthlyGoalDate(evaluationDate = new Date()) {
    const goalDate = new Date(evaluationDate.getFullYear(), evaluationDate.getMonth(), 10);

    // If we're past the 10th of this month, get next month's 10th
    if (evaluationDate.getDate() > 10) {
        goalDate.setMonth(goalDate.getMonth() + 1);
    }

    return goalDate;
}

function getNextBiweeklyGoalDate(evaluationDate = new Date()) {
    let nextMonday = new Date(evaluationDate);

    // Find next Monday
    const daysUntilMonday = (8 - evaluationDate.getDay()) % 7;
    nextMonday.setDate(evaluationDate.getDate() + daysUntilMonday);

    // Check if it's a biweekly Monday (every other Monday)
    // For simplicity, we'll use week number to determine this
    const weekNumber = Math.floor((nextMonday - new Date(nextMonday.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));

    if (weekNumber % 2 === 0) {
        return nextMonday;
    } else {
        // If not a biweekly Monday, get the next one
        nextMonday.setDate(nextMonday.getDate() + 7);
        return nextMonday;
    }
}

function getLastMonthPeriod(evaluationDate = new Date()) {
    // End date is today (or the evaluation date)
    const endDate = new Date(evaluationDate);

    // Start date is 1 month back from today
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 1);

    return { startDate, endDate };
}

function getLastTwoWeeksPeriod(evaluationDate = new Date()) {
    // End date is today (or the evaluation date)
    const endDate = new Date(evaluationDate);

    // Start date is 2 weeks (14 days) back from today
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 14);

    return { startDate, endDate };
}

// Monthly Goal Evaluation Functions
function evaluateDesignConversionGoal(userId, userRole, evaluationDate = new Date()) {
    const { startDate, endDate } = getLastMonthPeriod(evaluationDate);
    const targetPercentage = userRole === 'webmaster_level_1' ? 90 : 80;

    // Get projects sent to WP QA by user in the period
    const userProjects = projects.filter(project =>
        project.assigned_webmaster === userId &&
        project.date_sent_to_wp_qa &&
        new Date(project.date_sent_to_wp_qa) >= startDate &&
        new Date(project.date_sent_to_wp_qa) <= endDate
    );

    if (userProjects.length === 0) {
        return {
            achieved: true,
            total: 0,
            successful: 0,
            percentage: 100,
            details: 'No projects in period',
            period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
            breakdown: [],
            statistics: {
                'Total Projects': 0,
                'Not Sent Back': 0,
                'Sent Back': 0,
                'Success Rate': '100%',
                'Target Rate': `${targetPercentage}%`
            },
            explanation: 'No projects were assigned during this evaluation period.'
        };
    }

    const sentBackProjects = userProjects.filter(project => project.manager_sent_back === true);
    const successful = userProjects.length - sentBackProjects.length;
    const percentage = (successful / userProjects.length) * 100;

    // Create detailed breakdown
    const breakdown = userProjects.map(project => ({
        projectId: project.id,
        projectName: project.project_name || `Project ${project.id}`,
        name: project.project_name || `Project ${project.id}`,
        status: project.manager_sent_back ? 'Sent Back by Manager' : 'Approved',
        success: !project.manager_sent_back,
        sentToQaDate: new Date(project.date_sent_to_wp_qa).toLocaleDateString(),
        details: project.manager_sent_back ? 'Design was rejected and sent back for revisions' : 'Design was approved without being sent back',
        ticketLink: project.ticket_link,
        description: `${project.project_name || `Project ${project.id}`} - ${project.manager_sent_back ? 'Sent Back by Manager' : 'Approved'} (Sent to QA: ${new Date(project.date_sent_to_wp_qa).toLocaleDateString()})`
    }));

    const statistics = {
        'Total Projects': userProjects.length,
        'Not Sent Back': successful,
        'Sent Back': sentBackProjects.length,
        'Success Rate': `${Math.round(percentage * 100) / 100}%`,
        'Target Rate': `${targetPercentage}%`,
        'Target Level': userRole === 'webmaster_level_1' ? 'Level 1 (90%)' : 'Level 2 (80%)'
    };

    const explanation = percentage >= targetPercentage
        ? `Goal achieved! ${successful} out of ${userProjects.length} designs were approved without being sent back (${Math.round(percentage * 100) / 100}%), meeting the ${targetPercentage}% target for ${userRole === 'webmaster_level_1' ? 'Level 1' : 'Level 2'} webmasters.`
        : `Goal not achieved. Only ${successful} out of ${userProjects.length} designs were approved without being sent back (${Math.round(percentage * 100) / 100}%), falling short of the ${targetPercentage}% target. ${sentBackProjects.length} design${sentBackProjects.length !== 1 ? 's were' : ' was'} sent back for revisions.`;

    return {
        achieved: percentage >= targetPercentage,
        total: userProjects.length,
        successful: successful,
        percentage: Math.round(percentage * 100) / 100,
        details: `${successful}/${userProjects.length} projects not sent back`,
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        breakdown: breakdown,
        statistics: statistics,
        explanation: explanation
    };
}

function evaluate8HourTechnicalGoal(userId, evaluationDate = new Date()) {
    const { startDate, endDate } = getLastMonthPeriod(evaluationDate);

    // Get projects that finished golive bugs in the period
    const completedProjects = projects.filter(project =>
        project.assigned_webmaster === userId &&
        project.date_finished_golive_bugs &&
        new Date(project.date_finished_golive_bugs) >= startDate &&
        new Date(project.date_finished_golive_bugs) <= endDate
    );

    if (completedProjects.length === 0) {
        return {
            achieved: true,
            total: 0,
            successful: 0,
            percentage: 100,
            details: 'No golive bugs completed in period',
            period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
            breakdown: [],
            statistics: {
                'Total Projects Completed': 0,
                'No 8-Hour Issues': 0,
                'Had 8-Hour Issues': 0,
                'Success Rate': '100%',
                'Target Rate': '100%'
            },
            explanation: 'No golive bug fixes were completed during this evaluation period.'
        };
    }

    const issueProjects = completedProjects.filter(project => project.issues_after_8_hours === true);
    const successful = completedProjects.length - issueProjects.length;
    const percentage = (successful / completedProjects.length) * 100;

    // Create detailed breakdown
    const breakdown = completedProjects.map(project => ({
        projectId: project.id,
        projectName: project.project_name || `Project ${project.id}`,
        name: project.project_name || `Project ${project.id}`,
        status: project.issues_after_8_hours ? 'Had Issues' : 'No Issues',
        success: !project.issues_after_8_hours,
        goliveCompletedDate: new Date(project.date_finished_golive_bugs).toLocaleDateString(),
        details: project.issues_after_8_hours
            ? 'Technical issues were reported within 8 hours of golive completion'
            : 'No technical issues reported within 8 hours of golive completion',
        ticketLink: project.ticket_link,
        description: `${project.project_name || `Project ${project.id}`} - ${project.issues_after_8_hours ? 'Had Issues' : 'No Issues'} (Golive completed: ${new Date(project.date_finished_golive_bugs).toLocaleDateString()})`
    }));

    const statistics = {
        'Total Projects Completed': completedProjects.length,
        'No 8-Hour Issues': successful,
        'Had 8-Hour Issues': issueProjects.length,
        'Success Rate': `${Math.round(percentage * 100) / 100}%`,
        'Target Rate': '100%'
    };

    const explanation = percentage === 100
        ? `Goal achieved! All ${completedProjects.length} projects that completed golive had no technical issues within the first 8 hours, meeting the 100% target.`
        : `Goal not achieved. ${issueProjects.length} out of ${completedProjects.length} projects had technical issues within 8 hours of golive completion (${Math.round(percentage * 100) / 100}% success rate). The target is 100% - no technical issues should occur within the first 8 hours after golive completion.`;

    return {
        achieved: percentage === 100,
        total: completedProjects.length,
        successful: successful,
        percentage: Math.round(percentage * 100) / 100,
        details: `${successful}/${completedProjects.length} projects without 8-hour issues`,
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        breakdown: breakdown,
        statistics: statistics,
        explanation: explanation
    };
}

function evaluate10DayComplianceGoal(userId, evaluationDate = new Date()) {
    const { startDate, endDate } = getLastMonthPeriod(evaluationDate);

    // Get projects where 10 working days from DNS change falls within the evaluation period
    const relevantProjects = projects.filter(project => {
        if (project.assigned_webmaster !== userId || !project.dns_changed_date) return false;

        const dnsDate = new Date(project.dns_changed_date);
        const user = users.find(u => u.id === userId);
        const workSchedule = user ? user.work_schedule : 'US';

        // Calculate 10 working days from DNS change
        const tenWorkingDaysLater = addWorkingDays(dnsDate, 10, workSchedule);

        // Check if the 10-day mark falls within the evaluation period
        return tenWorkingDaysLater >= startDate && tenWorkingDaysLater <= endDate;
    });

    if (relevantProjects.length === 0) {
        return {
            achieved: true,
            total: 0,
            successful: 0,
            percentage: 100,
            details: 'No 10-day compliance checks due in period',
            period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
            breakdown: [],
            statistics: {
                'Total 10-Day Checks': 0,
                'No 10-Day Issues': 0,
                'Had 10-Day Issues': 0,
                'Success Rate': '100%',
                'Target Rate': '100%'
            },
            explanation: 'No projects reached their 10-day compliance check during this evaluation period.'
        };
    }

    const issueProjects = relevantProjects.filter(project => project.issues_after_10_days === true);
    const successful = relevantProjects.length - issueProjects.length;
    const percentage = (successful / relevantProjects.length) * 100;

    // Create detailed breakdown
    const breakdown = relevantProjects.map(project => {
        const dnsDate = new Date(project.dns_changed_date);
        const user = users.find(u => u.id === userId);
        const workSchedule = user ? user.work_schedule : 'US';
        const tenDayMark = addWorkingDays(dnsDate, 10, workSchedule);

        return {
            name: project.project_name || `Project ${project.id}`,
            status: project.issues_after_10_days ? 'Had Issues' : 'No Issues',
            success: !project.issues_after_10_days,
            dnsDate: dnsDate.toLocaleDateString(),
            tenDayMark: tenDayMark.toLocaleDateString(),
            details: project.issues_after_10_days
                ? 'Compliance or stability issues were reported after 10 working days'
                : 'No compliance or stability issues reported after 10 working days',
            description: `${project.project_name || `Project ${project.id}`} - ${project.issues_after_10_days ? 'Had Issues' : 'No Issues'} (DNS: ${dnsDate.toLocaleDateString()}, 10-day mark: ${tenDayMark.toLocaleDateString()})`
        };
    });

    const statistics = {
        'Total 10-Day Checks': relevantProjects.length,
        'No 10-Day Issues': successful,
        'Had 10-Day Issues': issueProjects.length,
        'Success Rate': `${Math.round(percentage * 100) / 100}%`,
        'Target Rate': '100%'
    };

    const explanation = percentage === 100
        ? `Goal achieved! All ${relevantProjects.length} projects that reached their 10-day compliance check had no issues, meeting the 100% target.`
        : `Goal not achieved. ${issueProjects.length} out of ${relevantProjects.length} projects had compliance or stability issues after 10 working days (${Math.round(percentage * 100) / 100}% success rate). The target is 100% - no compliance issues should occur after the 10-day monitoring period.`;

    return {
        achieved: percentage === 100,
        total: relevantProjects.length,
        successful: successful,
        percentage: Math.round(percentage * 100) / 100,
        details: `${successful}/${relevantProjects.length} projects without 10-day issues`,
        period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        breakdown: breakdown,
        statistics: statistics,
        explanation: explanation
    };
}

function evaluateNoReopenedBugsGoal(userId, evaluationDate = new Date()) {
    const { startDate, endDate } = getLastMonthPeriod(evaluationDate);

    // Get projects assigned to user that had bug-related activity in the evaluation period
    const userProjects = projects.filter(project => {
        if (project.assigned_webmaster !== userId) return false;

        // Include projects if ANY bug-related activity occurred during the evaluation period
        const wpBugDate = project.date_finished_wp_bugs ? new Date(project.date_finished_wp_bugs) : null;
        const pageBugDate = project.date_finished_page_bugs ? new Date(project.date_finished_page_bugs) : null;
        const goliveBugDate = project.date_finished_golive_bugs ? new Date(project.date_finished_golive_bugs) : null;

        // Check if any bug fix activity occurred in the evaluation period
        const hasWpBugActivity = wpBugDate && wpBugDate >= startDate && wpBugDate <= endDate;
        const hasPageBugActivity = pageBugDate && pageBugDate >= startDate && pageBugDate <= endDate;
        const hasGoliveBugActivity = goliveBugDate && goliveBugDate >= startDate && goliveBugDate <= endDate;

        return hasWpBugActivity || hasPageBugActivity || hasGoliveBugActivity;
    });

    if (userProjects.length === 0) {
        return {
            achieved: true,
            total: 0,
            successful: 0,
            percentage: 100,
            details: 'No projects in period',
            period: `${formatDate(startDate)} - ${formatDate(endDate)}`,
            breakdown: [],
            statistics: {
                'Total Projects': 0,
                'Projects without reopened bugs': 0,
                'Projects with reopened bugs': 0
            },
            explanation: 'No projects had bug-related activity during this evaluation period.'
        };
    }

    // Create detailed breakdown for each project
    const breakdown = userProjects.map(project => {
        const reopenedTypes = [];
        const bugActivitiesInPeriod = [];

        // Check which bug types were reopened and which activities occurred in period
        const wpBugDate = project.date_finished_wp_bugs ? new Date(project.date_finished_wp_bugs) : null;
        const pageBugDate = project.date_finished_page_bugs ? new Date(project.date_finished_page_bugs) : null;
        const goliveBugDate = project.date_finished_golive_bugs ? new Date(project.date_finished_golive_bugs) : null;

        if (wpBugDate && wpBugDate >= startDate && wpBugDate <= endDate) {
            bugActivitiesInPeriod.push('WP conversion bugs fixed');
            if (project.wp_reopened_bugs) reopenedTypes.push('WP conversion');
        }

        if (pageBugDate && pageBugDate >= startDate && pageBugDate <= endDate) {
            bugActivitiesInPeriod.push('Page creation bugs fixed');
            if (project.page_reopened_bugs) reopenedTypes.push('Page creation');
        }

        if (goliveBugDate && goliveBugDate >= startDate && goliveBugDate <= endDate) {
            bugActivitiesInPeriod.push('Golive bugs fixed');
            if (project.golive_reopened_bugs) reopenedTypes.push('Golive');
        }

        const hasReopenedBugs = reopenedTypes.length > 0;
        const activitiesText = bugActivitiesInPeriod.join(', ');

        return {
            projectId: project.id,
            projectName: project.project_name,
            status: !hasReopenedBugs,
            success: !hasReopenedBugs,
            ticketLink: project.ticket_link,
            description: hasReopenedBugs
                ? `${project.project_name} - ${activitiesText} (${reopenedTypes.join(', ')} had reopened bugs)`
                : `${project.project_name} - ${activitiesText} (no reopened bugs)`
        };
    });

    const reopenedProjects = userProjects.filter(project =>
        project.wp_reopened_bugs === true ||
        project.page_reopened_bugs === true ||
        project.golive_reopened_bugs === true
    );

    const successful = userProjects.length - reopenedProjects.length;
    const percentage = (successful / userProjects.length) * 100;

    return {
        achieved: percentage === 100,
        total: userProjects.length,
        successful: successful,
        percentage: Math.round(percentage * 100) / 100,
        details: `${successful}/${userProjects.length} projects without reopened bugs`,
        period: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        breakdown: breakdown,
        statistics: {
            'Total Projects': userProjects.length,
            'Projects without reopened bugs': successful,
            'Projects with reopened bugs': reopenedProjects.length
        },
        explanation: percentage === 100
            ? 'All projects with bug-fixing activity completed without any reopened bugs across WP conversion, page creation, and golive phases.'
            : `${reopenedProjects.length} out of ${userProjects.length} projects with bug-fixing activity had reopened bugs, preventing achievement of this goal.`
    };
}

function evaluatePageBugFixTimeGoal(userId, workSchedule, evaluationDate = new Date()) {
    const { startDate, endDate } = getLastMonthPeriod(evaluationDate);

    // Get projects with page creation bugs in the period
    const bugProjects = projects.filter(project =>
        project.assigned_webmaster === userId &&
        project.date_finished_page_qa &&
        project.date_finished_page_bugs &&
        new Date(project.date_finished_page_qa) >= startDate &&
        new Date(project.date_finished_page_qa) <= endDate
    );

    if (bugProjects.length === 0) {
        return {
            achieved: true,
            total: 0,
            successful: 0,
            percentage: 100,
            details: 'No page bugs in period',
            period: `${formatDate(startDate)} - ${formatDate(endDate)}`,
            breakdown: [],
            statistics: {
                totalBugFixes: 0,
                onTimeFixes: 0,
                delayedFixes: 0,
                averageDays: 0,
                longestDelay: 0
            },
            explanation: 'No page creation bugs were found in this period, so the goal is automatically achieved.'
        };
    }

    let successful = 0;
    let totalDays = 0;
    let maxDays = 0;
    const breakdown = [];

    bugProjects.forEach(project => {
        const qaDate = new Date(project.date_finished_page_qa);
        const bugFixDate = new Date(project.date_finished_page_bugs);
        const workingDaysBetween = getWorkingDaysBetween(qaDate, bugFixDate, workSchedule);

        totalDays += workingDaysBetween;
        maxDays = Math.max(maxDays, workingDaysBetween);

        const onTime = workingDaysBetween <= 3;
        if (onTime) {
            successful++;
        }

        breakdown.push({
            projectId: project.id,
            projectName: project.project_name || 'Unnamed Project',
            qaDate: formatDate(qaDate),
            bugFixDate: formatDate(bugFixDate),
            workingDays: workingDaysBetween,
            onTime: onTime,
            status: onTime ? 'On Time' : 'Delayed',
            target: '3 working days',
            success: onTime,
            ticketLink: project.ticket_link,
            description: `${project.project_name || 'Unnamed Project'} - ${onTime ? 'On Time' : 'Delayed'} (${workingDaysBetween} days, QA: ${formatDate(qaDate)}, Fixed: ${formatDate(bugFixDate)})`
        });
    });

    const percentage = (successful / bugProjects.length) * 100;
    const averageDays = totalDays / bugProjects.length;
    const achieved = percentage === 100;

    const explanation = achieved
        ? `Excellent! All ${bugProjects.length} page bug fixes were completed within the 3 working day target. This demonstrates strong bug resolution efficiency and attention to quality.`
        : `${bugProjects.length - successful} out of ${bugProjects.length} page bug fixes exceeded the 3 working day target. Focus on quicker bug identification and resolution to improve response time.`;

    return {
        achieved: achieved,
        total: bugProjects.length,
        successful: successful,
        percentage: Math.round(percentage * 100) / 100,
        details: `${successful}/${bugProjects.length} bug fixes completed within 3 working days`,
        period: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        breakdown: breakdown,
        statistics: {
            totalBugFixes: bugProjects.length,
            onTimeFixes: successful,
            delayedFixes: bugProjects.length - successful,
            averageDays: Math.round(averageDays * 10) / 10,
            longestDelay: maxDays
        },
        explanation: explanation
    };
}

function evaluateTaskUpdateGoal(userId, workSchedule, evaluationDate = new Date()) {
    const { startDate, endDate } = getLastTwoWeeksPeriod(evaluationDate);

    // Get all tasks for projects assigned to user where task update activity occurred in the period
    const userProjectIds = projects
        .filter(project => project.assigned_webmaster === userId)
        .map(project => project.id);

    const userTasks = tasks.filter(task => {
        if (!userProjectIds.includes(task.project_id) || !task.sent_date) return false;

        const sentDate = new Date(task.sent_date);
        const updatedDate = task.ticket_updated_date ? new Date(task.ticket_updated_date) : null;
        const completedDate = task.completed_date ? new Date(task.completed_date) : null;

        // Include tasks where the sent date OR update/completion date falls in the period
        const sentInPeriod = sentDate >= startDate && sentDate <= endDate;
        const updatedInPeriod = updatedDate && updatedDate >= startDate && updatedDate <= endDate;
        const completedInPeriod = completedDate && completedDate >= startDate && completedDate <= endDate;

        return sentInPeriod || updatedInPeriod || completedInPeriod;
    });

    if (userTasks.length === 0) {
        return {
            achieved: true,
            total: 0,
            successful: 0,
            percentage: 100,
            details: 'No tasks assigned in period',
            period: `${formatDate(startDate)} - ${formatDate(endDate)}`,
            breakdown: [],
            statistics: {
                totalTasks: 0,
                timelyUpdates: 0,
                lateUpdates: 0,
                averageDays: 0,
                longestDelay: 0
            },
            explanation: 'No tasks were assigned in this period, so the goal is automatically achieved.'
        };
    }

    let successful = 0;
    let totalDays = 0;
    let maxDays = 0;
    const breakdown = [];

    userTasks.forEach(task => {
        const sentDate = new Date(task.sent_date);
        let achievedTimeliness = false;
        let updateDays = null;
        let updateType = 'None';

        // Check if ticket was updated within 2 working days
        if (task.ticket_updated_date) {
            const updatedDate = new Date(task.ticket_updated_date);
            const workingDaysBetween = getWorkingDaysBetween(sentDate, updatedDate, workSchedule);
            updateDays = workingDaysBetween;
            updateType = 'Updated';
            if (workingDaysBetween <= 2) {
                achievedTimeliness = true;
            }
        }

        // If not updated but completed within 2 working days, also consider as achieved
        if (!achievedTimeliness && task.completed_date) {
            const completedDate = new Date(task.completed_date);
            const workingDaysBetween = getWorkingDaysBetween(sentDate, completedDate, workSchedule);
            if (updateDays === null) {
                updateDays = workingDaysBetween;
                updateType = 'Completed';
            }
            if (workingDaysBetween <= 2) {
                achievedTimeliness = true;
            }
        }

        // If neither updated nor completed, calculate days since sent
        if (updateDays === null) {
            updateDays = getWorkingDaysBetween(sentDate, evaluationDate, workSchedule);
            updateType = 'No Update';
        }

        totalDays += updateDays;
        maxDays = Math.max(maxDays, updateDays);

        if (achievedTimeliness) {
            successful++;
        }

        const project = projects.find(p => p.id === task.project_id);
        breakdown.push({
            taskId: task.id,
            projectName: project ? (project.project_name || `Project ${project.id}`) : 'Unknown Project',
            taskDescription: task.task_name || task.description || 'No description',
            sentDate: formatDate(sentDate),
            updateType: updateType,
            workingDays: updateDays,
            onTime: achievedTimeliness,
            status: achievedTimeliness ? 'On Time' : 'Late',
            target: '2 working days',
            success: achievedTimeliness,
            ticketLink: project.ticket_link,
            description: `${project ? (project.project_name || `Project ${project.id}`) : 'Unknown Project'} - ${task.task_name || task.description || 'Task'} - ${achievedTimeliness ? 'On Time' : 'Late'} (${updateDays} days, ${updateType})`
        });
    });

    const percentage = (successful / userTasks.length) * 100;
    const averageDays = totalDays / userTasks.length;
    const achieved = percentage === 100;

    const explanation = achieved
        ? `Perfect! All ${userTasks.length} tasks were updated or completed within the 2 working day target. This shows excellent communication and task management.`
        : `${userTasks.length - successful} out of ${userTasks.length} tasks were not updated or completed within the 2 working day target. Prioritize quicker response times and regular status updates.`;

    return {
        achieved: achieved,
        total: userTasks.length,
        successful: successful,
        percentage: Math.round(percentage * 100) / 100,
        details: `${successful}/${userTasks.length} tasks updated or completed within 2 working days`,
        period: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        breakdown: breakdown,
        statistics: {
            totalTasks: userTasks.length,
            timelyUpdates: successful,
            lateUpdates: userTasks.length - successful,
            averageDays: Math.round(averageDays * 10) / 10,
            longestDelay: maxDays
        },
        explanation: explanation
    };
}

function evaluateDesignCompletionGoal(userId, workSchedule, evaluationDate = new Date()) {
    const { startDate, endDate } = getLastTwoWeeksPeriod(evaluationDate);

    // Get projects where WP conversion activity or target evaluation occurred in the period
    const userProjects = projects.filter(project => {
        if (project.assigned_webmaster !== userId || !project.target_date) return false;

        const targetDate = new Date(project.target_date);
        const qaDate = project.date_sent_to_wp_qa ? new Date(project.date_sent_to_wp_qa) : null;

        // Include if QA date falls in period OR target date falls in period
        const qaInPeriod = qaDate && qaDate >= startDate && qaDate <= endDate;
        const targetInPeriod = targetDate >= startDate && targetDate <= endDate;

        return qaInPeriod || targetInPeriod;
    });

    if (userProjects.length === 0) {
        return {
            achieved: true,
            total: 0,
            successful: 0,
            percentage: 100,
            details: 'No WP conversion targets due in period',
            period: `${formatDate(startDate)} - ${formatDate(endDate)}`,
            breakdown: [],
            statistics: {
                totalProjects: 0,
                onTrackProjects: 0,
                delayedProjects: 0,
                completedProjects: 0,
                pendingProjects: 0
            },
            explanation: 'No WP conversion target dates or completions occurred during this evaluation period.'
        };
    }

    let successful = 0;
    let completed = 0;
    let pending = 0;
    const breakdown = [];

    userProjects.forEach(project => {
        let onTrack = false;
        let status = 'No Target Date';
        let daysDiff = null;

        if (project.target_date) {
            const targetDate = new Date(project.target_date);
            const today = new Date(evaluationDate);

            if (project.date_sent_to_wp_qa) {
                // Project was sent to QA - check if it was on time
                const qaDate = new Date(project.date_sent_to_wp_qa);
                daysDiff = getWorkingDaysBetween(qaDate, targetDate, workSchedule);
                completed++;

                if (qaDate <= targetDate) {
                    onTrack = true;
                    status = daysDiff >= 0 ? `On Time (${daysDiff} days early)` : `On Time`;
                } else {
                    status = `Late (${Math.abs(daysDiff)} days)`;
                }
            } else {
                // Project not yet sent to QA - check if target date has passed
                daysDiff = getWorkingDaysBetween(today, targetDate, workSchedule);
                pending++;

                if (today <= targetDate) {
                    // Target date hasn't passed yet, so it's still on track
                    onTrack = true;
                    status = `On Track (${daysDiff} days remaining)`;
                } else {
                    status = `Overdue (${Math.abs(daysDiff)} days)`;
                }
            }
        } else {
            // If no target date, consider as successful to avoid penalizing
            onTrack = true;
            status = 'No Target Date Set';
        }

        if (onTrack) {
            successful++;
        }

        breakdown.push({
            projectId: project.id,
            projectName: project.project_name || 'Unnamed Project',
            assignedDate: project.webmaster_assigned_date ? formatDate(new Date(project.webmaster_assigned_date)) : 'Not Assigned',
            targetDate: project.target_date ? formatDate(new Date(project.target_date)) : 'Not Set',
            qaDate: project.date_sent_to_wp_qa ? formatDate(new Date(project.date_sent_to_wp_qa)) : 'Not Sent',
            onTrack: onTrack,
            status: status,
            isCompleted: !!project.date_sent_to_wp_qa,
            description: `${project.project_name || 'Unnamed Project'} - ${status} (Target: ${project.target_date ? formatDate(new Date(project.target_date)) : 'Not Set'}, QA: ${project.date_sent_to_wp_qa ? formatDate(new Date(project.date_sent_to_wp_qa)) : 'Not Sent'})`
        });
    });

    const percentage = (successful / userProjects.length) * 100;
    const achieved = percentage === 100;

    const explanation = achieved
        ? `Excellent! All ${userProjects.length} assigned projects are on track or completed by their target dates. This demonstrates strong project management and design completion efficiency.`
        : `${userProjects.length - successful} out of ${userProjects.length} projects are behind schedule or completed late. Focus on better timeline estimation and earlier identification of potential delays.`;

    return {
        achieved: achieved,
        total: userProjects.length,
        successful: successful,
        percentage: Math.round(percentage * 100) / 100,
        details: `${successful}/${userProjects.length} designs on track or completed by target date`,
        period: `${formatDate(startDate)} - ${formatDate(endDate)}`,
        breakdown: breakdown,
        statistics: {
            totalProjects: userProjects.length,
            onTrackProjects: successful,
            delayedProjects: userProjects.length - successful,
            completedProjects: completed,
            pendingProjects: pending
        },
        explanation: explanation
    };
}

// Main Goal Tracking Function
async function calculateGoalsForUser(userId, evaluationDate = new Date()) {
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    const workSchedule = user.work_schedule;
    const userRole = user.role;

    // Monthly Goals (evaluated on 10th of each month)
    const monthlyGoals = {
        designConversion: evaluateDesignConversionGoal(userId, userRole, evaluationDate),
        technicalIssues8Hour: evaluate8HourTechnicalGoal(userId, evaluationDate),
        compliance10Day: evaluate10DayComplianceGoal(userId, evaluationDate),
        noReopenedBugs: evaluateNoReopenedBugsGoal(userId, evaluationDate),
        pageBugFixTime: evaluatePageBugFixTimeGoal(userId, evaluationDate)
    };

    // Biweekly Goals (evaluated every other Monday)
    const biweeklyGoals = {
        taskUpdates: evaluateTaskUpdateGoal(userId, workSchedule, evaluationDate),
        designCompletion: evaluateDesignCompletionGoal(userId, workSchedule, evaluationDate)
    };

    return {
        user: user,
        evaluationDate: evaluationDate.toISOString().split('T')[0],
        nextMonthlyEvaluation: getNextMonthlyGoalDate(evaluationDate).toISOString().split('T')[0],
        nextBiweeklyEvaluation: getNextBiweeklyGoalDate(evaluationDate).toISOString().split('T')[0],
        monthlyGoals: monthlyGoals,
        biweeklyGoals: biweeklyGoals
    };
}

async function calculateAllGoals(evaluationDate = new Date()) {
    let webmasters;

    if (currentUser.role === 'manager') {
        // Managers can see all webmasters' goals
        webmasters = users.filter(u => u.role.includes('webmaster'));

        // Apply webmaster filter if selected
        const webmasterFilter = document.getElementById('webmasterFilter');
        if (webmasterFilter && webmasterFilter.value) {
            const selectedWebmasterId = parseInt(webmasterFilter.value);
            webmasters = webmasters.filter(u => u.id === selectedWebmasterId);
        }
    } else {
        // Non-managers can only see their own goals if they are webmasters
        if (currentUser.role.includes('webmaster')) {
            webmasters = [currentUser];
        } else {
            webmasters = [];
        }
    }

    const allGoals = [];

    for (const webmaster of webmasters) {
        const goals = await calculateGoalsForUser(webmaster.id, evaluationDate);
        if (goals) {
            allGoals.push(goals);
        }
    }

    return allGoals;
}

// UI Functions for Goal Tracking
function renderGoalTrackingTab() {
    // Get the custom evaluation date from the input field
    const dateInput = document.getElementById('goalEvaluationDate');
    let evaluationDate = new Date();

    if (dateInput && dateInput.value) {
        evaluationDate = new Date(dateInput.value);
    }

    return calculateAllGoals(evaluationDate).then(allGoals => {
        const container = document.getElementById('goalTrackingContent');
        if (!container) return;

        if (allGoals.length === 0) {
            let noDataMessage;
            if (currentUser.role === 'manager') {
                noDataMessage = 'No webmasters found for goal tracking';
            } else if (currentUser.role.includes('webmaster')) {
                noDataMessage = 'No goal data available for your account';
            } else {
                noDataMessage = 'Goal tracking is only available for webmasters';
            }
            container.innerHTML = `<div class="no-data">${noDataMessage}</div>`;
            return;
        }

        // Add header based on user role
        let headerInfo = '';
        const evaluationDateStr = evaluationDate.toLocaleDateString();
        const isCustomDate = dateInput && dateInput.value;
        const dateLabel = isCustomDate
            ? `<span class="custom-date-indicator">📅 Evaluation Date: ${evaluationDateStr}</span>`
            : `<span class="current-date-indicator">📅 Current Date: ${evaluationDateStr}</span>`;

        if (currentUser.role === 'manager') {
            const webmasterFilter = document.getElementById('webmasterFilter');
            const selectedWebmasterId = webmasterFilter ? webmasterFilter.value : '';

            if (selectedWebmasterId) {
                const selectedWebmaster = users.find(u => u.id === parseInt(selectedWebmasterId));
                headerInfo = `
                    <div class="goals-header">
                        <h2>Goal Tracking - ${selectedWebmaster ? selectedWebmaster.name : 'Selected Webmaster'}</h2>
                        <p>Viewing goals for the selected webmaster • ${dateLabel}</p>
                    </div>
                `;
            } else {
                headerInfo = `
                    <div class="goals-header">
                        <h2>Goal Tracking - All Team Members</h2>
                        <p>Viewing goals for all webmasters in the system (${allGoals.length} total) • ${dateLabel}</p>
                    </div>
                `;
            }
        } else {
            headerInfo = `
                <div class="goals-header">
                    <h2>My Goal Tracking</h2>
                    <p>Your personal goal performance and metrics • ${dateLabel}</p>
                </div>
            `;
        }

        container.innerHTML = headerInfo + allGoals.map(userGoals => `
            <div class="goal-user-section">
                <div class="goal-user-header">
                    <h3>${userGoals.user.name} (${formatRole(userGoals.user.role)})</h3>
                    <div class="goal-schedule-info">
                        <span>Work Schedule: ${userGoals.user.work_schedule}</span>
                        <span>Next Monthly Eval: ${formatDate(userGoals.nextMonthlyEvaluation)}</span>
                        <span>Next Biweekly Eval: ${formatDate(userGoals.nextBiweeklyEvaluation)}</span>
                    </div>
                </div>

                <div class="goals-container">
                    <div class="goal-section">
                        <h4>Monthly Goals</h4>
                        <div class="goal-grid">
                            ${renderGoalCard('Design Conversion Success', userGoals.monthlyGoals.designConversion)}
                            ${renderGoalCard('8-Hour Technical Check', userGoals.monthlyGoals.technicalIssues8Hour)}
                            ${renderGoalCard('10-Day Compliance Check', userGoals.monthlyGoals.compliance10Day)}
                            ${renderGoalCard('No Reopened Bugs', userGoals.monthlyGoals.noReopenedBugs)}
                            ${renderGoalCard('Page Bug Fix Time', userGoals.monthlyGoals.pageBugFixTime)}
                        </div>
                    </div>

                    <div class="goal-section">
                        <h4>Biweekly Goals</h4>
                        <div class="goal-grid">
                            ${renderGoalCard('Task Updates Timeliness', userGoals.biweeklyGoals.taskUpdates)}
                            ${renderGoalCard('Design Completion Time', userGoals.biweeklyGoals.designCompletion)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    });
}

function renderGoalCard(title, goalResult) {
    const statusClass = goalResult.achieved ? 'achieved' : 'not-achieved';
    const statusIcon = goalResult.achieved ? '✅' : '❌';
    const cardId = `goal-card-${Math.random().toString(36).substr(2, 9)}`;
    const detailsId = `goal-details-${Math.random().toString(36).substr(2, 9)}`;

    // Generate detailed breakdown
    let detailedBreakdown = '';
    if (goalResult.breakdown && goalResult.breakdown.length > 0) {
        detailedBreakdown = `
            <div class="goal-breakdown">
                <h5>Detailed Breakdown:</h5>
                <ul class="breakdown-list">
                    ${goalResult.breakdown.map(item => {
                        // Find the project to get ticket link
                        const project = projects.find(p => p.id === item.projectId || p.project_name === item.projectName);
                        const ticketLink = project && project.ticket_link ? project.ticket_link : null;

                        // Create clickable project name if ticket link exists
                        let projectNameHtml = item.projectName || 'Unknown Project';
                        if (ticketLink) {
                            projectNameHtml = `<a href="${ticketLink}" target="_blank" class="project-link">${projectNameHtml}</a>`;
                        }

                        // Replace project name in description with clickable version
                        let description = item.description || item.details || 'No description available';
                        if (item.projectName && ticketLink) {
                            description = description.replace(item.projectName, projectNameHtml);
                        }

                        return `
                            <li class="breakdown-item ${item.status || item.success ? 'success' : 'failure'}">
                                <span class="breakdown-icon">${item.status || item.success ? '✅' : '❌'}</span>
                                <span class="breakdown-text">${description}</span>
                            </li>
                        `;
                    }).join('')}
                </ul>
            </div>
        `;
    }

    // Generate period information
    let periodInfo = '';
    if (goalResult.period) {
        periodInfo = `
            <div class="goal-period">
                <strong>Evaluation Period:</strong> ${goalResult.period}
            </div>
        `;
    }

    // Generate statistics
    let statisticsInfo = '';
    if (goalResult.statistics) {
        statisticsInfo = `
            <div class="goal-statistics">
                <h5>Statistics:</h5>
                ${Object.entries(goalResult.statistics).map(([key, value]) => `
                    <div class="stat-item">
                        <span class="stat-label">${key}:</span>
                        <span class="stat-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    return `
        <div class="goal-card ${statusClass}" id="${cardId}">
            <div class="goal-header" onclick="toggleGoalDetails('${detailsId}')">
                <span class="goal-title">${title}</span>
                <div class="goal-header-right">
                    <span class="goal-status">${statusIcon}</span>
                    <span class="goal-expand-icon">
                        <i class="fas fa-chevron-down"></i>
                    </span>
                </div>
            </div>
            <div class="goal-details">
                <div class="goal-percentage">${goalResult.percentage}%</div>
                <div class="goal-description">${goalResult.details}</div>
            </div>
            <div class="goal-details-expanded" id="${detailsId}" style="display: none;">
                ${periodInfo}
                ${statisticsInfo}
                ${detailedBreakdown}
                ${goalResult.explanation ? `
                    <div class="goal-explanation">
                        <h5>${goalResult.achieved ? 'Why Goal Was Achieved:' : 'Why Goal Was Not Achieved:'}</h5>
                        <p>${goalResult.explanation}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Toggle goal card details
function toggleGoalDetails(detailsId) {
    const detailsElement = document.getElementById(detailsId);
    const isVisible = detailsElement.style.display !== 'none';

    if (isVisible) {
        detailsElement.style.display = 'none';
        // Find the expand icon and rotate it back
        const card = detailsElement.closest('.goal-card');
        const expandIcon = card.querySelector('.goal-expand-icon i');
        if (expandIcon) {
            expandIcon.style.transform = 'rotate(0deg)';
        }
    } else {
        detailsElement.style.display = 'block';
        // Find the expand icon and rotate it
        const card = detailsElement.closest('.goal-card');
        const expandIcon = card.querySelector('.goal-expand-icon i');
        if (expandIcon) {
            expandIcon.style.transform = 'rotate(180deg)';
        }
    }
}
