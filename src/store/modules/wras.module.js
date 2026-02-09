import ApiService from "@/store/api.service";

// action types
export const GET_WRAS = "getWras";
export const POST_WRAS = "postWras";
export const PUT_WRAS = "putWras";
export const DELETE_WRAS = "deleteWras";

// mutation types
export const SET_WRAS = "setWras";

const state = {
  wras: null
};

const actions = {
  // GET
  async [GET_WRAS]({ commit }) {
    ApiService.setHeader();
    return new Promise((resolve, reject) => {
      ApiService.query("master/wras")
        .then((result) => {
          commit(SET_WRAS, result.data?.data || []);
          resolve(result.data?.data || []);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // POST
  async [POST_WRAS]({ commit }, payload = null) {
    ApiService.setHeader(); 
    return new Promise((resolve, reject) => {
      ApiService.post("master/wras", payload)
        .then((result) => {
          resolve(result.data?.data);
          console.log(commit); 
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  // PUT (Update WRAS)
 async [PUT_WRAS](_, { id, data }) {
  ApiService.setHeader();
  return new Promise((resolve, reject) => {
    ApiService.put(`master/wras/${id}`, data)
      .then((result) => resolve(result.data?.data))
      .catch((err) => reject(err));
  });
},


  // DELETE
  async [DELETE_WRAS]({ commit }, id) {
    ApiService.setHeader();
    return new Promise((resolve, reject) => {
      ApiService.delete(`master/wras/${id}`)
        .then((result) => {
          resolve(result.data?.data);
          console.log(commit); // biar ga unused
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

const mutations = {
  [SET_WRAS](state, wras) {
    state.wras = wras;
  }
};

const getters = {
  wras: (state) => state.wras
};

export default {
  state,
  actions,
  mutations,
  getters
};
