"use strict";
(function() {
	angular
		.module("shareTheLove")
		.factory("TransactionList", ["$firebaseArray", TransactionList]);

	function TransactionList($firebaseArray) {

	    return function(spreadsheetId, users){

    		var totals;

			var customList = $firebaseArray.$extend({
				$$added: added,
				$$updated: updated,
				updateTotals: updateTotals,
				getTotals: getTotals
			})(firebase.database().ref("transactions").child(spreadsheetId));

	    	return customList;

			function updateTotals(){
				totals = {};
				var previousTotals = {};
				angular.forEach(users, function(user){
					previousTotals[user.$id] = 0;
				});
				angular.forEach(this.$list, function(transaction) {
					totals[transaction.$id] = {};
					angular.forEach(previousTotals, function(value, uid){
						if (!transaction.reversed && uid in transaction.deltas) value += transaction.deltas[uid];
						totals[transaction.$id][uid] = value;
					});
					previousTotals = totals[transaction.$id];
				});
			}

			function getTotals(transactionId){
				return totals[transactionId];
			}

			function added(dataSnapshot, previousKey) {
				var added = $firebaseArray.prototype.$$added.apply(this, arguments);
				added.deltas = getDeltas(dataSnapshot);
				return added;
			}

			function updated(dataSnapshot) {
				$firebaseArray.prototype.$$updated.apply(this, arguments);
				this.$getRecord(dataSnapshot.key).deltas = getDeltas(dataSnapshot);
				return true;
			}

			function getDeltas(dataSnapshot) {
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
			}

	    };

	}

})();
