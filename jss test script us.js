/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(["N/record"], function(record) {

    function beforeLoad(context) {
        var empRecord = context.newRecord;
       empRecord.getValue({
        fieldId: "comments"
    })
    }

    function beforeSubmit(context) {
        
    }

    function afterSubmit(context) {
        var empRecord = context.newRecord; 
        empRecord.setValue({
            fieldId: "comments",
            value: "comment is changes and succefully submited",
            ignoreFieldChange: false
        })
    }

    return {
        beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    }
});
