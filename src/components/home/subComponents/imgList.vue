<script>
	export default{
		props:{
			contentlist:{
				type:Array
			}
		},
	}
</script>

<template>
	<div class="block">
		<li class="list_item" v-for="list in contentlist">
			<img class="img_fl" :src="list.url">
		</li>
	</div>
</template>