<script>
export default {
  props: {
    contentlist: {
      type: Array
    }
  }
};
</script>

<template>
	<div class="block">
		<li class="list_item" v-for="list in contentlist">
			<a class="list_block" :href="list.url">
				<p class="list_title" v-text="list.desc"></p>
				<div class="list_info clearfix">
					<span class="pull-left auther">via{{list.who}}</span>
					<span class="pull-right public_time">{{list.publishedAt | dateFilter}}</span>
				</div>
				<div class="img_box" v-if="list.images" v-for="img in list.images">
					<img class="info_img" :src="img" alt="">
				</div>
			</a>
		</li>
	</div>
</template>