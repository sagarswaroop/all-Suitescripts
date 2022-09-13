/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
 define(['N/ui/serverWidget'],

 function (serverWidget) {

     /**
      * Function to be executed after page is initialized.
      *
      * @param {Object} scriptContext
      * @param {Record} scriptContext.currentRecord - Current form record
      * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
      *
      * @since 2015.2
      */
     function disableFields(scriptContext) {
         // var objForm = context.form;
         // var line = "line"
         var copeRecord = scriptContext.form;

         var customer = copeRecord.getField({
             id: "custbody_local_customer"
         });
         // customer.isDisabled = true;
         customer.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var postingperiod = copeRecord.getField({
            id: "postingperiod"
        });

        postingperiod.updateDisplayType({
            displayType: serverWidget.FieldDisplayType.INLINE
        });

         var tranmittedDate = copeRecord.getField({
             id: "custbody_date_transmitted"
         });

         tranmittedDate.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var headerQualFund = copeRecord.getField({
             id: "custbody_local_qualifying_funds"
         });

         headerQualFund.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var headernonQualFundDate = copeRecord.getField({
             id: "custbody_non_qualifying_date"
         });

         headernonQualFundDate.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var headernonQualFund = copeRecord.getField({
             id: "custbody_local_non_qualifying_fund"
         });

         headernonQualFund.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var status = copeRecord.getField({
             id: "custbody_status"
         });

         status.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var supportDocs = copeRecord.getField({
             id: "custbody_seiu_support_docs"
         });

         supportDocs.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var seiuNonQualFund = copeRecord.getField({
             id: "custbody_seiu_non_qualifying_funds"
         });
         seiuNonQualFund.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var seiuQualFund = copeRecord.getField({
             id: "custbody_seiu_qualifying_funds"
         });
         seiuQualFund.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var trandate = copeRecord.getField({
             id: "trandate"
         });
         trandate.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var currency = copeRecord.getField({
             id: "currency"
         });
         currency.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var seiuQualFund = copeRecord.getField({
             id: "custbody_seiu_qualifying_funds"
         });
         seiuQualFund.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var exchangerate = copeRecord.getField({
             id: "exchangerate"
         });
         exchangerate.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

         var pacCehckBox = copeRecord.getField({
             id: "custbody_seiu_pac_bank_acc"
         });
         pacCehckBox.updateDisplayType({
             displayType: serverWidget.FieldDisplayType.INLINE
         });

     }

    
     return {
         beforeLoad: disableFields
     };

 });
 