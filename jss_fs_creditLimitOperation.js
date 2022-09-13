function calculateLimit(){
    var salesRecord = nlapiGetNewRecord();
    // var salesRecord = nlapiLoadRecord("salesorder","31779");
    var customerID = salesRecord.getFieldValue("entity");
    var customerRecord = nlapiLoadRecord("customer",customerID);
    var isCredit = customerRecord.getFieldValue("creditlimit");

    var customerSearch = nlapiSearchRecord("customer",null,
[
   ["internalid","anyof",customerID]
], 
[
   new nlobjSearchColumn("entityid").setSort(false), 
   new nlobjSearchColumn("balance"), 
   new nlobjSearchColumn("unbilledorders")
]
);
var totalSales = 0;
if(customerSearch){
    if(customerSearch.length>0){
        for(i=0; i<customerSearch.length; i++){
            var custRecrod = customerSearch[i];
            var balance = parseFloat(custRecrod.getValue("balance"));
            var unbilledorders = parseFloat(custRecrod.getValue("unbilledorders"));
            totalSales = balance+unbilledorders;
        }
    }
}

var transactionSearch = nlapiSearchRecord("transaction",null,
[
   ["customer.internalid","anyof",customerID], 
   "AND", 
   ["paymentmethod","noneof","@NONE@"], 
   "AND", 
   ["mainline","is","T"]
], 
[
   new nlobjSearchColumn("entity"), 
   new nlobjSearchColumn("amount"), 
   new nlobjSearchColumn("paymentmethod")
]
);

var cashSales = 0;
if(transactionSearch){
    if(transactionSearch.length){
        for(var i=0;i<transactionSearch.length;i++){
            var soRecord = transactionSearch[i];
            var amount = parseFloat(soRecord.getValue("amount"));
            cashSales+= amount;

        }
    }
}

var salesSum = totalSales - cashSales;

var x = 0;

if(isCredit>=salesSum){
    nlapiLogExecution("DEBUG","isCredit","Yes");
    return "yes";
}
else{
    nlapiLogExecution("DEBUG","isCredit","NO");
    return "no";
}

}


    

    // var transactionSearch = nlapiSearchRecord("transaction",null,
    // [
    //    ["customer.internalid","anyof",customerID], 
    //    "AND", 
    //    ["paymentmethod","anyof","@NONE@"], 
    //    "AND", 
    //    ["mainline","is","T"], 
    //    "AND", 
    //    ["custbody_approval_status","anyof","2"]
    // ], 
    // [
    //    new nlobjSearchColumn("entity"), 
    //    new nlobjSearchColumn("custbody_approval_status","appliedToTransaction",null), 
    //    new nlobjSearchColumn("amount")
    // ]
    // );
    // var orderSum = 0;
    // if(transactionSearch){
    //     for(var i=0; i<transactionSearch.length; i++){
    //         var salesRecord = transactionSearch[i];
    //         var ordervalue = parseInt(salesRecord.getValue("amount"));
    //         orderSum+= ordervalue;

    //     }
    // }
    // nlapiLogExecution("DEBUG"," var orderSum = 0;",orderSum);
    // var isCredit = customerCredit - orderSum;
    // nlapiLogExecution("DEBUG",'var isCredit = customerCredit - orderSum;',isCredit);
    // var x=0;
