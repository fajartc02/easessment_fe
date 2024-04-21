import ApiService from "@/store/api.service";

export const GET_OM_FINDINGS = "getOmFindings";
export const GET_OM_FINDINGS_FILTER = "getOmFindingsFilter";
export const GET_OM_FINDING_DETAIL = "getOmFindingDetail";

// mutation types
export const SET_OM_FINDINGS = "setOmFindings";
export const SET_OM_FINDINGS_FILTER = "setOmFindingsFilter";
export const SET_OM_FINDING_DETAIL = "setOmFindingDetail";
export const SET_OM_IS_LOADING_FINDING_LIST = "setOmIsLoadingFindingList";

// pagination.modules.js
export const SET_LIMIT = "setLimit"
export const SET_CURRENT_PAGE = "setPage"
export const SET_TOTAL_DATA = "setTotalData"

const state = {
  omFindings: null,
  omFindingFilter: null,
  omFindingDetail: null,
  isLoadingFindingList: false,
  limit: 10,
  total_data: 0,
  current_page: 1
};

const getters = {
  getOmFindings(state) {
    return state.omFindings
  },
  getOmFindingFilter(state) {
    return state.omFindingFilter
  },
  getOmFindingDetail(state) {
    return state.omFindingDetail
  },
  getOmIsLoadingFindingList(state) {
    return state.isLoadingFindingList
  }
};

const actions = {
  [GET_OM_FINDINGS]({ commit }, query) {
    commit(SET_OM_IS_LOADING_FINDING_LIST, true)
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      //console.log('params fetch GET_OM_FINDINGS', query);
      ApiService.query("operational/om/finding/get", query)
        .then((result) => {
          const response = result.data
          if (response)
          {
            commit(SET_OM_FINDINGS, response.data.list)

            if (response.data.limit) commit(SET_LIMIT, response.data.limit)
            if (response.data.current_page) commit(SET_CURRENT_PAGE, response.data.current_page)
            if (response.data.total_data) commit(SET_TOTAL_DATA, response.data.total_data)

            resolve(response.data)
          }
        })
        .catch((err) => {
          reject(err)
        })
        .finally(() => {
          commit(SET_OM_IS_LOADING_FINDING_LIST, false)
        });

    });
  },
  [GET_OM_FINDINGS_FILTER]({ dispatch, commit }, findingFilter) {
    commit(SET_OM_FINDINGS_FILTER, findingFilter)
    dispatch(GET_OM_FINDINGS, findingFilter)
  },
  [GET_OM_FINDING_DETAIL]({ commit }, findingDetail) {
    commit(SET_OM_FINDING_DETAIL, findingDetail)
  },
};

const mutations = {
  [SET_OM_FINDINGS](state, omFindings) {
    state.omFindings = omFindings;
  },
  [SET_OM_FINDINGS_FILTER](state, omFindingFilter) {
    state.omFindingFilter = omFindingFilter;
  },
  [SET_OM_FINDING_DETAIL](state, omFindingDetail) {
    state.omFindingDetail = omFindingDetail;
  },
  [SET_OM_IS_LOADING_FINDING_LIST](state, isLoading) {
    state.isLoadingFindingList = isLoading;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
