<template lang="pug">
    gmap-map(:center="center" :zoom="15" style="width:100%;  height: 400px;")
        gmap-marker(:position="position" :clickable="true")
      
      
</template>
<script>

export default{
    name: "googleMap",
    props:['place'],
    data(){
        var vm= this;
        return{
            center: {},
            position: {},
        }
    },
    mounted(){
        this.geolocate();
    },
    watch:{
        place(){
            const vm = this;
            if(vm.place.showInfo[0].latitude){
                vm.position={
                    lat:Number(vm.place.showInfo[0].latitude),
                    lng:Number(vm.place.showInfo[0].longitude),
                }
                vm.center={
                    lat:Number(vm.place.showInfo[0].latitude),
                    lng:Number(vm.place.showInfo[0].longitude),
                }
            }
            
            
        }
    },
    methods:{
        geolocate: function() {
            navigator.geolocation.getCurrentPosition(position => {
                this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
                };
        });
        },
    },
}

</script>
<style lang="scss">
#map {
        height: 100%;
      }
</style>
