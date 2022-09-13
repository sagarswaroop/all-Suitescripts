function CreateEmpNote(request, response){
    if(request.getMethod() == "GET"){
        var name = request.getParameter("empName");
        var id = request.getParameter("empId");
        var note = request.getParameter("empNote");
        var form = nlapiCreateForm('Update Employ notes',false);

        var fldInstruction = form.addField('custpage_sdr_instruction','text');
        fldInstruction.setDisplayType('inline');
        fldInstruction.setDefaultValue("Please add in the comment and press continue");
    
        var fldName = form.addField("custpage_sdr_name","text","name");
        fldName.setDisplayType('inline');
        fldName.setDefaultValue(name);
    
        var fldEmpId = form.addField('custpage_sdr_text',"text");
        fldEmpId.setDisplayType('inline');
        fldEmpId.setDefaultValue(id);
    
        var fldNote = form.addField('custpage_sdr_note','textarea','Notes');
        fldNote.setDefaultValue(note);
        form.addSubmitButton('continue');
    
        response.writePage(form);
    }
    else{
        var updateNote = request.getParameter('custpage_sdr_note');
        var formId = request.getParameter("custpage_sdr_text");
        var empRecrod = nlapiLoadRecord('employee',formId);
        empRecrod.setFieldValue("comments",updateNote);
        nlapiSubmitRecord(empRecrod);
        nlapiSetRedirectURL('RECORD','employee',formId,false);
    }
    
    

}