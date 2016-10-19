"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("spreadsheetAdmin", {
        templateUrl: "app/components/spreadsheet/spreadsheetAdmin.html",
        bindings : {
            users: "<",
            applications: "<",
            spreadsheet: "<",
            authObj: "<"
        },
        controller : ["$stateParams", controller]
    });

    function controller($stateParams){

        var ctrl = this;

        this.changeName = function(uid, newName){
            ctrl.users.$ref().child(uid).child('name').set(newName);
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
