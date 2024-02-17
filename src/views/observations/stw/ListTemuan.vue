<template>
  <div>
    <div class="card mb-3">
      <div class="card-header">
        <div class="row">
          <div class="col">
            <label>Start date</label>
            <input
              type="date"
              class="form-control"
              v-model="selectedFilterStartDate"
              @change="addFilter()"
            />
          </div>
          <div class="col">
            <label>End date</label>
            <input
              type="date"
              class="form-control"
              v-model="selectedFilterEndDate"
              @change="addFilter()"
            />
          </div>
          <div class="col">
            <label>Line</label>
            <select
              class="form-select"
              v-model="selectedLine"
              @change="addFilter()"
            >
              <option
                v-for="(line, index) in getLinesOpts"
                :key="index"
                :value="line.id"
              >
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Category</label>
            <select
              class="form-select"
              @change="addFilter()"
              v-model="selectedFilterSourceCat"
            >
              <option value="-1" selected>All</option>
              <option value="H">Henkaten</option>
              <option value="MV">Member Voice</option>
              <option value="Obs">Observation</option>
              <option value="FT">Focus theme</option>
            </select>
          </div>
          <div class="col">
            <label>Status</label>
            <select
              class="form-select"
              @change="addFilter()"
              v-model="selectedFilterJudge"
            >
              <option value="-1" selected>All</option>
              <option value="true">Sudah</option>
              <option value="false">Belum</option>
            </select>
          </div>
        </div>
      </div>
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>List temuan</h5>
      </div>
      <div
        style="
          width: 100%;
          display: block;
          overflow-x: auto;
          white-space: nowrap;
        "
      >
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
              v-for="(finding, findingIndex) in getFindings"
              :key="finding.no"
              :style="`${
                formatTheDate(finding.cm_str_plan_date) <= this.todayDate &&
                finding.cm_judg == false
                  ? 'background-color: #fee2e2'
                  : ''
              }
              ${finding.cm_judg == true ? 'background-color: #f0fdf4' : ''}  
              ${finding.cm_judg == false ? 'background-color: #fff' : ''} 
              `"
            >
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
              <td v-for="n in num" :key="n">
                <div
                  v-if="
                    (n >= finding.w_str_plan_date) &
                    (n <= finding.w_end_plan_date)
                  "
                  style="
                    width: 100%;
                    height: 20px;
                    border-radius: 4px;
                    background-color: coral;
                  "
                ></div>
              </td>
              <td class="px-1">
                <div class="px-2 d-flex">
                  <button
                    class="btn btn-info btn-sm text-white w-full my-1"
                    @click="
                      () => {
                        getDetailTemuan(findingIndex)
                        detailTemuanModal = true
                      }
                    "
                  >
                    Detail
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- modals -->
    <CModal
      backdrop="static"
      alignment="center"
      :visible="addTemuanModal"
      @close="addTemuanModal = false"
    >
      <CModalHeader>
        <CModalTitle>Add temuan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <div class="mb-2">
            <label class="mb-1">Start date</label>
            <input type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Machine</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">PIC</label>
            <VueMultiselect v-model="selectedPIC" :options="picData">
            </VueMultiselect>
          </div>
          <div class="mb-2">
            <label class="mb-1">Perubahan</label>
            <textarea type="text" class="form-control"> </textarea>
          </div>
          <div class="mb-2">
            <label class="mb-1">Tujuan</label>
            <textarea type="text" class="form-control"> </textarea>
          </div>
          <span style="font-weight: bold" class="mb-2"
            >Follow (2 weeks) item</span
          >
          <div class="mb-2">
            <label class="mb-1">Safety</label>
            <input type="text" class="form-control" />
          </div>
          <div>
            <label class="mb-1">Quality</label>
            <input type="text" class="form-control" />
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="addTemuanModal = false">
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>

    <CModal
      backdrop="static"
      alignment="center"
      :visible="detailTemuanModal"
      @close="detailTemuanModal = false"
      size="lg"
      scrollable
    >
      <CModalHeader>
        <CModalTitle>Detail temuan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-2">
          <label class="mb-1">Line</label>
          <input
            type="text"
            class="form-control"
            :value="findingDetail?.line_nm"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">Source cat</label>
          <input
            type="text"
            class="form-control"
            :value="findingDetail?.source_category"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">Tanggal temuan</label>
          <input
            type="date"
            class="form-control"
            :value="formatTheDate(findingDetail?.finding_date)"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">Pos</label>
          <input
            type="text"
            class="form-control"
            :value="findingDetail?.finding_location"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">Finding description / problem</label>
          <textarea
            cols="30"
            rows="5"
            class="form-control"
            :value="findingDetail?.finding_desc"
            disabled
          ></textarea>
        </div>
        <div class="mb-2">
          <label class="mb-1">Rencana perbaikan</label>
          <input
            type="date"
            class="form-control"
            :value="formatTheDate(findingDetail?.cm_str_plan_date)"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">Priority</label>
          <select
            class="form-select"
            :defaultValue="findingDetail?.cm_priority"
            disabled
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="mb-1">PIC </label>
          <input
            type="text"
            class="form-control"
            :value="findingDetail?.cm_pic_nm"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM description</label>
          <textarea
            cols="30"
            rows="5"
            class="form-control"
            :value="findingDetail?.cm_desc"
            disabled
          ></textarea>
        </div>

        <div class="mb-2">
          <label class="mb-1">CM Start Plan Date </label>
          <input
            type="date"
            class="form-control"
            :value="formatTheDate(findingDetail?.cm_str_plan_date)"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM End Plan Date </label>
          <input
            type="date"
            class="form-control"
            :value="formatTheDate(findingDetail?.cm_end_plan_date)"
            disabled
          />
        </div>

        <hr />

        <div class="mb-2">
          <label class="mb-1">CM Start actual date</label>
          <input
            type="date"
            class="form-control"
            :value="formatTheDate(findingDetail?.cm_str_act_date)"
            disabled
          />
        </div>
        <div class="mb-2">
          <label class="mb-1">CM End actual date</label>
          <input
            type="date"
            class="form-control"
            :value="formatTheDate(findingDetail?.cm_end_act_date)"
            disabled
          />
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
        <router-link
          v-if="findingDetail?.observation_id !== null"
          :to="`/observation/${findingDetail?.observation_id}`"
        >
          <CButton color="primary" class="text-white"> More details </CButton>
        </router-link>

        <CButton
          color="secondary"
          class="text-white"
          @click="detailTemuanModal = false"
        >
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

export default {
  name: 'List Temuan',
  data() {
    return {
      isLoading: false,
      num: 28,
      thisYear: '',
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedFilterSourceCat: '-1',
      selectedFilterJudge: '-1',
      selectedLine: '-1',
      selectedMonth: null,
      findingDetail: null,
      addTemuanModal: false,
      detailTemuanModal: false,
      picData: [],
      selectedPIC: null,
      todayDate: '2024-02-16',
    }
  },
  computed: {
    ...mapGetters(['getUsersOpts', 'getFindings', 'getLinesOpts']),
  },
  methods: {
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
    getDetailTemuan(findingIndex) {
      const data = this.getFindings[findingIndex]
      this.findingDetail = data
    },
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push(item.text)
      })
    },
    formatTheDate(val) {
      const year = val.split('T')[0].split('-')[0]
      const month = val.split('T')[0].split('-')[1]
      const day = val.split('T')[0].split('-')[2]

      return `${year}-${month}-${day}`
    },
    addFilter() {
      this.getFindingsFunc()
    },
  },
  async mounted() {
    this.selectedFilterSourceCat = this.$route.query.source_category
      ? this.$route.query.source_category
      : '-1'
    this.selectedFilterJudge = this.$route.query.cm_judg
      ? this.$route.query.cm_judg
      : '-1'
    this.selectedLine = this.$route.query.line_id
      ? this.$route.query.line_id
      : '-1'

    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]

    this.selectedMonth = `${year}-${month}`
    this.selectedFilterStartDate = `${year}-${month}-01`
    this.selectedFilterEndDate = `${year}-12-31`
    // this.selectedLine = localStorage.getItem('line_id')
    await this.getUsers()
    await this.getFindingsFunc()
    await this.getLines()
  },
  components: { VueMultiselect, Loading },
}
</script>
  
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.week {
  width: 20px !important;
}
</style>
  
    