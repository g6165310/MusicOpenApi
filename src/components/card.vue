<template lang="pug">

.container
  ul.nav.nav-pills.nva-fill.justify-content-center.mb-5
    li.nav-item
      a.nav-link(href='#' @click.prevent="dealingData=rawData,isAllData=true" :class='{active: isAllData}') 所有資訊
    li.nav-item
      a.nav-link(href='#' @click.prevent="getLike" :class="{active: !isAllData}") 我的最愛
  .row.justify-content-center.mb-5
    .col-sm-6
      select.form-control.input-lg(v-model="selectLocation")
        option(value="") -請選擇地區-
        option(:value="location" v-for="location in locations") {{location}}
  .row
    .col-md-4(v-for="(item,i) in filterData[currentPage-1]")
      a(href="#" @click.prevent="showInfo(item)").card.mb-4.box-shadow
        img.card-img-top(:src='item.imageUrl', alt='Card image cap' style={'height':'300px'} v-if="item.imageUrl")
        img.card-img-top(src='https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=beb0f979ed2a7da134fb95a2ae6290c3&auto=format&fit=crop&w=1050&q=80', alt='Card image cap' style={'height':'300px'} v-else)
        .card-body
          p.card-text {{item.title}}
          .d-flex.justify-content-between.align-items-center
  #exampleModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='exampleModalLabel', aria-hidden='true')
    .modal-dialog(role='document')
      .modal-content
        .modal-header
          h4#exampleModalLabel.modal-title {{selectItem.title}}
          button.close(type='button', data-dismiss='modal', aria-label='Close')
            span(aria-hidden='true') ×
        .modal-body
          div.mb-3(style="height: 300px" :style="{backgroundImage:`url(${returnImageUrl})`}" v-if="returnImageUrl")
          div.mb-3.bg-cover(style="height: 300px" :style="{backgroundImage:`url(https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=beb0f979ed2a7da134fb95a2ae6290c3&auto=format&fit=crop&w=1050&q=80)`}" v-else)
          P(v-if="returnInfo") 時間: {{returnInfo.showInfo[0].time}}
            
            button.btn.btn-outline-primary.float-right(type='button' @click="addToLike(selectItem)" v-if='!isLiked') 加入最愛
            button.btn.btn-warning.float-right(type='button' @click="removeLike(selectItem)" v-else) 移除最愛
          P(v-if="returnInfo") 地點: {{returnInfo.showInfo[0].locationName}}
          P(v-if="returnInfo") 地址: {{returnInfo.showInfo[0].location}}
          p(v-if="returnInfo") 票價: {{returnInfo.showInfo[0].price }}
          googleMap(:place="selectItem")
          
  nav.my-5(aria-label='Page navigation example')
    ul.pagination.justify-content-center
      li.page-item(v-show="currentPage!=1")
        a.page-link(href='#', @click='currentPage=1' aria-label="First")
          span First  
      li.page-item(:class='{disabled: currentPage===1}')
        a.page-link(href='#', @click='prev' aria-label="Previous")
          span &laquo;
          span.sr-only Previous
      li.page-item(v-for='page in pagers', :class='{active:currentPage===page}')
        a.page-link(href='#', @click='currentPage=page') {{page}}
      li.page-item(:class='{disabled: currentPage===totalPage}')
        a.page-link(href='#', @click='next' aria-label="Next")
          span &raquo;
          span.sr-only Next 
      li.page-item(v-show="currentPage!=totalPage")
        a.page-link(href='#', @click='currentPage=totalPage' aria-label="Last")
          span Last  
 
