/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search'],

    function (search) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {


        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

            debugger;
            var copeRecord = scriptContext.currentRecord;
            var localContsRecordId = copeRecord.getValue({
                fieldId: "custrecord211"
            });

            var userName = copeRecord.getValue({
                fieldId: "custrecord_username"
            });

            log.debug({
                title: "localContsRecordId",    
                details: localContsRecordId
            });

            if (userName) {
            if (localContsRecordId) {
                var customrecord_localize_user_cred_infoSearchObj = search.create({
                    type: "customrecord_localize_user_cred_info",
                    filters: [

                        ["custrecord211", "anyof", localContsRecordId],
                        // "AND",
                        // ["custrecord_boomi_local_contact_role", "anyof", contactRole]
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
                console.log("searchResultCount" + searchResultCount);
                log.debug("customrecord_localize_user_cred_infoSearchObj result count", searchResultCount);

                if (searchResultCount >= 1) {
                    copeRecord.setValue({
                        fieldId: "custrecord_username",
                        value: ""
                    });
                    alert("You can not create more than once credential for a cotact.");
                }
                // customrecord_localize_user_cred_infoSearchObj.run().each(function (result) {
                //     // counter++;
                //     var contactRole = result.getValue({
                //         name: "custrecord_boomi_local_contact_role"
                //     });
                //     console.log("contactRole" + contactRole);
                //     log.debug("contactRole" + contactRole);
                //     if (contactRole == 2) {
                //         alert("The conatct role is already exist in Conatct Record");
                //         copeRecord.setValue({
                //             fieldId: "custrecord_boomi_local_contact_role",
                //             value: ""
                //         });
                //     } else if (contactRole == 1) {
                //         alert("The conatct role is already exist in Conatct Record");
                //         copeRecord.setValue({
                //             fieldId: "custrecord_boomi_local_contact_role",
                //             value: ""
                //         });
                //     } else {
                //         return true;
                //     }
                //     // .run().each has a limit of 4,000 results
                // });
            }
        }
    }

        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {

        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {

        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

        }

        return {
            // pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            // saveRecord: saveRecord
        };

    });