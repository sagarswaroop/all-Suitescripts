/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 *@author Sagar Kumar
 *@description 
 1. validate and error out if the amount is greater than $50 except more than $50 item and cope non-Qualified item.
 2. validate and error out for a date if the receive date in items is more than the header Transmitted Date.
 3. Hide the account column of items in the line tab.
 */

 define(['N/format', 'N/error','N/runtime','N/ui/serverWidget'], function (format, error,runtime,serverWidget) {

    function beforeSubmit(context){
        //validate the amount for all line items.
       checkItemsAmount(context);
        
        //validate the daate of all line items.
        DateValidation(context);

    }

    function hideItemsAcount(context) {
        // var myUser = runtime.getCurrentUser();
        var objForm = context.form;

        // var userRole = myUser.role;

        var objSublist = objForm.getSublist({
            id: 'line'
        })

        var objFieldAccount = objSublist.getField({
            id: 'account'
        });

        objFieldAccount.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.HIDDEN
        });
    }

    function checkItemsAmount(context) {
        log.debug({
          title: "script start",
        });

        var copeMembershiForm = context.newRecord;
        var IndContributionMorethanItem = 850;
        var IndContributionLessthanItem = 849;
        var nonQualifingfundItme = 852;
        var totalLines = copeMembershiForm.getLineCount({ sublistId: "line" });
        log.debug("totalLines", totalLines);
    
        for (var lineNo = 1; lineNo <= totalLines; lineNo++) {
          var errorLine = lineNo + 1;
          var lineItem = copeMembershiForm.getSublistValue({
            sublistId: "line",
            fieldId: "custcol_membership_item",
            line: lineNo,
          });
    
          var lineAmount = copeMembershiForm.getSublistValue({
            sublistId: "line",
            fieldId: "amount",
            line: lineNo,
          });

          log.debug("lineAmount",lineAmount);
    
          if (lineItem == IndContributionLessthanItem && lineAmount > 50) {
            var myCustomError = error.create({
              name: "Item Amount",
              message: "Amount at line " + errorLine + " can not be more than 50$.",
            });
            throw myCustomError.message;
          } if (lineItem == IndContributionMorethanItem && lineAmount < 50) {
            var myCustomError = error.create({
              name: "Item Amount",
              message: "Amount at line " + errorLine + " can not be less than 50$.",
            });
            throw myCustomError.message;
          }else{
            continue;
          }
    
          // if (lineItem != IndContributionMorethanItem && lineAmount > 50) {
            
          // }
        }
      }

    function DateValidation(context) {

        var CopeMemForm = context.newRecord;

        var lines = CopeMemForm.getLineCount({ sublistId: 'line' });

        var TransmitDate = CopeMemForm.getValue({
            fieldId: 'custbody_date_transmitted'
        });

        // check tranmit date field not empty

        if (!TransmitDate) {
            var myCustomError = error.create({

                name: 'DATE TRANSMITTED',

                message: '"Date Transmitted" can not be Blank.',

                notifyOff: true

            });

            throw myCustomError.message;
        }


        // check line level itmes recive date
        for (var i = 0; i < lines; i++) {
            var lineNo = i + 1;
            var recivedDate = CopeMemForm.getSublistValue({
                sublistId: 'line',
                fieldId: 'custcol_service_date',
                line: i

            });

            if (recivedDate <= TransmitDate) {
                // log.debug({
                //     title: 'enter in recive date'
                // });
                continue;
            }
            else {
                var myCustomError = error.create({

                    name: 'RECEIVED DATE',

                    message: 'Please fill the correct "Receive Date for' + lineNo +" Item",

                    notifyOff: true

                });

                throw myCustomError.message;
            }
        }
    }
    return {
        beforeSubmit: beforeSubmit,
        beforeLoad: hideItemsAcount

    }
});