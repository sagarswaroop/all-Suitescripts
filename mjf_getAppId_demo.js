function getGrantAppId(type){
  alert("getGrantAppId is called");
  var grantExtId =  nlapiGetFieldValue('custbody_mjf_grant_application_id');
    if(grantExtId){
      var filters = new Array();
      filters.push(new nlobjSearchFilter('externalid', null, 'anyof', grantExtId));
      var columns = new Array();
      columns.push(new nlobjSearchColumn('custrecord_application_id'));
      var searchResults = nlapiSearchRecord('customrecord_cseg_npo_grant_segm', null, filters, columns);
      console.log(searchResults);
      if(searchResults.length > 0){
        for(var record in searchResults){
            console.log(record);
            var objSerachResult = searchResults[record];
            var appId = objSerachResult.getValue('custrecord_application_id');
            nlapiSetFieldValue('custbody_mjf_application_id',appId,false, false);
        }
      return true;
    }
  }
  else{
    alert("APPLICATION GRANT ID Can't be Empty");
    return false;
  }
}



