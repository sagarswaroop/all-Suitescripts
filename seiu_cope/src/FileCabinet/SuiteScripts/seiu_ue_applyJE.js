/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/search','N/record'], function (search,record) {
  function beforeLoad(context) {}

  function beforeSubmit(context) {
   
  }

  function customerPaymentCreditapply(customerpayment, columnId,currJERef) {
    var creditLines = customerpayment.getLineCount({
      sublistId: columnId,
    });

    if (creditLines > 0) {
      for (var index = 0; index < creditLines; index++) {
        var jeRefnum = customerpayment.getSublistValue({
          sublistId: columnId,
          fieldId: "refnum",
          line: index,
        });

        log.debug("jeRefnum is" + jeRefnum + " currJERef " + currJERef);

        if (jeRefnum == currJERef) {
          customerpayment.setSublistValue({
            sublistId: columnId,
            fieldId: "apply",
            line: index,
            value: true,
          });

          return true;
        } else {
          continue;
        }
      }
    }
  }

  function serachAccountType(accountId) {
    let accountType = "";
    var accountSearchObj = search.create({
      type: "account",
      filters: [["internalid", "anyof", accountId]],
      columns: [search.createColumn({ name: "type", label: "Account Type" })],
    });
    var searchResultCount = accountSearchObj.runPaged().count;
    log.debug("accountSearchObj result count", searchResultCount);
    accountSearchObj.run().each(function (result) {
      accountType = result.getValue({ name: "type" });
      log.debug("accountType " + accountType);
      // .run().each has a limit of 4,000 results
      return true;
    });

    return accountType;
  }

  function customerPaymentInvoiceapply(customerpayment, invTraNo) {
    var linecount = customerpayment.getLineCount({
      sublistId: "apply",
    });

    if (linecount > 0) {
      for (var i = 0; i < linecount; i++) {
        var invRef = customerpayment.getSublistValue({
          sublistId: "apply",
          fieldId: "refnum",
          line: i,
        });

        log.debug("invRef is" + invRef + " invTraNo " + invTraNo);

        if (invRef == invTraNo) {
          customerpayment.setSublistValue({
            sublistId: "apply",
            fieldId: "apply",
            line: i,
            value: true,
          }); // apply is the field ID of column field "APPLY". In the UI, this can be seen under the APPLY subtab > Invoices Sublist > "APPLY" column field when creating a new CUSTOMER PAYMENT record. This script line will put a CHECKMARK on the Invoice to where the Customer Payment will be APPLIED.

          var cpId = customerpayment.save({
            enableSourcing: true,
            ignoreMandatoryFields: false,
          });

          log.debug("saved cusstomer payment is", cpId);

          var deletedRecNo = record.delete({
            type: record.Type.CUSTOMER_PAYMENT,
            id: cpId,
          });

          log.debug("deletedRecNo is", deletedRecNo);

          break;
        } else {
          continue;
        }
      }
    }
  }

  function afterSubmit(context) {
    log.debug("JE apply process Start");
    let currentRecord = context.newRecord;
    const approved = 2;
    const recrodId = context.newRecord.id;

    let status = currentRecord.getValue({
      fieldId: "approvalstatus",
    });

    let sourceRecord = currentRecord.getValue({
      fieldId: "custbody_je_source_record",
    });

    let recordNumber = currentRecord.getText({
        fieldId: "tranid",
      });

    if (sourceRecord && status == approved) {
      let lineCounts = currentRecord.getLineCount({
        sublistId: "line",
      });

      if (lineCounts > 0) {
        for (let index = 0; index < lineCounts; index++) {
          // const element = array[index];
          let credit = currentRecord.getSublistValue({
            sublistId: "line",
            fieldId: "credit",
            line: i,
          });

          if (credit) {
            let accountId = currentRecord.getSublistValue({
              sublistId: "line",
              fieldId: "account",
              line: i,
            });

            let transactionNo = currentRecord.getSublistValue({
                sublistId: "line",
                fieldId: "custcol_document_number",
                line: i,
              });

            let isAccountType = serachAccountType(accountId);

            if (isAccountType == "AcctRec") {
                var isJournalExist = false;
                var invTraNo = context.newRecord
                  .getCurrentSublistText({
                    sublistId: "line",
                    fieldId: "custcol_transactiontype",
                  })
                  .replace("Invoice #", "");

                log.debug("invTraNo", invTraNo);

                var customerpayment = record.transform({
                  fromType: record.Type.INVOICE,
                  fromId: transactionNo,
                  toType: record.Type.CUSTOMER_PAYMENT,
                  isDynamic: false,
                  defaultValues: Object,
                });

                log.debug({
                  title: "customerpayment",
                  details: customerpayment,
                });

                isJournalExist = customerPaymentCreditapply(
                  customerpayment,
                  "credit",
                  recordNumber
                );
                if (isJournalExist) {
                    var cpId = customerpayment.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: false,
                      });
            
                      log.debug("saved cusstomer payment is", cpId);
            
                      var deletedRecNo = record.delete({
                        type: record.Type.CUSTOMER_PAYMENT,
                        id: cpId,
                      });
            
                      log.debug("deletedRecNo is", deletedRecNo);
                //   customerPaymentInvoiceapply(customerpayment, recordNumber);
                }
                log.debug("JE is applied sccessfuly");
            }
          }
        }
      }
    }
  }

  return {
    // beforeLoad: beforeLoad,
    // beforeSubmit: beforeSubmit,
    afterSubmit: afterSubmit
  };
});
