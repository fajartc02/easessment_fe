<script>
import { defineComponent } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
  // INITIAL_EVENTS,
  // createEventId
} from './event-utils'
import { GET_GROUP } from '@/store/modules/group.module'
import { GET_LINES } from '@/store/modules/filter.module'
import { GET_USERS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import ApiService from '@/store/api.service'
import moment from 'moment'
import idLocale from '@fullcalendar/core/locales/id';
// import { toast } from 'vue3-toastify/index'
// import { formatDate } from '@fullcalendar/core'

export default defineComponent({
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        locales: [idLocale],
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        headerToolbar: {
          locale: 'id'
          // left: 'prev,next today',
          // center: 'title',
          // right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        initialEvents: null, // alternatively, use the `events` setting to fetch from a feed
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        eventAdd: this.handleEventAdd,
        /* you can update a remote database when these fire:
        eventChange:
        eventRemove:
        */
      },
      currentEvents: [],
      storeEvent: [],
      shiftTypes: [
        {
          id: "morning_shift",
          text: "Shift Pagi"
        },
        {
          id: "night_shift",
          text: "Shift Malam"
        }
      ],
      newEvent: {
        group_id: null,
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
        shift_type: null,
        is_holiday: false,
        holiday_desc: null,
      },
      isAddModal: false,
      tempSelectInfo: null,
      isLoading: false,
      isDetailModal: false,
      selectedEvent: null,
      selectedGroupUuid: null,
      selectedMonth: null,
      selectedYear: null,
      selectedLineId: null,
      monthlyPicList: [],
      isLoadingMonthlyPic: false,
    }
  },
  computed: {
    ...mapGetters(['getGroupsOptsWithoutAll', 'getLinesOpts', 'getUsersOpts']),
    getGroupName() {
      return this.getGroupsOptsWithoutAll.find(group => group.id == this.newEvent.group_id).text
    },
  },
  watch: {
  },
  methods: {
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    async handleDateSelect(selectInfo) {
      this.isAddModal = true
      this.tempSelectInfo = selectInfo
      this.newEvent.start = selectInfo.startStr
      this.newEvent.end = selectInfo.startStr
    },
    async getShifts() {
      try {
        ApiService.setHeader()
        const { data } = await ApiService.get("/master/shifts/get")
        let mapData = !Array.isArray(data.data) ? await data.data.list.map(item => {
          item.start = item.start.split('T')[0]
          item.end = moment(item.end).add(2, 'days').toISOString().split('T')[0]
          console.log(item);
          return item
        }) : []
        this.calendarOptions.initialEvents = await mapData
        this.currentEvents = await mapData
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async submitEvent() {
      try {
        const selectInfo = this.tempSelectInfo
        this.isLoading = true
        let calendarApi = selectInfo.view.calendar

        calendarApi.unselect() // clear date selection
        let title = this.newEvent.is_holiday ? "Hari Libur" : this.getGroupName
        this.newEvent.end = moment(this.newEvent.end).add(1, 'days').toISOString().split('T')[0]
        if (title) {
          let newEvent = {
            title,
            allDay: selectInfo.allDay,
            ...this.newEvent
          }
          ApiService.setHeader()
          await ApiService.post("/master/shifts/add", newEvent)
          await this.getShifts()
          calendarApi.addEvent(newEvent)
          this.newEvent = {
            event_id: null,
            group_id: null,
            start: new Date().toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0],
            shift_type: null,
            is_holiday: false,
            holiday_desc: null
          }
          this.isAddModal = false
          this.isLoading = false
        }
      } catch (error) {
        console.log(error)
        alert(error.response.data.message)
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async handleEventClick(clickInfo) {
      if (clickInfo.event._def.extendedProps.is_holiday) {
        if (!clickInfo.event._def.extendedProps.created_by) {
          alert('Anda tidak bisa menghapus libur national!')
          return
        }

        if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
          try {
            this.isLoading = true
            ApiService.setHeader()
            clickInfo.event.remove()
            await ApiService.delete(`/master/shifts/delete/${clickInfo.event._def.extendedProps.shift_id}`)
            this.isLoading = false
            await this.getShifts()
          } catch (error) {
            alert(error.response.data.message)
            this.isLoading = false
          }
        }
        return
      }

      this.selectedEvent = clickInfo.event
      this.selectedGroupUuid = clickInfo.event._def.extendedProps.group_id
      this.selectedMonth = moment(clickInfo.view.currentStart).format('M')
      this.selectedYear = moment(clickInfo.view.currentStart).format('YYYY')
      this.selectedLineId = null
      this.monthlyPicList = []
      this.isDetailModal = true
    },
    async onLineChange() {
      if (!this.selectedLineId) {
        this.monthlyPicList = []
        return
      }
      this.isLoadingMonthlyPic = true
      try {
        ApiService.setHeader()
        const response = await ApiService.query('/operational/4s/sub-schedule/monthly-pic-config', {
          line_uuid: this.selectedLineId,
          group_uuid: this.selectedGroupUuid,
          month: this.selectedMonth,
          year: this.selectedYear
        })
        this.monthlyPicList = response.data.data.list || []
      } catch (error) {
        console.log(error)
        alert("Failed to fetch monthly PIC configuration")
      } finally {
        this.isLoadingMonthlyPic = false
      }
    },
    async saveMonthlyPicConfig() {
      if (!this.selectedLineId) return
      this.isLoading = true
      try {
        ApiService.setHeader()
        const mappings = this.monthlyPicList.map(item => ({
          kanban_id: item.kanban_id,
          pic_id: item.pic_id
        }))
        await ApiService.put(`/operational/4s/sub-schedule/monthly-pic-config?line_uuid=${this.selectedLineId}&group_uuid=${this.selectedGroupUuid}&month=${this.selectedMonth}&year=${this.selectedYear}`, {
          mappings
        })
        alert("PIC configuration saved successfully!")
        this.isDetailModal = false
      } catch (error) {
        console.log(error)
        alert("Failed to save PIC configuration")
      } finally {
        this.isLoading = false
      }
    },
    async deleteShiftEvent() {
      if (!this.selectedEvent) return
      if (confirm(`Are you sure you want to delete the event '${this.selectedEvent.title}'`)) {
        try {
          this.isLoading = true
          ApiService.setHeader()
          this.selectedEvent.remove()
          await ApiService.delete(`/master/shifts/delete/${this.selectedEvent._def.extendedProps.shift_id}`)
          this.isLoading = false
          this.isDetailModal = false
          await this.getShifts()
        } catch (error) {
          alert(error.response.data.message)
          this.isLoading = false
        }
      }
    },
    handleEvents(events) {
      console.log(events);
      this.currentEvents = events
    },
    handleEventAdd({ event }) {
      console.log(event);
    },
    async ActionGetGroup() {
      try {
        this.$store.dispatch(GET_GROUP)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        console.log(error)
      }
    },
    async getUsers() {
      try {
        this.$store.dispatch(GET_USERS)
      } catch (error) {
        console.log(error)
      }
    }
  },
  async mounted() {
    await this.ActionGetGroup()
    await this.getShifts()
    await this.getLines()
    await this.getUsers()
  }
})

</script>

<template>
  <CModal backdrop="static" :visible="isAddModal" @close="() => {
    isAddModal = false
    this.newEvent = {
      event_id: null,
      group_id: null,
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0],
      shift_type: null,
      is_holiday: false,
      holiday_desc: null
    }
  }">
    <CModalHeader>
      <CModalTitle>Add Event</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="row">
        <div class="col">
          <label>Apakah Hari Libur?</label>
          <select class="form-select" v-model="newEvent.is_holiday">
            <option selected :value="false">
              Tidak
            </option>
            <option :value="true">
              Ya
            </option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label>Start Date</label>
          <input class="form-control" type="date" v-model="newEvent.start">
        </div>
        <div class="col">
          <label>End Date</label>
          <input class="form-control" type="date" v-model="newEvent.end">
        </div>
      </div>
      <template v-if="newEvent.is_holiday">
        <div class="row">
          <div class="col">
            <label>Deskripsi Libur</label>
            <input type="text" class="form-control" v-model="newEvent.holiday_desc">
          </div>
        </div>
      </template>
      <template v-else>
        <div class="row">
          <div class="col">
            <label>Group</label>
            <select class="form-select" v-model="newEvent.group_id">
              <option v-for="(group, index) in getGroupsOptsWithoutAll" :key="index" :value="group.id">
                {{ group.text }}
              </option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <label>Shift</label>
            <select class="form-select" v-model="newEvent.shift_type">
              <option v-for="(shift, index) in shiftTypes" :key="index" :value="shift.id">
                {{ shift.text }}
              </option>
            </select>
          </div>
        </div>
      </template>
    </CModalBody>
    <CModalFooter>
      <button class="btn btn-sm btn-primary" @click="submitEvent">
        <template v-if="isLoading">
          <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
          Loading...
        </template>
        <template v-else>
          Submit
        </template>
      </button>
    </CModalFooter>
  </CModal>

  <!-- Detail Modal -->
  <CModal backdrop="static" size="xl" :visible="isDetailModal" @close="() => { isDetailModal = false }">
    <CModalHeader>
      <CModalTitle>Detail Shift & PIC Configuration</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="row mb-3">
        <div class="col">
          <strong>Shift Group:</strong> {{ selectedEvent?.title }}
        </div>
        <div class="col">
          <strong>Period:</strong> {{ selectedYear }}-{{ selectedMonth }}
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-md-6">
          <label class="form-label">Select Line to configure PICs</label>
          <select class="form-select" v-model="selectedLineId" @change="onLineChange">
            <option :value="null">-- Select Line --</option>
            <option v-for="line in getLinesOpts" :key="line.id" :value="line.id">
              {{ line.text }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="isLoadingMonthlyPic" class="text-center p-3">
        <CSpinner size="sm" /> Loading items...
      </div>
      <div v-else-if="selectedLineId && monthlyPicList.length === 0" class="alert alert-info">
        No schedule found for this combination of Line, Shift, and Month.
      </div>
      <div v-else-if="selectedLineId" class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>Zona</th>
              <th>No Kanban</th>
              <th>Area</th>
              <th>Freq</th>
              <th>PIC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in monthlyPicList" :key="item.kanban_id">
              <td>{{ idx + 1 }}</td>
              <td>{{ item.zone_nm }}</td>
              <td>{{ item.kanban_no }}</td>
              <td>{{ item.area_nm }}</td>
              <td>{{ item.freq_nm }}</td>
              <td>
                <select class="form-select" v-model="item.pic_id">
                  <option :value="null">-- Select PIC --</option>
                  <option v-for="user in getUsersOpts" :key="user.id" :value="user.id">
                    {{ user.text }}
                  </option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CModalBody>
    <CModalFooter class="d-flex justify-content-between">
      <button class="btn btn-danger" @click="deleteShiftEvent">Delete Shift Event</button>
      <div>
        <button class="btn btn-secondary me-2" @click="isDetailModal = false">Close</button>
        <button class="btn btn-primary" :disabled="!selectedLineId || monthlyPicList.length === 0" @click="saveMonthlyPicConfig">
          Save PIC Settings
        </button>
      </div>
    </CModalFooter>
  </CModal>

  <div class='demo-app' v-if="calendarOptions.initialEvents && !isLoading">
    <div class='demo-app-main'>
      <FullCalendar class='demo-app-calendar' :options='calendarOptions'>
        <template v-slot:eventContent='arg'>
          <div :class="`card`"
            :style="`${arg.event.title == 'WHITE' ? 'background-color: #ffffff' : arg.event.title == 'RED' ? 'background-color: #f99a9a' : 'background-color: #f95e5e'}`">
            <div class="card-body p-0 overflow-auto">
              <i style="color: black;">{{
                arg.event.extendedProps.is_holiday ? arg.event.extendedProps.created_by ?
                  arg.event.extendedProps.holiday_desc :
                  `${arg.event.title}` :
                  arg.event.title + '-' + arg.event.extendedProps.shift_type }}</i>
            </div>
          </div>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<style>
.fc-col-header-cell-cushion {
  color: white;
}
</style>

<style lang='css' scoped>
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  margin-right: 3px;
}

.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}

.demo-app-sidebar-section {
  padding: 2em;
}

.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}
</style>

<style>
a {
  text-decoration: none;
}
</style>
