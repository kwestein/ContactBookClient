jQuery(function ($) {
   var serverUrl = "http://localhost:3000",
       contactsPath = "/contacts",

        serializeElement = function ($element) {
            var serializedElement = {};
            
            var arr = $element.serializeArray();
            for (var i=0;i<arr.length;i++)
            { 
                console.log(arr[i]);
            }
            
            $.map($element.serializeArray(), function (attribute) {
                if (typeof serializedElement[attribute.name] === "undefined") {
                    serializedElement[attribute.name] = attribute.value;
                } else {
                    if (typeof serializedElement[attribute.name].push !== "function") {
                        serializedElement[attribute.name] = [serializedElement[attribute.name]];
                    }
                    serializedElement[attribute.name].push(attribute.value);
                }
            });
            
            return serializedElement;
        },

        renderContacts = function () {
            $.getJSON(serverUrl + contactsPath, function (response) {
                var contacts = response.contacts,
                    $contacts = createContactsElement(contacts);

                $("form").append($contacts);
            });
        },

        saveContacts = function () {
            var contacts = [];

            $("#contacts .contact").each(function () {
                var $contact = $(this),
                    contact = serializeElement($contact.find("> input"))

                contact.phoneNumbers = [];
                $contact.find(".phoneNumber").each(function () {
                    var phoneNumber = serializeElement($(this));
                    contact.phoneNumbers.push(phoneNumber);
                });

                contact.emailAddresses = [];
                $contact.find(".emailAddress").each(function () {
                    var emailAddress = serializeElement($(this));
                    contact.emailAddresses.push(emailAddress);
                });

                contacts.push(contact);
            });

            $.ajax(serverUrl + contactsPath, {
                "contentType": "application/json",
                "data": JSON.stringify({"contacts": contacts}),
                "processData": false,
                "success": function () {
                    alert("Contacts saved successfully");
                },
                "type": "PUT"
            });
        },

        createContactsElement = function (contacts) {
            var $contacts = $("<fieldset></fieldset>", {
                    "id": "contacts"
                }),
                $legend = $("<legend></legend>"),
                $add = $("<button></button>", {
                    "type": "button"
                }),
                $save = $("<button></button>", {
                    "type": "button"
                });

            $legend.text("Contact Book");

            $add
                .text("Add Contact")
                .on("click", function () {
                    var $contact = createContactElement({
                        "name":"",
                        "id": 0,
                        "birthday": "",
                        "phoneNumbers": [],
                        "emailAddresses": []
                    });
                    $contacts.append($contact);
                });

            $save
                .text("Save Contacts")
                .on("click", function () {
                    saveContacts();
                });

            $contacts
                .append($legend)
                .append($add)
                .append($save);

            $.each(contacts, function (index, contact) {
                var $contact = createContactElement(contact);
                $contacts.append($contact);
            });

            return $contacts;
        },

        createContactElement = function (contact) {
            var $contact = $("<fieldset></fieldset>", {
                    "class": "contact"
                }),
                $legend = $("<legend></legend>"),
                $remove = $("<button></button>", {
                    "type": "button",
                    "class": "remove"
                }),
                $nameLabel = $("<label></label>"),
                $nameValue = $("<input/>", {
                    "type": "text",
                    "name": "name"
                }),
                $idLabel = $("<label></label>"),
                $idValue = $("<input/>", {
                    "type": "text",
                    "name": "id"
                }),
                $birthdayLabel = $("<label></label>"),
                $birthdayValue = $("<input/>", {
                    "type": "text",
                    "name": "birthday"
                }),
                $phoneNumbers = createPhoneNumbersElement(contact.phoneNumbers),
                $emailAddresses = createEmailAddressesElement(contact.emailAddresses);
                

            $legend.text("Contact");

            $remove
                .text("Remove Contact")
                .on("click", function () {
                    $(this).parent().remove();
                });
                
            $nameLabel.text("Name");
            $nameValue.val(contact.name);
            
            $idLabel.text("ID");
            $idValue.val(contact.id);

            $birthdayLabel.text("Birthday");
            $birthdayValue.val(contact.birthday);

            $contact
                .append($legend)
                .append($remove)
                .append($nameLabel)
                .append($nameValue)
                .append($idLabel)
                .append($idValue)
                .append($birthdayLabel)
                .append($birthdayValue)
                .append($phoneNumbers)
                .append($emailAddresses);

            return $contact;
        },

        createPhoneNumbersElement = function (phoneNumbers) {
            var $phoneNumbers = $("<fieldset></fieldset>", {
                    "class": "phoneNumbers"
                }),
                $legend = $("<legend></legend>"),
                $add = $("<button></button>", {
                    "type": "button"
                });

            $legend.text("Phone Numbers");

            $add
                .text("Add Phone Number")
                .on("click", function () {
                    var $phoneNumber = createPhoneNumberElement("");
                    $phoneNumbers.append($phoneNumber);
                });

            $phoneNumbers
                .append($legend)
                .append($add);

            $.each(phoneNumbers, function (index, phoneNumber) {
                var $phoneNumber = createPhoneNumberElement(phoneNumber);
                $phoneNumbers.append($phoneNumber);
            });

            return $phoneNumbers;
        },

        createPhoneNumberElement = function (phoneNumber) {
            var $phoneNumber = $("<fieldset></fieldset>", {
                    "class": "phoneNumber"
                }),
                $legend = $("<legend></legend>"),
                $remove = $("<button></button>", {
                    "type": "button",
                    "class": "remove"
                }),
                $phoneNumberValue = $("<input/>", {
                    "type": "text",
                    "name": "value"
                });

            $legend.text("Phone Number");

            $remove
                .text("Remove Phone Number")
                .on("click", function () {
                    $(this).parent().remove();
                });

            $phoneNumberValue.val(phoneNumber.value);

            $phoneNumber
                .append($legend)
                .append($remove)
                .append($phoneNumberValue);

            return $phoneNumber;
        },

        createEmailAddressesElement = function (emailAddresses) {
            var $emailAddresses = $("<fieldset></fieldset>"),
                $legend = $("<legend></legend>"),
                $add = $("<button></button>", {
                    "type": "button"
                });

            $legend.text("Email Addresses");

            $add
                .text("Add Email Address")
                .on("click", function () {
                    var $emailAddress = createEmailAddressElement("");
                    $emailAddresses.append($emailAddress);
                });

            $emailAddresses
                .append($legend)
                .append($add);

            $.each(emailAddresses, function (index, emailAddress) {
                var $emailAddress = createEmailAddressElement(emailAddress);
                $emailAddresses.append($emailAddress);
            });

            return $emailAddresses;
        },

        createEmailAddressElement = function (emailAddress) {
            var $emailAddress = $("<fieldset></fieldset>", {
                    "class": "emailAddress"
                }),
                $legend = $("<legend></legend>"),
                $remove = $("<button></button>", {
                    "type": "button",
                    "class": "remove"
                }),
                $emailAddressValue = $("<input/>", {
                    "type": "text",
                    "name": "value"
                });

            $legend.text("Email Address");

            $remove
                .text("Remove Email Address")
                .on("click", function () {
                    $(this).parent().remove();
                });

            $emailAddressValue.val(emailAddress.value);

            $emailAddress
                .append($legend)
                .append($remove)
                .append($emailAddressValue);

            return $emailAddress;
        };

    renderContacts();
});
