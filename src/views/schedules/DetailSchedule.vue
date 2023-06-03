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
        </div>
    </div>
    <div class="card mt-1">
        <div class="card-body">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam optio vero eius veritatis id error itaque numquam praesentium similique, esse corporis? Cupiditate voluptate cumque, quam dignissimos magni delectus dolorem natus!
        </div>
    </div>
</template>

<script>
import ApiService from '@/store/api.service';
export default {
    name: 'DetailSchedule',
    data() {
        return {
            observation: null
        }
    },
    methods: {
        async getDetail() {
            ApiService.setHeader()
            const detailObser = await ApiService.get(`operational/observation/schedule`, this.$route.params.id)
            console.log(detailObser);
            this.observation = detailObser.data.data[0]
        }
    },
    mounted() {
        console.log(this.$route.params.id);
        this.getDetail() 
    }
}
</script>