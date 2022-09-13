/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/search"], function (search) {
  function validateEmailandAutoSourcing(context) {
    var currentRecord = context.currentRecord;
    var contactFields = {
      firstName: "custrecord_lz_contact_first_name",
      midName: "custrecord_lz_contact_mid_name",
      lastName: "custrecord_lz_contact_last_name",
      contTitle: "custrecord_job_title",
      phoneNo: "custrecord_lz_phone_number",
      comments: "custrecord_lz_comments",
      contactType: "custrecord_lz_contact_category",
    };

    var msg =
      "Email is associated with an existing contact.\nDo you want to copy the associated contact?";
    var isSetNull = false;

    try {
      var contactEmail = currentRecord.getValue({
        fieldId: "custrecord_lz_contact_email",
      });
      if (contactEmail) {
        if (context.fieldId == "custrecord_lz_contact_email") {
          var searchResult = searchContactDate(contactEmail, contactFields);

          if (searchResult.isDataExist) {
            console.log(searchResult.data);
            if (confirm(msg)) {
              setValuestoform(searchResult.data);
              disableFields(currentRecord, contactFields);
              return true;
            } else {
              if (contactEmail) {
                isSetNull = true;
                currentRecord.setValue({
                  fieldId: "custrecord_lz_contact_email",
                  value: "",
                  ignoreField: true,
                });
                setValuestoform(searchResult.data);
                enableFields(currentRecord, contactFields);
                return true;
              }
            }
          }
        }
      } else {
        isSetNull = true;
        setValuestoform(searchResult.data);
      }
    } catch (e) {
      log.error({
        title: "error in code",
        details: e,
      });
    }

    function setValuestoform(contactData) {
      for (field in contactFields) {
        if (contactData[field] != "noData") {
          // console.log("feilds" + field);
          // console.log("fields internal id" + contactFields[field]);
          // console.log("fields value" + contactData[field]);
          currentRecord.setValue({
            fieldId: contactFields[field],
            value: contactData[field],
            ignoreField: true,
          });
        }
        if (isSetNull) {
          currentRecord.setValue({
            fieldId: contactFields[field],
            value: "",
            ignoreField: true,
          });
        }
      }
    }
  }

  function disableFields(currentRecord, contactFields) {
    for (field in contactFields) {
      var field = currentRecord.getField({
        fieldId: contactFields[field],
      });

      field.isDisabled = true;
    }
  }

  function enableFields(currentRecord, contactFields) {
    for (field in contactFields) {
      var field = currentRecord.getField({
        fieldId: contactFields[field],
      });

      field.isDisabled = false;
    }
  }

  function searchContactDate(contactEmail, contactFields) {
    var contactData = [];
    var isDataAvial = false;
    var searchColumn = [];
    for (field in contactFields) {
      searchColumn.push(
        search.createColumn({
          name: contactFields[field],
        })
      );
    }
    var customrecord_localized_contactSearchObj = search.create({
      type: "customrecord_localized_contact",
      filters: [["custrecord_lz_contact_email", "is", contactEmail]],
      columns: searchColumn,
    });
    var searchResultCount =
      customrecord_localized_contactSearchObj.runPaged().count;
    log.debug(
      "customrecord_localized_contactSearchObj result count",
      searchResultCount
    );
    customrecord_localized_contactSearchObj.run().each(function (result) {
      // .run().each has a limit of 4,000 results

      for (field in contactFields) {
        var value = result.getValue(contactFields[field]);
        contactData[field] = setFieldsinArray(value);
      }

      return true;
    });
    // console.log(contactData);

    if (searchResultCount > 0) {
      isDataAvial = true;
    }
    return {
      isDataExist: isDataAvial,
      data: contactData,
    };
  }

  function setFieldsinArray(data) {
    if (data) {
      return data;
    } else {
      return "noData";
    }
  }

  return {
    fieldChanged: validateEmailandAutoSourcing,
  };
});
