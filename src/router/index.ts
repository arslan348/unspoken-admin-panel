import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductsView from '../views/ProductsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import AboutView from '../views/AboutView.vue'
import BlogsView from '../views/BlogsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    {
      path: '/',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/products' },
        { path: '/products', component: ProductsView },
        { path: '/categories', component: CategoriesView },
        { path: '/about', component: AboutView },
        { path: '/blogs', component: BlogsView },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }
  if (to.path === '/login' && token) {
    return '/products'
  }
})

export default router
