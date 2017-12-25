import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';

//use  路由插件
Vue.use(Router);
Vue.prototype.$ajax = axios;
Vue.use(require('vue-wechat-title'));

//动态设置微信网页中标题的指令
// import VueWechatTitle from 'vue-wechat-title';
// Vue.use(VueWechatTitle);

//默认引入app.vue
import App from 'components/App.vue';

//过滤器
Vue.filter('titleFilter', function (value) {
	return value.replace("今日力推：", "");
});
Vue.filter('timeFilter', function (value) {
	let time = new Date(),
		y = time.getFullYear(),
		m = time.getMonth() + 1,
		d = time.getDate();

	function checktime(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	}
	m = checktime(m);
	d = checktime(d);
	let timeDate = y + "-" + m + "-" + d;
	let v = value.substring(0, value.indexOf("T"));
	if (Date.parse(v) === Date.parse(timeDate)) {
		return '今日力推';
	} else {
		return v;
	}
});
Vue.filter('dateFilter', function (value) {
	return value.substring(0, value.indexOf("T"));
});
Vue.filter('imgUrl', function (value) {
	return value.replace("\"", "").replace("\"", "");
});


/**
 * 以下为异步导入vue页面组件
 * 常量必须用 const 声明  且变量名必须为大写
 */
const Index = resolve => require(['components/home/index'], resolve); //首页
const Detail = resolve => require(['components/home/detail'], resolve); //首页

//路由项
const routes = [{
		name: 'index',
		path: '/',
		meta: {
			title: '干货集中营'
		},
		component: Index,
	},
	{
		name: 'detail',
		path: '/detail',
		meta: {
			title: '详情页'
		},
		component: Detail,
	},
]

//配置路由
const router = new Router({
	// mode: 'history',
	// base: __dirname,
	routes // （缩写）相当于 routes: routes
})

//设置路由跳转之前的动作 检测用户是否登录
router.beforeEach((to, from, next) => {
	window.scrollTo(0, 0);
	next();
});

new Vue({
	el: 'app',
	router,
	render: h => h(App)
})