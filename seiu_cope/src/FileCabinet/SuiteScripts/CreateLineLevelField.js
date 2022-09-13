/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/ui/serverWidget'], function (serverWidget) {

    // /**
    // * @param {UserEventContext.beforeLoad} context
    // */
    // function beforeLoad(context) {
    //
    // }
    function beforeLoad(scriptContext) {
        var currentrecord = scriptContext.newRecord;
        var form = scriptContext.form;
        var contextType = scriptContext.type;
        log.debug({
            title: contextType
        });


        var sublist = form.getSublist({
            id: 'line'
        });
        var TransType = sublist.addField({
            id: 'custpage_trans',
            label: 'TRANSACTION',
            type: serverWidget.FieldType.SELECT

        });


        try {
            if (contextType === 'edit' || contextType === 'create') {
                var objSublist = form.getSublist({
                    id: 'line'
                });

                var objFieldAccount = objSublist.getField({
                    id: 'custcol_transactiontype'
                });

                objFieldAccount.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
            }
        } catch (e) {
            log.debug('exception', e);
        }




    }



    return {
        beforeLoad: beforeLoad
    };
});
