"use strict";
(function() {
	angular
		.module("shareTheLove")
		.directive("transactionTable", [transactionTable]);

	function transactionTable() {
	    return {
    	    templateUrl: "transaction-table.html",
    	    scope: {},
    	    restrict : "E",
            controller: ["$scope", "Users", "ListWithDeltas", controller],
	    };

	    function controller($scope, Users, ListWithDeltas){
            $scope.users = Users;
            ListWithDeltas.then(function(list){
	            $scope.transactions = list;
            });
            // $scope.totals = ListWithDeltas.totals;

            // ListWithDeltas.$watch(function(object){
            //     switch(object.event){}
            // });

            // getNewTotals: function(deltas, lastTotals){
            //     var runningTotals = angular.copy(lastTotals);
            //     angular.forEach(deltas, function(value, uid) {
            //         runningTotals[uid] += value;
            //     });
            //     return runningTotals;
            // },
            // totals: totals,

        }
	}

})();
