"use strict";
(function() {
	angular
		.module("shareTheLove")
        .config(["$stateProvider", homeState]);

    function homeState($stateProvider) {

        $stateProvider.state({
            name: 'home',
            url: '/home',
            resolve: {
                currentAuth: ["Auth", function(Auth) {
                    return Auth.$waitForSignIn();
                }]
            },
            component: 'home'
        });

    }

})();
