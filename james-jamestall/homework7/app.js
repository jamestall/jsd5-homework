$(function() {
  // DOM is now ready

  	// Initialize the SDK (came from 500px SDK documentation)
	_500px.init({
	  sdk_key: 'c095a1ed8923d151066ec81a6569a9dd1195e5c5' //SDK key came from our app registration on 500px
	});

	// function to insert an image into the DOM
	function loadImage(path, description, target) {
		console.log('<img src="' + path + '" alt="' + description + '"/>')
	    target.append('<img src="' + path + '" alt="' + description + '"/>')
	};

	// Login the current user when they click the login link
	$('#login').click(function() {
		_500px.login();
	});

	// Capture the authorization obtained event, use it to turn the login bits off and the body on
	_500px.on('authorization_obtained', function() {
		// adjust visibility by modifying CSS (prefered)
		$('.sign-in-view').css("display", "none");
		$('.image-results-view').css("display", "inline");
		
		// adjust visibility using jQuery .hide()/.show()
		// $('.sign-in-view').hide();
		// $('.image-results-view').show();

		// Check if browser supports geolocation data (navigator is the keyword to access browser)
		if (navigator.geolocation) {   //if statement is checking for truthy
			navigator.geolocation.getCurrentPosition(function(position) { //create a callback function
				// pull the latitude and longitude out of the position and store in variables
				var lat = position.coords.latitude;
				var long = position.coords.longitude;
				
				// Log lat and long to ensure the call worked correctly
				console.log('lat: ' + lat);
				console.log('long: ' + long);
				
				// Set an arbitrary radius
				var radius = "25mi";
				
				// Build an object that we'll use to form our request
				var searchOptions = {
					geo: lat + ',' + long + ',' + radius,
					only: 'Landscapes',
					image_size: 3,
					rpp: 28
				};

				// Build call to hit the 500px API (/photos/search) and pass in searchOptions
				_500px.api('/photos/search', searchOptions, function(response) {
					if (response.data.photos.length === 0) {
						console.log('No photos found');
					} else {
						console.log('Request succeeded');
						console.log(response);
					};
					//iterate through the object.data.photos, pull out the images and put them in the images into the images div
					//<img src= img_url alt= description>

					$.each(response.data.photos, function(index, photo){
						// construct the variables used to build the img 
						var path = photo.image_url;
						var description = photo.description;
						var target = $('.images');
						// console.log(path, description, target);
						// call the loadImage function to build a img element
						loadImage(path, description, target);
					})
				});
			});

		} else {
			$('.images').append('Sorry, the browser does not support geolocation');
		};

	})
});

// Sort photo results by rating (highest first)
// Return 28 photos instead of default 20
// Bonus: display the current user's infomration on the site after a successful login
