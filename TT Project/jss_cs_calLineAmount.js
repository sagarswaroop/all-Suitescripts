/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([], function() {

    function calLineAmount(context) {
        debugger;
        var saleRecord = context.currentRecord;
        // var totalLineItems = saleRecord.getLineCount({
        //     sublistId: "item"
        // });

        // if(totalLineItems>0){
        //     for(var i=0;i<totalLineItems;i++){

                try{

                    var itemQuantity = saleRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });

        
                    log.debug({
                        title: "item value is : "+ itemQuantity,
                        details: itemQuantity
                    });
        
                    var itemRate = saleRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate'
                    });
    
                    var terms = saleRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_jss_terms'
                    });
    
                    
                    log.debug({
                        title: "item value is : ",
                        details: [itemRate, terms]
                    });
    
                    var totalSum = itemQuantity * itemRate * terms;
    
                    saleRecord.setCurrentSublistValue({
                        sublistId: "item",
                        fieldId: "amount",
                        value: totalSum
                    });
                }catch(e){
                    alert(e.message);
                    log.debug({
                        title: "Error during get and set value in sales order",
                        details: e.message
                    });
                }

                return true;
            // }
            // saleRecord.commitLine({
            //     sublistId: 'item'
            // });
        // }
    }

    function pageInit(context) {
        console.log("script running");
        debugger;
    }

    function saveRecord(context) {
        
    }

    function validateField(context) {
        
    }

    function fieldChanged(context) {
        console.log("script running");
        debugger;
        if(context.sublistId == "item"){
            debugger;
            calLineAmount(context);
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
        // if(context.sublistId = "item"){
            calLineAmount(context);
            return true;
        // }
    }

    function sublistChanged(context) {
        // var currRecord = context.currentRecord;
        if(context.sublistId = "item"){
            calLineAmount(context);
            return true;
        }
    }

    return {
        // pageInit: pageInit,
        // saveRecord: saveRecord,
        // validateField: validateField,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});
