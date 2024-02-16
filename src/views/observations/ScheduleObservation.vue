<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h5>Schedule Observasi</h5>
        <div class="d-flex">
          <button
            class="btn btn-success text-white"
            @click="this.$router.push('/schedule/observation/form')"
          >
            Add Schedule
            <CIcon icon="cil-plus" size="sm" />
          </button>
        </div>
      </div>
    </div>
    <div>
      <table class="table table-striped text-center">
        <tr>
          <th>No</th>
          <th>Line</th>
          <th>Pos</th>
          <th>Type Pekerjaan</th>
          <th>Petugas</th>
          <th>Member</th>
          <th>Job Desc</th>
          <th>Planning</th>
          <th>Actual</th>
          <th>Actions</th>
        </tr>
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
            v-for="(obaservation, i) in observationSchedule"
            :key="obaservation.uuid"
          >
            <td>{{ i + 1 }}</td>
            <td>{{ obaservation.line_nm }}</td>
            <td>{{ obaservation.pos_nm }}</td>
            <td>{{ obaservation.job_type_nm }}</td>
            <td v-if="obaservation.checkers.length > 0">
              <button
                v-for="checker in obaservation.checkers"
                :key="checker.id"
                class="btn btn-warning text-dark disabled"
              >
                {{ checker.checker_nm }}
              </button>
            </td>
            <td>{{ obaservation.member_nm }}</td>
            <td>{{ obaservation.job_nm }}</td>
            <td>{{ `${obaservation.plan_check_dt}` }}</td>
            <td
              :class="
                `${obaservation.actual_check_dt}`.split('T')[0] == 'null'
                  ? 'bg-danger'
                  : ''
              "
            >
              {{
                `${obaservation.actual_check_dt}`.split('T')[0] != 'null'
                  ? `${obaservation.actual_check_dt}`.split('T')[0]
                  : 'belum cek'
              }}
            </td>
            <td>
              <div class="d-flex">
                <button
                  class="btn btn-info btn-sm mx-1 text-white"
                  @click="editPos(obaservation.id)"
                >
                  edit
                </button>
                <button
                  class="btn btn-danger btn-sm text-white"
                  @click="deletePos(obaservation.id)"
                >
                  delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  GET_OBSERVATION_SCHEDULE_LIST,
  DELETE_OBSERVATION_LIST,
} from '@/store/modules/observation.module'
import Swal from 'sweetalert2'
import Loading from 'vue-loading-overlay'

export default {
  name: 'ScheduleObservation',
  data() {
    return {
      isLoading: false,
      form: {
        line_id: null,
      },
    }
  },
  watch: {
    observationSchedule: function () {
      console.log(this.observationSchedule)
    },
  },
  computed: {
    ...mapGetters(['observationSchedule']),
  },
  methods: {
    async getObservations() {
      this.isLoading = true
      await this.$store.dispatch(GET_OBSERVATION_SCHEDULE_LIST).then((res) => {
        if (res) {
          this.isLoading = false
        }
      })
    },
    async editPos(id) {
      await this.$router.push(`/schedule/observation/form?id=${id}`)
    },
    deletePos(id) {
      console.log(id)
      Swal.fire({
        title: 'kamu mau menghapus data ini?',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        denyButtonText: `Tidak`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.$store
            .dispatch(DELETE_OBSERVATION_LIST, id)
            .then(async () => {
              Swal.fire('Berhasil menghapus!', '', 'success')
              await this.$store.dispatch(GET_OBSERVATION_SCHEDULE_LIST)
            })
            .catch((err) => {
              console.log(err)
              Swal.fire('Gagal menghapus!', '', 'error')
            })
        }
      })
    },
  },
  async mounted() {
    await this.getObservations()
  },
  components: { Loading },
}
</script>
 