import ApiService from "@/store/api.service";
export const GET_ZONES = "getZones";

// mutation types
export const SET_ZONES = "setZones";

const state = {
    zones: null
};

const getters = {
    getZones(state) {
        return state.zones
    },  
};

const actions = {
    [GET_ZONES]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("master/zones/get", query)
                .then((result) => {
                    const data = result.data
                    if (data) { 
                        commit(SET_ZONES, data.data.list)
                        resolve(data.data.list)
                    }
                    // throw result;
                }).catch((err) => {
                    reject(err)
                });

        });
    },
};

const mutations = {
    [SET_ZONES](state, zones) {
        state.zones = zones;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};