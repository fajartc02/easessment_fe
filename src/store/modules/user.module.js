import ApiService from "@/store/api.service";
export const GET_USERS = "getUsers";

// mutation types
export const SET_USERS = "setUsers";

const state = {
    users: null
};

const getters = {
    getUsers(state) {
        return state.users
    },
    getUsersOpts(state) {
        if (state.users) {
            const mapUsers = state.users.map(user => {
                return {
                    id: user.id,
                    text: `${user.noreg}-${user.text}`
                }
            })
            mapUsers.push({
                id: "-1",
                text: 'All'
            })
            return mapUsers
        }
    },
    getUsersOptsWithoutAll(state) {
        if (state.users) {
            const mapUsers = state.users.map(user => {
                return {
                    id: user.id,
                    name: user.text,
                    text: `${user.noreg}-${user.text}`
                }
            })
            return mapUsers
        }
    },
    getUsersTreeselect(state) {
        if (state.users) {
            const mapUsers = state.users.map(user => {
                return {
                    id: user.text,
                    name: user.text,
                    label: `${user.noreg}-${user.text}`
                }
            })
            return mapUsers
        }
    }
};

const actions = {
    [GET_USERS]({ commit }, query) {
        ApiService.setHeader()
        return new Promise((resolve, reject) => {
            ApiService.query("master/users/opts", query)
                .then((result) => {
                    const users = result.data
                    if (users) {
                        commit(SET_USERS, users.data)
                        resolve(users.data)
                    }
                    // throw result;
                }).catch((err) => {
                    reject(err)
                });

        });
    },
};

const mutations = {
    [SET_USERS](state, users) {
        state.users = users;
    },
};

export default {
    state,
    actions,
    mutations,
    getters
};