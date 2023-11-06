"use strict";
exports.__esModule = true;
var vue_1 = require("vue");
var axios_1 = require("axios");
function useArtData() {
    var zoom = vue_1.ref(13);
    var center = vue_1.ref([37.5665, 126.9780]);
    var url = vue_1.ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    var attribution = vue_1.ref('Map data &copy; OpenStreetMap contributors');
    var markers = vue_1.ref([]);
    var searchQuery = vue_1.ref('');
    var selectedFile = vue_1.ref('');
    var jsonFiles = vue_1.ref(['art_galleries.json', 'museum_data.json']);
    var streetViewApiKey = vue_1.ref('');
    var street_view_api_url = vue_1.ref('https://maps.googleapis.com/maps/api/streetview');
    var getData = function () {
        var selectedFilePath = "/api_json/" + selectedFile.value;
        axios_1["default"]
            .get(selectedFilePath)
            .then(function (response) {
            var data = response.data;
            var markersData = [];
            data.forEach(function (item) {
                if (item.latitude !== undefined && item.longitude !== undefined) {
                    markersData.push({
                        name: item.name,
                        tel: item.tel,
                        home: item.home,
                        latitude: item.latitude,
                        longitude: item.longitude
                    });
                }
            });
            markers.value = markersData;
        })["catch"](function (error) { return console.error(error); });
        console.log(process.env.ID);
    };
    var searchLocation = function () {
        var geocodingApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchQuery.value + "&limit=1&appid=";
        axios_1["default"]
            .get(geocodingApiUrl)
            .then(function (response) {
            if (response.data.length > 0) {
                var location = response.data[0];
                center.value = [location.lat, location.lon];
                getData();
            }
            else {
                console.error('검색된 결과가 없습니다.');
            }
        })["catch"](function (error) { return console.error(error); });
    };
    var showBuildingPhoto = function (marker) {
        var streetViewApiUrl = street_view_api_url.value + "?size=600x400&location=" + marker.latitude + "," + marker.longitude + "&key=" + streetViewApiKey.value;
        marker.streetViewImageUrl = streetViewApiUrl;
        // 이미지 요청 URL을 직접 img 태그의 src에 할당
        var imgElement = document.getElementById('map');
        if (imgElement) {
            imgElement.src = streetViewApiUrl;
        }
        else {
            console.error('이미지를 표시할 요소를 찾을 수 없습니다.');
        }
        console.log(streetViewApiUrl);
    };
    var goback = function () {
        window.history.back();
    };
    return {
        zoom: zoom,
        center: center,
        url: url,
        attribution: attribution,
        markers: markers,
        searchQuery: searchQuery,
        selectedFile: selectedFile,
        jsonFiles: jsonFiles,
        streetViewApiKey: streetViewApiKey,
        street_view_api_url: street_view_api_url,
        getData: getData,
        searchLocation: searchLocation,
        showBuildingPhoto: showBuildingPhoto,
        goback: goback
    };
}
exports["default"] = useArtData;
