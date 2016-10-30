"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactionNew", {
        templateUrl: "app/components/transactionNew/transactionNew.html",
        bindings : {
        	users : "<",
        	transactions: "<",
            authObj: "<"
        },
        controller: ["$state", "$scope", controller]
    });

    function controller($state, $scope){

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

        ctrl.validTransaction = null;

        function deltasValid(){
            ctrl.validTransaction = null;
            var totalMoney = 0;

            var transaction = {
                from: {},
                to: {},
                deltas: {}
            };

            var valid = false;
            angular.forEach(ctrl.data.from, function(value, uid){
                if (value){
                    value = Math.round(value * 100);
                    if (value !== 0) {
                        transaction.deltas[uid] = value;
                        totalMoney += value;
                        transaction.from[uid] = value;
                        valid = true;
                    }
                }
            });
            if (!valid) {
                console.log("no valid entries in data.from");
                return false;
            }

            var totalRatio = 0;
            switch (ctrl.data.type){
                case "single":
                    if (!('toSingle' in ctrl.data)) {
                        console.log("no selected entry in ctrl.data.toSingle");
                        return false;
                    }
                    transaction.to[ctrl.data.toSingle.$id] = 1;
                    totalRatio = 1;
                    break;
                case "even":
                    valid = false
                    angular.forEach(ctrl.data.toEven, function(included, uid){
                        if (included) {
                            transaction.to[uid] = 1;
                            totalRatio += 1;
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
                                totalRatio += ratio;
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

            var moneyPerUnit = totalMoney / totalRatio;
            angular.forEach(transaction.to, function(ratio, uid){
                transaction.deltas[uid] = (uid in transaction.deltas ? transaction.deltas[uid] : 0) - ratio * moneyPerUnit;
            });
            valid = false;
            angular.forEach(transaction.deltas, function(delta, uid){
                if (delta === 0) delete transaction.deltas[uid];
                else valid = true;
            });
            if (!valid){
                console.log("no valid delta in transaction.deltas");
                return false;
            }
            console.log(transaction);
            ctrl.validTransaction = transaction;
            return true;
        };

        $scope.$watch(function(){return ctrl.data},deltasValid,true);

        ctrl.submit = function(){
            ctrl.transactions.$add({
                by: ctrl.authObj.uid,
                $priority: firebase.database.ServerValue.TIMESTAMP,
                comment: ctrl.data.comment,
                from: ctrl.validTransaction.from,
                to: ctrl.validTransaction.to
            }).then(function(ref) {
                $state.go('^.transaction', {transactionId: ref.key});
            });
            return true;


            // var valid = false;
            // angular.forEach(ctrl.data.from, function(value, uid){
            //     if (value){
            //     	value = Math.round(value * 100);
            //         if (value !== 0) {
            //         	transaction.from[uid] = value;
            //         	valid = true;
            //         }
            //     }
            // });
            // if (!valid) {
            //     console.log("no valid entries in data.from");
            //     return false;
            // }
            // switch (ctrl.data.type){
            //     case "single":
            //         transaction.to[ctrl.data.toSingle.$id] = 1;
            //         break;
            //     case "even":
            //         valid = false
            //         angular.forEach(ctrl.data.toEven, function(included, uid){
            //             if (included) {
            //                 transaction.to[uid] = 1;
            //                 valid = true;
            //             }
            //         });
            //         if (!valid) {
            //             console.log("no ticked entries in ctrl.data.toEven");
            //             return false;
            //         }
            //         break;
            //     case "uneven":
            //         valid = false
            //         angular.forEach(ctrl.data.toUneven, function(ratio, uid){
            //             if (ratio) {
	           //      		ratio = Math.round(ratio);
	           //      		if (ratio !== 0) {
	           //                  transaction.to[uid] = ratio;
	           //                  valid = true;
	           //      		}
            //             }
            //         });
            //         if (!valid) {
            //             console.log("no valid entries in ctrl.data.toUneven");
            //             return false;
            //         }
            //         break;
            //     default:
            //         console.log("no valid choice of type in ctrl.data.type");
            //         return false;
            // }
            // console.log(transaction);
            // ctrl.transactions.$add(transaction).then(function(ref) {
            //     $state.go('^.transaction', {transactionId: ref.key});
            // });
        };
	}

})();
