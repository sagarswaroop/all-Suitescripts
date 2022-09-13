function renameFile(type){
    var folderId = parseInt(nlapiGetContext().getSetting('SCRIPT','custscript_jss_folder_internal_id'))

    var filters = new Array();
    filters.push(new nlobjSearchFilter('folder', null, 'anyof',folderId));

    var columns = new Array();
    columns.push(new nlobjSearchColumn('internalid'));
    columns.push(new nlobjSearchColumn('name'));

    var searchResults = nlapiSearchRecord('file', null, filters, columns);
    try{
    if(searchResults!= null){
            if(searchResults.length >0){
                for(var i = 0; i<searchResults.length; i++){
                    var fileObj = searchResults[i];
                    var fileId = parseInt(fileObj.getValue('internalid'));
        
                    var fileRec = nlapiLoadFile(fileId);
                    var currFileName = fileRec.getName();
                    var fileExtention = currFileName.split(".")[1];
                    var filenumber = ("0"+(i+1)).slice(-2);
        
                    var newFileName = createDateFormate()+filenumber+"."+fileExtention;
                    fileRec.setName(newFileName);
                    nlapiSubmitFile(fileRec);
                }
            }
        }
    }
        catch(e){
            nlapiLogExecution('ERROR',"Please Check Rename File's folder","Files data or folder Id is not given correct");
        }
        
    }
    

function createDateFormate(){
    var date = new Date();
    var day = ("0"+date.getDay()).slice(-2);
    var month = ("0"+(date.getMonth()+1)).toString().slice(-2);
    var year =date.getFullYear().toString().slice(2);
    return "ACHP"+month+day+year;
}