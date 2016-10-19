"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactionNew", {
        templateUrl: "app/components/transactionNew/transactionNew.html",
        bindings : {
        	users : "<",
        	transactions : "<"
        }
    });

})();
