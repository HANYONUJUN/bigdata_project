"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var reactivity_1 = require("@vue/reactivity");
var axios_1 = require("axios");
function useArtData() {
    var _this = this;
    var zoom = reactivity_1.ref(13);
    var center = reactivity_1.ref([37.5665, 126.9780]);
    var url = reactivity_1.ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    var attribution = reactivity_1.ref('Map data &copy; OpenStreetMap contributors');
    var markers = reactivity_1.ref([]);
    var searchQuery = reactivity_1.ref('');
    var selectedFile = reactivity_1.ref('');
    var jsonFiles = reactivity_1.ref(['미술관.json', '박물관.json', '도서관.json', '공연장.json', '문화_복지관.json']);
    var streetViewApiKey = reactivity_1.ref(process.env.VUE_APP_API_KEY_google);
    var street_view_api_url = reactivity_1.ref('https://maps.googleapis.com/maps/api/streetview');
    var showModal = reactivity_1.ref(false);
    var currentMarker = reactivity_1.ref(null);
    var showInfoModal = reactivity_1.ref(false);
    var weatherApiKey = reactivity_1.ref(process.env.VUE_APP_API_KEY_weather);
    var weatherIcon = reactivity_1.ref('');
    var showWeatherModal = reactivity_1.ref(false);
    var getData = function () {
        var selectedFilePath = "/api_json/" + selectedFile.value;
        axios_1["default"]
            .get(selectedFilePath)
            .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
            var data, markersData, _i, data_1, item, marker, streetViewApiUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = response.data;
                        markersData = [];
                        _i = 0, data_1 = data;
                        _a.label = 1;
                    case 1:
                        if (!(_i < data_1.length)) return [3 /*break*/, 4];
                        item = data_1[_i];
                        if (!(item.latitude !== undefined && item.longitude !== undefined)) return [3 /*break*/, 3];
                        marker = {
                            name: item.name,
                            tel: item.tel,
                            home: item.home,
                            latitude: item.latitude,
                            longitude: item.longitude
                        };
                        streetViewApiUrl = street_view_api_url.value + "?size=600x400&location=" + marker.latitude + "," + marker.longitude + "&key=" + streetViewApiKey.value;
                        marker.streetViewImageUrl = streetViewApiUrl;
                        return [4 /*yield*/, getWeatherIcon(marker)];
                    case 2:
                        _a.sent(); // await 키워드 추가
                        updateMarkerData(marker);
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        }); })["catch"](function (error) { return console.error(error); });
    };
    var getWeatherIcon = function (marker) {
        var forecastApiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + marker.latitude + "&lon=" + marker.longitude + "&units=metric&appid=" + process.env.VUE_APP_API_KEY_weather;
        axios_1["default"].get(forecastApiUrl)
            .then(function (response) {
            var iconId = response.data.weather[0].icon;
            var temperature = response.data.main.temp; // 날씨 정보에서 온도 정보 가져오기
            marker.weatherIcon = "http://openweathermap.org/img/w/" + iconId + ".png";
            marker.temperature = temperature; // 온도 정보 할당
            updateMarkerData(marker);
        })["catch"](function (error) {
            console.error('API 호출 실패:', error);
        });
    };
    var searchLocation = function () {
        var geocodingApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchQuery.value + "&limit=1&appid=" + weatherApiKey.value;
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
    var updateMarkerData = function (newData) { return __awaiter(_this, void 0, Promise, function () {
        var index;
        return __generator(this, function (_a) {
            index = markers.value.findIndex(function (marker) { return marker.latitude === newData.latitude && marker.longitude === newData.longitude; });
            if (index !== -1) {
                markers.value[index] = __assign({}, newData);
            }
            else {
                console.error('해당 위치를 가진 마커를 찾을 수 없습니다. 새로운 마커를 추가합니다.');
                markers.value.push(newData);
            }
            return [2 /*return*/];
        });
    }); };
    var handleMarkerClick = function (marker) { return __awaiter(_this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    saveMarkerData(marker);
                    showModalWithData();
                    return [4 /*yield*/, getWeatherIcon(marker)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var saveMarkerData = function (marker) {
        var _a, _b, _c;
        if (!marker) {
            console.error('클릭한 마커의 데이터를 찾을 수 없습니다.');
            return;
        }
        currentMarker.value = __assign({}, marker);
        if (!((_a = currentMarker.value) === null || _a === void 0 ? void 0 : _a.streetViewImageUrl)) {
            var streetViewApiUrl = street_view_api_url.value + "?size=600x400&location=" + ((_b = currentMarker.value) === null || _b === void 0 ? void 0 : _b.latitude) + "," + ((_c = currentMarker.value) === null || _c === void 0 ? void 0 : _c.longitude) + "&key=" + streetViewApiKey.value;
            currentMarker.value.streetViewImageUrl = streetViewApiUrl;
            console.error('Street View 이미지 URL이 없습니다.');
        }
    };
    var showModalWithData = function () {
        var imgElement = document.getElementById('streetview-image');
        if (imgElement && currentMarker.value && currentMarker.value.streetViewImageUrl) {
            imgElement.src = currentMarker.value.streetViewImageUrl;
            showModal.value = true;
        }
        else {
            console.error('이미지를 표시할 요소를 찾을 수 없습니다.');
        }
    };
    var openModal = function () {
        showModal.value = true;
    };
    var infoModal = function () {
        showInfoModal.value = true;
    };
    var weatherModal = function () {
        showWeatherModal.value = true;
    };
    var closeModal = function () {
        currentMarker.value = null;
        showModal.value = false;
        showInfoModal.value = false;
        showWeatherModal.value = false;
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
        updateMarkerData: updateMarkerData,
        handleMarkerClick: handleMarkerClick,
        saveMarkerData: saveMarkerData,
        showModalWithData: showModalWithData,
        goback: goback,
        showModal: showModal,
        showInfoModal: showInfoModal,
        currentMarker: currentMarker,
        openModal: openModal,
        infoModal: infoModal,
        closeModal: closeModal,
        weatherIcon: weatherIcon,
        weatherModal: weatherModal,
        showWeatherModal: showWeatherModal
    };
}
exports["default"] = useArtData;
