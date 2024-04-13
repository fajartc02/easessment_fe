import ApiService from "@/store/api.service";
export const GET_SCHEDULES = "getOmSchedules";
export const GET_SUB_SCHEDULES = "getOmSubSchedules";
export const GET_SCHEDULES_CHECK = "getOmSubSchedulesCheck"; 

// mutation types
export const SET_SCHEDULES = "setSchedules";
export const SET_SUB_SCHEDULES = "setSubSchedules";
export const SET_SCHEDULES_CHECK = "setSchedulesCheck";

const state = {
    omSchedules: null,
    omSubSchedules: null,
    omSchedulesCheck: null
};

const getters = {
    getOmSchedules(state) {
        return state.omSchedules
    },  
    getOmSubSchedules(state) {
        return state.omSubSchedules
    },  
    getOmSubSchedulesCheck(state) {
        return state.omSchedulesCheck
    }
};

const actions = {
    [GET_SCHEDULES]({ commit }, query) {
        console.log('called')
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("operational/om/main-schedule", query)
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
            ApiService.query("operational/om/sub-schedule", query)
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
    [GET_SCHEDULES_CHECK]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query(`operational/om/sub-schedule/${query.sub_schedule_id}`)
                .then((result) => {
                    const data = result.data
                    if (data) {
                        commit(SET_SCHEDULES_CHECK, data.data)
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
        state.omSchedules = schedules;
    },
    [SET_SUB_SCHEDULES](state, subSchedules) {
        state.omSubSchedules = subSchedules;
    },
    [SET_SCHEDULES_CHECK](state, schedulesCheck) {
        state.omSchedulesCheck = schedulesCheck;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};