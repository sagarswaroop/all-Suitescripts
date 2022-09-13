/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/search','N/record'], function (search,record) {
  function pageInit(context) {}

  function saveRecord(context) {}

  function fieldChanged(context) {
    debugger;
    var currRecord = context.currentRecord;
    var isSublist = context.sublistId;
    var isField = context.fieldId;
    var sublistId = "line";
    var lineFields = {
      invoiceAgainstDate: "custcol_inv_application",
      showList: "custcol_show_transaction",
      docDate: "custcol_inv_doc_date_line",
      customer: "entity",
      postingGroup: "custcol_cd_posting_group"
    };

    var serachFitlers = [];

    var customer = currRecord.getCurrentSublistValue({
      sublistId: sublistId,
      fieldId: lineFields.customer,
    });

    var postingGroup = currRecord.getCurrentSublistValue({
      sublistId: sublistId,
      fieldId: "custcol_cd_posting_group",
    });

    try {
      if (isSublist == sublistId && isField == lineFields.showList) {
        serachFitlers = [["type","anyof","CustInvc"], 
          "AND", 
          ["mainline","is","T"],  
          "AND", 
          ["customermain.internalid","anyof",customer], 
          "AND", 
          ["status","anyof","CustInvc:A"], 
          "AND", 
          ["custbody23","anyof",postingGroup]];
  
          if(serachFitlers.length>0){
            var viewData = searchTransactions(serachFitlers);
          }
  
        if(viewData){
          alert(viewData);
        }else{
          alert("No data found for selected 'Customer' with selected 'Posting group'");
        }
        currRecord.setCurrentSublistValue({
          sublistId: "line",
          fieldId: lineFields.showList,
          value: "",
          ignoreFieldChange: true
          
        });
      }
  
      if(isSublist == sublistId && isField == lineFields.invoiceAgainstDate){
  
        var currentSelectedTransaction = currRecord.getCurrentSublistValue({
          sublistId: sublistId,
          fieldId: lineFields.invoiceAgainstDate,
        });
  
        if(currentSelectedTransaction){
         serachFitlers = [["type","anyof","CustInvc"], 
          "AND", 
          ["mainline","is","T"],  
          "AND", 
          ["customermain.internalid","anyof",customer], 
          "AND", 
          ["status","anyof","CustInvc:A"], 
          "AND", 
          ["custbody23","anyof",postingGroup],
          "AND", 
          ["internalid","anyof",currentSelectedTransaction]];
  
          if(serachFitlers.length>0){
            searchTransactions(serachFitlers);
          }
        }
        
      }
      
    } catch (error) {
      log.debug("error during show invoices are ",error);
    }


    function searchTransactions(createdFilter){
      // var customer = currRecord.getCurrentSublistValue({
      //   sublistId: sublistId,
      //   fieldId: lineFields.customer,
      // });

      // var postingGroup = currRecord.getCurrentSublistValue({
      //   sublistId: sublistId,
      //   fieldId: "custcol_cd_posting_group",
      // });

      if(postingGroup){

        var invoiceSearchObj = search.create({
          type: "invoice",
          filters:createdFilter,
          columns:
          [
             search.createColumn({name: "custbody_doc_date", label: "Document Date"}),
             search.createColumn({name: "tranid", label: "Document Number"}),
             search.createColumn({name: "memomain", label: "Memo (Main)"}),
             search.createColumn({name: "amountremaining", label: "Amount Remaining"})
          ]
       });

       debugger;
       ////////////////////////////////////////////////////////////////////////////////////////////////

       var viewData = "Document Date \t Transaction Number \t Amount \t Memo\n";
       var searchResultCount = invoiceSearchObj.runPaged().count;
       log.debug("invoiceSearchObj result count",searchResultCount);
       invoiceSearchObj.run().each(function(result){
          // .run().each has a limit of 4,000 results
          console.log(result);
          var documentDate = result.getValue("custbody_doc_date");
          var transationNo = result.getValue("tranid");
          var memo = result.getValue("memomain");
          var remainAmount = result.getValue("amountremaining");
          

          viewData+= documentDate+"  \t   "+transationNo+"  \t   "+remainAmount+"  \t   "+ memo+"\n";

          //check to set document date.
          if(searchResultCount==1){
            var fomrateDate = new Date(documentDate);
            currRecord.setCurrentSublistValue({
              sublistId: "line",
              fieldId: lineFields.docDate,
              value: fomrateDate
            });
          }

          // console.log(data);
          // searchResult.push(data);
          return true;
       });

       

       if(searchResultCount>0){
         return viewData;
       }else{
         return "";
       }


      }
    }
  }

  function validateInvoiceColumn(context) {
    var currRecord = context.currentRecord;
    var isSublist = context.sublistId;
    var isField = context.fieldId;
    var lineSublit = "line";
    var lineFields = {
      invoiceAgainstDate: "custcol_inv_application",
      invoicewitoutDate: "custcol_inv_application_wo_date",
      docDate: "custcol_inv_doc_date_line",
    };

    debugger;

    try {
      var invoiceAgainstDate = currRecord.getCurrentSublistValue({
        sublistId: lineSublit,
        fieldId: lineFields.invoiceAgainstDate,
      });

      var invoiceWithoutDate = currRecord.getCurrentSublistValue({
        sublistId: lineSublit,
        fieldId: lineFields.invoicewitoutDate,
      });

      var documentDate = currRecord.getCurrentSublistValue({
        sublistId: lineSublit,
        fieldId: lineFields.docDate,
      });

      //   var currentIndex = currRecord.getCurrentSublistIndex({
      //     sublistId: lineSublit,
      //   });

      var sublist = currRecord.getSublist({
        sublistId: "line",
      });

      var dateField = sublist.getColumn({
        fieldId: lineFields.docDate,
      });

      var invoiceAgainstDateField = sublist.getColumn({
        fieldId: lineFields.invoiceAgainstDate,
      });

      var invoiceWithoutDateField = sublist.getColumn({
        fieldId: lineFields.invoicewitoutDate,
      });

      if (
        (isSublist == lineSublit && isField == lineFields.docDate) ||
        isField == lineFields.invoiceAgainstDate
      ) {
        if (documentDate || invoiceAgainstDate) {
          invoiceWithoutDateField.isDisabled = true;
        } else {
          invoiceWithoutDateField.isDisabled = false;
        }
      } else if (
        isSublist == lineSublit &&
        isField == lineFields.invoicewitoutDate
      ) {
        if (invoiceWithoutDate) {
          invoiceAgainstDateField.isDisabled = true;
          dateField.isDisabled = true;
        } else {
          invoiceAgainstDateField.isDisabled = false;
          dateField.isDisabled = false;
        }
      } else {
        return true;
      }
    } catch (error) {
      log.debug({
        title: "error during validate",
        details: error,
      });
    }
  }

  function postSourcing(context) {}

  function lineInit(context) {}

  function validateDelete(context) {}

  function validateInsert(context) {}

  function validateLine(context) {}

  function sublistChanged(context) {}

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
  };
});
