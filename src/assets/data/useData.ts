import { ref } from 'vue';
import axios from 'axios';

interface Marker {
  name: string;
  tel: string,
  home: string;
  latitude: number;
  longitude: number;
  streetViewImageUrl?: string;
}

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



  const getData = () => {
    const selectedFilePath = `/api_json/${selectedFile.value}`;
    axios
      .get(selectedFilePath)
      .then((response) => {
        const data = response.data;
        const markersData: Marker[] = [];
        data.forEach((item: any) => {
          if (item.latitude !== undefined && item.longitude !== undefined) {
            const marker: Marker = {
              name: item.name,
              tel: item.tel,
              home: item.home,
              latitude: item.latitude,
              longitude: item.longitude,
            };
            // Street View 이미지 URL 설정
            const streetViewApiUrl = `${street_view_api_url.value}?size=600x400&location=${marker.latitude},${marker.longitude}&key=${streetViewApiKey.value}`;
            marker.streetViewImageUrl = streetViewApiUrl;
  
            markersData.push(marker);
          }
        });
        markers.value = markersData;
      })
      .catch((error) => console.error(error));
  };

  const searchLocation = () => {
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery.value}&limit=1&appid=${process.env.VUE_APP_API_KEY_weather}`;
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

  const saveMarkerData = (marker: Marker): void => {
    currentMarker.value = marker;

    if (!marker.streetViewImageUrl) {
      console.error('Street View 이미지 URL이 없습니다.');
    }
    
    
  };
  
  const showModalWithData = (): void => {
    
    showModal.value = true;
  
    const imgElement: HTMLImageElement | null = document.getElementById('streetview-image') as HTMLImageElement;
    
    if (imgElement && currentMarker.value && currentMarker.value.streetViewImageUrl) {
      imgElement.src = currentMarker.value.streetViewImageUrl;
    } else {
      console.error('이미지를 표시할 요소를 찾을 수 없습니다.');
    }
  };

  const openModal = (): void => {
    showModal.value = true;
  };

  const infoModal = () => {
    showInfoModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    showInfoModal.value=false;
  };

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
    saveMarkerData,
    showModalWithData,
    goback,
    showModal,
    showInfoModal,
    currentMarker,
    openModal,
    infoModal,
    closeModal
  };
}