</template>
<script>
import $ from "jquery";
import googleMap from './googleMap';
export default {
  components:{
    googleMap,
  },
  data() {
    return {
      rawData: [],
      dealingData:[],
      selectItem:[],
      totalPage:0,
      currentPage: 1,
      locations: [],
      selectLocation: '',
      like:[],
      isLiked:false,
      isAllData:true,
    };
  },
  methods: {
    getRawData() {
      const api =
        "https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=5";
      const vm = this;
      this.$http.get(api).then(response => {
        vm.rawData = response.data;
        vm.cleanData();
        vm.getCityList();
      });
    },
    cleanData(){
      const vm = this;
      vm.rawData.forEach((item, i) => {
        if(item.showInfo!=false){
          if(item.showInfo[0].location.match('捷運行天宮')){
            item.showInfo[0].location = '台北市'
          }else{
            item.showInfo[0].location = item.showInfo[0].location.replace("[",'').replace('401','').replace("臺","台");
          }
          if(item.showInfo[0].price==""){
            item.showInfo[0].price = 'Free'
          }
        }
      });
      vm.dealingData = vm.rawData
    },
    getCityList(){
      const locations = new Set();
      const vm = this;
      vm.rawData.forEach((item, i) => {
        if(item.showInfo!=false){
          locations.add(item.showInfo[0].location.slice(0,3));
        }
      });
      vm.locations = Array.from(locations);
    },
    showInfo(item){
      const vm = this;
      vm.isLiked=false;
      vm.selectItem = item;
      console.log(vm.selectItem)
      
      let result = $.map(vm.like,function(item,index){
        return item.UID
      }).indexOf(vm.selectItem.UID)
      if(result!=-1){
        vm.isLiked = true
      }
      $('#exampleModal').modal('show');
    },
    addToLike(selectItem){
      const vm =this;
      vm.like.push(selectItem);
      vm.isLiked= true;
      localStorage.setItem('Like',JSON.stringify(vm.like));
    },
    removeLike(selectItem){
      const vm =this;
      let index = vm.like.indexOf(selectItem)
      console.log(index)
      if(index>-1){
        vm.like.splice(index,1)
        console.log(index)
        localStorage.clear;
        localStorage.setItem('Like',JSON.stringify(vm.like));
        vm.isLiked=false;
      }
    },
    
    getLike(){
      const vm =this;
      vm.dealingData = vm.like;
      console.log(vm.dealingData)
      vm.isAllData = false;
      vm.currentPage = 1;
    },
    prev(){
      if(this.currentPage>1){
        cons
        this.currentPage = this.currentPage-1
      }
    },
    next(){
      if(this.currentPage<this.totalPage){
        this.currentPage = this.currentPage+1
      }
    },
  },
  computed:{
    filterData() {
      const vm = this;
      // 先過濾
      let items = [];
      if (vm.selectLocation !== '') {
        items = vm.dealingData.filter((item, i) => {
          return item.showInfo[0].location.match(vm.selectLocation);
        });
      } else {
        items = vm.dealingData;
      }
      // 分頁
      const newData = [];
      if(items.length/9<1){
        vm.totalPage = 1
      }else{
        vm.totalPage = Math.ceil(items.length/9);
      }
      items.forEach((item, i) => {
        if (i % 9 === 0) {
          newData.push([]);
        }
        const page = parseInt(i / 9);
        newData[page].push(item);
      });

      return newData;
    },
    returnInfo(){
      const vm = this;
      if(vm.selectItem.showInfo){
        return  vm.selectItem
      }
    },
    returnImageUrl(){
      const vm = this;
      if(vm.selectItem.imageUrl){
        return  vm.selectItem.imageUrl
      }
    },
    pagers(){
      const vm =this;
      const array = []
      let current = this.currentPage
      const offset={
        start:current-2,
        end:current+2,
      }
      if(offset.start < 1){
        offset.end = offset.end + (1 - offset.start)
        offset.start = 1
      }
      if (offset.end > vm.totalPage) {
        offset.start = offset.start - (offset.end - vm.totalPage)
        offset.end = vm.totalPage
      }
      if (offset.start < 1) offset.start = 1
      for (let i = offset.start; i <= offset.end; i++) {
        array.push(i)
      }
      return array
    },
  },
  created() {
    this.getRawData();
    const vm =this;
    if(JSON.parse(localStorage.getItem('Like')).length!=0){
      vm.like = JSON.parse(localStorage.getItem('Like'))
      console.log(vm.like)
    }
  }
};
</script>