import ApiService from "../api.service";

// action
export const GET_OBSERVATION_SCHEDULE = "getObservationSchedule";
export const GET_OBSERVATION_SUMMARY = "getObservationSummary";
export const GET_OBSERVATION_DETAIL = "getObservationDetail";
export const POST_OBSERVATION_CHECK = "postObservationCheck";

// mutation types
export const SET_OBSERVATION_SCHEDULE = "setObservationSchedule";
export const SET_OBSERVATION_SUMMARY = "setObservationSummary";
export const SET_OBSERVATION_DETAIL = "setObservationDetail";

const state = {
    observationSchedules: [],
    summaryData: null,
    observationData: null
};

const getters = {
    observationSchedule(state) {
        return state.observationSchedules
    },
    observationSummary(state) {
        return state.summaryData
    },
    observationData(state) {
        return state.observationData
    }
};

const actions = {
    [GET_OBSERVATION_SCHEDULE]({commit}, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query('operational/observation/schedule', query)
            .then((result) => {
                const observationsSchedule = result.data
                if(observationsSchedule) {
                    commit(SET_OBSERVATION_SCHEDULE, observationsSchedule.data)
                    resolve(observationsSchedule.data)
                }
            }).catch((err) => {
                reject(err)
            });
            
        });
    },
    [GET_OBSERVATION_SUMMARY]({commit}, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query('operational/observation/summary', query)
            .then((result) => {
                const observationsSummary = result.data
                if(observationsSummary) {
                    commit(SET_OBSERVATION_SUMMARY, observationsSummary.data)
                    resolve(observationsSummary.data)
                }
            }).catch((err) => {
                reject(err)
            });
        })
    },
    [GET_OBSERVATION_DETAIL]({commit}, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.get(`operational/observation/schedule`, query)
            .then((result) => {
                const observationsData = result.data
                if(observationsData) {
                    commit(SET_OBSERVATION_DETAIL, observationsData.data)
                    resolve(observationsData.data)
                }
            }).catch((err) => {
                reject(err)
            });
        })
    },
    [POST_OBSERVATION_CHECK]({commit}, data) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post(`operational/observation/check`, data) 
            .then((result) => {
                const observationsData = result.data
                if(observationsData) {
                    console.log(commit);
                    resolve(observationsData.data)
                }
            }).catch((err) => {
                reject(err)
            });
        })
    }
};

const mutations = {
    [SET_OBSERVATION_SCHEDULE](state, payload) {
        state.observationSchedules = payload;
    },
    [SET_OBSERVATION_SUMMARY](state, payload) {
        state.summaryData = payload;
    },
    [SET_OBSERVATION_DETAIL](state, payload) {
        state.observationData = payload;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};