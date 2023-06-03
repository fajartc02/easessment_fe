<template>
    <div class="card">
        <div class="card-body" v-if="observation">
            <CInputGroup class="mb-3">
                <CInputGroupText>Line</CInputGroupText>
                <CFormInput :value="observation.line_nm" disabled/>
            </CInputGroup>
            <CInputGroup class="mb-3">
                <CInputGroupText>Machine</CInputGroupText>
                <CFormInput :value="observation.machine_nm" disabled/>
            </CInputGroup>
            <CInputGroup class="mb-3">
                <CInputGroupText>Job No.</CInputGroupText>
                <CFormInput :value="observation.job_no" disabled/>
            </CInputGroup>
            <CInputGroup class="mb-3">
                <CInputGroupText>Job name</CInputGroupText>
                <CFormInput :value="observation.job_nm" disabled/>
            </CInputGroup>
            <CInputGroup class="mb-3">
                <CInputGroupText>Job Type</CInputGroupText>
                <CFormInput :value="observation.job_type_nm" disabled/>
            </CInputGroup>
            <CInputGroup class="mb-3">
                <CInputGroupText>Member</CInputGroupText>
                <CFormInput :value="observation.member_nm" disabled/>
            </CInputGroup>
            <CInputGroup class="mb-3">
                <CInputGroupText>Plan Date</CInputGroupText>
                <CFormInput :value="observation.plan_check_dt.split('T')[0]" disabled/>
            </CInputGroup>
        </div>
    </div>
    <div class="card mt-1">
        <div class="card-header">
            <b>Data Observasi</b>
        </div>
        <div class="card-body overflow-auto">
            <CInputGroup class="mb-3">
                <CInputGroupText>Actual Date</CInputGroupText>
                <input class="form-control" type="date" v-model="form.actual_check_dt"/>
            </CInputGroup>
            <table class="table table-bordered">
                <tr>
                    <th>No</th>
                    <th>Cateogry</th>
                    <th>Judgment</th>
                    <th>Factor</th>
                    <th>Findings</th>
                </tr>
                <tr v-for="(item, i) in categories" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.category_nm }}</td>
                    <td>
                        <CFormSelect v-model="item.judg">
                            <option>Select Judgment</option>
                            <option v-for="judg in judgments" :key="judg.id">{{ judg.text }}</option>
                        </CFormSelect>
                    </td>
                    <td v-if="item.judg == 'Finding' && item.judg">
                        <CFormSelect v-model="item.factor">
                            <option>Select Factor</option>
                            <option v-for="factor in factors" :key="factor.text">{{ factor.text }}</option>
                        </CFormSelect>
                    </td>
                    <td v-else></td>
                    <td v-if="item.judg == 'Finding' && item.judg"><textarea v-model="item.findings" class="w-100"></textarea></td>
                    <td v-else></td>
                </tr>
            </table>
            <button class="btn btn-primary">Submit</button>
        </div>
    </div>
</template>

<script>
import ApiService from '@/store/api.service';
import moment from 'moment'
export default {
    name: 'DetailSchedule',
    data() {
        return {
            observation: null,
            form: {
                actual_check_dt: moment(new Date()).toISOString().split('T')[0]
            },
            categories: [],
            judgments: [{
                id: 1,
                text: 'OK'
            },{
                id: 2,
                text: 'Finding'
            }],
            factors: [{
                id: 1,
                text: 'Man'
            },{
                id: 2,
                text: 'Machine'
            },{
                id: 3,
                text: 'Material'
            },{
                id: 4,
                text: 'Methode'
            },{
                id: 5,
                text: 'Environtment'
            }]
        }
    },
    methods: {
        async getDetail() {
            ApiService.setHeader()
            const detailObser = await ApiService.get(`operational/observation/schedule`, this.$route.params.id)
            this.observation = detailObser.data.data[0]
        },
        async getCategories() {
            ApiService.setHeader()
            const categories = await ApiService.get(`master/categories`)
            const mapCategory = categories.data.data.map(itm => {
                itm.judg = null
                itm.factor = null
                itm.findings = null
                return itm
            })
            this.categories = mapCategory
        }
    },
    async mounted() {
        console.log(this.$route.params.id);
        await this.getDetail()
        await this.getCategories() 
    }
}
</script>