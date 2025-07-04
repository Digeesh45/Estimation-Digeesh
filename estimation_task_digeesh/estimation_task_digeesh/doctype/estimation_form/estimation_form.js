frappe.ui.form.on('Estimation form', {
    refresh: function(frm) {
        if (frappe.user_roles.includes('Estimation Approver')) {
            frm.set_df_property('created_on', 'hidden', 0);
        } else {
            frm.set_df_property('created_on', 'hidden', 1);
        }

        if (frm.doc.workflow_state === 'Approved' || frm.doc.workflow_state === 'Final Approved') {
            frm.set_df_property('approved_on', 'hidden', 0);
        } else {
            frm.set_df_property('approved_on', 'hidden', 1);
        }

        if (frm.doc.docstatus === 0 && frm.perm[0].submit) {
            frm.page.clear_primary_action();
            frm.page.set_primary_action('Submit', function() {
                show_submission_dialog(frm, 'Submit');
            });
        }
    },

    validate: function(frm) {
        calculate_totals(frm);
    },

    before_workflow_action: function(frm) {
        var action = frm.selected_workflow_action;
        if (action && action.toLowerCase() === 'approve') {
            frappe.validated = false;
            show_submission_dialog(frm, action, function(confirmed) {
                if (confirmed) {
                    frm.save().then(function() {
                        frm.workflow_action(action);
                    });
                }
            });
            return false;
        }
    }
});

frappe.ui.form.on('Estimation Item', {
    length: function(frm, cdt, cdn) {
        calculate_estimation_amount(frm, cdt, cdn);
    },
    width: function(frm, cdt, cdn) {
        calculate_estimation_amount(frm, cdt, cdn);
    },
    no_of_employees: function(frm, cdt, cdn) {
        calculate_estimation_amount(frm, cdt, cdn);
    },
    rate: function(frm, cdt, cdn) {
        calculate_estimation_amount(frm, cdt, cdn);
    },
    estimation_items_remove: function(frm) {
        calculate_totals(frm);
    }
});

function calculate_estimation_amount(frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    if (row.length && row.width && row.no_of_employees && row.rate) {
        var area = row.length * row.width;
        var amount = (area / row.no_of_employees) * row.rate;
        frappe.model.set_value(cdt, cdn, 'estimation_amount', amount);
    }
    calculate_totals(frm);
}

function calculate_totals(frm) {
    var total_employees = 0;
    var total_amount = 0;

    if (frm.doc.estimation_items) {
        for (var i = 0; i < frm.doc.estimation_items.length; i++) {
            var row = frm.doc.estimation_items[i];
            total_employees += row.no_of_employees || 0;
            total_amount += row.estimation_amount || 0;
        }
    }

    frm.set_value('total_no_of_employees', total_employees);
    frm.set_value('total_estimated_amount', total_amount);
}

function show_submission_dialog(frm, action, callback) {
    var dialog_title = '';
    if (action === 'Submit') {
        dialog_title = 'Confirm Submission';
    } else {
        dialog_title = 'Confirm ' + action;
    }

    var d = new frappe.ui.Dialog({
        title: dialog_title,
        fields: [
            {
                fieldname: 'customer_name',
                fieldtype: 'Data',
                label: 'Customer Name',
                read_only: 1,
                default: frm.doc.customer_name
            },
            {
                fieldname: 'project_id',
                fieldtype: 'Data',
                label: 'Project ID',
                read_only: 1,
                default: frm.doc.project_id
            },
            {
                fieldname: 'project_name',
                fieldtype: 'Data',
                label: 'Project Name',
                read_only: 1,
                default: frm.doc.project_name
            },
            {
                fieldname: 'total_no_of_employees',
                fieldtype: 'Int',
                label: 'Total No of Employees',
                read_only: 1,
                default: frm.doc.total_no_of_employees
            },
            {
                fieldname: 'total_estimated_amount',
                fieldtype: 'Currency',
                label: 'Total Estimated Amount',
                default: frm.doc.total_estimated_amount
            }
        ],
        primary_action_label: 'Confirm',
        primary_action: function(values) {
            frm.set_value('total_estimated_amount', values.total_estimated_amount);
            if (action === 'Submit') {
                frm.save().then(function() {
                    frm.submit();
                });
            } else {
                if (callback) {
                    callback(true);
                }
            }
            d.hide();
        },
        secondary_action_label: 'Review',
        secondary_action: function() {
            frm.set_value('workflow_state', 'Draft');
            frm.save();
            if (callback) {
                callback(false);
            }
            d.hide();
        }
    });

    d.show();
}
