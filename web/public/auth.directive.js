"use strict";
(function() {
	angular
		.module("shareTheLove")
		.directive("auth", [auth]);

	function auth() {
	    return {
            templateUrl : "auth.html",
    	    restrict : "E",
            controller: ["$scope", "Auth", controller]
	    };

	    function controller($scope, Auth){

            $scope.signIn = function(){
                Auth.$signInWithPopup('google');
            };

            $scope.signOut = function(){
                Auth.$signOut();
            };

            Auth.$onAuthStateChanged(function(firebaseUser) {
                $scope.me = firebaseUser;
                if (firebaseUser) {
                    console.log("Signed in as:", firebaseUser.uid);
                } else {
                    console.log("Signed out");
                }
            });
	    }
	}

})();
