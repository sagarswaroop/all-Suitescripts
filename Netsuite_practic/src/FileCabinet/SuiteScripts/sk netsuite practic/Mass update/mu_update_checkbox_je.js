/**
 *@NApiVersion 2.1
 *@NScriptType MassUpdateScript
 */
define(["N/record"], function(record) {

    function each(params) {
        let currentRecord = record.load({
            type: params.type,
            id: params.id
        });

        currentRecord.setValue({
            fieldId: "custbody_sun_mfc_sent_for_bankrecon",
            value: false,
            ignoreFieldChange: true
        });

        currentRecord.save();
    }

    return {
        each: each
    }
});
