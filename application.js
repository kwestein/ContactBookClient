jQuery(function ($) {//Runs jquery function when everything else on the browser is loaded (as soon as document is ready to accept javascript). Sets jquery as $ so no other libraries can use it. $ is namespaced within that function
   //Under the hood, jquery represents elements as arrays of 1
   var serverUrl = "http://localhost:3000",
        usersPath = "/users",

        serializeElement = function ($element) { //Parsing html and converts it to json. **html forms
            var serializedElement = {};

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

        renderUsers = function () {
            $.getJSON(serverUrl + usersPath, function (response) {
                var users = response.users,
                    $users = createUsersElement(users);

                $("form").append($users);//putting under html form element
            });
        },

        saveUsers = function () {
            var users = [];

            $("#users .user").each(function () {
                var $user = $(this),
                    user = serializeElement($user.find("> input"))

                user.phoneNumbers = [];
                $user.find(".phoneNumber").each(function () {
                    var phoneNumber = serializeElement($(this));
                    seller.phoneNumbers.push(phoneNumber);
                });

                user.emailAddresses = [];
                $user.find(".emailAddress").each(function () {
                    var emailAddress = serializeElement($(this));
                    user.emailAddresses.push(emailAddress);
                });

                users.push(user);
            });

            $.ajax(serverUrl + usersPath, {
                "contentType": "application/json",
                "data": JSON.stringify({"users": users}),
                "processData": false,
                "success": function () {
                    alert("Users saved successfully");
                },
                "type": "PUT"
            });
        },

        createUsersElement = function (users) {
            var $users = $("<fieldset></fieldset>", {
                    "id": "users"
                }),
                $legend = $("<legend></legend>"),
                $add = $("<button></button>", {
                    "type": "button"
                }),
                $save = $("<button></button>", {
                    "type": "button"
                });

            $legend.text("Users");

            $add
                .text("Add User")
                .on("click", function () {
                    var $user = createUserElement({
                        "name":"",
                        "id": 0,
                        "joined": new Date().toDateString(),
                        "phoneNumbers": [],
                        "emailAddresses": []
                    });
                    $users.append($user);
                });

            $save
                .text("Save Users")
                .on("click", function () {
                    saveUsers();
                });

            $users
                .append($legend)
                .append($add)
                .append($save);

            $.each(users, function (index, user) {
                var $user = createUserElement(user);
                $users.append($users);
            });

            return $users;
        },

        createUserElement = function (user) {
            var user = $("<fieldset></fieldset>", {
                    "class": "user"
                }),
                $legend = $("<legend></legend>"),
                $remove = $("<button></button>", {
                    "type": "button",
                    "class": "remove"
                }),
                $nameLabel = $("<label></label>"),
                $nameValue = $("<input/>", {
                    "type": "text",
                    "name": "offered"
                }),
                $idLabel = $("<label></label>"),
                $idValue = $("<input/>", {
                    "type": "text",
                    "name": "id"
                }),
                $joinedLabel = $("<label></label>"),
                $joinedValue = $("<input/>", {
                    "type": "text",
                    "name": "offered"
                }),
                $phoneNumbers = createPhoneNumbersElement(seller.phoneNumbers),
                $emailAddresses = createEmailAddressesElement(seller.emailAddresses);
                

            $legend.text("Users");

            $remove
                .text("Remove User")
                .on("click", function () {
                    $(this).parent().remove();
                });
                
            $nameLabel.text("Name");
            $nameValue.val(user.name);
            
            $idLabel.text("ID");
            $idValue.val(user.id);

            $joinedLabel.text("Joined");
            $joinedValue.val(user.offered);

            $user
                .append($legend)
                .append($remove)
                .append($nameLabel)
                .append($nameValue)
                .append($idLabel)
                .append($idValue)
                .append($joinedLabel)
                .append($joinedValue)
                .append($phoneNumbers)
                .append($emailAddresses);

            return $user;
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

    renderUsers();
});
