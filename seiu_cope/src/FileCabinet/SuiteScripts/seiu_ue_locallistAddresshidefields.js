/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(['N/ui/serverWidget'], function (serverWidget) {
  function beforeLoad(context) {
    const objForm = context.form;

    const fullAddress = objForm.getField({
      id: "custrecord_locallist_fulladdress",
    });

    const scriptId = objForm.getField({
        id: "scriptid",
      });

      fullAddress.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    });

    scriptId.updateDisplayType({
        displayType: serverWidget.FieldDisplayType.HIDDEN,
      });

  }

  function beforeSubmit(context) {}

  function afterSubmit(context) {}

  return {
    beforeLoad: beforeLoad,
    // beforeSubmit: beforeSubmit,
    // afterSubmit: afterSubmit,
  };
});
