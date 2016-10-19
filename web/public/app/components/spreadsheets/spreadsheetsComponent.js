"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("spreadsheets", {
        templateUrl: "app/components/spreadsheets/spreadsheets.html",
        bindings : {
            spreadsheets : "<"
        }
    });

})();
