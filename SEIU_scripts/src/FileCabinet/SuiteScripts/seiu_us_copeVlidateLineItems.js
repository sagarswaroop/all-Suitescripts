/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 *@author Sagar Kumar
 *@description it will validate and error out if amount is greater than $50 except more than $50 item and cope non-Qualified item.
 */

define([], function () {
  function beforeLoad(context) {}

  function beforeSubmit(context) {
    log.debug({
      title: "script start",
    });

    var copeMembershiForm = context.newRecord;
    var IndContributionMorethanItem = 850;
    var nonQualifingfundItme = 852;
    var totalLines = copeMembershiForm.getLineCount({ sublistId: "line" });
    log.debug("totalLines", totalLines);

    for (var lineNo = 1; lineNo <= totalLines; lineNo++) {
      // var lineNo = lineNo + 1;
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

      if (lineItem == nonQualifingfundItme) {
        continue;
      }

      if (lineItem != IndContributionMorethanItem && lineAmount > 50) {
        var myCustomError = error.create({
          name: "Amount Error",
          message: "Amount at line " + lineNo + " can not be more than 50$.",
        });
        throw myCustomError.message;
      }
    }
  }

  function afterSubmit(context) {}

  return {
    // beforeLoad: beforeLoad,
    beforeSubmit: beforeSubmit,
    // afterSubmit: afterSubmit
  };
});
