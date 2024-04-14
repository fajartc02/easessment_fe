import ApiService from "@/store/api.service";
export const GET_OM_ITEM_CHECKS = "getOmItemChecks";
export const GET_OM_GROUP_MACHINES_ITEM_CHECK = "getOmItemChecks";
export const GET_OM_ITEM_CHECK_DETAIL = "getOmItemCheckDetail"
export const POST_OM_ITEM_CHECK = "postOmItemCheck";
export const PUT_OM_ITEM_CHECK = "putOmItemCheck";
export const DELETE_OM_ITEM_CHECK = "deleteOmItemCheck";
export const SET_LIMIT = "setLimit"
export const SET_CURRENT_PAGE = "setPage"
export const SET_TOTAL_DATA = "setTotalData"

// mutation types
export const SET_OM_ITEM_CHECKS = "setOmItemChecks";
export const SET_OM_ITEM_CHECK_DETAIL = "setOmItemCheckDetail";

const state = {
  itemChecks: null,
  omItemCheckDetail: null,
  limit: 10,
  total_data: 0,
  current_page: 1
};

const getters = {
  getItemChecks(state) {
    return state.itemChecks
  },
  getItemCheckDetail(state) {
    return state.omItemCheckDetail
  },
  getItemChecksWithStatusModal(state) {
    if (state.itemChecks)
    {
      let map = state.itemChecks.map(item => {
        item.status = false
        item.statusEdit = false
        return item
      })
      return map
    }
  },
};

const actions = {
  [GET_OM_ITEM_CHECKS]({ commit }, query) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.query("master/om-item-check-kanbans/get", query)
        .then((result) => {
          const { data } = result.data
          if (data)
          {
            commit(SET_OM_ITEM_CHECKS, data.list)

            // THIS COMMIT FROM pagination.module.js
            if (data.limit) commit(SET_LIMIT, data.limit)
            if (data.current_page) commit(SET_CURRENT_PAGE, data.current_page)
            if (data.total_data) commit(SET_TOTAL_DATA, data.total_data)
            resolve(data.list)
          }
        })
        .catch((err) => {
          reject(err)
        });

    });
  },
  [GET_OM_GROUP_MACHINES_ITEM_CHECK]({ commit }, query) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.query("master/om-item-check-kanbans/get/groups", query)
        .then((result) => {
          const { data } = result.data
          if (data)
          {
            commit(SET_OM_ITEM_CHECKS, data.list)

            // THIS COMMIT FROM pagination.module.js
            if (data.limit) commit(SET_LIMIT, data.limit)
            if (data.current_page) commit(SET_CURRENT_PAGE, data.current_page)
            if (data.total_data) commit(SET_TOTAL_DATA, data.total_data)
            resolve(data.list)
          }
        })
        .catch((err) => {
          reject(err)
        });

    });
  },
  [GET_OM_ITEM_CHECK_DETAIL]({ commit }, query) {
    console.log('MASUK KANBAN DETAIL');
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.query("master/om-item-check-kanbans/get", query)
        .then((result) => {
          const { data } = result.data
          console.log(data);
          if (data)
          {
            commit(SET_OM_ITEM_CHECK_DETAIL, data)
            resolve(data)

          }
        })
        .catch((err) => {
          reject(err)
        });

    });
  },
  [POST_OM_ITEM_CHECK]({ commit }, data = null) {
    ApiService.setHeader()

    if (data.line_id)
    {
      delete data.line_id
    }

    return new Promise((resolve, reject) => {
      ApiService.post('master/om-item-check-kanbans/add', data)
        .then((result) => {
          const linesData = result.data
          resolve(linesData.data)
          console.log(commit);
        }).catch((err) => {
          reject(err)
        });

    });
  },
  [PUT_OM_ITEM_CHECK]({ commit }, data = null) {
    ApiService.setHeader()
    let ID = data.id
    delete data.id

    if (data.line_id)
    {
      delete data.line_id
    }

    return new Promise((resolve, reject) => {
      console.log(data);
      ApiService.put(`master/om-item-check-kanbans/edit/${ID}`, data)
        .then((result) => {
          const itemCheck = result.data
          resolve(itemCheck.data)
          console.log(commit);
        }).catch((err) => {
          reject(err)
        });

    });
  },
  [DELETE_OM_ITEM_CHECK]({ commit }, id) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.delete(`master/om-item-check-kanbans/delete/${id}`)
        .then(() => {
          /* const itemCheck = result.data
          resolve(itemCheck.data) */
          console.log(commit);
        }).catch((err) => {
          reject(err)
        });

    });
  }
};

const mutations = {
  [SET_OM_ITEM_CHECKS](state, itemChecks) {
    state.itemChecks = itemChecks;
  },
  [SET_OM_ITEM_CHECK_DETAIL](state, omItemCheckDetail) {
    state.omItemCheckDetail = omItemCheckDetail;
  },
};

export default {
  state,
  actions,
  mutations,
  getters
};
