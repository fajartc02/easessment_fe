<template>
  <div>
    <div class="card mb-3">
      <Filter filterType="list-temuan" />
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>List temuan</h5>
      </div>
      <div style="width: 100%; overflow-x: scroll">
        <table style="border: 1px solid black" class="text-center">
          <thead class="text-center">
            <tr>
              <th rowspan="3">No</th>
              <th rowspan="3">Line name</th>
              <th rowspan="3">Source cat</th>
              <th rowspan="3">Tanggal</th>
              <th rowspan="3">Pos</th>
              <th rowspan="3">Temuan prob</th>
              <th rowspan="3">Rencana perbaikan</th>
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
              <th>{{ +finding.no }}</th>
              <th>{{ finding.line_nm }}</th>
              <td>{{ finding.source_category }}</td>
              <td>{{ formatTheDate(finding.finding_date) }}</td>
              <td>{{ finding.finding_location }}</td>
              <td>{{ finding.finding_desc }}</td>
              <td>{{ formatTheDate(finding.cm_str_plan_date) }}</td>
              <td>{{ finding.cm_priority }}</td>
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
                <button
                  class="btn btn-info btn-sm text-white w-full my-1 w-100"
                  @click="
                    () => {
                      getDetailTemuan(findingIndex)
                      detailTemuanModal = true
                    }
                  "
                >
                  Detail
                </button>
                <button class="btn btn-info btn-sm text-white">Download</button>
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
        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Henkaten input </CAccordionHeader>
            <CAccordionBody>
              <div class="mb-2">
                <label class="mb-1">Tanggal temuan</label>
                <input
                  type="date"
                  class="form-control"
                  :value="formatTheDate(findingDetail?.finding_date)"
                />
              </div>
              <div class="mb-2">
                <label class="mb-1">Pos</label>
                <input
                  type="text"
                  class="form-control"
                  :value="findingDetail?.finding_location"
                />
              </div>
              <div class="mb-2">
                <label class="mb-1">Finding description</label>
                <textarea
                  cols="30"
                  rows="5"
                  class="form-control"
                  :value="findingDetail?.finding_desc"
                ></textarea>
              </div>
              <div class="mb-2">
                <label class="mb-1">CM description</label>
                <textarea
                  cols="30"
                  rows="5"
                  class="form-control"
                  :value="findingDetail?.cm_desc"
                ></textarea>
              </div>
              <div class="mb-2">
                <label class="mb-1">Priority</label>
                <select
                  class="form-select"
                  :defaultValue="findingDetail?.cm_priority"
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
                />
                <!-- <VueMultiselect
                  :options="picData"
                  :custom-label="customPicOptions"
                >
                </VueMultiselect> -->
              </div>
              <div class="mb-2">
                <label class="mb-1">CM Start Plan Date </label>
                <input
                  type="date"
                  class="form-control"
                  :value="formatTheDate(findingDetail?.cm_str_plan_date)"
                />
              </div>
              <div class="mb-2">
                <label class="mb-1">CM End Plan Date </label>
                <input
                  type="date"
                  class="form-control"
                  :value="formatTheDate(findingDetail?.cm_end_plan_date)"
                />
              </div>
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem :item-key="2">
            <CAccordionHeader> Findings </CAccordionHeader>
            <CAccordionBody>
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
                <select
                  class="form-select"
                  :value="findingDetail?.cm_judg"
                  disabled
                >
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
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
        <div></div>
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
import { mapGetters } from 'vuex'
import Filter from '@/components/Filter.vue'
import VueMultiselect from 'vue-multiselect'
import Loading from 'vue-loading-overlay'

export default {
  name: 'List Temuan',
  data() {
    return {
      isLoading: false,
      num: 28,
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
    ...mapGetters(['getUsersOpts', 'getFindings']),
  },
  methods: {
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
        start_date: '2024-02-01',
        end_date: '2024-02-29',
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
      console.log(data)
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
  },
  mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]

    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')
    this.getUsers()
    this.getFindingsFunc()
  },
  components: { Filter, VueMultiselect, Loading },
}
</script>
  
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style>
.week {
  width: 20px;
}
th,
td {
  padding: 8px;
}
</style>
  
    