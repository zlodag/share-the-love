"use strict";
(function() {
	angular
		.module("shareTheLove")
        .config(["$stateProvider", "$urlRouterProvider", states]);

    function states($stateProvider, $urlRouterProvider) {
        $stateProvider.state({
            name: 'signIn',
            url: '/signIn',
            component: 'signIn'
        }).state({
            name: 'authed',
            url: '',
            abstract: true,
            resolve: {
                authObj: ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                }],
                spreadsheets: ["authObj", "$firebaseArray", function(authObj, $firebaseArray){
                    return $firebaseArray(firebase.database().ref("users").child(authObj.uid)).$loaded();
                }]
            },
            component: 'authed'
        }).state({
            name: 'authed.admin',
            url: '/admin',
            component: 'admin'
        }).state({
            name: 'authed.spreadsheets',
            url: '/',
            component: 'spreadsheets'
        }).state({
            name: 'authed.spreadsheets.spreadsheet',
            url: ':spreadsheetId',
            resolve: {
                spreadsheet: ["$stateParams", "spreadsheets", function($stateParams, spreadsheets){
                    return spreadsheets.$getRecord($stateParams.spreadsheetId);
                }],
                users: ["$stateParams", "$firebaseArray", function($stateParams, $firebaseArray){
                    return $firebaseArray(firebase.database().ref("spreadsheets").child($stateParams.spreadsheetId).child("users")).$loaded();
                }],
                me: ["authObj", "users", function(authObj, users){
                    return users.$getRecord(authObj.uid);
                }],
                transactions: ["$stateParams", "$firebaseArray", function($stateParams, $firebaseArray) {
                    return $firebaseArray(firebase.database().ref("transactions").child($stateParams.spreadsheetId)).$loaded();
                }]
            },
            component: 'spreadsheet'
        }).state({
            name: 'authed.spreadsheets.spreadsheet.transactions',
            url: '/transactions',
            component: 'transactions'
        }).state({
            name: 'authed.spreadsheets.spreadsheet.admin',
            url: '/admin',
            resolve: {
                applications: ["$stateParams", "$firebaseArray", function($stateParams, $firebaseArray){
                    return $firebaseArray(firebase.database().ref("applications").child($stateParams.spreadsheetId)).$loaded();
                }]
            },
            component: 'spreadsheetAdmin'
        }).state({
            name: 'authed.spreadsheets.spreadsheet.new',
            url: '/new',
            component: 'transactionNew'
        }).state({
            name: 'authed.spreadsheets.spreadsheet.transaction',
            url: '/:transactionId',
            resolve: {
                transaction: ["$stateParams", "transactions", function($stateParams, transactions){
                    console.log(transactions);
                    return transactions.$getRecord($stateParams.transactionId);
                }]
            },
            component: 'transactionDetail'
        });

        $urlRouterProvider.otherwise('/signIn');

    }

})();
