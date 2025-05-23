import ApiService from "@/store/api.service";

export const GET_ZONES = "getZoneStore";
export const POST_ZONE = "postZones";
export const PUT_ZONE = "putZones";
export const DELETE_ZONE = "deleteZones";

export const SET_LIMIT = "setLimit";
export const SET_CURRENT_PAGE = "setPage";
export const SET_TOTAL_DATA = "setTotalData";

// mutation types
export const SET_ZONES = "setZones";

const state = {
  zones: null
};

const getters = {
  getZone(state) {
    return state.zones;
  },
  getZoneOpts(state) {
    let mapZones = [];
    if (state.zones) {
      mapZones = state.zones.map(shop => {
        return {
          id: shop.zone_id,
          text: shop.zone_nm
        };
      });

    }
    mapZones.push({
      id: "-1",
      text: "All"
    });
    return mapZones;
  },
  getZonesWithStatusModal(state) {
    if (state.zones?.length > 0 && state.zones) {
      let mapZone = state.zones.map(zone => {
        zone.is_edit = false;
        return zone;
      });
      return mapZone;
    }
  },
  getZoneOptsWithoutAll(state) {
    if (state.zones) {
      const mapZones = state.zones.map(zone => {
        return {
          id: zone.zone_id,
          text: zone.zone_nm
        };
      });
      return mapZones;
    } else {
      return [];
    }
  },
  getZoneOptsTreeselect(state) {
    if (state.zones)
    {
      const mapZones = state.zones.map(zone => {
        return {
          id: zone.zone_id,
          label: zone.zone_nm
        };
      });
      return mapZones;
    } else
    {
      return [];
    }
  }
};

const actions = {
  [GET_ZONES]({ commit }, query) {
    ApiService.setHeader();
    return new Promise((resolve, reject) => {
      ApiService.query("master/zones/get", query)
        .then((result) => {
          const zones = result.data.data;
          if (zones) {
            commit(SET_ZONES, zones.list ?? []);
            if (query?.isPaginate) {
              console.log('zone paginate');
              if (zones.limit) commit(SET_LIMIT, zones.limit);
              if (zones.current_page) commit(SET_CURRENT_PAGE, zones.current_page);
              if (zones.total_data) commit(SET_TOTAL_DATA, zones.total_data);
            }

            resolve(zones.list);
          }
          // throw result;
        }).catch((err) => {
        reject(err);
      });

    });
  },
  [POST_ZONE]({ commit }, data = null) {
    ApiService.setHeader();
    return new Promise((resolve, reject) => {
      ApiService.post("master/zones/add", data)
        .then((result) => {
          const linesData = result.data;
          resolve(linesData.data);
          console.log(commit);
        }).catch((err) => {
        reject(err);
      });

    });
  },
  [PUT_ZONE]({ commit }, data = null) {
    ApiService.setHeader();
    let ID = data.id;
    delete data.id;
    console.log(data);
    return new Promise((resolve, reject) => {
      console.log(data);
      ApiService.put(`master/zones/edit/${ID}`, data)
        .then((result) => {
          const shop = result.data;
          resolve(shop.data);
          console.log(commit);
        }).catch((err) => {
        console.log(err);
        reject(err);
      });

    });
  },
  [DELETE_ZONE]({ commit }, id) {
    ApiService.setHeader();
    return new Promise((resolve, reject) => {
      ApiService.delete(`master/zones/delete/${id}`)
        .then((result) => {
          const jobData = result.data;
          resolve(jobData.data);
          console.log(commit);
        }).catch((err) => {
        reject(err);
      });

    });
  }
};

const mutations = {
  [SET_ZONES](state, zones) {
    state.zones = zones;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
