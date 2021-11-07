import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Layout from "@/layout/Layout";
import Show from "@/views/Show";
import Device from "@/views/Device";
import Person from "@/views/Person";
import Temp from "@/views/Temp";
import Ups from "@/views/Ups";
import Mois from "@/views/Mois";
import Video from "@/views/Video";
import AddWarning from "@/views/AddWarning";
import Warning from "@/views/Warning";
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import * as path from "path";

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect:"/show", //路由重定向到show页面
    children:[{
      path: '/manager',
      name: 'Home',
      component: Home,
    },
      {
        path: '/device',
        name: 'Device',
        component: Device
      },
      {
        path: '/show',
        name: 'Show',
        component: Show
      },
      {
        path: '/person',
        name: 'Person',
        component: Person
      },
      {
        path: '/temp',
        name: 'Temp',
        component: Temp
      },
      {
        path: '/ups',
        name: 'Ups',
        component: Ups
      },
      {
        path: '/mois',
        name: 'Mois',
        component: Mois
      },
      {
        path: '/video',
        name: 'Video',
        component: Video
      },
      {
        path: '/addWarning',
        name: 'AddWarning',
        component: AddWarning
      },
      {
        path: '/warning',
        name: 'Warning',
        component: Warning
      },
    ]
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/Login")
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import("@/views/Register")
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

let limitPagePath = ['/show','/','/manager','/device','/person','/temp','/ups','/mois','/warning','/addWarning','/video']

router.beforeEach((to, from, next) => {
  if (limitPagePath.includes(to.path)) {
    // 判断sessionStorage是否保存了用户信息
    let userStr = sessionStorage.getItem("user") || "{}"
    let user = JSON.parse(userStr)
    if (!user.id) {
      // 跳转到登录页面
      next({path: "/login"})
    } else {
      request.post("/user/checkToken",user).then(res =>{
        console.log(res)
        if (!res){
          ElMessage.error('登陆过期')
          sessionStorage.removeItem("user")
          next({path: "/login"})
        }
      })
      next()
    }
  } else {
    next()
  }
})

export default router
