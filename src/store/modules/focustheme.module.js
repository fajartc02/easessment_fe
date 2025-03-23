import ApiService from "@/store/api.service";
export const GET_FOCUSTHEME = "getFocusTheme";
export const POST_FOCUSTHEME = "postFocusTheme";

// mutation types
export const SET_FOCUSTHEME = "setFocusTheme";

const state = {
  focusThemes: null
};

const getters = {
  getFocusTheme(state) {
    return state.focusThemes
  },
};

const actions = {
  [GET_FOCUSTHEME]({ commit }, query) {

    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.query('operational/focus-thema/get', query)
        .then((result) => {
          const res = result.data
          if (res) {
            commit(SET_FOCUSTHEME, res.data)
            resolve(res.data)
          }
        }).catch((err) => {
          reject(err)
        });

    });
  },

  async [POST_FOCUSTHEME]({ commit }, data = null) {
    ApiService.setHeader()
    return await ApiService.post('operational/focus-thema/add', data)
      .then((result) => {
        const linesData = result.data
        console.log(commit)
        return linesData
      }).catch((err) => {
        return err
      });
  },

};

const mutations = {
  [SET_FOCUSTHEME](state, focusThemes) {
    state.focusThemes = focusThemes;
  },
};

export default {
  state,
  actions,
  mutations,
  getters
};
