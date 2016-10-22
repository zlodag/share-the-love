"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactionDetail", {
        templateUrl: "app/components/transactionDetail/transactionDetail.html",
        bindings: {
            transaction: "<"
        }
    });

})();
