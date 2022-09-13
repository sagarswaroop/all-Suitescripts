/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([], function() {

    function pageInit(context) {
        console.log("context",context);
        // var hiddnField = context.form.getField({
        //     id: "custpage_hide_button"
        // });

        // console.log("hiddnField",hiddnField);

        // var scr = "";
        // scr += 'jQuery("#item_addedit").hide();';

        // hiddnField.setValue = "<script>jQuery(function($){require([], function(){" + scr + ";})})</script>"
    }

    function saveRecord(context) {
        
    }

    function validateField(context) {
        
    }

    function fieldChanged(context) {
        
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
        pageInit: pageInit,
        // saveRecord: saveRecord,
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
