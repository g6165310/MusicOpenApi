<template lang='pug'>
  <div id="app">
      div#header.bg-cover.mb-5
        h1 獨立音樂
        span 
        a#scroll-down(href="#content" ref="scrollDown" @click="scrollDown")
      div#content.mb-3
        card
      div#footer.mb-3.text-center
        p Copyright © 2018 何宗益 All rights reserved
  </div>
</template>

<script>
import $ from "jquery";
import card from './components/card';
export default {
  name: 'App',
  components:{
    card,
  },
  data(){
    return{
    }
  },
  methods:{
    scrollDown(){
      console.log();
      const targetPos = $('#content').offset().top;
      $('html, body').animate({
        scrollTop: targetPos-45
      },800)
    }
  },
}
</script>

<style lang='scss'>
@import "./assets/all";

</style>
