angular.module("shareTheLove", ["firebase"]).controller("TransactionController", ["$scope", "$firebaseArray", "$firebaseObject", function TransactionController($scope, $firebaseArray, $firebaseObject) {
    $scope.runningTotals = [];
    $scope.transactions = [];
    $scope.deltas = [];
    $scope.users = [];
    var currentTotals = {};
    function getDeltas(transaction) {
        var deltas = {};
        var totalMoney = 0;
        angular.forEach(transaction.from, function(value, uid) {
            deltas[uid] = value;
            totalMoney += value;
        });
        var totalRatio = 0;
        angular.forEach(transaction.to, function(value, uid) {
            totalRatio += value;
        });
        var moneyPerUnit = totalMoney / totalRatio;
        angular.forEach(transaction.to, function(value, uid) {
            deltas[uid] = ((uid in deltas) ? deltas[uid] : 0) - value * moneyPerUnit;
        });
        return deltas;
    }
    function updateRecordsFrom(startIndex) {
    }
    $scope.newTransaction = {
        from: {},
        to: {}
    };
    firebase.database().ref("users").once("value", function(snap) {
        snap.forEach(function(childSnapshot) {
            var uid = childSnapshot.key;
            currentTotals[uid] = 0;
            var active = childSnapshot.val();
            $scope.users.push({
                uid: uid,
                active: childSnapshot.val()
            });
            $scope.newTransaction.from[uid] = 0;
            $scope.newTransaction.to[uid] = 0;
        });
        $scope.runningTotals.push(angular.copy(currentTotals));
        $scope.transactions = $firebaseArray(firebase.database().ref("transactions"));
        $scope.transactions.$watch(function(event) {
            switch(event.event){
                case "child_added":
                    var transaction = $scope.transactions.$getRecord(event.key);
                    var deltas = getDeltas(transaction);
                    $scope.deltas.push(deltas);
                    if (!transaction.reversed) {
                        angular.forEach(deltas, function(value, uid) {
                            currentTotals[uid] += value;
                        });
                    }
                    $scope.runningTotals.push(angular.copy(currentTotals));
                    break;
                case "child_changed":
                    var startIndex = $scope.transactions.$indexFor(event.key);
                    currentTotals = angular.copy($scope.runningTotals[startIndex]);
                    for (i = startIndex; i < $scope.transactions.length; i++){
                        var transaction = $scope.transactions[i];
                        var deltas = getDeltas(transaction);
                        $scope.deltas[i] = deltas;
                        if (!transaction.reversed) {
                            angular.forEach(deltas, function(value, uid) {
                                currentTotals[uid] += value;
                            });
                        }
                        $scope.runningTotals[i + 1] = angular.copy(currentTotals);
                    }
                    break;
            }
        });
    });
    $scope.submitTransaction = function() {
        var newTransaction = {
            comment: $scope.newTransaction.comment,
            $priority: firebase.database.ServerValue.TIMESTAMP
        };
        for (var i = 0; i < 2; i++) {
            var type = i == 0 ? 'to' : 'from';
            var values = {};
            var valid = false;
            angular.forEach($scope.newTransaction[type], function(value, key) {
                if (value > 0) {
                    values[key] = value * 100;
                    valid = true;
                }
            });
            if (!valid)
                return false;
            newTransaction[type] = values;
        }
        $scope.transactions.$add(newTransaction);
    }
    ;
    $scope.reverseTransaction = function(id) {
        var reason = prompt("Please enter a reason for reversing this transaction");
        if (reason.length < 3)
            alert('Reason needs to be at least 3 characters');
        else if (reason.length >= 128)
            alert('Reason needs to be less than 128 characters');
        else {
            firebase.database().ref("transactions").child(id).child("reversed").set({
                comment: reason,
                by: 'c',
                at: firebase.database.ServerValue.TIMESTAMP
            });
        }
    }
    ;
    $scope.fieldsets = [{
        type: "from",
        label: "From ($)"
    }, {
        type: "to",
        label: "To (ratio)"
    }, ];
    $scope.sumFrom = function() {
        var total = 0;
        angular.forEach($scope.newTransaction.from, function(value, key) {
            total += value;
        });
        return total;
    }
    ;
}
]);
// .factory("ListWithTotal", ["$firebaseArray",
//   function($firebaseArray) {
//     // create a new service based on $firebaseArray
//     var ListWithTotal = $firebaseArray.$extend({
//       $$added: function(snapshot, prevChild) {
//         // apply the changes using the super method
//         var added = $firebaseArray.prototype.$$added.apply(this, arguments);
//         var index = this.$indexFor(added.$id);
//         added.runningTotals = {};
//         var totalMoney = 0;
//         snapshot.child("from").forEach(function(childSnapshot) {
//           totalMoney += childSnapshot.val();
//         });
//         var totalRatio = 0;
//         snapshot.child("to").forEach(function(childSnapshot) {
//           totalRatio += childSnapshot.val();
//         });
//         var moneyPerUnit = totalMoney/totalRatio;
//         var previous = prevChild === null ? null : this.$getRecord(prevChild);
//         angular.forEach($scope.users, function(user){
//           var runningTotal = previous === null ? 0 : previous[user.uid];
//           if (user.uid in added.from){
//             runningTotal += added.from[user.uid];
//           }
//           if (user.uid in added.to){
//             runningTotal -= added.to[user.uid] * moneyPerUnit;
//           }
//           added.runningTotals[user.uid] = runningTotal;
//         });
//         // return whether or not changes occurred
//         return added;
//       },
//       getTotal: function() {
//         var total = 0;
//         // the array data is located in this.$list
//         angular.forEach(this.$list, function(transaction) {
//           angular.forEach(transaction.from, function(value, name){
//               total += value;
//           });
//         });
//         return total;
//       }
//     });
//     return function(listRef, users) {
//       // create an instance of ListWithTotal (the new operator is required)
//       return new ListWithTotal(listRef);
//     }
//   }
// ]);
