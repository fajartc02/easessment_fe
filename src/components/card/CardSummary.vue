<template>
    <CCard class="mb-4">
        <CCardHeader>
          <strong>Summary</strong>
        </CCardHeader>
        <CCardBody class="overflow-auto" v-if="summaryData">
            <CRow>
                <!-- <CCol>
                    <CCard class="mb-4">
                        <CCardHeader>
                        <strong>Delay</strong>
                        </CCardHeader>
                        <CCardBody class="overflow-auto">
                            <h1 class="text-danger">{{summaryData.delay}}</h1>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard class="mb-4">
                        <CCardHeader>
                        <strong>Done</strong>
                        </CCardHeader>
                        <CCardBody class="overflow-auto">
                            <h1 class="text-success">{{summaryData.done}}</h1>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard class="mb-4">
                        <CCardHeader>
                        <strong>Total</strong>
                        </CCardHeader>
                        <CCardBody class="overflow-auto">
                            <h1>{{summaryData.done}}/{{summaryData.total}}</h1>
                        </CCardBody>
                    </CCard>
                </CCol> -->
                <CCol>
                    <CCard class="mb-4">
                        <CCardHeader>
                        <strong>Delay</strong>
                        </CCardHeader>
                        <CCardBody class="overflow-auto">
                            <h1 class="text-danger">0</h1>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard class="mb-4">
                        <CCardHeader>
                        <strong>Done</strong>
                        </CCardHeader>
                        <CCardBody class="overflow-auto">
                            <h1 class="text-success">4</h1>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard class="mb-4">
                        <CCardHeader>
                        <strong>Total</strong>
                        </CCardHeader>
                        <CCardBody class="overflow-auto">
                            <h1>4/14</h1>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CCardBody>
    </CCard>
</template>

<script>
import ApiService from '@/store/api.service';
import moment from 'moment';


    export default {
        name: 'CardSummary',
        data() {
            return {
                summaryData: null,
                form: {
                    month: null,
                    year: null,
                    line_id: null,
                    currentDate: moment().toISOString().split('.')[0].split('T').join(" ")
                }
            }
        },
        props: {
            selectedLine: String,
            selectedMonth: String
        },

        watch: {
            selectedMonth: function () {
                let getMonth = new Date(this.selectedMonth).getMonth() + 1
                let year = new Date(this.selectedMonth).getFullYear()
                this.form.month = getMonth
                this.form.year = year
                this.getSummary()
            },
            selectedLine: function() {
                this.form.line_id = this.selectedLine
                this.getSummary()
            }
        },  
        methods: {
            async getSummary() {
                ApiService.setHeader()
                const summaryData = await ApiService.query('operational/observation/summary', this.form)
                console.log(summaryData);
                this.summaryData = summaryData.data.data
            }
        },
        
    }
</script>

<style scoped>

</style>