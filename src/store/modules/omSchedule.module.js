import ApiService from "@/store/api.service";
export const GET_OM_MAIN_SCHEDULES = "getOmMainSchedules";
export const GET_OM_SUB_SCHEDULES = "getOmSubSchedules";
export const GET_OM_SUB_SCHEDULES_DETAIL = "getOmSubSchedulesDetail";
export const GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED = "getOmSubSchedulesChildrenSelected";

// mutation types
export const SET_OM_MAIN_SCHEDULES = "setOmMainSchedules";
export const SET_OM_SUB_SCHEDULES = "setOmSubSchedules";
export const SET_OM_SUB_SCHEDULES_DETAIL = "setOmSubSchedulesDetail";
export const SET_OM_SUB_SCHEDULES_CHILDREN_SELECTED = "setOmSubSchedulesChildrenSelected";

// pagination.modules.js
export const SET_LIMIT = "setLimit"
export const SET_CURRENT_PAGE = "setPage"
export const SET_TOTAL_DATA = "setTotalData"

const state = {
  omMainSchedules: null,
  omSubSchedules: null,
  omSubScheduleDetail: null,
  omSelectedChildren: null,
  limit: 10,
  total_data: 0,
  current_page: 1
};

const getters = {
  getOmMainSchedules(state) {
    return state.omMainSchedules
  },
  getOmSubSchedules(state) {
    return state.omSubSchedules
  },
  getOmSubSchedulesDetail(state) {
    return state.omSubScheduleDetail
  },
  getOmSelectedChildren(state) {
    return state.omSelectedChildren
  }
};

const actions = {
  [GET_OM_MAIN_SCHEDULES]({ commit }, query) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.query("operational/om/main-schedule", query)
        .then((result) => {
          const response = result.data
          if (response)
          {
            commit(SET_OM_MAIN_SCHEDULES, response.data)

            // THIS COMMIT FROM pagination.module.js
            if (response.data.limit) commit(SET_LIMIT, response.data.limit)
            if (response.data.current_page) commit(SET_CURRENT_PAGE, response.data.current_page)
            if (response.data.total_data) commit(SET_TOTAL_DATA, response.data.total_data)

            resolve(response.data)
          }
          // throw result;
        }).catch((err) => {
          reject(err)
        });

    });
  },
  [GET_OM_SUB_SCHEDULES]({ commit }, query) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.query("operational/om/sub-schedule", query)
        .then((result) => {
          const data = result.data
          if (data)
          {
            commit(SET_OM_SUB_SCHEDULES, data.data)
            resolve(data.data)
          }
          // throw result;
        }).catch((err) => {
          reject(err)
        });

    });
  },
  [GET_OM_SUB_SCHEDULES_DETAIL]({ commit }, sub_schedule_id) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.query(`operational/om/sub-schedule/${sub_schedule_id}`)
        .then((result) => {
          const data = result.data
          if (data)
          {
            commit(SET_OM_SUB_SCHEDULES_DETAIL, data.data)
            resolve(data.data)
          }
          // throw result;
        }).catch((err) => {
          reject(err)
        });

    });
  },
  [GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED]({ commit }, selectedChildren) {
    commit(SET_OM_SUB_SCHEDULES_CHILDREN_SELECTED, selectedChildren)
  },
};

const mutations = {
  [SET_OM_MAIN_SCHEDULES](state, omMainSchedules) {
    state.omMainSchedules = omMainSchedules;
  },
  [SET_OM_SUB_SCHEDULES](state, omSubSchedules) {
    state.omSubSchedules = omSubSchedules;
  },
  [SET_OM_SUB_SCHEDULES_DETAIL](state, omSubScheduleDetail) {
    state.omSubScheduleDetail = omSubScheduleDetail;
  },
  [SET_OM_SUB_SCHEDULES_CHILDREN_SELECTED](state, omSelectedChildren) {
    state.omSelectedChildren = omSelectedChildren;
  },
};

export default {
  state,
  actions,
  mutations,
  getters
};
