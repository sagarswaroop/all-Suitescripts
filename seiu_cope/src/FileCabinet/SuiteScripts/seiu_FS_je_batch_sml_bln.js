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
    // if (context.type === "button") {
      try {
        var inLineCount = context.newRecord.getLineCount({
          sublistId: "line",
        });
        log.debug("onAction", "inLineCount=" + inLineCount);

        //get all data of current record (Customer balance).
        var objData = getJEData(context, inLineCount);

        log.debug("in-action smallBalance", objData);

        // //Create Je for lines.
        // createJEforSmlBal(smallbalanceDataObj, context, inLineCount);

        //create Je for every line

        try {
          var objNewTransRec = record.create({
            type: record.Type.JOURNAL_ENTRY,
            isDynamic: true,
          });

          if (objData.body["subsidiary"])
            objNewTransRec.setValue({
              fieldId: "subsidiary",
              value: objData.body["subsidiary"],
            });
          if (objData.body["memo"])
            objNewTransRec.setValue({
              fieldId: "memo",
              value: objData.body["memo"],
            });
          if (objData.body["trandate"])
            objNewTransRec.setValue({
              fieldId: "trandate",
              value: objData.body["trandate"],
            });
          // custbody23 = posting group
          if (objData.body["custbody23"])
            objNewTransRec.setValue({
              fieldId: "custbody23",
              value: objData.body["custbody23"],
            });

          if (objData.body["jeType"])
            objNewTransRec.setValue({
              fieldId: "custbody_je_type1",
              value: objData.body["jeType"],
            });

          // if (objData.line[i]["attachment"])
          //   objNewTransRec.setValue({
          //     fieldId: "custbody_prim_attach",
          //     value: objData.line[i]["attachment"],
          //   });

          // objNewTransRec.setValue({
          //   fieldId: "approvalstatus",
          //   value: 2,
          // });

          if (objData.body["tranid"])
            objNewTransRec.setValue({
              fieldId: "custbody_je_source_record",
              value: objData.body["tranid"],
            });

          for (var i = 0; i < inLineCount; i++) {
            context.newRecord.selectLine({
              sublistId: "line",
              line: i,
            });

            if (!objData.line[i]) {
              log.debug("onAction", "skip line i=" + i);
              continue;
            }

            objNewTransRec.selectNewLine({
              sublistId: "line",
            });

            // small balance debit amount (payment).
            if (objData.line[i]["debitAmount"]) {
              //1st line of JE
              if (objData.body["custbody_seiu_sml_scrn_bk_acc"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "account",
                  value: objData.body["custbody_seiu_sml_scrn_bk_acc"],
                });

              if (objData.line[i]["debitAmount"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "credit",
                  value: objData.line[i]["debitAmount"],
                });

              if (objData.line[i]["col_entity"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "entity",
                  value: objData.line[i]["col_entity"],
                });

              if (objData.line[i]["entityType"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "custcol_seiu_record_type",
                  value: objData.line[i]["entityType"],
                });

              setJeDefaultValues(objData, objNewTransRec, i);

              //2nd line of JE
              var accountNo = getTransactionAccount(
                objData.line[i].transactionNo,
                record.Type.CUSTOMER_PAYMENT,
                "aracct"
              );

              objNewTransRec.setCurrentSublistValue({
                sublistId: "line",
                fieldId: "account",
                value: accountNo, // line level account.
              });

              if (objData.line[i]["debitAmount"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "debit",
                  value: objData.line[i]["debitAmount"],
                });

              if (objData.line[i]["custcol_customer"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "entity",
                  value: objData.line[i]["custcol_customer"],
                });

              if (objData.line[i]["custcol_customer"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "custcol_seiu_record_type",
                  value: "Customer",
                });

              setJeDefaultValues(objData, objNewTransRec, i);
            }

            // small Balance amount credit (invoice).
            if (objData.line[i]["creditAmount"]) {
              isInvoice = true;
              isPayment = false;

              // 1st line debit.
              if (objData.body["custbody_seiu_sml_scrn_bk_acc"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "account",
                  value: objData.body["custbody_seiu_sml_scrn_bk_acc"],
                });
              if (objData.line[i]["creditAmount"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "debit",
                  value: objData.line[i]["creditAmount"],
                });

              if (objData.line[i]["col_entity"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "entity",
                  value: objData.line[i]["col_entity"],
                });

              if (objData.line[i]["entityType"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "custcol_seiu_record_type",
                  value: objData.line[i]["entityType"],
                });

              setJeDefaultValues(objData, objNewTransRec, i);

              //2nd line credit.
              var accountNo = getTransactionAccount(
                objData.line[i].transactionNo,
                record.Type.INVOICE,
                "account"
              );
              objNewTransRec.setCurrentSublistValue({
                sublistId: "line",
                fieldId: "account",
                value: accountNo,
              });

              if (objData.line[i]["creditAmount"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "credit",
                  value: objData.line[i]["creditAmount"],
                });

              if (objData.line[i]["custcol_customer"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "entity",
                  value: objData.line[i]["custcol_customer"],
                });

              if (objData.line[i]["custcol_customer"])
                objNewTransRec.setCurrentSublistValue({
                  sublistId: "line",
                  fieldId: "custcol_seiu_record_type",
                  value: "Customer",
                });

              setJeDefaultValues(objData, objNewTransRec, i);
            }
          }

          var inNewTransId = objNewTransRec.save({
            enableSourcing: true,
            ignoreMandatoryFields: true,
          });

          if (inNewTransId) {
            for (var index = 0; index < inLineCount; index++) {
              var lineData = objData.line[index];

              log.debug(" Transaction type is ", lineData.transactionType);

              if ((lineData.transactionType == invoiceId)) {
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

              } else if ((lineData.transactionType == paymentId)) {
                log.debug("Payment update process start", index);

                var customerPayment = record.load({
                  type: record.Type.CUSTOMER_PAYMENT,
                  id: lineData.transactionNo,
                  isDynamic: false,
                  // defaultValues: Object
                });

                var isJEApplied = isTransactionExistinPayment(
                  customerPayment,
                  inNewTransId,
                  "apply",
                  lineData.debitAmount
                );

                if (isJEApplied) {
                  var updatedPaymentId = customerPayment.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true,
                  });

                  log.debug({
                    title: "updatedPaymentId",
                    details: updatedPaymentId,
                  });
                } else {
                  log.debug("Some issue while apply against payment");
                }
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
          context.newRecord.setValue({
            fieldId: "custbody_cust_bal_je_link",
            value: "",
          });
        }
      } catch (error) {
        log.debug("onAction-error", error);
      }
    // }
    log.debug("onAction", "End");
  }

  function getTransactionAccount(
    transactionNumber,
    transactionType,
    accountId
  ) {
    var transactionObj = record.load({
      type: transactionType,
      id: transactionNumber,
      // isDynamic: true,
      // defaultValues: Object
    });

    var accountNo = transactionObj.getValue({
      fieldId: accountId,
    });

    return accountNo;
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

function setJeDefaultValues(objData, objNewTransRec, i) {
  if (objData.line[i]["lineMemo"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "memo",
      value: objData.line[i]["lineMemo"],
    });
  if (objData.line[i]["department"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "department",
      value: objData.line[i]["department"],
    });
  if (objData.line[i]["location"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "location",
      value: objData.line[i]["location"],
    });
  if (objData.line[i]["cseg3"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "cseg3",
      value: objData.line[i]["cseg3"],
    });
  if (objData.line[i]["cseg1"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "cseg1",
      value: objData.line[i]["cseg1"],
    });
  if (objData.line[i]["cseg2"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "cseg2",
      value: objData.line[i]["cseg2"],
    });
  if (objData.line[i]["cseg4"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "cseg4",
      value: objData.line[i]["cseg4"],
    });
  if (objData.line[i]["cseg_local_code"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "cseg_local_code",
      value: objData.line[i]["cseg_local_code"],
    });
  if (objData.line[i]["transactionNo"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "custcol_document_number",
      value: objData.line[i]["transactionNo"],
    });
  if (objData.line[i]["docDate"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "custcol_document_date",
      value: objData.line[i]["docDate"],
    });
  if (objData.line[i]["pctType"])
    objNewTransRec.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "custcol_je_pct_type",
      value: objData.line[i]["pctType"],
    });

  objNewTransRec.commitLine({
    sublistId: "line",
  });
}
