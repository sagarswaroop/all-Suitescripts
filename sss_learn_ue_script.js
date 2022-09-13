function afterSbumitEmpRecrod(){
    var empRecord = nlapiGetNewRecord();
    nlapiLogExecution("DEBUG","check employe recrod deprtment ",empRecord.getFieldValue("department"));
    nlapiLogExecution("DEBUG","check employe recrod email ",empRecord.getFieldValue("email"));

    var address = nlapiCreateRecord("addressbook");
    
    address.setFieldValue("phone"," (999) 999-9999");
    address.setFieldValue("country","India");
    address.setFieldValue("city","Hariyana");
    nlapiSubmitRecord(address);
}