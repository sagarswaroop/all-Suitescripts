/**
 *@NApiVersion 2.0
 *@NScriptType MassUpdateScript
 *@author Sagar kumar
 *@description it is using to set field value for customer balance record tranasction filtration purpos.
 */
define(["N/record", "N/search"], function(record, search) {

    function each(params) {

        var remainingAmount = 0;
          if (params.type == record.Type.CUSTOMER_PAYMENT) {
            log.debug({
              title: "params.type",
              details: params.type,
            });

            var payment = record.load({
                type: params.type,
                id: params.id
            });
      
            remainingAmount = payment.getValue({
              fieldId: "unapplied",
            });
          }
      
          if (params.type == record.Type.INVOICE) {
            log.debug({
              title: "params.type",
              details: params.type,
            });
      
            try {
                var fieldLookUp = search.lookupFields({
                    type: params.type,
                    id: params.id,
                    columns: ['amountremaining']
                });
        
                log.debug("fieldLookUp ",fieldLookUp.amountremaining);
                remainingAmount = fieldLookUp.amountremaining;
    
            } catch (e) {
              log.error(e.message);
            }
          }
      
          log.debug("Remaining Amount " + remainingAmount);
      
          if (remainingAmount) {
              record.submitFields({
                  type: params.type,
                  id: params.id,
                  values: {"custbody_payment_remain_unapplied": remainingAmount}
              });
            // params.setValue({
            //   fieldId: "custbody_payment_remain_unapplied",
            //   value: remainingAmount,
            // });
          }
    }

    return {
        each: each
    }
});
