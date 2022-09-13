/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */

var appliedTotalInvoice = 0;
define([], function () {
  function fieldChanged(context) {
    log.debug("Field change start (applied and unapplied");
    var currRecord = context.currentRecord;
    var sublistName = context.sublistId;
    var invApply = "apply";
    var isappliedColumn = context.fieldId;
    var isappliedCalled = false;
    var invoiceList = "custpage_sublist_invoices";
    
    var islinesAvaialbe = currRecord.getLineCount({
      sublistId: invoiceList,
    });

    if(islinesAvaialbe){
      debugger;
    // console.log("context", context);

    var isapply = currRecord.getCurrentSublistValue({
      sublistId: invoiceList,
      fieldId: invApply,
    });

    invoiceAmountDue = currRecord.getCurrentSublistValue({
      sublistId: invoiceList,
      fieldId: "amtdue",
    });

    var payment = currRecord.getCurrentSublistValue({
      sublistId: invoiceList,
      fieldId: "payment",
    });

    if (sublistName == invoiceList && isappliedColumn == "apply") {
      // console.log("isInvoiceRow after change list"+ isInvoiceRow);
      log.debug("isapply ", isapply);
      log.debug("invoiceAmountDue is ", invoiceAmountDue);

      if (isapply) {
        currRecord.setCurrentSublistValue({
          sublistId: invoiceList,
          fieldId: "payment",
          value: invoiceAmountDue,
        });
        manuplatePaymentAmount(currRecord, invoiceAmountDue, "+");
      } else {
        manuplatePaymentAmount(currRecord, payment, "-");
        var invTotalLines = currRecord.getLineCount({
          sublistId: invoiceList,
        });

        if (invTotalLines > 0) {
          var appliedAmmount = 0;
          for (var index = 0; index < invTotalLines; index++) {
            // var isgetApplied = currRecord.getSublistValue({
            //   sublistId: invoiceList,
            //   fieldId: "apply",
            //   line: index
            // })

            // if(isgetApplied){

            var getAppliedPayment = currRecord.getSublistValue({
              sublistId: invoiceList,
              fieldId: "payment",
              line: index,
            });

            var currentIndex = currRecord.getCurrentSublistIndex({
              sublistId: invoiceList,
            });

            if (currentIndex == index) {
              var currentPayment = currRecord.getCurrentSublistValue({
                sublistId: invoiceList,
                fieldId: "payment",
              });
              appliedAmmount += currentPayment;
            } else {
              appliedAmmount += getAppliedPayment;
            }

            // }
          }
        }
        currRecord.setValue({
          fieldId: "custbody_amount",
          value: 0,
          ignoreFieldChange: false,
        });

        currRecord.setValue({
          fieldId: "custbody_amount",
          value: appliedAmmount,
          ignoreFieldChange: false,
        });
        currRecord.setCurrentSublistValue({
          sublistId: invoiceList,
          fieldId: "payment",
          value: "",
        });
      }
      isappliedCalled = true;
    }
    if (isappliedCalled == false && isapply == true) {
      if (sublistName == invoiceList && isappliedColumn == "payment") {
        console.log("payment is called");

        if (invoiceAmountDue != payment) {
          if (payment > invoiceAmountDue) {
            currRecord.setCurrentSublistValue({
              sublistId: invoiceList,
              fieldId: "payment",
              value: invoiceAmountDue,
            });
          }

          if (payment < invoiceAmountDue) {
            var invTotalLines = currRecord.getLineCount({
              sublistId: invoiceList,
            });

            if (invTotalLines > 0) {
              var appliedAmmount = 0;
              for (var index = 0; index < invTotalLines; index++) {
                var isgetApplied = currRecord.getSublistValue({
                  sublistId: invoiceList,
                  fieldId: "apply",
                  line: index,
                });

                if (isgetApplied) {
                  var getAppliedPayment = currRecord.getSublistValue({
                    sublistId: invoiceList,
                    fieldId: "payment",
                    line: index,
                  });

                  var currentIndex = currRecord.getCurrentSublistIndex({
                    sublistId: invoiceList,
                  });

                  if (currentIndex == index) {
                    var currentPayment = currRecord.getCurrentSublistValue({
                      sublistId: invoiceList,
                      fieldId: "payment",
                    });
                    appliedAmmount += currentPayment;
                  } else {
                    appliedAmmount += getAppliedPayment;
                  }
                }
              }
            }
            // var paymentAmount = currRecord.getValue({
            //   fieldId: "custbody_amount"
            // });

            // paymentAmount = paymentAmount - invoiceAmountDue;
            // paymentAmount = paymentAmount + payment;
            currRecord.setValue({
              fieldId: "custbody_amount",
              value: 0,
              ignoreFieldChange: false,
            });

            currRecord.setValue({
              fieldId: "custbody_amount",
              value: appliedAmmount,
              ignoreFieldChange: false,
            });
          }
        }
        // var linePayment  = currRecord.getCurrentSublistValue({ sublistId: invoiceList, fieldId: "payment" });

        // log.debug("isapply ",isapply);
        // log.debug("invoiceAmountDue is ",invoiceAmountDue);

        // if(isapply){
        //   if(linePayment)
        //   manuplatePaymentAmount(currRecord,invoiceAmountDue,"+");
        // }else{
        //   manuplatePaymentAmount(currRecord,invoiceAmountDue,"-");
        // }
      }
    }
    }
  }

  function manuplatePaymentAmount(record, lineAmount, operator) {
    var paymentAmount = 0;

    paymentAmount = record.getValue({
      fieldId: "custbody_amount",
    });

    // var paymentAmount = parseFloat(paymentAmountText);

    if (operator == "+") {
      paymentAmount = paymentAmount + parseFloat(lineAmount);
    } else {
      paymentAmount = paymentAmount - parseFloat(lineAmount);
    }

    log.debug("paymentAmount", paymentAmount);

    record.setValue({
      fieldId: "custbody_amount",
      value: paymentAmount,
      ignoreFieldChange: false,
    });
  }

  function validateLine(context) {
    var currnetLinePayment = context.currentRecord.getCurrentSublistValue({
      sublistId: invoiceList,
      fieldId: "payment",
    });

    var currnetLineAmountDue = context.currentRecord.getCurrentSublistValue({
      sublistId: invoiceList,
      fieldId: "amtdue",
    });

    if (currnetLinePayment) {
      if (currnetLinePayment < currnetLineAmountDue) {
        var headerTotaAmount = context.currentRecord.getValue({
          fieldId: "custbody_amount",
        });

        headerTotaAmount = headerTotaAmount - currnetLineAmountDue;
        headerTotaAmount = headerTotaAmount + currnetLinePayment;

        context.currentRecord.setValue({
          fieldId: "custbody_amount",
          value: headerTotaAmount,
          ignoreFieldChange: false,
        });
        return true;
      } else if (currnetLinePayment > currnetLineAmountDue) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  return {
    // pageInit: pageInit,
    // validateLine: validateLine,
    fieldChanged: fieldChanged,
  };
});
