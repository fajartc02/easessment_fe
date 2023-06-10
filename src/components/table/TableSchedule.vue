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
                        <th v-for="(date) in containerDate" :key="date" :class="date.bg">{{ date.idx }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(observation, i) in schedules" :key="observation.pos_id">
                        <td>{{ i + 1 }}</td>
                        <td>{{ observation.line_snm }}</td>
                        <td>{{ observation.pos_nm }}</td>
                        <td>{{ observation.checkers[0] }}</td>
                        <td v-for="(item) in containerDate" :key="item.idx" style="min-width: 63px;">
                            <!-- {{ observation.children }} -->
                            <template v-for="child in observation.children" :key="child.observation_id">
                                <template v-if="child.idxdate === String(item.idx)">
                                    <CButton 
                                        v-c-tooltip="`<table class='table table-bordered text-light'>
                                            <tr>
                                                <th>SOP No.</th>
                                                <td>${child.job_no}</td>
                                            </tr>
                                            <tr>
                                                <th>Member</th>
                                                <td>${child.member_nm}</td>
                                            </tr>
                                        </table>`"
                                        html="true"
                                        :color="`${child.job_type_color}`"
                                        variant="outline"
                                        v-if="child" 
                                        @click="() => detailSchedule(child)">
                                        <CIcon
                                            v-if="child.actual_check_dt"
                                            icon="cil-check-circle" 
                                            class="text-success"
                                            size="lg"
                                        />
                                        <CIcon
                                            v-else-if="+child.idxdate > +currentDate"
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
                                </template>
                            </template>
                            
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>CH</td>
                        <td>Pos 2</td>
                        <td>Winarno</td>
                        <td v-for="date in containerDate" :key="date">
                            <CButton v-if="date.idx == 5" color="info" variant="outline">
                                <CIcon icon="cil-check-circle" size="lg" class="text-success"/>
                            </CButton>
                            <!-- <small v-if="date.idx == 4">0174</small> -->
                            <CButton v-if="date.idx == 19" color="info" variant="outline">
                                <CIcon icon="cil-circle" class="text-dark" size="lg"/>
                            </CButton>
                            <!-- <small v-if="date.idx == 19">0196</small> -->
                            <CButton v-if="date.idx == 25" color="info" variant="outline">
                                <CIcon icon="cil-circle" class="text-dark" size="lg"/>
                            </CButton>
                        </td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>CH</td>
                        <td>Pos 3</td>
                        <td>Sulaeman</td>
                        <td v-for="date in containerDate" :key="date">
                            <CButton v-if="date.idx == 2" color="info" variant="outline">
                                <CIcon icon="cil-check-circle" size="lg" class="text-success"/>
                            </CButton>
                            <!-- <small v-if="date.idx == 4">0174</small> -->
                            <CButton v-if="date.idx == 13" color="info" variant="outline">
                                <CIcon icon="cil-circle" class="text-dark" size="lg"/>
                            </CButton>
                            <!-- <small v-if="date.idx == 19">0196</small> -->
                            <CButton v-if="date.idx == 25" color="info" variant="outline">
                                <CIcon icon="cil-circle" class="text-dark" size="lg"/>
                            </CButton>
                        </td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>CH</td>
                        <td>Pos 4</td>
                        <td>Winarno</td>
                        <td v-for="date in containerDate" :key="date">
                            <CButton v-if="date.idx == 6" color="info" variant="outline">
                                <CIcon icon="cil-check-circle" size="lg" class="text-success"/>
                            </CButton>
                            <!-- <small v-if="date.idx == 4">0174</small> -->
                            <CButton v-if="date.idx == 14" color="info" variant="outline">
                                <CIcon icon="cil-circle" class="text-dark" size="lg"/>
                            </CButton>
                            <!-- <small v-if="date.idx == 19">0196</small> -->
                            <CButton v-if="date.idx == 27" color="info" variant="outline">
                                <CIcon icon="cil-circle" class="text-dark" size="lg"/>
                            </CButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </CCardBody>
    </CCard>
</template>

<script>
// import moment from 'moment'
import ApiService from '@/store/api.service';
    export default {
        name: 'TableSchedule',
        data() {
            return {
                // containerDate: ['01','02','03','04','05','06','07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
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
                    this.generateDate()
                    let idx = this.idxMonth.indexOf(this.selectedMonth.split('-')[1])
                    this.yearMonth = `${this.monthStr[idx]} ${this.selectedMonth.split('-')[0]}`
                    this.getObsSchedule()
                }
            },
            // containerDate: function() {
            //     console.log(this.containerDate);
            // }
        },
        props: {
            selectedLine: String,
            selectedMonth: String
        },
        methods: {
            generateDate() {
                let year = new Date(this.selectedMonth).getFullYear()
                let month = new Date(this.selectedMonth).getMonth() + 1
                var lastDay = new Date(year, month, 0);
                let container = []
                for (let i = 1; i <= lastDay.getDate(); i++) {
                    // const date = i;
                    let setDt = new Date().setDate(i)
                    let newDate = new Date(setDt)
                    container.push(newDate.getDate())
                    let dateObj = {
                        bg: ``,
                        date:newDate,
                        idx: `${i}`
                    }
                    if(dateObj.date.getDay() === 0 || dateObj.date.getDay() === 6) dateObj.bg = `bg-secondary`
                    // console.log(dateObj);
                    // console.log(i);
                    this.containerDate.push(dateObj)
                }
                // console.log(container);
                // this.containerDate = container
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
            },
            detailSchedule(obser) {
                console.log(obser.observation_id);
                this.$router.push(`/observation/${obser.observation_id}`)
            }
        },
        mounted() {
        }
    }
</script>