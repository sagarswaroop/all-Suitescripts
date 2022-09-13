/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript
 *@author Sagar Kumar
 *@description It will send the mail on rejection the cope form. It will get the rejection reason from form and send to contact email where if the contact email has credentials with sectery role.
 */
define(["N/record", "N/search", "N/email", "N/runtime"], function (
  record,
  search,
  email,
  runtime
) {
  function onAction(scriptContext) {
    var copeRecord = scriptContext.newRecord;

    // log.debug({
    //     title: "currentUserID",
    //     details: currentUserID
    // });

    var localCustomerId = copeRecord.getValue({
      fieldId: "custbody_local_customer",
    });

    log.debug({
      title: "localCustomerId",
      details: localCustomerId,
    });

    searchRoleandSendEmail(copeRecord, localCustomerId);

    //get the record of localized customer.
    // var localizedRecord = record.load({
    //     type: "customrecord_localized",
    //     id: localCustomerId
    // });

    // log.debug({
    //     title: 'localizedRecord',
    //     details: localizedRecord
    // });
    // var localizedRecord;

    // var totalContacts = localizedRecord.getLineCount({
    //     sublistId: "recmachcustrecord_lz_contact_customer"
    // });

    // log.debug({
    //     title: 'totalContacts',
    //     details: totalContacts
    // });

    // if(totalContacts>0){
    //     for(var i=0; i<totalContacts; i++){

    //         // Load Local contact record Id from localized customer.
    //         var localContsRecordId = localizedRecord.getSublistValue({
    //             sublistId: "recmachcustrecord_lz_contact_customer",
    //             fieldId: "id",
    //             line: i
    //         });

    //         log.debug("localContsRecordId"+localContsRecordId);

    //         //Load Local contact record from localized customer.
    //         var localContsRecord = record.load({
    //             type: "customrecord_localized_contact",
    //             id: localContsRecordId
    //         });

    //         log.debug("localContsRecord"+localContsRecord);

    //         var contactEmail = localContsRecord.getValue({
    //             fieldId: "custrecord_lz_contact_email"
    //         });

    //         log.debug({
    //             title: "contactEmail",
    //             details: contactEmail
    //         });

    //         if(contactEmail){
    //             checkSectoryRole(copeRecord,contactEmail,localContsRecordId)
    //         }
    //         // if(contactEmail){
    //         //     sendMailtoConatct(recordNo,rejectedComment,currentUserID,contactEmail,isMailSend);
    //         // }
    //     }

    // }
  }

  //checkSectoryRole check the secetory role in local credentials record.
  function searchRoleandSendEmail(copeRecord, localCustomerId) {
    var customrecord_localize_user_cred_infoSearchObj = search.create({
      type: "customrecord_localize_user_cred_info",
      filters: [
        ["custrecord_local_union_name.internalid", "anyof", localCustomerId],
      ],
      columns: [
        search.createColumn({
          name: "custrecord_localized_contact",
          label: "Localized Contact",
        }),
        search.createColumn({
          name: "custrecord_username",
          label: "Contact Email",
        }),
        search.createColumn({
          name: "custrecord_boomi_local_contact_role",
          label: "Contact Role",
        }),
      ],
    });
    var searchResultCount =
      customrecord_localize_user_cred_infoSearchObj.runPaged().count;
    log.debug(
      "customrecord_localize_user_cred_infoSearchObj result count",
      searchResultCount
    );
    customrecord_localize_user_cred_infoSearchObj.run().each(function (result) {
      // .run().each has a limit of 4,000 results

      var contactRole = result.getValue({
        name: "custrecord_boomi_local_contact_role",
      });
      // log.debug("contactRole"+contactRole);
      if (contactRole == 2) {
        var contactEmail = result.getValue({ name: "custrecord_username" });
        // log.debug("contactRole"+contactRole);
        sendMailtoConatct(copeRecord, contactEmail);
      }
      return true;
    });
  }

  //checkSectoryRole check the secetory role in local credentials record.
  function checkSectoryRole(copeRecord, contactEmail, localContsRecordId) {
    // var isSendEmail = false;
    var customrecord_localize_user_cred_infoSearchObj = search.create({
      type: "customrecord_localize_user_cred_info",
      filters: [["custrecord_localized_contact", "anyof", localContsRecordId]],
      columns: [
        search.createColumn({
          name: "scriptid",
          sort: search.Sort.ASC,
          label: "Script ID",
        }),
        search.createColumn({
          name: "custrecord_boomi_local_contact_role",
          label: "Contact Role",
        }),
        search.createColumn({
          name: "custrecord_localized_contact",
          label: "Localized Contact",
        }),
      ],
    });
    var counter = 0;
    var searchResultCount =
      customrecord_localize_user_cred_infoSearchObj.runPaged().count;
    log.debug(
      "customrecord_localize_user_cred_infoSearchObj result count",
      searchResultCount
    );
    customrecord_localize_user_cred_infoSearchObj.run().each(function (result) {
      counter++;
      var contactRole = result.getValue({
        name: "custrecord_boomi_local_contact_role",
      });
      // log.debug("contactRole"+contactRole);
      if (contactRole == 2) {
        // log.debug("contactRole"+contactRole);
        sendMailtoConatct(copeRecord, contactEmail);
      }
      return true;
      // .run().each has a limit of 4,000 results
    });

    log.debug("counter" + counter);
  }

  // sendMailtoConatct send the mail to contact is isSendEmail is true.
  function sendMailtoConatct(copeRecord, contactEmail) {
    //get script parameter.
    var scriptObj = runtime.getCurrentScript();
    var url = scriptObj.getParameter({
      name: "custscript_seiu_boomi_portal_lin",
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

    var rejectedComment = copeRecord.getValue({
      fieldId: "custbody_rejected_comments",
    });

    var subject = " Cope transaction " + recordNo + " rejected.";
    var body =
      "Hello,<br><br> The transaction "+recordNo+"is rejected. Please follow the below link to view the record.<br> Rejection reason: " +
      rejectedComment +
      '.</br><br> <a href="' +
      url +
      '">View Record</a> </br><br> Thank you,';

    // if(isSendEmail){
    var emailSent = email.send({
      author: currentUserID,
      body: body,
      recipients: contactEmail,
      subject: subject,
    });

    log.debug({
      title: "emailSent",
      details: emailSent,
    });
    //    }
  }

  return {
    onAction: onAction,
  };
});
