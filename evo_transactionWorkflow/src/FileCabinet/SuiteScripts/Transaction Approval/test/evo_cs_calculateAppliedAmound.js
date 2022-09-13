/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */

 let totalAmount = 0;
define([], function() {

    function pageInit(context) {
        
    }

    function saveRecord(context) {
        
    }

    function validateField(context) {
        
    }

    function fieldChanged(context) {
        debugger;
        console.log("context",context);
        let currRecord = context.currentRecord;
        let sublistName = context.sublistId;
        let invApply = "apply";

        currRecord.getSublistField({
            sublistId: "custpage_sublist_invoices",
            fieldId: invApply,
            // line: number*
        })

        let appliedInvoice = sublistName.getColumn({
            fieldId: "apply"
        })

        if(sublistName == "custpage_sublist_invoices" && appliedInvoice == ""){

        }
    }

    function postSourcing(context) {
        
    }

    function lineInit(context) {
        
    }

    function validateDelete(context) {
        
    }

    function validateInsert(context) {
        
    }

    function validateLine(context) {
        
    }

    function sublistChanged(context) {
        
    }

    return {
        // pageInit: pageInit,
        // saveRecord: saveRecord,
        // validateField: validateField,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});
