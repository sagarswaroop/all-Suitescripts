/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 * @author Niteesh maheshwari
 */
define(['N/record', 'N/email', 'N/runtime'], function (record, email, runtime) {
    function SendCredentials(context) {
        try {
            log.debug({
                title: "email script start"
            });
            if (context.type === context.UserEventType.CREATE) {
                var userCredentialsRecord = context.newRecord;
                var contactMails = [];
                var userPassword = userCredentialsRecord.getValue({
                    fieldId: 'custrecord_password'
                });
                var userName = userCredentialsRecord.getValue({
                    fieldId: "custrecord_username"
                });

                var contactId = userCredentialsRecord.getValue({
                    fieldId: 'custrecord211'
                });

                var contactRecord = record.load({
                    type: "customrecord_localized_contact",
                    id: contactId
                });

                log.debug({
                    title: "contactRecord script start" + contactRecord
                });

                var mail = contactRecord.getValue({
                    fieldId: "custrecord_lz_contact_email"
                });

                var contactCustomer = contactRecord.getText({
                    fieldId: "custrecord_lz_contact_customer"
                });

                log.debug({
                    title: "contactCustomer",
                    details: contactCustomer
                })

                if (mail) {
                    contactMails.push(mail);
                }

                var userObj = runtime.getCurrentUser();
                var userId = userObj.id;

                email.send({
                    author: userId,
                    body: 'Hello, <br><br> Please find the createed credentials to login the Customer Portal for ' + contactCustomer + '. <br>' + 'UserName: ' + userName + '<br> Password: ' + userPassword + '<br>' + '<br> <p>Please Click <a href="https://flow.boomi.com/c4717fee-7a63-4249-9257-c157eedde5e2/play/SEIU/?flow-id=b7dd653f-a5da-4a91-b08d-94aa24e2a64e">here</a> to Login!</p>' + '<br><br> Regards!',
                    recipients: contactMails,
                    subject: 'Local User credentials "' + contactCustomer + '" create'
                });
            }
            if (context.type === context.UserEventType.EDIT) {
                var userCredentialsRecord = context.newRecord;
                var oldCredentialRecord = context.oldRecord;
                var contactMails = [];

                var oldpassword = oldCredentialRecord.getValue({
                    fieldId: "custrecord_password"
                });

                var userPassword = userCredentialsRecord.getValue({
                    fieldId: 'custrecord_password'
                });



                var newId = oldCredentialRecord.getValue({
                    fieldId: "custrecord_username"
                });

                var oldId = userCredentialsRecord.getValue({
                    fieldId: 'custrecord_username'
                });

                if (newId != oldId || oldpassword != userPassword) {
                    var userName = userCredentialsRecord.getValue({
                        fieldId: "custrecord_username"
                    });


                    var contactId = userCredentialsRecord.getValue({
                        fieldId: 'custrecord211'
                    });

                    var contactRecord = record.load({
                        type: "customrecord_localized_contact",
                        id: contactId
                    });

                    log.debug({
                        title: "contactRecord script start" + contactRecord
                    });

                    var mail = contactRecord.getValue({
                        fieldId: "custrecord_lz_contact_email"
                    });

                    var contactCustomer = contactRecord.getText({
                        fieldId: "custrecord_lz_contact_customer"
                    });

                    if (mail) {
                        contactMails.push(mail);
                    }

                    var userObj = runtime.getCurrentUser();
                    var userId = userObj.id;

                    email.send({
                        author: userId,
                        body: 'Hello, <br><br> Please find the updated credentials to login the Customer Portal for ' + contactCustomer + '. <br>' + 'UserName: ' + userName + '<br> Password: ' + userPassword + '<br>' + '<br> <p>Please Click <a href="https://flow.boomi.com/c4717fee-7a63-4249-9257-c157eedde5e2/play/SEIU/?flow-id=b7dd653f-a5da-4a91-b08d-94aa24e2a64e">here</a> to Login!</p>' + '<br><br> Regards!',
                        recipients: contactMails,
                        subject: 'Local User credentials "' + contactCustomer + '" update'
                    });

                    log.debug({
                        title: "email script end"
                    });
                }


            }
        } catch (e) {
            log.debug("exception", e);
        }
    }
    return {
        afterSubmit: SendCredentials
    }



});