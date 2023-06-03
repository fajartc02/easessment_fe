<template>
    <CCard class="mb-4">
        <CCardHeader>
          <div class="row">
            <div class="col-8">
                <strong>Monthly Schedule</strong>
            </div>
            <div class="col-3 text-right">
                OnProgress: <CIcon
                                icon="cil-circle" 
                                class="text-dark"
                                size="sm"
                            />, Done: <CIcon
                                icon="cil-check-circle" 
                                class="text-success"
                                size="sm"
                            />, Delay: <CIcon
                                icon="cil-circle" 
                                class="text-danger"
                                size="sm"
                            />
               
            </div>
          </div>
        </CCardHeader>
        <CCardBody class="overflow-auto">
            <table class="table table-bordered text-center">
                <thead>
                    <tr>
                        <th rowspan="2">No</th>
                        <th rowspan="2">Line</th>
                        <th rowspan="2">Pos</th>
                        <th rowspan="2">Petugas</th>
                        <th :colspan="containerDate.length">{{ yearMonth }}</th>
                    </tr>
                    <tr>
                        <th v-for="date in containerDate" :key="date">{{ date }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(observation, i) in schedules" :key="observation.pos_id">
                        <td>{{ i + 1 }}</td>
                        <td>{{ observation.line_snm }}</td>
                        <td>{{ observation.pos_nm }}</td>
                        <td>{{ observation.checkers[0] }}</td>
                        <td v-for="item in containerDate" :key="item">
                            
                            <CButton 
                                v-c-tooltip="`<table class='table table-bordered text-light'>
                                    <tr>
                                        <th>SOP No.</th>
                                        <td>${observation.children.find(child => child.idxdate == String(item)).job_no}</td>
                                    </tr>
                                    <tr>
                                        <th>Member</th>
                                        <td>${observation.children.find(child => child.idxdate == String(item)).member_nm}</td>
                                    </tr>
                                </table>`"
                                html="true"
                                :color="`${observation.children.find(child => child.idxdate == String(item)).job_type_color}`"
                                variant="outline"
                                :class="`btn`" 
                                v-if="observation.children.find(child => child.idxdate == String(item))" 
                                @click="() => detailSchedule(observation.children.find(child => child.idxdate == String(item)))">
                                <CIcon
                                 v-if="observation.children.find(child => child.idxdate == String(item)).actual_check_dt"
                                 icon="cil-check-circle" 
                                 class="text-success"
                                 size="lg"
                                />
                                <CIcon
                                 v-else-if="observation.children.find(child => child.idxdate == String(item)).idxdate < currentDate"
                                 icon="cil-circle" 
                                 class="text-dark"
                                 size="lg"
                                />
                                <CIcon
                                 v-else
                                 icon="cil-circle" 
                                 class="text-danger"
                                 size="lg"
                                />
                            </CButton>
                            <CButton 
                                class="btn"
                                v-else>
                                -
                            </CButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </CCardBody>
    </CCard>
</template>

<script>
import ApiService from '@/store/api.service';
    export default {
        name: 'TableSchedule',
        data() {
            return {
                containerDate: [],
                schedules: [],
                idxMonth: ['01','02','03','04','05','06','07', '08', '09', '10', '11', '12'],
                monthStr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
                yearMonth: '',
                currentDate: `${new Date().getDate()}`
            }
        },
        watch: {
            selectedLine: function() {
                if(this.selectedLine != "0") this.getObsSchedule()
            },
            selectedMonth: function() {
                if(this.selectedMonth) {
                    let idx = this.idxMonth.indexOf(this.selectedMonth.split('-')[1])
                    this.yearMonth = `${this.monthStr[idx]} ${this.selectedMonth.split('-')[0]}`
                    this.getObsSchedule()
                }
            }

        },
        props: {
            selectedLine: String,
            selectedMonth: String
        },
        methods: {
            generateDate() {
                for (let i = 1; i <= 31; i++) {
                    const date = i;
                    this.containerDate.push(date)
                }
            },
            async getObsSchedule() {
                let objQuery = {
                    month: this.selectedMonth.split('-')[1], 
                    year: this.selectedMonth.split('-')[0]
                }
                if(this.selectedLine != "0") objQuery.line = this.selectedLine
                ApiService.setHeader()
                const schedulesData = await ApiService.query('operational/observation/schedule', objQuery)
                this.schedules = schedulesData.data.data
                this.generateDate(schedulesData.data.data[0])
            },
            detailSchedule(obser) {
                console.log(obser.observation_id);
                this.$router.push(`/observation/${obser.observation_id}`)
            }
        },
        mounted() {
            // this.generateDate()
        }
    }
</script>