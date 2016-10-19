"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("authed", {
        templateUrl: "app/components/authed/authed.html",
        bindings : {
        	authObj : "<"
        },
        controller : ["Auth", "$state", controller]
    });

    function controller(Auth, $state){

        this.signOut = function(){
            Auth.$signOut().then(function(){
                $state.go("signIn");
            });
        };

	}

})();
