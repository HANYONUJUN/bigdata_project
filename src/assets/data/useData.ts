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
  const jsonFiles = ref(['art_galleries.json','museum_data.json']);
  const streetViewApiKey = ref('');
  const street_view_api_url = ref('https://maps.googleapis.com/maps/api/streetview');

  const getData = () => {
    const selectedFilePath = `/api_json/${selectedFile.value}`;
    axios
      .get(selectedFilePath)
      .then((response) => {
        const data = response.data;
        const markersData: Marker[] = [];
        data.forEach((item: any) => {
          if (item.latitude !== undefined && item.longitude !== undefined) {
            markersData.push({
              name: item.name,
              tel: item.tel,
              home: item.home,
              latitude: item.latitude,
              longitude: item.longitude,
            });
          }
        });
        markers.value = markersData;
      })
      .catch((error) => console.error(error));

      console.log(process.env.ID);
  };

  const searchLocation = () => {
    const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchQuery.value}&limit=1&appid=`;
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

  const showBuildingPhoto = (marker: Marker): void => {
    const streetViewApiUrl = `${street_view_api_url.value}?size=600x400&location=${marker.latitude},${marker.longitude}&key=${streetViewApiKey.value}`;
  
    marker.streetViewImageUrl = streetViewApiUrl;

    // 이미지 요청 URL을 직접 img 태그의 src에 할당
    const imgElement: HTMLImageElement | null = document.getElementById('map') as HTMLImageElement;
    if (imgElement) {
      imgElement.src = streetViewApiUrl;
    } else {
      console.error('이미지를 표시할 요소를 찾을 수 없습니다.');
    }
  
    console.log(streetViewApiUrl);
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
    showBuildingPhoto,
    goback,
    
  };
}