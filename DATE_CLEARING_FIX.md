# Project Form Date Clearing Fix

## Issue Description
When editing a project, if a user clears a date field using the date picker (making it empty) and saves the project, the incorrect date would not be removed from the database. The form would continue to show the old date even after clearing it.

## Root Cause
The form submission logic was removing null values from the update data for existing projects, which prevented the database from being updated to clear the date fields.

## Solution Implemented

### 1. Differentiate Between New and Existing Projects
- For **new projects**: Remove null values to let database defaults take effect
- For **existing projects**: Keep null values to allow clearing existing data

### 2. Enhanced Date Field Handling
- Explicitly check all date fields in the form
- Ensure empty date inputs are converted to `null` values
- Handle both FormData and direct element value checking

### 3. Improved Text Area Handling
- Explicitly handle issue text areas to ensure they can be cleared
- Convert empty strings to `null` for proper database updates

## Code Changes

### Main Fix in `handleProjectSubmit()`:
```javascript
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
```

### Enhanced Date Field Processing:
```javascript
// List of date fields that should be explicitly handled
const dateFields = [
    'design_approved_date', 'webmaster_assigned_date', 'target_date', 'signed_up_date',
    'contract_start_date', 'date_sent_to_wp_qa', 'date_finished_wp_qa', 'date_finished_wp_bugs',
    'date_sent_to_page_qa', 'date_finished_page_qa', 'date_finished_page_bugs',
    'dns_changed_date', 'date_sent_to_golive_qa', 'date_finished_golive_qa', 'date_finished_golive_bugs'
];

// Also check date fields directly from the form elements to ensure empty dates are captured as null
dateFields.forEach(fieldName => {
    const element = document.querySelector(`[name="${fieldName}"]`);
    if (element) {
        const value = element.value;
        if (value === '' || value === undefined) {
            projectData[fieldName] = null;
        }
    }
});
```

## Testing Instructions

### Test Case 1: Clear an Existing Date
1. Login as manager (manager@ekwa.com / password)
2. Edit an existing project that has dates filled in
3. Clear one or more date fields using the date picker
4. Save the project
5. Verify the date field is now empty (no longer shows the old date)
6. Refresh the page and edit the project again to confirm the date is permanently cleared

### Test Case 2: Clear Issue Text Areas
1. Edit a project with issue text filled in
2. Clear the text in the issues text areas
3. Save the project
4. Verify the text areas are now empty

### Test Case 3: New Project Behavior
1. Create a new project
2. Leave optional date fields empty
3. Save the project
4. Verify the project is created successfully without errors

## Debug Information
- Added console logging to show the data being sent during save operations
- Check browser console for "Project data being saved:" messages to verify null values are included

## Files Modified
- `app.js`: Enhanced `handleProjectSubmit()` function with proper null value handling for date clearing

This fix ensures that when users clear date fields in the project edit form, those changes are properly saved to the database and reflected in the UI.
