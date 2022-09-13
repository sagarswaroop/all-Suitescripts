/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * 
 */

define(['N/search', 'N/format', 'N/error', 'N/runtime', 'N/record', 'N/redirect', 'N/ui/serverWidget'],

    function (search, format, error, runtime, record, redirect, serverWidget) {

        function beforeLoad(context) {


            var currentRecord = context.newRecord;
            var myUser = runtime.getCurrentUser();
            var objForm = context.form;

            var userRole = myUser.role;

            var objSublist = objForm.getSublist({
                id: 'line'
            })

            var objFieldAccount = objSublist.getField({
                id: 'account'
            });

            objFieldAccount.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
        }
        return {
            beforeLoad: beforeLoad
        };

    });