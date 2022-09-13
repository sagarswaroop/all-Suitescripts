/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/record"], function (record) {
  
  function fieldChanged(scriptContext) {
    // This is fieldChanged code.
    debugger;
    log.debug({
      title: "SAtaring",
      details: "",
    });
    var currentRecord = scriptContext.currentRecord;

    if (scriptContext.sublistId == "line") {
      // var currentList = currentRecord.getSublist({
      //     sublistId: "line"
      // });

      var transaction = currentRecord.getCurrentSublistValue({
        sublistId: "line",
        fieldId: "custcol_transaction_link",
      });

      log.debug({
        title: "transaction is ***",
        details: transaction,
      });

      if (transaction) {
        currentRecord.setCurrentSublistValue({
          sublistId: "line",
          fieldId: "custcol_transaction_link",
          value: null,
          ignoreFieldChange: true,
        });
      }
    }

    setDefaultatLine(scriptContext);
  }

  function setDefaultatLine(scriptContext) {

    if(scriptContext.Type == "customtransaction_cd_101"){

      var currentRecord = scriptContext.currentRecord;
      if (scriptContext.sublistId == "line") {
        // var currentList = currentRecord.getSublist({
        //     sublistId: "line"
        // });
  
        var postingGroup = currentRecord.getCurrentSublistValue({
          sublistId: "line",
          fieldId: "custcol_cd_posting_group",
        });
  
        var colDepartment = currentRecord.getCurrentSublistValue({
          sublistId: "line",
          fieldId: "department",
        });
  
        var colEntityType = currentRecord.getCurrentSublistValue({
          sublistId: "line",
          fieldId: "custcol_entity_type",
        });
  
        var localCode = currentRecord.getCurrentSublistValue({
          sublistId: "line",
          fieldId: "cseg_local_code",
        });      
  
        if (!colDepartment) {
          if (postingGroup) {
            currentRecord.setCurrentSublistValue({
              sublistId: "line",
              fieldId: "department",
              value: 101,
            });
  
            currentRecord.setCurrentSublistValue({
              sublistId: "line",
              fieldId: "location",
              value: 103,
            });
  
            if (colEntityType == "Customer") {
              var customer = currentRecord.getCurrentSublistValue({
                sublistId: "line",
                fieldId: "entity",
              });
    
              var customerRecord = record.load({
                type: record.Type.CUSTOMER,
                id: customer,
              });
    
              var localCode = customerRecord.getValue({
                fieldId: "cseg_local_code",
              });
    
              log.debug({
                title: "localCode",
                details: localCode,
              });
    
              currentRecord.setCurrentSublistValue({
                sublistId: "line",
                fieldId: "cseg_local_code",
                value: localCode,
              });
            }
          }
        }
      }
    }
  }

  function validateLine(scriptContext) {
    var currentRecord = scriptContext.currentRecord;
    var colEntityType = currentRecord.getCurrentSublistValue({
      sublistId: "line",
      fieldId: "custcol_entity_type",
    });


    if (colEntityType == "Customer") {
      var customer = currentRecord.getCurrentSublistValue({
        sublistId: "line",
        fieldId: "entity",
      });

      var customerRecord = record.load({
        type: record.Type.CUSTOMER,
        id: customer,
      });

      var localCode = customerRecord.getValue({
        fieldId: "cseg_local_code",
      });

      log.debug({
        title: "localCode",
        details: localCode,
      });

      currentRecord.setCurrentSublistValue({
        sublistId: "line",
        fieldId: "cseg_local_code",
        value: localCode,
      });
    }
    return true;
  }

  return {
    fieldChanged: fieldChanged,
    //validateLine: validateLine
  };
});
