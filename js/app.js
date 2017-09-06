var siderbarDom = document.getElementById("siderbar");
var siderbarSmallDom = document.getElementById("siderbarSmall");
var mapDom = document.getElementById("map");

var model = function () {
    this.keyword = ko.observable();
    this.displayedLocations = ko.observableArray(locations);

}

function filter(bindedModel) {
    var keyword = bindedModel.keyword();
    if (!keyword) {
        bindedModel.displayedLocations(locations);
        showListings(markers);
    } else {
        var locArr = [];
        var markArr = [];
        for (var i = 0; i < locations.length; i++) {
            if (locations[i].title.toLocaleLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                locArr.push(locations[i]);
                markArr.push(locations[i].marker);
            }
        }
        bindedModel.displayedLocations(locArr);
        showListings(markArr);
    }
}

function bounceLoaction(location) {
    bounceMarker(location.marker);
    populateInfoWindow(location.marker);
}

function closeSider() {
    siderbarSmallDom.style.display = 'block';
    siderbarDom.style.display = 'none';
    mapDom.style.left = '42px';
}

function openSider() {
    siderbarSmallDom.style.display = 'none';
    siderbarDom.style.display = 'block';
    mapDom.style.left = '222px';
}


ko.applyBindings(new model());