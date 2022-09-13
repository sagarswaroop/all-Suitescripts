/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript
 */
define(['N/render','N/runtime','N/record','N/email','N/file'], function(render, runtime, record, email, file) {

    function sendMail(scriptContext) {
        var allRecepients= [];
        var curr_Record = scriptContext.newRecord;
        var currentRecordId = scriptContext.newRecord.id;
        var curretUserId = runtime.getCurrentUser().id;
        var customerList  = runtime.getCurrentScript();
        var mailTemplateId = customerList.getParameter({name: 'custscript_ssp_email_template_id'});

        // to attach a file.
        // var pdfFile = file.load({
        //     id: 288
        // });


        // render method attach the current record pdf with option pdf/html/xml.
        var pdfFile = render.transaction({
            entityId: currentRecordId,
            printMode: render.PrintMode.PDF,
            inCustLocale: true
            });
           

        log.debug({
            title: "pdfFile value is",
            details: pdfFile
        });

        var saleRepId = curr_Record.getValue({
            fieldId: "salesrep"
        });

        allRecepients.push[saleRepId];

        var customerId = curr_Record.getValue({
            fieldId: "entity"
        });

        try{

            // customer record create.
            var customerRec = record.load({
                type: record.Type.CUSTOMER,
                id: customerId
            });

        }catch(err){
            log.error({
                title: "Error cusotoemr record load",
                details: err.message
            });
            log.debug({
                title: "Error cusotoemr record load",
                details: err.message
            });
        }

        // check the custoemr's contacts list.
        var lineCount = customerRec.getLineCount({
            sublistId: "contactroles"
        });

        if(lineCount>0){
            for(i=0;i<lineCount;i++){
                try{

                    var isRole = customerRec.getSublistValue({
                        sublistId: 'contactroles',
                        fieldId: 'role',
                        line: i
                    }); 
                   
                    log.debug({
                        title: "isRole value is -",
                        details: isRole
                    });

                    if(isRole == 14){
                        var recepientId = customerRec.getSublistValue({
                            sublistId: 'contactroles',
                            fieldId: 'contact',
                            line: i
                        });   
                        
                        allRecepients.push(recepientId);
                    }

                }catch(err){
                    log.error({
                        title: "Erro while data of customer",
                        details: err.message
                    });

                    log.debug({
                        title: "Erro while data of customer",
                        details: err.message
                    });
                }
            }
        }
        // linecount end.

        log.debug({
            title: "all ids are result is ",
            details: [{"curretUserId": curretUserId}, {"currentRecordId":currentRecordId},{"mailTemplateId":mailTemplateId}, {"saleRepId":saleRepId}
            , {"recepientId":recepientId}]
        });
        
        var mergeResult = render.mergeEmail({
            templateId: mailTemplateId,
            entity: null,
            recipient: null,
            supportCaseId: 2,
            transactionId: currentRecordId,
            custmRecord: null
            });

            log.debug({
                title: "merge result is "+mergeResult,
                details: mergeResult
            });

            var mesageSubject = mergeResult.subject;
            var messageBody = mergeResult.body;

            email.send({
                author: curretUserId,
                recipients: allRecepients,
                subject: mesageSubject,
                body: messageBody,
                attachments: [pdfFile],
                relatedRecords: {
                    transactionId: currentRecordId
               }
            });

            log.debug("end of scripting");

    }

    return {
        onAction: sendMail
    }
});
