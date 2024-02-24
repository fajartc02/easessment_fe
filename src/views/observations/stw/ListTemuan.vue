<template>
  <div>
    <div class="card mb-3">
      <div class="card-header">
        <div class="row">
          <div class="col">
            <label>Start date</label>
            <input type="date" class="form-control" v-model="selectedFilterStartDate" @change="addFilter()" />
          </div>
          <div class="col">
            <label>End date</label>
            <input type="date" class="form-control" v-model="selectedFilterEndDate" @change="addFilter()" />
          </div>
          <div class="col">
            <label>Line</label>
            <select class="form-select" v-model="selectedLine" @change="addFilter()">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Category</label>
            <select class="form-select" @change="addFilter()" v-model="selectedFilterSourceCat">
              <option value="-1" selected>All</option>
              <option value="H">Henkaten</option>
              <option value="MV">Member Voice</option>
              <option value="Obs">Observation</option>
              <option value="FT">Focus theme</option>
            </select>
          </div>
          <div class="col">
            <label>Status</label>
            <select class="form-select" @change="addFilter()" v-model="selectedFilterJudge">
              <option value="-1" selected>All</option>
              <option value="true">Sudah</option>
              <option value="false">Belum</option>
            </select>
          </div>
        </div>
      </div>
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>List temuan</h5>
        <div class="d-flex align-items-center">
          <div class="mx-2 d-flex align-items-center">
            <div class="d-flex align-items-center">
              <div style="background-color: #fee2e2; width: 20px; height: 20px"></div>
              <span class="mx-2">Delay</span>
            </div>
            <div class="d-flex align-items-center">
              <div style="background-color: #dcfce7; width: 20px; height: 20px"></div>
              <span class="mx-2">Closed</span>
            </div>
            <div class="d-flex align-items-center">
              <div style="
                  background-color: #fff;
                  border: 1px solid #eaeaea;
                  width: 20px;
                  height: 20px;
                "></div>
              <span class="mx-2">On progress</span>
            </div>
          </div>
          <div>
            <span class="badge bg-info"> P1: Safety & Quality Issue </span>
            <span class="badge bg-info mx-2"> P2: Productivity Issue </span>
            <span class="badge bg-info"> P3: Cost Issue </span>
          </div>
        </div>
      </div>
      <div style="
          width: 100%;
          display: block;
          overflow-x: auto;
          white-space: nowrap;
        ">
        <table style="border: 1px solid black; width: 100%" class="text-center">
          <thead class="text-center">
            <tr>
              <th rowspan="3">No</th>
              <th rowspan="3" width="120">Line name</th>
              <th rowspan="3">Source cat</th>
              <th rowspan="3" width="120">Tanggal</th>
              <th rowspan="3" width="180">Pos</th>
              <th rowspan="3" width="120">Temuan prob</th>
              <th rowspan="3" width="120">Rencana perbaikan</th>
              <th rowspan="3">priority</th>
              <th>Stop 6</th>
              <th>Rank WRAS</th>
              <th colspan="3">3 slip</th>
              <th rowspan="2">PCI/ECI</th>
              <th rowspan="2">MT/KZ/ENG</th>
              <th rowspan="3">Schedule PIC</th>
              <th rowspan="2" colspan="4">March</th>
              <th rowspan="2" colspan="4">Apr</th>
              <th rowspan="2" colspan="4">May</th>
              <th rowspan="2" colspan="4">June</th>
              <th rowspan="2" colspan="4">July</th>
              <th rowspan="2" colspan="4">Aug</th>
              <th rowspan="2" colspan="4">Sept</th>
              <th rowspan="3">Actions</th>
            </tr>
            <tr>
              <th colspan="2" rowspan="2">Safety</th>
              <th colspan="">SOP</th>
              <th colspan="">TSKK</th>
              <th colspan="">TSK</th>
            </tr>
            <tr>
              <th>Method</th>
              <th colspan="2">Man</th>
              <th>Material</th>
              <th>Machine</th>
              <th width="100">I</th>
              <th width="100">II</th>
              <th width="100">III</th>
              <th class="week">IV</th>
              <th class="week">I</th>
              <th class="week">II</th>
              <th class="week">III</th>
              <th class="week">IV</th>
              <th class="week">I</th>
              <th class="week">II</th>
              <th class="week">III</th>
              <th class="week">IV</th>
              <th class="week">I</th>
              <th class="week">II</th>
              <th class="week">III</th>
              <th class="week">IV</th>
              <th class="week">I</th>
              <th class="week">II</th>
              <th class="week">III</th>
              <th class="week">IV</th>
              <th class="week">I</th>
              <th class="week">II</th>
              <th class="week">III</th>
              <th class="week">IV</th>
              <th class="week">I</th>
              <th class="week">II</th>
              <th class="week">III</th>
              <th class="week">IV</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="50" class="p-0" style="height: 200px">
                <div class="vl-parent p-0" style="height: 100%">
                  <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
                </div>
              </td>
            </tr>
            <tr v-else v-for="(finding, findingIndex) in getFindings" :key="finding.no" :style="`${this.todayDate > formatTheDate(finding.cm_str_plan_date) &&
              finding.cm_judg == false
              ? 'background-color: #fee2e2'
              : ''
              }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ${finding.cm_judg == true ? 'background-color: #f0fdf4' : ''}  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ${finding.cm_judg == false &&
                this.todayDate < formatTheDate(finding.cm_str_plan_date)
                ? 'background-color: #fff'
                : ''
              } 
              `">
              <th>{{ findingIndex + 1 }}</th>
              <td class="px-2">{{ finding.line_nm }}</td>
              <td class="px-2">{{ finding.source_category }}</td>
              <td class="px-2">{{ formatTheDate(finding.finding_date) }}</td>
              <td class="px-2">{{ finding.finding_location }}</td>
              <td class="px-2">{{ finding.finding_desc }}</td>
              <td class="px-2">
                {{ formatTheDate(finding.cm_str_plan_date) }}
              </td>
              <td class="px-2">{{ finding.cm_priority }}</td>
              <td colspan="2">
                {{ finding.factor_nm == 'Safety' ? 'v' : ' ' }}
              </td>
              <td>{{ finding.factor_nm == 'Method' ? 'v' : ' ' }}</td>
              <td colspan="2">
                {{ finding.factor_nm == 'Man' ? 'v' : ' ' }}
              </td>
              <td>{{ finding.factor_nm == 'Material' ? 'v' : ' ' }}</td>
              <td>{{ finding.factor_nm == 'Machine' ? 'v' : ' ' }}</td>
              <td>{{ finding.cm_pic_nm }}</td>
              <td v-for="n in num" :key="n" style="min-width: 30px !important; padding: 5px">
                <div v-if="(n >= finding.w_str_plan_date) &
                  (n <= finding.w_end_plan_date)
                  " style="
                    width: 100%;
                    height: 20px;
                    border-radius: 4px;
                    background-color: coral;
                  "></div>
              </td>
              <td class="px-1">
                <div class="px-2 d-flex">
                  <button class="btn btn-info btn-sm text-white w-full my-1" style="margin-right: 10px" @click="() => {
                    getDetailTemuan(findingIndex)
                    detailTemuanModal = true
                  }
                    ">
                    Detail
                  </button>
                  <button @click="() => {
                    getDetailTemuan(findingIndex)
                    editTemuanModal = true
                  }
                    " class="btn btn-info btn-sm text-white w-full my-1">
                    Edit
                  </button>
                  <button @click="deleteFinding()" class="btn btn-danger mx-2 btn-sm text-white w-full my-1">
                    Delete
                  </button>
                  <button :disabled="finding.file_pinksheet == null" @click="downloadPinkSheet(finding.file_pinksheet)"
                    class="btn btn-info btn-sm text-white w-full my-1">
                    Download
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="getFindings?.length < 1">
              <td colspan="50">
                <h3 class="my-2">Data kosong</h3>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- pagination -->
      <Pagination :totalPages="10" :perPage="10" :currentPage="currentPage" @changePage="onPageChange"
        @changeLimit="onPageChangeLimit" />
    </div>

    <!-- modals -->
    <!-- modal detail -->
    <CModal backdrop="static" alignment="center" :visible="detailTemuanModal" @close="detailTemuanModal = false" size="lg"
      scrollable>
      <CModalHeader>
        <CModalTitle>Detail temuan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-2">
          <label class="mb-1">Line</label>
          <input type="text" class="form-control" :value="findingDetail?.line_nm" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">Source cat</label>
          <input type="text" class="form-control" :value="findingDetail?.source_category" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">Tanggal temuan</label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.finding_date)" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">Pos</label>
          <input type="text" class="form-control" :value="findingDetail?.finding_location" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">Finding description / problem</label>
          <textarea cols="30" rows="5" class="form-control" :value="findingDetail?.finding_desc" disabled></textarea>
        </div>
        <div class="mb-2">
          <label class="mb-1">Rencana perbaikan</label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_str_plan_date)" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">Priority</label>
          <select class="form-select" :value="findingDetail?.cm_priority" disabled>
            <option selected>Select priority</option>
            <option value="P1">P1: Safety and Quality Issue</option>
            <option value="P2">P2: Productivity Issue</option>
            <option value="P3">P3: Cost Issue</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="mb-1">PIC </label>
          <input type="text" class="form-control" :value="findingDetail?.cm_pic_nm" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM description</label>
          <textarea cols="30" rows="5" class="form-control" :value="findingDetail?.cm_desc" disabled></textarea>
        </div>

        <div class="mb-2">
          <label class="mb-1">CM Start Plan Date </label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_str_plan_date)" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM End Plan Date </label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_end_plan_date)" disabled />
        </div>

        <hr />

        <div class="mb-2">
          <label class="mb-1">CM Start actual date</label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_str_act_date)" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM End actual date</label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_end_act_date)" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Training date</label>
          <input type="date" class="form-control" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Judge</label>
          <select class="form-select" :value="findingDetail?.cm_judg" disabled>
            <option value="true">Sudah</option>
            <option value="false">Belum</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Sign LH Red</label>
          <input type="file" class="form-control" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Sign LH White</label>
          <input type="file" class="form-control" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Sign SH</label>
          <input type="file" class="form-control" disabled />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Comments</label>
          <input type="text" class="form-control" disabled />
        </div>
      </CModalBody>
      <CModalFooter>
        <router-link v-if="findingDetail?.observation_id !== null" :to="`/observation/${findingDetail?.observation_id}`">
          <CButton color="primary" class="text-white"> More details </CButton>
        </router-link>

        <CButton color="secondary" class="text-white" @click="detailTemuanModal = false">
          Close
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- modal edit -->
    <CModal backdrop="static" alignment="center" :visible="editTemuanModal" @close="editTemuanModal = false" size="lg"
      scrollable>
      <CModalHeader>
        <CModalTitle>Edit temuan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-2">
          <label class="mb-1">Line</label>
          <input type="text" class="form-control" :value="findingDetail?.line_nm" />
        </div>
        <div class="mb-2">
          <label class="mb-1">Source cat</label>
          <input type="text" class="form-control" :value="findingDetail?.source_category" />
        </div>
        <div class="mb-2">
          <label class="mb-1">Tanggal temuan</label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.finding_date)" />
        </div>
        <div class="mb-2">
          <label class="mb-1">Pos</label>
          <input type="text" class="form-control" :value="findingDetail?.finding_location" />
        </div>
        <div class="mb-2">
          <label class="mb-1">Finding description / problem</label>
          <textarea cols="30" rows="5" class="form-control" :value="findingDetail?.finding_desc"></textarea>
        </div>
        <div class="mb-2">
          <label class="mb-1">Rencana perbaikan</label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_str_plan_date)" />
        </div>
        <div class="mb-2">
          <label class="mb-1">Priority</label>
          <select class="form-select" :value="findingDetail?.cm_priority">
            <option selected>Select priority</option>
            <option value="P1">P1: Safety and Quality Issue</option>
            <option value="P2">P2: Productivity Issue</option>
            <option value="P3">P3: Cost Issue</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="mb-1">PIC </label>
          <input type="text" class="form-control" :value="findingDetail?.cm_pic_nm" disabled />
          <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions">
          </VueMultiselect>
        </div>
        <div class="mb-2">
          <label class="mb-1">CM description</label>
          <textarea cols="30" rows="5" class="form-control" :value="findingDetail?.cm_desc"></textarea>
        </div>

        <div class="mb-2">
          <label class="mb-1">CM Start Plan Date </label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_str_plan_date)" />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM End Plan Date </label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_end_plan_date)" />
        </div>

        <hr />

        <div class="mb-2">
          <label class="mb-1">CM Start actual date</label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_str_act_date)" />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM End actual date</label>
          <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_end_act_date)" />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Training date</label>
          <input type="date" class="form-control" />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Judge</label>
          <select class="form-select" :value="findingDetail?.cm_judg">
            <option value="true">Sudah</option>
            <option value="false">Belum</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Sign LH Red</label>
          <br />
          <button class="btn btn-info my-2 btn-sm text-white" @click="() => {
            showSignLhRed = true
            showSignLhWhite = false
            showSignSH = false
          }">Add signature</button>

          <div v-if="showSignLhRed" id="sign-wrapper" style="width: 100%; height: 100px; border: 1px solid #eaeaea;">
            <vueSignature ref="cm_sign_lh_red" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-2 btn-sm text-white" @click="saveSignature('cm_sign_lh_red')">Save</button>
            <button class="btn btn-info btn-sm mx-2 my-2 text-white"
              @click="clearSignature('cm_sign_lh_red')">Clear</button>
          </div>
        </div>

        <div class="mb-2 my-5">
          <label class="mb-1">CM Sign LH White</label>
          <br />
          <button class="btn btn-info my-2 btn-sm text-white" @click="() => {
            showSignLhRed = false
            showSignLhWhite = true
            showSignSH = false
          }">Add signature</button>

          <div v-if="showSignLhWhite" id="sign-wrapper-2" style="width: 100%; height: 100px; border: 1px solid #eaeaea;">
            <vueSignature ref="cm_sign_lh_white" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-2 btn-sm text-white" @click="saveSignature('cm_sign_lh_white')">Save</button>
            <button class="btn btn-info btn-sm mx-2 my-2 text-white"
              @click="clearSignature('cm_sign_lh_white')">Clear</button>
          </div>
        </div>

        <div class="mb-2 my-5">
          <label class="mb-1">CM Sign SH</label>
          <br />
          <button class="btn btn-info my-2 btn-sm text-white" @click="() => {
            showSignLhRed = false
            showSignLhWhite = false
            showSignSH = true
          }">Add signature</button>

          <div v-if="showSignSH" id="sign-wrapper-3" style="width: 100%; height: 100px; border: 1px solid #eaeaea;">
            <vueSignature ref="cm_sign_sh" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info btn-sm my-2 text-white" @click="saveSignature('cm_sign_sh')">Save</button>
            <button class="btn btn-info btn-sm my-2 mx-2 text-white" @click="clearSignature('cm_sign_sh')">Clear</button>
          </div>
        </div>
        <div class="mb-2 my-5">
          <label class="mb-1">Upload pink sheet</label>
          <input ref="pink_sheet" type="file" class="form-control" />

          <div v-if="selectedPinkSheet">
            <router-link :to="selectedPinkSheet" target="_blank">
              <button class="btn btn-info btn-sm my-2 text-white">View file</button>
            </router-link>
          </div>
          <div v-else>
            <button class="btn btn-info btn-sm my-2 text-white" @click="uploadPinkSheet('pink_sheet')">Upload pink
              sheet</button>
          </div>
        </div>
        <div class="mb-2">
          <label class="mb-1">CM Comments</label>
          <input type="text" class="form-control" />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="info" class="text-white" @click="editTemuanModal = false">
          Update data
        </CButton>
        <CButton color="secondary" class="text-white" @click="() => {
          selectedFindingIndex = null
          editTemuanModal = false
        }
          ">
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>
    
<script>
import moment from 'moment'
import { GET_USERS } from '@/store/modules/user.module'
import { GET_FINDINGS } from '@/store/modules/finding.module'
import { GET_LINES } from '@/store/modules/line.module'
import { mapGetters } from 'vuex'
import VueMultiselect from 'vue-multiselect'
import Loading from 'vue-loading-overlay'
import ApiService from '@/store/api.service'
import Pagination from '@/components/Pagination.vue'
import Swal from 'sweetalert2'
import vueSignature from "vue-signature";


export default {
  name: 'List Temuan',
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      currentPageLimit: 5,
      num: 28,
      thisYear: '',
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedFilterSourceCat: '-1',
      selectedFilterJudge: '-1',
      selectedLine: '',
      selectedMonth: null,
      findingDetail: null,
      addTemuanModal: false,
      editTemuanModal: false,
      detailTemuanModal: false,
      selectedFindingIndex: null,
      picData: [],
      selectedPIC: null,
      todayDate: '2024-02-16',
      // sign
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)",
      },
      disabled: false,
      dataUrl: "https://avatars2.githubusercontent.com/u/17644818?s=460&v=4",
      selectedPinkSheet: null,
      showSignLhRed: false,
      showSignLhWhite: false,
      showSignSH: false,
      selectedSignature: null,
      selectedFindingID: null
    }
  },
  computed: {
    ...mapGetters(['getUsersOpts', 'getFindings', 'getLinesOpts']),
  },
  methods: {
    saveSignature(from) {
      var signFile;

      switch (from) {
        case 'cm_sign_lh_red':
          signFile = this.$refs[from].save();
          this.selectedSignature = {
            [`finding_id`]: this.selectedFindingID,
            [`${from}`]: signFile
          }
          break;
        case 'cm_sign_lh_white':
          signFile = this.$refs[from].save();
          this.selectedSignature = {
            [`finding_id`]: this.selectedFindingID,
            [`${from}`]: signFile
          }
          break;
        case 'cm_sign_sh':
          signFile = this.$refs[from].save();
          this.selectedSignature = {
            [`finding_id`]: this.selectedFindingID,
            [`${from}`]: signFile
          }
          break;

        default:
          break;
      }

      this.uploadSignature()
    },
    clearSignature(from) {
      var _this = this;

      switch (from) {
        case 'cm_sign_lh_red':
          _this.$refs[from].clear();
          break;
        case 'cm_sign_lh_white':
          _this.$refs[from].clear();
          break;
        case 'cm_sign_sh':
          _this.$refs[from].clear();
          break;

        default:
          break;
      }

    },
    async uploadSignature() {

      ApiService.setHeader()

      const upload = await ApiService.put(`/operational/findingCm/upload-sign`, this.selectedSignature)
      console.log(upload)

    },
    onPageChange(page) {
      if (page == -1) {
        this.currentPage = this.currentPage - 1
        this.getFindingsFunc()
      } else {
        this.currentPage = this.currentPage + 1
        this.getFindingsFunc()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getFindingsFunc()
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getUsers() {
      try {
        this.$store.dispatch(GET_USERS)
        if (this.getUsersOpts) {
          this.mapUsersData()
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getFindingsFunc() {
      let objQuery = {
        start_date:
          this.selectedFilterStartDate !== ''
            ? this.selectedFilterStartDate
            : this.selectedMonth + '-01',
        end_date:
          this.selectedFilterEndDate !== ''
            ? this.selectedFilterEndDate
            : this.selectedMonth + '-29',
        line_id: this.selectedLine,
        source_category: this.selectedFilterSourceCat,
        cm_judg: this.selectedFilterJudge,
        limit: this.currentPageLimit,
        currentPage: this.currentPage,
      }

      this.isLoading = true
      try {
        this.$store.dispatch(GET_FINDINGS, objQuery).then((res) => {
          if (res) {
            this.isLoading = false
          }
        })
      } catch (error) {
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    deleteFinding() {
      Swal.fire({
        title: 'Are you sure to delete this finding?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Data deleted!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Canceled', '', 'info')
        }
      })
    },
    async uploadPinkSheet(state) {
      let findingID = await this.getFindings[this.selectedFindingIndex].finding_id;
      let is_before_path = await this.getFindings[this.selectedFindingIndex].file_pinksheet;
      let before_path;

      if (is_before_path !== null) {
        before_path = null
      } else {
        before_path = is_before_path
      }

      ApiService.setHeader()
      const image = this.$refs[state].files[0]

      const formData = new FormData();
      formData.append('finding_id', findingID);
      formData.append('before_path', before_path);
      formData.append('dest', 'pinkSheet');
      formData.append('attachment', image);

      const uploadImage = await ApiService.post(`/operational/findingCm/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      this.selectedPinkSheet = `${process.env.VUE_APP_URL}/file?path=${uploadImage.data.data}`
    },
    getDetailTemuan(findingIndex) {
      const data = this.getFindings[findingIndex]
      this.selectedFindingID = data.finding_id
      this.selectedFindingIndex = findingIndex
      this.findingDetail = data
      console.log(data)
    },
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push(item.text)
      })
    },
    formatTheDate(val) {
      if (val) {
        const year = val.split('T')[0].split('-')[0]
        const month = val.split('T')[0].split('-')[1]
        const day = val.split('T')[0].split('-')[2]

        return `${year}-${month}-${day}`
      } else {
        return null
      }
    },
    addFilter() {
      this.getFindingsFunc()
    },
    async downloadPinkSheet(filePath) {

      window.location.href = `${process.env.VUE_APP_URL}/file?path=${filePath}`

      // ApiService.setHeader()
      // const fileData = await ApiService.get(`file?path=${filePath}`)
      // console.log(fileData)
    },
  },
  async mounted() {
    // cek kalau ada params di url (dari dashboard)
    if (
      this.$route.query.line_id &&
      this.$route.query.source_category &&
      this.$route.query.cm_judg
    ) {
      this.selectedFilterSourceCat = this.$route.query.source_category
        ? this.$route.query.source_category
        : '-1'
      this.selectedFilterJudge = this.$route.query.cm_judg
        ? this.$route.query.cm_judg
        : '-1'
      this.selectedLine = this.$route.query.line_id
        ? this.$route.query.line_id
        : '-1'
    }

    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]

    this.selectedMonth = `${year}-${month}`
    this.selectedFilterStartDate = `${year}-${month}-01`
    this.selectedFilterEndDate = `${year}-12-31`
    this.selectedLine = localStorage.getItem('line_id')
    await this.getUsers()
    await this.getFindingsFunc()
    await this.getLines()
  },
  components: { VueMultiselect, Loading, Pagination, vueSignature },
}
</script>
  
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.week {
  width: 20px !important;
}
</style>
  
    