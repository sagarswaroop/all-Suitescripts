function setRecrodType(type,form){
    if(type == 'line'){
        var primaryNameID =  nlapiGetCurrentLineItemValue("line","entity");
        console.log(primaryNameID);
        if(primaryNameID){
            var recordType = doOperation(primaryNameID);
            nlapiSetCurrentLineItemValue('line','custcol_seiu_record_type',recordType.toUpperCase());
        }
        else{
            console.log("note Exist");
        }
    }    
}

function doOperation(primaryNameID){
    var recordTypes = ['customer','vendor','employee'];
    for(var i=0; i<recordTypes.length; i++){
        try{
            var isType = nlapiLoadRecord(recordTypes[i],primaryNameID);
        }
        catch(error){
        }
        if(isType){
            
            return recordTypes[i];
        }
    }

}
