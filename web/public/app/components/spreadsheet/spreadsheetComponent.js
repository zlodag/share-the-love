"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("spreadsheet", {
        templateUrl: "app/components/spreadsheet/spreadsheet.html",
        bindings : {
            users: "<",
            me: "<",
            spreadsheet: "<"
        },
        controller: controller
    });

    function controller(){

        var ctrl = this;

		ctrl.admin = false;

        this.changeUserName = function(uid, newName){
            ctrl.users.$ref().child(uid).child('name').set(newName);
        };

		this.changeSpreadsheetName = function(spreadsheetName){
			console.log(spreadsheetName);
			firebase.database().ref("spreadsheets").child(ctrl.spreadsheet.$id).child('name').set(spreadsheetName);
		};

        this.toggleProperty = function(user, property){
            ctrl.users.$ref().child(user.$id).child(property).set(!user[property]);
        };

        this.newSpreadsheet = function(spreadsheetName){
            var users = {};
            var authObj = this.authObj;
            users[authObj.uid] = {
                name: authObj.displayName,
                admin: true,
                active: true,
            };
            firebase.database().ref("spreadsheets").push({
                name: spreadsheetName,
                users: users
            }).then(function(newSpreadsheetRef){
                firebase.database().ref("users").child(authObj.uid).child(newSpreadsheetRef.key).set(spreadsheetName);
            });
        };

        this.declineApplication = function(application){
            ctrl.applications.$remove(application).then(function(){
                console.log('Successfully declined');
            }, function(error){
                console.error('An error occurred: ', error);
            });
        };

        this.approveApplication = function(application){
            ctrl.applications.$remove(application).then(function(){
                return ctrl.users.$ref().child(application.$id).set({
                    name: application.$value,
                    active: true,
                    admin: false
                });
            }).then(function(){
                return firebase.database().ref("users").child(application.$id).child(ctrl.spreadsheet.$id).set(ctrl.spreadsheet.$value);
            }).then(function(){
                console.log('Successfully approved');
            }, function(error){
                console.error('An error occurred: ', error);
            });
        };

    }

})();
