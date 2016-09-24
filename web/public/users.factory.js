"use strict";
(function() {
	angular
		.module("shareTheLove")
		.factory("Users", ["$firebaseArray", Users]);

	function Users($firebaseArray) {
	    return $firebaseArray(firebase.database().ref("users"));
	}

})();
