/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 *@author Sagar kumar
 *@description :
 - set header amount and line level account default.
 - validate the credit amount and debit amount on add line according to invoice and payment for customer
 - set PCT deault for first time
 */
define(["N/record", "N/search"], function (record, search) {
  function pageInit(context) {
    //set header amount and line level account default.
    // context.currentRecord.setValue({
    //   fieldId: "total",
    //   value: 1000,
    //   ignoreFieldChange: true,
    // });

    if (context.mode == "edit") {
      console.log("mode is " + context.mode);
      context.currentRecord.setValue({
        fieldId: "custbodycust_bal_error_message",
        value: "",
      });
    }

    disableFieldTransactionLink(context);
  }

  function DiableLine(context) {
    let transRecord = context.currentRecord;
    const sublistFields = {
      customer: "custcol_customer",
      entityName: "custcol_cust_bal_vendor",
      debitAmt: "custcol_sml_bal_amn_deb",
      creditAmnt: "custcol_sml_bal_amn_cre",
      department: "department",
      memo: "custcol_seiu_sml_bal_memo_line",
      cseg1: "cseg1",
      cseg2: "cseg2",
      cseg3: "cseg3",
      cseg4: "cseg4",
      localCode: "cseg_local_code",
      location: "location",
      attahment: "custcol_primary_attach",
      pctType: "custcol_col_pct_type",
      docDate: "custcol_document_date",
      transactionno: "custcol_transactiontype",
      transactionLink: "custcol_transaction_link",
    };

    let totalLines = transRecord.getLineCount({
      sublistId: "line",
    });

    if (totalLines > 0) {
      for (let lineNo = 0; lineNo < totalLines; lineNo++) {
        let jeLink = transRecord.getSublistValue({
          sublistId: "line",
          fieldId: "custcol_transaction_link",
          line: lineNo,
        });

        let sublist = transRecord.getSublist({
          sublistId: "line",
        });

        if (jeLink) {
          console.log("jeLink *****************", jeLink);

          for (const field in sublistFields) {
            let sublitCoulmn = sublist.getColumn({
              fieldId: sublistFields[field],
            });

            sublitCoulmn.isDisabled = true;
          }
        } else {
          for (const field in sublistFields) {
            let sublitCoulmn = sublist.getColumn({
              fieldId: sublistFields[field],
            });

            sublitCoulmn.isDisabled = false;
          }
        }
      }
    }
  }

  function disableFieldTransactionLink(context) {
    var line = context.currentRecord.getSublist({
      sublistId: "line",
    });

    var transactionLink = line.getColumn({
      fieldId: "custcol_transactiontype",
    });

    transactionLink.isDisabled = true;
  }

  function setLineTransactions(scriptContext) {
    debugger;
    var lines = "line";
    var smlBalRecord = scriptContext.currentRecord;
    var totalLines = smlBalRecord.getLineCount({
      sublistId: "line",
    });

    if (totalLines > 0) {
      for (let index = 0; index < totalLines; index++) {
        var nativeTranssactionNo = smlBalRecord.getSublistValue({
          sublistId: lines,
          fieldId: "custcol_transactiontype",
          line: index,
        });

        log.debug("nativeTranssactionNo", custcol_transactiontype);

        if (nativeTranssactionNo) {
          smlBalRecord.setSublistValue({
            sublistId: lines,
            fieldId: "custpage_trans",
            line: index,
          });
        }
      }
    }
  }

  function saveRecord(context) {}

  // testing purpos.
  function validateField(context) {
    let currentTransaction = context.currentRecord;
    let currentTransactionNo = currentTransaction.getCurrentSublistValue({
      sublistId: "line",
      fieldId: "custcol_sml_bal_amn_deb",
    });

    if (currentTransactionNo > 5) {
      alert("pelase enter below 5");
    }
  }

  function showPaymentAlert(context) {
    // redirect.toSuitelet({
    //   scriptId: 1151,
    //   deploymentId: 1,
    //   parameters: {'custparam_test':'helloWorld'}
    //  });
    //  nlapiSetRedirectURL('SUITELET','customscript_seiu_show_trans_for_cbje','customdeploy_seiu_show_trans_for_cbje');

    debugger;
    let currRecord = context.currentRecord;

    let currentCustomer = currRecord.getCurrentSublistValue({
      sublistId: "line",
      fieldId: "custcol_customer",
    });

    let currentPostingGroup = currRecord.getValue({
      sublistId: "line",
      fieldId: "custbody23",
    });

    if (currentCustomer) {
      try {
        let datatoAlert = serachPayment(currentCustomer, currentPostingGroup);

        if (datatoAlert) {
          var id = prompt(datatoAlert);

          if (id) {
            try {
              currRecord.setCurrentSublistValue({
                sublistId: "line",
                fieldId: "custcol_transactiontype", // transaction no column
                value: parseInt(id),
                // ignoreFieldChange: true,
              });
            } catch (e) {
              alert("Pleae Enter correct 'ID' from the list");
            }
          }
        } else {
          alert("No data found for selected 'Customer'.");
        }

        currRecord.setCurrentSublistValue({
          sublistId: "line",
          fieldId: "custcol_check_payments",
          value: "",
          ignoreFieldChange: true,
        });
      } catch (error) {
        log.debug({
          title: "error during show list is ",
          details: error,
        });
      }
    }

    function serachPayment(customer, postingGroup) {
      var viewData =
        "Please enter the 'ID' to add Transaction\n" +
        "ID \t Date \tTransaction No. \t Memo \t Unapplied/Due Amount.\n";
      var transactionSearchObj = search.create({
        type: "transaction",
        filters: [
          ["type", "anyof", "CustPymt", "CustInvc"],
          "AND",
          ["status", "anyof", "CustPymt:C", "CustInvc:A"],
          "AND",
          ["amountremainingisabovezero", "is", "T"],
          "AND",
          ["name", "anyof", customer],
          "AND",
          ["custbody23", "anyof", postingGroup],
        ],
        columns: [
          search.createColumn({ name: "internalid", label: "Internal ID" }),
          search.createColumn({ name: "trandate", label: "Date" }),
          search.createColumn({ name: "tranid", label: "Document Number" }),
          search.createColumn({ name: "type", label: "Type" }),
          search.createColumn({ name: "entity", label: "Name" }),
          search.createColumn({
            name: "amountremaining",
            label: "Amount Remaining",
          }),
          search.createColumn({ name: "memomain", label: "Memo (Main)" }),
        ],
      });
      var searchResultCount = transactionSearchObj.runPaged().count;
      log.debug("transactionSearchObj result count", searchResultCount);
      transactionSearchObj.run().each(function (result) {
        // .run().each has a limit of 4,000 results

        var amount = result.getValue("amountremaining");
        var transationNo = result.getValue("tranid");
        var internalid = result.getValue("internalid");
        var date = result.getValue("trandate");
        var memo = result.getValue("memomain");

        viewData +=
          internalid +
          "  \t   " +
          date +
          "  \t   " +
          transationNo +
          "  \t   " +
          memo +
          "  \t   " +
          amount +
          "\n";

        return true;
      });

      /*
     transactionSearchObj.id="customsearch1653635189715";
     transactionSearchObj.title="Custom Transaction Search 2 (copy)";
     var newSearchId = transactionSearchObj.save();
     */

      // var customerpaymentSearchObj = search.create({
      //   type: "customerpayment",
      //   filters: [
      //     ["type", "anyof", "CustPymt"],
      //     "AND",
      //     ["status", "anyof", "CustPymt:C"],
      //     "AND",
      //     ["amountremainingisabovezero", "is", "T"],
      //     "AND",
      //     ["name", "anyof", customer],
      //     "AND",
      //     ["custbody23", "anyof", postingGroup],
      //   ],
      //   columns: [
      //     search.createColumn({ name: "trandate", label: "Date" }),
      //     search.createColumn({ name: "tranid", label: "Document Number" }),
      //     search.createColumn({ name: "type", label: "Type" }),
      //     search.createColumn({ name: "entity", label: "Name" }),
      //     search.createColumn({
      //       name: "amountremaining",
      //       label: "Amount Remaining",
      //     }),
      //   ],
      // });

      // var viewData = "Id \t Transaction No. \t Unapplied/Due Amount.\n";

      // var searchResultCount = customerpaymentSearchObj.runPaged().count;
      // log.debug("customerpaymentSearchObj result count", searchResultCount);
      // customerpaymentSearchObj.run().each(function (result) {
      //   // .run().each has a limit of 4,000 results

      //   var amount = result.getValue("amountremaining");
      //   var transationNo = result.getValue("tranid");

      //   viewData +=
      //     Id + "  \t   " + transationNo + "  \t   " + amount + "\n";

      //   return true;
      // });

      if (searchResultCount > 0) {
        return viewData;
      } else {
        return "";
      }
    }
  }

  function fieldChanged(context) {
    let isheaderFieldDisabled = false;
    let currRecord = context.currentRecord;
    let sublistName = context.sublistId;
    let sublistFieldName = context.fieldId;

    // Disable header values on set customer value at line level.
    if (sublistName === "line" && sublistFieldName === "custcol_customer") {
      if (!isheaderFieldDisabled) {
        disableHeaderProcessType(context);
        isheaderFieldDisabled = true;
      }

      debugger;

      const currentCustomer = currRecord.getCurrentSublistValue({
        sublistId: sublistName,
        fieldId: sublistFieldName,
      });

      const customerRecord = record.load({
        type: record.Type.CUSTOMER,
        id: currentCustomer,
      });

      let localCode = customerRecord.getValue({
        fieldId: "cseg_local_code",
      });

      console.log("lcoa code is " + localCode);

      currRecord.setCurrentSublistValue({
        sublistId: sublistName,
        fieldId: "cseg_local_code",
        value: localCode,
        //  ignoreFieldChange: true
      });
    }

    if (
      sublistName === "line" &&
      sublistFieldName === "custcol_check_payments"
    ) {
      // show alert for payments with Amount
      showPaymentAlert(context);
    }

    // if customer transaction change.
    if (
      sublistName === "line" &&
      sublistFieldName === "custcol_transactiontype"
    ) {
      let currentTransaction = context.currentRecord;
      let accountNo = 0;

      // get text of transaction/
      var transactionName = currentTransaction.getCurrentSublistText({
        sublistId: "line",
        fieldId: "custcol_transactiontype",
      });

      //get value of transaction no
      let currentTransactionNo = currentTransaction.getCurrentSublistValue({
        sublistId: context.sublistId,
        fieldId: sublistFieldName,
      });

      // set error message null on transaction no change.
      currentTransaction.setValue({
        fieldId: "custbodycust_bal_error_message",
        value: "",
      });

      //
      console.log("context.line", context.line);
      if (transactionName.search("PYT") == -1) {
        // transactionLink.isDisabled = true;
        // debitAmt.isDisabled = true;
        // creditAmnt.isDisabled = false;
        setUnappliedAmount(
          currentTransaction,
          record.Type.INVOICE,
          "amountremainingtotalbox"
        );

        accountNo = getTransactionAccount(
          currentTransactionNo,
          record.Type.INVOICE,
          "account"
        );

        currentTransaction.setCurrentSublistValue({
          sublistId: "line",
          fieldId: "custcol_sml_bal_amn_deb",
          value: "",
        });

        currentTransaction.setCurrentSublistValue({
          sublistId: "line",
          fieldId: "custcol_cust_bal_tran_type",
          value: 7,
        });
      } else {
        // transactionLink.isDisabled = false;
        // debitAmt.isDisabled = false;
        // creditAmnt.isDisabled = true;
        setUnappliedAmount(
          currentTransaction,
          record.Type.CUSTOMER_PAYMENT,
          "unapplied"
        );
        accountNo = getTransactionAccount(
          currentTransactionNo,
          record.Type.CUSTOMER_PAYMENT,
          "aracct"
        );

        currentTransaction.setCurrentSublistValue({
          sublistId: "line",
          fieldId: "custcol_cust_bal_tran_type",
          value: 9,
        });

        currentTransaction.setCurrentSublistValue({
          sublistId: "line",
          fieldId: "custcol_sml_bal_amn_cre",
          value: "",
        });
      }

      currentTransaction.setCurrentSublistValue({
        sublistId: "line",
        fieldId: "account",
        value: accountNo,
      });
    }
    // emplyTransactionLink(context);
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

  function disableHeaderProcessType(context) {
    var processType = context.currentRecord.getField({
      fieldId: "custbody_seiu_pro_type",
    });

    var offSetAcc = context.currentRecord.getField({
      fieldId: "custbody_seiu_sml_scrn_bk_acc",
    });

    processType.isDisabled = true;
    offSetAcc.isDisabled = true;
  }

  function setUnappliedAmount(currentTransaction, recordType, remainPaymentId) {
    var transactionId = currentTransaction.getCurrentSublistValue({
      sublistId: "line",
      fieldId: "custcol_transactiontype",
    });

    var transacionPayment = record.load({
      type: recordType,
      id: transactionId,
    });

    var unAppliedAmount = transacionPayment.getValue({
      fieldId: remainPaymentId,
    });

    currentTransaction.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "custcol_col_unapplied_dueamt",
      value: unAppliedAmount,
      // ignoreFieldChange: true
    });
  }

  function emplyTransactionLink(context) {
    var currentRecord = context.currentRecord;

    if (
      context.sublistId === "line" &&
      context.fieldId === "custcol_customer"
    ) {
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
  }

  function accountPostSourcing(context) {
    let currRecord = context.currentRecord;
    // let lines = currRecord.getSublist({
    //     sublistId: "line"
    // });

    var sublistFieldName = context.fieldId;
    var sublist = context.sublistId;

    if (sublistFieldName == "currency") {
      // if(sublist == "line")
      currRecord.setCurrentSublistValue({
        sublistId: "line",
        fieldId: "account",
        value: 323,
      });
    }
  }

  function lineInit(context) {
    /******************************************** */
    console.log("test");
    // debugger;yy
    var sublistId = "line";
    var currentlist = context.currentRecord;

    currentlist.setCurrentSublistValue({
      sublistId: sublistId,
      fieldId: "account",
      value: 323,
    });

    currentlist.setCurrentSublistValue({
      sublistId: "line",
      fieldId: "amount",
      value: 100,
    });
  }

  function validateLine(context) {
    let currRecord = context.currentRecord;
    let sublistName = context.sublistId;
    let sublistFieldName = context.fieldId;

    // Disable header values on set customer value at line level.
    if (sublistName === "line") {
      // debugger;
      if (!validateAmoutnonLineTransaction(context)) {
        return false;
      } else if (!validateAmount(context)) {
        return false;
      } else if (!validateVendoragainstPayment(context)) {
        return false;
      } else if (!validateSelectedTransaction(context)) {
        return false;
      } else {
        return true;
      }
    }else{
      return true;
    }
  }

  //Set line level amount value on set credit or debit amount by user.
  // function setNativeLineAMount(context){
  //   context.currentRecord.getCurrentSublistValue

  //   context.currentRecord.getCurrentSublistValue({
  //     sublistId: "custcol_sml_bal_amn_deb",
  //     fieldId: string*
  //   })
  // }

  function validateAmount(context) {
    try {
      var SmallBalJE = context.currentRecord;
      var sublistName = context.sublistId;
      if (sublistName == "line") {
        var AmountDr = SmallBalJE.getCurrentSublistValue({
          sublistId: sublistName,
          fieldId: "custcol_sml_bal_amn_deb",
        });
        var AmountCr = SmallBalJE.getCurrentSublistValue({
          sublistId: sublistName,
          fieldId: "custcol_sml_bal_amn_cre",
        });
        if (!AmountDr && !AmountCr) {
          alert(
            'Please enter the amount in "AMOUNT(DEBIT)" or "AMOUNT(CREDIT)".'
          );
          return false;
        } else if (AmountDr && AmountDr > 0) {
          SmallBalJE.setCurrentSublistValue({
            sublistId: "line",
            fieldId: "amount",
            value: AmountDr,
          });
          return true;
        } else if (AmountCr && AmountCr > 0) {
          SmallBalJE.setCurrentSublistValue({
            sublistId: "line",
            fieldId: "amount",
            value: AmountCr,
          });
          return true;
        } else {
          return true;
        }
      }
      return true;
    } catch (e) {
      log.debug("exception", e);
    }
  }

  function validateEnteredAmount(context) {
    let currentTransaction = context.currentRecord;
  }

  function validateAmoutnonLineTransaction(context) {
    debugger;
    let currentTransaction = context.currentRecord;
    try {
      var transactionno = currentTransaction.getCurrentSublistText({
        sublistId: "line",
        fieldId: "custcol_transactiontype",
      });

      var credit = currentTransaction.getCurrentSublistValue({
        sublistId: "line",
        fieldId: "custcol_sml_bal_amn_cre",
      });

      var unAppliedAmount = currentTransaction.getCurrentSublistValue({
        sublistId: "line",
        fieldId: "custcol_col_unapplied_dueamt",
      });

      var debit = currentTransaction.getCurrentSublistValue({
        sublistId: "line",
        fieldId: "custcol_sml_bal_amn_deb",
      });

      log.debug("Credit is " + credit + " Debit is " + debit);
      console.log("INVT", transactionno.search("INV"));
      console.log("PYT", transactionno.search("PYT"));
      if (debit && transactionno.search("Inv") != -1) {
        alert("Please enter the credit amount for Invoice transaction.");
        return false;
      } else if (credit && transactionno.search("PYT") != -1) {
        alert("Please enter the debit amount for payment transaction.");
        return false;
      } else if (unAppliedAmount == 0) {
        alert(
          'Please select transaction with "UNAPPLIED/AMOUNT DUE" greater than 0.'
        );
        return false;
      } else if (debit > unAppliedAmount) {
        alert("Please enter the correct Debit Amount");
      } else if (credit > unAppliedAmount) {
        alert("Please enter the correct Credit Amount");
      } else {
        return true;
      }
    } catch (error) {
      log.error("error during execution" + error.message);
      log.debug("error during execution", error);
    }
  }

  function validateVendoragainstPayment(context) {
    // var credit = context.currentRecord.getCurrentSublistValue({
    //     sublistId: "line",
    //     fieldId: "custcol_sml_bal_amn_cre",
    //   });

    var transactionno = context.currentRecord.getCurrentSublistText({
      sublistId: "line",
      fieldId: "custcol_transactiontype",
    });

    var processType = context.currentRecord.getValue({
      fieldId: "custbody_seiu_pro_type",
    });

    if (processType != 2 && transactionno.search("PYT") != -1) {
      var entityName = context.currentRecord.getCurrentSublistValue({
        sublistId: "line",
        fieldId: "custcol_cust_bal_vendor",
      });

      // var entityType = context.currentRecord.getCurrentSublistValue({
      //   sublistId: "line",
      //   fieldId: "custcol_cust_bal_entity_type",
      // });

      if (entityName) {
        return true;
      } else {
        alert(
          "Please Enter the vendor (Entity Name) for Payment/Journal Entry"
        );
      }
    } else {
      return true;
    }
  }

  function validateSelectedTransaction(context) {
    let smlRecord = context.currentRecord;
    let lineId = "line";
    let transacitonId = "custcol_transactiontype";
    let totalLines = smlRecord.getLineCount({
      sublistId: lineId,
    });

    for (let index = 0; index < totalLines; index++) {
      let currentTransactionNo = smlRecord.getCurrentSublistValue({
        sublistId: lineId,
        fieldId: transacitonId,
      });

      let transactionNo = smlRecord.getSublistValue({
        sublistId: lineId,
        fieldId: transacitonId,
        line: index,
      });

      let currentIndex = smlRecord.getCurrentSublistIndex({
        sublistId: lineId,
      });

      console.log(
        "transactionNo is " +
          transactionNo +
          "currentTransactionNo " +
          currentTransactionNo
      );

      if (currentIndex == index) {
        continue;
      } else if (transactionNo == currentTransactionNo) {
        alert("Selected transaction is already added.");
        return false;
      } else {
        continue;
      }
    }
    return true;
  }

  function sublistChanged(scriptContext) {}

  return {
    pageInit: pageInit,
    // saveRecord: saveRecord,
    // validateField: validateField,
    fieldChanged: fieldChanged,
    // postSourcing: accountPostSourcing,
    // lineInit: lineInit,
    // validateDelete: validateDelete,
    // validateInsert: validateInsert,
    validateLine: validateLine,
    // sublistChanged: sublistChanged
  };
});
