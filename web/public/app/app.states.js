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
            url: '/home',
            resolve: {
                authObj: ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                }],
                spreadsheetIndex: ["authObj", "$firebaseArray", function(authObj, $firebaseArray){
                    return $firebaseArray(firebase.database().ref("spreadsheetIndex").child(authObj.uid)).$loaded();
                }]
            },
            component: 'authed'
        }).state({
            name: 'authed.spreadsheet',
            url: '/:spreadsheetId',
            resolve: {
                users: ["$stateParams", "$firebaseArray", function($stateParams, $firebaseArray){
                    return $firebaseArray(firebase.database().ref("spreadsheets").child($stateParams.spreadsheetId).child("users")).$loaded();
                }],
                transactions: ["$stateParams", "TransactionsList", "users", function($stateParams, TransactionsList, users) {
                    return TransactionsList($stateParams.spreadsheetId, users).$loaded();
                }]
            },
            component: 'spreadsheet'
        }).state({
            name: 'authed.spreadsheet.transactions',
            url: '/transactions',
            component: 'transactions'
        }).state({
            name: 'authed.spreadsheet.admin',
            url: '/admin',
            resolve: {
                applicants: ["$stateParams", "$firebaseArray", function($stateParams, $firebaseArray){
                    return $firebaseArray(firebase.database().ref("spreadsheets").child($stateParams.spreadsheetId).child("applicants")).$loaded();
                }]
            },
            component: 'spreadsheetAdmin'
        }).state({
            name: 'authed.spreadsheet.new',
            url: '/new',
            component: 'transactionNew'
        }).state({
            name: 'authed.spreadsheet.transaction',
            url: '/:transactionId',
            resolve: {
                transaction: ["$stateParams", "transactions", function($stateParams, transactions){
                    return transactions.$getRecord($stateParams.transactionId);
                }],
                transactionRef: ["$stateParams", "transactions", function($stateParams, transactions){
                    return transactions.$ref().child($stateParams.transactionId);
                }]
            },
            component: 'transactionDetail'
        });

        $urlRouterProvider.otherwise('/signIn');

    }

})();
