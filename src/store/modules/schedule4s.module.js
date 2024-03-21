import ApiService from "@/store/api.service";
export const GET_SCHEDULES = "getSchedules";
export const GET_SUB_SCHEDULES = "getSubSchedules";
export const POST_LINE = "postLines";
export const PUT_LINE = "putLines";
export const DELETE_LINE = "deleteLines";

// mutation types
export const SET_SCHEDULES = "setSchedules";
export const SET_SUB_SCHEDULES = "setSubSchedules";

const state = {
    schedules: null,
    subSchedules: null,
};

const getters = {
    getSchedules(state) {
        return state.schedules
    },  
    getSubSchedules(state) {
        return state.subSchedules
    },  
};

const actions = {
    [GET_SCHEDULES]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("operational/4s/main-schedule", query)
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
    [GET_SUB_SCHEDULES]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("operational/4s/sub-schedule", query)
                .then((result) => {
                    const data = result.data
                    if (data) {
                        commit(SET_SUB_SCHEDULES, data.data)
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
    [SET_SUB_SCHEDULES](state, subSchedules) {
        state.subSchedules = subSchedules;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};