/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget'], function(serverWidget) {

    function onRequest(context) {
        var form = serverWidget.createForm({
            title : 'Select Transaction'
        });
        var field = form.addField({
            id : 'custpage_customers',
            type : serverWidget.FieldType.SELECT,
            label : 'Customers',
            source : 'customer' //record type id
        });

        log.debug("selected field is",field);

        context.response.write(form);
    }

    return {
        onRequest: onRequest
    }
});
