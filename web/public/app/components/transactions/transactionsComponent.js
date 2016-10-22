"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactions", {
        templateUrl: "app/components/transactions/transactions.html",
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
