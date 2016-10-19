"use strict";
(function() {
	angular
	.module("shareTheLove")
	.config(function($stateProvider) {
		$stateProvider.state({
	});
})();

        // .config(["$stateProvider", transactionsState])
        // .component("hello", {
        // template:  '<h3>{{$ctrl.greeting}} Solar System!</h3>' +
        // '<button ng-click="$ctrl.toggleGreeting()">toggle greeting</button>',

        // controller: function() {
        //     this.greeting = 'hello';

        //     this.toggleGreeting = function() {
        //         this.greeting = (this.greeting == 'hello') ? 'whats up' : 'hello'
        //     }
        // }
   //  });

   //  function transactionsState($stateProvider) {

   //      $stateProvider.state({
			// name: 'transactions',
			// url: '/transactions',
			// component: "hello",
			// // template: "<p>hi mum</p><hello></hello>",
   //      });

	  //   // function controller($scope, users, Auth, transactions){
   //   //        $scope.users = users;
   //   //        $scope.transactions = transactions;
   //   //        $scope.reverse = reverse;

	  //   //     function reverse(transactionId) {
	  //   //     	var authObj = Auth.$getAuth();
	  //   //     	if (authObj !== null) {
		 //   //          var reason = prompt("Please enter a reason for reversing this transaction");
		 //   //          if (reason.length < 3)
		 //   //              alert('Reason needs to be at least 3 characters');
		 //   //          else if (reason.length >= 128)
		 //   //              alert('Reason needs to be less than 128 characters');
		 //   //          else {
		 //   //              firebase.database().ref("transactions").child(transactionId).child("reversed").set({
		 //   //                  comment: reason,
		 //   //                  by: authObj.uid,
		 //   //                  at: firebase.database.ServerValue.TIMESTAMP
		 //   //              });
		 //   //          }
		 //   //      } else {
		 //   //      	alert("Not signed in!");
		 //   //      }
	  //   //     }

   //   //    }

   //  }

