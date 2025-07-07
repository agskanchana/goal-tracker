# Goal Tracking Custom Date Feature - Test Guide

## Overview
The goal tracking system now supports custom evaluation dates for both monthly and biweekly goals.

## How It Works

### Monthly Goals
- **Design Conversion Success**: Looks back 1 month from evaluation date
- **8-Hour Technical Check**: Looks back 1 month from evaluation date
- **10-Day Compliance Check**: Looks back 1 month from evaluation date
- **No Reopened Bugs**: Looks back 1 month from evaluation date
- **Page Bug Fix Time**: Looks back 1 month from evaluation date

### Biweekly Goals
- **Task Updates Timeliness**: Looks back 2 weeks from evaluation date
- **Design Completion Time**: Looks back 2 weeks from evaluation date

## Usage Instructions

1. **Login** to the system using demo credentials:
   - Email: `manager@ekwa.com`
   - Password: `password`

2. **Navigate to Goals Tab**
   - Click on the "Goals" tab in the navigation

3. **Set Custom Date (Optional)**
   - Use the "Evaluation Date" field to select a specific date
   - Leave blank to use today's date (default behavior)
   - Click "Today" button to reset to current date

4. **View Results**
   - Goals will be calculated based on the selected date
   - Monthly goals look back 1 month from the selected date
   - Biweekly goals look back 2 weeks from the selected date

## Test Examples

### Test Case 1: July 1st, 2025
- Set date to July 1st, 2025
- Monthly goals will evaluate from June 1st - July 1st, 2025
- Biweekly goals will evaluate from June 17th - July 1st, 2025

### Test Case 2: Current Date (Default)
- Leave date field empty
- Monthly goals will evaluate from 1 month ago to today
- Biweekly goals will evaluate from 2 weeks ago to today

## Visual Indicators
- **Custom Date**: Blue indicator showing the selected evaluation date
- **Current Date**: Green indicator showing today's date is being used
- **Helper Text**: Explains the lookback periods for each goal type

## Implementation Details
- Date calculations respect working days and holidays
- All existing business logic remains unchanged
- Only the evaluation period changes based on the selected date
- Goals show detailed breakdowns with project names and dates
