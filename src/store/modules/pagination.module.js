export const SET_LIMIT = "setLimit"
export const SET_CURRENT_PAGE = "setPage"
export const SET_TOTAL_DATA = "setTotalData"
export const SET_PAGINATION = "setPagination"

const state = {
    limit: 10,
    total_data: 1,
    current_page: 1
};

const getters = {
    getPagination(state) {
        return state
    },
};

const actions = {
    [SET_PAGINATION]({ commit }, filter) {
        if (filter.limit) commit(SET_LIMIT, filter.limit)
        if (filter.current_page) commit(SET_CURRENT_PAGE, filter.current_page)
        if (filter.total_data) commit(SET_TOTAL_DATA, filter.total_data)
    },
};

const mutations = {
    [SET_LIMIT](state, limit) {
        state.limit = limit
    },
    [SET_CURRENT_PAGE](state, current_page) {
        state.current_page = current_page
    },
    [SET_TOTAL_DATA](state, total_data) {
        state.total_data = total_data
    }
};

export default {
    state,
    actions,
    mutations,
    getters
};