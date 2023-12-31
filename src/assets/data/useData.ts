import { ref } from '@vue/reactivity';
import axios from 'axios';

interface Marker {
  name: string;
  tel: string,
  home: string;
  latitude: number;
  longitude: number;
  streetViewImageUrl?: string;
  weatherIcon?: string;
  temperature?: number;
}

interface Weather {
  icon: string;
}

interface MainWeather {
  temp: number; // 온도 정보를 담을 속성
}

interface WeatherData {
  weather: Weather[];
  main: MainWeather;
}

//각 데이터들을 불러오는 변수들을 선언
export default function useArtData() {
  const zoom = ref(13);
  const center = ref([37.5665, 126.9780]);
  const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  const attribution = ref('Map data &copy; OpenStreetMap contributors');
  const markers = ref([] as Marker[]);
  const searchQuery = ref('');
  const selectedFile = ref('');
  const jsonFiles = ref(['미술관.json','박물관.json','도서관.json','공연장.json','문화_복지관.json']);
  const streetViewApiKey = ref(process.env.VUE_APP_API_KEY_google);
  const street_view_api_url = ref('https://maps.googleapis.com/maps/api/streetview');
  const showModal = ref(false);
  const currentMarker = ref<Marker | null>(null);
  const showInfoModal= ref(false);
  const weatherApiKey = ref(process.env.VUE_APP_API_KEY_weather);
  const weatherIcon = ref(''); 
  const showWeatherModal= ref(false);
  
  // 선택한 파일에 대한 데이터를 가져오는 함수. 해당 파일의 경로를 생성하고 axios를 사용하여
  // GET 요청을 보내고 응답을 처리. 데이터를 받아와 markers 배열에 객체를 생성하고 추가
  const getData = () => {
    const selectedFilePath = `/api_json/${selectedFile.value}`;
    axios
      .get(selectedFilePath)
      .then(async (response) => { // async 키워드 추가
        const data = response.data;
        const markersData: Marker[] = [];
        for (const item of data) { // forEach 대신 for...of 사용
          if (item.latitude !== undefined && item.longitude !== undefined) {
            const marker: Marker = {
              name: item.name,
              tel: item.tel,
              home: item.home,
              latitude: item.latitude,
              longitude: item.longitude
            };
            // Street View 이미지 URL 설정
            const streetViewApiUrl = `${street_view_api_url.value}?size=600x400&location=${marker.latitude},${marker.longitude}&key=${streetViewApiKey.value}`;
            marker.streetViewImageUrl = streetViewApiUrl;
        
            await getWeatherIcon(marker); // await 키워드 추가
            updateMarkerData(marker);
          }
        }
      })
      .catch((error) => console.error(error));
  };
  
  // 주어진 마커의 위도와 경도를 기반으로 openweatherMap API를 호출하여 날씨 정보를 가져오는 함수.
  // api응답에서 날씨 아이콘과 온도 정보를 추출하여 마커 객체에 할당.
  const getWeatherIcon = (marker: Marker) => {
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${marker.latitude}&lon=${marker.longitude}&units=metric&appid=${weatherApiKey.value}`;
  
    axios.get<WeatherData>(forecastApiUrl)
      .then(response => {
        const iconId = response.data.weather[0].icon;
        const temperature = response.data.main.temp; // 날씨 정보에서 온도 정보 가져오기
        marker.weatherIcon = `http://openweathermap.org/img/w/${iconId}.png`;
        marker.temperature = temperature; // 온도 정보 할당
        updateMarkerData(marker);
      })
      .catch(error => {
        console.error('API 호출 실패:', error);
      });
  };
  
  
  // 검색어를 기반으로 OpenWeatherMap API의 지오코딩 기능을 사용하여 위치를 검색하는 함수.
  // API를 호출하여 검색 결과를 받아와 center 값을 업데이트하고, getData 함수를 호출하여 해당 위치의 데이터를 가져옴
  const searchLocation = () => {
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery.value}&limit=1&appid=${weatherApiKey.value}`;
    axios
      .get(geocodingApiUrl)
      .then((response) => {
        if (response.data.length > 0) {
          const location = response.data[0];
          center.value = [location.lat, location.lon];
          getData();
        } else {
          console.error('검색된 결과가 없습니다.');
        }
      })
      .catch((error) => console.error(error));
  };

  // 새로운 마커 데이터를 받아와 markers 배열에서 해당 마커를 찾아 업데이트하는 함수.
  // 마커의 위도와 경도를 기준으로 배열에서 해당 마커를 찾고, 존재한다면 데이터를 업데이트하고, 존재하지 않는다면 새로운 마커로 추가.
  const updateMarkerData = async (newData: Marker): Promise<void> => {
    // marker 데이터를 변경하는 로직
    const index = markers.value.findIndex(
      marker => marker.latitude === newData.latitude && marker.longitude === newData.longitude
    );
    if (index !== -1) {
      markers.value[index] = { ...newData };
    } else {
      console.error('해당 위치를 가진 마커를 찾을 수 없습니다. 새로운 마커를 추가합니다.');
      markers.value.push(newData);
    }
  };
    

  // 마커 클릭 이벤트를 처리하는 함수. 
  // 클릭한 마커의 데이터를 저장하고, showModalWithData 함수를 호출하여 모달을 열고, 
  // getWeatherIcon 함수를 호출하여 해당 위치의 날씨 정보를 가져옴.
  const handleMarkerClick = async (marker: Marker): Promise<void> => {
    saveMarkerData(marker);
    showModalWithData();
    await getWeatherIcon(marker);
  };

  // 클릭한 마커의 데이터를 저장하는 함수. 현재 클릭한 마커의 데이터를 currentMarker에 할당.
  const saveMarkerData = (marker: Marker | undefined): void => {
    if (!marker) {
      console.error('클릭한 마커의 데이터를 찾을 수 없습니다.');
      return;
    }

    currentMarker.value = { ...marker};
  
    if (!currentMarker.value?.streetViewImageUrl) {
      const streetViewApiUrl = `${street_view_api_url.value}?size=600x400&location=${currentMarker.value?.latitude},${currentMarker.value?.longitude}&key=${streetViewApiKey.value}`;
      currentMarker.value.streetViewImageUrl = streetViewApiUrl;
      console.error('Street View 이미지 URL이 없습니다.');
    }
  };

  // 모달을 열고, 현재 마커의 Street View 이미지 URL을 설정하여 표시하는 함수.
  const showModalWithData = (): void => {
    const imgElement: HTMLImageElement | null = document.getElementById('streetview-image') as HTMLImageElement;
  
    if (imgElement && currentMarker.value && currentMarker.value.streetViewImageUrl) {
      imgElement.src = currentMarker.value.streetViewImageUrl;
      showModal.value = true;
    } 
    else {
      console.error('이미지를 표시할 요소를 찾을 수 없습니다.');
    }
  };
  
  
  // 모달을 열기 위한 함수
  const openModal = (): void => {
    showModal.value = true;
  };

  // 누른 마커의 정보 모달을 열기 위한 함수
  const infoModal = () => {
    showInfoModal.value = true;
  };

  // 선택한 마커 데이터의 날씨 기온을 확인하기 위한 날씨
  const weatherModal = (): void => {
    showWeatherModal.value = true;
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    showModal.value = false;
    showInfoModal.value=false;
    showWeatherModal.value = false;
  };

  // 브라우저의 이전 페이지로 이동하는 함수
  const goback = () => {
    window.history.back();
  }

  return {
    zoom,
    center,
    url,
    attribution,
    markers,
    searchQuery,
    selectedFile,
    jsonFiles,
    streetViewApiKey,
    street_view_api_url,
    getData,
    searchLocation,
    updateMarkerData,
    handleMarkerClick,
    saveMarkerData,
    showModalWithData,
    goback,
    showModal,
    showInfoModal,
    currentMarker,
    openModal,
    infoModal,
    closeModal,
    weatherIcon,
    weatherModal,
    showWeatherModal
  };
}