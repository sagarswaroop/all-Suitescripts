/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record"], function (record) {
  function pageInit(context) {
    alert("tes script running");
  }

  function saveRecord(context) {
    // function SacreatTasksve(context) {

    debugger;

    var currentRecord = context.currentRecord;

    var title = currentRecord.getValue({
      fieldId: "companyname",
    });

    var task = record.create({
      type: record.Type.TASK,
    });

    task.setValue({
      fieldId: "title",
      value: title,
    });

    var taskid = task.save();

    console.log(taskid);

    return true;
  }

  function validateField(context) {}

  function fieldChanged(context) {}

  function postSourcing(context) {}

  function lineInit(context) {}

  function validateDelete(context) {}

  function validateInsert(context) {}

  function validateLine(context) {}

  function sublistChanged(context) {}

  return {
    pageInit: pageInit,
    saveRecord: saveRecord,
    // validateField: validateField,
    // fieldChanged: fieldChanged,
    // postSourcing: postSourcing,
    // lineInit: lineInit,
    // validateDelete: validateDelete,
    // validateInsert: validateInsert,
    // validateLine: validateLine,
    // sublistChanged: sublistChanged
  };
});
