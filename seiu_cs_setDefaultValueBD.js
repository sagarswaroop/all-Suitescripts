// var isSEt = false;
// function setDefault(filedValue) {
//   var context = nlapiGetContext();
//   var hasValue =  context.getSetting('SCRIPT','	custscript_seiu_initial_script');
//   if(hasValue != "yes"){
//     nlapiSetFieldValue("custpage_2663_entity_file_format", "13");
//     context.setSetting('SCRIPT','	custscript_seiu_initial_script', "yes");
//   }
  
// }

// function  driver(type) {
  
//   var empRecrod = nlapiGetFieldValue("custpage_2663_entity_file_format");
//   if(type == "create"){
//       if(!isSEt){
//             setDefault()
        
//       }
//       var custom_empRecord = nlapiGetFieldValue("custpage_2663_entity_file_format");

//     }
// }

function setDefault(type) {
  var count = 0;
  var initValue = nlapiGetFieldValue("custpage_2663_entity_file_format");
  if(type == 'create'){
    if(initValue == "1"){
      nlapiSetFieldValue("custpage_2663_entity_file_format", "13");
      count++;
    }
  }
  
}

//========================
/**
 * if(empset!='13')
 * nlapiSetFieldValue("custpage_2663_entity_file_format", "13"); 
//           isSEt=true;
 */

