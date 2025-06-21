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
    // console.log(state?.graphs4s);
    if (!state?.graphs4s) return null
    const resData = state?.graphs4s?.map((item) => {
      // console.log(item.chartData[0]?.data);
      return {
        ...item,
        chartData: [
          {
            name: 'Problem',
            data: [item.chartData[0]?.data[0], 0, 0],
          },
          {
            name: 'Closed',
            data: [0, item.chartData[0]?.data[1], 0],
          },
          {
            name: 'Remain',
            data: [0, 0, item.chartData[0]?.data[2]],
          },
        ]
      }
    })

    return resData
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
          if (res) {
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
