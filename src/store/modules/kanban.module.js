import ApiService from "@/store/api.service";
export const GET_KANBANS = "getKanbans";
export const GET_KANBAN_DETAIL = "getKanbanDetail"
export const POST_KANBAN = "postKanbans";
export const PUT_KANBAN = "putKanbans";
export const DELETE_KANBAN = "deleteKanbans";
export const SET_LIMIT = "setLimit"
export const SET_CURRENT_PAGE = "setPage"
export const SET_TOTAL_DATA = "setTotalData"

// mutation types
export const SET_KANBANS = "setKanbans";
export const SET_KANBAN_DETAIL = "setKanbanDetail";

const state = {
    kanbans: null,
    kanbanDetail: null,
    limit: 10,
    total_data: 0,
    current_page: 1
};

const getters = {
    getKanbans(state) {
        return state.kanbans
    },
    getKanbanDetail(state) {
        return state.kanbanDetail
    },
    getKanbansWithStatusModal(state) {
        if (state.kanbans) {
            let mapKanbans = state.kanbans.map(kanban => {
                kanban.status = false
                kanban.statusEdit = false
                return kanban
            })
            return mapKanbans
        }
    },
    getKanbansOpts(state) {
        if (state.kanbans) {
            let mapKanbans = []
            if (state.kanbans) {
                mapKanbans = state.kanbans.list.map(kanban => {
                    return {
                        id: kanban.kanban_id,
                        text: `${kanban.kanban_no}-${kanban.area_nm}`
                    }
                })
            }
            mapKanbans.push({
                id: "-1",
                text: 'All'
            })
            return mapKanbans
        }
    },
    getKanbansOptsWithoutAll(state) {
        if (state.kanbans) {
            const mapKanbans = state.kanbans.map(kanban => {
                return {
                    id: kanban.kanban_id,
                    text: `${kanban.kanban_no}-${kanban.area_nm}`
                }
            })
            return mapKanbans
        }
    }
};

const actions = {
    [GET_KANBANS]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("master/kanbans/get", query)
 
                // .then((result) => {
                //     const data = result.data
                //     if (data) { 
                //         commit(SET_KANBANS, data.data.list) 
                //         resolve(data.data.list)
 
                .then((result) => {
                    const { data } = result.data 
                    if (data) {
                        commit(SET_KANBANS, data.list)

                        // THIS COMMIT FROM pagination.module.js
                        if (data.limit) commit(SET_LIMIT, data.limit)
                        if (data.current_page) commit(SET_CURRENT_PAGE, data.current_page)
                        if (data.total_data) commit(SET_TOTAL_DATA, data.total_data)
                        resolve(data.list)
                    }
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [GET_KANBAN_DETAIL]({ commit }, query) {
        console.log('MASUK KANBAN DETAIL');
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("master/kanbans/get", query)
                .then((result) => {
                    const { data } = result.data
                    console.log(data);
                    if (data) {
                        commit(SET_KANBAN_DETAIL, data)
                        resolve(data)
 
                    }
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [POST_KANBAN]({ commit }, data = null) {
        // for multipart
        ApiService.setHeader()
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return new Promise((resolve, reject) => {
            ApiService.post('master/kanbans/add', data, config)
                .then((result) => {
                    const linesData = result.data
                    resolve(linesData.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [PUT_KANBAN]({ commit }, data = null) {
        ApiService.setHeader()
        let ID = data.id
        delete data.id
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return new Promise((resolve, reject) => {
            console.log(data);
            ApiService.put(`master/kanbans/edit/${ID}`, data, config)
                .then((result) => {
                    const kanban = result.data
                    resolve(kanban.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [DELETE_KANBAN]({ commit }, id) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.delete(`master/kanbans/delete/${id}`)
                .then((result) => {
                    const kanban = result.data
                    resolve(kanban.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    }
};

const mutations = {
    [SET_KANBANS](state, kanbans) {
        state.kanbans = kanbans;
    },
    [SET_KANBAN_DETAIL](state, kanbanDetail) {
        state.kanbanDetail = kanbanDetail;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
