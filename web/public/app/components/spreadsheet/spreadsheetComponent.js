"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("spreadsheet", {
        templateUrl: "app/components/spreadsheet/spreadsheet.html",
        bindings : {
            authObj: "<",
            users: "<"
        }
    });

})();
