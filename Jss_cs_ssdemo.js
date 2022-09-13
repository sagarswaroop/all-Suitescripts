function newSavedSearch(){
    var uuid = nlapiGetFieldValue("custentity_customer_uuid");
    console.log(uuid);
    // var searchResults = nlapiSearchRecord('customer', "customsearchcustomergeneralview");
    var filters = new Array();
    filters.push(new nlobjSearchFilter('customer', null, 'equal to', uuid));

    var columns = new Array();
    columns.push(new nlobjSearchColumn('custentity_customer_uuid'));

    var searchResults = nlapiSearchRecord('customer', null, filters, columns);
    var x = 0;
}