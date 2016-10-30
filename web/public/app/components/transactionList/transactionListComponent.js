"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactionList", {
        templateUrl: "app/components/transactionList/transactionList.html",
        bindings : {
        	users : "<",
        	transactions : "<"
        },
        controller : controller
    });

    function controller(){

    	var ctrl = this;

		ctrl.showReversed = false;

    	this.comparator = function(value, index, array){
    		return ctrl.showReversed || !('reversed' in value);
    	};
    }

})();
