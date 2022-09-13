/**
 *@NApiVersion 2.1
 *@NScriptType ClientScript
 */
define(["N/search"], function (search) {
  function saveRecord(context) {
    log.debug("validate primary adress saveRecord start");
    let isPrimaryAddressAvailabe = false;
    const currentRecordInternalId = context.currentRecord.id;
    console.log("current internla id is " + currentRecordInternalId);

    let isPriamry = context.currentRecord.getValue({
      fieldId: "custrecord_locallist_primaryaddress",
    });

    concatAllAddFields(context);

    if (isPriamry) {
      let customer = context.currentRecord.getValue({
        fieldId: "custrecord_seiu_local_add_customer",
      });

      log.debug("customer is ", customer);

      if (customer) {
        isPrimaryAddressAvailabe = searchPrimaryAdress(
          customer,
          currentRecordInternalId
        );
      }
      if (isPrimaryAddressAvailabe) {
        return true;
      } else {
        alert("Primary Adress is already available");
        log.debug("validate primary adress saveRecord end");
        return false;
      }
    } else {
      return true;
    }
  }

  function concatAllAddFields(context) {
    let currRecord = context.currentRecord;
    let fullAddress = "";
    const addressElement = {
      country: "custrecord_localist_countery",
      address1: "custrecord_localist_address_1",
      address2: "custrecord_localist_address_2",
      city: "custrecord_localist_address_1",
      state: "custrecord_localist_state",
      zip: "custrecord_localist_state	",
    };

    // for (const key in addressElement) {
    //   const element = addressElement[key];
    //     fullAddress = fullAddress + currRecord.getValue({
    //       fieldId: element
    //     }) + ',';
    // }

    const country = currRecord.getText({
      fieldId: addressElement.country,
    });

    const address1 = currRecord.getValue(addressElement.address1);
    const address2 = currRecord.getValue(addressElement.address2);
    const city = currRecord.getValue({
      fieldId: addressElement.city,
    });

    const state = currRecord.getText(addressElement.state);
    const zip = currRecord.getValue(addressElement.zip);

    if (address1) {
      fullAddress = fullAddress + address1;
    }
    if (address2) {
      fullAddress = fullAddress + " " + address2;
    }
    if (city) {
      fullAddress = fullAddress + " " + city;
    }
    if (state) {
      fullAddress = fullAddress + " " + state;
    }

    if (country) {
      fullAddress = fullAddress + " " + country;
    }
    if (zip) {
      fullAddress = fullAddress + " " + zip;
    }

    console.log(fullAddress);
    // custrecord_locallist_fulladdress

    currRecord.setValue({
      fieldId: "custrecord_locallist_fulladdress",
      value: fullAddress,
      ignoreFieldChange: false,
    });
  }

  function fieldChanged(context) {
    log.debug("validate primary adress fieldchange start");
    var isField = context.fieldId;

    if (isField == "custrecord_locallist_primaryaddress") {
      let isPrimaryAddressAvailabe = false;
      let customer = context.currentRecord.getValue({
        fieldId: "custrecord_seiu_local_add_customer",
      });

      log.debug("customer is ", customer);

      if (customer) {
        isPrimaryAddressAvailabe = searchPrimaryAdress(customer);
      }

      if (isPrimaryAddressAvailabe) {
        alert("Primary Adress is already available");
      }
      log.debug("validate primary adress fieldchange end");
    }
  }

  function searchPrimaryAdress(customer, currentRecordInternalId) {
    debugger;
    let issameRecord = false;
    const customrecord_seiu_localist_addressSearchColCustomer =
      search.createColumn({ name: "custrecord_seiu_local_add_customer" });
    const customrecord_seiu_localist_addressSearchColPrimaryAddress =
      search.createColumn({ name: "custrecord_locallist_primaryaddress" });
    const customrecord_seiu_localist_addressSearchColAddress1 =
      search.createColumn({ name: "custrecord_localist_address_1" });
    const customrecord_seiu_localist_addressSearchColInternalId =
      search.createColumn({ name: "internalid" });
    const customrecord_seiu_localist_addressSearch = search.create({
      type: "customrecord_seiu_localist_address",
      filters: [
        ["custrecord_seiu_local_add_customer", "anyof", customer],
        "AND",
        ["custrecord_locallist_primaryaddress", "is", "T"],
      ],
      columns: [
        customrecord_seiu_localist_addressSearchColCustomer,
        customrecord_seiu_localist_addressSearchColPrimaryAddress,
        customrecord_seiu_localist_addressSearchColAddress1,
        customrecord_seiu_localist_addressSearchColInternalId,
      ],
    });

    const primaryAdresssearchResult =
      customrecord_seiu_localist_addressSearch.runPaged().count;
    customrecord_seiu_localist_addressSearch.run().each((result) => {
      const internalId = result.getValue(
        customrecord_seiu_localist_addressSearchColInternalId
      );
      log.debug("internal Id");
      console.log("internal id is " + internalId);
      if (internalId == currentRecordInternalId) {
        issameRecord = true;
      }
      return true;
    });
    log.debug({
      title: "issameRecord is",
      details: issameRecord,
    });

    if (issameRecord) {
      return true;
    } else if (primaryAdresssearchResult <= 0) {
      return true;
    } else {
      return false;
    }
  }

  function pageInit(context){
    let fullAddress = context.currentRecord.getField({
      fieldId: "custrecord_locallist_fulladdress"
    });

    fullAddress.isDisabled = true;

    let scriptId = context.currentRecord.getField({
      fieldId: "scriptid"
    });

    scriptId.isVisible = false;

  }


  return {
    // pageInit: pageInit,
    saveRecord: saveRecord,
    // validateField: validateField,
    // fieldChanged: fieldChanged,
    // postSourcing: postSourcing,
    // lineInit: lineInit,
    // validateDelete: validateDelete,
    // validateInsert: validateInsert,
    // validateLine: validateLine,
    // sublistChanged: sublistChanged
  };
});

