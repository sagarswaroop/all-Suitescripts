function isInitialRun(request, response) {
    var url = request.getURL();
    // var hasValue = nlapiGetContext().getSetting('SCRIPT','custscript_seiu_initial_script');
    nlapiLogExecution("DEBUG", "url is "+url,"url");
    // var count = 0;
    // var isRun = request.getParameter('firstRun');
    // if(hasValue == 'yes'){
    //     nlapiGetContext().setSetting('SCRIPT','	custscript_seiu_initial_script', 'no');
    //     var test = nlapiGetContext().getSetting('SCRIPT','custscript_seiu_initial_script');
    //     nlapiLogExecution("DEBUG", "custscript_seiu_initial_script " +test,"type");
    //     response.write(hasValue);
    // } 
    
}