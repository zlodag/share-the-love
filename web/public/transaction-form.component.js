"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactionForm", {
        templateUrl: "transaction-form.html",
        bindings: {
            users: "<",
            transactions: "<"
        },
        controller: ["$scope", "Auth", controller]
    });

    function controller($scope, Auth){

        $scope.transactionTypes = [{
            id : "single",
            label: "Single"
        },{
            id : "even",
            label: "Even split"
        },{
            id : "uneven",
            label: "Uneven split"
        }];

        var data = {
            type : "single"
        };

        $scope.data = data;

        $scope.totals = {};

        var list = this.transactions.list;

        $scope.submit = submit;

        function submit(){
            var firebaseUser = Auth.$getAuth();
            if (firebaseUser === null){
                console.log("not logged in");
                return false;
            }
            // var userRecord = Users.$getRecord(firebaseUser.uid);
            // if (userRecord === null){
            //     console.log("user not registered");
            //     return false;
            // }
            // if (!userRecord.enabled){
            //     console.log("user not enabled");
            //     return false;
            // }
            var transaction = {
                by: firebaseUser.uid,
                $priority: firebase.database.ServerValue.TIMESTAMP,
                comment: data.comment,
                from: {},
                to: {}
            };
            var valid = false;
            angular.forEach(data.from, function(value, uid){
                if (value){
                    transaction.from[uid] = Math.round(value * 100);
                    valid = true;
                }
            });
            if (!valid) {
                console.log("no valid entries in data.from");
                return false;
            }
            switch (data.type){
                case "single":
                    transaction.to[data.toSingle.$id] = 1;
                    break;
                case "even":
                    valid = false
                    angular.forEach(data.toEven, function(included, uid){
                        if (included) {
                            transaction.to[uid] = 1;
                            valid = true;
                        }
                    });
                    if (!valid) {
                        console.log("no ticked entries in data.toEven");
                        return false;
                    }
                    break;
                case "uneven":
                    valid = false
                    angular.forEach(data.toUneven, function(ratio, uid){
                        if (ratio) {
                            transaction.to[uid] = ratio;
                            valid = true;
                        }
                    });
                    if (!valid) {
                        console.log("no valid entries in data.toUneven");
                        return false;
                    }
                    break;
                default:
                    console.log("no valid choice of type in data.type");
                    return false;
            }
            console.log(transaction);
            list.$add(transaction);
        }

    }

})();
