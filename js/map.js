var map;
var markers = [];
var locations = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}, marker:{}},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}, marker:{}},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}, marker:{}},
    {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}, marker:{}},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}, marker:{}},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}, marker:{}}
];

// Style the markers a bit. This will be our listing marker icon.
var defaultIcon;

// Create a "highlighted location" marker color for when the user
// mouses over the marker.
var highlightedIcon;

var largeInfowindow;


function initMarkers() {
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            bounceMarker(this);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        locations[i].marker = marker;
    }
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    if(!infowindow) infowindow = largeInfowindow;
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

        getFoursquareVenues(infowindow);

        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

function getFoursquareVenues(infowindow) {
    $.ajax({
        url : 'https://api.foursquare.com/v2/venues/search',
        data : {
            ll : infowindow.marker.position.lat() + "," + infowindow.marker.position.lng(),
            client_id: "0VK1VSEO4410DYPXLKUBOAULBAY1E0RJ4P1LMSHLK4HM3ZWY",
            client_secret: "BSR0YIAG4B5RSUXWOOEHXCDIZGLEA3T14NT5VSZI4JAARZOQ",
            v: '20170906'
        },
        dataType: "json",
        success : function (data) {
            var contentObj = {};
            if (data.response && data.response.venues && data.response.venues.length > 0) {
                var contact = data.response.venues[0].contact || {};
                contentObj.phone = contact.formattedPhone || '';
                contentObj.twitter = contact.twitter || '';
            }
            setInfowindowContent(infowindow, contentObj);
        },
        error : function () {
            setInfowindowContent(infowindow);
        }

    });
}

function setInfowindowContent(infowindow, contentObj) {
    var contentStr = '<div>' + infowindow.marker.title + '</div>'
    if (!contentObj) {
        contentStr += '<div>' + 'Network error' + '</div>';
    } else {
        for (var key in contentObj) {
            contentStr += '<div>' + key + ' : ' + contentObj[key] + '</div>';
        }
    }
    infowindow.setContent(contentStr);
}

function bounceMarker(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function() {
        marker.setAnimation(null);
    },1000);
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
    return markerImage;
}

function showListings(markers, init) {
    hideMarkers();
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    if(init)map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}


function init() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13,
        mapTypeControl: false
    });
    // Style the markers a bit. This will be our listing marker icon.
    defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    highlightedIcon = makeMarkerIcon('FFFF24');

    largeInfowindow = new google.maps.InfoWindow();
}

function initMap() {

    init();
    initMarkers();
    showListings(markers, true);


}