angular.module("shareTheLove", ["firebase"])
.controller("TransactionController", function TransactionController($scope, $firebaseArray, $firebaseObject) {
  $scope.activeUsers = [];
  $scope.newTransaction = {from:{},to:{}};
  firebase.database().ref("users").once("value",function(snap){
    snap.forEach(function(childSnapshot) {
      if (childSnapshot.val() === true) $scope.activeUsers.push(childSnapshot.key);
    });
  });
  $scope.transactions = $firebaseArray(firebase.database().ref("transactions"));
  $scope.submitTransaction = function(){
    console.log($scope.newTransaction);
    var newTransaction = {from: {}, to: {}, comment: $scope.newTransaction.comment, $priority:firebase.database.ServerValue.TIMESTAMP};
    angular.forEach($scope.newTransaction.from, function(value, key){
      newTransaction.from[key] = value * 100;
    });
    angular.copy($scope.newTransaction.to, newTransaction.to);
//     console.log(newTransaction);
    $scope.transactions.$add(newTransaction);
  };
  $scope.reverseTransaction = function(id){
    var reason = prompt("Please enter a reason for reversing this transaction");
    if (reason.length < 3) alert('Reason needs to be at least 3 characters');
    else if (reason.length >= 128) alert('Reason needs to be less than 128 characters');
    else {
      firebase.database().ref("transactions").child(id).child("reversed").set({comment: reason, by:'c', at: firebase.database.ServerValue.TIMESTAMP});
    }
  };
});
