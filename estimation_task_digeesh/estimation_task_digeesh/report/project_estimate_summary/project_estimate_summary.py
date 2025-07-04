# Copyright (c) 2025, d and contributors
# For license information, please see license.txt
import frappe
from frappe import _

def execute(filters=None):
    filters = filters or {}
    return get_columns(), get_data(filters)

def get_columns():
    return [
        {"label": _("Name (Estimation ID)"), "fieldname": "name", "fieldtype": "Data"},
        {"label": _("Customer Name"), "fieldname": "customer_name", "fieldtype": "Data"},
        {"label": _("Project ID"), "fieldname": "project_id", "fieldtype": "Data"},
        {"label": _("Project Name"), "fieldname": "project_name", "fieldtype": "Data"},
        {"label": _("Expected Start Date"), "fieldname": "expected_start_date", "fieldtype": "Date"},
        {"label": _("Expected End Date"), "fieldname": "expected_end_date", "fieldtype": "Date"},
        {"label": _("Total No of Employees"), "fieldname": "total_no_of_employees", "fieldtype": "Int"},
        {"label": _("Total Estimated Amount"), "fieldname": "total_estimated_amount", "fieldtype": "Currency"},
        {"label": _("Status (Workflow State)"), "fieldname": "workflow_state", "fieldtype": "Data"},
        {"label": _("Created On"), "fieldname": "creation", "fieldtype": "Datetime"},
        {"label": _("Created By"), "fieldname": "owner", "fieldtype": "Data"},
    ]

def get_data(filters):
    conditions = ""
    values = {}

    if filters.get("project_id"):
        conditions += " AND dig.project_id = %(project_id)s"
        values["project_id"] = filters["project_id"]

    if filters.get("customer_name"):
        conditions += " AND dig.customer_name LIKE %(customer_name)s"
        values["customer_name"] = f"%{filters['customer_name']}%"

    if filters.get("from_date"):
        conditions += " AND dig.expected_start_date >= %(from_date)s"
        values["from_date"] = filters["from_date"]

    if filters.get("to_date"):
        conditions += " AND dig.expected_end_date <= %(to_date)s"
        values["to_date"] = filters["to_date"]

    if filters.get("status"):
        conditions += " AND dig.workflow_state = %(status)s"
        values["status"] = filters["status"]

    return frappe.db.sql(f"""
        SELECT 
            dig.name,
            dig.customer_name,
            dig.project_id,
            dig.project_name,
            dig.expected_start_date,
            dig.expected_end_date,
            dig.total_no_of_employees,
            dig.total_estimated_amount,
            dig.workflow_state,
            dig.creation,
            dig.owner
        FROM `tabEstimation form` dig
        WHERE 1=1 {conditions}
        ORDER BY dig.creation DESC
    """, values, as_dict=True)
