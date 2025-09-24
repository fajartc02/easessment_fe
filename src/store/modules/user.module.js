import ApiService from "@/store/api.service";
export const GET_USERS = "getUsers";
export const POST_USER = "postUser";
export const PUT_USER = "putUser";
export const DELETE_USER = "deleteUser";
export const PUT_USER_ROLE = "putUserRole";
export const PUT_USER_PASS = "PUT_USER_PASS";
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
    // console.log(state);
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
          text: `${user.text}`
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
          label: `${user.noreg}-${user.text}`,
          real_id: user?.id
        }
      })
      return mapUsers
    }
  },
  getUsersTreeselect2(state) {
    if (state.users) {
      const mapUsers = state.users.map(user => {
        return {
          id: user.id,
          name: user.text,
          label: `${user.noreg}-${user.text}`,
        }
      })
      return mapUsers
    }
  },
  getUsersTree(state) {
    if (state.users) {
      const mapUsers = state.users.map(user => {
        return {
          id: user?.id,
          label: `${user.noreg}-${user.text}`,
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

  [POST_USER]({ commit }, data = null) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.post('master/users', data)
        .then((result) => {
          const linesData = result.data
          resolve(linesData.data)
          console.log(commit);
        }).catch((err) => {
          reject(err)
        });

    });
  },
  [PUT_USER]({ commit }, data = null) {
    let ID = data.id
    console.log(data);
    delete data.id
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      console.log(data);
      ApiService.put(`master/users/edit/${ID}`, data)
        .then((result) => {
          const jobData = result.data
          resolve(jobData.data)
          console.log(commit);
        }).catch((err) => {
          reject(err)
        });

    });
  },
  [DELETE_USER]({ commit }, id) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.delete(`master/users/delete/${id}`)
        .then((result) => {
          const jobData = result.data
          resolve(jobData.data)
          console.log(commit);
        }).catch((err) => {
          reject(err)
        });

    });
  },
  [PUT_USER_ROLE]({ commit }, { id, role }) {
    ApiService.setHeader()
    return new Promise((resolve, reject) => {
      ApiService.put(`master/users/role/${id}`, { role })

        .then((result) => {
          const roledata = result.data
          resolve(roledata.data)
          console.log(commit)
        }).catch((err) => {
          reject(err)
        });
    })
  },
 [PUT_USER_PASS]({ commit }, { id, password }) {
  ApiService.setHeader()
  return new Promise((resolve, reject) => {
    ApiService.put(`master/users/pass/${id}`, { password })
      .then((result) => {
        const passdata = result.data
        resolve(passdata.data)
        console.log(commit) 
      })
      .catch((err) => {
        reject(err)
      })
  })
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
