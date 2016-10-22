"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("authed", {
        templateUrl: "app/components/authed/authed.html",
        bindings : {
        	authObj : "<",
            spreadsheetIndex : "<"
        },
        controller : ["Auth", "$state", controller]
    });

    function controller(Auth, $state){

        this.signOut = function(){
            Auth.$signOut().then(function(){
                $state.go("signIn");
            });
        };

        this.joinSpreadsheet = function(spreadsheetId){
            var authObj = Auth.$getAuth();
            firebase.database().ref("spreadsheets").child(spreadsheetId).child("applicants").child(authObj.uid).set(authObj.displayName).then(function(){
                console.log("Success!");
            }, function(error){
                console.error("There was an error", error);
            });
        };

        this.newSpreadsheet = function(spreadsheetId){
            var authObj = Auth.$getAuth();
            var fanOut = {};
            fanOut['spreadsheetIndex/' + authObj.uid + '/' + spreadsheetId] = true;
            fanOut['spreadsheets/' + spreadsheetId + '/users/' + authObj.uid] = {
                name: authObj.displayName,
                admin: true,
                active: true,
            };
            firebase.database().ref().update(fanOut).then(function(){
                $state.go(".spreadsheet", {spreadsheetId : spreadsheetId});
            });
        };

	}

})();
