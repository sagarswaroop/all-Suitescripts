function enableWorkflow(Request, response){
    if(Request.getMethod()=="GET"){
        var nlobjForm = nlapiCreateForm("Enable Approval Process", false );
        var enableSO = nlobjForm.addField("custpage_jss_so_process", "checkbox", "SALES ORDER APPROVAL PROCESS");
        var enableInv = nlobjForm.addField("custpage_jss_invoice_process","checkbox", " INVOICE APPROVAL PROCESS");
        nlobjForm.addSubmitButton("Submit");

        response.writePage(nlobjForm);
    }
    else{
        var reponseForm = nlapiCreateForm("Enable Approval Process", false );

        var enableSOVal = reponseForm.addField("custpage_jss_so_process_val", "checkbox", "SALES ORDER APPROVAL PROCESS");
        enableSOVal.setDefaultValue(Request.getParameter("custpage_jss_so_process"));
        enableSOVal.setDisplayType("inline");
        
        var enableInvVal = reponseForm.addField("custpage_jss_invoice_process_val","checkbox", " INVOICE APPROVAL PROCESS");
        enableInvVal.setDefaultValue(Request.getParameter("custpage_jss_invoice_process"));
        enableInvVal.setDisplayType("inline");

        var paramterCheckbox =  nlapiGetContext().getSetting('SCRIPT','custscript_enable_sales_order');
        nlapiGetContext().setSetting('SCRIPT','custscript_enable_sales_order',Request.getParameter("custpage_jss_so_process"));

        nlapiLogExecution("DEBUG","custpage_jss_so_process"+Request.getParameter("custpage_jss_so_process"), "enableInvVal"+Request.getParameter("custpage_jss_so_process"));
        response.writePage(reponseForm);
    }
}