'use strict';

firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  
  console.log(errorCode + ": " + errorMessage);

});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;

    refresh();

	setInterval(function() {
		refresh();
	}, 1000 * 30);
    
  } else {
    
  }

});

var main = document.getElementById('main');
var current = document.getElementById('current');
var time;

var refresh = function() {
	main.innerHTML = '';
	time = new Date().getTime();
	current.textContent = time;
	var posts = firebase.database().ref().child('notes').child('posts');
	console.log(posts);
	var list;
	var innerDiv = document.createElement('div');
	innerDiv.id = 'inner';
	posts.once('value').then(function(snapshot) {
		list = snapshot.val();
		console.log(list);
		for (var post in list) {
			firebase.database().ref().child('notes').child('posts').child(post).once('value').then(function(details) {
				var para = document.createElement('pre');
				console.log(post);
				console.log(details.val());
				console.log(details.val().title);
				var data = details.val();
				var report = '';
				report += data.uid + ": " + data.author + "\n";
				report += data.title + "\n"; 
				report += data.description + "\n";
				report += data.lat + ", " + data.lng + "\n";
				report += data.dateTime + "\n";

				para.innerHTML = report;
				innerDiv.appendChild(para);

				var storedDate = new Date(data.dateTime);
				storedDate.setDate(storedDate.getDate() + 1);
				var expiration = storedDate.getTime();

				if (expiration < time) {
					firebase.database().ref().child('notes').child('posts').child(post).remove();
				}
			});
		}
		main.appendChild(innerDiv);
	});
}