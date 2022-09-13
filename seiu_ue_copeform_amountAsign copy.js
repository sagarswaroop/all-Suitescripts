/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 *@author Sagar Kumar
 *@description This script taking tha transmited data and finding the diffrent in days. Then, it will distribute the line amount acordin to difference days and calculate the sum of qualified and non-qualified amount.
 */


define(['N/record'], function (record) {


    function determineCopeFunds(context) {
        var copeRecord = context.newRecord;

        // var copeRecord = record.load({
        //     type: "customtransaction108",
        //     id: copeRecordId
        // })

        var tranStatus = copeRecord.getValue({
            fieldId: "custbody_status"
        });

        // log.debug({
        //     title: "copeRecord",
        //     details: copeRecord
        // });

        // Execute below code when Status is approved.
        if (tranStatus == "4") {
            var totalQualifiedAmount = 0;
            var totalUnqualifiedAmount = 0;

            try {

                var transmitDate2 = copeRecord.getValue({
                    fieldId: "custbody_2nd_date_transmitted"
                });

                // log.debug("transmitDate2 is"+transmitDate2);

                var transmitDate = copeRecord.getValue({
                    fieldId: "custbody_date_transmitted"
                });
                // log.debug("transmitDate is"+transmitDate);

                var linesCounts = copeRecord.getLineCount({
                    sublistId: "line"
                });

                // log.debug("linesCounts are"+linesCounts);


                if(linesCounts>0){
                    // for(var i = 0; i<linesCounts; i++){
                    //     var ItemDateString = copeRecord.getSublistValue({
                    //         sublistId: "line",
                    //         fieldId: "custcol_service_date_by_seiu",
                    //         line: i
                    //     });

                    //     if(item)
                    // }
                }

                // Execute when TransmittedDate2 is not blank.
                if (transmitDate2) {
                    if (linesCounts > 0) {
                        for (var i = 0; i < linesCounts; i++) {

                            var approvedDate = transmitDate2;

                            if (context.type === context.UserEventType.EDIT) {
                                var ItemDateString = copeRecord.getSublistValue({
                                    sublistId: "line",
                                    fieldId: "custcol_service_date_by_seiu",
                                    line: i
                                });

                                var ItemDate = formateDate(ItemDateString);
    
                                if(ItemDate == "" || ItemDate == transmitDate ){
                                    copeRecord.setSublistValue({
                                                sublistId: "line",
                                                fieldId: "custcol_service_date_by_seiu",
                                                value: transmitDate2,
                                                line: i
                                            });
                                    approvedDate = transmitDate2;
                                }else{
                                    approvedDate = ItemDate;
                                }
                                
                                // // var oldCopeRecord = context.oldRecord;
                    
                                // // var itemOldDate = oldCopeRecord.getSublistValue({
                                // //     sublistId: "line",
                                // //     fieldId: "custcol_service_date_by_seiu",
                                // //     line: i
                                // // });
                    
                                // var itemModDate = copeRecord.getSublistValue({
                                //     sublistId: "line",
                                //     fieldId: "custcol_service_date_by_seiu",
                                //     line: i
                                // });

                                // // var oldTransmitDate2 = oldCopeRecord.getValue({
                                // //     fieldId: "custbody_2nd_date_transmitted"
                                // // });

                                // log.debug({
                                //     title: "newSEIUDate***"+newSEIUDate + "transmitDate2*******"+transmitDate2
                                // });

                                // if(formateDate(itemModDate) != "" || formateDate(itemModDate) != formateDate(transmitDate)){
                                //     log.debug({
                                //         title: "e(itemModDate) "+ itemModDate,
                                //         details: itemModDate
                                //     });
                                //     copeRecord.setSublistValue({
                                //         sublistId: "line",
                                //         fieldId: "custcol_service_date_by_seiu",
                                //         value: itemModDate,
                                //         line: i
                                //     });
        
                                //     approvedDate = itemModDate;
                                // }else{
                                //     log.debug({
                                //         title: "}else{ transmitDate2"+ transmitDate2,
                                //         details: transmitDate2
                                //     });
    
                                //     copeRecord.setSublistValue({
                                //         sublistId: "line",
                                //         fieldId: "custcol_service_date_by_seiu",
                                //         value: transmitDate2,
                                //         line: i
                                //     });
        
                                //     approvedDate = transmitDate2;
                                // }

                                // if(itemModDate == transmitDate || itemModDate == "" || transmitDate2 != oldTransmitDate2){
                                //     copeRecord.setSublistValue({
                                //                 sublistId: "line",
                                //                 fieldId: "custcol_service_date_by_seiu",
                                //                 value: transmitDate2,
                                //                 line: i
                                //             });
            
                                //             approvedDate = transmitDate2;
                                // }
                                // if(transmitDate2 == "" || formateDate(newSEIUDate) == formateDate(transmitDate)){
                                //     copeRecord.setSublistValue({
                                //         sublistId: "line",
                                //         fieldId: "custcol_service_date_by_seiu",
                                //         value: transmitDate2,
                                //         line: i
                                //     });
    
                                //     approvedDate = transmitDate2;
                                // }
                            }else{
                                copeRecord.setSublistValue({
                                    sublistId: "line",
                                    fieldId: "custcol_service_date_by_seiu",
                                    value: newSEIUDate,
                                    line: i
                                });

                                approvedDate = newSEIUDate;
                            }



                            // var serviceDateSEIU = copeRecord.getSublistValue({
                            //     sublistId: "line",
                            //     fieldId: "custcol_service_date_by_seiu",
                            //     line: i
                            // });

                            var serviceDate = copeRecord.getSublistValue({
                                sublistId: "line",
                                fieldId: "custcol_service_date",
                                line: i
                            });

                            var diffrenceDays = calculateDate(approvedDate, serviceDate);
                            var headerAmount = fundAmountDetermine(copeRecord, diffrenceDays, i);
                            totalQualifiedAmount += headerAmount.qualified;
                            totalUnqualifiedAmount += headerAmount.notQualified;
                        }
                    }

                } else {
                    // Execute when TransmittedDate2 is blank.
                    for (var i = 0; i < linesCounts; i++) {
                        var approvedDate = transmitDate;


                        if (context.type === context.UserEventType.EDIT) {
                            var ItemDate = copeRecord.getSublistValue({
                                sublistId: "line",
                                fieldId: "custcol_service_date_by_seiu",
                                line: i
                            });

                            if(!formateDate(ItemDate)){
                                copeRecord.setSublistValue({
                                            sublistId: "line",
                                            fieldId: "custcol_service_date_by_seiu",
                                            value: transmitDate,
                                            line: i
                                        });
                                approvedDate = transmitDate;
                            }else{
                                approvedDate = ItemDate;
                            }

                            // var oldCopeRecord = context.oldRecord;
                
                            // var itemOldDate = oldCopeRecord.getSublistValue({
                            //     sublistId: "line",
                            //     fieldId: "custcol_service_date_by_seiu",
                            //     line: i
                            // });

                            // var oldTransmitDate = oldCopeRecord.getValue({
                            //     fieldId: "custbody_date_transmitted"
                            // });
                
                            // var itemModDate = copeRecord.getSublistValue({
                            //     sublistId: "line",
                            //     fieldId: "custcol_service_date_by_seiu",
                            //     line: i
                            // });

                            // log.debug({
                            //     title: "itemModDate***"+itemModDate + "transmitDate*******"+transmitDate
                            // });


                            // if(formateDate(itemModDate) != "" || formateDate(itemModDate) != formateDate(transmitDate)){
                            //     copeRecord.setSublistValue({
                            //         sublistId: "line",
                            //         fieldId: "custcol_service_date_by_seiu",
                            //         value: itemModDate,
                            //         line: i
                            //     });
    
                            //     approvedDate = itemModDate;
                            // }else{

                            //     copeRecord.setSublistValue({
                            //         sublistId: "line",
                            //         fieldId: "custcol_service_date_by_seiu",
                            //         value: transmitDate,
                            //         line: i
                            //     });
    
                            //     approvedDate = transmitDate;
                            // }




                            // if(!itemModDate){
                            //     copeRecord.setSublistValue({
                            //         sublistId: "line",
                            //         fieldId: "custcol_service_date_by_seiu",
                            //         value: transmitDate,
                            //         line: i
                            //     });
    
                            //     approvedDate = transmitDate;
                            // }else 

                            // if(itemModDate == "" || transmitDate != oldTransmitDate){
                            //     copeRecord.setSublistValue({
                            //         sublistId: "line",
                            //         fieldId: "custcol_service_date_by_seiu",
                            //         value: transmitDate,
                            //         line: i
                            //     });
                            // }else if( itemModDate != transmitDate || itemModDate != itemOldDate){  
                            //     approvedDate = itemModDate;
                            //     continue;
                            // }


                            // if(itemModDate != itemOldDate || itemModDate != transmitDate || itemModDate != ""){
                            //     copeRecord.setSublistValue({
                            //         sublistId: "line",
                            //         fieldId: "custcol_service_date_by_seiu",
                            //         value: itemModDate,
                            //         line: i
                            //     });
                            //     approvedDate = itemModDate;
                            // }else{
                            //     copeRecord.setSublistValue({
                            //         sublistId: "line",
                            //         fieldId: "custcol_service_date_by_seiu",
                            //         value: transmitDate,
                            //         line: i
                            //     });
                            //     approvedDate = transmitDate;
                            // }
                        }else{
                            copeRecord.setSublistValue({
                                sublistId: "line",
                                fieldId: "custcol_service_date_by_seiu",
                                value: transmitDate,
                                line: i
                            });

                            approvedDate = transmitDate;
                        }


                        var serviceDate = copeRecord.getSublistValue({
                            sublistId: "line",
                            fieldId: "custcol_service_date",
                            line: i
                        });

                        var diffrenceDays = calculateDate(approvedDate, serviceDate);
                        var headerAmount = fundAmountDetermine(copeRecord, diffrenceDays, i);
                        totalQualifiedAmount += headerAmount.qualified;
                        totalUnqualifiedAmount += headerAmount.notQualified;
                    }
                }


                log.debug("totalQualifiedAmount  is**" + totalQualifiedAmount);
                log.debug("totalUnqualifiedAmount  is**" + totalUnqualifiedAmount);

                copeRecord.setValue({
                    fieldId: "custbody_seiu_qualifying_funds",
                    value: totalQualifiedAmount
                });

                copeRecord.setValue({
                    fieldId: "custbody_seiu_non_qualifying_funds",
                    value: totalUnqualifiedAmount
                });

                log.debug("totalQualifiedAmount is" + totalQualifiedAmount + "and totalUnqualifiedAmount is" + totalUnqualifiedAmount);

                // var id = copeRecord.save();
                // var id = copeRecord.save({
                //     enableSourcing: true,
                //     ignoreMandatoryFields: true
                // })

                // log.debug({
                //     title: "cope id",
                //     details: id
                // })

            } catch (userError) {
                log.debug({
                    title: "error during copeform script execution",
                    details: userError
                });

                log.error({
                    title: "Error is ",
                    details: userError.message
                });
            }
        }
    }

    function calculatePayRollDeduction(amount, days) {
        // var status = "";
        var funds = {
            qualifyingAmount: 0,
            nonQualifyingAMount: 0
        };
        if (amount < 50) {
            if (days <= 30) {
                funds.qualifyingAmount = amount;

            } else {
                funds.nonQualifyingAMount = amount;
            }
        } else {

            funds.nonQualifyingAMount = amount;
        }
        return funds;
    }

    // Calculate and assign the amount for Individual Contributions: $50 or less.
    function calLessIndContrilbution(amount, days) {
        // var status = "";
        var funds = {
            qualifyingAmount: 0,
            nonQualifyingAMount: 0
        };
        if (amount < 50) {
            if (days <= 30) {
                funds.qualifyingAmount = amount;

            } else {
                funds.nonQualifyingAMount = amount;
            }
        } else {

            funds.nonQualifyingAMount = amount;

        }
        return funds;
    }

    // Calculate and assign the amount for Individual Contributions: $50 or less.
    function calOverIndContrilbution(amount, days) {
        // var status = "";
        var funds = {
            qualifyingAmount: 0,
            nonQualifyingAMount: 0
        };
        if (amount < 50) {
            if (days <= 30) {
                funds.qualifyingAmount = amount;

            } else {
                funds.nonQualifyingAMount = amount;
            }
        } else {
            if (days <= 10) {
                funds.qualifyingAmount = amount;
            }
            if (days >= 11 && days <= 30) {
                funds.nonQualifyingAMount = amount;
            }
        }
        return funds;
    }

    function calEtcCollectionRaffles(amount, days) {
        // var status = "";
        var funds = {
            qualifyingAmount: 0,
            nonQualifyingAMount: 0
        };
        if (amount < 50) {
            if (days <= 30) {
                funds.qualifyingAmount = amount;

            } else {
                funds.nonQualifyingAMount = amount;
            }
        } else {

            funds.nonQualifyingAMount = amount;
        }
        return funds;
    }


    function fundAmountDetermine(copeRecord, days, index) {
        var funds = {};

        var copeItems = {
            payRollDeduction: "848",
            moreindividualContribution: "850",
            lessindividualContribution: "849",
            collections: "851"
        };

        var sublistId = "line";


        var lineAmount = copeRecord.getSublistValue({
            sublistId: sublistId,
            fieldId: "amount",
            line: index
        });

        var itemId = copeRecord.getSublistValue({
            sublistId: sublistId,
            fieldId: "custcol_membership_item",
            line: index
        });

        if (itemId == copeItems.collections) {
            funds = calEtcCollectionRaffles(lineAmount, days);
            return distributeFunds(copeRecord, funds, index);

        } else if (itemId == copeItems.lessindividualContribution) {
            funds = calLessIndContrilbution(lineAmount, days);
            return distributeFunds(copeRecord, funds, index);
        } else if (itemId == copeItems.moreindividualContribution) {
            funds = calOverIndContrilbution(lineAmount, days);
            return distributeFunds(copeRecord, funds, index);
        } else if (itemId == copeItems.payRollDeduction) {
            funds = calculatePayRollDeduction(lineAmount, days);
            return distributeFunds(copeRecord, funds, index);
        } else {
            return {
                qualified: 0,
                notQualified: 0
            }
        }

    }

    function distributeFunds(copeRecord, funds, index) {
        var sublistId = "line";
        copeRecord.setSublistValue({
            sublistId: sublistId,
            fieldId: "custcol_qualifying_funds",
            line: index,
            value: funds.qualifyingAmount
        });

        copeRecord.setSublistValue({
            sublistId: sublistId,
            fieldId: "custcol_non_qualifying_funds",
            line: index,
            value: funds.nonQualifyingAMount
        });

        return {
            qualified: funds.qualifyingAmount,
            notQualified: funds.nonQualifyingAMount
        }
    }

    // find out the Diffrence date of given dates.
    function calculateDate(transmitDate, serviceDate) {
        const date1 = new Date(formateDate(transmitDate));
        const date2 = new Date(formateDate(serviceDate));

        const diffTime = Math.abs(date1.getTime() - date2.getTime());
        log.debug(diffTime + " diffTime");
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        log.debug(diffDays + " days");
        return diffDays;
    }


    // covert netsuite date to calculation date.
    function formateDate(date) {
        var date1 = new Date(date);
        var transDate = date1.toLocaleDateString()
        var dteArray = transDate.split(" ");
        var month = {
            "January": 01,
            "Feburary": 02,
            "March": 03,
            "April": 04,
            "May": 05,
            "June": 06,
            "July": 07,
            "August": 08,
            "September": 09,
            "October": 10,
            "November": 11,
            "December": 12
        };

        return (month[dteArray[0]] + '/' + dteArray[1].replace(',', '') + '/' + dteArray[2]);
    }

    return {
        beforeSubmit: determineCopeFunds
    }
});