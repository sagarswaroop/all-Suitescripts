/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/search"], function (search) {
  // /**
  // * @param {ClientScriptContext.fieldChanged} context
  // */
  function fieldChanged(context) {
    log.debug("field cahnge call");
    if (
      context.sublistId === "line" &&
      context.fieldId === "custcol_customer"
    ) {
      InvoiceBasedOnCustomer(context);
    }
  }

  function InvoiceBasedOnCustomer(scriptContext) {
    debugger;

    console.log(scriptContext);
    try {
      var currentrecord = scriptContext.currentRecord;
      var sublistName = scriptContext.sublistId;
      var sublistFieldName = scriptContext.fieldId;

      var customer = currentrecord.getCurrentSublistText({
        sublistId: "line",
        fieldId: "custcol_customer",
      });
      log.debug({
        title: customer,
      });
      var subsidiry = currentrecord.getValue({
        fieldId: "subsidiary",
      });
      log.debug({
        title: subsidiry,
        details: "subs",
      });

      var transactionSearchColDocumentNumber = search.createColumn({
        name: "tranid",
      });
      var transactionSearchColInternalId = search.createColumn({
        name: "internalid",
      });
      const transactionSearch = search.create({
        type: "transaction",
        filters: [
          ["type", "anyof", "CustInvc", "CustPymt"],
          "AND",
          [
            ["formulatext: {status}", "is", "open"],
            "OR",
            ["formulatext: {status}", "is", "DEPOSITED"],
          ],
          "AND",
          ["customermain.entityid", "haskeywords", customer],
          "AND",
          ["mainline", "is", "T"],
          "AND",
          ["subsidiary", "anyof", subsidiry],
        ],
        columns: [
          transactionSearchColDocumentNumber,
          transactionSearchColInternalId,
        ],
      });

      var searchResultCount = transactionSearch.runPaged().count;
      log.debug({
        title: searchResultCount,
        details: "serach resilt",
      });
      var DocNumber;
      var interid;
      

      var objfield = currentrecord.getSublistField({
        sublistId: "line",
        fieldId: "custpage_trans",
        line: scriptContext.line
      });

      // var lineList = currentrecord.selectLine({
      //   sublistId: "line",
      //   line: scriptContext.line
      // });

      // var transField =  lineList.getField({
      //   fieldId: "custpage_trans"
      // });

      

      // log.debug({
      //   title: objfield,
      // });
      objfield.removeSelectOption({ value: null });
      transactionSearch.run().each(function (result) {
        DocNumber = result.getValue({ name: "tranid" });
        interid = result.getValue({ name: "internalid" });
        log.debug({
          title: DocNumber,
          details: "invoice",
        });
        var currentIndex = currentrecord.getCurrentSublistIndex({
          sublistId: "line",
        });
        log.debug({
          title: currentIndex,
          details: "line no",
        });

        objfield.insertSelectOption({
          value: interid,
          text: DocNumber,
        });

        return true;
      });
      if (sublistName === "line" && sublistFieldName === "custpage_trans") {
        var transTypeU = currentrecord.getCurrentSublistValue({
          sublistId: "line",
          fieldId: "custpage_trans",
        });
        log.debug({
          title: transTypeU,
          details: "transTypeU",
        });

        currentrecord.setCurrentSublistValue({
          sublistId: "line",
          fieldId: "custcol_transactiontype",
          value: transTypeU,
        });
      }
    } catch (e) {
      log.debug("exception", e);
    }
  }
  function cehck(scriptContext) {
    var currentrecord = scriptContext.currentRecord;
    var sublistName = scriptContext.sublistId;
    var sublistFieldName = scriptContext.fieldId;
    debugger;
    try {
      var customer = currentrecord.getCurrentSublistText({
        sublistId: "line",
        fieldId: "custcol_customer",
      });
      log.debug({
        title: customer,
      });
      var subsidiry = currentrecord.getValue({
        fieldId: "subsidiary",
      });
      log.debug({
        title: subsidiry,
        details: "subs",
      });

      var objfield = currentrecord.getSublistField({
        sublistId: "line",
        fieldId: "custpage_trans",
        line: scriptContext.line,
      });

      searchandSetTransaction(customer, subsidiry, objfield);
      setTrnasactionValue(currentrecord, sublistName, sublistFieldName);
    } catch (e) {
      log.debug("exception", e);
    }
  }

  function setTrnasactionValue(currentrecord, sublistName, sublistFieldName) {
    if (sublistName === "line" && sublistFieldName === "custpage_trans") {
      var transTypeU = currentrecord.getCurrentSublistValue({
        sublistId: "line",
        fieldId: "custpage_trans",
      });
      log.debug({
        title: transTypeU,
        details: "transTypeU",
      });

      currentrecord.setCurrentSublistValue({
        sublistId: "line",
        fieldId: "custcol_transactiontype",
        value: transTypeU,
      });
    }
  }

  function searchandSetTransaction(customer, subsidiry, objfield) {
    var transactionSearchColDocumentNumber = search.createColumn({
      name: "tranid",
    });
    var transactionSearchColInternalId = search.createColumn({
      name: "internalid",
    });
    const transactionSearch = search.create({
      type: "transaction",
      filters: [
        ["type", "anyof", "CustInvc", "CustPymt"],
        "AND",
        [
          ["formulatext: {status}", "is", "open"],
          "OR",
          ["formulatext: {status}", "is", "DEPOSITED"],
        ],
        "AND",
        ["customermain.entityid", "haskeywords", customer],
        "AND",
        ["mainline", "is", "T"],
        "AND",
        ["subsidiary", "anyof", subsidiry],
      ],
      columns: [
        transactionSearchColDocumentNumber,
        transactionSearchColInternalId,
      ],
    });

    var searchResultCount = transactionSearch.runPaged().count;
    log.debug({
      title: searchResultCount,
      details: "serach resilt",
    });

    objfield.removeSelectOption({ value: null });
    if (searchResultCount > 0) {
      transactionSearch.run().each(function (result) {
        DocNumber = result.getValue({ name: "tranid" });
        interid = result.getValue({ name: "internalid" });

        log.debug({
          title: DocNumber,
          details: "invoice",
        });

        var field = currentrecord.getSublistField({
          sublistId: "line",
          fieldId: "custpage_trans",
          line: 0,
        });

        log.debug({
          title: field,
        });

        field.insertSelectOption({
          value: interid,
          text: DocNumber,
        });
        return true;
      });
    } else {
      objfield.removeSelectOption({ value: null });
    }
  }

  function lineInit(context) {
    log.debug("Line init call");
    debugger;
    try {
      var customer = context.currentRecord.getCurrentSublistValue({
        sublistId: "line",
        fieldId: "custcol_customer",
      });

      if (customer) {
        InvoiceBasedOnCustomer(context);
      }
    } catch (error) {
      log.debug("error is", error);
    }
  }

  return {
    // fieldChanged: fieldChanged,
    lineInit: lineInit
  };
});
