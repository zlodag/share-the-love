"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("signIn", {
        templateUrl: "app/components/signIn/signIn.html",
        controller: ["Auth", "$state", controller]
    });

    function controller(Auth, $state){
        // var ctrl = this;
        Auth.$onAuthStateChanged(onAuthStateChanged);

        function onAuthStateChanged(currentAuth) {
            // ctrl.authObj = currentAuth;
            if (currentAuth) {
                // firebase.database().ref("users").child(currentAuth.uid).child("name").set(currentAuth.displayName);
                console.log("Signed in as: ", currentAuth.displayName);
                $state.go('authed');
            }
        }

        // this.signOut = function(){
        //     Auth.$signOut();
        // };

        this.signIn = function(){
            Auth.$signInWithPopup("google");
        };
	}

})();
