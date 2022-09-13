/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Sagar kumar
 *@description it will update the amount whatever will unapplied.
 */
define(["N/record"], function(record) {

    function pageInit(context) {
        
    }

    function saveRecord(context) {
        let currRecord = context.currentRecord;
        let remainingAmount = 0;

        log.debug({
            title: "currRecord.type",
            details: currRecord.type
        });

        if(currRecord.type == record.Type.CUSTOMER_PAYMENT){
            log.debug({
                title: "currRecord.type",
                details: currRecord.type
            });

            remainingAmount = currRecord.getValue({
                fieldId: "unapplied"
            });
        }

        if(currRecord.type == record.Type.INVOICE){
            
            log.debug({
                title: "currRecord.type",
                details: currRecord.type
            });

            remainingAmount = currRecord.getValue({
                fieldId: "amountremainingtotalbox"
            });
        }

        if(remainingAmount){
            currRecord.setValue({
                fieldId: "custbody_payment_remain_unapplied",
                value: remainingAmount
            });
        }

        return true;

    }

    return {
        saveRecord: saveRecord
    }
});
