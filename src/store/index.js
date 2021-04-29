import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';
import countObjectProperties from '../utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: {},
    services: {},
    rooms: {},
    // ID del usuario en el archivo JSON
    authId: null,
    modals: {
      login: false,
    },
  },
  mutations: {
    SET_MODAL_STATE: (state, { name, value }) => {
      state.modals[name] = value;
    },
    SET_ROOM(state, { newRoom, roomId }) {
      // Objetos y Arreglos no se actualizan de forma reactiva en Vue por lo tanto para hacer que se
      // actualizen de forma reactiva utilizamos Vue.set para que se haga un push de forma natural
      Vue.set(state.rooms, roomId, newRoom);
    },
    APPEND_ROOM_TO_USER(state, { roomId, userId }) {
      // Ingresamos el parametro a asignar y el a que usuario se va asingar
      Vue.set(state.users[userId].rooms, roomId, roomId);
    },
    SET_ITEM(state, { item, id, resource }) {
      const newItem = item;
      newItem['.key'] = id;
      Vue.set(state[resource], id, newItem);
    },
  },
  actions: {
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value });
    },
    CREATE_ROOM: ({ state, commit }, room) => {
      const newRoom = room;
      // Generamos la llave desde firebase
      const roomId = firebase
        .database()
        .ref('rooms')
        .push().key;
      // Usuario a asignar la abitacion
      newRoom.userId = state.authId;
      // agregamos la fecha de publicacion
      newRoom.publishedAt = Math.floor(Date.now() / 1000);
      newRoom.meta = { likes: 0 };

      const updates = {};
      // Creamos el Query
      updates[`rooms/${roomId}`] = newRoom;
      // Creamos el Query
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId;

      // Le indicamos a firebase que realizaremos una modificacion de tipo actualizacion
      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          // Realizamos la asignacion hacia Vuex
          commit('SET_ROOM', { newRoom, roomId });
          commit('APPEND_ROOM_TO_USER', { roomId, userId: newRoom.userId });
          return Promise.resolve(state.rooms[roomId]);
        });
    },
    FETCH_ROOMS: ({ state, commit }, limit) => new Promise((resolve) => {
      // Creamos la instancia a la base de datos
      let instance = firebase.database().ref('rooms');
      if (limit) {
        // Indicamos que nos muestre los primeros que se encuentren en el limite definido
        instance = instance.limitToFirst(limit);
      }

      // Generamos el Query
      instance.once('value', (snapshot) => {
        // almacenamos los datos desde firebase
        const rooms = snapshot.val();
        // iteramos las llaves
        Object.keys(rooms).forEach((roomId) => {
          // buscamos el arreglo iterado
          const room = rooms[roomId];
          // mandamos llamar nuestro mutador agregando room a Vuex
          commit('SET_ITEM', { resource: 'rooms', id: roomId, item: room });
        });
        // Resolvemos la promesa
        resolve(Object.values(state.rooms));
      });
    }),
    FETCH_USER: ({ state, commit }, { id }) => new Promise((resolve) => {
      firebase
        .database()
        .ref('users')
        .child(id)
        .once('value', (snapshot) => {
          // Seteamos el valor dentro de los recursos
          commit('SET_ITEM', { resource: 'users', id: snapshot.key, item: snapshot.val() });
          // Resolvemos nuestra funcion y buscamos el identificador
          resolve(state.users[id]);
        });
    }),
  },
  getters: {
    modals: (state) => state.modals,
    // Recivimos el estado con el id
    authUser(state) {
      return state.authId ? state.users[state.authId] : null;
    },
    // Obtenemos los datos del state
    rooms: (state) => state.rooms,
    // Este Getter recibe un id y realiza la funcion de contar los objetos
    userRoomsCount: (state) => (id) => countObjectProperties(state.users[id].rooms),
  },
  modules: {},
});
