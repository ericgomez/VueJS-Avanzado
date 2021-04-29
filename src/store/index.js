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
      // Creamos id random
      const roomId = `room${Math.random()}`;
      newRoom['.key'] = roomId;
      // Usuario a asignar la abitacion
      newRoom.userId = state.authId;

      // Realizamos la asignacion hacia Vuex
      commit('SET_ROOM', { newRoom, roomId });
      commit('APPEND_ROOM_TO_USER', { roomId, userId: newRoom.userId });
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

          commit('SET_ITEM', { resource: 'rooms', id: roomId, item: room });
        });
        resolve(Object.values(state.rooms));
      });
    }),
  },
  getters: {
    modals: (state) => state.modals,
    // Recivimos el estado con el id
    authUser: (state) => state.users[state.authId],
    // Obtenemos los datos del state
    rooms: (state) => state.rooms,
    // Este Getter recibe un id y realiza la funcion de contar los objetos
    userRoomsCount: (state) => (id) => countObjectProperties(state.users[id].rooms),
  },
  modules: {},
});
