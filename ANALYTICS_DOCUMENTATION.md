# Analytics Dashboard Documentation

## Overview
The Analytics Dashboard is a manager-only feature that provides insights into webmaster workloads and project distribution. It helps managers make informed decisions when assigning new projects to webmasters based on their current workload.

## Access
- **URL**: `analytics.html`
- **Permission**: Manager role only
- **Authentication**: Uses the same login system as the main application

## Features

### 1. Workload Analysis Tab

#### Project Status Weights
The workload analysis uses a weighted scoring system based on project status:

| Project Status | Weight | Description |
|---|---|---|
| WP conversion - Pending | 10/10 | Highest priority, most work required |
| WP conversion QA | 8/10 | Under review, high attention needed |
| WP conversion QA - Fixing | 7/10 | Active development, fixing issues |
| Page Creation - Pending | 6/10 | Waiting for page creation work |
| Page creation QA | 5/10 | Page creation under review |
| Page creation QA - Fixing | 4/10 | Page creation fixes in progress |
| Page creation QA - Verifying | 3/10 | Final verification stage |
| Golive Approval Pending | 2/10 | Waiting for go-live approval |
| Golive QA | 1/10 | Final QA before going live |
| Golive QA - Fixing | 0/10 | No active workload (final fixes) |
| Live | 0/10 | Project is live, no active work |
| Completed | 0/10 | Project completed |

#### Workload Score Categories
- **Low (Green)**: 0-15 points
- **Medium (Yellow)**: 16-30 points
- **High (Orange)**: 31-50 points
- **Critical (Red)**: 51+ points

#### Key Metrics
- **Total Active Projects**: Count of all projects with weight > 0
- **Total Workload Points**: Sum of all weighted scores
- **Average Workload**: Average points per webmaster
- **Recommended for New Project**: Webmaster with lowest current workload

#### Webmaster Cards
Each webmaster card displays:
- **Name**: Webmaster's full name
- **Workload Score**: Total weighted points (color-coded)
- **Project Breakdown**: List of project statuses with:
  - Number of projects in each status
  - Total weight points for each status

### 2. Performance Metrics Tab (Coming Soon)
- Project completion trends
- Average time per project phase
- Performance metrics by webmaster
- Bottleneck analysis

### 3. Timeline Analysis Tab (Coming Soon)
- Project timeline visualization
- Deadline tracking
- Resource allocation over time

## How to Use

### For Project Assignment
1. **Access the dashboard**: Login as a manager and click "Analytics" in the header
2. **Review workload scores**: Check each webmaster's current workload
3. **Identify best candidate**: The webmaster with the lowest score appears in "Recommended for New Project"
4. **Consider skill level**: Factor in webmaster level (1 vs 2) for complex projects
5. **Assign project**: Return to main dashboard to assign the new project

### Reading the Data
- **Green scores (0-15)**: Webmaster has light workload, good for new projects
- **Yellow scores (16-30)**: Moderate workload, can handle additional projects
- **Orange scores (31-50)**: Heavy workload, consider carefully before assigning more
- **Red scores (51+)**: Critical workload, avoid assigning new projects unless urgent

## Technical Implementation
- **Data Source**: Same Supabase database as main application
- **Demo Mode**: Includes sample data when Supabase is not configured
- **Real-time**: Data refreshes on page load and manual refresh
- **Responsive**: Works on desktop and mobile devices

## Security
- **Manager-only access**: Non-managers are redirected or denied access
- **Same authentication**: Uses the main app's login system
- **Session management**: Maintains login state across pages

## Navigation
- **Back to Main**: Return to the main dashboard
- **Logout**: Sign out from the analytics dashboard
- **Refresh Data**: Manually refresh workload calculations

## Benefits for Managers
1. **Fair Distribution**: Ensure workload is evenly distributed among webmasters
2. **Prevent Overload**: Avoid assigning too many high-weight projects to one person
3. **Optimize Efficiency**: Balance workload based on project complexity and status
4. **Data-Driven Decisions**: Make assignment decisions based on objective metrics
5. **Quick Overview**: Get instant visibility into team capacity and availability

## Future Enhancements
- Export workload reports
- Historical workload trends
- Automated assignment suggestions
- Integration with calendar for leave planning
- Performance analytics and benchmarks
