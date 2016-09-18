angular.module("shareTheLove", ["firebase"]).controller("TransactionController", ["$scope", "Users", "ListWithDeltas", function TransactionController($scope, Users, ListWithDeltas) {
    $scope.clear = function(){
        $scope.newTransaction = {
            comment: "",
            from: {},
            to: {}
        };
        angular.forEach(Users, function(user){
            $scope.newTransaction.from[user.$id] = 0;
            $scope.newTransaction.to[user.$id] = 0;
        });
    };
    Users.$loaded(function(users){
        function getFreshTransaction(){
            var freshTransaction = {
                from: {},
                to: {}
            };
            return freshTransaction;
        }
        function getNewInfo(newTransaction){
            var deltas = {};
            var from = {};
            var sumFrom = 0;
            angular.forEach(newTransaction.from, function(amount, uid){
                if (amount > 0) {
                    amount *= 100;
                    deltas[uid] = amount;
                    from[uid] = amount;
                    sumFrom += amount;
                }
            });
            if (sumFrom === 0) return null;
            var to = {};
            var sumRatio = 0;
            angular.forEach(newTransaction.to, function(ratio, uid){
                if (ratio > 0) {
                    if (!(uid in deltas)) {
                        deltas[uid] = 0;
                    }
                    ratio *= 100;
                    to[uid] = ratio;
                    sumRatio += ratio;
                }
            });
            if (sumRatio === 0) return null;
            var moneyPerUnit = sumFrom / sumRatio;
            var meaningfulDeltas = false;
            angular.forEach(to, function(ratio, uid){
                deltas[uid] -= ratio * moneyPerUnit;
                if (!meaningfulDeltas && deltas[uid] !== 0) meaningfulDeltas = true;
            });
            if (!meaningfulDeltas) return null;
            var totals = angular.copy($scope.transactions.length === 0 ? initialRunningTotals : $scope.runningTotals[$scope.transactions[$scope.transactions.length - 1].$id]);
            angular.forEach(deltas, function(delta, uid){
                totals[uid] += delta;
            });
            return {
                from: from,
                sumFrom: sumFrom,
                to: to,
                sumRatio: sumRatio,
                moneyPerUnit: moneyPerUnit,
                deltas: deltas,
                totals: totals
            };
        }
        $scope.clear();
        $scope.users = users;
        var initialRunningTotals = {};
        angular.forEach(users, function(user){
            initialRunningTotals[user.$id] = 0;
        });
        $scope.$watch("newTransaction",function(newValue, oldValue){
            $scope.newInfo = getNewInfo(newValue);
        },true);
        $scope.submitTransaction = function() {
            var newInfo = getNewInfo($scope.newTransaction);
            if (!newInfo) return false;
            var newTransaction = {
                from: newInfo.from,
                to: newInfo.to,
                by: $scope.currentUser.$id,
                comment: $scope.newTransaction.comment,
                $priority: firebase.database.ServerValue.TIMESTAMP
            };
            $scope.transactions.$add(newTransaction);
            $scope.clear();
        };
        $scope.transactions = ListWithDeltas(firebase.database().ref("transactions"));
        $scope.runningTotals = {};
        $scope.transactions.$watch(function(event){
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
                    $scope.newInfo = getNewInfo($scope.newTransaction);
                    break;
            }
        });
    });
}
])
.factory("Users", ["$firebaseArray", function($firebaseArray) {
    return $firebaseArray(firebase.database().ref("users"));
}])
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
        reverse: function(transactionId, userId) {
            var reason = prompt("Please enter a reason for reversing this transaction");
            if (reason.length < 3)
                alert('Reason needs to be at least 3 characters');
            else if (reason.length >= 128)
                alert('Reason needs to be less than 128 characters');
            else {
                firebase.database().ref("transactions").child(transactionId).child("reversed").set({
                    comment: reason,
                    by: userId,
                    at: firebase.database.ServerValue.TIMESTAMP
                });
            }
        },
        $$added: function(snapshot, prevChild) {
            var added = $firebaseArray.prototype.$$added.apply(this, arguments);
            added.deltas = this.getDeltas(snapshot);
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