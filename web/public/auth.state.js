"use strict";
(function() {
	angular
		.module("shareTheLove")
        .config(["$stateProvider", authState]);

    function authState($stateProvider) {

        $stateProvider.state({
            name: 'auth',
            url: '/home',
            templateUrl : "auth.html",
            controller: ["$scope", "Auth", controller]
        });

        function controller($scope, Auth){
            // $scope.me = currentAuth;
            $scope.signIn = signIn;
            $scope.signOut = signOut;
            Auth.$onAuthStateChanged(onAuthStateChanged);
            // onAuthStateChanged(currentAuth);

            function signIn(){
                Auth.$signInWithPopup("google",{remember: "none"});
            }

            function signOut(){
                Auth.$signOut();
            }

            function onAuthStateChanged(currentAuth) {
                $scope.me = currentAuth;
                if (currentAuth) {
                    console.log("Signed in as:", currentAuth.uid);
                } else {
                    console.log("Signed out");
                }
            }

        }

    }

})();
