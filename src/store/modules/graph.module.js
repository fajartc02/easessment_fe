import ApiService from "@/store/api.service";
export const GET_GRAPH = "getGraphs";  

// mutation types
export const SET_GRAPH = "setGraph";

const state = {
    graphs: null
};

const getters = {
    getGraphs(state) {
        return state.graphs
    },  
};

const actions = {
    [GET_GRAPH]({ commit }, query ) {  

        let filterOpt;
        if(query.line_id !== '-1' || query.group_id !== '-1' ){
            filterOpt = `?start_date=${query.start_date}&end_date=${query.end_date}&line_id=${query.line_id}&group_id=${query.group_id}`
        } else { 
            filterOpt = `?start_date=${query.start_date}&end_date=${query.end_date}`
        }

        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.get(`operational/graph${filterOpt}`,)
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
     
};

const mutations = {
    [SET_GRAPH](state, graphs) {
        state.graphs = graphs;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};