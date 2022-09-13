/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript
 */
define([
  "N/record",
  "N/search",
  "N/url",
  "N/cache",
  "N/runtime",
  "N/format",
], function (record, search, url, cache, runtime, format) {
  function onAction(context) {
    log.debug("onAction", "Start");

    var invoiceId = 7;
    var paymentId = 9;

    log.debug("onAction", "context.type=" + context.type);
    if (context.type === "button") {
      try {
        var inLineCount = context.newRecord.getLineCount({
          sublistId: "line",
        });

        var objData = getJEData(context, inLineCount);

        var inNewTransId = context.newRecord.getValue({
          sublistId: "line",
          fieldId: "custbody_cust_bal_je_link",
        });

        if (inNewTransId) {
          var updatedNewTransId = record.submitFields({
            type: record.Type.JOURNAL_ENTRY,
            id: inNewTransId,
            values: {
              approvalstatus: 2,
            },
            options: {
              ignoreMandatoryFields: true,
            },
          });

          log.debug("status updated Joural entery id is" + updatedNewTransId);

          for (var index = 0; index < inLineCount; index++) {
            var lineData = objData.line[index];

            log.debug(" Transaction type is ", lineData.transactionType);

            if (lineData.transactionType == invoiceId) {
              log.debug("Invoice apply process start", index);
              var inJournalExist = false;
              var isInvoiceApplyied = false;
              var customerpayment = record.transform({
                fromType: record.Type.INVOICE,
                fromId: lineData.transactionNo,
                toType: record.Type.CUSTOMER_PAYMENT,
                isDynamic: false,
                defaultValues: Object,
              });

              inJournalExist = isTransactionExistinPayment(
                customerpayment,
                inNewTransId,
                "credit",
                lineData.creditAmount
              );

              if (inJournalExist) {
                isInvoiceApplyied = isTransactionExistinPayment(
                  customerpayment,
                  lineData.transactionNo,
                  "apply",
                  lineData.creditAmount
                );
              }

              if (isInvoiceApplyied) {
                var transactionNo = customerpayment.save({
                  enableSourcing: true,
                  ignoreMandatoryFields: true,
                });

                // update invoice remaining amount(custom).
                var invoice = record.load({
                  type: record.Type.INVOICE,
                  id: lineData.transactionNo,
                  isDynamic: true,
                });

                invoice.save({
                  enableSourcing: true,
                  ignoreMandatoryFields: true,
                });

                log.debug("Saved Invoice Payment no is " + transactionNo);

                // if(transactionNo>0){
                //   record.delete({
                //     type: record.Type.CUSTOMER_PAYMENT,
                //     id: transactionNo,
                //   });
                // }
              } else {
                log.debug("Some issue while apply invoice against payment");
              }
              log.debug("Invoice apply process end", index);
            } else if (lineData.transactionType == paymentId) {
              log.debug("Payment update process start", index);

              var oldCustomerPayment = record.load({
                type: record.Type.CUSTOMER_PAYMENT,
                id: lineData.transactionNo,
              })

              // log.debug(
              //   "new payment for customer is " +
              //     oldCustomerPayment.getValue("customer")
              // );

              // var customerPayment = record.create({
              //   type: record.Type.CUSTOMER_PAYMENT,
              //   // isDynamic: true,
              //   defaultValues: {
              //     "entity": oldCustomerPayment.getValue("customer"),
              //     "subsidiary":oldCustomerPayment.getValue("subsidiary")
              //   },
              // });

              // customerPayment.setValue({
              //   fieldId: "aracct",
              //   value: oldCustomerPayment.getValue("aracct")
              // });

              // customerPayment.setValue({
              //   fieldId: "custbody23",
              //   value: oldCustomerPayment.getValue("custbody23")
              // });
              

              
              customerPayment = oldCustomerPayment;

              // var isPaymentApplied = isTransactionExistinPayment(
              //   customerPayment,
              //   lineData.transactionNo,
              //   "credit",
              //   lineData.debitAmount
              // );

              // if (isPaymentApplied) {
              //   log.debug("isPaymentApplied "+isPaymentApplied);

                var isJEApplied = isTransactionExistinPayment(
                  customerPayment,
                  inNewTransId,
                  "apply",
                  lineData.debitAmount
                );

                if (isJEApplied) {
                  log.debug("isJEApplied "+isJEApplied);

                  // if(customerPayment>0){
                    var transactionNo = customerPayment.save({
                      enableSourcing: true,
                      ignoreMandatoryFields: true,
                    });
                  // }

                  log.debug({
                    title: "updatedPaymentId new no",
                    details: transactionNo,
                  });
                } else {
                  log.debug("Some issue while apply against payment");
                }
              // }

              // oldCustomerPayment.save({
              //   ignoreMandatoryFields: true
              // })
              log.debug("Payment update process end", index);
            } else {
              continue;
            }
          }

          context.newRecord.setValue({
            fieldId: "custbody_cust_bal_je_link",
            value: inNewTransId,
          });

          context.newRecord.setValue({
            fieldId: "custbodycust_bal_error_message",
            value: "",
          });
        }
      } catch (innerError) {
        log.debug("onAction-innerError", innerError);
        context.newRecord.setValue({
          fieldId: "custbodycust_bal_error_message",
          value: innerError.message,
        });
        // context.newRecord.setValue({
        //   fieldId: "custbody_cust_bal_je_link",
        //   value: "",
        // });
      }
    }
    log.debug("onAction", "End");
  }

  function isTransactionExistinPayment(
    customerPayment,
    transaction,
    transactionSublitId,
    transactionAmount
  ) {
    var transactionIndex = customerPayment.findSublistLineWithValue({
      sublistId: transactionSublitId,
      fieldId: "doc",
      value: transaction,
    });

    log.debug("Transaction exist in payment ", transactionIndex);

    if (transactionIndex != -1) {
      customerPayment.setSublistValue({
        sublistId: transactionSublitId,
        fieldId: "amount",
        line: transactionIndex,
        value: transactionAmount,
      });

      customerPayment.setSublistValue({
        sublistId: transactionSublitId,
        fieldId: "apply",
        line: transactionIndex,
        value: true,
      });

      return true;
    } else {
      return false;
    }
  }

  return {
    onAction: onAction,
  };
});

