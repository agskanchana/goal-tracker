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

// Demo data for when Supabase is not configured
const demoData = {
    users: [
        {
            id: 1,
            name: 'John Manager',
            email: 'manager@example.com',
            role: 'manager',
            work_schedule: 'US',
            password: 'password' // Make sure this matches what you're typing
        },
        {
            id: 2,
            name: 'Jane Webmaster',
            email: 'webmaster1@example.com',
            role: 'webmaster_level_1',
            work_schedule: 'US',
            password: 'password'
        },
        {
            id: 3,
            name: 'Bob Developer',
            email: 'webmaster2@example.com',
            role: 'webmaster_level_2',
            work_schedule: 'SL',
            password: 'password'
        }
    ],
    projects: [
        {
            id: 1,
            project_name: 'Demo Project 1',
            ticket_link: 'https://example.com/ticket/1',
            design_approved_date: '2025-01-01',
            assigned_webmaster: 2,
            webmaster_assigned_date: '2025-01-02',
            target_date: '2025-02-01',
            project_status: 'WP conversion',
            signed_up_date: '2024-12-15',
            contract_start_date: '2025-01-01',
            issues_after_8_hours: false,
            issues_8_hours_text: null,
            issues_after_10_days: true,
            issues_10_days_text: 'Some minor styling issues found that need to be addressed',
            created_at: '2024-12-20'
        }
    ],
    leaves: [
        {
            id: 1,
            user_id: 2,
            start_date: '2025-01-15',
            end_date: '2025-01-17',
            reason: 'Personal leave',
            created_at: '2024-12-20'
        }
    ],
    tasks: [
        {
            id: 1,
            project_id: 1,
            task_name: 'Initial Setup',
            description: 'Set up the basic project structure and environment',
            sent_date: '2025-01-01',
            ticket_updated_date: '2025-01-02',
            completed_date: null,
            created_at: '2025-01-01'
        },
        {
            id: 2,
            project_id: 1,
            task_name: 'Design Review',
            description: 'Review and approve the design mockups',
            sent_date: '2025-01-03',
            ticket_updated_date: '2025-01-04',
            completed_date: '2025-01-05',
            created_at: '2025-01-03'
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
    const addTaskBtn = document.getElementById('addTaskBtn'); // Add task button

    console.log('Add buttons found:', {
        addProjectBtn: !!addProjectBtn,
        addUserBtn: !!addUserBtn,
        addLeaveBtn: !!addLeaveBtn,
        addTaskBtn: !!addTaskBtn // Log task button
    });

    if (addProjectBtn) addProjectBtn.addEventListener('click', () => openProjectModal());
    if (addUserBtn) addUserBtn.addEventListener('click', () => openUserModal());
    if (addLeaveBtn) addLeaveBtn.addEventListener('click', () => openLeaveModal());
    if (addTaskBtn) addTaskBtn.addEventListener('click', () => openTaskModal()); // Task modal

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

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
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
}

// Projects Functions
async function loadProjects() {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    users:assigned_webmaster(name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            projects = data;
        } else {
            // Demo mode - use local data
            projects = demoData.projects.map(project => ({
                ...project,
                users: users.find(u => u.id === project.assigned_webmaster)
            }));
        }

        renderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

function renderProjects() {
    const grid = document.getElementById('projectsGrid');

    if (projects.length === 0) {
        grid.innerHTML = '<div class="no-data">No projects found</div>';
        return;
    }

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
    const searchTerm = document.getElementById('searchProject').value.toLowerCase();

    let filteredProjects = projects;

    if (statusFilter) {
        filteredProjects = filteredProjects.filter(p => p.project_status === statusFilter);
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
        populateProjectForm(project);

        // Set current project ID and load tasks
        currentProjectId = projectId;
        const projectTasks = await loadTasks(projectId);
        renderTasks(projectTasks);
    } else {
        title.textContent = 'Add Project';
        form.reset();
        // Set default dates
        document.getElementById('webmasterAssignedDate').value = new Date().toISOString().split('T')[0];

        // Clear tasks section for new project
        currentProjectId = null;
        document.getElementById('tasksList').innerHTML = '<div class="no-data">Save the project first to add tasks</div>';
    }

    modal.classList.add('active');
}

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

    const formData = new FormData(e.target);
    const projectData = {};

    // Collect all form data
    for (let [key, value] of formData.entries()) {
        // Convert empty strings to null for date fields and other optional fields
        if (value === '' || value === undefined) {
            projectData[key] = null;
        } else {
            projectData[key] = value;
        }
    }

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

    // Convert assigned_webmaster to integer if it exists and is not null
    if (projectData.assigned_webmaster && projectData.assigned_webmaster !== null) {
        projectData.assigned_webmaster = parseInt(projectData.assigned_webmaster);
    }

    // Remove any keys with null values for optional fields (let database handle defaults)
    const requiredFields = ['project_name', 'ticket_link', 'design_approved_date', 'assigned_webmaster', 'webmaster_assigned_date'];
    Object.keys(projectData).forEach(key => {
        if (projectData[key] === null && !requiredFields.includes(key)) {
            delete projectData[key];
        }
    });

    try {
        const title = document.getElementById('projectModalTitle').textContent;
        const isEditing = title === 'Edit Project';
        let savedProjectId = currentProjectId;

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

async function loadTasks(projectId) {
    try {
        if (supabase) {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } else {
            // Demo mode - filter tasks by project ID
            return tasks.filter(task => task.project_id === projectId);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        return [];
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
    const modal = document.getElementById('taskModal');
    const title = document.getElementById('taskModalTitle');
    const form = document.getElementById('taskForm');

    if (taskId) {
        title.textContent = 'Edit Task';
        currentEditingTaskId = taskId;
        const task = tasks.find(t => t.id === taskId);
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
        }
    });
}

async function handleTaskSubmit(e) {
    e.preventDefault();

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
    openTaskModal(taskId);
}

async function deleteTask(taskId) {
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
            <div class="user-actions">
                <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('userModalTitle');
    const form = document.getElementById('userForm');

    if (userId) {
        title.textContent = 'Edit User';
        const user = users.find(u => u.id === userId);
        populateUserForm(user);
    } else {
        title.textContent = 'Add User';
        form.reset();
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

    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        work_schedule: document.getElementById('workSchedule').value,
        password: document.getElementById('userPassword').value
    };

    try {
        if (supabase) {
            // In real implementation, you'd hash the password and create auth user
            const { data, error } = await supabase
                .from('users')
                .insert([userData]);

            if (error) throw error;
        } else {
            // Demo mode
            const newUser = {
                ...userData,
                id: Date.now(),
                created_at: new Date().toISOString()
            };
            users.push(newUser);
        }

        closeModals();
        await loadUsers();
        loadWebmastersIntoSelect(); // Refresh webmaster dropdown
        showSuccessMessage('User saved successfully!');

    } catch (error) {
        console.error('Error saving user:', error);
        showErrorMessage('Error saving user: ' + error.message);
    }
}

function editUser(userId) {
    openUserModal(userId);
}

async function deleteUser(userId) {
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

// Helper Functions
function loadWebmastersIntoSelect() {
    const select = document.getElementById('assignedWebmaster');
    const webmasters = users.filter(u => u.role.includes('webmaster'));

    select.innerHTML = '<option value="">Select Webmaster</option>' +
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

// Event listeners for project form and modals
document.getElementById('addProjectBtn')?.addEventListener('click', () => openProjectModal());
document.getElementById('cancelProject').addEventListener('click', closeModals);
document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);

// Task-related event listeners
document.getElementById('addTaskBtn')?.addEventListener('click', () => openTaskModal());
document.getElementById('cancelTask').addEventListener('click', closeModals);
document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);

// Filter and search event listeners
document.getElementById('statusFilter').addEventListener('change', filterProjects);
document.getElementById('searchProject').addEventListener('input', filterProjects);

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
