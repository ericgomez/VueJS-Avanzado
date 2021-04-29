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
  },
  actions: {
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value });
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
