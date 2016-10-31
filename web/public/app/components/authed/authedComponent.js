"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("authed", {
        templateUrl: "app/components/authed/authed.html",
        bindings : {
        	authObj : "<",
            spreadsheets : "<",
            applications : "<"
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
            var fanOut = {};
            fanOut['users/' + authObj.uid + '/applications/' + spreadsheetId] = true;
            fanOut['spreadsheets/' + spreadsheetId + '/applicants/' + authObj.uid] = authObj.displayName;
            firebase.database().ref().update(fanOut);
        };

        this.newSpreadsheet = function(spreadsheetId){
            var authObj = Auth.$getAuth();
            var fanOut = {};
            fanOut['users/' + authObj.uid + '/spreadsheets/' + spreadsheetId] = true;
            fanOut['spreadsheets/' + spreadsheetId + '/users/' + authObj.uid] = {
                name: authObj.displayName,
                admin: true,
                active: true,
            };
            firebase.database().ref().update(fanOut).then(function(){
                $state.go(".spreadsheet", {spreadsheetId : spreadsheetId});
            });
        };

        this.withdrawApplication = function(spreadsheetId){
            var authObj = Auth.$getAuth();
            var fanOut = {};
            fanOut['users/' + authObj.uid + '/applications/' + spreadsheetId] = null;
            fanOut['spreadsheets/' + spreadsheetId + '/applicants/' + authObj.uid] = null;
            firebase.database().ref().update(fanOut);
        };

	}

})();
