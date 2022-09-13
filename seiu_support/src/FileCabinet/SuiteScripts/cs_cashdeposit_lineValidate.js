/**
 *@NApiVersion 1.0
 *@NScriptType ClientScript
 *@author Sagar Kumar
 */
function FieldChanged(type, name, linenum) {
  debugger;
  //  Prompt for additional information,  based on values already selected.
  if (name === "custcol_inv_doc_date_line" && type == "line") {
    var documentDate = nlapiGetCurrentLineItemValue(
      type,
      "custcol_inv_doc_date_line"
    );
    var customer = nlapiGetCurrentLineItemValue(type, "entity");

    var filters = new Array();
    var searchData = [];
    filters.push(new nlobjSearchFilter("type", null, "anyof", "CustInvc"));
    filters.push(new nlobjSearchFilter("mainline", null, "is", "T"));
    filters.push(
      new nlobjSearchFilter("custbody_doc_date", null, "on", documentDate)
    );
    filters.push(
      new nlobjSearchFilter("transaction", "customer", "anyof", customer)
    );

    var columns = new Array();
    columns.push(new nlobjSearchColumn("internalid"));

    var transactionSearch = nlapiSearchRecord(
      "invoice",
      null,
      filters,
      columns
    );

    if (transactionSearch) {
      if (transactionSearch.length) {
        for (var i = 0; i < transactionSearch.length; i++) {
          var soRecord = transactionSearch[i];
          var id = soRecord.getValue("internalid");
          searchData.push(id);
        }
      }
    }

    console.log("searchData is **********", searchData);

    nlapiSetCurrentLineItemValue("line", "custcol_inv_application", searchData);
  }
}
