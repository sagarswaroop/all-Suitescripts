function do_Mail(){
    //create close won saved search of customers
    let searchResult = nlapiSearchRecord('customer', 'customsearch932', null, null);
    if(searchResult){
        for(lineRecord of searchResult){
            let currentDate = lineRecord.getValue('createddate');
            alert(currentDate);            
        }
    }
}