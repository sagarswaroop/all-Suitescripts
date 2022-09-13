/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       04 Mar 2021     Sagar Kumar
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord PurchaseOrder 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
 function disablePoLineValue(type, name){
    var empRole = parseInt(nlapiGetContext().getRole());
  if(name){
    if(empRole == 1037 || empRole == 1075 || empRole == 1039){
       nlapiDisableLineItemField('item','amount',true);
       }
  }
}
