"use strict";
(function() {
	angular
		.module("shareTheLove")
        .config(["$stateProvider", transactionsState]);

    function transactionsState($stateProvider) {

        $stateProvider.state({
			name: 'transactions',
			url: '/transactions',
    	    templateUrl: "transactions.html",
            resolve: {
            	users: ["Users", function(Users){
            		return Users.$loaded();
            	}],
                currentAuth: ["Auth", function(Auth) {
                    return Auth.$requireSignIn();
                }],
                transactions: "TransactionsPromise"
            },
            controller: ["$scope", "users", "Auth", "transactions", controller]
        });

	    function controller($scope, users, Auth, transactions){
            $scope.users = users;
            $scope.transactions = transactions;
            $scope.reverse = reverse;

	        function reverse(transactionId) {
	        	var authObj = Auth.$getAuth();
	        	if (authObj !== null) {
		            var reason = prompt("Please enter a reason for reversing this transaction");
		            if (reason.length < 3)
		                alert('Reason needs to be at least 3 characters');
		            else if (reason.length >= 128)
		                alert('Reason needs to be less than 128 characters');
		            else {
		                firebase.database().ref("transactions").child(transactionId).child("reversed").set({
		                    comment: reason,
		                    by: authObj.uid,
		                    at: firebase.database.ServerValue.TIMESTAMP
		                });
		            }
		        } else {
		        	alert("Not signed in!");
		        }
	        }

        }

    }

})();
