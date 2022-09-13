function sendEmail(type){
    nlapiSendEmail(2644,"sagar.kumar@streamssolution.com","scheduled script subject","scheduled script body of the mail");
    nlapiLogExecution("DEBUG","type value is "+type,type);
}