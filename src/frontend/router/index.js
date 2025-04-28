import { createRouter, createWebHistory } from 'vue-router';

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/display/HomeView.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/admin/AdminDashboard.vue'),
    children: [
      {
        path: 'drinks',
        name: 'AdminDrinks',
        component: () => import('../views/admin/DrinksManagement.vue'),
      },
      {
        path: 'games',
        name: 'AdminGames',
        component: () => import('../views/admin/GamesManagement.vue'),
      },
      {
        path: 'media',
        name: 'AdminMedia',
        component: () => import('../views/admin/MediaManagement.vue'),
      },
      {
        path: 'visitors',
        name: 'AdminVisitors',
        component: () => import('../views/admin/VisitorsManagement.vue'),
      },
      {
        path: 'themes',
        name: 'AdminThemes',
        component: () => import('../views/admin/ThemeManagement.vue'),
      }
    ]
  },
  {
    path: '/display/drinks',
    name: 'DrinkDisplay',
    component: () => import('../views/display/DrinkDisplay.vue'),
  },
  {
    path: '/display/games',
    name: 'GameDisplay',
    component: () => import('../views/display/GameDisplay.vue'),
  },
  {
    path: '/display/visitors',
    name: 'VisitorDisplay',
    component: () => import('../views/display/VisitorDisplay.vue'),
  },
  {
    path: '/display/media',
    name: 'MediaDisplay',
    component: () => import('../views/display/MediaDisplay.vue'),
  },
  {
    path: '/display/events',
    name: 'EventDisplay',
    component: () => import('../views/display/EventDisplay.vue'),
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('../views/auth/LoginView.vue'),
  },
  // Catch-all route for 404s
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for admin routes
router.beforeEach((to, from, next) => {
  // Check if route requires authentication
  if (to.path.startsWith('/admin')) {
    // In a real app, check authentication status from store/API
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }
  }
  next();
});

export default router;