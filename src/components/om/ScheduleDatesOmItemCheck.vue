<template>
  <div>
    <div class="card-body p-0 overflow-x-auto">
      <div v-if="mainSchedules.length > 0 && !isLoading" class="tableFixHead">
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
            <template v-else v-for="(data, scheduleIndex) in mainSchedule.sub_schedules" :key="scheduleIndex">
              <tr>
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
            </template>
          </tbody>
        </table>
      </div>
      <div v-else-if="isLoading" class="text-center p-5">
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
  GET_OM_MAIN_SCHEDULES,
  GET_OM_SUB_SCHEDULES,
  GET_OM_SUB_SCHEDULES_CHILDREN_SELECTED
} from '@/store/modules/omSchedule.module'
import { toast } from 'vue3-toastify'
import Swal from 'sweetalert2'
import moment from 'moment'

const defaultFilter = {
  line_id: null,
  freq_id: null,
  machine_id: null,
  group_id: null,
  yearMonth: null
}

export default {
  name: 'ScheduleDatesOmItemCheck',
  props: {
    filter: {
      type: Object,
      default: defaultFilter
    },
    refresh: {
      type: Boolean,
      default: false,
    }
  },
  components: {

  },
  data() {
    return {
      mainSchedules: [],
      isLoading: false,
      isLoadingSub: false,
    }
  },
  async mounted() {
    this.getMainSchedules()
  },
  watch: {
    getOmMainSchedules: {
      async handler() {
        this.mainSchedules = this.getOmMainSchedules?.list ?? []
        if (this.getOmMainSchedules.list)
        {
          for (let i = 0; i < this.getOmMainSchedules.list.length; i++)
          {
            await this.getSubSchedules(this.getOmMainSchedules.list[i].om_main_schedule_id)
          }
        }
      }
    },
    getOmSubSchedules: {
      handler() {
        if (this.getOmSubSchedules.schedule.length > 0)
        {
          this.getOmSubSchedules.schedule.forEach(sub => {
            this.mainSchedules.forEach(main => {
              if (main.om_main_schedule_id == sub.om_main_schedule_id)
              {
                if (!Array.isArray(main.sub_schedules))
                {
                  main.sub_schedules = []
                }

                main.sub_schedules.push(sub)
                return
              }
            })
          })
        }
        else
        {
          this.mainSchedules.forEach(main => {
            main.sub_schedules = []
          })
        }
      }
    },
    filter: {
      async handler() {
        if (this.filter.line_id || this.filter.yearMonth || this.filter.group_id)
        {
          await this.getMainSchedules()
        }

        if (this.filter.machine_id || this.filter.freq_id)
        {
          this.mainSchedules.forEach(main => {
            main.sub_schedules = this.filterSubSchedules(main.sub_schedules, this.filter.machine_id, this.filter.freq_id)
          })
        }
      },
      deep: true
    },
    refresh: {
      handler() {
        if (this.refresh)
        {
          this.getMainSchedules()
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'getOmMainSchedules',
      'getOmSubSchedules',
    ]),
    getDateThisMonth() {
      if (this.filter.yearMonth)
      {
        const year = this.filter.yearMonth.split('-')[0]
        const month = +this.filter.yearMonth.split('-')[1] + 1
        return new Date(year, month + 1, 0).getDate()
      }

      return moment().format('DD')
    },
    getMonthStr() {
      const monthStr = ['January', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      return monthStr[+this.filter.yearMonth.split('-')[1] - 1]
    },
  },
  methods: {
    async getMainSchedules() {
      try
      {
        this.isLoading = true
        let objQuery = {
          month_year_num: this.filter.yearMonth,
          line_id: this.filter.line_id,
        }
        await this.$store.dispatch(GET_OM_MAIN_SCHEDULES, objQuery)
        this.isLoading = false
      }
      catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
    async getSubSchedules(mainScheduleID) {
      try
      {
        this.isLoadingSub = true
        let objQuery = {
          om_main_schedule_id: mainScheduleID,
          freq_id: this.filter.freq_id,
          machine_id: this.filter.machine_id
        }

        await this.$store.dispatch(GET_OM_SUB_SCHEDULES, objQuery)
        this.isLoadingSub = false
      }
      catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
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
            this.getMainSchedules()
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
    filterSubSchedules(
      childSubSchedules,
      machine_id = null,
      freq_id = null
    ) {
      if (!childSubSchedules) return []

      return childSubSchedules.filter((subSchedule) => {
        if (machine_id && freq_id)
        {
          return subSchedule.machine_id == machine_id && subSchedule.freq_id == freq_id
        }
        else if (machine_id)
        {
          return subSchedule.machine_id == machine_id
        }
        else if (freq_id)
        {
          return subSchedule.freq_id == freq_id
        }
      })
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
</style>
