<template>
    <CCard class="mb-4">
        <CCardHeader>
          <strong>Monthly Schedule</strong>
        </CCardHeader>
        <CCardBody class="overflow-auto">
            <div class="row">
                <div class="col-5">
                    <CInputGroup class="mb-3">
                        <CInputGroupText>Line</CInputGroupText>
                        <CFormInput class="w-100" aria-label="Amount (to the nearest dollar)" />
                    </CInputGroup>
                </div>
                <div class="col-5">
                    <CInputGroup class="mb-3">
                        <CInputGroupText>Month</CInputGroupText>
                        <input v-model="monthSelected" class="form-control w-100" type="month">
                    </CInputGroup>
                </div>
                <div class="col-2">
                    <button class="btn btn-primary w-100">Search</button>
                </div>
            </div>
            <table class="table table-bordered text-center">
                <thead>
                    <tr>
                        <th rowspan="2">No</th>
                        <th rowspan="2">Pos</th>
                        <th rowspan="2">Petugas</th>
                        <th :colspan="containerDate.length">Mei 2023</th>
                    </tr>
                    <tr>
                        <th v-for="date in containerDate" :key="date">{{ date }}</th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </CCardBody>
    </CCard>
</template>

<script>
    export default {
        name: 'TableSchedule',
        data() {
            return {
                containerDate: [],
                monthSelected: new Date()
            }
        },
        methods: {
            generateDate() {
                // for (let i = 1; i <= 31; i++) {
                //     const date = i;
                //     this.containerDate.push(date)
                // }
            },
        },
        mounted() {
            this.generateDate()
        }
    }
</script>