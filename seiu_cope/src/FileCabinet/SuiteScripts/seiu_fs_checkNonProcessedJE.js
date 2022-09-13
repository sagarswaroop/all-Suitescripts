/**
 *@NApiVersion 2.1
 *@NScriptType WorkflowActionScript
 */
define([], function() {

    function onAction(scriptContext) {
        let currRecord = scriptContext.newRecord;
        let isErrosExist = 0;
        const penddingApproval = 3;
        const approved = 1;
        let isError = "";

        try {
            log.debug("Check erro process start");
            let totalLines = currRecord.getLineCount({
                sublistId: "line"
            });

            currRecord.getValue({
                fieldId: "custbody_transaction_status",
            })
            var line = currRecord.getSublist({
                sublistId: "line",
              });
          
              var cusstomerColumn = line.getColumn({
                fieldId: "custcol_customer",
              });

            log.debug("in-Action  totalLines"+totalLines);
    
            for (let index = 0; index < totalLines; index++) {
    
                isError = currRecord.getSublistValue({
                    sublistId: "line",
                    fieldId: "custcol_error",
                    line: index
                });
                log.debug("in-Action  isError "+isError);
                if(isError){
                    isErrosExist = 1;
                }else{
                    cusstomerColumn.isDisabled = true;
                }
            }

            if(isError){
                log.debug("Status penddingApproval "+penddingApproval);
                
                currRecord.setValue({
                    fieldId: "custbody_transaction_status",
                    value: penddingApproval,
                    ignoreFieldChange: false
                });

                let value = currRecord.getValue({
                    fieldId: "custbody_transaction_status",
                });

                log.debug("value is "+value);
            }else{
                log.debug("Status approved "+ approved);

                currRecord.setValue({
                    fieldId: "custbody_transaction_status",
                    value: approved,
                    ignoreFieldChange: false
                });

                let value = currRecord.getValue({
                    fieldId: "custbody_transaction_status",
                });
                log.debug("value is "+value);
            }
            log.debug("in-Action  isErrosExist "+isErrosExist);
            log.debug("Check erro process end");
    
            return isErrosExist;
        } catch (error) {
            log.debug({
                title: "error ducing execution",
                details: error
            });
            log.error({
                title: "error ducing execution",
                details: error
            });
        }
    }

    return {
        onAction: onAction
    }
});
