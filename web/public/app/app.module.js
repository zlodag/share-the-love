"use strict";
(function() {
    angular
        .module("shareTheLove", ["firebase","ngMessages","ui.router"]);
  //       .run(["$rootScope", function($rootScope){
  //           console.log($rootScope.$on);
  //           $rootScope.$on('$locationChangeSuccess', function(event, toState, toParams, fromState, fromParams, error){
  //               console.log("fat chance");
  //           });
  //           $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, error){
  //               console.log("fatter chance");
  //           });
  //           $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){
  //               console.log("error chance");
  //           });
		// 	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, error) {
	 //            console.log("Starting");
		// 		if(toState.name == 'Categories') {
		// 		// Do Something
		// 		}
		// 	});
		// }])
    	// .run(["$rootScope", "$state", catchSignInError]);

    // function catchSignInError($rootScope, $state) {
    //     $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    //         // We can catch the error thrown when the $requireSignIn promise is rejected
    //         // and redirect the user back to the home page
    //         console.log(event);
    //         if (error === "AUTH_REQUIRED") {
    //             $state.go("signIn");
    //         }
    //     });
    // }

})();
