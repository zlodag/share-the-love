"use strict";
(function() {
	angular
		.module("shareTheLove")
		.directive("transactionForm", [transactionForm]);

	function transactionForm() {
	    return {
    	    templateUrl: "transaction-form.html",
    	    scope: {},
    	    restrict : "E",
            controller: ["$scope", "Users", "Auth", "ListWithDeltas", controller],
	    };

	    function controller($scope, Users, Auth, ListWithDeltas){
            $scope.users = Users;

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
            $scope.submit = submit;
            $scope.totals = {};

            function submit(){
                var firebaseUser = Auth.$getAuth();
                if (firebaseUser === null){
                    console.log("not logged in");
                    return false;
                }
                var userRecord = Users.$getRecord(firebaseUser.uid);
                if (userRecord === null){
                    console.log("user not registered");
                    return false;
                }
                if (!userRecord.enabled){
                    console.log("user not enabled");
                    return false;
                }
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
                ListWithDeltas.$add(transaction);
            }
        }
	}

})();