//get all data of current record (Small balance).
function getJEData(context, inLineCount) {
  var objData = {
    body: {
      id: context.newRecord.id,
      custbody_seiu_sml_scrn_bk_acc: context.newRecord.getValue({
        fieldId: "custbody_seiu_sml_scrn_bk_acc",
      }),
      subsidiary: context.newRecord.getValue({
        fieldId: "subsidiary",
      }),
      trandate: context.newRecord.getValue({
        fieldId: "trandate",
      }),
      custbody23: context.newRecord.getValue({
        fieldId: "custbody23",
      }), // hader posting group.
      memo: context.newRecord.getValue({
        fieldId: "memo",
      }),

      approver: context.newRecord.getValue({
        fieldId: "custbody_department_approver",
      }),

      tranid: context.newRecord.id,
      jeType: context.newRecord.getValue({
        fieldId: "custbody_je_type1",
      }),
    },
    line: [],
  };

  for (var i = 0; i < inLineCount; i++) {
    // if (
    //   context.newRecord.getValue({
    //     sublistId: "line",
    //     fieldId: "custbody_cust_bal_je_link",
    //     line: i,
    //   })
    // ) {
    //   objData.line.push(null);
    //   continue;
    // }

    objData.line.push({
      custcol_customer: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_customer",
      }),
      col_entity: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_cust_bal_vendor",
      }),
      entityType: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_cust_bal_entity_type",
      }),

      debitAmount: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_sml_bal_amn_deb",
      }),
      creditAmount: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_sml_bal_amn_cre",
      }),
      department: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "department",
      }),
      lineMemo: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_seiu_sml_bal_memo_line",
      }),
      cseg1: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "cseg1",
      }),
      cseg2: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "cseg2",
      }),
      cseg3: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "cseg3",
      }),
      cseg4: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "cseg4",
      }),
      cseg_local_code: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "cseg_local_code",
      }),
      location: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "location",
      }),

      attachment: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_primary_attach",
      }),

      transactionNo: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_transactiontype",
      }),

      pctType: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_col_pct_type",
      }),

      docDate: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_document_date",
      }),

      account: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "account",
      }),

      transactionType: context.newRecord.getSublistValue({
        sublistId: "line",
        line: i,
        fieldId: "custcol_cust_bal_tran_type",
      }),
    });
  }
  // log.debug("onAction objData", objData);
  return objData;
}
