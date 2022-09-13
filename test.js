/**
  *@NApiVersion 2.x
  *@NScriptType UserEventScript
  */
  define(['N/currentRecord', 'N/search', 'N/record', 'N/transaction'],function(context, search, record, transaction)
  {
      function afterSubmit(scriptContext)
        {
          var recordId=scriptContext.newRecord.id;
  
  //		log.debug({title:'recordId',details:recordId});
  
          var objRecord = record.load({
              type: 'customrecord_grant_payment_schedule',
              id: recordId,
              isDynamic: true
          });
  
  //		log.debug({title:'objRecord',details: objRecord});
  
            var voidCheck = objRecord.getValue({
              fieldId: 'custrecord_mjff_ss_void_checkbox'
          });

          log.debug({
              title: "voidCheck value is",
              details: voidCheck
          });

          if (voidCheck == true)
          {
              var activityId = objRecord.getValue({ fieldId: 'custrecord_mjf_grant_pmt_number' });
              log.debug(activityId);
  
              var mySearch = search.create({
                  type: search.Type.VENDOR_PAYMENT,
                  filters: [
                      ['custbody_grant_pmt_billactivityid', 'is', activityId],
                      'and', ['mainline', 'is', 'T']
                  ],
                  columns: ['internalid']
              });
  
              var resultRange = mySearch.run().getRange({
                  start: 0,
                  end: 1
              });
  
              var internalId = resultRange[0].id;
              log.debug(resultRange[0].id);
  
              var paymentRecord = record.load({
                  type: record.Type.VENDOR_PAYMENT,
                  id: internalId,
                  isDynamic: true,
              });
  
              var approvalStatus = paymentRecord.getValue({ fieldId: 'approvalstatus' });
              log.debug(approvalStatus);
  
              if (approvalStatus != 2)
              {
                  var approvedPaymentRecord = paymentRecord.setValue({
                      fieldId: 'approvalstatus',
                      value: 2
                  });
                  log.debug(approvedPaymentRecord);
                  log.debug(approvalStatus);
                  var idapprovedPaymentRecord = approvedPaymentRecord.save();
              }
  
              var voidpaymentId = transaction.void({
                  type: transaction.Type.VENDOR_PAYMENT,
                  id: resultRange[0].id
              });
  
              log.debug({
                  title: "voidpaymentId value is"+voidpaymentId
              })
  
            //   var editedGrant = objRecord.setValue({
            //       fieldId: 'custrecord_mjf_grant_pmt_status',
            //       value: 15
            //   });
  
            //   var ideditedGrant = editedGrant.save();
          }
      }
  
      return {
              afterSubmit: afterSubmit
      };
  
  });