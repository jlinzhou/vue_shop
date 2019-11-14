<!--  -->
<template>
	<!-- <div> -->

	<el-container class="home-container">
		<el-header>
			<div>
				<img src="@/assets/heima.png" alt="">
				<span>电商后台管理系统</span>
			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>
		<el-container>
			<!-- 第一个路由标题在meta里面 -->
			<!-- 子路由标题在儿子meta下面 -->
			<!-- 第一层判断 -->
			<el-aside :width="isCollapse ? '64px':'200px'">
				<div class="toggle-button" @click="toggleCollapse">|||</div>
				<el-menu background-color="#373d41" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :default-active="activePath" :collapse="isCollapse" :collapse-transition="false" router>
					<el-submenu :index="item.name" v-for="item in menulist" :key="item.name">
						<template slot="title">
							<!-- <i :class="iconsObj[item.id]"></i> -->
							<span>{{item.meta.title}}</span>
						</template>
						<template v-for="subItem in item.children">
							<template v-for="subItemChi in subItem.children">
								<template v-if="!subItemChi.hidden">
									<el-menu-item :index="subItem.path" :key="subItemChi.name" @click="saveNavState('/'+subItem.path)">
										<i class="el-icon-menu"></i>
										<span> {{subItemChi.meta.title}}</span>
									</el-menu-item>
								</template>
							</template>
						</template>
					</el-submenu>

				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
	<!-- </div> -->

</template>

<script>
export default {
	name: 'layout',
	components: {},
	data() {
		return {
			menulist: [],
			iconsObj: {
				'125': 'iconfont icon-user',
				'103': 'iconfont icon-tijikongjian',
				'101': 'iconfont icon-shangpin',
				'102': 'iconfont icon-danju',
				'145': 'iconfont icon-baobiao'
			},
			isCollapse: false,
			activePath: ''
		}
	},
	created() {
		this.getMenuList()
		this.activePath = window.sessionStorage.getItem('activePath')
	},
	methods: {
		logout() {
			window.sessionStorage.clear()
			this.$router.push('/login')
		},
		//this.$store.getters.permission_routes
		getMenuList() {
			//this.menulist = this.$store.getters.permission_routes
			var allRoutes = this.$store.getters.permission_routes
			for (var i = 0; i < allRoutes.length; i++) {
				if (allRoutes[i].children) {
					this.menulist.push(allRoutes[i])
				}
			}
			console.log(this.menulist)
		},
		// async getMenuList() {
		// 	const { data: res } = await this.$http.get('menus')
		// 	if (res.meta.status !== 200) this.$message.error(res.meta.msg)
		// 	this.menulist = res.data
		// 	console.log(res)
		// },
		toggleCollapse() {
			this.isCollapse = !this.isCollapse
		},
		saveNavState(activePath) {
			window.sessionStorage.setItem('activePath', activePath)
			this.activePath = activePath
		}
	}
}
</script>
 
<style scoped lang = "less">
.home-container {
	height: 100%;
}
.el-header {
	background-color: #373d41;
	display: flex;
	justify-content: space-between;
	padding-left: 0px;
	align-items: center;
	color: #fff;
	font-size: 20px;
	> div {
		display: flex;
		align-items: center;
		span {
			margin-left: 15px;
		}
	}
}
.el-aside {
	background-color: #333744;
	.el-menu {
		border-right: none;
	}
}
.el-main {
	background-color: #fcfcfc;
}
.iconfont {
	margin-right: 10px;
}
.toggle-button {
	background-color: #4a5064;
	font-size: 10px;
	line-height: 24px;
	color: #fff;
	text-align: center;
	letter-spacing: 0.2em;
	cursor: pointer;
}
</style>