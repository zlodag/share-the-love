"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("navigationBar", {
        templateUrl: "navigation-bar.html",
        controller: ["Auth","$state", controller]
    });

    function controller(Auth, $state){
        var ctrl = this;
        Auth.$onAuthStateChanged(onAuthStateChanged);

        function onAuthStateChanged(currentAuth) {
            ctrl.me = currentAuth;
            if (currentAuth) {
                console.log("Signed in as:", currentAuth.uid);
            } else {
                console.log("Signed out");
            }
        }

        this.signOut = function(){
            Auth.$signOut().then(function(){
                $state.go("home");
            });
        };

        this.signIn = function(){
            Auth.$signInWithPopup("google").then(function(){
                $state.go("transactions.all");
            });
        };

    }

})();
