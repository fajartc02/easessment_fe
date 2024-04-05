import ApiService from "@/store/api.service";
export const GET_SYSTEMS = "getSystems";

// mutation types
export const SET_SYSTEM = "setSystem";

const state = {
    systems: null
};

const getters = {
    getSystems(state) {
        return state.systems
    }, 
};

const actions = {
    [GET_SYSTEMS]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("master/systems/get", query)
                .then((result) => {
                    const data = result.data
                    if (data) {
                        commit(SET_SYSTEM, data.data)
                        resolve(data.data)
                    } 
                }).catch((err) => {
                    reject(err)
                });

        });
    },
};

const mutations = {
    [SET_SYSTEM](state, systems) {
        state.systems = systems;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};