"use strict";
(function() {
	angular
		.module("shareTheLove")
        .config(["$stateProvider", "$urlRouterProvider", welcomeStates])
        .run(["$rootScope", "$state", catchSignInError]);

    function welcomeStates($stateProvider, $urlRouterProvider) {
    }


})();
