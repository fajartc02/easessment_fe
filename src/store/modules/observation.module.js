// action
export const GET_OBSERVATION = "getObservation";

// mutation types
export const SET_OBSERVATION = "setObservation";

const state = {
    observation: {},
};

const getters = {
    currentUser(state) {
        return state.user;
    },
};

const actions = {
    [GET_OBSERVATION](context) {
        context.commit(PURGE_AUTH);
    },
};

const mutations = {
    [SET_OBSERVATION](state) {
        state.isAuthenticated = false;
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};