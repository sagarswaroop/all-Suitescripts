/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/ui/serverWidget'], function(serverWidget) {

    function beforeLoad(context) {
        var hiddnField =  context.form.addField({
            id: "custpage_hide_button",
            label: "not shown- hidden",
            type: serverWidget.FieldType.INLINEHTML
        });

        var scr = "";
        scr += 'jQuery("#item_addedit").hide();';

        hiddnField.defaultValue = "<script>jQuery(function($){require([], function(){" + scr + ";})})</script>"
    }

    return {
        beforeLoad: beforeLoad
    }
});
