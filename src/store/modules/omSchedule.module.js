/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import ApiService from "@/store/api.service";

export const GET_OM_MAIN_SCHEDULES = "getOmMainSchedules";
export const GET_OM_SUB_SCHEDULES = "getOmSubSchedules";
export const GET_OM_SUB_SCHEDULES_FILTER = "getOmSubSchedulesChildrenFilter";
export const GET_OM_SUB_SCHEDULES_DETAIL = "getOmSubSchedulesDetail";
export const GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED = "getOmSubSchedulesChildrenSelected";

// mutation types
export const SET_OM_MAIN_SCHEDULES = "setOmMainSchedules";
export const SET_OM_SUB_SCHEDULES = "setOmSubSchedules";
export const SET_OM_SUB_SCHEDULES_DETAIL = "setOmSubSchedulesDetail";
export const SET_OM_SUB_SCHEDULES_CHILDREN_SELECTED = "setOmSubSchedulesChildrenSelected";

const SET_IS_LOADING_MAIN_SCHEDULE = "setIsLoadingMainSchedule";
const SET_IS_LOADING_SUB_SCHEDULE = "setIsLoadingSubSchedule";

// pagination.modules.js
export const SET_LIMIT = "setLimit"
export const SET_CURRENT_PAGE = "setPage"
export const SET_TOTAL_DATA = "setTotalData"

const SET_LIMIT_SUB_SCHEDULE = "setLimitSubSchedule"
const SET_CURRENT_PAGE_SUB_SCHEDULE = "setPageSubSchedule"
const SET_TOTAL_DATA_SUB_SCHEDULE = "setTotalDataSubSchedule"

const filterSubSchedules = (
  childSubSchedules,
  machine_id,
  machine_nm,
  freq_id
) => {
  let res = childSubSchedules
  if (machine_id != null && machine_id != '-1' && freq_id != null && freq_id != '-1')
  {
    res = childSubSchedules.filter((subSchedule) => (subSchedule.machine_id == machine_id || subSchedule.machine_nm == machine_nm) && subSchedule.freq_id == freq_id)
  }
  else if (machine_id != null && machine_id != '-1')
  {
    res = childSubSchedules.filter((subSchedule) => subSchedule.machine_id == machine_id || subSchedule.machine_nm == machine_nm)
  }
  else if (freq_id != null && freq_id != '-1')
  {
    res = childSubSchedules.filter((subSchedule) => subSchedule.freq_id == freq_id)
  }


  return res
}

const state = {
  omMainSchedules: null,
  omSubSchedules: null,
  omSubSchedulesFiltered: null,
  omSubScheduleDetail: null,
  omSelectedChildren: null,
  isLoadingMainSchedule: null,
  isLoadingSubSchedule: null,

  limit: 10,
  total_data: 0,
  current_page: 1,

  limitSubSchedule: 10,
  totalDataSubSchedule: 0,
  currentPageSubSchedule: 1,
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
  },
  getIsLoadingMainSchedule(state) {
    return state.isLoadingMainSchedule
  },
  getIsLoadingSubSchedule(state) {
    return state.isLoadingSubSchedule
  },
  getLimitSubSchedule(state) {
    return state.limitSubSchedule
  },
  getTotalDataSubSchedule(state) {
    return state.totalDataSubSchedule
  },
  getCurrentPageSubSchedule(state) {
    return state.currentPageSubSchedule
  }
};

