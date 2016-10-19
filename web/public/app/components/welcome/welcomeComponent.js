"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("welcome", {
        templateUrl: "app/components/about/about.html",
        controller: ["Auth","$state", controller],
        // bindings: {
        //     authObj: "<"
        // }
    });


    function controller(Auth, $state){
        var ctrl = this;
        Auth.$onAuthStateChanged(onAuthStateChanged);

        function onAuthStateChanged(currentAuth) {
            ctrl.authObj = currentAuth;
            if (currentAuth) {
                console.log("Signed in as:", currentAuth.uid);
            } else {
                console.log("Signed out");
            }
        }

        this.signOut = function(){
            Auth.$signOut();
        };

        this.signIn = function(){
            Auth.$signInWithPopup("google");
        };

        // this.signOut = function(){
        //     Auth.$signOut().then(function(){
        //         $state.go("home");
        //     });
        // };

        // this.signIn = function(){
        //     Auth.$signInWithPopup("google").then(function(){
        //         $state.go("transactions.all");
        //     });
        // };

    }

})();
