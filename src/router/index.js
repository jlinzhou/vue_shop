import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
Vue.use(Router)


export const constantRoutes = [
    {
        path: '/login',
        component: Login,
        hidden: true
    },
    { path: '/', redirect: '/login' },
    {
        path: '/home',
        component: Home
        // redirect: '/welcome'
    },
    // { path: '/welcome', component: Welcome }
]


const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
