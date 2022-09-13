function setDefault(type) {
  nlapiLogExecution("DEBUG", "hasValue is ","type"+type);
  if(type = "create"){
    var sendURL = nlapiResolveURL('SUITELET',"customscript_seiu_bsl_check_request","customdeploy_seiu_bsl_check_request");
    var getResponse = nlapiRequestURL(sendURL);
    var resData = getResponse.getBody();
    nlapiLogExecution("DEBUG", "getResponse**** " +resData);
    if(resData == 'yes'){
      nlapiSetFieldValue("custpage_2663_entity_file_format", "13");
    }

  }
  
}
