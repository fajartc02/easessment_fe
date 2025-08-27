<template>
  <div class="overflow-x-auto">
    <div v-if="!getIsLoadingMainSchedule && getOmMainSchedules?.length > 0" class="card p-0 mb-3">
      <template v-for="(mainSchedule) in getOmMainSchedules" :key="mainSchedule">
        <div class="card-body p-0 tableFixHead">
          <table class="table table-hover pb-0 mb-0" style="width: 100%">
            <thead>
              <tr>
                <th id="fixCol-header" colspan="40" class="text-center">
                  OM Schedule Activities ({{ mainSchedule.line_nm }} - {{ mainSchedule.group_nm }})
                </th>
              </tr>
              <tr>
                <th :id="isLoadingSub || mainSchedule.sub_schedules?.length == 0 ? '' : 'fixCol-1'" rowspan="2">No
                </th>
                <th :id="isLoadingSub || mainSchedule.sub_schedules?.length == 0 ? '' : 'fixCol-2'" rowspan="2">
                  Machine
                </th>
                <th :id="isLoadingSub || mainSchedule.sub_schedules?.length == 0 ? '' : 'fixCol-3'" rowspan="2">Item
                </th>
                <th :id="isLoadingSub || mainSchedule.sub_schedules?.length == 0 ? '' : 'fixCol-4'" rowspan="2">
                  Location
                </th>
                <th :id="isLoadingSub || mainSchedule.sub_schedules?.length == 0 ? '' : 'fixCol-5'" rowspan="2">
                  Methode
                </th>
                <th rowspan="2">Duration</th>
                <th rowspan="2">PIC</th>
                <th rowspan="2">Standart</th>
                <th :id="isLoadingSub || mainSchedule.sub_schedules?.length == 0 ? '' : 'fixCol-6'" rowspan="2">
                  Periode
                </th>
                <th :colspan="getDateThisMonth" class="text-center">{{ getMonthStr }}</th>
              </tr>
              <tr>
                <th v-for="n in getDateThisMonth" :key="n" class="text-center">{{ n }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoadingSub && indexLoadingSub == mainSchedule.om_main_schedule_id">
                <td :colspan="getDateThisMonth + 9" class="text-center">
                  <CSpinner aria-hidden="true" />
                </td>
              </tr>
              <tr v-else-if="mainSchedule.sub_schedules?.length == 0">
                <td v-if="!isLoadingSub" :colspan="getDateThisMonth + 9" class="text-center">
                  No Data Available
                </td>
                <td v-else :colspan="getDateThisMonth + 9" class="text-center">
                  <CSpinner aria-hidden="true" />
                </td>
              </tr>
              <template v-else>
                <tr v-for="(data) in mainSchedule.sub_schedules" :key="data">
                  <td id="fixCol-body-1">{{ data.no }}</td>
                  <td id="fixCol-body-2" style="min-width: 100px">{{ data.machine_nm }}</td>
                  <td id="fixCol-body-3" style="min-width: 160px">{{ data.item_check_nm }}</td>
                  <td id="fixCol-body-4" style="min-width: 120px">{{ data.location_nm }}</td>
                  <td id="fixCol-body-5" style="min-width: 120px">{{ data.method_nm }}</td>
                  <td style="min-width: 50px">{{ data.standart_time }}</td>
                  <td style="min-width: 100px">
                    <div style="cursor: pointer;" v-if="data.pic_nm">
                      <p class="cursor-pointer"> {{ data.pic_nm }}</p>
                    </div>
                    <div v-else>
                      <button class="btn btn-info btn-sm mx-2 text-white" @click="openEditPicModal(data)">
                        Add
                      </button>
                    </div>
                  </td>
                  <td> {{ data.standart_nm }}</td>
                  <td id="fixCol-body-6"> {{ data.freq_nm }}</td>
                  <td v-for="(children, childrenIndex) in data?.children" :key="`sch-${childrenIndex}`"
                    :style="`${children.is_holiday ? 'background-color: #AEAEAE' : ''}`">
                    <CDropdown variant="btn-group" v-if="children.status && children.status != ''">
                      <CButton color="secondary" class="text-secondary bg-white"
                        :class="{ 'py-2 px-2': children.status == 'PROBLEM' }"
                        @click="addScheduleCheck(data, children)">
                        <div v-if="children.status == 'PLANNING'" class="bullet"></div>
                        <div v-else-if="children.status == 'ACTUAL'" class="bullet-filled"></div>
                        <div v-else-if="children.status == 'PROBLEM'"
                          class="bullet-cancel d-flex justify-content-center align-items-center"
                          style="width: 20px; height: 20px">
                          <CIcon icon="cil-x" class="text-danger text-bold" size="sm" />
                        </div>
                      </CButton>
                      <div v-if="children.status == 'PLANNING'" style="margin-left: -5px;">
                        <CDropdownToggle color="secondary" class="text-white" split> item</CDropdownToggle>
                        <CDropdownMenu>
                          <CDropdownItem @click="openChangeDateModal(children)">
                            Change Date
                          </CDropdownItem>
                          <CDropdownItem @click="deleteScheduleCheck(children.om_sub_schedule_id)">Delete
                          </CDropdownItem>
                        </CDropdownMenu>
                      </div>
                    </CDropdown>
                  </td>
                </tr>
                <tr>
                  <td id="fixCol-sign" colspan="9" class="text-center">Sign TL</td>
                  <td v-for="sign in mainSchedule.sub_schedules[0].children" :key="sign"
                    :style="`${sign.is_holiday ? 'background-color: #f9fafb' : ''} ${sign.status == 'NIGHT_SHIFT' ? 'background-color: #fffbeb' : ''} `">
                    <div class="d-flex align-items-center justify-content-center w-full">
                      <button @click="openSignModal(sign, true)" v-if="!sign.is_holiday && !sign.sign_tl"
                        class="check-wrapper-null d-flex align-items-center justify-content-center">
                        <CIcon icon="cil-x" class="text-danger" size="sm" />
                      </button>
                      <button @click="openSignModal(sign, true)" v-else-if="!sign.is_holiday && sign.has_sign_tl"
                        class="check-wrapper d-flex align-items-center justify-content-center">
                        <CIcon icon="cil-check" class="text-black" size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td id="fixCol-sign" colspan="9" class="text-center">Sign GL</td>
                  <td v-for="sign in mainSchedule.glSigns" :key="sign"
                    :style="`${sign.is_holiday ? 'background-color: #f9fafb' : ''} `" :colspan="sign.col_span">
                    <div class="d-flex align-items-center justify-content-center w-full">
                      <button @click="
                        openSignModal(sign, false)
                        " v-if="!sign.is_holiday && !sign.sign"
                        class="check-wrapper-null d-flex align-items-center justify-content-center">
                        <CIcon icon="cil-x" class="text-danger" />
                      </button>
                      <button @click="
                        openSignModal(sign, false)
                        " v-else-if="!sign.is_holiday && sign.sign"
                        class="check-wrapper d-flex align-items-center justify-content-center">
                        <CIcon icon="cil-check" class="text-black" />
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between">
            <div>
              <div class="input-group mb-3">
                <label class="input-group-text">Limit</label>
                <select class="form-select" v-model="mainSchedule.limit"
                  @change="handleLimitChangeSubSchedule($event, mainSchedule.om_main_schedule_id)">
                  <option selected value="10">10</option>
                  <option value="20">20</option>
                  <option value="40">40</option>
                  <option value="60">60</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
            <div v-if="mainSchedule.total_data > 0">
              <CustPagination :totalItems="mainSchedule.total_data" :items-per-page="mainSchedule.limit"
                :current-page="mainSchedule.current_page"
                @page-changed="handlePageChangeSubSchedule($event, mainSchedule.om_main_schedule_id)" />
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-else-if="getIsLoadingMainSchedule" class="text-center p-5">
      <CSpinner aria-hidden="true" />
    </div>
    <div v-else class="text-center p-5">
      <span class="text-muted">Data not found</span>
    </div>
  </div>
</template>
<script>
import ApiService from "@/store/api.service";

import {
  GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED
} from "@/store/modules/omSchedule.module";
import Swal from "sweetalert2";
import moment from "moment";
import { mapGetters } from "vuex";
import CustPagination from "@/components/pagination/CustPagination.vue";

export default {
  name: "ScheduleDatesOmItemCheck",
  props: {
    yearMonth: {
      type: String
    }
  },
  components: {
    CustPagination
  },
  data() {
    return {};
  },
  async mounted() {

  },
  watch: {
    getTotalDataSubSchedule() {
      console.log("====================================");
      console.log("getTotalDataSubSchedule", this.getTotalDataSubSchedule);
      console.log("====================================");
    }
  },
  computed: {
    ...mapGetters([
      "getOmMainSchedules",
      "getIsLoadingMainSchedule",
      "getIsLoadingSubSchedule",
      "getLimitSubSchedule",
      "getTotalDataSubSchedule",
      "getCurrentPageSubSchedule"
    ]),
    getDateThisMonth() {
      if (this.yearMonth) {
        const year = this.yearMonth.split("-")[0];
        const month = +this.yearMonth.split("-")[1];
        return new Date(year, month, 0).getDate();
      }

      return moment().format("DD");
    },
    getMonthStr() {
      const monthStr = ["January", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
      if (this.yearMonth) {
        return monthStr[+this.yearMonth.split("-")[1] - 1];
      }

      return monthStr[moment().format("MM")];
    },
    isLoadingSub() {
      return typeof this.getIsLoadingSubSchedule == "boolean" ? this.getIsLoadingSubSchedule : this.getIsLoadingSubSchedule?.loading ?? false;
    },
    indexLoadingSub() {
      return this.getIsLoadingSubSchedule ? this.getIsLoadingSubSchedule.om_main_schedule_id : "";
    }
  },
  methods: {
    async deleteScheduleCheck(subScheduleID) {
      Swal.fire({
        title: "Are you sure to delete this item?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Sure",
        denyButtonText: `No`
      }).then(async (result) => {
        if (result.isConfirmed) {
          ApiService.setHeader();
          const deleteData = await ApiService.delete(`operational/om/sub-schedule/delete/${subScheduleID}`);

          if (deleteData) {
            Swal.fire("Data deleted!", "", "success");
            this.$emit("refreshMainSchedule", true);
          } else {
            Swal.fire("Error", "", "warning");
          }
        } else if (result.isDenied) {
          Swal.fire("Canceled", "", "info");
        }
      });
    },
    addScheduleCheck(subScheduleParent, subScheduleChildren) {
      this.$router.push(`/om/schedule-detail/${subScheduleParent.om_main_schedule_id}/${subScheduleChildren.om_sub_schedule_id}`);
    },
    openChangeDateModal(children) {
      this.$store.dispatch(GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED, children);
      this.$emit("showEditDateModal", true);
    },
    openEditPicModal(children) {
      let res = {};
      if (children.children) {
        res = {
          om_sub_schedule_id: children.om_sub_schedule_id
        };
      } else {
        res = children;
      }
      this.$store.dispatch(GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED, res);
      this.$emit("showEditPicModal", true);
    },
    openSignModal(sign, isTl) {
      this.$emit("showSignModal", {
        type: isTl ? "SIGN_TL" : "SIGN GL",
        date: isTl ? sign.date : sign.start_date,
        sign: isTl ? sign.sign_tl : sign.sign,
        sign_checker_id: isTl ? sign.tl_sign_checker_id : sign.sign_checker_id
      });
    },
    handleLimitChangeSubSchedule(event, om_main_schedule_id) {
      this.$emit("limitSubSchedule", {
        limit: event.target.value,
        om_main_schedule_id: om_main_schedule_id
      });
    },
    handlePageChangeSubSchedule(event, om_main_schedule_id) {
      this.$emit("pageSubSchedule", {
        page: event,
        om_main_schedule_id: om_main_schedule_id
      });
    }
  }
};
</script>
<style scoped>
.status-wrapper {
  width: 30px;
  height: 30px;
  background-color: #f0fdf4;
  border-radius: 6px;
}

.check-wrapper {
  width: 30px;
  height: 30px;
  background-color: #e0f2fe;
  border-radius: 100px;
  border: none;
}

.check-wrapper-null {
  width: 30px;
  height: 30px;
  background-color: #f3f4f6;
  border-radius: 100px;
  border: none;
}

.bullet {
  width: 10px;
  height: 10px;
  border: 2px solid black;
  border-radius: 10px;
}

.bullet-filled {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}

.bullet-cancel {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}

.tableFixHead {
  overflow: auto;
  height: 100vh;
}

.tableFixHead th {
  position: sticky;
  top: 0;
  z-index: 30;
  background-color: white;
}

#fixCol-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 40;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 40;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 125px;
  z-index: 40;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 270px;
  z-index: 40;
  background-color: white;
}

#fixCol-5 {
  position: sticky;
  top: 0px;
  left: 370px;
  z-index: 40;
  background-color: white;
}

#fixCol-6 {
  position: sticky;
  top: 0px;
  left: 450px;
  z-index: 40;
  background-color: white;
}

#fixCol-sign {
  position: sticky;
  top: 0px;
  left: -200px;
  background-color: white;
}

#fixCol-header {
  position: sticky;
  left: -200px;
}

#fixCol-body-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 10;
  background-color: white;
}

#fixCol-body-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 10;
  background-color: white;
}

#fixCol-body-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 125px;
  z-index: 10;
  background-color: white;
}

#fixCol-body-4 {
  position: sticky;
  top: 0px;
  left: 270px;
  z-index: 10;
  background-color: white;
}

#fixCol-body-5 {
  position: sticky;
  top: 0px;
  left: 370px;
  z-index: 10;
  background-color: white;
}

#fixCol-body-6 {
  position: sticky;
  top: 0px;
  left: 450px;
  z-index: 10;
  background-color: white;
}
</style>
