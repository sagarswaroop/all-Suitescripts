/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([
    'N/crypto',
    'N/record'
], function(crypto,record) {

    function beforeLoad(context) {
        
    }

    function beforeSubmit(context) {
        
    }

    function checkSalesPassword(context) {
        var recordObj = context.newRecord;
        var password = recordObj.getValue({
            fieldId: "custbody_card_password"
        });

        log.debug({
            title: "password by getValue",
            details: password
        });

        var options = {
            recordType: record.Type.SALES_ORDER,
            recordId: 138171,
            fieldId: 'custbody_card_password',
            sublistId: 'item',
            line: 0,
            value: 'theenteredpassword'
        };
        if (crypto.checkPasswordField(options)) {
             log.debug('True');
        } else {
            log.debug('False');
        }

    }

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: checkSalesPassword
    }
});
