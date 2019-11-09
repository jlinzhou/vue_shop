<!--  -->
<template>
	<div>
		<el-button type="info" @click="logout">退出</el-button>
	</div>
</template>

<script>
export default {
	components: {},
	methods: {
		logout() {
			window.sessionStorage.clear()
			this.$router.push('/login')
		}
	},
	data() {
		return {}
	}
}
</script>
 
<style scoped lang = "less">
</style>