/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([], function() {

    function saveRecord(context) {
    var currRecord  = context.currentRecord;

    var unappliedAmnt = currRecord.getValue({
        fieldId: "unapplied"
    });

    if(unappliedAmnt){
        // currRecord.setValue({
        //     fieldId: ,
        //     value: number | Date | string | array | boolean*,
        //     ignoreFieldChange: boolean
        // })
    }

    }

    return {
        // pageInit: pageInit,
        saveRecord: saveRecord,
        // validateField: validateField,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});
