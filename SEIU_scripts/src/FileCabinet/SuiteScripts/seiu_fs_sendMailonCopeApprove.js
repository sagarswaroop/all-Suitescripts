/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript
 */
define(["N/search", "N/email", "N/runtime"], function (search, email, runtime) {
  function onAction(scriptContext) {
    var currRecord = scriptContext.newRecord;

    var localCustomerId = currRecord.getValue({
      fieldId: "custbody_local_customer",
    });

    var contactsList = checkCustomerforContact(localCustomerId);
    log.debug({
      title: "contactsList",
      details: contactsList,
    });
    sendMailtoConatct(currRecord, contactsList);
  }

  function checkCustomerforContact(localContsRecordId) {
    const ConatctsList = [];
    var customrecord_localized_contactSearchObj = search.create({
      type: "customrecord_localized_contact",
      filters: [
        ["custrecord_lz_contact_customer", "anyof", localContsRecordId],
      ],
      columns: [
        search.createColumn({
          name: "custrecord_lz_contact_email",
          label: "Contact Email",
        }),
      ],
    });
    // var searchResultCount =
    //   customrecord_localized_contactSearchObj.runPaged().count;
    //  log.debug("customrecord_localized_contactSearchObj result count",searchResultCount);
    customrecord_localized_contactSearchObj.run().each(function (result) {
      // .run().each has a limit of 4,000 results
      var contact = result.getValue("custrecord_lz_contact_email");
      if (contact) {
        ConatctsList.push(contact);
      }
      return true;
    });
    return ConatctsList;
  }

  function sendMailtoConatct(copeRecord, contactEmail) {
    //get script parameter.
    var scriptObj = runtime.getCurrentScript();
    var url = scriptObj.getParameter({
      name: "custscript_seiu_boomi_portal_lin_app",
    });
    // log.debug({
    //     title: "paramUrl",
    //     details: url
    // });

    // get current user internal Id as for email.
    var userobj = runtime.getCurrentUser();
    var currentUserID = userobj.id;
    // var url = "https://flow.boomi.com/c4717fee-7a63-4249-9257-c157eedde5e2/play/SEIU/?flow-id=b7dd653f-a5da-4a91-b08d-94aa24e2a64e";

    var recordNo = copeRecord.getValue({
      fieldId: "tranid",
    });

    var subject = " Cope transaction " + recordNo + " Approved.";
    var body =
      "Hello,<br><br> The transaction "+recordNo+" is Approved. Please follow the below link to view the record." +
      '</br><br> <a href="' +
      url +
      '">View Record</a> </br><br> Thank you,';

    try {
      email.send({
        author: currentUserID,
        body: body,
        recipients: contactEmail,
        subject: subject,
      });
    } catch (e) {
      log.debug({
        title: e.message,
        details: e,
      });

      log.error({
        title: e.message,
        details: e,
      });
    }
  }

  return {
    onAction: onAction,
  };
});
