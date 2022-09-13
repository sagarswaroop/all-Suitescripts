function SetEmoNoteValue(){
    var empRecord = nlapiGetNewRecord();
    var empName = empRecord.getFieldValue('entityid');
    var empId = empRecord.getId();
    var empNote = empRecord.getFieldValue('comments');

    var ntoeValues = new Array();

    ntoeValues["empName"]= empName;
    ntoeValues["empId"] = empId;  
    ntoeValues["empNote"] = empNote;
    
    nlapiSetRedirectURL('SUITELET','customscript_jss_emp_note_update','customdeploy_jss_emp_note_update',null,ntoeValues);
}