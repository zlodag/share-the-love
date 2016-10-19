"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("admin", {
        templateUrl: "app/components/admin/admin.html",
        controller: ["Auth", "$state", controller]
    });

    function controller(Auth, $state){

        this.joinSpreadsheet = function(spreadsheetId){
            var authObj = Auth.$getAuth();
            firebase.database().ref("applications").child(spreadsheetId).child(authObj.uid).set(authObj.displayName).then(function(){
                console.log("Success!");
            }, function(error){
                console.error("there was an error", error);
            });
        };

        this.newSpreadsheet = function(spreadsheetName){
            var authObj = Auth.$getAuth();
            var users = {};
            users[authObj.uid] = {
                name: authObj.displayName,
                admin: true,
                active: true,
            };
            var newSpreadsheetRef = firebase.database().ref("spreadsheets").push();
            newSpreadsheetRef.set({
                name: spreadsheetName,
                users: users
            }).then(function(){
                return firebase.database().ref("users").child(authObj.uid).child(newSpreadsheetRef.key).set(spreadsheetName);
            }).then(function(){
                $state.go("authed.spreadsheets.spreadsheet.admin", {spreadsheetId : newSpreadsheetRef.key});
            });
        };

    }

})();
