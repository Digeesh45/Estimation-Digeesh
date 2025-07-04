# Copyright (c) 2025, d and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
from frappe.utils import nowdate

class Estimationform(Document):
    def on_update(self):
        if self.workflow_state == "Final Approved" and not self.approved_on:
            self.approved_on = nowdate()
