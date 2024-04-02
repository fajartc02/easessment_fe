import ApiService from "@/store/api.service";
export const GET_KANBANS = "getKanbans";

// mutation types
export const SET_KANBANS = "setKanbans";

const state = {
    kanbans: null
};

const getters = {
    getKanbans(state) {
        return state.kanbans
    },  
};

const actions = {
    [GET_KANBANS]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("master/kanbans/get", query)
                .then((result) => {
                    const data = result.data
                    if (data) { 
                        commit(SET_KANBANS, data.data.list)
                        console.log(data)
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
    [SET_KANBANS](state, kanbans) {
        state.kanbans = kanbans;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};