<template>
  <div>
    <div class="card mb-5">
      <div class="card-header">
        <div class="row d-flex align-items-center">
          <div class="col">
            <label>Shift</label>
            <select class="form-select">
              <option value="">RED</option>
              <option value="">WHITE</option>
            </select>
          </div>
          <div class="col">
            <div class="d-flex align-items-center">
              <div class="d-flex align-items-center">
                <div class="bullet" style="width: 20px; height: 20px"></div>
                <span class="mx-2">Planning</span>
              </div>
              <div class="d-flex align-items-center">
                <div
                  class="bullet-filled"
                  style="width: 20px; height: 20px"
                ></div>
                <span class="mx-2">Sudah Cleaning</span>
              </div>
              <div class="d-flex align-items-center">
                <div
                  class="bullet-cancel"
                  style="width: 20px; height: 20px"
                ></div>
                <span class="mx-2">Sudah Cleaning, ada temuan abnormally</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0 overflow-x-auto">
        <table class="table table-bordered" style="width: 100%">
          <thead>
            <tr>
              <th colspan="40" class="text-center">
                4S Schedule Activities [Sub line Red]
              </th>
            </tr>
            <tr>
              <th rowspan="2">No</th>
              <th rowspan="2">Zona</th>
              <th rowspan="2">No Kanban</th>
              <th rowspan="2">Area</th>
              <th rowspan="2">Time</th>
              <th rowspan="2">PIC</th>
              <th rowspan="2">Freq</th>
              <th colspan="31" class="text-center">Maret</th>
            </tr>
            <tr>
              <td v-for="n in totalDate" :key="n">{{ n }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="10" class="p-0" style="height: 200px">
                <div class="vl-parent p-0" style="height: 100%">
                  <loading
                    v-model:active="isLoading"
                    :can-cancel="true"
                    :is-full-page="false"
                    :on-cancel="onCancel"
                  />
                </div>
              </td>
            </tr>
            <tr
              v-else
              v-for="(data, scheduleIndex) in scheduleData"
              :key="scheduleIndex"
            >
              <td>{{ scheduleIndex + 1 }}</td>
              <td style="min-width: 100px">{{ data.zone_nm }}</td>
              <td style="min-width: 120px">{{ data.kanban_no }}</td>
              <td style="min-width: 200px">{{ data.area_nm }}</td>
              <td style="min-width: 200px">{{ data.area_nm }}</td>
              <td style="min-width: 100px" :rowspan="data.row_span_pic">
                {{ data.pic_nm }}
              </td>
              <td>{{ data.freq_nm }}</td>
              <td
                v-for="(children, childrenIndex) in data.children"
                :key="childrenIndex"
                :style="`${
                  children.is_holiday ? 'background-color: #f9fafb' : ''
                }`"
              >
                <div
                  v-if="!children.is_holiday && children.status == 'PLANNING'"
                  class="status-wrapper d-flex align-items-center justify-content-center"
                >
                  <div class="bullet"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import { GET_SCHEDULES } from '@/store/modules/schedule4s.module'
export default {
  name: 'Main Schedule',
  components: { Loading },
  data() {
    return {
      totalDate: 31,
      isLoading: false,
      scheduleData: null,
    }
  },
  methods: {
    async get4sSchedules() {
      this.isLoading = true
      let objQuery = {
        main_schedule_id: '29bd729a-0ca3-492c-bba5-c8ca4c9ed4b5',
      }
      await this.$store.dispatch(GET_SCHEDULES, objQuery).then((res) => {
        if (res) {
          this.scheduleData = res.schedule
          this.isLoading = false
        }
      })
    },
  },

  async mounted() {
    await this.get4sSchedules()
  },
  updated() {},
}
</script>

<style>
.status-wrapper {
  width: 30px;
  height: 30px;
  background-color: #f0fdf4;
  border-radius: 6px;
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
</style>