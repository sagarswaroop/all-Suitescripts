/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
define(['N/record','N/search'], function(record,search) {

    function getInputData() {

        var savedSerach = search.create({
            type: "vendorbill",
            filters:
            [
               ["type","anyof","VendBill"], 
               "AND", 
               ["internalid","anyof","214114","216383"], 
               "AND", 
               ["mainline","is","T"]
            ],
            columns:
            [
               search.createColumn({name: "entity", label: "Name"}),
               search.createColumn({name: "internalid", label: "Internal ID"})
            ]
         });
         log.debug("savedSerach result count",savedSerach);
        return savedSerach;
    }

    function map(context) {
        var data = JSON.parse(context.value);
        log.debug("data result ",data);

        var billId = data.id;

        log.debug({
            title: "billId",
            details: billId
        });
    
        var paymentRecord = record.transform({
            fromType: record.Type.VENDOR_BILL,
            fromId: 214114,
            toType: record.Type.VENDOR_PAYMENT
        });

        var paymenetRecId = paymentRecord.save();

        log.debug({
            title: "paymenetRecId",
            details: paymenetRecId
        });

        context.write(data.id,paymenetRecId);

    }

    function reduce(context) {
        
    }

    function summarize(summary) {
        log.debug({
            title: "summary",
            details: summary
        });
    }

    return {
        getInputData: getInputData,
        map: map,
        // reduce: reduce,
        summarize: summarize
    }
});
