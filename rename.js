function renameFile(type){
    debugger;
    // var folderId = parseInt(nlapiGetContext().getSetting('SCRIPT','custscript_jss_folder_internal_id'));
    var folderId = 662;
    var date = Date().split(" ").splice(1,3).join("_");

    var filters = new Array();
    filters.push(new nlobjSearchFilter('folder', null, 'anyof',folderId));

    var columns = new Array();
    columns.push(new nlobjSearchColumn('internalid'));
    columns.push(new nlobjSearchColumn('name'));

    var searchResults = nlapiSearchRecord('file', null, filters, columns);
    
    if(searchResults.length >0){
        for(var i = 0; i<searchResults.length; i++){
            var fileObj = searchResults[i];
            var fileId = parseInt(fileObj.getValue('internalid'));

            var fileRec = nlapiLoadFile(fileId);
            var currFileName = fileRec.getName();
            var fileExtention = currFileName.split(".")[1];

            
            // var fileArry = currFileName.split(".");
            // var currFileName = fileArry[0];
            // var fileExtention = fileArry[1];
            // var isFileName = currFileName.endsWith("_"+i);
            // if(isFileName){
            //     conitnue;
            // }
            // else{
            var newFileName = date+"_"+i+"."+fileExtention;
            //set the new file name of the file 
            fileRec.setName(newFileName);
            //submit the file so that the new file name would be saved
            nlapiSubmitFile(fileRec);
            // }
            //save the current file name of the fil


        }
    }
    
    var x = 0;
    // console.log(data);


    // var path = nlapiLoadFile("filecabinet/"+foldername+"/");
    // console.log(path);
    // var subFiles = nlapiViewSubrecord(folderId);
    // nlapiLogExecution('DEBUG','floderobj is '+ folderObj, subFiles);
    // suitecloud file:list --folder "/SuiteScripts";

}