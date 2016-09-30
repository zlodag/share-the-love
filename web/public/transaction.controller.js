"use strict";
(function() {
	angular
		.module("shareTheLove")
		.controller("TransactionController", ["$scope", "Users", "NewTransaction", "ListWithDeltas", "Auth", TransactionController]);

    function TransactionController($scope, Users, NewTransaction, ListWithDeltas, Auth) {
        $scope.newt = NewTransaction;
        $scope.submit = NewTransaction.submit;
        $scope.newData = {};
        $scope.signIn = function(){
            Auth.$signInWithPopup('google');
        };
        $scope.signOut = function(){
            Auth.$signOut();
        };
        Auth.$onAuthStateChanged(function(firebaseUser) {
            $scope.me = firebaseUser;
            if (firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
            } else {
                console.log("Signed out");
            }
        });

        // $scope.signIn = function(){
        //     Auth.$signInWithPopup("google").then(function(result) {
        //         console.log("Signed in as:", result.user.uid);
        //     }).catch(function(error) {
        //         console.error("Authentication failed:", error);
        //     });
        // };
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
        $scope.deleteProperty = function(property, object){
            delete object[property];
        };
        $scope.changedList = function(list,newData,key,primitive){
            var ratios = {};
            angular.forEach(list, function(name){
                if (Users.$indexFor(name) !== -1){
                    ratios[name] = primitive;
                }
            });
            return ratios;
        };
        $scope.changed = function(name,newData,key,primitive){
            if (Users.$indexFor(name) !== -1){
                if (!(key in newData)){
                    newData[key] = {};
                }
                newData[key][name] = primitive;
                return true;
            }
            return false;
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
//             console.log(initialRunningTotals);
            // $scope.$watch("newTransaction",function(newValue, oldValue){
            //     $scope.newInfo = getNewInfo(newValue);
            // },true);
//             $scope.submitTransaction = function(newData) {
// //                 newData.by =
//                 var newInfo = getNewInfo($scope.newTransaction);
//                 if (!newInfo) return false;
//                 var newTransaction = {
//                     from: newInfo.from,
//                     to: newInfo.to,
//                     by: $scope.currentUser.$id,
//                     comment: $scope.newTransaction.comment,
//                     $priority: firebase.database.ServerValue.TIMESTAMP
//                 };
//                 $scope.transactions.$add(newTransaction);
//                 $scope.clear();
//             };
            $scope.transactions = ListWithDeltas;
            // $scope.transactions = ListWithDeltas(firebase.database().ref("transactions"));
            $scope.runningTotals = {};
            $scope.transactions.$watch(function(event){
                switch(event.event){
                    case "child_added":
                    case "child_changed":
                        var index = $scope.transactions.$indexFor(event.key);
                        var newTotals = index === 0 ? initialRunningTotals : $scope.runningTotals[$scope.transactions[index-1].$id];
                        console.log(newTotals);
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
})();
