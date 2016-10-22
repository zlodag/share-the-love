"use strict";
(function() {
	angular
		.module("shareTheLove")
		.factory("Auth", ["$firebaseAuth", Auth]);

	function Auth($firebaseAuth) {
	    return $firebaseAuth();
	}

})();
