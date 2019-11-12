import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
Vue.use(Router)

export const constantRouterMap = [
    {
        path: '/login',
        component: Login,
        hidden: true
    }
]
export default new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

export const asyncRouterMap = [

]

// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Login from '@/views/Login.vue'
// import Home from '@/views/Home.vue'
// import Welcome from '@/views/Welcome.vue'
// // import Users from '@/components/user/Users.vue'
// import Users from '@/views/user.vue'
// Vue.use(VueRouter)

// const router = new VueRouter({
//     routes: [
//         { path: '/', redirect: '/login' },
//         { path: '/login', component: Login },
//         {
//             path: '/home',
//             component: Home,
//             redirect: '/welcome',
//             children: [
//                 { path: '/welcome', component: Welcome },
//                 { path: '/users', component: Users }
//             ]
//         }

//     ]
// })
// //挂载路由导航守卫

// router.beforeEach((to, from, next) => {
//     if (to.path === '/login') return next()
//     const tokenStr = window.sessionStorage.getItem('token')
//     if (!tokenStr) return next('/login')
//     next()
// })
// export default router
