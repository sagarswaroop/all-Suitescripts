/**
 *@NApiVersion 2.0
 *@NScriptType MassUpdateScript
 */
define(['N/record'], function(record) {

    function each(params) {
        log.debug("script start");
        var deletedRecordId = record.delete({
            type: params.type,
            id: params.id
        });

        log.debug({
            title: "deletedRecordId",
            details: deletedRecordId
        });
    }

    return {
        each: each
    }
});
