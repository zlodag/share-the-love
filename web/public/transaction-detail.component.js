"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactionDetail", {
        templateUrl: "transaction-detail.html",
        controller: ["Auth", controller],
        bindings: {
            transaction: "<",
            users: "<"
        }
    });

    function controller(Auth){
        // $scope.users = users;
        // $scope.transactions = transactions;
        this.reverse = reverse;

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

})();
