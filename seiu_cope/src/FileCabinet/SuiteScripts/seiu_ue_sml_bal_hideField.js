/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(["N/ui/serverWidget"], function (serverWidget) {
  function beforeLoad(context) {
    var rec = context.newRecord;

    // disableAddButton(context);

    if(context.type == "view"){
      log.debug("context.type",context.type);
      disableGLImpact(context);
    }

    // rec.setValue({
    //   fieldId: "total",
    //   value: 1000,
    // });

    var objForm = context.form;
    var objSublist = objForm.getSublist({
      id: "line",
    });

    var objFieldTotal = objForm.getField({
      id: "total",
    });

    var objFieldAccount = objSublist.getField({
      id: "account",
    });

    var objFieldAmount = objSublist.getField({
      id: "amount",
    });

    var objFieldTranType = objSublist.getField({
      id: "custcol_cust_bal_tran_type",
    });

    var processType = objSublist.getField({
      id: "custbody_seiu_pro_type",
    });

    var localCodeField = objSublist.getField({
      id: "cseg_local_code",
    });

    // exchangerate.updateDisplayType({
    //   displayType: serverWidget.FieldDisplayType.INLINE,
    // });



    localCodeField.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.DISABLED,
    });

    objFieldTranType.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    });

    objFieldAccount.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    });

    objFieldAmount.updateDisplayType({
      displayType: serverWidget.FieldDisplayType.HIDDEN,
    });

    //set PCT deault for first time
    log.debug({
      title: "record mode",
      details: context.Type,
    });
    if(context.Type = "create"){
      context.newRecord.setValue({
        fieldId: "custbody23", //posting group
        value: 6,
        // ignoreFieldChange: true
      });
    }

    // if(context.Type = "Edit"){
    //   offSetAcc.updateDisplayType({
    //     displayType: serverWidget.FieldDisplayType.READONLY
    //   });

    //   processType.updateDisplayType({
    //     displayType: serverWidget.FieldDisplayType.READONLY
    //   });
    // }

    // setLineTransactions(context);
    // hideCopyLine(context);
  }

  function hideCopyLine(context) {
    var hiddnField =  context.form.addField({
        id: "custpage_hide_button",
        label: "not shown- hidden",
        type: serverWidget.FieldType.INLINEHTML
    });

    var scr = "";
    scr += 'jQuery("#line_copy").hide();';

    hiddnField.defaultValue = "<script>jQuery(function($){require([], function(){" + scr + ";})})</script>"
}

  function disableGLImpact(context) {
    log.debug("disableGLImpact call ");
    var hiddnField =  context.form.addField({
        id: "custpage_hide_button",
        label: "not shown- hidden",
        type: serverWidget.FieldType.INLINEHTML
    });

    var scr = "";
    scr += 'jQuery("#glimpacttablnk").remove();';

    hiddnField.defaultValue = "<script>jQuery(function($){require([], function(){" + scr + ";})})</script>"
}

  function disableAddButton(context){
    var hiddnField =  context.form.addField({
      id: "custpage_hide_button",
      label: "not shown- hidden",
      type: serverWidget.FieldType.INLINEHTML
  });

  var scr = "";
  scr += 'jQuery("#listinlinefocusedrow").addClass( "uir-disabled" );';

  hiddnField.defaultValue = "<script>jQuery(function($){require([], function(){" + scr + ";})})</script>"
  }

  function setLineTransactions(scriptContext) {
    debugger;
    var lines = "line";
    var smlBalRecord = scriptContext.newRecord;
    var totalLines = smlBalRecord.getLineCount({
      sublistId: "line",
    });
  }

  function beforeSubmit(context) {}

  function afterSubmit(context) {}

  return {
    beforeLoad: beforeLoad,
    // beforeSubmit: beforeSubmit,
    // afterSubmit: afterSubmit
  };
});