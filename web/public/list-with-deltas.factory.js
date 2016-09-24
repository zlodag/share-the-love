"use strict";
(function() {
	angular
		.module("shareTheLove")
		.factory("ListWithDeltas", ["$firebaseArray", ListWithDeltas]);

	function ListWithDeltas($firebaseArray) {
	    return $firebaseArray.$extend({
	        getNewTotals: function(deltas, lastTotals){
	            var runningTotals = angular.copy(lastTotals);
	            angular.forEach(deltas, function(value, uid) {
	                runningTotals[uid] += value;
	            });
	            return runningTotals;
	        },
	        getDeltas: function(dataSnapshot) {
	            var deltas = {};
	            var totalMoney = 0;
	            dataSnapshot.child("from").forEach(function(childSnapshot) {
	                var value = childSnapshot.val();
	                deltas[childSnapshot.key] = value;
	                totalMoney += value;
	            });
	            var totalRatio = 0;
	            dataSnapshot.child("to").forEach(function(childSnapshot) {
	                totalRatio += childSnapshot.val();
	                if (!(childSnapshot.key in deltas)) {
	                    deltas[childSnapshot.key] = 0;
	                }
	            });
	            var moneyPerUnit = totalMoney / totalRatio;
	            dataSnapshot.child("to").forEach(function(childSnapshot) {
	                deltas[childSnapshot.key] -= childSnapshot.val() * moneyPerUnit;
	            });
	            return deltas;
	        },
	        reverse: function(transactionId, userId) {
	            var reason = prompt("Please enter a reason for reversing this transaction");
	            if (reason.length < 3)
	                alert('Reason needs to be at least 3 characters');
	            else if (reason.length >= 128)
	                alert('Reason needs to be less than 128 characters');
	            else {
	                firebase.database().ref("transactions").child(transactionId).child("reversed").set({
	                    comment: reason,
	                    by: userId,
	                    at: firebase.database.ServerValue.TIMESTAMP
	                });
	            }
	        },
	        $$added: function(snapshot, prevChild) {
	            var added = $firebaseArray.prototype.$$added.apply(this, arguments);
	            added.deltas = this.getDeltas(snapshot);
	            return added;
	        },
	        $$updated: function(snapshot) {
	            $firebaseArray.prototype.$$updated.apply(this, arguments);
	            this.$getRecord(snapshot.key).deltas = this.getDeltas(snapshot);
	            return true;
	        }
	    });
	}

})();