const actions = {
  async [GET_OM_MAIN_SCHEDULES]({ commit }, query) {
    //console.log('filter GET_OM_MAIN_SCHEDULES', query);
    commit(SET_IS_LOADING_MAIN_SCHEDULE, true)
    ApiService.setHeader()
    const mainScheduleRequest = await ApiService.query("operational/om/main-schedule", query)
    commit(SET_IS_LOADING_MAIN_SCHEDULE, false)

    const mainScheduleResponse = mainScheduleRequest.data
    if (mainScheduleResponse && mainScheduleResponse.data.list)
    {
      const list = mainScheduleResponse.data.list.map((item) => {
        item.sub_schedules = []
        item.glSigns = []
        item.limit = 10
        item.current_page = 1
        item.total_data = 0
        return item
      })

      commit(SET_OM_MAIN_SCHEDULES, list)

      // THIS COMMIT FROM pagination.module.js
      if (mainScheduleResponse.data.limit) commit(SET_LIMIT, mainScheduleResponse.data.limit)
      if (mainScheduleResponse.data.current_page) commit(SET_CURRENT_PAGE, mainScheduleResponse.data.current_page)
      if (mainScheduleResponse.data.total_data) commit(SET_TOTAL_DATA, mainScheduleResponse.data.total_data)
    }
    else
    {
      commit(SET_OM_MAIN_SCHEDULES, [])
    }
  },
  async [GET_OM_SUB_SCHEDULES]({ commit, state }, query) {
    ApiService.setHeader()

    const cloneMainSchedule = [...state.omMainSchedules]

    const promises = cloneMainSchedule.map(async (mainSchedule, i) => {
      commit(SET_IS_LOADING_SUB_SCHEDULE, {
        om_main_schedule_id: mainSchedule.om_main_schedule_id,
        loading: true,
      })

      let limitSubSchedule = 10
      let currentPageSubSchedule = 1

      // Clone filter query to prevent concurrent modification of the same query object
      const localQuery = { ...query }

      if (typeof localQuery.limit === 'object' && localQuery.limit.om_main_schedule_id == mainSchedule.om_main_schedule_id)
      {
        limitSubSchedule = localQuery.limit.limit
        delete localQuery.limit
      }
      if (typeof localQuery.current_page === 'object' && localQuery.current_page.om_main_schedule_id == mainSchedule.om_main_schedule_id)
      {
        currentPageSubSchedule = localQuery.current_page.page
        delete localQuery.current_page
      }

      let params = {
        om_main_schedule_id: mainSchedule.om_main_schedule_id,
        limit: limitSubSchedule,
        current_page: currentPageSubSchedule,
        ...localQuery
      }

      try {
        const subScheduleRequest = await ApiService.query("operational/om/sub-schedule", params)
        const subScheduleResponse = subScheduleRequest.data
        if (subScheduleResponse)
        {
          mainSchedule.sub_schedules = subScheduleResponse.data.schedule.list
          mainSchedule.limit = subScheduleResponse.data.schedule.limit
          mainSchedule.current_page = subScheduleResponse.data.schedule.current_page
          mainSchedule.total_data = subScheduleResponse.data.schedule.total_data
          mainSchedule.glSigns = subScheduleResponse.data.sign_checker_gl

          if (subScheduleResponse.data.limit) commit(SET_LIMIT_SUB_SCHEDULE, subScheduleResponse.data.schedule.limit)
          if (subScheduleResponse.data.current_page) commit(SET_CURRENT_PAGE_SUB_SCHEDULE, subScheduleResponse.data.schedule.current_page)
          if (subScheduleResponse.data.total_data) commit(SET_TOTAL_DATA_SUB_SCHEDULE, subScheduleResponse.data.schedule.total_data)
        }
      } catch (err) {
        console.error("Error fetching OM sub-schedule:", err)
      } finally {
        commit(SET_IS_LOADING_SUB_SCHEDULE, {
          om_main_schedule_id: mainSchedule.om_main_schedule_id,
          loading: false,
        })
      }
    })

    await Promise.all(promises)
    commit(SET_OM_MAIN_SCHEDULES, cloneMainSchedule)
  },
  [GET_OM_SUB_SCHEDULES_DETAIL]({ commit }, sub_schedule_id) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.query(`operational/om/sub-schedule/${sub_schedule_id}`)
        .then(async (result) => {
          const response = result.data
          if (response)
          {
            commit(SET_OM_SUB_SCHEDULES_DETAIL, response.data)
            resolve(response.data)
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
  [GET_OM_SUB_SCHEDULES_FILTER]({ commit, state }, filter) {
    commit(SET_IS_LOADING_SUB_SCHEDULE, true)

    const cloneMain = [...state.omMainSchedules]
    cloneMain.forEach(main => {
      if (!filter)
      {
        main.sub_schedules = main.clearSubSchedules
      }
      else
      {
        main.sub_schedules = filterSubSchedules(
          main.clearSubSchedules,
          filter.machine.id,
          filter.machine.text,
          filter.freq_id
        )
      }
    });

    commit(SET_IS_LOADING_SUB_SCHEDULE, false)
    commit(SET_OM_MAIN_SCHEDULES, cloneMain)
  }
};

const mutations = {
  [SET_OM_MAIN_SCHEDULES](state, omMainSchedules) {
    state.omMainSchedules = omMainSchedules
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
  [SET_IS_LOADING_MAIN_SCHEDULE](state, isLoading) {
    state.isLoadingMainSchedule = isLoading;
  },
  [SET_IS_LOADING_SUB_SCHEDULE](state, isLoading) {
    state.isLoadingSubSchedule = isLoading;
  },
  [SET_LIMIT_SUB_SCHEDULE](state, limitSubSchedule) {
    state.limitSubSchedule = limitSubSchedule;
  },
  [SET_CURRENT_PAGE_SUB_SCHEDULE](statee, currentPageSubSchedule) {
    state.currentPageSubSchedule = currentPageSubSchedule;
  },
  [SET_TOTAL_DATA_SUB_SCHEDULE](state, totalDataSubSchedule) {
    state.totalDataSubSchedule = totalDataSubSchedule;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
