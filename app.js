angular.module("shareTheLove", ["firebase"]).controller("TransactionController", ["$scope", "ListWithDeltas", function TransactionController($scope, ListWithDeltas) {
    $scope.runningTotals = {};
    $scope.transactions = [];
    $scope.users = [];
    $scope.newTransaction = {
        from: {},
        to: {}
    };
    firebase.database().ref("users").once("value", function(snap) {
        var initialRunningTotals = {};
        snap.forEach(function(childSnapshot) {
            var uid = childSnapshot.key;
            initialRunningTotals[uid] = 0;
            var active = childSnapshot.val();
            $scope.users.push({
                uid: uid,
                active: childSnapshot.val()
            });
            $scope.newTransaction.from[uid] = 0;
            $scope.newTransaction.to[uid] = 0;
        });
//         $scope.runningTotals.push(angular.copy(currentTotals));
        $scope.transactions = ListWithDeltas(firebase.database().ref("transactions"));
        $scope.transactions.$watch(function(event){
            console.log(event);
            switch(event.event){
                case "child_added":
                case "child_changed":
                    var index = $scope.transactions.$indexFor(event.key);
                    var newTotals = index === 0 ? initialRunningTotals : $scope.runningTotals[$scope.transactions[index-1].$id];
                    do {
                        var record = $scope.transactions[index];
                        newTotals = angular.copy(newTotals);
                        if (!record.reversed){
                            angular.forEach(record.deltas, function(value, uid){
                                newTotals[uid] += value;
                            });
                        }
                        $scope.runningTotals[record.$id] = newTotals;
                    } while (++index < $scope.transactions.length);
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
])
// .factory("Users", ["$firebaseArray", function($firebaseArray) {
//     return $firebaseArray
// }])
.factory("ListWithDeltas", ["$firebaseArray", function($firebaseArray) {
    return $firebaseArray.$extend({
        getNewTotals: function(deltas, lastTotals){
            var runningTotals = angular.copy(lastTotals);
            angular.forEach(deltas, function(value, uid) {
                runningTotals[uid] += value;
            });
            return runningTotals;
        },
        getDeltas: function(dataSnapshot) {
            var deltas = {};
            var totalMoney = 0;
            dataSnapshot.child("from").forEach(function(childSnapshot) {
                var value = childSnapshot.val();
                deltas[childSnapshot.key] = value;
                totalMoney += value;
            });
            var totalRatio = 0;
            dataSnapshot.child("to").forEach(function(childSnapshot) {
                totalRatio += childSnapshot.val();
                if (!(childSnapshot.key in deltas)) {
                    deltas[childSnapshot.key] = 0;
                }
            });
            var moneyPerUnit = totalMoney / totalRatio;
            dataSnapshot.child("to").forEach(function(childSnapshot) {
                deltas[childSnapshot.key] -= childSnapshot.val() * moneyPerUnit;
            });
            return deltas;
        },
        $$added: function(snapshot, prevChild) {
            var added = $firebaseArray.prototype.$$added.apply(this, arguments);
            added.deltas = this.getDeltas(snapshot);
//             var currentTotals;
//             if (prevChild === null){
//                 added.runningTotals = {a:0,b:0,c:0,d:0,e:0,f:0};
//             } else {
//                 added.runningTotals = this.getNewTotals(added.deltas, this.$getRecord(prevChild).runningTotals);
//             }
//             added.runningTotals = this.getNewTotals(added.deltas, currentTotals);
//             var currentTotals = added.runningTotals;
//             var index = this.$indexFor
//             while (++index < this.$list.length){
//                 var record = this.$list[index];
//                 currentTotals = this.getNewTotals(record.deltas, currentTotals);
//                 record.runningTotals = currentTotals;
//             }
            return added;
        },
        $$updated: function(snapshot) {
            $firebaseArray.prototype.$$updated.apply(this, arguments);
            this.$getRecord(snapshot.key).deltas = this.getDeltas(snapshot);
            return true;
        }
    });
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
