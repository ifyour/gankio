<script>
import urlServer from 'base/ajaxUrl';
import tool from 'base/tool';
import { Header, Button, Toast, Indicator } from 'mint-ui';
export default {
  name: 'detail',
  data() {
    return {
      topTitle: '',
      infoList: {}
    };
  },
  components: {
    'mt-header': Header,
    'mt-button': Button
  },
  mounted() {
    this.topTitle = this.$route.query.title;
    this.getInfo();
  },
  methods: {
    /**
     * [getList description]获取列表数据
     * @return {[type]} [description]
     */
    getInfo() {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      });
      let str = this.$route.query.time,
        arr = str.split('-');
      this.$ajax
        .get(urlServer.ApiUrl + '/day/' + arr[0] + '/' + arr[1] + '/' + arr[2])
        .then(res => {
          if (!res.data.error) {
            if (res.data.results) {
              this.infoList = res.data.results;
            }
          }
          Indicator.close();
          tool.setWechatTitle(this.$route.query.title);
        })
        .catch(error => {
          console.log(error);
          Indicator.close();
        });
    }
  }
};
</script>

<template>
	<div class="class-transition-content detail_page">
		<mt-header fixed :title="topTitle">
			<router-link to="/" slot="left">
			    <mt-button icon="back"></mt-button>
			 </router-link>
		</mt-header>
		<div class="content_wrap">
			<img class="detail_img" :src="img.url" alt="" v-for="img in infoList.福利">
			<div class="block" v-for="(value, key) in infoList">
				<dl class="list_wrap" v-if="key != '福利'">
					<dt class="info_type" v-text="key"></dt>
					<dd class="info_list" v-for="list in value">
						<a :href="list.url">
							<div class="title">{{list.desc}}<span class="auther" v-if="list.who">[{{list.who}}]</span></div>
							<div class="list_img" v-if="list.images">
								<img :src="list.images" alt="">
							</div>
						</a>
					</dd>
				</dl>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import '../../css/index.css';
</style>