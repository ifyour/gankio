<script>
import urlServer from 'base/ajaxUrl';
import { Header, Button, Toast, Loadmore, Indicator } from 'mint-ui';
const imgList = resolve => require(['./subComponents/imgList'], resolve);
const detailList = resolve => require(['./subComponents/detailList'], resolve);
const commonList = resolve => require(['./subComponents/commonList'], resolve);

export default {
  name: 'index',
  data() {
    return {
      topTitle: 'Gank.io',
      selected: 'all',
      contentList: [],
      allText: '↑ 上拉加载更多',
      allLoaded: false,
      page: 1,
      type: ''
    };
  },
  components: {
    'mt-header': Header,
    'mt-button': Button,
    'mt-loadmore': Loadmore,
    all: commonList,
    fuli: imgList,
    Android: detailList,
    iOS: detailList,
    fe: detailList,
    'exp-resouce': detailList,
    'rest-video': detailList
  },
  watch: {
    selected: {
      handler(curVal) {
        this.contentList = [];
        if (curVal === 'all') {
        } else if (curVal === 'Android') {
          this.type = 'Android';
        } else if (curVal === 'iOS') {
          this.type = 'iOS';
        } else if (curVal === 'fe') {
          this.type = '前端';
        } else if (curVal === 'exp-resouce') {
          this.type = '拓展资源';
        } else if (curVal === 'fuli') {
          this.type = '福利';
        } else if (curVal === 'rest-video') {
          this.type = '休息视频';
        }
        this.getList();
      },
      deep: true
    },
    $route(to, from) {
      console.log(to, from);
    }
  },
  mounted() {
    this.allLoaded = false;
    this.page = 1;
    this.type = 'content';
    this.getList();
  },
  methods: {
    /**
     * [getList description]获取列表数据
     * @return {[type]} [description]
     */
    getList(page, type) {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      });
      page = page || 1;
      let url = '';
      if (this.selected === 'all') {
        url = urlServer.ApiUrl + '/history/content/10/';
      } else {
        url = urlServer.ApiUrl + '/data/' + this.type + '/10/';
      }
      this.$ajax
        .get(url + page)
        .then(res => {
          if (!res.data.error) {
            let data = res.data.results,
              str = '';
            if (data.length) {
              if (this.selected === 'all') {
                $(data).each(function(i, v) {
                  str = v.content;
                  str = str.substring(
                    str.indexOf('src=') + 4,
                    str.indexOf('/>')
                  );
                  v.img = str;
                });
              }
              if (page == 1) {
                this.contentList = res.data.results;
              } else {
                for (let i = 1; i < data.length; i++) {
                  this.contentList.push(res.data.results[i]);
                }
              }
            }
          }
          Indicator.close();
        })
        .catch(error => {
          console.log(error);
          Indicator.close();
          // Toast('网络异常，请稍后再试！');
        });
    },
    /**
     * [loadBottom description]加载更多
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    loadBottom() {
      setTimeout(() => {
        this.getList(++this.page, this.type);
        this.$refs.loadmore.onBottomLoaded();
      }, 1500);
    }
  }
};
</script>

<template>
	<div class="class-transition-content">
		<mt-header fixed :title="topTitle"></mt-header>
		<div class="nav_wrap">
			<div class="top_nav">
				<a class="tab_item" :class="selected === 'all' && 'active'" @click.prevent="selected = 'all'">All</a>
				<a class="tab_item" :class="selected === 'Android' && 'active'" @click.prevent="selected = 'Android'">Android</a>
				<a class="tab_item" :class="selected === 'iOS' && 'active'" @click.prevent="selected = 'iOS'">iOS</a>
				<a class="tab_item" :class="selected === 'fe' &&  'active'" @click.prevent="selected = 'fe'">前端</a>
				<a class="tab_item" :class="selected === 'exp-resouce' && 'active'" @click.prevent="selected = 'exp-resouce'">拓展资源</a>
				<a class="tab_item" :class="selected === 'fuli' && 'active'" @click.prevent="selected = 'fuli'">福利</a>
				<a class="tab_item" :class="selected === 'rest-video' &&  'active'" @click.prevent="selected = 'rest-video'">休息视频</a>
			</div>
		</div>
		<div class="content_wrap">
			<mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" bottom-loading-text="正在加载..." bottom-drop-text="↓  释放立即加载" :bottom-pull-text="allText" ref="loadmore">
				<ul>
					<component :is="selected" :contentlist="contentList" keep-alive></component>
				</ul>
			</mt-loadmore>
		</div>
	</div>
</template>

<style scoped>
@import '../../css/index.css';
</style>