<template>
  <div>
    <div class="card-body p-0 overflow-x-auto">
      <div v-if="mainSchedules.length > 0" class="tableFixHead">
        <table class="table table-hover" style="width: 100%" v-for="mainSchedule in mainSchedules"
          :key="mainSchedule.id">
          <thead>
            <tr>
              <th colspan="40" class="text-center">
                OM Schedule Activities ({{ mainSchedule.line_nm }} - {{ mainSchedule.group_nm }})
              </th>
            </tr>
            <tr>
              <th id="fixCol-1" rowspan="2">No</th>
              <th id="fixCol-2" rowspan="2">Machine</th>
              <th id="fixCol-3" rowspan="2">Item</th>
              <th id="fixCol-4" rowspan="2">Location</th>
              <th id="fixCol-5" rowspan="2">Methode</th>
              <th rowspan="2">Duration</th>
              <th rowspan="2">PIC</th>
              <th rowspan="2">Standart</th>
              <th rowspan="2">Periode</th>
              <th :colspan="getDateThisMonth" class="text-center">{{ getMonthStr }}</th>
            </tr>
            <tr>
              <td v-for="n in getDateThisMonth" :key="n">{{ n }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoadingSub">
              <td :colspan="getDateThisMonth + 9" class="text-center">
                <CSpinner aria-hidden="true" />
              </td>
            </tr>
            <tr v-else-if="mainSchedule.sub_schedules?.length == 0">
              <td :colspan="getDateThisMonth + 9" class="text-center">
                No Data Available
              </td>
            </tr>
            <template v-else>
              <tr v-for="(data, scheduleIndex) in mainSchedule.sub_schedules" :key="scheduleIndex">
                <td id="fixCol-1">{{ scheduleIndex + 1 }}</td>
                <td id="fixCol-2" style="min-width: 100px">{{ data.machine_nm }}</td>
                <td id="fixCol-3" style="min-width: 160px">{{ data.item_check_nm }}</td>
                <td id="fixCol-4" style="min-width: 120px">{{ data.location_nm }}</td>
                <td id="fixCol-5" style="min-width: 120px">{{ data.method_nm }}</td>
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
                <td> {{ data.freq_nm }}</td>
                <td v-for="(children, childrenIndex) in data?.children" :key="childrenIndex"
                  :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''}`">
                  <CDropdown variant="btn-group"
                    v-if="!children.is_holiday && children.status && children.status != ''">
                    <CButton color="secondary" class="text-secondary bg-white"
                      :class="{ 'py-2 px-2': children.status == 'PROBLEM' }" @click="addScheduleCheck(data, children)">
                      <div v-if="children.status == 'PLANNING'" class="bullet"></div>
                      <div v-else-if="children.status == 'ACTUAL'" class="bullet-filled"></div>
                      <div v-else-if="children.status == 'PROBLEM'"
                        class="bullet-cancel d-flex justify-content-center align-items-center"
                        style="width: 20px; height: 20px">
                        <CIcon icon="cil-x" class="text-danger text-bold" size="sm" />
                      </div>
                    </CButton>
                    <div v-if="children.status == 'PLANNING'" style="margin-left: -5px;">
                      <CDropdownToggle color="secondary" class="text-white" split> item </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem @click="openChangeDateModal(children)">
                          Change Date
                        </CDropdownItem>
                        <CDropdownItem @click="deleteScheduleCheck(children.om_sub_schedule_id)">Delete</CDropdownItem>
                      </CDropdownMenu>
                    </div>
                  </CDropdown>
                </td>
              </tr>
              <tr>
                <td id="fixCol-sign" colspan="9" class="text-center">Sign TL </td>
                <td v-for="sign in mainSchedule.sub_schedules[0].children" :key="sign"
                  :style="`${sign.is_holiday ? 'background-color: #f9fafb' : ''} ${sign.status == 'NIGHT_SHIFT' ? 'background-color: #fffbeb' : ''} `">
                  <div class="d-flex align-items-center justify-content-center w-full">
                    <button @click="openSignModal(sign, true)"
                      v-if="!sign.is_holiday && !sign.sign_tl"
                      class="check-wrapper-null d-flex align-items-center justify-content-center">
                      <CIcon icon="cil-x" class="text-danger" size="sm" />
                    </button>
                    <button @click="openSignModal(sign, true)"
                      v-else-if="!sign.is_holiday && sign.sign_tl"
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
                      <CIcon icon="cil-x" class="text-danger" size="md" />
                    </button>
                    <button @click="
                      openSignModal(sign, false)
                      " v-else-if="!sign.is_holiday && sign.sign"
                      class="check-wrapper d-flex align-items-center justify-content-center">
                      <CIcon icon="cil-check" class="text-black" size="md" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div v-else-if="isLoadingMain" class="text-center p-5">
        <CSpinner aria-hidden="true" />
      </div>
      <div v-else class="text-center p-5">
        <span class="text-muted">Data not found</span>
      </div>
    </div>
  </div>
</template>
<script>
import ApiService from '@/store/api.service'
import { mapGetters } from 'vuex'
import {
  GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED
} from '@/store/modules/omSchedule.module'
import Swal from 'sweetalert2'
import moment from 'moment'

export default {
  name: 'ScheduleDatesOmItemCheck',
  props: {
    mainSchedules: {
      type: Array,
    },
    isLoadingMain: {
      type: Boolean,
    },
    isLoadingSub: {
      type: Boolean,
    },
    yearMonth: {
      type: String,
    }
  },
  components: {

  },
  data() {
    return {
    }
  },
  async mounted() {

  },
  watch: {

  },
  computed: {
    ...mapGetters([
      'getOmMainSchedules',
      'getOmSubSchedules',
    ]),
    getDateThisMonth() {
      if (this.yearMonth)
      {
        const year = this.yearMonth.split('-')[0]
        const month = +this.yearMonth.split('-')[1] + 1
        return new Date(year, month + 1, 0).getDate()
      }

      return moment().format('DD')
    },
    getMonthStr() {
      const monthStr = ['January', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      return monthStr[+this.yearMonth.split('-')[1] - 1]
    }
  },
  methods: {

    async deleteScheduleCheck(subScheduleID) {
      Swal.fire({
        title: 'Are you sure to delete this item?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed)
        {
          ApiService.setHeader()
          const deleteData = ApiService.delete(`operational/om/sub-schedule/delete/${subScheduleID}`)

          if (deleteData)
          {
            Swal.fire('Data deleted!', '', 'success')
            this.$emit('refreshMainSchedule', true)
          } else
          {
            Swal.fire('Error', '', 'warning')
          }
        } else if (result.isDenied)
        {
          Swal.fire('Canceled', '', 'info')
        }
      })
    },
    addScheduleCheck(subScheduleParent, subScheduleChildren) {
      this.$router.push(`/om/schedule-detail/${subScheduleParent.om_main_schedule_id}/${subScheduleChildren.om_sub_schedule_id}`)
    },
    openChangeDateModal(children) {
      this.$store.dispatch(GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED, children)
      this.$emit('showEditDateModal', true)
    },
    openEditPicModal(children) {
      let res = {}
      if (children.children)
      {
        res = {
          om_sub_schedule_id: children.om_sub_schedule_id,
        }
      }
      else
      {
        res = children
      }
      this.$store.dispatch(GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED, res)
      this.$emit('showEditPicModal', true)
    },
    openSignModal(sign, isTl){
      this.$emit('showSignModal', {
        type: isTl ? 'SIGN_TL' : 'SIGN GL',
        date: isTl ? sign.date : sign.start_date,
        sign: isTl ? sign.sign_tl : sign.sign,
        sign_checker_id: isTl ? sign.tl_sign_checker_id : sign.sign_checker_id,
      })
    }
  },
}
</script>
<style>
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
  height: 100%;
}

.tableFixHead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

#fixCol-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 3;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 3;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 125px;
  z-index: 3;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 270px;
  z-index: 3;
  background-color: white;
}

#fixCol-5 {
  position: sticky;
  top: 0px;
  left: 370px;
  z-index: 3;
  background-color: white;
}

#fixCol-6 {
  position: sticky;
  top: 0px;
  left: 450px;
  z-index: 3;
  background-color: white;
}

#fixCol-sign {
  position: sticky;
  top: 0px;
  left: -200px;
  z-index: 3;
  background-color: white;
}
</style>
