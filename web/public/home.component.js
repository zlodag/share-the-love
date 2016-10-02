"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("home", {
        templateUrl: "home.html",
        bindings: {
            currentAuth: "<"
        }
    });

})();
