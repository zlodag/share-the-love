"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("spreadsheetAdmin", {
        templateUrl: "app/components/spreadsheetAdmin/spreadsheetAdmin.html",
        bindings : {
            users: "<",
            authObj: "<",
            applicants : "<"
        },
        controller: ["$stateParams", controller]
    });

    function controller($stateParams){

        var ctrl = this;

        ctrl.changeUserName = function(user, userName){
            user.name = userName;
            ctrl.users.$save(user);
        };

		// this.changeSpreadsheetName = function(spreadsheetName){
		// 	console.log(spreadsheetName);
		// 	firebase.database().ref("spreadsheets").child(ctrl.spreadsheet.$id).child('name').set(spreadsheetName);
		// };

        ctrl.toggleProperty = function(user, property){
        	user[property] = !user[property];
        	ctrl.users.$save(user);
        };

        ctrl.decline = function(user){
            ctrl.applicants.$remove(user);
        };

        ctrl.accept = function(user){
        	var fanOut = {};
        	var spreadsheetId = $stateParams.spreadsheetId;
        	fanOut['spreadsheets/' + spreadsheetId + '/applicants/' + user.$id] = null;
        	fanOut['spreadsheets/' + spreadsheetId + '/users/' + user.$id] = {
        		active: true,
        		admin: false,
        		name: user.$value
        	};
        	fanOut['spreadsheetIndex/' + user.$id + '/' + spreadsheetId] = true;
        	console.log(fanOut);
			firebase.database().ref().update(fanOut);

        	// ctrl.applicants.$ref().parent().set(fanOut);
         //    ctrl.applicants.$remove(user);


         //    firebase.database().ref("users").child(application.$id).child(ctrl.spreadsheet.$id).set(ctrl.spreadsheet.$value);

         //    ctrl.applications.$remove(applicant).then(function(){
         //        return ctrl.users.$ref().child(application.$id).set({
         //            name: application.$value,
         //            active: true,
         //            admin: false
         //        });
         //    }).then(function(){
         //        return firebase.database().ref("users").child(application.$id).child(ctrl.spreadsheet.$id).set(ctrl.spreadsheet.$value);
         //    }).then(function(){
         //        console.log('Successfully approved');
         //    }, function(error){
         //        console.error('An error occurred: ', error);
         //    });
        };

    }

})();
