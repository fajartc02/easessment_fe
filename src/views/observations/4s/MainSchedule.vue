<template>
  <div>
    <div class="card mb-5">
      <template v-if="!mainScheduleData">
        <div class="card-header">
          <div class="row d-flex align-items-center">
            <div class="col">
              <label>Select month</label>
              <input type="month" class="form-control" v-model="selectedMonth" @change="addFilter()" />
            </div>
            <div class="col">
              <label>Line</label>
              <select class="form-select" v-model="selectedLineID" @change="addFilter()">
                <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                  {{ line.text }}
                </option>
              </select>
            </div>
            <div class="col">
              <label>Zona</label>
              <Select2 v-if="getZoneOpts.length > 1" class="form-control" v-model="selectedZoneID"
                :options="getZoneOpts" @select="addFilter()" :disabled="getZoneOpts.length == 1" />
              <input v-else type="text" class="form-control" value="tidak ada zona" disabled>
            </div>
            <div class="col">
              <label>Kanban</label>
              <Select2 v-if="getZoneOpts.length > 1" class="form-control" v-model="selectedKanbanID"
                :options="getKanbansOpts" @select="addFilter()" />
              <input v-else type="text" class="form-control" value="tidak ada kanban" disabled>
            </div>
            <div class="col">
              <label>Freq</label>
              <select class="form-select" v-model="selectedFreqID" @change="addFilter()">
                <option v-for="freq in getFreqsOpts" :key="freq.id" :value="freq.id">
                  {{ freq.text }}
                </option>
              </select>
            </div>
            <div class="col-sm-1">
              <button class="mt-4 btn btn-info text-white" @click="resetFilter()">
                Reset
              </button>
            </div>
          </div>
        </div>
        <div class="card-header">
          <div class="row">
            <div class="col">
              <div class="d-flex align-items-center">
                <div class="d-flex align-items-center">
                  <CIcon icon="cil-circle" class="text-dark" size="lg" />
                  <span class="mx-2">Planning</span>
                </div>
                <div class="d-flex align-items-center">
                  <CIcon icon="cil-check-circle" class="text-success" size="lg" />
                  <span class="mx-2">Sudah Cleaning</span>
                </div>
                <div class="d-flex align-items-center">
                  <CIcon icon="cil-circle" class="text-danger" size="lg" />
                  <span class="mx-2">Delay</span>
                </div>
                <!-- <div class="d-flex align-items-center">
                  <img src="../../../assets/red-x-mark.svg" width="23" />
                  <span class="mx-2">Sudah Cleaning, ada temuan abnormally</span>
                </div> -->
                <div class="d-flex align-items-center">
                  <CIcon icon="cilXCircle" class="text-danger" size="lg" />
                  <span class="mx-2">Sudah Cleaning, ada temuan abnormally</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="card-body p-0 overflow-x-auto">
        <div v-if="isLoadingMainSchedule" class="text-center p-5">
          <CSpinner aria-hidden="true" />
        </div>
        <div v-else class="card p-0 mb-3" ref="content">
          <template v-for="(mainSchedule, index) in mainScheduleData" :key="mainSchedule.id">
            <div class="card-header">
              <div class="row d-flex align-items-center">
                <div class="col">
                  <label>Select month</label>
                  <input type="month" class="form-control" v-model="selectedMonth" @change="addFilter()" />
                </div>
                <div class="col">
                  <label>Line</label>
                  <select class="form-select" v-model="selectedLineID" @change="addFilter()">
                    <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                      {{ line.text }}
                    </option>
                  </select>
                </div>
                <div class="col">
                  <label>Zona</label>
                  <Select2 v-if="getZoneOpts.length > 1" class="form-control" v-model="selectedZoneID"
                    :options="getZoneOpts" @select="addFilter()" :disabled="getZoneOpts.length == 1" />
                  <input v-else type="text" class="form-control" value="tidak ada zona" disabled>
                </div>
                <div class="col">
                  <label>Kanban</label>
                  <Select2 v-if="getZoneOpts.length > 1" class="form-control" v-model="selectedKanbanID"
                    :options="getKanbansOpts" @select="addFilter()" />
                  <input v-else type="text" class="form-control" value="tidak ada kanban" disabled>
                </div>
                <div class="col">
                  <label>Freq</label>
                  <select class="form-select" v-model="selectedFreqID" @change="addFilter()">
                    <option v-for="freq in getFreqsOpts" :key="freq.id" :value="freq.id">
                      {{ freq.text }}
                    </option>
                  </select>
                </div>
                <div class="col-sm-1">
                  <button class="mt-4 btn btn-info text-white" @click="resetFilter()">
                    Reset
                  </button>
                </div>
              </div>
            </div>
            <div class="card-header">
              <div class="row">
                <div class="col">
                  <div class="d-flex align-items-center">
                    <div class="d-flex align-items-center">
                      <CIcon icon="cil-circle" class="text-dark" size="lg" />
                      <!-- <div class="bullet" style="width: 20px; height: 20px"></div> -->
                      <span class="mx-2">Planning</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <CIcon icon="cil-check-circle" class="text-success" size="lg" />
                      <!-- <div class="bullet-filled" style="width: 20px; height: 20px"></div> -->
                      <span class="mx-2">Sudah Cleaning</span>
                    </div>
                    <div class="d-flex align-items-center">
                      <CIcon icon="cil-circle" class="text-danger" size="lg" />
                      <span class="mx-2">Delay</span>
                    </div>
                    <!-- <div class="d-flex align-items-center"> -->
                    <!-- <div class="bullet-cancel d-flex justify-content-center align-items-center"
                  style="width: 20px; height: 20px">
                  <CIcon icon="cil-x" class="text-danger" size="sm" />
                </div> -->
                    <!--                <CIcon icon="cil-bell" class="text-warning" size="lg" />-->
                    <!-- <img src="../../../assets/red-x-mark.svg" width="23" />
                      <span class="mx-2">Sudah Cleaning, ada temuan abnormally</span>
                    </div> -->
                    <div class="d-flex align-items-center">
                      <CIcon icon="cilXCircle" class="text-danger" size="lg" />
                      <span class="mx-2">Sudah Cleaning, ada temuan abnormally</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card">
              <button class="btn btn-primary" @click="exportToPDF(index)">Export PDF</button>
            </div>
            <div class="card bg-dark text-light p-2">
              <h6>4S Schedule Activities ({{ mainSchedule.line_nm }} - {{ mainSchedule.group_nm }})</h6>
            </div>
            <div class="card-body p-0 tableFixHead" :ref="'content_' + index">
              <table class="table table-hover" style="width: 100%;">
                <thead class="bg-dark text-light">
                  <tr>
                    <th id="fixCol-1" class="bg-dark" rowspan="2">No</th>
                    <th id="fixCol-2" class="bg-dark" rowspan="2">Zona</th>
                    <th id="fixCol-3" class="bg-dark" rowspan="2">No Kanban</th>
                    <th id="fixCol-4" class="bg-dark" rowspan="2">Area</th>
                    <th id="fixCol-5" class="bg-dark" rowspan="2">PIC</th>
                    <th style="z-index: 1;" rowspan="2">Time</th>
                    <th style="z-index: 1;" rowspan="2">Freq</th>
                    <th :colspan="getDateThisMonth" class="text-center">{{ getMonthStr }}</th>
                  </tr>
                  <tr>
                    <th v-for="n in getDateThisMonth" :key="n">{{ n }}</th>
                  </tr>
                </thead>
                <tbody>
                  <td v-if="mainSchedule.sub_schedules.length == 0 && !isLoading" :colspan="getDateThisMonth + 9"
                    class="text-center p-3" style="min-width: 50px;">
                    No Data Available
                  </td>
                  <td v-else-if="isLoading" :colspan="getDateThisMonth + 9" class="p-5 text-center"
                    style="min-width: 50px;">
                    <CSpinner aria-hidden="true" />
                  </td>
                  <template v-else>
                    <tr v-for="(data, scheduleIndex) in mainSchedule.sub_schedules" :key="scheduleIndex">
                      <td id="fixCol-body-1" style="background-color: white;">{{ data?.no }}</td>
                      <td id="fixCol-body-2" style="min-width: 100px;background-color: white;">
                        {{ data?.zone_nm }}
                      </td>
                      <td id="fixCol-body-3" style="min-width: 120px;background-color: white;">{{ data?.kanban_no }}
                      </td>
                      <td id="fixCol-body-4" style="min-width: 200px;background-color: white;">{{ data?.area_nm }}</td>
                      <td id="fixCol-body-5" style="min-width: 100px;background-color: white">
                        <div style="cursor: pointer;" v-if="data?.pic_nm"
                          @click="openEditModal(data.sub_schedule_id, data.pic_id, data.pic_nm)">
                          <p class="cursor-pointer"> {{ data?.pic_nm }}</p>
                        </div>
                        <div v-else>
                          <button class="btn btn-info btn-sm mx-2 text-white"
                            @click="openEditModal(data.sub_schedule_id, null, null)">
                            Add
                          </button>
                        </div>
                      </td>
                      <td style="min-width: 50px">{{ data?.standart_time }}</td>
                      <td> {{ data?.freq_nm }}</td>

                      <td v-for="(children, childIdx) in data?.children" :key="children"
                        :style="`${children?.is_holiday ? 'background-color: #f9fafb' : ''} ${children?.status == 'NIGHT_SHIFT' && isAssyLine ? 'background-color: #fffbeb' : ''}; z-index: 10; min-width: 80px;`">

                        <CDropdown variant="btn-group"
                          v-if="children?.status && children?.status != '' && children?.status != 'NIGHT_SHIFT'">

                          <CButton color="secondary" class="text-secondary bg-white"
                            @click="addScheduleCheck(data.main_schedule_id, children?.sub_schedule_id)"
                            style="z-index: 1">
                            <!--                          :class="{ 'py-2 px-2': children?.status == 'PROBLEM' }"-->
                            <CIcon v-if="children?.status == 'PLANNING'" icon="cil-circle" class="text-dark"
                              size="lg" />
                            <!-- <div  class="bullet"></div> -->
                            <!-- <div  class="bullet-filled"></div> -->
                            <CIcon v-else-if="children?.status == 'ACTUAL'" icon="cil-check-circle" class="text-success"
                              size="lg" />
                            <!--                            <CIcon v-else-if="children?.status == 'PROBLEM'" icon="cil-bell" class="text-warning"
                                                        size="lg" />-->
                            <!-- <div v-else-if="children?.status == 'PROBLEM'">
                              <img src="../../../assets/red-x-mark.svg" width="23" />
                            </div> -->
                            <CIcon v-else-if="children?.status == 'PROBLEM'" icon="cilXCircle" class="text-danger"
                              size="lg" />

                            <!-- <div
                            class="bullet-cancel d-flex justify-content-center align-items-center"
                            style="width: 20px; height: 20px">
                            <CIcon icon="cil-x" class="text-danger text-bold" size="sm" />
                          </div> -->
                          </CButton>
                          <div style="margin-left: -5px;">
                            <CDropdownToggle color="secondary" class="text-white" split> item</CDropdownToggle>
                            <CDropdownMenu>
                              <!-- <CDropdownItem> -->
                              <CRow v-if="children?.status === 'PLANNING'" style="margin: 0px 5px">
                                <CCol>
                                  <CButton color="success" class="text-white"
                                    @click="judgmentConf(data, 'OK', childIdx + 1, children)" :disabled="!data?.pic_nm">
                                    OK
                                  </CButton>
                                </CCol>
                                <CCol>
                                  <CButton color="danger" class="text-white"
                                    @click="judgmentConf(data, 'NG', childIdx + 1, children)" :disabled="!data?.pic_nm">
                                    NG
                                  </CButton>
                                </CCol>
                                <small v-if="!data?.pic_nm" class="text-primary">*Assign PIC belum di lakukan</small>
                              </CRow>
                              <!-- </CDropdownItem> -->
                              <hr>
                              <CDropdownItem @click="openChangeDateModal(children?.date, children?.sub_schedule_id)">
                                Change Date
                              </CDropdownItem>
                              <CDropdownItem @click="deleteScheduleCheck(children?.sub_schedule_id)">
                                Delete
                              </CDropdownItem>
                            </CDropdownMenu>
                          </div>
                          <img v-if="children.total_comment" src="@/assets/comment.png" alt="comment" width="40"
                            :style="`position: absolute;top: -30px; right: -20px; z-index: 50;`">
                        </CDropdown>
                      </td>
                    </tr>

                    <!-- Sign TL 1 -->
                    <tr>
                      <td colspan="7" class="text-center">Sign TL 1</td>
                      <td v-for="children in mainSchedule?.sub_schedules[0]?.children" :key="children" :style="`${children?.is_holiday ? 'background-color: #f9fafb' : ''
                        } ${children?.status == 'NIGHT_SHIFT' && isAssyLine ? 'background-color: #fffbeb' : ''
                        } `">

                        <div v-if="canSign(children, 'tl1_sign_checker_id', 'has_tl1_sign') || children?.has_tl1_sign"
                          class="d-flex align-items-center justify-content-center w-full">
                          <button @click="
                            openSignModal(extractSignReq(mainSchedule?.sub_schedules[0], children), 'sign_tl_1')
                            " class="check-wrapper-null d-flex align-items-center justify-content-center">
                            <CIcon v-if="canSign(children, 'tl1_sign_checker_id', 'has_tl1_sign')" icon="cil-x"
                              class="text-danger" size="sm" />
                            <img v-else-if="children?.has_tl1_sign" :src="children.sign_tl_1" alt="sign" :style="{
                              width: '50px',
                              height: '50px'
                            }" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- SIGN TL 2 -->
                    <!-- should hide when line is crank shaft (temporary) -->
                    <!-- <tr v-if="mainSchedule.line_id !== '73a281a9-8923-48d3-a80e-e62ed61d89b7'">
                      <td colspan="7" class="text-center">Sign TL 2</td>
                      <td v-for="children in mainSchedule?.sub_schedules[0]?.children" :key="children" :style="`${children?.is_holiday ? 'background-color: #f9fafb' : ''
                        } ${children?.status == 'NIGHT_SHIFT' && isAssyLine ? 'background-color: #fffbeb' : ''
                        }`">

                        <div class="d-flex align-items-center justify-content-center w-full">
                          <button @click="
                            openSignModal(children?.tl2_sign_checker_id, 'sign_tl_2')
                            " v-if="canSign(children)"
                            class="check-wrapper-null d-flex align-items-center justify-content-center">
                            <CIcon icon="cil-x" class="text-danger" size="sm" />
                          </button>
                          <button @click="
                            openSignModal(children?.tl2_sign_checker_id, 'sign_tl_2')
                            " v-else-if="children?.has_tl2_sign"
                            class="check-wrapper d-flex align-items-center justify-content-center">
                            <img :src="children.sign_tl_2" alt="sign" :style="{
                              width: '50px',
                              height: '50px'
                            }" />
                          </button>

                        </div>
                      </td>
                    </tr> -->

                    <!-- SIGN GL -->
                    <tr>
                      <td colspan="7" class="text-center">Sign GL</td>
                      <td v-for="children in mainSchedule?.sub_schedules[0]?.children" :key="children" :style="`${children?.is_holiday ? 'background-color: #f9fafb' : ''
                        } ${children?.status == 'NIGHT_SHIFT' && isAssyLine ? 'background-color: #fffbeb' : ''
                        } `">

                        <div v-if="canSign(children, 'gl_sign_checker_id', 'has_gl_sign') || children?.has_gl_sign"
                          class="d-flex align-items-center justify-content-center w-full">
                          <button @click="
                            openSignModal(extractSignReq(mainSchedule?.sub_schedules[0], children), children?.gl_sign_checker_id, 'sign_gl')
                            " class="check-wrapper-null d-flex align-items-center justify-content-center">

                            <img v-if="children?.has_gl_sign" :src="children.sign_gl" alt="sign" :style="{
                              width: '50px',
                              height: '50px'
                            }" />
                            <CIcon v-else-if="canSign(children, 'gl_sign_checker_id', 'has_gl_sign')" icon="cil-x"
                              class="text-danger" size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    <!-- SIGN SH -->
                    <tr>
                      <td colspan="7" class="text-center">Sign SH</td>
                      <td v-for="children in mainSchedule?.sub_schedules[0]?.children" :key="children" :style="`${children?.is_holiday ? 'background-color: #f9fafb' : ''
                        } ${children?.status == 'NIGHT_SHIFT' && isAssyLine ? 'background-color: #fffbeb' : ''
                        } `">

                        <div v-if="canSign(children, 'sh_sign_checker_id', 'has_sh_sign') || children?.has_sh_sign"
                          class="d-flex align-items-center justify-content-center w-full">
                          <button @click="
                            openSignModal(extractSignReq(mainSchedule?.sub_schedules[0], children), children?.sh_sign_checker_id, 'sign_sh')
                            " class="check-wrapper-null d-flex align-items-center justify-content-center">
                            <img v-if="children?.has_sh_sign" :src="children.sign_sh" alt="sign" :style="{
                              width: '50px',
                              height: '50px'
                            }" />
                            <CIcon v-else-if="canSign(children, 'sh_sign_checker_id', 'has_sh_sign')" icon="cil-x"
                              class="text-danger" size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <div class="card-footer">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="input-group mb-3">
                    <label class="input-group-text">Limit</label>
                    <select class="form-select" v-model="mainSchedule.limit"
                      @change="handleLimitChangeSubSchedule($event, mainSchedule.main_schedule_id, index)">
                      <option selected value="10">10</option>
                      <option value="20">20</option>
                      <option value="40">40</option>
                      <option value="60">60</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                <div v-if="mainSchedule.total_data > 0">
                  <CustPagination :totalItems="mainSchedule.total_data" :items-per-page="mainSchedule.limit"
                    :current-page="mainSchedule.current_page"
                    @page-changed="handlePageChangeSubSchedule($event, mainSchedule.main_schedule_id, index)" />
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>


    <!-- Modal confirmation -->
    <JudgmentConfirmation :data="selectedJudgContent" :visible="visibleModalConfJudg"
      @emit-visible="visibleModalConfJudg = $event" @emit-data="selectedJudgContent = $event"
      @emit-refetch-schedule="getSchedules" />
    <!-- add sign modal -->
    <CModal backdrop="static" alignment="center" :visible="addSignModal" @close="addSignModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Add sign</CModalTitle>
      </CModalHeader>
      <CModalBody>

        <input type="image" v-if="selectedSign" :src="selectedSign" style="width: 100%; height: 100%" />

        <div style="height: 150px">
          <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature :ref="selectedSignType" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature()">
              {{ isUploadSignLoading ? "Saving.." : `Save ${selectedSignType?.replaceAll("_", " ")?.toUpperCase()}` }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature('sign_tl_1')">
              Clear
            </button>
          </div>
        </div>

      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="closeSignModal()">
          Close
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- edit modal -->
    <CModal backdrop="static" alignment="center" :visible="editDataModal" @close="editDataModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Add PIC</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-2">
          <label class="mb-1">PIC </label>
          <div class="row">
            <div class="col">
              <input type="text" class="form-control py-2" :value="selectedPICName" disabled />
            </div>
            <div class="col">
              <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions">
              </VueMultiselect>
            </div>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="editDataModal = false">
          Close
        </CButton>
        <CButton color="info" class="text-white" @click="addPIC()">
          {{ isAddPICLoading ? "Saving.." : "Save" }}
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- change date modal -->
    <CModal backdrop="static" alignment="center" :visible="changeDateModal" @close="changeDateModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Change Date</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-2">
          <label class="mb-1">Date </label>
          <div class="row">
            <div class="col">
              <input type="text" class="form-control py-2" :value="selectedBeforeDate" disabled />
            </div>
            <div class="col">
              <input type="date" class="form-control" v-model="updateDate">
            </div>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="changeDateModal = false">
          Close
        </CButton>
        <CButton color="info" class="text-white" @click="changeDate()">
          {{ isChangeDateLoading ? "Saving.." : "Save" }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import moment from "moment";
import Loading from "vue-loading-overlay";
import {
  GET_SCHEDULES,
  GET_SUB_SCHEDULES
} from "@/store/modules/schedule4s.module";
import { GET_GROUP } from "@/store/modules/group.module";
import { GET_LINES } from "@/store/modules/line.module";
import { GET_ZONES } from "@/store/modules/zones.module";
import { GET_KANBANS } from "@/store/modules/kanban.module";
import { GET_FREQS } from "@/store/modules/freq.module";
import { GET_USERS } from "@/store/modules/user.module";

import { mapGetters } from "vuex";
import vueSignature from "vue-signature";
import ApiService from "@/store/api.service";
import VueMultiselect from "vue-multiselect";
import Swal from "sweetalert2";
import { toast } from "vue3-toastify";
import CustPagination from "@/components/pagination/CustPagination.vue";
import JudgmentConfirmation from "@/components/new/JudgmentConfirmation.vue";
import html2pdf from "html2pdf.js";
import { autoCropSignature } from "@/functions/imageUtils";

export default {
  name: "Main Schedule",
  // eslint-disable-next-line vue/no-unused-components
  components: { CustPagination, Loading, vueSignature, VueMultiselect, JudgmentConfirmation },
  data() {
    return {
      visibleModalConfJudg: false,
      selectedJudgContent: null,
      totalDate: 31,
      isLoading: true,
      isMainScheduleEmpty: false,
      isAddPICLoading: false,
      isChangeDateLoading: false,
      mainScheduleData: null,
      subScheduleData: [],
      signGLData: null,
      signSHData: null,
      selectedMonth: null,
      selectedLineID: null,
      selectedGroupID: "-1",
      selectedZoneID: "-1",
      selectedKanbanID: "-1",
      selectedFreqID: "-1",
      idxMonth: [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12"
      ],
      monthStr: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ],
      option: {
        penColor: "rgb(0, 0, 0)",
        backgroundColor: "rgb(255,255,255)"
      },
      isUploadSignLoading: false,
      selectedSignature: null,
      selectedSignCheckerID: null,
      selectedSignType: null,
      selectedSign: null,
      addSignModal: false,
      editDataModal: false,
      changeDateModal: false,
      selectedSubScheduleID: null,
      picData: [],
      selectedPIC: null,
      selectedPICName: null,
      updateDate: null,
      selectedBeforeDate: null,
      newSubScheduleData: [],
      mainSubScheduleID: [],
      isLoadingMainSchedule: false,
      isAssyLine: false,
      limitSubSchedule: 10,
      currentPageSubSchedule: 1,
      selectedScheduleData: null, // uc. sign checker
      loadingSign: [
        false,
        false
      ]
    };
  },
  computed: {
    ...mapGetters([
      "getLinesOpts",
      "getGroups",
      "getZoneOpts",
      "getKanbansOpts",
      "getFreqsOpts",
      "getUsersOpts"
    ]),
    getDateThisMonth() {
      const year = this.selectedMonth.split("-")[0];
      const month = +this.selectedMonth.split("-")[1];
      const r = new Date(year, month, 0).getDate();
      return r;
    },
    getMonthStr() {
      const monthStr = ["January", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
      return monthStr[+this.selectedMonth.split("-")[1] - 1];
    },
    orderedSubScheduleData() {
      let subSchedule = this.newSubScheduleData;
      let sortedData = subSchedule.sort((a, b) => {
        let fa = a[0]?.group_nm.toLowerCase(), fb = b[0]?.group_nm.toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });

      return sortedData;
    }
  },
  watch: {
    selectedMonth: function () {
      if (this.selectedMonth) {
        this.generateDate();
        let idx = this.idxMonth.indexOf(this.selectedMonth.split("-")[1]);
        this.yearMonth = `${this.monthStr[idx]} ${this.selectedMonth.split("-")[0]
          }`;
      }
    },
    selectedLineID: function () {
      this.getZone();
      this.onChangeLine();
    },
    selectedZoneID: function () {
      this.getKanban();
    }
  },
  methods: {
    judgmentConf(content, judgment, dateIdx, children) {
      this.visibleModalConfJudg = true
      this.selectedJudgContent = {
        ...content,
        judgment,
        dateIdx,
        ...children
      }
    },

        exportToPDF(index) {
          const tableOriginal = this.$refs[`content_${index}`]?.[0];
          if (!tableOriginal)
      {
            toast.error("Tabel tidak ditemukan");
            return;
          }

          const shift = this.mainScheduleData[index]?.group_nm || "Default";
          const nameFile = `4S_Schedule_${shift.replace(/\s+/g, "_")}`;
          const cloneWrapper = document.createElement("div");
          const clone = tableOriginal.cloneNode(true);


      clone.querySelectorAll("*").forEach((el) => {
        const computed = window.getComputedStyle(el);

        if (computed.position === "sticky" || el.style.position === "sticky")
        {
          el.style.position = "static";
          el.style.top = "auto";
          el.style.bottom = "auto";
          el.style.zIndex = "auto";
        }

        el.classList.forEach((cls) => {
          if (cls.toLowerCase().includes("sticky"))
          {
            el.classList.remove(cls);
          }
        });

        if (el.style.bottom) el.style.bottom = "auto";
        if (el.style.zIndex) el.style.zIndex = "auto";
      });


      clone.style.display = "block";
      clone.style.overflow = "visible";
      clone.style.maxHeight = "none";

      cloneWrapper.style.position = "absolute";
      cloneWrapper.style.top = "0";
      cloneWrapper.style.left = "0";
      cloneWrapper.style.zIndex = "-9999";
      cloneWrapper.style.padding = "20px";
      cloneWrapper.style.background = "#fff";
      cloneWrapper.appendChild(clone);
      document.body.appendChild(cloneWrapper);

      document.body.style.height = clone.scrollHeight + "px";
      document.body.style.overflow = "visible";


      this.$nextTick(() => {
        setTimeout(() => {
          const options = {
            margin: 0,
            filename: `${nameFile}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              scrollY: 0,
              scrollX: 0,
              windowHeight: clone.scrollHeight,
            },
            jsPDF: {
              unit: "px",
              format: [5500, 1500],
              orientation: "landscape",
            },
          };

          html2pdf()
            .set(options)
            .from(clone)
            .save()
            .then(() => {
              document.body.removeChild(cloneWrapper);
              document.body.style.height = "";
              document.body.style.overflow = "";
            });
        }, 800); // kasih waktu render
      });
    }
    ,



    addScheduleCheck(mainScheduleID, subScheduleID) {
      this.$router.push(`/4s/schedule-check/${mainScheduleID}/${subScheduleID}`);
    },
    async getSchedules() {
      this.newSubScheduleData = [];
      this.subScheduleData = [];
      this.mainScheduleData = [];
      this.isLoadingMainSchedule = true;
      let objQuery = {
        month_year_num: this.selectedMonth,
        line_id: this.selectedLineID
      };
      await this.$store.dispatch(GET_SCHEDULES, objQuery).then(async (res) => {
        this.isLoadingMainSchedule = false;
        if (res) {
          const data = res.list;
          if (data && data.length > 0) {
            this.mainScheduleData = data.map((item) => {
              item.sub_schedules = [];
              item.glSigns = [];
              item.shSigns = [];
              item.limit = 10;
              item.current_page = 1;
              item.total_data = 0;

              return item;
            });
          }

          if (this.mainScheduleData.length > 0)
          {
            for (let i = 0; i < this.mainScheduleData.length; i++)
            {
              this.loadingSign[i] = true;
              await this.getSubSchedules(this.mainScheduleData[i].main_schedule_id, i);
            }
          } else {
            this.isMainScheduleEmpty = true;
          }
        }
      });
    },
    async getSubSchedules(mainScheduleID, index) {
      //this.newSubScheduleData = []
      //this.subScheduleData = []
      this.isLoading = true;
      let objQuery = {
        main_schedule_id: mainScheduleID,
        line_id: this.selectedLineID,
        kanban_id: this.selectedKanbanID,
        zone_id: this.selectedZoneID,
        freq_id: this.selectedFreqID,
        month_year_num: this.selectedMonth,
        limit: this.limitSubSchedule,
        current_page: this.currentPageSubSchedule
      };

      const self = this;

      await this.$store.dispatch(GET_SUB_SCHEDULES, objQuery).then(async (res) => {
        if (res)
        {
          let redTemp = "";
          let whiteTemp = "";
          let temp = res.schedule;
          // console.log(temp[0]?.group_nm)
          temp.sort(function (a, b) {
            redTemp = a.group_nm;
            whiteTemp = b.group_nm;
            return redTemp.localeCompare(whiteTemp);
          });


          if (res.schedule && res.schedule.length && res.schedule[0].children.length)
          {

            for (let i = 0; i < res.schedule[0].children.length; i++)
            {
              const item = res.schedule[0].children[i];

              try
              {
                if (item.tl1_sign_checker_id && item.has_tl1_sign)
                {
                  const base64 = await self.loadSign(item.tl1_sign_checker_id);
                  const cropped = await autoCropSignature(base64);
                  item.sign_tl_1 = cropped;
                }

                if (item.gl_sign_checker_id && item.has_gl_sign)
                {
                  const base64 = await self.loadSign(item.gl_sign_checker_id);
                  const cropped = await autoCropSignature(base64);
                  item.sign_gl = cropped;
                }

                if (item.sh_sign_checker_id && item.has_sh_sign)
                {
                  const base64 = await self.loadSign(item.sh_sign_checker_id);
                  const cropped = await autoCropSignature(base64);
                  item.sign_sh = cropped;
                }
              }
              catch (error)
              {
                console.error(`Error processing signatures for item ${i}:`, error);
              }
            }
          }


          this.mainScheduleData[index].sub_schedules = res.schedule;
          this.mainScheduleData[index].glSigns = res.sign_checker_gl;
          this.mainScheduleData[index].shSigns = res.sign_checker_sh;
          this.mainScheduleData[index].limit = res.limit;
          this.mainScheduleData[index].current_page = res.current_page;
          this.mainScheduleData[index].total_data = res.total_data;

          //console.log(temp)
          //this.newSubScheduleData = res.schedule
          //this.newSubScheduleData.push(res.schedule)
          this.signGLData = res.sign_checker_gl;
          this.signSHData = res.sign_checker_sh;
          this.isLoading = false;

          console.log("mainScheduleData", this.mainScheduleData);
        }
      });
    },

    async addPIC() {
      this.isAddPICLoading = true;
      ApiService.setHeader();
      const data = {
        pic_id: this.selectedPIC.pic_id
      };

      const add = await ApiService.put(
        `/operational/4s/sub-schedule/add-plan-pic/${this.selectedSubScheduleID}`,
        data
      );
      if (add.data.message == "Success to add plan pic 4s sub schedule") {
        toast.success("PIC added", {
          autoClose: 700
        });
        this.selectedPIC = null;

        this.isAddPICLoading = false;
        this.editDataModal = false;
        await this.getSchedules();
      }
    },

    openChangeDateModal(beforeDate, subScheduleID) {
      this.changeDateModal = true;
      this.selectedBeforeDate = beforeDate;
      this.selectedSubScheduleID = subScheduleID;
    },

    async changeDate() {
      this.isChangeDateLoading = true;
      ApiService.setHeader();
      const data = {
        plan_date: this.updateDate,
        before_plan_date: this.selectedBeforeDate
      };

      const change = await ApiService.put(
        `/operational/4s/sub-schedule/edit/${this.selectedSubScheduleID}`,
        data
      );
      if (change.data.message == "Success to edit 4s schedule plan") {
        this.isChangeDateLoading = false;
        this.changeDateModal = false;
        await this.getSchedules();
      }

    },

    async deleteScheduleCheck(subScheduleID) {
      Swal.fire({
        title: "Are you sure to delete this item?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Sure",
        denyButtonText: `No`
      }).then((result) => {
        if (result.isConfirmed) {
          ApiService.setHeader();
          const deleteData = ApiService.delete(`operational/4s/sub-schedule/delete/${subScheduleID}`);


          if (deleteData) {
            toast.success("Data daleted", {
              autoClose: 700
            });
            this.getSchedules();
          } else {
            toast.error("Failed to delete data", {
              autoClose: 700
            });
          }
        } else if (result.isDenied) {
          Swal.fire("Canceled", "", "info");
        }
      });

    },

    async addFilter() {
      await this.getSchedules();
    },
    resetFilter() {
      this.selectedLineID = "-1";
      this.selectedFreqID = "-1";
      this.selectedGroupID = "-1";
      this.selectedZoneID = "-1";
      this.selectedKanbanID = "-1";
      this.getSchedules();
    },

    async getUsers() {
      try {
        this.$store.dispatch(GET_USERS);
        if (this.getUsersOpts) {
          this.mapUsersData();
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push({ pic_id: item.id, pic_name: item.text });
      });
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`;
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES);
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    async getGroup() {
      try {
        this.$store.dispatch(GET_GROUP);
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    async getZone() {
      try {
        this.$store.dispatch(GET_ZONES, { line_id: this.selectedLineID ?? -1 });
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    async getKanban() {
      try {
        this.$store.dispatch(GET_KANBANS, { zone_id: this.selectedZoneID ?? -1 });
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    async getFreq() {
      try {
        this.$store.dispatch(GET_FREQS);
      } catch (error) {
        if (error.response.status == 401) this.$router.push("/login");
        console.log(error);
      }
    },
    generateDate() {
      let year = new Date(this.selectedMonth).getFullYear();
      let month = new Date(this.selectedMonth).getMonth() + 1;
      let selectedMonth = new Date(`${year}-${month}`);
      var lastDay = new Date(year, month, 0);
      let container = [];
      this.containerDate = [];
      for (let i = 1; i <= lastDay.getDate(); i++) {
        let setDt = new Date(selectedMonth).setDate(i);
        let newDate = new Date(setDt);
        container.push(newDate.getDate());
        let dateObj = {
          bg: ``,
          date: newDate,
          idx: `${i}`
        };
        if (newDate.getDay() === 0 || newDate.getDay() === 6)
          dateObj.bg = `bg-secondary`;
        this.containerDate.push(dateObj);
      }
    },

    // sign methods
    openSignModal(schedule, signCheckerID, from) {
      this.selectedScheduleData = {
        ...schedule,
        is_tl_1: from === "sign_tl_1" ? true : null,
        is_gl: from === "sign_gl" ? true : null,
        is_sh: from === "sign_sh" ? true : null,
      };

      this.selectedSignType = from;
      this.addSignModal = true;
      this.selectedSignCheckerID = signCheckerID ?? "createnew";
      this.getSignature();
    },
    async closeSignModal(isRefresh = false) {
      this.addSignModal = false;
      this.selectedSignCheckerID = null;
      this.selectedSignature = null;
      this.selectedSignType = null;
      this.selectedSign = null;
      this.selectedScheduleData = null;
      if (isRefresh)
      {
        await this.getSchedules();
      }
    },
    saveSignature() {
      this.selectedSignature = this.$refs[this.selectedSignType].save();
      this.uploadSignature();
    },
    clearSignature() {
      this.$refs[this.selectedSignType].clear();
    },
    async uploadSignature() {
      this.isUploadSignLoading = true;
      ApiService.setHeader();
      const upload = await ApiService.put(
        `/operational/4s/sub-schedule/sign/${this.selectedSignCheckerID}`,
        { sign: this.selectedSignature, ...this.selectedScheduleData }
      );
      if (upload.data.message == "success to sign 4s schedule") {
        this.isUploadSignLoading = false;
        toast.success("Sign saved", {
          autoClose: 700
        });
        this.closeSignModal(true);
      }
    },
    async getSignature() {
      if (!this.selectedSignCheckerID || this.selectedSignCheckerID == "createnew")
      {
        return
      }

      this.isUploadSignLoading = true;
      ApiService.setHeader();
      const getData = await ApiService.get(
        `/operational/4s/sub-schedule/sign/${this.selectedSignCheckerID}`
      );

      if (getData.data.message == "Success to get 4s sign checker") {
        this.selectedSign = getData.data.data.sign;
        this.isUploadSignLoading = false;
      }
    },

    // edit data
    openEditModal(subScheduleID, picID, picName) {
      if (picName) {
        this.selectedPICName = picName;
      }
      this.editDataModal = true;
      this.selectedSubScheduleID = subScheduleID;
      this.mapUsersData();
    },
    customLabel(value) {
      return `${value.text}`;
    },
    onChangeLine() {
      const filtered = (this.getLinesOpts ?? []).filter((item) => item.id == this.selectedLineID);

      if (
        this.selectedLineID
        && filtered.length > 0
        && filtered[0].text.toLowerCase().includes("line")
      ) {
        this.isAssyLine = true;
      } else {
        this.isAssyLine = false;
      }
    },
    async handleLimitChangeSubSchedule(event, main_schedule_id, index) {
      this.limitSubSchedule = event.target.value;
      await this.getSubSchedules(
        main_schedule_id,
        index
      );
    },
    async handlePageChangeSubSchedule(event, main_schedule_id, index) {
      this.currentPageSubSchedule = event;
      await this.getSubSchedules(
        main_schedule_id,
        index
      );
    },
    canSign(data, signIdKey, hasIdKey) {
      const activityStat = (data?.status === 'PLANNING' || data?.status === 'PROBLEM' || data?.status === 'ACTUAL');
      if (signIdKey.toLowerCase().includes("sh") || signIdKey.toLowerCase().includes("gl"))
      {
        return activityStat;
      }

      return data[signIdKey] && !data[hasIdKey] && activityStat;
    },
    async loadSign(id) {
      ApiService.setHeader();
      const result = await ApiService.get(
        `/operational/4s/sub-schedule/sign/${id}`
      );

      return result.data.data.sign
    },
    extractSignReq(parent, child) {
      return {
        main_schedule_id: parent.main_schedule_id,
        date: child.date,
      }
    }
  },

  async mounted() {
    if (localStorage.getItem("line_id")) {
      this.selectedLineID = localStorage.getItem("line_id");
    }
    this.newSubScheduleData = [];
    const year = moment().format("YYYY");
    const month = moment().format("MM");
    // const month = moment().set('month', 0).format("MM");
    this.selectedMonth = `${year}-${month}`;
    await this.getLines();
    this.getGroup();
    this.getZone();
    this.getKanban();
    this.getFreq();
    this.getUsers();
    await this.getSchedules();
  }

};
</script>

<style scoped>
.tableFixHead {
  overflow: auto;
  height: 100vh;
}

.tableFixHead th {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 30;
}

.status-wrapper {
  width: 30px;
  height: 30px;
  background-color: #f0fdf4;
  border-radius: 6px;
}

.check-wrapper {
  width: 30px;
  height: 30px;
  background-color: #e0f2fe;
  border-radius: 100px;
  border: none;
}

.check-wrapper-null {
  width: 30px;
  height: 30px;
  background-color: #f3f4f6;
  border-radius: 100px;
  border: none;
}

.bullet {
  width: 10px;
  height: 10px;
  border: 2px solid black;
  border-radius: 10px;
}

.bullet-filled {
  width: 20px;
  height: 20px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}

.bullet-cancel {
  width: 10px;
  height: 10px;
  background-color: black;
  border: 2px solid black;
  border-radius: 10px;
}

#fixCol-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 70;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 70;
}

#fixCol-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 125px;
  z-index: 70;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 240px;
  z-index: 70;
}

#fixCol-5 {
  position: sticky;
  top: 0px;
  left: 440px;
  z-index: 70;
}

#fixCol-body-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 60;
}

#fixCol-body-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 60;
}

#fixCol-body-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 125px;
  z-index: 60;
}

#fixCol-body-4 {
  position: sticky;
  top: 0px;
  left: 240px;
  z-index: 60;
}

#fixCol-body-5 {
  position: sticky;
  top: 0px;
  left: 440px;
  z-index: 60;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
