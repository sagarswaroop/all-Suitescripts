/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *@author Sagar kumar
 *@description it is using to set field value for customer balance record tranasction filtration purpos.
 */
define(["N/record", "N/search"], function (record, search) {
  function afterSubmit(context) {
    var currRecord = context.newRecord;
    var remainingAmount = 0.00;

    log.debug({
      title: "currRecord.type",
      details: currRecord.type,
    });

    if (currRecord.type == record.Type.CUSTOMER_PAYMENT) {
      log.debug({
        title: "currRecord.type",
        details: currRecord.type,
      });

      remainingAmount = currRecord.getValue({
        fieldId: "unapplied",
      });
    }

    if (currRecord.type == record.Type.INVOICE) {
      log.debug({
        title: "currRecord.type",
        details: currRecord.type,
      });

      log.debug({
          title: "currRecord.id",
          details: currRecord.id
      })

      try {
        var fieldLookUp = search.lookupFields({
            type: currRecord.type,
            id: currRecord.id,
            columns: ['amountremaining']
        });

        log.debug("fieldLookUp ",fieldLookUp.amountremaining);
        remainingAmount = fieldLookUp.amountremaining;
      } catch (e) {
        log.error(e.message);
      }
    }

    log.debug("Remaining Amount" + remainingAmount);

    if (remainingAmount) {
      // currRecord.setValue({
      //   fieldId: "custbody_payment_remain_unapplied",
      //   value: remainingAmount,
      // });

      record.submitFields({
        type: currRecord.type,
        id: currRecord.id,
        values: {"custbody_payment_remain_unapplied":remainingAmount}
      });
    }
  }

  return {
    afterSubmit: afterSubmit,
  };
});
