/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([], function () {
  function SelectAcc(context) {
    try {
        debugger;
      var SmallBalanceJE = context.currentRecord;
      var FieldName = context.fieldId;
      var setOffAccId = "custbody_seiu_sml_scrn_bk_acc";
      var setOffAcc = {
        rebatePayment: { acc: 1062, id: 4 },
        smlBal: { acc: 345, id: 2 },
        covidRebate: { acc: 345, id: 3 },
      };

      if (FieldName == "custbody_seiu_pro_type") {
        var ProcessType = SmallBalanceJE.getValue({
          fieldId: "custbody_seiu_pro_type",
        });

        if (ProcessType == setOffAcc.covidRebate.id ||ProcessType == setOffAcc.rebatePayment.id) {
          SmallBalanceJE.setValue({
            fieldId: setOffAccId,
            value: setOffAcc.rebatePayment.acc,
          });

          SmallBalanceJE.setValue({
            fieldId: "custbody_je_type1",
            value: 	10,
          });
          
        }
        if (ProcessType == setOffAcc.smlBal.id) {
          SmallBalanceJE.setValue({
            fieldId: setOffAccId,
            value: setOffAcc.covidRebate.acc,
          });

          SmallBalanceJE.setValue({
            fieldId: "custbody_je_type1",
            value: 	11,
          });
        }
      }
    } catch (e) {
      log.debug("exception", e);
    }
  }

  return {
    fieldChanged: SelectAcc,
  };
});
