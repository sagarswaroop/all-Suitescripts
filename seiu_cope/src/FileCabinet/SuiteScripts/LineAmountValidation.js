/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([], function () {
    // /**
    // * @param {ClientScriptContext.validateLine} context
    // */
    // function validateLine(context) {
    //    return true;
    // }
    function validateLine(context) {
        try {
            var SmallBalJE = context.currentRecord;
            var sublistName = context.sublistId;
            if (sublistName == 'line') {
                var AmountDr = SmallBalJE.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custcol_sml_bal_amn_deb'
                });
                var AmountCr = SmallBalJE.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custcol_sml_bal_amn_cre'
                });
                if (!AmountDr && !AmountCr) {
                    alert("Please enter the amount in \"AMOUNT(DEBIT)\" or \"AMOUNT(CREDIT)\".");
                    return false;
                }
                else {
                    return true;
                }

            }
            return true;
        } catch (e) {
            log.debug('exception', e);
        }
    }

    return {

        validateLine: validateLine
    };
});
