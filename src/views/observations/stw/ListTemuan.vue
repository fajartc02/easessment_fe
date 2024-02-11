<template>
  <div>
    <div class="card mb-3">
      <Filter filterType="list-temuan" />
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h5>List temuan</h5>
        <router-link to="list-temuan/add">
          <button class="btn btn-info text-white">Add list</button>
        </router-link>
      </div>
      <div style="width: 100%; overflow-x: scroll">
        <table class="table table-striped table-bordered text-center">
          <thead class="text-center">
            <tr>
              <th rowspan="3">No</th>
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
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
              <th>I</th>
              <th>II</th>
              <th>III</th>
              <th>IV</th>
            </tr>
          </thead>
          <tbody v-if="isLoading">
            <tr>
              <td colspan="40" class="text-center">Loading....</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="finding in getFindings" :key="finding.no">
              <th scope="row">{{ +finding.no }}</th>
              <td>{{ finding.source_category }}</td>
              <td>{{ finding.finding_date }}</td>
              <td>{{ finding.finding_location }}</td>
              <td>{{ finding.finding_desc }}</td>
              <td>@</td>
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
              <td>@</td>
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
              <td>
                <button
                  class="btn btn-info btn-sm text-white w-full my-1"
                  @click="detailTemuanModal = true"
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
      fullscreen
    >
      <CModalHeader>
        <CModalTitle>Detail temuan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <div>
            <div class="mb-2">
              <label class="mb-1">Source Category</label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Tanggal temuan</label>
              <input type="date" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Pos</label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Temuan problem</label>
              <textarea cols="30" rows="5" class="form-control"></textarea>
            </div>
            <div class="mb-2">
              <label class="mb-1">Rencana perbaikan</label>
              <textarea cols="30" rows="5" class="form-control"></textarea>
            </div>
            <div class="mb-2">
              <label class="mb-1">Priority</label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1"
                >Stop 6
                <span class="badge rounded-pill bg-primary text-white"
                  >Safety</span
                ></label
              >
              <input type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1"
                >Rank WRAS
                <span class="badge rounded-pill bg-primary text-white"
                  >Safety</span
                >
              </label>
              <input type="text" class="form-control" />
            </div>
            <div class="row mb-2">
              <div class="col">
                <label class="mb-1"
                  >SOP/EIS
                  <span class="badge rounded-pill bg-primary text-white"
                    >Method</span
                  >
                </label>
                <input type="text" class="form-control" />
              </div>
              <div class="col">
                <label class="mb-1"
                  >TSKK
                  <span class="badge rounded-pill bg-primary text-white"
                    >Man</span
                  >
                </label>
                <input type="text" class="form-control" />
              </div>
              <div class="col">
                <label class="mb-1"
                  >TSK
                  <span class="badge rounded-pill bg-primary text-white"
                    >Man</span
                  >
                </label>
                <input type="text" class="form-control" />
              </div>
            </div>
            <div class="mb-2">
              <label class="mb-1"
                >PCI/ECI
                <span class="badge rounded-pill bg-primary text-white"
                  >Material</span
                >
              </label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1"
                >MT/KZ/ENG
                <span class="badge rounded-pill bg-primary text-white"
                  >Machine</span
                >
              </label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">PIC Schedule </label>
              <input type="date" class="form-control" />
            </div>

            <hr />

            <div class="row mb-2">
              <div class="col">
                <label class="mb-1">LH Red </label>
                <input type="text" class="form-control" />
              </div>
              <div class="col">
                <label class="mb-1">LH White </label>
                <input type="text" class="form-control" />
              </div>
              <div class="col">
                <label class="mb-1">SH </label>
                <input type="text" class="form-control" />
              </div>
            </div>
            <div class="mb-2">
              <label class="mb-1">Comments</label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Adjusment</label>
              <input type="text" class="form-control" />
            </div>

            <hr />

            <div class="mb-2">
              <label class="mb-1">Factor result</label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Plan date training</label>
              <input type="date" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Actual date training</label>
              <input type="date" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Comments</label>
              <input type="text" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Sign upload</label>
              <input type="file" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Kaizen report upload</label>
              <input type="file" class="form-control" />
            </div>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="detailTemuanModal = false">
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
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

export default {
  name: 'List Temuan',
  data() {
    return {
      isLoading: false,
      num: 28,
      selectedMonth: null,
      addTemuanModal: false,
      detailTemuanModal: false,
      picData: [],
      selectedPIC: null,
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
        // start_date: this.selectedMonth.split('-')[1],
        // end_date: this.selectedMonth.split('-')[0],
      }

      this.isLoading = true

      try {
        this.$store.dispatch(GET_FINDINGS, objQuery)
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push(item.text)
      })
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
  components: { Filter, VueMultiselect },
}
</script>
  
  <style src="vue-multiselect/dist/vue-multiselect.css"></style>
  
    