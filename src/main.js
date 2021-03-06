import Vue from 'vue';
import firebase from 'firebase'; // Agregar firebase antes de App.vue
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBgJhhxlz1S81lmMYoew_rT8CXe-Jftpsg',
  authDomain: 'platzi-room-9158a.firebaseapp.com',
  databaseURL: 'https://platzi-room-9158a-default-rtdb.firebaseio.com',
  projectId: 'platzi-room-9158a',
  storageBucket: 'platzi-room-9158a.appspot.com',
  messagingSenderId: '770101165592',
  appId: '1:770101165592:web:c7fff85da3d50098a48d6d',
  measurementId: 'G-8ELRFF2WFH',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// Con ayuda de Firebase escuchamos el cambio de la autenticacion cuando el estado cambie
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Obtenemos el usuario en caso de que ya este autenticado loggeado
    store.dispatch('FETCH_AUTH_USER');
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
  beforeCreate() {
    // Validamos si hay un usuario autenticado
    if (store.state.authId) {
      this.$store.dispatch('FETCH_USER', { id: store.state.authId });
    }
  },
}).$mount('#app');
