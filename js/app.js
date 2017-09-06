var siderbarDom = document.getElementById("siderbar");
var siderbarSmallDom = document.getElementById("siderbarSmall");
var mapDom = document.getElementById("map");

var model = function () {
    var self = this;
    self.keyword = ko.observable();
    self.displayedLocations = ko.observableArray(locations);
    self.filter = function () {
        var keyword = this.keyword();
        if (!keyword) {
            this.displayedLocations(locations);
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
            this.displayedLocations(locArr);
            showListings(markArr);
        }
    }

    self.bounceLoaction = function(location) {
        bounceMarker(location.marker);
        populateInfoWindow(location.marker);
    }


    self.sideNavWidth = ko.observable('');

    self.openBtn = function() {
        self.sideNavWidth('0');
    };
    self.closeBtn = function() {
        self.sideNavWidth('-300px');
    };

}


ko.applyBindings(new model());