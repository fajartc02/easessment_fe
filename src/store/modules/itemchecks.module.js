import ApiService from "@/store/api.service";
export const GET_ITEMCHECKS = "getItemchecks";
export const POST_ITEMCHECK = "postItemchecks";
export const PUT_ITEMCHECK = "putItemchecks";
export const DELETE_ITEMCHECK = "deleteItemchecks";

// mutation types
export const SET_ITEMCHECKS = "setItemchecks";

const state = {
    itemcheck: null
};

const getters = {
    getItemchecks(state) {
        return state.itemcheck
    },
    getItemchecksWithEditableStatus(state) {
        if (state.itemcheck) {
            let mapItemcheck = state.itemcheck.map(kanban => {
                kanban.is_edit = false
                return kanban
            })
            return mapItemcheck
        }
    },
    getItemchecksOpts(state) {
        if (state.itemcheck) {
            let mapItemchecks = []
            if (state.itemcheck.list) {
                mapItemchecks = state.itemcheck.list.map(itemcheck => {
                    return {
                        id: itemcheck.item_check_kanban_id,
                        text: `${itemcheck.kanban_no}-${itemcheck.item_check_nm}`
                    }
                })
            }
            mapItemchecks.push({
                id: "-1",
                text: 'All'
            })
            return mapItemchecks
        }
    },
    getItemchecksOptsWithoutAll(state) {
        if (state.itemcheck) {
            const mapItemchecks = state.itemcheck.map(itemcheck => {
                return {
                    id: itemcheck.item_check_kanban_id,
                    text: `${itemcheck.kanban_no}-${itemcheck.item_check_nm}`
                }
            })
            return mapItemchecks
        }
    }
};

const actions = {
    [GET_ITEMCHECKS]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("master/item-check-kanbans/get", query)
                .then((result) => {
                    const data = result.data
                    if (data) {
                        commit(SET_ITEMCHECKS, data.data.list)
                        resolve(data.data.list)
                    }
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [POST_ITEMCHECK]({ commit }, data = null) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.post('master/item-check-kanbans/add', data)
                .then((result) => {
                    const itemCheck = result.data
                    resolve(itemCheck.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [PUT_ITEMCHECK]({ commit }, data = null) {
        ApiService.setHeader()
        let ID = data.id
        delete data.id
        return new Promise((resolve, reject) => {
            console.log(data);
            ApiService.put(`master/item-check-kanbans/edit/${ID}`, data)
                .then((result) => {
                    const itemcheck = result.data
                    resolve(itemcheck.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    },
    [DELETE_ITEMCHECK]({ commit }, id) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.delete(`master/item-check-kanbans/delete/${id}`)
                .then((result) => {
                    const itemcheck = result.data
                    resolve(itemcheck.data)
                    console.log(commit);
                }).catch((err) => {
                    reject(err)
                });

        });
    }
};

const mutations = {
    [SET_ITEMCHECKS](state, itemcheck) {
        state.itemcheck = itemcheck;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};
