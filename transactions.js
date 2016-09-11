var myFirebaseRef = new Firebase("https://share-the-love.firebaseio.com/");

window.onload = function() {
  var tbody = document.getElementById('transactions').children[1];
  myFirebaseRef.child("transactions").on("child_added", function(snapshot) {
    console.log(snapshot.key());  // Alerts "San Francisco"
    var row = document.createElement('tr');
    row.id = snapshot.key();

    var date = new Date(snapshot.getPriority());

    var dateCell = document.createElement('td');
    dateCell.appendChild(document.createTextNode(date.toLocaleString()));
    row.appendChild(dateCell);

    var fromCell = document.createElement('td');
    var fromDl = document.createElement('dl');
    snapshot.child('from').forEach(function(childSnapshot) {
      var dt = document.createElement('dt');
      dt.appendChild(document.createTextNode(childSnapshot.key()));
      fromDl.appendChild(dt);
      var dd = document.createElement('dd');
      dd.appendChild(document.createTextNode('$' + (childSnapshot.val()/100).toFixed(2)));
      fromDl.appendChild(dd);
    });
    fromCell.appendChild(fromDl);
    row.appendChild(fromCell);

    var toCell = document.createElement('td');
    var toDl = document.createElement('dl');
    snapshot.child('to').forEach(function(childSnapshot) {
      var dt = document.createElement('dt');
      dt.appendChild(document.createTextNode(childSnapshot.key()));
      toDl.appendChild(dt);
      var dd = document.createElement('dd');
      dd.appendChild(document.createTextNode(childSnapshot.val()));
      toDl.appendChild(dd);
    });
    toCell.appendChild(toDl);
    row.appendChild(toCell);

    var reverseCell = document.createElement('td');
    var reverseButton = document.createElement('button');
    reverseButton.setAttribute('type','button');
    reverseButton.appendChild(document.createTextNode('Reverse'));
    reverseButton.addEventListener('click',function(){
      var reason = prompt("Please enter a reason for reversing this transaction");
      if (reason.length < 3) alert('Reason needs to be at least 3 characters');
      else if (reason.length >= 128) alert('Reason needs to be less than 128 characters');
      else {
        var value = {comment: reason, by:'c'};
        console.log(value);
        snapshot.ref().child('reversed').setWithPriority(value,Firebase.ServerValue.TIMESTAMP);
      }
    });
    reverseCell.appendChild(reverseButton);
    row.appendChild(reverseCell);

    tbody.appendChild(row);

  });

  var from = document.getElementById('from');
  var to = document.getElementById('to');
  var comment = document.getElementById('comment');

  var tos = [];
  var froms = [];

  myFirebaseRef.child("users").once("value", function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      if (childSnapshot.val() !== true) return;
      var name = childSnapshot.key();

      var id = 'from_' + name;
      var label = document.createElement('label');
      label.setAttribute('for',id);
      label.appendChild(document.createTextNode(name));
      from.appendChild(label);
      var input = document.createElement('input');
      input.className = name;
      input.id = id;
      input.setAttribute('name', id);
      input.setAttribute('type','number');
      input.setAttribute('min', 0.01);
      input.setAttribute('step', 0.01);
      from.appendChild(input);
      froms.push(input);

      var id = 'to_' + name;
      var label = document.createElement('label');
      label.setAttribute('for',id);
      label.appendChild(document.createTextNode(name));
      to.appendChild(label);
      var input = document.createElement('input');
      input.className = name;
      input.id = id;
      input.setAttribute('name', id);
      input.setAttribute('type','number');
      input.setAttribute('min', 0.01);
      input.setAttribute('step', 0.01);
      to.appendChild(input);
      tos.push(input);

    });
  });

  document.getElementById('form').addEventListener('submit',function(event){
    event.preventDefault();
    console.log("hello world out there yo");
    var f = document.forms["form"];
    var fromValues = {};
    var fromsSet = false;
    for (i = 0, l = froms.length; i < l; i++){
      var from = froms[i];
      var n = Number(from.value);
      if (Number.isNaN(n)) continue;
      n = Math.round(n * 100);
      if (Number.isSafeInteger(n) && n > 0) {
        fromsSet = true;
        fromValues[from.className] = n;
      }
    }
    if (!fromsSet) return false;

    var tosSet = false;
    var toValues = {};
    for (i = 0, l = tos.length; i < l; i++){
      var to = tos[i];      
      var n = Number(to.value);
      if (Number.isNaN(n)) continue;
      if (Number.isFinite(n) && n > 0) {
        tosSet = true;
        toValues[to.className] = n;
      }
    }
    if (!tosSet) return false;
    
    var value = {comment: comment.value, from: fromValues, to: toValues};
    console.log(value);
    myFirebaseRef.child("transactions").push().setWithPriority(value, Firebase.ServerValue.TIMESTAMP);
    return true;
    
  });

}