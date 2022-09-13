/**
    *@NApiVersion 2.0
    *@NScriptType UserEventScript
*/
define(['N/record', 'N/search', 'N/error'], function (record, search, error) {
    function validateCredentials(context) {
        //        if (context.type === context.UserEventType.EDIT) {
        var userCredentialsNewRecord = context.newRecord;
        var userCredentialsOldRecord = context.oldRecord;

        var userNameNew = userCredentialsNewRecord.getValue({
            fieldId: "custrecord_username"
        });

        //       var userNameOld = '';
        if (context.type === context.UserEventType.EDIT) {
            userNameOld = userCredentialsOldRecord.getValue({
                fieldId: "custrecord_username"
            });
            if (userNameNew != userNameOld) {
                // Search the Corportate Credid card and mark the flag
                var customrecord_amex_p_card_excludeSearchObj = search.create({
                    type: "customrecord_localize_user_cred_info",
                    filters:
                        [
                            ["custrecord_username", "is", userNameNew]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "custrecord_username" })
                        ]
                });
                var searchResultCount = customrecord_amex_p_card_excludeSearchObj.runPaged().count;
                log.debug('result', searchResultCount);

                if (searchResultCount > 0) {
                    var myCustomError = error.create({
                        name: 'Duplicate Username.',
                        message: 'Username already used. Please provide a different username.',
                        notifyOff: true
                    });
                    throw myCustomError.message;
                }
            }
        }

        if (context.type === context.UserEventType.CREATE) {
            // Search the Corportate Credid card and mark the flag
            var customrecord_amex_p_card_excludeSearchObj = search.create({
                type: "customrecord_localize_user_cred_info",
                filters:
                    [
                        ["custrecord_username", "is", userNameNew]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_username" })
                    ]
            });
            var searchResultCount = customrecord_amex_p_card_excludeSearchObj.runPaged().count;
            log.debug('result', searchResultCount);

            if (searchResultCount > 0) {
                var myCustomError = error.create({
                    name: 'Duplicate Username.',
                    message: 'Username already used. Please provide a different username.',
                    notifyOff: true
                });
                throw myCustomError.message;
            }
        }
    }
    //        }
    return {
        beforeSubmit: validateCredentials
    }
});