import ApiService from "@/store/api.service";
export const GET_GRAPH = "getGraphs";
export const GET_4S_GRAPH = "get4SGraphs";
export const GET_OM_GRAPH = "getOmGraphs";

// mutation types
export const SET_GRAPH = "setGraph";
export const SET_4S_GRAPH = "set4SGraph";
export const SET_OM_GRAPH = "setOmGraph";

const state = {
    graphs: null,
    graphs4s: null,
    graphsOm: null,
};

const getters = {
    getGraphs(state) {
        return state.graphs
    },
    get4SGraphs(state) {
        return state.graphs4s
    },
    getOmGraphs(state) {
      return state.graphsOm
    },
};

const actions = {
    [GET_GRAPH]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query(`/operational/graph`, query)
                .then((result) => {
                    const res = result.data
                    if (res) {
                        commit(SET_GRAPH, res.data)
                        resolve(res.data)
                    }
                }).catch((err) => {
                    reject(err)
                });
        });
    },
    [GET_4S_GRAPH]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query(`/operational/4s/graph`, query)
                .then((result) => {
                    const res = result.data
                    if (res) {
                        commit(SET_4S_GRAPH, res.data)
                        resolve(res.data)
                    }
                }).catch((err) => {
                    reject(err)
                });
        });
    },
    [GET_OM_GRAPH]({ commit }, query) {
      ApiService.setHeader()
      return new Promise((resolve, reject) => {
        ApiService.query(`/operational/om/graph`, query)
          .then((result) => {
            const res = result.data
            if (res)
            {
              commit(SET_OM_GRAPH, res.data)
              resolve(res.data)
            }
          }).catch((err) => {
            reject(err)
          });
      });
    },
};

const mutations = {
    [SET_GRAPH](state, graphs) {
        state.graphs = graphs;
    },
    [SET_4S_GRAPH](state, graphs) {
        state.graphs4s = graphs;
    },
    [SET_OM_GRAPH](state, graphs) {
      state.graphsOm = graphs;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
