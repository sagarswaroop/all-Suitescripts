
require(['N/file'], function(file) {
    function createAndSaveFile() {
   
          var myFile = file.load({
                id: '5532'
            });
   
            var fileObj = myFile.getContents()
            
            log.debug({
                        title: "file obj",
                        details: fileObj
                    });
        var jsonfile = JSON.parse(fileObj);

        log.debug({
            details: jsonfile
        });

        log.debug({
            title: "date",
            details: jsonfile.Date
        })
    
   
    }

    // convertJson(){
    //     JSON.
    // }
    createAndSaveFile();
   });