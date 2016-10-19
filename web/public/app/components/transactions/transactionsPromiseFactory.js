"use strict";
(function() {
	angular
	.module("shareTheLove")
	.factory("TransactionsPromise", ["$firebaseArray", "Users", TransactionsPromise]);

	function TransactionsPromise($firebaseArray, Users) {
		return Users.$loaded().then(function(users){

			var totals = {};

			var deltas = {};

			var customArray = $firebaseArray.$extend({
				$$added: added,
				$$updated: updated
			});

			return customArray(firebase.database().ref("transactions")).$loaded().then(ListWithExtras);

			function added(dataSnapshot, previousKey) {
				var added = $firebaseArray.prototype.$$added.apply(this, arguments);
				updateDeltas(dataSnapshot);
				updateTotals(dataSnapshot.key, previousKey, dataSnapshot.hasChild("reversed"));
				return added;
			}

			function updated(dataSnapshot) {
				$firebaseArray.prototype.$$updated.apply(this, arguments);
				updateDeltas(dataSnapshot);
				var index = this.$indexFor(dataSnapshot.key);
				var previousKey = index === 0 ? null : this.$keyAt(index - 1);
				while (index < this.$list.length){
					var record = this.$list[index];
					var currentKey = record.$id;
					updateTotals(currentKey, previousKey, "reversed" in record);
					previousKey = currentKey;
					index++;
				}
				return true;

				// this.$getRecord(dataSnapshot.key).deltas = getDeltas(dataSnapshot);
				// var index = this.$indexFor(dataSnapshot.key);
				// var previousKey = index === 0 ? null : this.$keyAt(index - 1);
				// while (index < this.length){
				// 	var record = this.$getRecord(index);
				// 	updateTotals(record, previousKey);
				// 	previousKey = record.$id;
				// 	index++;
				// }
			}

			// function getTotal(transactionId, userId){
			// 	return totals[transactionId][userId];
			// }

			function updateDeltas(dataSnapshot) {
				deltas[dataSnapshot.key] = {};
				var totalMoney = 0;
				dataSnapshot.child("from").forEach(function(childSnapshot) {
					var value = childSnapshot.val();
					deltas[dataSnapshot.key][childSnapshot.key] = value;
					totalMoney += value;
				});
				var totalRatio = 0;
				dataSnapshot.child("to").forEach(function(childSnapshot) {
					totalRatio += childSnapshot.val();
					if (!(childSnapshot.key in deltas[dataSnapshot.key])) {
						deltas[dataSnapshot.key][childSnapshot.key] = 0;
					}
				});
				var moneyPerUnit = totalMoney / totalRatio;
				dataSnapshot.child("to").forEach(function(childSnapshot) {
					deltas[dataSnapshot.key][childSnapshot.key] -= childSnapshot.val() * moneyPerUnit;
				});
			}

			// function updateAll(record, previousKey){
			// 	totals[record.$id] = {};
			// 	angular.forEach(users, function(user){
			// 		var total = previousKey === null ? 0 : totals[previousKey][user.$id];
			// 		if (user.$id in record.deltas){
			// 			total += record.deltas[user.$id];
			// 		}
			// 		totals[record.$id][user.$id] = total;
			// 	});
			// }

			function updateTotals(currentKey, previousKey, reversed){
				totals[currentKey] = {};
				angular.forEach(users, function(user){
					var userTotal = previousKey === null ? 0 : totals[previousKey][user.$id];
					if (!reversed && user.$id in deltas[currentKey]){
						userTotal += deltas[currentKey][user.$id];
					}
					totals[currentKey][user.$id] = userTotal;
				});
			}

			function ListWithExtras(list){
				return {
					totals: totals,
					deltas: deltas,
					list: list
				};
			}

		});

	}

})();
