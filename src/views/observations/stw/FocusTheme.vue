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
        </div>
      </div>
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Fokus Tema</h5>
        <div>
          <button class="btn btn-info text-white mx-2" @click="; (addFocusThemeModal = true), mapUsersData()">
            Add fokus tema
          </button>
          <button :disabled="getFocusTheme?.length < 1" class="btn btn-info text-white w-full my-1">
            <download-excel :data="json_data" :fields="json_fields" worksheet="My Worksheet" name="focustheme.xls">
              Export all data
            </download-excel>
          </button>
        </div>
      </div>
      <div>
        <div class="border-bottom text-center py-2">
          <span>Periode Jan-Mar 2023</span>
        </div>
        <table class="table table-striped text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Line</th>
              <th>Fokus tema</th>
              <th>Pilar</th>
              <th>Evaluasi</th>
              <th>Problem / finding</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="7" class="p-0" style="height: 200px">
                <div class="vl-parent p-0" style="height: 100%">
                  <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
                </div>
              </td>
            </tr>
            <tr v-else v-for="(focustheme, index) in getFocusTheme" :key="focustheme.ft_id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ focustheme.line_nm }}</td>
              <td>{{ focustheme.ft_desc }}</td>
              <td>{{ focustheme.ft_pillar }}</td>
              <td>
                <div class="d-flex justify-content-center align-items-center">
                  <FocusThemeIndicatorVue :total="focustheme.ft_evaluation_num"></FocusThemeIndicatorVue>
                </div>
              </td>
              <td>{{ focustheme.ft_remark }}</td>
              <td>
                <button class="btn btn-warning btn-sm text-white" @click="focusThemeDetailData(index)">
                  Problems
                </button>
                <button class="btn btn-danger btn-sm text-white mx-2" @click="deleteFT(focustheme.ft_id)">
                  Delete
                </button>
                <button class="btn btn-info btn-sm text-white" @click="getDetailFocusTheme(index)">
                  Edit
                </button>
              </td>
            </tr>
            <tr v-if="getFocusTheme?.length < 1">
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

    <!-- add modal -->
    <CModal scrollable backdrop="static" alignment="center" :visible="addFocusThemeModal"
      @close="addFocusThemeModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Add fokus tema</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Focus theme input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Fokus tema</label>
                  <input type="text" class="form-control" v-model="focusThemeData.ft_desc" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>
                  <VueMultiselect v-model="selectedLineID" :options="lineData" placeholder=""
                    :custom-label="customLineFilterOptions">
                  </VueMultiselect>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pilar</label>
                  <select class="form-select" v-model="focusThemeData.ft_pillar">
                    <option selected>Select pilar</option>
                    <option value="STW">STW</option>
                    <option value="OM">OM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Evaluasi</label>
                  <select class="form-select" v-model="focusThemeData.ft_evaluation_num">
                    <option selected>Select evaluasi</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Remark</label>
                  <input type="text" class="form-control" v-model="focusThemeData.ft_remark" />
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem :item-key="2">
            <CAccordionHeader> Findings input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Tanggal temuan</label>
                  <input type="date" class="form-control" v-model="findingsData.finding_date" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>
                  <VueMultiselect v-model="selectedLineID" :options="lineData" :custom-label="customLineFilterOptions">
                  </VueMultiselect>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pos</label>
                  <input type="text" class="form-control" v-model="findingsData.finding_location" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Finding description</label>
                  <textarea cols="30" rows="5" class="form-control" v-model="findingsData.finding_desc"></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM description</label>
                  <textarea cols="30" rows="5" class="form-control" v-model="findingsData.cm_desc"></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Priority</label>
                  <select class="form-select" v-model="findingsData.cm_priority">
                    <option selected>Select priority</option>
                    <option value="P1">P1: Safety & Quality Issue</option>
                    <option value="P2">P2: Productivity Issue</option>
                    <option value="P3">P3: Cost Issue</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Faktor </label>
                  <select class="form-select" v-model="findingsData.factor_id">
                    <option disabled>Select Factor</option>
                    <option v-for="factor in factors" :key="factor.text" :value="factor.id">
                      {{ factor.text }}
                    </option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">PIC </label>
                  <VueMultiselect v-model="selectedFindingPIC" :options="picData" :custom-label="customPicOptions">
                  </VueMultiselect>
                </div>

                <div class="mb-2">
                  <label class="mb-1">CM Start Plan Date </label>
                  <input type="date" class="form-control" v-model="findingsData.cm_str_plan_date" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM End Plan Date </label>
                  <input type="date" class="form-control" v-model="findingsData.cm_end_plan_date" />
                </div>

                <hr />

                <div class="mb-2">
                  <label class="mb-1">CM Start actual date</label>
                  <input type="date" class="form-control" v-model="findingsData.cm_str_act_date" disabled />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM End actual date</label>
                  <input type="date" class="form-control" v-model="findingsData.cm_end_act_date" disabled />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Training date</label>
                  <input type="date" class="form-control" v-model="findingsData.cm_training_date" disabled />
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Judge</label>
                  <select class="form-select" v-model="findingsData.cm_judg" disabled>
                    <option selected>Select judgement</option>
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
                  <input type="text" class="form-control" v-model="findingsData.cm_comments" disabled />
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="addFocusThemeModal = false">
          Close
        </CButton>
        <CButton color="primary" @click="addFocusThemeData">Save changes</CButton>
      </CModalFooter>
    </CModal>

    <!-- edit modal -->
    <CModal scrollable backdrop="static" alignment="center" :visible="editFocusThemeModal"
      @close="editFocusThemeModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Add fokus tema</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Focus theme edit </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Fokus tema</label>
                  <input type="text" class="form-control" v-model="focusThemeDetail.ft_desc" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>

                  <div class="row">
                    <div class="col">
                      <input type="text" disabled class="form-control"
                        :value="getLineName(focusThemeDetail.ft_line_id)" />
                    </div>
                    <div class="col">
                      <VueMultiselect v-model="selectedLineID" :options="lineData"
                        :custom-label="customLineFilterOptions">
                      </VueMultiselect>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pilar</label>
                  <select class="form-select" v-model="focusThemeDetail.ft_pillar">
                    <option selected>Select pilar</option>
                    <option value="STW">STW</option>
                    <option value="OM">OM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Evaluasi</label>
                  <select class="form-select" v-model="focusThemeDetail.ft_evaluation_num">
                    <option selected>Select evaluasi</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Remark</label>
                  <input type="text" class="form-control" v-model="focusThemeDetail.ft_remark" />
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem :item-key="2">
            <CAccordionHeader> Findings input </CAccordionHeader>

            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Tanggal temuan</label>

                  <div class="row">
                    <div class="col">
                      <input type="text" class="form-control" disabled :value="formatTheDate(
              focusThemeDetail.findings[0]?.finding_date,
            )
              " />
                    </div>
                    <div class="col">
                      <input type="date" class="form-control" v-model="focusThemeDetail.findings[0].finding_date" />
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>

                  <div class="row">
                    <div class="col">
                      <input type="text" disabled class="form-control" :value="getLineName(focusThemeDetail.findings[0].line_id)
              " />
                    </div>
                    <div class="col">
                      <VueMultiselect v-model="selectedFindingLineID" :options="lineData"
                        :custom-label="customLineFilterOptions">
                      </VueMultiselect>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pos</label>
                  <input type="text" class="form-control" v-model="focusThemeDetail.findings[0].finding_location" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Finding description</label>
                  <textarea cols="30" rows="5" class="form-control"
                    v-model="focusThemeDetail.findings[0].finding_desc"></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM description</label>
                  <textarea cols="30" rows="5" class="form-control"
                    v-model="focusThemeDetail.findings[0].cm_desc"></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Priority</label>
                  <select class="form-select" v-model="focusThemeDetail.findings[0].cm_priority">
                    <option selected>Select priority</option>
                    <option value="P1">P1: Safety & Quality Issue</option>
                    <option value="P2">P2: Productivity Issue</option>
                    <option value="P3">P3: Cost Issue</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Faktor </label>
                  <select class="form-select" v-model="focusThemeDetail.findings[0].factor_id">
                    <option disabled>Select Factor</option>
                    <option v-for="factor in factors" :key="factor.text" :value="factor.id">
                      {{ factor.text }}
                    </option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">PIC </label>

                  <div class="row">
                    <div class="col">
                      <input type="text" disabled class="form-control" :value="getPicName(focusThemeDetail.findings[0].cm_pic_id)
              " />
                    </div>
                    <div class="col">
                      <VueMultiselect v-model="selectedFindingPIC" :options="picData" :custom-label="customPicOptions">
                      </VueMultiselect>
                    </div>
                  </div>
                </div>

                <div class="mb-2">
                  <label class="mb-1">CM Start Plan Date </label>
                  <div class="row">
                    <div class="col">
                      <input type="text" class="form-control" disabled :value="formatTheDate(
              focusThemeDetail.findings[0].cm_str_plan_date,
            )
              " />
                    </div>
                    <div class="col">
                      <input type="date" class="form-control" v-model="focusThemeDetail.findings[0].cm_str_plan_date" />
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM End Plan Date </label>
                  <div class="row">
                    <div class="col">
                      <input type="text" class="form-control" disabled :value="formatTheDate(
              focusThemeDetail.findings[0].cm_end_plan_date,
            )
              " />
                    </div>
                    <div class="col">
                      <input type="date" class="form-control" v-model="focusThemeDetail.findings[0].cm_end_plan_date" />
                    </div>
                  </div>
                </div>

                <hr />

                <div class="mb-2">
                  <label class="mb-1">CM Start actual date</label>
                  <div class="row">
                    <div class="col">
                      <input type="text" class="form-control" disabled :value="formatTheDate(
              focusThemeDetail.findings[0].cm_str_act_date,
            )
              " />
                    </div>
                    <div class="col">
                      <input type="date" class="form-control" v-model="focusThemeDetail.findings[0].cm_str_act_date" />
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM End actual date</label>
                  <div class="row">
                    <div class="col">
                      <input type="text" class="form-control" disabled :value="formatTheDate(
              focusThemeDetail.findings[0].cm_end_act_date,
            )
              " />
                    </div>
                    <div class="col">
                      <input type="date" class="form-control" v-model="focusThemeDetail.findings[0].cm_end_act_date" />
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Training date</label>
                  <div class="row">
                    <div class="col">
                      <input type="text" class="form-control" disabled :value="formatTheDate(
              focusThemeDetail.findings[0].cm_training_date,
            )
              " />
                    </div>
                    <div class="col">
                      <input type="date" class="form-control" v-model="focusThemeDetail.findings[0].cm_training_date" />
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">CM Judge</label>
                  <select class="form-select" v-model="focusThemeDetail.findings[0].cm_judg">
                    <option selected>Select judgement</option>
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
                  <input type="text" class="form-control" v-model="focusThemeDetail.findings[0].cm_comments" />
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="editFocusThemeModal = false">
          Close
        </CButton>
        <CButton color="primary" @click="updateFocusThemeData">Update data</CButton>
      </CModalFooter>
    </CModal>

    <!-- detail modal -->
    <CModal scrollable backdrop="static" alignment="center" :visible="focusThemeDetailModal"
      @close="focusThemeDetailModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Detail fokus tema</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div>
          <table class="table table-striped table-bordered">
            <thead>
              <th>No</th>
              <th>Line name</th>
              <th>Finding date</th>
              <th>Finding desc</th>
              <th>CM Desc</th>
              <th>CM Judge</th>
            </thead>
            <tbody>
              <tr v-for="(findingDetail, index) in selectedFocusTheme.findings" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ findingDetail?.line_nm }}</td>
                <td>{{ formatTheDate(findingDetail?.finding_date) }}</td>
                <td>{{ findingDetail?.finding_desc }}</td>
                <td>{{ findingDetail?.cm_desc }}</td>
                <td>
                  {{ findingDetail.cm_judge == true ? 'Sudah' : 'Belum' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="() => {
              focusThemeDetailModal = false
              this.selectedFocusTheme = null
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
import { GET_LINES } from '@/store/modules/line.module'
import {
  GET_FOCUSTHEME,
  POST_FOCUSTHEME,
} from '@/store/modules/focustheme.module'
import { GET_USERS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import FocusThemeIndicatorVue from '@/components/FocusThemeIndicator.vue'
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'
import ApiService from '@/store/api.service'
import Loading from 'vue-loading-overlay'

import Pagination from '@/components/Pagination.vue'

export default {
  name: 'Focus Theme',
  data() {
    return {
      json_fields: {
        FT_ID: 'ft_id',
        Focus_Tema: 'ft_desc',
        FT_Eval_Num: 'ft_evaluation_num',
        FT_Remark: 'ft_remark',
        FT_Pillar: 'ft_pillar',
        FT_Line: 'line_nm',
      },
      json_data: null,
      isLoading: false,
      currentPage: 1,
      currentPageLimit: 5,
      selectedMonth: null,
      selectedLine: '',
      addFocusThemeModal: false,
      editFocusThemeModal: false,
      focusThemeDetailModal: false,
      factors: [],
      categories: [],
      lineData: [],
      picData: [],
      selectedLineID: null,
      selectedFindingLineID: null,
      selectedFindingPIC: null,
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedFilterLineID: '-1',
      selectedFocusTheme: null,
      focusThemeDetail: null,
      selectedFocusThemeID: null,
      focusThemeData: {
        ft_desc: '',
        ft_evaluation_num: 0,
        ft_pillar: '',
        ft_remark: '',
        ft_line_id: '',
      },
      findingsData: {
        line_id: '',
        finding_date: '',
        finding_location: '',
        finding_desc: '',
        cm_desc: '',
        cm_priority: '',
        category_id: null,
        factor_id: '',
        cm_pic_id: '',
        cm_str_plan_date: '',
        cm_end_plan_date: '',
        cm_result_factor_id: '',
        cm_str_act_date: null,
        cm_end_act_date: null,
        cm_training_date: null,
        cm_judg: false,
        cm_sign_lh_red: null,
        cm_sign_lh_white: null,
        cm_sign_sh: null,
        cm_comments: null,
      },
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getUsersOpts', 'getFocusTheme']),
  },
  updated() {
    this.mapLinesData()
    this.mapUsersData()
  },
  methods: {
    onPageChange(page) {
      if (page == -1) {
        this.currentPage = this.currentPage - 1
        this.getFocusThemes()
      } else {
        this.currentPage = this.currentPage + 1
        this.getFocusThemes()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getFocusThemes()
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
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
        if (this.getLines) {
          this.mapLinesData()
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getFocusThemes() {
      this.isLoading = true

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
        limit: this.currentPageLimit,
        currentPage: this.currentPage,
      }

      try {
        this.$store.dispatch(GET_FOCUSTHEME, objQuery).then((res) => {
          if (res) {
            this.isLoading = false
            this.json_data = res
          }
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        this.isLoading = false
        console.log(error)
      }
    },
    addFocusThemeData() {
      this.focusThemeData.ft_line_id = this.selectedLineID.line_id
      this.findingsData.cm_result_factor_id = this.findingsData.factor_id
      this.findingsData.line_id = this.selectedLineID.line_id
      this.findingsData.cm_pic_id = this.selectedFindingPIC.pic_id

      let data = {
        ...this.focusThemeData,
        findings: this.findingsData,
      }
      this.addFocusTheme(data)
    },
    async addFocusTheme(data) {
      try {
        await this.$store.dispatch(POST_FOCUSTHEME, data).then(() => {
          Swal.showLoading()
          Swal.fire('Success to add focus theme data', '', 'success')
          this.addFocusThemeModal = false
          this.getFocusThemes()
        })
      } catch (error) {
        console.log(error)
        Swal.fire('Failed', '', 'error')
        this.addFocusThemeModal = false
      }
    },
    focusThemeDetailData(index) {
      this.focusThemeDetailModal = true
      if (this.getFocusTheme) {
        this.selectedFocusTheme = this.getFocusTheme[index]
      }
    },
    deleteFT(FTID) {
      Swal.fire({
        title: 'Are you sure to delete this focus theme?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          ApiService.setHeader()
          const deleteData = ApiService.delete(
            `operational/focus-thema/delete/${FTID}`,
          )

          if (deleteData) {
            Swal.fire('Data deleted!', '', 'success')
            this.getFocusThemes()
          } else {
            Swal.fire('Error', '', 'warning')
          }

          Swal.fire('Data deleted!', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('Canceled', '', 'info')
        }
      })
    },
    getDetailFocusTheme(index) {
      const data = this.getFocusTheme[index]
      this.selectedFocusThemeID = data.ft_id
      this.focusThemeDetail = data
      this.editFocusThemeModal = true
      this.mapLinesData()
    },
    updateFocusThemeData() {
      console.log(this.focusThemeDetail.ft_pillar)
      const updateData = {
        ft_desc: this.focusThemeDetail.ft_desc,
        ft_evaluation_num: this.focusThemeDetail.ft_evaluation_num,
        ft_pillar: this.focusThemeDetail.ft_pillar,
        ft_remark: this.focusThemeDetail.ft_remark,
        ft_line_id: this.selectedLineID
          ? this.selectedLineID.line_id
          : this.focusThemeDetail.ft_line_id,
        findings: {
          line_id: this.selectedFindingLineID
            ? this.selectedFindingLineID.line_id
            : this.focusThemeDetail.findings[0].line_id,
          finding_date: this.formatTheDate(
            this.focusThemeDetail.findings[0].finding_date,
          ),
          finding_location: this.focusThemeDetail.findings[0].finding_location,
          finding_desc: this.focusThemeDetail.findings[0].finding_desc,
          cm_desc: this.focusThemeDetail.findings[0].cm_desc,
          cm_priority: this.focusThemeDetail.findings[0].cm_priority,
          category_id: null,
          factor_id: this.focusThemeDetail.findings[0].factor_id,
          cm_pic_id: this.focusThemeDetail.findings[0].cm_pic_id,
          cm_str_plan_date: this.formatTheDate(
            this.focusThemeDetail.findings[0].cm_str_plan_date,
          ),
          cm_end_plan_date: this.formatTheDate(
            this.focusThemeDetail.findings[0].cm_end_plan_date,
          ),
          cm_result_factor_id: this.focusThemeDetail.findings[0].factor_id,
          cm_str_act_date: this.focusThemeDetail.findings[0].cm_str_act_date
            ? this.formatTheDate(
              this.focusThemeDetail.findings[0].cm_str_act_date,
            )
            : null,
          cm_end_act_date: this.focusThemeDetail.findings[0].cm_end_act_date
            ? this.formatTheDate(
              this.focusThemeDetail.findings[0].cm_end_act_date,
            )
            : null,
          cm_training_date: this.focusThemeDetail.findings[0].cm_training_date
            ? this.formatTheDate(
              this.focusThemeDetail.findings[0].cm_training_date,
            )
            : null,
          cm_judg: this.focusThemeDetail.findings[0].cm_judg,
          cm_sign_lh_red: null,
          cm_sign_lh_white: null,
          cm_sign_sh: null,
          cm_comments: this.focusThemeDetail.findings[0].cm_comments,
        },
      }

      this.updateFocusTheme(updateData)
    },
    async updateFocusTheme(data) {
      const FTID = this.selectedFocusThemeID

      try {
        ApiService.setHeader()
        ApiService.put(
          `operational/focus-thema/edit/${FTID}`,
          data,
        ).then((response) => {
          if (response.data.message == 'Success to EDIT Focuss Thema') {
            Swal.fire('Data updated!', '', 'success')
            this.editFocusThemeModal = false
            this.getFocusThemes()
          } else {
            Swal.fire('Error', '', 'warning')
          }
        })

      } catch (error) {
        console.log(error)
        Swal.fire('Failed to update henkaten data', '', 'error')
        this.editFocusThemeModal = false
      }
    },
    async getFactors() {
      ApiService.setHeader()
      const factors = await ApiService.get(`master/factors`)
      this.factors = factors.data.data
    },
    async getCategories() {
      ApiService.setHeader()
      const categories = await ApiService.get(`master/categories`)
      let category = []
      categories.data.data.map((item) => {
        let cat = {
          name: item.category_nm,
          id: item.id,
        }
        category.push(cat)
      })

      this.categories = category
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
    mapLinesData() {
      this.getLinesOpts?.map((item) => {
        this.lineData.push({ line_id: item.id, line_name: item.text })
      })
    },
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push({ pic_id: item.id, pic_name: item.text })
      })
    },
    customLineFilterOptions({ line_name }) {
      return `${line_name}`
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },
    addFilter() {
      this.getFocusThemes()
    },
    getLineName(lineID) {
      const data = this.getLinesOpts.filter((line) => {
        return line.id === lineID
      })

      return data[0].text
    },
    getPicName(picID) {
      const data = this.getUsersOpts.filter((pic) => {
        return pic.id === picID
      })
      return data[0].text
    },
  },
  async mounted() {
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`

    this.selectedLine = localStorage.getItem('line_id')
    this.selectedFilterStartDate = `${year}-01-01`
    this.selectedFilterEndDate = `${year}-12-31`
    await this.getLines()
    await this.getFocusThemes()
    await this.getFactors()
    await this.getCategories()
    await this.getUsers()
  },
  components: { FocusThemeIndicatorVue, VueMultiselect, Loading, Pagination },
}
</script>



<style src="vue-multiselect/dist/vue-multiselect.css"></style>