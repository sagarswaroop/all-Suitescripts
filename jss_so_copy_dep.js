
function verifyDepartment(){
    var depField = nlapiGetFieldText('department');
    if(depField){
        copyDepartment(depField);
        return true;
        }
        else{
            alert("please select the department");
            return false;
        }
        // debugger;
}


function copyDepartment(depField){
    nlapiSetCurrentLineItemValue('item','department_display',depField, false, false);
    // debugger;
}


function postSourcing(type, name)
{

    nlapiLogExecution("DEBUG","type is "+type+ " and name is "+name);
 // Execute this code when all the fields from item are sourced on the sales order.

  if(type === 'item' && name === 'item')
  {
    var depField = nlapiGetFieldText('department');
    if(depField){
    console.log(depField);
    nlapiSetCurrentLineItemValue('item','department_display',depField,false,false);
    return true;
    }
    else{
        alert("please select the department");
        return false;
    }
  }
}