"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactions", {
        templateUrl: "app/components/transactions/transactions.html",
        bindings : {
        	users : "<",
        	transactions : "<"
        }
    });

})();
