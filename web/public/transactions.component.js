"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactionList", {
        templateUrl: "transactions.html",
        bindings: {
            users: "<",
            transactions: "<"
        }
    });

})();
