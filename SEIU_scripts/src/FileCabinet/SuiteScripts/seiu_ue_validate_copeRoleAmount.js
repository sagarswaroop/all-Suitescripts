/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search', 'N/error'],

    (search, error) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            var copeRecord = scriptContext.newRecord;
            var localContsRecordId = copeRecord.getValue({
                fieldId: "custrecord211"
            });

            var localContsRecordId = copeRecord.getValue({
                fieldId: "custrecord211"
            });

            log.debug({
                title: "localContsRecordId",
                details: localContsRecordId
            });

            if (localContsRecordId) {
                var customrecord_localize_user_cred_infoSearchObj = search.create({
                    type: "customrecord_localize_user_cred_info",
                    filters: [
                        ["custrecord211", "anyof", localContsRecordId]
                    ],
                    columns: [
                        search.createColumn({
                            name: "scriptid",
                            sort: search.Sort.ASC,
                            label: "Script ID"
                        }),
                        search.createColumn({
                            name: "custrecord_boomi_local_contact_role",
                            label: "Contact Role"
                        }),
                        search.createColumn({
                            name: "custrecord211",
                            label: "Localized Contact"
                        })
                    ]
                });
                //  var counter = 0;
                var searchResultCount = customrecord_localize_user_cred_infoSearchObj.runPaged().count;
                log.debug("customrecord_localize_user_cred_infoSearchObj result count", searchResultCount);
                customrecord_localize_user_cred_infoSearchObj.run().each(function (result) {
                    // counter++;
                    var contactRole = result.getValue({
                        name: "custrecord_boomi_local_contact_role"
                    });
                    log.debug("contactRole" + contactRole);
                    if (contactRole == 2 || contactRole == 1) {

                        copeRecord.setValue({
                            fieldId: "custrecord211",
                            value: ""
                        });
                    }
                    // .run().each has a limit of 4,000 results
                });
            }

        }

        function sendErrortoClient() {
            var errorText = 'This is the error',
                msg = '<style>.text {display: none;}' // this will hide the JSON message
                +
                '.bglt td:first-child:not(.textboldnolink):after {' +
                'color:black;font-size:8pt;' // set the desired css for our message
                +
                'content: url(/images/5square.gif) \'' +
                errorText +
                '\'}' +
                '</style>',
                err = error.create({
                    name: 'NO_JSON',
                    message: msg,
                    notifyOff: true
                });

            throw err;
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return {
            beforeLoad,
            beforeSubmit,
            afterSubmit
        }

    });