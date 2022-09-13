function beforeSubmitSalesForm(type){
    var bodyDeparment = nlapiGetFieldValue("department");
   var newId = nlapiGetRecordId();
    var totalItems = nlapiGetLineItemCount("item");
    for(var i = 1; i<=totalItems; i++){
        nlapiSetLineItemValue("item","department", i , 3);
    }
}


// function beforeSubmitSalesForm(type){
//     var bodyDeparment = nlapiGetFieldText("department");
//    var newId = nlapiGetRecordId();
// //    var newType = nlapiGetRecordType();
// //     nlapiLogExecution('DEBUG','<Before Submit Script> type:'+type+', RecordType: '+newType+', Id:'+newId, "bodyDeparment"+bodyDeparment);
//     var totalItems = nlapiGetLineItemCount("item");
//     // var lineDepartment = nlapiGetLineItemValue("item","department_display",1);
//     // nlapiLogExecution('DEBUG',"linedeaprtmet ******** "+lineDepartment,lineDepartment+" "+totalItems);
//     // for(var i = 1; i<=totalItems; i++){
//     //     nlapiSetCurrentLineItemValue("item","department", i , 3);
//     // }
//     nlapiSetLineItemValue("item","department", 1 , 3);
//     // nlapiSetCurrentLineItemValue("item","department_display",bodyDeparment,false,false);

//     // nlapiCommitLineItem("item");
// }
