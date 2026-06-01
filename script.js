const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const isParked = ref(false);
    const parkingData = ref({
      lat: null,
      lng: null,
      detail: '',
      timestamp: ''
    });

    // Cek apakah ada data di LocalStorage saat aplikasi dibuka
    onMounted(() => {
      const saved = localStorage.getItem('my_parking_slot');
      if (saved) {
        parkingData.value = JSON.parse(saved);
        isParked.value = true;
      }
    });

    // Fungsi mengambil lokasi GPS
    const saveLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          parkingData.value.lat = position.coords.latitude;
          parkingData.value.lng = position.coords.longitude;
          parkingData.value.timestamp = new Date().toLocaleString('id-ID');
          
          isParked.value = true;
          updateStorage();
          alert("Lokasi GPS berhasil dikunci!");
        }, (error) => {
          alert("Gagal mengambil lokasi. Pastikan GPS aktif.");
        });
      }
    };

    // Update data ke LocalStorage
    const updateStorage = () => {
      localStorage.setItem('my_parking_slot', JSON.stringify(parkingData.value));
    };

    // Navigasi via Google Maps
    const openNavigation = () => {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${parkingData.value.lat},${parkingData.value.lng}&travelmode=walking`;
      window.open(url, '_blank');
    };

    // Reset data
    const resetParking = () => {
      if (confirm("Hapus data parkir saat ini?")) {
        localStorage.removeItem('my_parking_slot');
        isParked.value = false;
        parkingData.value = { lat: null, lng: null, detail: '', timestamp: '' };
      }
    };

    return { isParked, parkingData, saveLocation, updateStorage, openNavigation, resetParking };
  }
}).mount('#app');