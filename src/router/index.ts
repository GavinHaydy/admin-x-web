import { HomeOutlined, NodeIndexOutlined, BugOutlined, UserOutlined } from '@ant-design/icons-vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import { t } from '@/i18n';
import Layout from '@/layout/Layout.vue';
import { useUserStore, useTabsStore } from '@/store';

import { articleList } from './article';
import { monitorList } from './monitor';
import { settingList } from './setting';
import { systemList } from './system';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    meta: { directlyShowChildren: true },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: t('首页'),
          icon: HomeOutlined,
        },
      },
      {
        path: 'readme',
        name: 'Readme',
        component: () => import('@/views/readme/index.vue'),
        meta: {
          icon: NodeIndexOutlined,
          title: t('🪲请阅读我'),
        },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          footer: true,
          title: t('🍉数据看板'),
          icon: BugOutlined,
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          icon: UserOutlined,
          title: t('🌽个人中心'),
        },
      },
    ],
  },
  ...articleList,
  ...systemList,
  ...monitorList,
  ...settingList,
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: t('🍃 登录/注册'),
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.name === 'Login') {
    return next();
  }

  if (!userStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  if (!userStore.user?.userId) {
    userStore.getUserInfo().finally();
  }

  const store = useTabsStore();
  store.addTab(to);
  next();
});

export default router;
