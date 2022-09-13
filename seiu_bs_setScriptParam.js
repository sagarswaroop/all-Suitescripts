function setScriptParam(request, response) {
    var isRun = request.getParameter('');
    nlapiLogExecution('DEBUG','isRun is ****',isRun);
    nlapiGetContext().setSetting('SCRIPT','	custscript_us_seiu_initial_script', 'no');
    
}