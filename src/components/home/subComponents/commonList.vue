<script>
export default {
  props: {
    contentlist: {
      type: Array
    }
  },
  methods: {
    toDetail(time, title) {
      let t = time.substring(0, time.indexOf("T"));
      let til = title.replace("今日力推：", "");
      this.$router.push({ name: "detail", query: { time: t, title: til } });
    }
  }
};
</script>

<template>
	<div class="block">
		<li class="list_item" v-for="list in contentlist">
			<a class="list_block" @click.prevent="toDetail(list.updated_at,list.title)">
				<p class="title_block">
					[<span class="public_date">{{list.updated_at | timeFilter}}</span>]
					<span class="list_title">{{list.title | titleFilter}}</span>
				</p>
				<img class="list_img" :src="list.img | imgUrl" alt="">
			</a>
		</li>
	</div>
</template>