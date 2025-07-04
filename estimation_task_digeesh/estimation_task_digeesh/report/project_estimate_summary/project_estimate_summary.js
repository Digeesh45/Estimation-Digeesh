// Copyright (c) 2025, d and contributors
// For license information, please see license.txt
frappe.query_reports["Project Estimate Summary"] = {
    filters: [
        {
            "fieldname": "project_id",
            "label": "Project ID",
            "fieldtype": "Data",
            "reqd": 0
        },
        {
            "fieldname": "customer_name",
            "label": "Customer Name",
            "fieldtype": "Data",
            "reqd": 0
        },
        {
            "fieldname": "from_date",
            "label": "From Date",
            "fieldtype": "Date",
            "reqd": 0
        },
        {
            "fieldname": "to_date",
            "label": "To Date",
            "fieldtype": "Date",
            "reqd": 0
        },
        {
            "fieldname": "status",
            "label": "Status",
            "fieldtype": "Select",
            "options": ["", "Approved", "Draft", "Final Approval", "Rejected"],
            "reqd": 0
        }
    ]
};