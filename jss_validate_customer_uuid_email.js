function check_UUID(type){
  nlapiLogExecution('DEBUG','Type in UUID is', type);
  var uuid = nlapiGetFieldValue("custentity_customer_uuid");
  if(uuid){
    	 var filters = new Array();
          filters.push(new nlobjSearchFilter('custentity_customer_uuid', null, 'equalto', uuid));

          var columns = new Array();
          columns.push(new nlobjSearchColumn('custentity_customer_uuid'));

          var searchResults = nlapiSearchRecord('customer', null, filters, columns);
          if(searchResults){
            alert("UUID must be unique");
            nlapiSetFieldValue('custentity_customer_uuid', "", false, false);
            return false;
          }
          else{
            return true;
          }
  }
  return true;
}

function sendEmail(type){
  var alertMembers = ['sagar.kumar@streamssolution.com','kapil@streamssolutions.com'];
  nlapiSendEmail(-5,alertMembers,`demo subject`,"body of the mail",null,null,searchResults);
}