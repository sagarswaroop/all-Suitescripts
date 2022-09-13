/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(['N/search'], function (search) {

    // /**
    // * @param {ClientScriptContext.fieldChanged} context
    // */
    // function fieldChanged(context) {
    //
    // }
    function InvoiceBasedOnCustomer(scriptContext) {
        try {
            var currentrecord = scriptContext.currentRecord;
            var sublistName = scriptContext.sublistId;
            var sublistFieldName = scriptContext.fieldId;
            if (sublistName === 'line' && sublistFieldName === 'custcol_customer') {
                var customer = currentrecord.getCurrentSublistText({
                    sublistId: 'line',
                    fieldId: 'custcol_customer'
                });
                log.debug({
                    title: customer
                });
                var subsidiry = currentrecord.getValue({
                    fieldId: 'subsidiary'
                });
                log.debug({
                    title: subsidiry,
                    details: 'subs'
                });


                var transactionSearchColDocumentNumber = search.createColumn({ name: 'tranid' });
                var transactionSearchColInternalId = search.createColumn({ name: 'internalid' });
                const transactionSearch = search.create({
                    type: 'transaction',
                    filters: [
                        ['type', 'anyof', 'CustInvc', 'CustPymt'],
                        'AND',
                        [
                            ['formulatext: {status}', 'is', 'open'],
                            'OR',
                            ['formulatext: {status}', 'is', 'DEPOSITED'],
                        ],
                        'AND',
                        ['customermain.entityid', 'haskeywords', customer],
                        'AND',
                        ['mainline', 'is', 'T'],
                        'AND',
                        ['subsidiary', 'anyof', subsidiry],
                    ],
                    columns: [
                        transactionSearchColDocumentNumber,
                        transactionSearchColInternalId,
                    ],
                });


                var searchResultCount = transactionSearch.runPaged().count;
                log.debug({
                    title: searchResultCount,
                    details: 'serach resilt'
                });
                var DocNumber;
                var interid;

                transactionSearch.run().each(function (result) {
                    DocNumber = result.getValue({ name: 'tranid' });
                    interid = result.getValue({ name: 'internalid' });
                    log.debug({
                        title: DocNumber,
                        details: 'invoice'
                    });

                    var field = currentrecord.getSublistField({
                        sublistId: 'line',
                        fieldId: 'custpage_trans',
                        line: line
                    });
                    log.debug({
                        title: field
                    });

                    field.removeSelectOption({
                        value: "",
                    });

                    field.insertSelectOption({
                        value: interid,
                        text: DocNumber
                    });

                    return true;

                });



            }
            if (sublistName === 'line' && sublistFieldName === 'custpage_trans') {
                var transTypeU = currentrecord.getCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'custpage_trans'
                });
                log.debug({
                    title: transTypeU,
                    details: 'transTypeU'
                });

                currentrecord.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'custcol_transactiontype',
                    value: transTypeU
                });

            }

        } catch (e) {
            log.debug('exception', e);
        }

    }



    return {
        fieldChanged: InvoiceBasedOnCustomer

    };
});
