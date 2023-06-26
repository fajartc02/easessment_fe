<template>
    <div class="card">
        <div class="card-header">
            <div class="d-flex row align-items-center">
                <div class="col-10">
                    Schedule Observasi
                </div>
                <div class="col">
                    <button class="btn btn-success" @click="this.$router.push('/schedule/observation/form')">
                        Add Schedule
                        <CIcon
                            icon="cil-plus" 
                            size="sm"
                        />
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body text-center">
            <table class="table table-bordered table-stripped">
                <tr>
                   <th>No</th>
                   <th>Line</th> 
                   <th>Pos</th>
                   <th>Type Pekerjaan</th>
                   <th>Petugas</th>
                   <th>Member</th>
                   <th>Job Desc</th>
                   <th>SOP</th>
                   <th>Planning</th>
                   <th>Actual</th>
                   <th colspan="2">Actions</th>
                </tr>
                <!-- <template v-if="jobState.length > 0">
                    <tr v-for="(job, i) in jobState" :key="job.uuid">
                        <td>{{ i + 1 }}</td>
                        <td>{{ job.line_nm }}</td>
                        <td>{{ job.machine_nm }}</td>
                        <td>{{ job.pos_nm }}</td>
                        <td>{{ job.job_type_nm }}</td>
                        <td>{{ job.job_no }}</td>
                        <td>{{ job.job_nm }}</td>
                        <td v-if="job.attachment">
                            <CIcon
                                icon="cil-check-circle" 
                                class="text-success"
                                size="xxl"
                            />
                        </td>
                        <td v-else>
                            <CIcon
                                icon="cil-x" 
                                class="text-danger"
                                size="xxl"
                            />
                        </td>
                        <td>{{ job.created_by }}</td>
                        <td>{{ job.created_dt.split('T')[0] }}</td>
                        <td>
                            <CButton color="warning" @click="editPos(job.uuid)">
                                <CIcon
                                    icon="cil-pencil" 
                                    size="sm"
                                />
                            </CButton>
                        </td>
                        <td>
                            <CButton color="danger" @click="deletePos(job.uuid)">
                                <CIcon
                                    icon="cil-trash" 
                                    size="sm"
                                />
                            </CButton>
                        </td>
                    </tr>
                </template> -->
                <!-- <tr v-else>
                    <td colspan="6">
                        <h3>Tidak Ada Data</h3>
                    </td>
                </tr> -->
            </table>
        </div>
    </div>
</template>

<script>
import {GET_JOB, DELETE_JOB} from '@/store/modules/job.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
    name: 'ScheduleObservation',
    data() {
        return {
            form: {
                line_id: null
            },
            jobState: []
        }
    },
    watch: {
        jobData: function() {
            console.log(this.jobData);
            this.jobState = this.jobData
        }
    },
    computed: {
        ...mapGetters(['jobData'])
    },
    methods: {
        async getJob() {
            await this.$store.dispatch(GET_JOB)
        },
        async editPos(id) {
            await this.$router.push(`/master/job/form?id=${id}`)
        },
        deletePos(id) {
            Swal.fire({
                title: 'kamu mau menghapus data ini?',
                showCancelButton: true,
                confirmButtonText: 'Ya',
                denyButtonText: `Tidak`,
                }).then(async (result) => {
                if (result.isConfirmed) {
                    await this.$store.dispatch(DELETE_JOB, id)
                    .then(async () => {
                        Swal.fire('Berhasil menghapus!', '', 'success')
                        await this.$store.dispatch(GET_JOB)
                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire('Gagal menghapus!', '', 'error')
                    })
                }
            })
        }
    },
    async mounted() {
       await this.getJob()
    }
}
</script>