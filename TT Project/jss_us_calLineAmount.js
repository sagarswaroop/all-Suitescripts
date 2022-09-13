/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([], function() {

    function beforeLoad(context) {
        
    }

    function afterSubmit(context) {
        
    }

    function calLineAmount(context) {
        var saleRecord = context.newRecord;
        var totalLineItems = saleRecord.getLineCount({
            sublistId: "item"
        });

        if(totalLineItems>0){
            for(var i=0;i<totalLineItems;i++){

                try{

                    var itemQuantity = saleRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    });
        
                    log.debug({
                        title: "item value is : "+ itemQuantity,
                        details: itemQuantity
                    });
        
                    var itemRate = saleRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        line: i
                    });
    
                    var terms = saleRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_jss_terms',
                        line: i
                    });
    
                    
                    log.debug({
                        title: "item value is : ",
                        details: [itemRate, terms]
                    });
    
                    var totalSum = itemQuantity * itemRate * terms;
    
                    saleRecord.setSublistValue({
                        sublistId: "item",
                        fieldId: "amount",
                        line: i,
                        value: totalSum
                    });
                }catch(e){
                    alert(e.message);
                    log.debug({
                        title: "Error during get and set value in sales order",
                        details: e.message
                    });
                }
            }
            // saleRecord.commitLine({
            //     sublistId: 'item'
            // });
        }
    }

    return {
        // beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        // afterSubmit: afterSubmit
    }
});
