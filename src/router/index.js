import { createRouter, createWebHistory } from 'vue-router'
import { useLoadingStore } from '../store/loading'

const routes = [
  {
    path: '/blog/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/blog/articles',
    name: 'Articles',
    component: () => import('../views/Articles.vue')
  },
  {
    path: '/blog/article/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetail.vue')
  },
  {
    path: '/blog/categories',
    name: 'Categories',
    component: () => import('../views/Categories.vue')
  },
  {
    path: '/blog/category/:name',
    name: 'CategoryArticles',
    component: () => import('../views/CategoryArticles.vue')
  },
  {
    path: '/blog/tags',
    name: 'Tags',
    component: () => import('../views/Tags.vue')
  },
  {
    path: '/blog/tag/:name',
    name: 'TagArticles',
    component: () => import('../views/TagArticles.vue')
  },
  {
    path: '/blog/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/blog/links',
    name: 'Links',
    component: () => import('../views/Links.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const loading = useLoadingStore()
  loading.start('正在加载页面...')
  next()
})

router.afterEach(() => {
  const loading = useLoadingStore()
  loading.finish()
})

router.onError(() => {
  const loading = useLoadingStore()
  loading.fail('加载页面失败...')
})

export default router