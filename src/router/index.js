import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import HomePage from '../views/HomePage.vue';
import SearchPage from '../views/SearchPage.vue';
import NotFoundPage from '../views/NotFoundPage.vue';
import CreateHousePage from '../views/CreateHousePage.vue';

// User Pages
import ProfilePage from '../views/user/ProfilePage.vue';
import HousesPages from '../views/user/HousesPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: SearchPage,
  },
  {
    path: '/user',
    redirect: { name: 'ProfilePage' },
  },
  {
    path: '/user/profile',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/user/houses',
    name: 'HousesPages',
    component: HousesPages,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/house',
    redirect: { name: 'ProfilePage' },
  },
  {
    path: '/house/new',
    name: 'CreateHousePage',
    component: CreateHousePage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '*',
    name: 'NotFoundPage',
    component: NotFoundPage,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

/* Se llama a los guardias globales antes en el orden de creación, siempre que se activa una
navegación. Los guardias se pueden resolver de forma asincrónica y la navegación se considera
pendiente antes de que se hayan resuelto todos los ganchos. */
router.beforeEach((to, from, next) => {
  // Validamos si alguna ruta contiene la propiedad requiresAuth
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    // Validamos si el estado hay un id
    console.log(store.state.authId);
    if (store.state.authId) {
      next();
    } else {
      // si no mandamos al HomePage
      next({ name: 'HomePage' });
    }
  } else {
    next();
  }
});

export default router;
