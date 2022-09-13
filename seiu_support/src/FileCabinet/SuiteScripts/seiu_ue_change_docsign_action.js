/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/email', 'N/record', 'N/search','N/runtime','N/ui/serverWidget','N/url','N/https','N/redirect','N/file'],
		/**
		 * @param {email} email
		 * @param {record} record
		 * @param {search} search
		 * @param {runtime} runtime
		 * @param {serverWidget} serverWidget
		 */
		function(email, record, search,runtime,serverWidget,url,https,redirect,file) {

	function beforeLoad(scriptContext) {
		try{
			var recObj = scriptContext.newRecord;
			var recType = recObj.type;
			var scriptObj = runtime.getCurrentScript(); 
			var approverId = scriptObj.getParameter({name: 'custscript_next_approver'});
			log.debug('approverId',approverId);
			log.debug('Record Type is ',recType+' & Context Type is: '+scriptContext.type);
			var userObj = runtime.getCurrentUser();
			log.debug('userObj id is:',userObj.id);
			log.debug('User Role is:',userObj.role);
			var nextApprover = recObj.getValue({ //244 is Toni
				fieldId: 'nextapprover'
			}); 
			log.debug('nextApprover',nextApprover);
			if(recType == 'purchaseorder' && scriptContext.type == 'view'){
				var docuSignVal = recObj.getValue({
					fieldId: 'custbody_docusign_actions'
				});
				log.debug('docuSignVal: ',docuSignVal);
				var docusignVenStatus = recObj.getValue({
					fieldId: 'custbody_docusign_vendor_sign_status'
				});
				log.debug('docusignVenStatus: ',docusignVenStatus);

				var hideFld = scriptContext.form.addField({
					id:'custpage_hide_button',
					label:'Hide-Button',
					type: serverWidget.FieldType.INLINEHTML
				});
				if((docuSignVal == 1 && docusignVenStatus == '') || (docuSignVal == 3 && docusignVenStatus == 1)){
					log.debug('DocuSign Needed ('+docuSignVal+'), so hiding only sign button');
				}
				if(docuSignVal == 2 || docuSignVal == 4 || docuSignVal == 5){ // 2 == DocuSign Not Needed; 
					log.debug('DocuSign value is ('+docuSignVal+'), so hiding both button');

					var scr = "";
					scr += 'jQuery("#tr_custpage_button_docusign_send").hide();'; //Send with DocuSign
					scr += 'jQuery("#tr_secondarycustpage_button_docusign_send").hide();'; //Send with DocuSign

					hideFld.defaultValue = "<script>jQuery(function($){require([], function(){" + scr + ";})})</script>"
				}
				if(docuSignVal == 3){
					if(docusignVenStatus == 2 || docusignVenStatus == '' || docusignVenStatus == null || docusignVenStatus == undefined){
						if(userObj.id != approverId || approverId != nextApprover){
							log.debug('Vendor Signed ('+docuSignVal+'), but user is not Toni, so hiding both the button');

							var scr3 = "";
							scr3 += 'jQuery("#tr_custpage_button_docusign_send").hide();'; //Send with DocuSign
							scr3 += 'jQuery("#tr_secondarycustpage_button_docusign_send").hide();'; //Send with DocuSign

							hideFld.defaultValue = "<script>jQuery(function($){require([], function(){" + scr3 + ";})})</script>"
						}
					}
				}
				if((docuSignVal == 3 && userObj.id == approverId && approverId == nextApprover)){//Logged in user should be Toni & NextApprover should be Toni 
					if(docusignVenStatus == 2  || docusignVenStatus == '' || docusignVenStatus == null || docusignVenStatus == undefined){
						log.debug('Logged in User and Next Approver both are Toni, so hiding Send with DocuSign button');
						var scr2 = "";
						scr2 += 'jQuery("#tr_custpage_button_docusign_send").hide();'; //Send with DocuSign
						scr2 += 'jQuery("#tr_secondarycustpage_button_docusign_send").hide();'; //Send with DocuSign

						hideFld.defaultValue = "<script>jQuery(function($){require([], function(){" + scr2 + ";})})</script>"
						// Trigger Custom Sign with DocuSign button.
						triggerCustomSignButton(scriptContext,recObj);
					}
				}

			}
			if(recType == 'purchaseorder' && scriptContext.type == 'copy'){
				log.debug('*In PO Make Copy Action. So, Unset the DocuSign Action, DocuSign Email and Vendor Signed Checkbox*');
				recObj.setValue({
					fieldId: 'custbody_docusign_actions',
					value: '',
					ignoreFieldChange: true
				});
				recObj.setValue({
					fieldId: 'custbody_email_sent_docusign',
					value: false,
					ignoreFieldChange: true
				});
				recObj.setValue({
					fieldId: 'custbody_docusign_vendor_sign_status',
					value: '',
					ignoreFieldChange: true
				});
			}
		}catch(e){
			log.error('Error in BL:',e);
		}
	}

	function triggerCustomSignButton(scriptContext,recObj){
		var poId = recObj.id;
		log.debug('POID is:',poId); 
		var form = scriptContext.form;
		var signDocuSign = form.addButton({
			id: 'custpage_ue_sign_docusign',
			label: 'Sign DocuSign',
			functionName: 'callViewDocu("'+poId+'")'
		});
		form.clientScriptModulePath = "./SEIU Disable DocuSign Action.js";

	}

	//BeforeSubmit
	function beforeSubmit(scriptContext){
		try{
			var recObj = scriptContext.newRecord;
			var recType = recObj.type;
			if(recType == 'purchaseorder'){
				if(scriptContext.type == 'create' || scriptContext.type == 'copy'){
					var docuSignA = recObj.getValue('custbody_docusign_actions');
					log.debug('docuSignA:',docuSignA);
					if(docuSignA == 6){
						recObj.setValue({fieldId: 'custbody_docusign_actions',value: 3, ignoreFieldChange: true});
						recObj.setValue({fieldId: 'custbody_docusign_vendor_sign_status',value: 1, ignoreFieldChange: true});
						log.debug('docuSignA 2 Value Updated:',docuSignA);
					}
				}
			}

		}catch(e){
			log.debug('Error in BS:',e);
		}
	}
  
	function setMemoFieldonSave(context) {
    try {
      log.debug({
        title: "before submit script start********",
      });
      var currRecord = context.newRecord;

      var memoValue = currRecord.getValue({
        fieldId: "memo",
      });
      log.debug({
        title: "memoValue " + memoValue,
      });

      if (memoValue) {
        currRecord.setValue({
          fieldId: "memo",
          value: memoValue,
          ignoreFieldChange: false,
        });
      }
      log.debug({
        title: "before submit script end********",
      });
    } catch (e) {
      log.debug("Error in BS:", e);
    }
  }

	function afterSubmit(scriptContext) {
		try{
			if(scriptContext.type == 'delete'){
				return;
			}
			var newRec = scriptContext.newRecord;
			log.debug('Rec Type: ',scriptContext.newRecord.type);
			var recId = newRec.id;
			log.debug('recId: ',recId);
			var oldRec = scriptContext.oldRecord;

			var scriptObj = runtime.getCurrentScript(); 
			var leadApprover = scriptObj.getParameter({name: 'custscript_lead_approver'}); // Toni
			log.debug('Toni leadApprover',leadApprover);
			var cfoApprover = scriptObj.getParameter({name: 'custscript_final_approver'}); // CFO Megan S Sweeney(final Approver, if contract is more than 1M $)
			log.debug('CFO Approver',cfoApprover);

			if(scriptContext.newRecord.type == 'purchaseorder'){
				var poRec = record.load({
					type:'purchaseorder',
					id: recId,
					isDynamic: true,
				});
				var docuAction = poRec.getValue({
					fieldId: 'custbody_docusign_actions'
				});
				if(docuAction != 2){// 2 = DocuSign Not Needed
					var vendorSignFlag = poRec.getValue({
						fieldId: 'custbody_docusign_vendor_sign_status'
					});
					log.debug('Docusign Action',docuAction+' & vendorSignFlag: '+vendorSignFlag);
					var vendorFlag = false;
//					if(docuAction == 3 && vendorSignFlag == 1){
//					vendorFlag = false;
//					}

					//START: BS-  Logic Moved to AS
					if(scriptContext.type == 'create' || scriptContext.type == 'copy'){
						log.debug('AS: docuAction:',docuAction);
						if(docuAction == 1){ // Attaching files from the header level field and Attaching Contact
							log.debug('In AS: Context is- '+scriptContext.type+' and docusign Action is Needed: '+docuAction);
							updateFileContactSubtab(scriptContext,recId,poRec,leadApprover,cfoApprover,vendorFlag);
						}
						if(docuAction == 6){
							poRec.setValue({fieldId: 'custbody_docusign_actions',value: 3, ignoreFieldChange: true});
							poRec.setValue({fieldId: 'custbody_docusign_vendor_sign_status',value: 1, ignoreFieldChange: true});
							updateFileContactSubtab(scriptContext,recId,poRec,leadApprover,cfoApprover,vendorFlag);
							log.debug('AS: Value Updated');
						}
					}
					//END: BS-  Logic Moved to AS			
					if(docuAction == 3){ //DocuSign Action is Vendor Signed (3), so send an email to user
//						if(vendorSignFlag == '' || vendorSignFlag == null || vendorSignFlag == undefined){
						vendorSignedSendEmail(poRec,oldRec);
//						}
					}
					poRec.save(true); // SAVE the PO record
					log.debug('AfterSubmit End-');
				}
			}else if(scriptContext.newRecord.type == 'customrecord_docusign_envelope_status'){
				log.debug('In DocuSign Envelope Status record');
				var envelopeRec = record.load({
					type:'customrecord_docusign_envelope_status',
					id: recId,
					isDynamic: true,
				});
				updateDocuSignAction(envelopeRec,oldRec);
			}
		}catch(e){
			log.error('Error in AS:',e);
		}
	}

	/*
	 * In After Submit, If the DocuSign Action is DocuSign Needed and context is Create/Copy, the below function 
	 * will remove the files from files Sub-tab(if context is make copy) and attach the file from the header file upload field.
	 * */
	function updateFileContactSubtab(scriptContext,recId,poRec,leadApprover,cfoApprover,vendorFlag){
		var attachedDocu = poRec.getValue({
			fieldId: 'custbody_prim_attach'
		});

		//24.09.2021
		log.debug('attachedDocu:',attachedDocu);

		var fileObjAtttachedDoc = file.load({id: attachedDocu});

		var fileType = fileObjAtttachedDoc.fileType;

		log.debug({details: "FileType: " + fileType});

		var fileName = fileObjAtttachedDoc.name;

		log.debug({details: "FileName: " + fileName});		

		var pos = fileName.lastIndexOf(".");       // get last position of `.`

		if (pos < 1) // extension not found
		{
			if (fileType == "WORD")
				fileName = fileName + ".doc";
			else if (fileType == "PDF")
				fileName = fileName + ".pdf";

			log.debug({details: "FileName2: " + fileName});	

			fileObjAtttachedDoc.name = fileName;

			var fileId = fileObjAtttachedDoc.save();

			log.debug({details: "fileId: " + fileId});	

		}			
		//24.09.2021
		log.debug('VendorFlag(If True then Vendor will be added):',vendorFlag);
		log.debug('contractTotal:',contractTotal);
		var vendorId = poRec.getValue({
			fieldId: 'entity'
		});
		log.debug('vendor ID:',vendorId);
		var contractTotal = poRec.getValue({
			fieldId: 'total'
		});
		log.debug('contractTotal:',contractTotal);

		var newContactArr = [];
		var contArr = [];
		var rContArr = [];
		var remContactArr = [];
		/*
		//Search to get the List of the Contacts
		var vendorContSearch = search.create({
			type: "contact",
			filters:
				[
				 ["custentity_seiu_docusign_contact","is",true], 
				 "AND", 
				 ["company.internalid","anyof",vendorId]
				 ],
				 columns:
					 [
					  search.createColumn({name: "entityid",sort: search.Sort.ASC}),
					  search.createColumn({name: "internalid"})
					  ]
		});
		var vendSearch = vendorContSearch.runPaged().count;
		log.debug("vendorContSearch result count",vendSearch);
		vendorContSearch.run().each(function(result){
			var vendContact = result.getValue('internalid');
			if(vendorFlag == true){ // Attach Vendor Contact only if Docusign Action is Docusign Needed (If Vendor has been signed already then contact should not be added)
				contArr.push(vendContact);
			}
			rContArr.push(vendContact)
			return true;
		});
		log.debug('contArr 1:',contArr);
		log.debug('rContArr Remove:',rContArr);
		 */
		for(var i=0 ; i<contArr.length ; i++){//Attach
			if(newContactArr.indexOf(contArr[i]) == -1){
				newContactArr.push(contArr[i]);
			}
		}
		log.debug('newContactArr:',newContactArr);

		for(var i=0 ; i<rContArr.length ; i++){//Remove
			if(remContactArr.indexOf(rContArr[i]) == -1){
				remContactArr.push(rContArr[i]);
			}
		}
		log.debug('remContactArr Remove:',remContactArr);

		if(leadApprover){
			newContactArr.push(leadApprover);
			log.debug('newContactArr (with Lead):',newContactArr);
			//Remove logic -Starts
			remContactArr.push(leadApprover);
			log.debug('remContactArr Remove(with Lead):',remContactArr);
			if(cfoApprover){
				remContactArr.push(cfoApprover);
				log.debug('remContactArr Remove(with CFO):',remContactArr)
			}//End- Remove logic
		}
		if(cfoApprover){ //if(Number(contractTotal) >= 250000 && cfoApprover){
			newContactArr.push(cfoApprover);
			log.debug('contArr (with CFO):',newContactArr)
		}
		log.debug('Final Contact Array List:',newContactArr);
		log.debug('Final Remove Contact Array List:',remContactArr);

		//Search to check the files are present already or not, if files exists then remove the already attached file.
		var fileIdArr = [];	
		var poSearchFile = search.create({
			type: "purchaseorder",
			filters:
				[
				 ["type","anyof","PurchOrd"],"AND", 
				 ["internalid","anyof",recId],"AND", 
				 ["mainline","is","F"]
				 ],
				 columns:
					 [
					  search.createColumn({name: "internalid",join: "file",label: "Internal ID"})
					  ]
		});
		var searchResultCount = poSearchFile.runPaged().count;
		log.debug("poSearchFile result count",searchResultCount);
		if(searchResultCount > 0){
			poSearchFile.run().each(function(result){
				var poFileId = result.getValue({
					name: 'internalid',
					join: 'file'
				});
				log.debug('poFileId:',poFileId);
				if(poFileId){
					fileIdArr.push(poFileId);	
				}
				return true;
			});
			log.debug('fileIdArr:',fileIdArr);
			if(fileIdArr.length > 0){
				var newArr = [];

				for(var i=0 ; i<fileIdArr.length ; i++){
					if(newArr.indexOf(fileIdArr[i]) == -1){
						newArr.push(fileIdArr[i]);
					}
				}
				log.debug('newArr:',newArr+' and newArr Length is: '+newArr.length);
				for(var rF = 0; rF<newArr.length; rF++){
					var detachFile = record.detach({
						record: {
							type: 'file',
							id: newArr[rF]
						},
						from: {
							type: 'purchaseorder',
							id:recId
						}
					})
					log.debug('File '+newArr[rF]+' Removed');
				}
			}else{
				log.debug('No Files in Array');
			}
		}else{
			log.debug('No Files');
		}

		try{//START- Remove existing contact in the Purchase Contract
			for(var rC=0; rC<remContactArr.length; rC++){
				var removeContact = record.detach({
					record: {
						type: 'contact',
						id: remContactArr[rC]
					},
					from: {
						type: 'purchaseorder',
						id: recId
					}
				});
				log.debug('Contact '+remContactArr[rC]+' Removed');
			}
		}catch(e){
			log.debug('Error in Removing Contact:',e.message);
		}//END - Remove existing contact in the Purchase Contract

		if(attachedDocu){//START - Attach the File
			var attachFile = record.attach({
				record: {
					type: 'file',
					id: attachedDocu
				},
				to: {
					type: 'purchaseorder',
					id: recId
				}
			});
			log.debug('File attached***');
		}//END - Attach the File

		for(var vC=0; vC<newContactArr.length; vC++){//START - Attach the Contacts
			var attachContact = record.attach({
				record: {
					type: 'contact',
					id: newContactArr[vC]
				},
				to: {
					type: 'purchaseorder',
					id: recId
				}
			});
			log.debug('Contact: '+newContactArr[vC]+' attached***');
		}//END - Attach the Contacts
	}

	/*In After Submit, If the DocuSign Action is Vendor Signed, the below function will 
	 * send an email to User.
	 * */
	function vendorSignedSendEmail(poRec,oldRec){
		log.debug('In SendEmail function');

		var creadtedBy = poRec.getValue({
			fieldId: 'custbody_nsts_gaw_created_by'
		});
		log.debug('creadtedBy:',creadtedBy);
		if(creadtedBy){
			var empRec = record.load({
				type: 'employee',
				id: creadtedBy,
				isDynamic: true,
			});
			var emailId = empRec.getValue({
				fieldId: 'email'
			});
			log.debug('emailId:',emailId);
			if(emailId){
				var poIDNum = poRec.getValue({
					fieldId: 'tranid'
				});
				log.debug('poIDNum:',poIDNum);
				var emailSentCheck = poRec.getValue({
					fieldId: 'custbody_email_sent_docusign'
				});
				log.debug('emailSentCheck:',emailSentCheck);
				if(emailSentCheck == false){ // If emailSentCheck == false, need to send an email
					var senderId = -5;
					var recipientEmail = emailId;
					var recipientId = creadtedBy;

					email.send({
						author: senderId,
						recipients: recipientId,
						subject: 'Vendor DocuSign Completed for PO# '+poIDNum,
						body: 'Vendor has signed the document for PO#'+ poIDNum+'. The PO is routed for approval in NetSuite.',
					});
					log.debug('Email sent');

					var memoValue = oldRec.getValue({
						fieldId: 'memo',
					})
					log.debug('memoValue:',memoValue);
					if(memoValue){
						poRec.setValue({
							fieldId: 'memo',
							value: memoValue,
							ignoreFieldChange: true
						});
					}else{
						poRec.setValue({
							fieldId: 'memo',
							value: 'N/A',
							ignoreFieldChange: true
						});
					}
					poRec.setValue({
						fieldId: 'custbody_email_sent_docusign',
						value: true,
						ignoreFieldChange: true
					});
				}
			}	
		}
	} //End- vendorSignedSendEmail

	function updateDocuSignAction(envelopeRec,oldRec){
		var envStatus = envelopeRec.getValue({
			fieldId: 'custrecord_docusign_status'
		});
		log.debug('envStatus:',envStatus);
		if(envStatus == 'sent' || envStatus == 'completed'){
			var poRecId = envelopeRec.getValue({
				fieldId: 'custrecord_docusign_recordid'
			});
			log.debug('poRecId:',poRecId);	
			if(poRecId){
				var poRec = record.load({
					type:'purchaseorder',
					id: poRecId,
					isDynamic: true,
				});
				var vendorSignCheck = poRec.getValue({
					fieldId: 'custbody_vendor_already_signed'
				});
				log.debug('vendorSignCheck',vendorSignCheck);
				var vendorSignCheck = poRec.getValue({
					fieldId: 'custbody_docusign_vendor_sign_status'
				});
				log.debug('vendorSignCheck',vendorSignCheck);
				if(envStatus == 'sent' && vendorSignCheck == 1){
					var memoValue = oldRec.getValue({
						fieldId: 'memo',
					})
					log.debug('memoValue:',memoValue);
					if(memoValue){
						poRec.setValue({
							fieldId: 'memo',
							value: memoValue,
							ignoreFieldChange: true
						});
					}else{
						poRec.setValue({
							fieldId: 'memo',
							value: memoValue,
							ignoreFieldChange: true
						});
					}
					poRec.setValue('custbody_docusign_vendor_sign_status',2);
					var savePO = poRec.save(true);
					log.debug('PO Updated with vendor Signed #',savePO);
				}
				if(envStatus == 'sent'){
					if(vendorSignCheck == '' || vendorSignCheck == null || vendorSignCheck == undefined){
						var id = record.submitFields({
							type: 'purchaseorder',
							id: poRecId,
							values: {
								custbody_docusign_actions: 4 // 4 = DocuSign Sent
							},
							options: {
								enableSourcing: false,
								ignoreMandatoryFields : true
							}
						});
					}
				}
				if(envStatus == 'completed'){
					var id = record.submitFields({
						type: 'purchaseorder',
						id: poRecId,
						values: {
							custbody_docusign_actions: 5 // 5 = DocuSign Completed
						},
						options: {
							enableSourcing: false,
							ignoreMandatoryFields : true
						}
					});
				}

			}
		}
	} //End - updateDocuSignAction

	return {
		beforeLoad: beforeLoad,
		beforeSubmit: setMemoFieldonSave,
		afterSubmit: afterSubmit
	};

});