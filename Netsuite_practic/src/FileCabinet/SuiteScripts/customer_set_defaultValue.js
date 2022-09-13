/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
 define([], ()=>{

    function fieldChanged(context) {
        debugger;
        const currRecord = context.currentRecord;
        const fieldId = context.fieldId;


        if(fieldId == "salesrep"){

            const salesRep = currRecord.getValue({
                fieldId: "salesrep"
            });
    
            console.log("sales rep is"+salesRep);
    
            log.debug({
                title: "sales rep",
                details: salesRep
            })
    
            if(salesRep == 2644){
                currRecord.setValue({
                    fieldId: "custentity_company_size",
                    value: 10,
                    ignoreFieldChange: false
                });
            }else if(salesRep != 2644){
                currRecord.setValue({
                    fieldId: "custentity_company_size",
                    value: 25,
                    ignoreFieldChange: false
                });
            }
        }

    }

    function saveRecord(context) {
        
    }

    function validateField(context) {
        
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
