<template lang="pug">
    gmap-map(:center="center" :zoom="15" style="width:100%;  height: 400px;" ref='map')
        gmap-marker(:position="position" :clickable="true")
</template>
<script>
export default {
  name: "googleMap",
  props: ["selected"],
  data() {
    var vm = this;
    return {
      center: {},
      position: {}
    };
  },
  created() {
    this.geolocate();
  },
  mounted() {},
  watch: {
    selected() {
      const vm = this;
      if (vm.selected.showInfo[0].latitude) {
        vm.position = {
          lat: Number(vm.selected.showInfo[0].latitude),
          lng: Number(vm.selected.showInfo[0].longitude)
        };
        vm.center = {
          lat: Number(vm.selected.showInfo[0].latitude),
          lng: Number(vm.selected.showInfo[0].longitude)
        };
      }
    }
  },
  methods: {
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
};
</script>
<style lang="scss">
#map {
  height: 100%;
}
</style>
