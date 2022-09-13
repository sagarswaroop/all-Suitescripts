function empExpenseStatus(){
    var expneseLimit = parseInt(nlapiGetContext().getSetting('SCRIPT','custscript_emp_expense_status'));
    var expenseRecrod = nlapiGetNewRecord();
    var expEntity = expenseRecrod.getFieldValue('entity');

    var today = new Date();
    var aMonthAgo  = nlapiAddDays(today, -30);

    var filters = new Array();
    filters.push(new nlobjSearchFilter('employee', null, 'is', expEntity));
    filters.push(new nlobjSearchFilter('trandate', null, 'within', aMonthAgo,today));
    filters.push(new nlobjSearchFilter('mainline',null, 'is', 'T'));

    var columns = new Array();
    columns.push(new nlobjSearchColumn('entity', null,'count'));

    var searchResults = nlapiSearchRecord('expensereport', null, filters, columns);

    var totalExpense = parseInt(searchResults[0].getValue(searchResults[0]));

    var checkFrequent = '';
    if(totalExpense>=expneseLimit){
        checkFrequent = 'Infrequent';
    }
    else{
        checkFrequent = 'Frequent';
    }

    var recEmployee = nlapiLoadRecord('employee',expEntity);
    recEmployee.setFieldValue('comments',checkFrequent);
    var empId = nlapiSubmitRecord(recEmployee);
    return empId;
}