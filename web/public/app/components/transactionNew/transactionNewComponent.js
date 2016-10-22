"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactionNew", {
        templateUrl: "app/components/transactionNew/transactionNew.html",
        bindings : {
        	users : "<",
        	transactions: "<"
        },
        controller: ["Auth", "$state", controller]
    });

    function controller(Auth, $state){

        var ctrl = this;

        ctrl.transactionTypes = [{
            id : "single",
            label: "Single"
        },{
            id : "even",
            label: "Even split"
        },{
            id : "uneven",
            label: "Uneven split"
        }];

        ctrl.data = {
            type : "single"
        };

        ctrl.submit = function(){
            var authObj = Auth.$getAuth();
            if (authObj === null){
                console.log("not logged in");
                return false;
            }
            var userRecord = ctrl.users.$getRecord(authObj.uid);
            if (userRecord === null){
                console.log("user not registered");
                return false;
            }
            if (!userRecord.active){
                console.log("user not enabled");
                return false;
            }
            var transaction = {
                by: authObj.uid,
                $priority: firebase.database.ServerValue.TIMESTAMP,
                comment: ctrl.data.comment,
                from: {},
                to: {}
            };
            var valid = false;
            angular.forEach(ctrl.data.from, function(value, uid){
                if (value){
                	value = Math.round(value * 100);
                    if (value !== 0) {
                    	transaction.from[uid] = value;
                    	valid = true;
                    }
                }
            });
            if (!valid) {
                console.log("no valid entries in data.from");
                return false;
            }
            switch (ctrl.data.type){
                case "single":
                    transaction.to[ctrl.data.toSingle.$id] = 1;
                    break;
                case "even":
                    valid = false
                    angular.forEach(ctrl.data.toEven, function(included, uid){
                        if (included) {
                            transaction.to[uid] = 1;
                            valid = true;
                        }
                    });
                    if (!valid) {
                        console.log("no ticked entries in ctrl.data.toEven");
                        return false;
                    }
                    break;
                case "uneven":
                    valid = false
                    angular.forEach(ctrl.data.toUneven, function(ratio, uid){
                        if (ratio) {
	                		ratio = Math.round(ratio);
	                		if (ratio !== 0) {
	                            transaction.to[uid] = ratio;
	                            valid = true;
	                		}
                        }
                    });
                    if (!valid) {
                        console.log("no valid entries in ctrl.data.toUneven");
                        return false;
                    }
                    break;
                default:
                    console.log("no valid choice of type in ctrl.data.type");
                    return false;
            }
            console.log(transaction);
            ctrl.transactions.$add(transaction).then(function(ref) {
                $state.go('^.transaction', {transactionId: ref.key});
            });
        };
	}

})();
