/**
 * this script is use for get data of "leave information form " and set the values to employ "Human Resurese"
 */

function setFieldOnApproval(){
    var leaveRecord = nlapiGetNewRecord();
    var requesterID = leaveRecord.getFieldValue('custrecord_seiu_delegate_for');
    var employRecrod = nlapiLoadRecord('employee',requesterID);
    employRecrod.setFieldValue('custentity_nsts_gaw_delegate_from',leaveRecord.getFieldValue('custrecord_seiu_delegate_from'));
    employRecrod.setFieldValue("custentity_nsts_gaw_delegate_to",leaveRecord.getFieldValue("custrecord_sei_delegate_to"));
    employRecrod.setFieldValue("custentity_nsts_gaw_delegate_emp",leaveRecord.getFieldValue('custrecord_seiu_approval_delegate'));
    var empREcordId = nlapiSubmitRecord(employRecrod);

    nlapiLogExecution("DEBUG","delegate name"+empREcordId);
}