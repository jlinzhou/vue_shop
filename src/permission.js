import router from './router'
import store from './store'
import { Message } from 'element-ui'

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {

  const tokenStr = window.sessionStorage.getItem('token')

  if (tokenStr) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      try {
        const { menus } = await store.dispatch('user/getInfo')
        const accessRoutes = await store.dispatch('permission/generateRoutes', menus)
        router.addRoutes(accessRoutes)

        next({ ...to, replace: true })
      } catch (error) {

        await store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
      }
    }
  } else {

    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
