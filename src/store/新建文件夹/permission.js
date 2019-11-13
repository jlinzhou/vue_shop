import { asyncRouterMap, constantRouterMap } from '@/router'
import { getModule, setModule } from '@/utils/auth'
import req from '@/utils/req'

// import moudle from '@/views/system/moudle'
import router from '@/router'
function generaMenu(routers, data) {
    data.forEach((item) => {
        var component
        if (item.children) {
            component = componentsMap["Welcome"]
        } else {
            component = componentsMap[item.component]
        }
        let menu = {
            path: item.MUrl,
            component: component,
            hidden: true,
            children: [],
            name: item.MUrl,
            meta: { title: item.MName, icon: item.MIcon, id: item.ID }
        }
        if (item.Childrens) {
            generaMenu(menu.children, item.Childrens)
        }
        routers.push(menu)
    })
}
const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
            //这里将动态组装的路由添加到路由里面
            router.addRoutes(state.routers)
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                // 获取缓存中的菜单信息
                if (getModule()) {
                    let menu = JSON.parse(getModule())
                    let routers = []
                    generaMenu(routers, menu)
                    commit('SET_ROUTERS', routers)
                    resolve()
                } else {
                    // 没有就请求接口 获取菜单接口
                    req.get('System/GetSysModule', {}).then(res => {
                        if (res.StatusCode === 200) {
                            // 设置缓存
                            setModule(JSON.stringify(res.Data))
                            let routers = []
                            generaMenu(routers, res.Data)
                            commit('SET_ROUTERS', routers)
                            resolve()
                        } else {
                            resolve()
                        }
                    })
                }
            })
        }
    }
}
export const componentsMap = {
    Welcome: () => import('@/views/Welcome'), //
    User: () => import('@/views/user'), //
}

export default permission