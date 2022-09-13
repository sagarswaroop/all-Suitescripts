/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define(['N/record'], function(record) {

    function execute(context) {

        // var currentRecord = record.load({
        //     type: record.Type.SALES_ORDER,
        //     id: 53
        // });
        // var subsidiary    = currentRecord.getValue({ fieldId: 'subsidiary' });


        // Condition that will run the codes only on Creation.
        // if ((subsidiary == 3) && (context.type == 'create')) {
            // log.debug('DEBUG', 'Creating Customer Deposit (subsidiary='+subsidiary+')');
            log.debug("process start");

            // var entity     = currentRecord.getValue({ fieldId: 'entity' });
            // var total      = currentRecord.getValue({ fieldId: 'total' });
            // var paymethod  = 2
            // var rid        = currentRecord.id;

            // log.debug('DEBUG', 'subsidiary='+subsidiary);
            // log.debug('DEBUG', 'entity='+entity);
            // log.debug('DEBUG', 'total='+total);
            // log.debug('DEBUG', 'paymethod='+paymethod);
            // log.debug('DEBUG', 'rid='+rid);

            // SuiteScript Supported Records
            // article: 10242

            var custDeposit = record.create({
                type : 'customerdeposit',
                isDynamic : true
            });

            custDeposit.setValue({ fieldId : 'customer',      value : 29   });
            custDeposit.setValue({ fieldId : 'payment',       value : 500000     });
            // custDeposit.setValue({ fieldId : 'salesorder',    value : rid       });
            // custDeposit.setValue({ fieldId : 'paymentmethod', value : paymethod });

            var recId= custDeposit.save({
                enableSourcing : true,
                ignoreMandatoryFields : true });

            log.debug('DEBUG', 'Customer Deposit New - ID='+recId);
            log.debug("process end");

        // var objRecord = record.transform({
        //     fromType: "customsale120",
        //     fromId: 120,
        //     toType: record.Type.CUSTOMER_DEPOSIT,
        //     isDynamic: true,
        // });

        // log.debug({
        //     title: "objRecord transformation",
        //     details: objRecord
        // });

        // var deposit = objRecord.save({
        //     enableSourcing: true,
        //     ignoreMandatoryFields: false
        // });

        // log.debug({
        //     title: "deposit is ****"+deposit
        // });


    //     var recordObj = record.create({
    //         type: record.Type.CUSTOMER_DEPOSIT,
    //         isDynamic: true
    //     });
   
    //     recordObj.setValue({
    //         fieldId: 'customer',
    //         value: 5176
    //    });
        
    //    recordObj.setValue({
    //     fieldId: 'account',
    //     value: 219
    //     });


    //     recordObj.setValue({
    //     fieldId: 'department',
    //     value: 33
    //     });

    //     recordObj.setValue({
    //         fieldId: 'location',
    //         value: 1
    //    });

    //    recordObj.setValue({
    //     fieldId: 'cseg_contract',
    //     value: 887
    //     });

    //     recordObj.setValue({
    //         fieldId: 'payment',
    //         value: 50000       });
       
   
    // //    var totalBeforeTax = recordObj.getValue({fieldId: 'total'});
   
    // //    // get macros available on the record
    // //    var macros = recordObj.getMacros();
   
    // //    // execute the macro
    // //    if ('calculateTax' in macros)
    // //    {
    // //        macros.calculateTax(); // For promise version use: macros.calculateTax.promise()
    // //    }
    // //    // Alternative (direct) macro execution
    // //    // var calculateTax = recordObj.getMacro({id: 'calculateTax'});
    // //    // calculateTax(); // For promise version use: calculateTax.promise()
    // //    var totalAfterTax = recordObj.getValue({fieldId: 'total'});
   
    //    var recordId = recordObj.save();
       
    //    log.debug({
    //        title: "recrod id is ",
    //        details: recordId
    //    });
    }

    return {
        execute: execute
    }
});
