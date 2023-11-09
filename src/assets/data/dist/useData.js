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
    var streetViewApiKey = vue_1.ref(process.env.VUE_APP_API_KEY_google);
    var street_view_api_url = vue_1.ref('https://maps.googleapis.com/maps/api/streetview');
    var showModal = vue_1.ref(false);
    var currentMarker = vue_1.ref(null);
    var getData = function () {
        var selectedFilePath = "/api_json/" + selectedFile.value;
        axios_1["default"]
            .get(selectedFilePath)
            .then(function (response) {
            var data = response.data;
            var markersData = [];
            data.forEach(function (item) {
                if (item.latitude !== undefined && item.longitude !== undefined) {
                    var marker = {
                        name: item.name,
                        tel: item.tel,
                        home: item.home,
                        latitude: item.latitude,
                        longitude: item.longitude
                    };
                    // Street View 이미지 URL 설정
                    var streetViewApiUrl = street_view_api_url.value + "?size=600x400&location=" + marker.latitude + "," + marker.longitude + "&key=" + streetViewApiKey.value;
                    marker.streetViewImageUrl = streetViewApiUrl;
                    markersData.push(marker);
                }
            });
            markers.value = markersData;
        })["catch"](function (error) { return console.error(error); });
    };
    var searchLocation = function () {
        var geocodingApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchQuery.value + "&limit=1&appid=" + process.env.VUE_APP_API_KEY_weather;
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
    var saveMarkerData = function (marker) {
        currentMarker.value = marker;
        console.log(currentMarker.value);
        if (!marker.streetViewImageUrl) {
            console.error('Street View 이미지 URL이 없습니다.');
        }
    };
    var showModalWithData = function () {
        showModal.value = true;
        var imgElement = document.getElementById('streetview-image');
        if (imgElement && currentMarker.value && currentMarker.value.streetViewImageUrl) {
            imgElement.src = currentMarker.value.streetViewImageUrl;
        }
        else {
            console.error('이미지를 표시할 요소를 찾을 수 없습니다.');
        }
    };
    var openModal = function () {
        showModal.value = true;
    };
    var closeModal = function () {
        showModal.value = false;
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
        saveMarkerData: saveMarkerData,
        showModalWithData: showModalWithData,
        goback: goback,
        showModal: showModal,
        currentMarker: currentMarker,
        openModal: openModal,
        closeModal: closeModal
    };
}
exports["default"] = useArtData;
