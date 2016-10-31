"use strict";
(function() {
    angular
    .module("shareTheLove")
    .component("transactionDetail", {
        templateUrl: "app/components/transactionDetail/transactionDetail.html",
        bindings: {
            transaction: "<",
            users: "<",
            transactionRef: "<",
            authObj: "<"
        },
        controller: ["Auth", controller]
    });

    function controller(Auth){

        var ctrl = this;

        ctrl.reverse = function(comment){
            ctrl.transactionRef.child('reversed').set({
                by: Auth.$getAuth().uid,
                at: firebase.database.ServerValue.TIMESTAMP,
                comment: comment
            });
        };
    }

})();
