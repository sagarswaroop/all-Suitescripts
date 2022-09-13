function validateGrantId(){
    // alert("validateGrantId function is called");
    var grantExtId =  nlapiGetFieldValue('custbody_mjf_grant_application_id');
    if(grantExtId){
        getGrantAppId(grantExtId);
        return true;
    }
    else{
        alert("APPLICATION GRANT ID Can't be Empty");
        return false;
    }
    
}



function getGrantAppId(grantExtId){
    alert("getGrantAppId is called");
      var grantExtId =  nlapiGetFieldValue('custbody_mjf_grant_application_id');
      var filters = new Array();
      filters.push(new nlobjSearchFilter('externalid', null, 'anyof', grantExtId));
      var columns = new Array();
      columns.push(new nlobjSearchColumn('custrecord_application_id'));

      var searchResults = nlapiSearchRecord('customrecord_cseg_npo_grant_segm', null, filters, columns);
    console.log(searchResults);
      var grantAppId =  searchResults[0].rawValues[0].value;
    nlapiSetFieldValue('custbody_mjf_application_id',grantAppId,false, false);
  }



//   function validateGrantId(){
//     // alert("validateGrantId function is called");
//     var grantExtId =  nlapiGetFieldValue('custbody_mjf_grant_application_id');
//     if(grantExtId){
//         var isget = getGrantAppId(grantExtId);
//         return isget;
//     }
    
// }



// function getGrantAppId(grantExtId){
//     alert("getGrantAppId is called");
//       // var grantExtId =  nlapiGetFieldValue('custbody_mjf_grant_application_id');
//       var filters = new Array();
//       filters.push(new nlobjSearchFilter('externalid', null, 'anyof', grantExtId));
//       var columns = new Array();
//       columns.push(new nlobjSearchColumn('custrecord_application_id'));

//       var searchResults = nlapiSearchRecord('customrecord_cseg_npo_grant_segm', null, filters, columns);
//     console.log(searchResults);
//     if(searchResults>0){
//       var grantAppId =  searchResults[0].rawValues[0].value;
//       nlapiSetFieldValue('custbody_mjf_application_id',grantAppId,false, false);
//       return true;
//     }
//     else{
//       return false;
//     }

//   }