<template>
    <CCard class="mb-4">
        <CCardHeader>
          <strong>Monthly Schedule</strong>
        </CCardHeader>
        <CModal size="lg" :visible="lgDemo" @close="() => { lgDemo = false }">
            <CModalHeader>
                <CModalTitle>Pengecekan Observasi</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CInputGroup class="mb-3">
                    <CInputGroupText class="px-4">Nama Observer</CInputGroupText>
                    <CFormInput disabled id="basic-url" aria-describedby="basic-addon3" value="Agus S"/>
                </CInputGroup>
                <CInputGroup class="mb-3">
                    <CInputGroupText class="px-4">Nama Member</CInputGroupText>
                    <CFormInput disabled id="basic-url" aria-describedby="basic-addon3" value="Akmal"/>
                </CInputGroup>
                <CInputGroup class="mb-3">
                    <CInputGroupText class="px-4">Line</CInputGroupText>
                    <CFormInput disabled id="basic-url" aria-describedby="basic-addon3" value="Cylinder Head"/>
                </CInputGroup>
                <CInputGroup class="mb-3">
                    <CInputGroupText class="px-4">Pos</CInputGroupText>
                    <CFormInput disabled id="basic-url" aria-describedby="basic-addon3" value="Pos 1"/>
                </CInputGroup>
                <CInputGroup class="mb-3">
                    <CInputGroupText class="px-4">Process</CInputGroupText>
                    <CFormInput disabled id="basic-url" aria-describedby="basic-addon3" value="No Process 0154-Mengambil Work di shutter"/>
                </CInputGroup>
                <CModalFooter>
                <CButton color="primary" class="p-1" @click="() => { lgDemoImg = true }">
                    Lihat Report
                </CButton>
                <CButton disabled color="success" class="p-1">
                    Simpan
                </CButton>
                </CModalFooter>
            </CModalBody>
        </CModal>
        <CModal size="lg" :visible="lgDemoImg" @close="() => { lgDemoImg = false }">
            <CModalHeader>
                <CModalTitle>Report Observasi</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <img src="@/assets/images/2.png" style="width: 100%" alt="">
            </CModalBody>
        </CModal>
        <CCardBody class="overflow-auto">
            <table class="table table-bordered text-center">
                <thead>
                    <tr>
                        <th rowspan="2">No</th>
                        <th rowspan="2">Line</th>
                        <th rowspan="2">Pos</th>
                        <th rowspan="2">Petugas</th>
                        <th :colspan="containerDate.length">Mei 2023</th>
                    </tr>
                    <tr>
                        <th v-for="date in containerDate" :key="date">{{ date }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>CH</td>
                        <td>Pos 1</td>
                        <td>Agus S</td>
                        <td v-for="date in containerDate" :key="date">
                            <CButton :html="true" :appendToBody="true" v-c-tooltip="'Observasi: Type 1, proses: 0154'" v-if="date == 2" color="success" class="p-1" @click="() => { lgDemo = true }">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 2">0154</small>
                            <CButton v-c-tooltip="'Observasi: Type 1, proses: 0155'" v-if="date == 18" color="success" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 18">0155</small>
                            <CButton v-if="date == 30" color="primary" class="p-1">
                                <CIcon icon="cil-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 30">0155</small>
                            <!-- <CButton v-else-if="date > 27 && date < 29" color="danger" class="p-1">
                                <CIcon icon="cil-x-circle" size="sm"/>
                            </CButton>
                            <CButton v-else color="info" class="p-1">
                                <CIcon icon="cil-circle" size="sm"/>
                            </CButton> -->
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>CH</td>
                        <td>Pos 2</td>
                        <td>Winarno</td>
                        <td v-for="date in containerDate" :key="date">
                            <CButton v-if="date == 4" color="success" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 4">0174</small>
                            <CButton v-if="date == 19" color="success" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 19">0196</small>
                            <CButton v-if="date == 25" color="primary" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 25">0026</small>
                            <!-- <CButton v-if="date <= 27" color="success" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <CButton v-else-if="date > 27 && date < 29" color="danger" class="p-1">
                                <CIcon icon="cil-x-circle" size="sm"/>
                            </CButton>
                            <CButton v-else color="info" class="p-1">
                                <CIcon icon="cil-circle" size="sm"/>
                            </CButton> -->
                        </td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>CH</td>
                        <td>Pos 3</td>
                        <td>Agus S</td>
                        <td v-for="date in containerDate" :key="date">
                            <CButton v-if="date == 10" color="success" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 10">0177</small>
                            <CButton v-if="date == 15" color="primary" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 15">0196</small>
                            <CButton v-if="date == 25" color="success" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 25">0026</small>
                        </td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>CH</td>
                        <td>Pos 4</td>
                        <td>Winarno</td>
                        <td v-for="date in containerDate" :key="date">
                            <CButton v-if="date == 8" color="success" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 8">0190</small>
                            <CButton v-if="date == 18" color="success" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 18">0116</small>
                            <CButton v-if="date == 22" color="primary" class="p-1">
                                <CIcon icon="cil-check-circle" size="sm"/>
                            </CButton>
                            <small v-if="date == 22">0126</small>
                        </td>
                    </tr>
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
                lgDemo: false,
                lgDemoImg: false
            }
        },
        methods: {
            generateDate() {
                for (let i = 1; i <= 31; i++) {
                    const date = i;
                    this.containerDate.push(date)
                }
            },
            redirectLinkTemp() {
                window.location.href = "https://forms.office.com/Pages/ResponsePage.aspx?id=a7HHR4LUR0GyGgSTbdiYdcuI36EV_z5Mu9IEROZH0UZUOUNNUDBIQTNDQVBVUDMyMTNNQ0VPRTRHNC4u&origin=QRCode"
            }
        },
        mounted() {
            this.generateDate()
        }
    }
</script>