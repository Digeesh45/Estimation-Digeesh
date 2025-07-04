<h3>Quotation Approved</h3>

<p>Dear {{ doc.customer_name }},</p>

<p>Your quotation for the project <strong>{{ doc.project_name }}</strong> has been <strong>approved</strong>.</p>

<ul>
  <li><strong>Project ID:</strong> {{ doc.project_id }}</li>
  <li><strong>Total Estimated Amount:</strong> ₹{{ doc.total_estimated_amount }}</li>
  <li><strong>Expected Start Date:</strong> {{ doc.expected_start_date }}</li>
  <li><strong>Expected End Date:</strong> {{ doc.expected_end_date }}</li>
</ul>

<p><strong>Project Manager:</strong> {{ frappe.get_fullname(doc.owner) }}</p>

<p>Thank you,<br>Your Estimation Team</p>
