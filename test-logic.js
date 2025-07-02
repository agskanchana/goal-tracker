// Test the task update logic
const projects = [
    {
        id: 1,
        assigned_webmaster: 2, // Jane Webmaster
    },
    {
        id: 2,
        assigned_webmaster: 3, // Bob Developer
    }
];

const tasks = [
    {
        id: 1,
        project_id: 1,
        task_name: 'Task 1',
        sent_date: '2025-06-30',
        ticket_updated_date: '2025-07-01',
        completed_date: null,
    },
    {
        id: 2,
        project_id: 1,
        task_name: 'Task 2',
        sent_date: '2025-06-29',
        ticket_updated_date: '2025-07-01',
        completed_date: null,
    },
    {
        id: 3,
        project_id: 1,
        task_name: 'Task 5',
        sent_date: '2025-06-18',
        ticket_updated_date: null,
        completed_date: null,
    },
    {
        id: 4,
        project_id: 1,
        task_name: 'Task 4',
        sent_date: '2025-06-23',
        ticket_updated_date: null,
        completed_date: null,
    }
];

function getLastTwoWeeksPeriod(evaluationDate = new Date()) {
    const endDate = new Date(evaluationDate);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 14);
    return { startDate, endDate };
}

function isWorkingDay(date, workSchedule = 'US') {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    // Check if it's a weekend (Saturday = 6, Sunday = 0)
    return dayOfWeek !== 0 && dayOfWeek !== 6;
}

function getWorkingDaysBetween(startDate, endDate, workSchedule = 'US') {
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

function evaluateTaskUpdateGoal(userId, workSchedule, evaluationDate = new Date()) {
    const { startDate, endDate } = getLastTwoWeeksPeriod(evaluationDate);

    console.log('\n=== Task Update Goal Evaluation ===');
    console.log('User ID:', userId, 'Work Schedule:', workSchedule);
    console.log('Period:', startDate.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);

    // Get all tasks for projects assigned to user in the period
    const userProjectIds = projects
        .filter(project => project.assigned_webmaster === userId)
        .map(project => project.id);

    console.log('User Project IDs:', userProjectIds);

    const userTasks = tasks.filter(task => {
        const inProject = userProjectIds.includes(task.project_id);
        const hasSentDate = task.sent_date;
        const sentDate = new Date(task.sent_date);
        const inPeriod = sentDate >= startDate && sentDate <= endDate;

        console.log(`Task ${task.task_name}: inProject=${inProject}, hasSentDate=${hasSentDate}, inPeriod=${inPeriod}`);
        console.log(`  Sent: ${task.sent_date}, Period: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

        return inProject && hasSentDate && inPeriod;
    });

    console.log('Tasks in period:', userTasks.length);

    if (userTasks.length === 0) {
        return { achieved: true, total: 0, successful: 0, percentage: 100, details: 'No tasks assigned in period' };
    }

    let successful = 0;
    userTasks.forEach(task => {
        const sentDate = new Date(task.sent_date);
        let achievedTimeliness = false;

        console.log(`\nEvaluating task: ${task.task_name}`);
        console.log(`Sent date: ${task.sent_date}`);

        // Check if ticket was updated within 2 working days
        if (task.ticket_updated_date) {
            const updatedDate = new Date(task.ticket_updated_date);
            const workingDaysBetween = getWorkingDaysBetween(sentDate, updatedDate, workSchedule);
            console.log(`Updated date: ${task.ticket_updated_date}, Working days between: ${workingDaysBetween}`);
            if (workingDaysBetween <= 2) {
                achievedTimeliness = true;
                console.log('✓ Achieved via update');
            } else {
                console.log('✗ Update too late');
            }
        }

        // If not updated but completed within 2 working days, also consider as achieved
        if (!achievedTimeliness && task.completed_date) {
            const completedDate = new Date(task.completed_date);
            const workingDaysBetween = getWorkingDaysBetween(sentDate, completedDate, workSchedule);
            console.log(`Completed date: ${task.completed_date}, Working days between: ${workingDaysBetween}`);
            if (workingDaysBetween <= 2) {
                achievedTimeliness = true;
                console.log('✓ Achieved via completion');
            } else {
                console.log('✗ Completion too late');
            }
        }

        if (!task.ticket_updated_date && !task.completed_date) {
            console.log('✗ No update or completion date');
        }

        if (achievedTimeliness) {
            successful++;
        }
        console.log(`Task result: ${achievedTimeliness ? 'PASS' : 'FAIL'}`);
    });

    const percentage = (successful / userTasks.length) * 100;

    console.log(`\nFinal Result: ${successful}/${userTasks.length} tasks achieved (${percentage}%)`);
    console.log(`Goal achieved: ${percentage === 100}`);

    return {
        achieved: percentage === 100,
        total: userTasks.length,
        successful: successful,
        percentage: Math.round(percentage * 100) / 100,
        details: `${successful}/${userTasks.length} tasks updated or completed within 2 working days`
    };
}

// Test for user ID 2 (Jane Webmaster) with US schedule
const result = evaluateTaskUpdateGoal(2, 'US', new Date('2025-07-02'));
console.log('\n=== FINAL RESULT ===');
console.log(result);
