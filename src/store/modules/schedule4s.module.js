import ApiService from "@/store/api.service";
export const GET_SCHEDULES = "getSchedules";
export const POST_LINE = "postLines";
export const PUT_LINE = "putLines";
export const DELETE_LINE = "deleteLines";

// mutation types
export const SET_SCHEDULES = "setSchedules";

const state = {
    schedules: null
};

const getters = {
    getSchedules(state) {
        return state.schedules
    },  
};

const actions = {
    [GET_SCHEDULES]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("operational/4s/sub-schedule", query)
                .then((result) => {
                    const data = result.data
                    if (data) {
                        commit(SET_SCHEDULES, data.data)
                        resolve(data.data)
                    }
                    // throw result;
                }).catch((err) => {
                    reject(err)
                });

        });
    }, 
};

const mutations = {
    [SET_SCHEDULES](state, schedules) {
        state.schedules = schedules;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};