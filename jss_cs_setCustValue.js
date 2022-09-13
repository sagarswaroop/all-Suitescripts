function update_Field(type,name){
    var invId = nlapiGetFieldValue('entity');
    console.log("invdoid fjldjfldjkfjldfjldf"+invId);

      var invoiceData = nlapiLoadRecord('Invoice',invId);
      
      if(invoiceData.fields.createdfrom){
          //createdfrom is sales order internal id.
        var saleOrderData = nlapiLoadRecord('salesorder',invoiceData.fields.createdfrom);
        var salesNo = saleOrderData.fields.tranid +" "+saleOrderData.fields.entityname;
        nlapiSetFieldValue('custrecord_so_number',salesNo, false, false);
      }
      else{
        nlapiSetFieldValue('custrecord_so_number','No Sale Order', false, false);
      }  
}