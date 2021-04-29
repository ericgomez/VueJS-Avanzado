import Vue from 'vue';
import Vuex from 'vuex';
import sourceData from '../data.json';
import countObjectProperties from '../utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    ...sourceData,
    user: null,
    // ID del usuario en el archivo JSON
    authId: '38St7Q8Zi2N1SPa5ahzssq9kbyp1',
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
