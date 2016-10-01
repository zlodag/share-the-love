"use strict";
(function() {
	angular
		.module("shareTheLove")
		.factory("ListWithDeltas", ["$firebaseArray", "Users", ListWithDeltas]);

	function ListWithDeltas($firebaseArray, Users) {

		var totals = {};

		var customArray = $firebaseArray.$extend({
	        $$added: function(snapshot, prevChild) {
	            var added = $firebaseArray.prototype.$$added.apply(this, arguments);
	            added.deltas = getDeltas(snapshot);
            	updateTotals(added, prevChild);
	            return added;
	        },
	        $$updated: function(snapshot) {
	            $firebaseArray.prototype.$$updated.apply(this, arguments);
	            this.$getRecord(snapshot.key).deltas = getDeltas(snapshot);
            	var index = this.$indexFor(snapshot.key);
            	var previousKey = index === 0 ? null : this.$keyAt(index - 1);
            	while (index < this.length){
            		var record = this.$getRecord(index);
            		updateTotals(record, previousKey);
					previousKey = record.$id;
					index++;
            	}
	            return true;
	        },
	        getTotal: function(transactionId, userId){
	        	return totals[transactionId][userId];
	        }
	    });

		return Users.$loaded(function(){
	    	return customArray(firebase.database().ref("transactions"));
		});

		function updateTotals(record, previousKey){
            totals[record.$id] = {};
			angular.forEach(Users, function(user){
				var total = previousKey === null ? 0 : totals[previousKey][user.$id];
				if (user.$id in record.deltas){
					total += record.deltas[user.$id];
				}
				totals[record.$id][user.$id] = total;
			});
		}

		function getDeltas(dataSnapshot) {
            var deltas = {};
            if (!dataSnapshot.hasChild("reversed")){
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
            }
            return deltas;
        }

	}

})();
