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
                     // $firebaseArray(firebase.database().ref("users").child(authObj.uid)).$loaded();
                }],
                users: ["$stateParams", "$firebaseArray", function($stateParams, $firebaseArray){
                    return $firebaseArray(firebase.database().ref("spreadsheets").child($stateParams.spreadsheetId).child("users")).$loaded();
                }],
                transactions: ["$stateParams", "$firebaseArray", function($stateParams, $firebaseArray) {
                    return $firebaseArray(firebase.database().ref("transactions").child($stateParams.spreadsheetId)).$loaded();
                }]
            },
            component: 'spreadsheet'
        // }).state({
        //     name: 'authed.spreadsheet.details',
        //     url: '/details',
        //     component: 'spreadsheetDetails'
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


        // }).state({          name: 'transactions',
        //     abstract: true,
        //     template: "<ui-view/>",
        //     resolve: {
        //         users: ["Users", function(Users){
        //             return Users.$loaded();
        //         }],
        //         currentAuth: ["Auth", function(Auth) {
        //             return Auth.$requireSignIn();
        //         }],
        //         transactions: "TransactionsPromise"
        //     }
        // }).state({
        //     name: 'transactions.all',
        //     url: '/transactions',
        //     component: 'transactionList'
        // }).state({
        //     name: 'transactions.new',
        //     url: '/transactions/new',
        //     component: 'transactionForm'
        // }).state({
        //     name: 'transactions.detail',
        //     url: '/transactions/{transactionId}',
        //     resolve: {
        //         transaction: ["transactions", "$stateParams", function(transactions, $stateParams) {
        //             return {
        //                 record: transactions.list.$getRecord($stateParams.transactionId),
        //                 deltas: transactions.deltas[$stateParams.transactionId],
        //                 totals: transactions.totals[$stateParams.transactionId]
        //             };
        //         }]
        //     },
        //     component: 'transactionDetail'
        });

        $urlRouterProvider.otherwise('/signIn');
    }


})();
