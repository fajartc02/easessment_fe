<template>
  <Loading :active="isLoading" :can-cancel="true" :is-full-page="false" />
  <div class="card">
    <div class="card-body" v-if="observation">
      <CInputGroup class="mb-3">
        <CInputGroupText>Line</CInputGroupText>
        <CFormInput :value="observation.line_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Machine</CInputGroupText>
        <CFormInput :value="observation.machine_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Pos</CInputGroupText>
        <CFormInput :value="observation.pos_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Job No.</CInputGroupText>
        <CFormInput :value="observation.job_no" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Job name</CInputGroupText>
        <CFormInput :value="observation.job_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Job Type</CInputGroupText>
        <CFormInput :value="observation.job_type_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Member</CInputGroupText>
        <CFormInput :value="observation.member_nm" disabled />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Plan Date</CInputGroupText>
        <CFormInput :value="observation.plan_check_dt" disabled />
      </CInputGroup>
    </div>
  </div>
  <div class="card mt-1">
    <div class="card-header overflow-auto">
      <div class="row">
        <div class="col-9 my-auto">
          <div class="d-flex align-items-center">
            <b class="mr-3">Data Observasi</b>
            <button
              v-if="resultCheck.length == categories.length"
              class="btn btn-secondary mx-3"
              :disabled="resultCheck.length != 5"
              @click="viewReport()"
            >
              View Report
            </button>
            <CButton
              v-if="resultCheck.length == categories.length"
              color="info"
              @click="
                () => {
                  xlDemo = true
                }
              "
              >Lihat Video</CButton
            >
            <CModal
              size="xl"
              :visible="xlDemo"
              @close="
                () => {
                  xlDemo = false
                }
              "
            >
              <CModalHeader>
                <CModalTitle>Video Observasi SW</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div class="row">
                  <div class="col border-all">
                    <h6>Before & After</h6>
                    <video
                      muted
                      style="width: 100%; height: 100%"
                      autoplay
                      controls
                    >
                      <source src="@/assets/video1.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </CModalBody>
            </CModal>
          </div>
        </div>
        <div class="d-flex col-3 text-right justify-content-around">
          <CButton
            variant="ghost"
            color="info"
            @click="
              () => {
                demoTSK = true
              }
            "
            >{{ tskLabel }}</CButton
          >
          <CModal
            size="xl"
            :visible="demoTSK"
            @close="
              () => {
                demoTSK = false
              }
            "
          >
            <CModalHeader>
              <CModalTitle v-if="observation.job_type_nm">{{
                tskLabel
              }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <vue-pdf-embed v-if="tskFile" :source="tskFile" />
              <h2 v-else>TIDAK ADA {{ tskLabel }}</h2>
            </CModalBody>
          </CModal>
          <CButton
            variant="ghost"
            color="info"
            @click="
              () => {
                demoTSKK = true
              }
            "
            >{{ tskkLabel }}</CButton
          >
          <CModal
            size="xl"
            :visible="demoTSKK"
            @close="
              () => {
                demoTSKK = false
              }
            "
          >
            <CModalHeader>
              <CModalTitle>{{ tskkLabel }}</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <vue-pdf-embed v-if="tskkFile" :source="tskkFile" />
              <h2 v-else>TIDAK ADA {{ tskkLabel }}</h2>
            </CModalBody>
          </CModal>
          <CButton
            variant="ghost"
            color="info"
            @click="
              () => {
                demoSOP = true
              }
            "
            >SOP</CButton
          >
          <CModal
            size="xl"
            :visible="demoSOP"
            @close="
              () => {
                demoSOP = false
              }
            "
          >
            <CModalHeader>
              <CModalTitle>SOP</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <vue-pdf-embed v-if="sopFile" :source="sopFile" />
              <h2 v-else>TIDAK ADA SOP</h2>
            </CModalBody>
          </CModal>
        </div>
      </div>
    </div>
    <div class="card-body overflow-auto">
      <CInputGroup class="mb-3">
        <CInputGroupText style="width: 120px">Actual Date</CInputGroupText>
        <input
          class="form-control"
          type="date"
          v-model="form.actual_check_dt"
        />
        <CInputGroupText class="p-0">
          <CButton
            color="success"
            @click="saveCheckObser(form.actual_check_dt, 'actual_check_dt')"
            style="font-weight: 900"
          >
            Save</CButton
          >
        </CInputGroupText>
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText style="width: 120px">Shift</CInputGroupText>
        <CFormSelect v-model="form.group_id">
          <option disabled selected>Select Shift</option>
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.group_nm }}
          </option>
        </CFormSelect>
        <CInputGroupText class="p-0">
          <CButton
            color="success"
            @click="saveCheckObser(form.group_id, 'group_id')"
            style="font-weight: 900"
          >
            Save</CButton
          >
        </CInputGroupText>
      </CInputGroup>
      <table class="table table-responsive" style="border: 1px solid black">
        <tr>
          <th class="text-center">No</th>
          <th class="p-2">Category</th>
          <th class="p-2">Item Check</th>
          <th class="p-2" style="min-width: 300px">Alat</th>
          <th class="p-2">Methode</th>
          <th class="p-2">Standard</th>
          <th class="p-2">Judgment</th>
          <th class="text-center">Action Check</th>
          <!-- <th class="text-center">Video</th> -->
          <th class="text-center">Findings</th>
          <th class="text-center">Image</th>
        </tr>
        <template v-for="(item, i) in categories" :key="i">
          <tr>
            <td :rowspan="item.sub_categories.length + 1" class="text-center">
              {{ i + 1 }}
            </td>
            <td :rowspan="item.sub_categories.length + 1" class="p-2">
              {{ item.category_nm }}
            </td>
          </tr>
          <tr v-for="(sub_category, i) in item.sub_categories" :key="i">
            <td>
              {{ sub_category?.sub_category_nm }}
            </td>
            <td>
              {{ sub_category?.tool_desc }}
            </td>
            <td>
              {{ sub_category?.methode_desc }}
            </td>
            <td>
              {{ sub_category?.std_desc }}
            </td>
            <td>
              <!-- TYPE 1/2 -->
              <div
                v-if="
                  observation.job_type_nm !== 'Type 3' &&
                  item.category_nm == 'Standarize Work' &&
                  !sub_category?.is_judgment
                "
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <input
                      type="number"
                      v-model="sub_category.stw_ct1"
                      class="form-control text-center"
                      style="width: 70px"
                      placeholder="CT1"
                      :disabled="!isHeaderAreSubmitted"
                    />
                    <button
                      v-if="!intervalAutoCount"
                      class="btn btn-sm btn-primary w-100"
                      @click="toggleTimer(sub_category, true, 'stw_ct1')"
                    >
                      Start
                    </button>
                    <button
                      v-if="keyActiveTimer === 'stw_ct1'"
                      class="btn btn-sm btn-danger w-100"
                      @click="toggleTimer(sub_category, false)"
                    >
                      Stop
                    </button>
                  </div>
                  <div>
                    <input
                      type="number"
                      v-model="sub_category.stw_ct2"
                      class="form-control text-center"
                      style="width: 70px"
                      placeholder="CT2"
                      :disabled="!isHeaderAreSubmitted"
                    />
                    <button
                      v-if="!intervalAutoCount"
                      class="btn btn-sm btn-primary w-100"
                      @click="toggleTimer(sub_category, true, 'stw_ct2')"
                    >
                      Start
                    </button>
                    <button
                      v-if="keyActiveTimer === 'stw_ct2'"
                      class="btn btn-sm btn-danger w-100"
                      @click="toggleTimer(sub_category, false)"
                    >
                      Stop
                    </button>
                  </div>
                  <div>
                    <input
                      type="number"
                      v-model="sub_category.stw_ct3"
                      class="form-control text-center"
                      style="width: 70px"
                      placeholder="CT3"
                      :disabled="!isHeaderAreSubmitted"
                    />
                    <button
                      v-if="!intervalAutoCount"
                      class="btn btn-sm btn-primary w-100"
                      @click="toggleTimer(item, true, 'stw_ct3')"
                    >
                      Start
                    </button>
                    <button
                      v-if="keyActiveTimer === 'stw_ct3'"
                      class="btn btn-sm btn-danger w-100"
                      @click="toggleTimer(item, false)"
                    >
                      Stop
                    </button>
                  </div>
                  <!-- <div>
                    <input type="number" :disabled="item.is_already_check" v-model="item.stw_ct4"
                      class="form-control text-center" style="width: 70px" placeholder="CT4" />
                    <button v-if="!intervalAutoCount" class="btn btn-sm btn-primary w-100"
                      @click="toggleTimer(item, true, 'stw_ct4')">Start</button>
                    <button v-if="keyActiveTimer === 'stw_ct4'" class="btn btn-sm btn-danger w-100"
                      @click="toggleTimer(item, false)">Stop</button>
                  </div>
                  <div>
                    <input type="number" :disabled="item.is_already_check" v-model="item.stw_ct5"
                      class="form-control text-center" style="width: 70px" placeholder="CT5" />
                    <button v-if="!intervalAutoCount" class="btn btn-sm btn-primary w-100"
                      @click="toggleTimer(item, true, 'stw_ct5')">Start</button>
                    <button v-if="keyActiveTimer === 'stw_ct5'" class="btn btn-sm btn-danger w-100"
                      @click="toggleTimer(item, false)">Stop</button>
                  </div> -->
                  <div v-if="item.stw_ct3">
                    <div class="row">
                      <div class="col-12">
                        <span class="badge bg-primary w-100 p-2"
                          >Rata-Rata: {{ judgementAverage.toFixed(2) }}</span
                        >
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <span class="badge bg-success mt-1 w-100"
                          >Persentasi: {{ judgementPrecentage }} %</span
                        >
                      </div>
                    </div>
                  </div>

                  <div v-else>
                    <div class="row">
                      <div class="col-12">
                        <span class="badge bg-primary w-100 p-2"
                          >Rata-Rata: {{ judgementAverage.toFixed(2) }}</span
                        >
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <span class="badge bg-success mt-1 w-100"
                          >Persentasi: {{ judgementPrecentage }} %</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-else-if="
                  item.category_nm == 'Standarize Work' &&
                  observation.job_type_nm === 'Type 3' &&
                  !sub_category?.is_judgment
                "
              >
                <div>
                  <input
                    type="number"
                    v-model="sub_category.stw_ct1"
                    class="form-control text-center"
                    placeholder="CT1"
                    :disabled="!isHeaderAreSubmitted"
                  />
                  <button
                    v-if="!intervalAutoCount"
                    class="btn btn-sm btn-primary w-100"
                    @click="toggleTimer(sub_category, true, 'stw_ct1')"
                  >
                    Start
                  </button>
                  <button
                    v-if="keyActiveTimer === 'stw_ct1'"
                    class="btn btn-sm btn-danger w-100"
                    @click="toggleTimer(sub_category, false)"
                  >
                    Stop
                  </button>
                </div>
                <div v-if="sub_category.stw_ct1">
                  <div class="row">
                    <div class="col-12">
                      <span class="badge bg-primary w-100 p-2"
                        >Rata-Rata: {{ judgementAverage.toFixed(2) }}</span
                      >
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <span class="badge bg-success mt-1 w-100"
                        >Persentasi: {{ judgementPrecentage }} %</span
                      >
                    </div>
                  </div>
                </div>
              </div>
              <CFormSelect
                v-else
                v-model="sub_category.judgment_id"
                :disabled="!isHeaderAreSubmitted"
              >
                <option value="false">Select Judgment</option>
                <option
                  v-for="judg in judgments"
                  :key="judg.id"
                  :value="judg.id"
                >
                  {{ judg.text }}
                </option>
              </CFormSelect>
            </td>
            <!-- Start::UPDATE SAVE CHECK -->
            <td class="text-center">
              <!-- judgments.find((judg) => judg.id == sub_category.judgment_id)?.is_abnormal" -->
              <!-- FIXING JUDGMENT ID -->
              <!-- form.actual_check_dt && form.group_id -->
              <button
                class="btn btn-outline-secondary text-small"
                v-if="!isHeaderAreSubmitted"
                :disabled="true"
              >
                Save Actual Date & Shift Dahulu
              </button>
              <button
                v-else-if="
                  !sub_category.is_already_check &&
                  sub_category.judgment_id &&
                  sub_category.judgment_id != 'false'
                "
                class="btn btn-outline-success"
                @click="saveCheckCategory(sub_category, item)"
                :disabled="sub_category.is_already_check || isLoading"
              >
                Save
              </button>
              <button
                v-else-if="
                  (!sub_category.judgment_id ||
                    sub_category.judgment_id == 'false') &&
                  !sub_category.is_already_check
                "
                class="btn btn-outline-info"
                disabled
              >
                Silahkan isi
              </button>
              <button
                v-else
                class="btn btn-outline-warning"
                @click="updateCheckCategory(sub_category, item)"
                :disabled="isLoading"
              >
                Update
              </button>
            </td>
            <td
              v-if="
                sub_category.is_already_check &&
                judgments.find((judg) => judg.id == sub_category.judgment_id)
                  ?.is_abnormal &&
                sub_category.is_already_check
              "
            >
              <div v-if="sub_category.findings.length == 0">
                <button
                  class="btn btn-info"
                  @click="
                    () => {
                      resetData()
                      sub_category.is_active_modal = true
                      finding.finding_location = observation.pos_nm
                      finding.category_id = sub_category.id
                      finding.obs_result_id = sub_category.obs_result_id
                      mapUsersData()
                    }
                  "
                >
                  Add findings
                </button>
              </div>
              <div class="text-center" v-else>
                {{ sub_category.findings[0]?.finding_desc }}
              </div>

              <!-- modal -->
              <CModal
                scrollable
                alignment="center"
                :visible="sub_category.is_active_modal"
                size="xl"
                backdrop="static"
              >
                <CModalHeader>
                  <CModalTitle
                    >Add temuan ({{ item?.category_nm }}-{{
                      sub_category?.sub_category_nm
                    }})</CModalTitle
                  >
                </CModalHeader>
                <CModalBody>
                  <div>
                    <div class="finding-list mt-3">
                      <h5>Finding data</h5>
                      <div class="mt-2">
                        <div class="mb-2">
                          <label class="mb-1">Tanggal temuan</label>
                          <input
                            type="date"
                            class="form-control"
                            v-model="finding.finding_date"
                          />
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Pos</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="finding.finding_location"
                          />
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Finding description</label>
                          <textarea
                            cols="30"
                            rows="5"
                            class="form-control"
                            v-model="finding.finding_desc"
                          ></textarea>
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Finding Factor</label>
                          <CFormSelect v-model="finding.factor_id">
                            <option>Select Factor</option>
                            <option
                              v-for="factor in factors"
                              :key="factor.text"
                              :value="factor.id"
                            >
                              {{ factor.text }}
                            </option>
                          </CFormSelect>
                        </div>
                        <div class="mb-2">
                          <div>
                            <label class="mb-1">Finding image </label>
                            <input
                              :ref="`finding_image-${i}`"
                              type="file"
                              class="form-control"
                            />
                          </div>
                          <button
                            class="btn btn-info my-2 text-white"
                            :disabled="isUploadLoading"
                            @click="
                              uploadFindingImage(`finding_image-${i}`, finding)
                            "
                          >
                            {{ isUploadLoading ? 'Uploading' : 'Upload' }}
                          </button>
                          <div v-if="selectedFindingImage">
                            <img
                              :src="selectedFindingImage"
                              width="300"
                              alt=""
                            />
                          </div>
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Countermeasure description</label>
                          <textarea
                            cols="30"
                            rows="5"
                            class="form-control"
                            v-model="finding.cm_desc"
                          ></textarea>
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Priority</label>
                          <select
                            class="form-select"
                            v-model="finding.cm_priority"
                          >
                            <option selected>Select priority</option>
                            <option value="P1">
                              P1: Safety and Quality Issue
                            </option>
                            <option value="P2">P2: Productivity Issue</option>
                            <option value="P3">P3: Cost Issue</option>
                          </select>
                        </div>

                        <div class="mb-2">
                          <label class="mb-1">PIC </label>
                          <VueMultiselect
                            v-model="finding.cm_pic_id"
                            :options="picData"
                            :custom-label="customPicOptions"
                          >
                          </VueMultiselect>
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Department Terkait</label>
                          <CFormSelect v-model="finding.department_id">
                            <option>Select Department</option>
                            <option
                              v-for="department in departementsOpts"
                              :key="department.text"
                              :value="department.id"
                            >
                              {{ department.text }}
                            </option>
                          </CFormSelect>
                        </div>
                        <div class="row">
                          <div class="col-12 col-lg-6">
                            <div class="mb-2">
                              <label class="mb-1"
                                >Countermeasure Start Plan Date
                              </label>
                              <input
                                type="date"
                                class="form-control"
                                v-model="finding.cm_str_plan_date"
                              />
                            </div>
                          </div>
                          <div class="col12 col-lg-6">
                            <div class="mb-2">
                              <label class="mb-1"
                                >Countermeasure End Plan Date
                              </label>
                              <input
                                type="date"
                                class="form-control"
                                v-model="finding.cm_end_plan_date"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Countermeasure Factor</label>
                          <CFormSelect v-model="finding.cm_result_factor_id">
                            <option>Select Factor</option>
                            <option
                              v-for="factor in factors"
                              :key="factor.text"
                              :value="factor.id"
                            >
                              {{ factor.text }}
                            </option>
                          </CFormSelect>
                        </div>

                        <hr />

                        <div class="mb-2">
                          <label class="mb-1"
                            >Countermeasure Start actual date</label
                          >
                          <input
                            type="date"
                            class="form-control"
                            v-model="finding.cm_str_act_date"
                            disabled
                          />
                        </div>
                        <div class="mb-2">
                          <label class="mb-1"
                            >Countermeasure End actual date</label
                          >
                          <input
                            type="date"
                            class="form-control"
                            v-model="finding.cm_end_act_date"
                            disabled
                          />
                        </div>
                        <div class="mb-2">
                          <label class="mb-1"
                            >Countermeasure Training date</label
                          >
                          <input
                            type="date"
                            class="form-control"
                            v-model="finding.cm_training_date"
                            disabled
                          />
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Countermeasure Judge</label>
                          <select
                            class="form-select"
                            v-model="finding.cm_judg"
                            disabled
                          >
                            <option>Select judgement</option>
                            <option value="true">Sudah</option>
                            <option value="false">Belum</option>
                          </select>
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Countermeasure Sign LH Red</label>
                          <input type="file" class="form-control" disabled />
                        </div>
                        <div class="mb-2">
                          <label class="mb-1"
                            >Countermeasure Sign LH White</label
                          >
                          <input type="file" class="form-control" disabled />
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Countermeasure Sign SH</label>
                          <input type="file" class="form-control" disabled />
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Kaizen report</label>
                          <input type="file" class="form-control" disabled />
                        </div>
                        <div class="mb-2">
                          <label class="mb-1">Countermeasure Comments</label>
                          <input
                            type="text"
                            class="form-control"
                            disabled
                            v-model="finding.cm_comments"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CModalBody>
                <CModalFooter>
                  <div
                    v-if="
                      findings.filter((fin) => {
                        return fin.category_id == item.id
                      }).length == 0
                    "
                  >
                    <template v-if="!validationFindingMustFilled(finding)">
                      <CButton
                        color="primary"
                        class="text-white"
                        @click="addSingleFinding(finding, item)"
                        :disabled="validationFindingMustFilled(finding)"
                      >
                        Save finding data</CButton
                      >
                    </template>
                    <template v-else>
                      <CButton color="secondary" :disabled="true">
                        Lengkapi Form Dahulu</CButton
                      >
                    </template>
                  </div>
                  <div v-else>
                    <CButton
                      color="primary"
                      class="text-white"
                      @click="
                        updateFindingData(item.id, item.factor_id, finding)
                      "
                      >Update finding data</CButton
                    >
                  </div>
                  <CButton
                    color="secondary"
                    class="text-white mx-2"
                    @click="closeFindingModal(item)"
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </CModal>
            </td>
            <td class="text-center" v-else>
              <i class="text-danger">No Finding</i>
            </td>
            <td class="text-center">
              <div v-if="item.findings[0]?.finding_img">
                <img
                  :src="item.findings[0]?.finding_img"
                  alt="image"
                  height="100"
                  width="200"
                  @click="
                    () => {
                      item.is_active_image = true
                    }
                  "
                />
                <CModal
                  size="xl"
                  :visible="item.is_active_image"
                  @close="
                    () => {
                      item.is_active_image = false
                    }
                  "
                >
                  <CModalBody>
                    <img
                      class="w-100"
                      :src="item.findings[0].finding_img"
                      alt="image"
                      @click="
                        () => {
                          item.is_active_image = true
                        }
                      "
                    />
                  </CModalBody>
                </CModal>
              </div>
              <i class="text-danger" v-else> No Image </i>
            </td>
          </tr>
        </template>
      </table>

      <ObservationVideo
        :observationVideo="observation?.video"
        @on-video-change="videoChange"
      />

      <div class="card chat-card">
        <div class="card-body">
          <div class="comment-sh-container">
            <h5>Comments</h5>
            <div class="chat-box">
              <div
                v-for="(message, index) in chatMessages"
                :key="index"
                :class="[
                  'chat-message',
                  message.noreg === noreg ? 'chat-right' : 'chat-left',
                ]"
              >
                <div class="message-bubble">
                  <strong>
                    {{
                      `${message.name} (${message.noreg || 'Unknown Noreg'})`
                    }}
                  </strong>
                  <p>{{ message.comments }}</p>
                  <span class="timestamp">{{ message.created_at }}</span>
                </div>
              </div>
            </div>
            <div class="chat-input mt-2">
              <input
                type="text"
                v-model="messageInput"
                class="form-control"
                placeholder="Type a message..."
              />
              <button class="btn btn-primary" @click="sendMessage">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  GET_OBSERVATION_DETAIL,
  SAVE_OBSERVATION,
  // SAVE_OBSERVATION_CATEGORY,
  SAVE_OBSERVATION_CATEGORY_V2,
  UPDATE_OBSERVATION_CATEGORY,
} from '@/store/modules/observation.module'
import { POST_OBSERVATION_CHECK } from '@/store/modules/observation.module'
import { GET_USERS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import VuePdfEmbed from 'vue-pdf-embed'
import { toast } from 'vue3-toastify'
import ApiService from '@/store/api.service'
import moment from 'moment'
import Swal from 'sweetalert2'
import VueMultiselect from 'vue-multiselect'
import Loading from 'vue-loading-overlay'
import { ADD_NEW_FINDING } from '@/store/modules/finding.module'
import ObservationVideo from '@/components/ObservationVideo/ObservationVideo.vue'
import { GET_COMMENTS, POST_COMMENTS } from '@/store/modules/comments.module'
import { GET_SYSTEMS } from '@/store/modules/system.module'

export default {
  name: 'NewDetailObservation',
  data() {
    return {
      chatMessages: [],
      messageInput: '',
      userName: localStorage.getItem('name'),
      noreg: localStorage.getItem('noreg'),
      modalShowVideo: false,
      xlDemo: false,
      observation: null,
      isUploadLoading: false,
      form: {
        actual_check_dt: moment().toISOString().split('T')[0],
        group_id: null,
      },
      isHeaderAreSubmitted: false,
      categories: [],
      judgments: [],
      factors: [],
      groups: [],
      resultCheck: [],
      findings: [],
      picData: [],
      isCheck: false,
      demoTSK: false,
      sopFile: null,
      tskFile: null,
      tskkFile: null,
      demoTSKK: false,
      demoSOP: false,
      tskLabel: 'TSK',
      tskkLabel: 'TSKK',
      addFindingsModal: false,
      selectedPIC: null,
      judgementAverage: 0,
      judgementPrecentage: 0,
      judgementID: null,
      comment_ammgr: null,
      comment_sh: null,
      judgementVal: {
        stw_ct1: 50,
        stw_ct2: 50,
        stw_ct3: 50,
        stw_ct4: 50,
        stw_ct5: 50,
      },
      finding: {
        obs_result_id: null,
        line_id: null,
        category_id: null,
        finding_date: moment().format('YYYY-MM-DD'),
        finding_location: '',
        finding_desc: '',
        factor_id: null,
        cm_desc: '',
        cm_priority: 0,
        cm_str_plan_date: '',
        cm_end_plan_date: '',
        cm_str_act_date: null,
        cm_end_act_date: null,
        cm_training_date: null,
        cm_pic_id: '',
        cm_judg: false,
        cm_sign_lh_red: null,
        cm_sign_lh_white: null,
        cm_sign_sh: null,
        cm_comments: null,
        finding_img: null,

        // new related with abnormality apps linkage
        department_id: null,
      },
      departementsOpts: [],
      selectedFindingImage: null,
      TRESHOLD_STW_NG: 3,
      isLoading: false,
      intervalAutoCount: null,
      keyActiveTimer: null,
    }
  },
  watch: {
    observationData: function () {
      if (this.observationData) {
        this.observation = this.observationData[0]
        let resCheckData = this.observationData[1]
        // validation for first save actual date and shift
        // console.log(this.observationData[0].actual_check_dt != 'Invalid Date', 'DATE ACTUAL')
        if (this.observationData[0].actual_check_dt == 'Invalid date') {
          this.isHeaderAreSubmitted = false
        } else {
          this.isHeaderAreSubmitted = true
        }

        if (resCheckData?.length > 0) this.isCheck = true
        let actualDate = this.observationData[0].actual_check_dt
        this.form.actual_check_dt =
          actualDate != 'Invalid date'
            ? moment(new Date(actualDate)).format('YYYY-MM-DD')
            : moment().format('YYYY-MM-DD')
        let actualGroup = this.observationData[0].group_id
        this.form.group_id = actualGroup
        this.sopFile = this.observation.sop
          ? `${process.env.VUE_APP_URL}/file?path=${this.observation.sop}`
          : null
        this.tskFile = this.observation.tsk
          ? `${process.env.VUE_APP_URL}/file?path=${this.observation.tsk}`
          : null
        this.tskkFile = this.observation.tskk
          ? `${process.env.VUE_APP_URL}/file?path=${this.observation.tskk}`
          : null
        this.resultCheck = resCheckData
        this.checkLabelTypeJob(this.observation.job_type_nm)
      }
    },
    ['categories']: {
      handler: function (oldValue, newValue) {
        console.log(newValue)
        newValue.map((element, i) => {
          element.sub_categories.map((child, j) => {
            if (child?.stw_ct3 && child?.stw_ct3 !== 0) {
              let isType3 = false
              if (this.observation?.job_type_nm === 'Type 3') {
                isType3 = true
              }
              this.categories[i].sub_categories[j].judgment_id =
                this.calculateJudgement(child, isType3)
              console.log(this.categories[i].sub_categories[j].judgment_id)
            }
            if (
              this.observation?.job_type_nm === 'Type 3' &&
              child?.stw_ct1 &&
              child?.stw_ct1 !== 0
            ) {
              let isType3 = false
              if (this.observation?.job_type_nm === 'Type 3') {
                isType3 = true
              }
              this.categories[i].sub_categories[j].judgment_id =
                this.calculateJudgement(child, isType3)
              console.log(this.categories[i].sub_categories[j].judgment_id)
            }
            return child
          })
          return element
          //  }
        })
        // }
      },
      deep: true,
    },
    finding: {
      handler() {
        this.validationFindingMustFilled(this.finding)
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(['observationData', 'getUsersOpts']),
  },
  components: {
    VuePdfEmbed,
    VueMultiselect,
    Loading,
    ObservationVideo,
  },
  methods: {
    async getDepartements() {
      try {
        // this for needs linkage abnormality apps
        const response = await this.$store.dispatch(GET_SYSTEMS, {
          system_type: 'OPT_DEPT',
        })
        this.departementsOpts = response.map((item) => {
          return {
            id: item.id,
            text: item.system_value,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    validationFindingMustFilled(finding) {
      if (
        finding?.finding_desc !== '' &&
        finding?.factor_id &&
        finding?.cm_desc !== '' &&
        finding?.cm_priority &&
        finding?.cm_pic_id &&
        finding?.cm_str_plan_date !== '' &&
        finding?.cm_end_plan_date !== '' &&
        finding?.cm_result_factor_id
      ) {
        return false
      }
      return true
    },
    async getComments() {
      try {
        const res = await this.$store.dispatch(GET_COMMENTS, {
          observation_id: this.$route.params.id,
        })
        this.chatMessages = res
      } catch (error) {
        console.error('Failed to get comments:', error)
      }
    },
    async sendMessage() {
      if (this.messageInput.trim()) {
        const name = localStorage.getItem('name')
        const noreg = localStorage.getItem('noreg')
        const now = moment().format('YYYY-MM-DD HH:mm:ss') // Waktu sekarang
        const newComment = {
          observation_id: this.$route.params.id,
          comments: this.messageInput,
          created_dt: now,
          name,
          noreg,
        }

        try {
          await this.$store.dispatch(POST_COMMENTS, newComment)
          this.messageInput = ''
          this.getComments()
        } catch (error) {
          console.error('Failed to post comment:', error)
          toast.error('Failed to send comment. Please try again.')
        }
      }
    },
    videoChange() {
      this.getDetail()
    },
    async toggleTimer(object, statusTimer, key) {
      if (statusTimer) {
        this.keyActiveTimer = key
        this.intervalAutoCount = setInterval(() => {
          object[key] = Number(object[key] || 0) + 1
        }, 1000)
      } else {
        this.keyActiveTimer = null
        clearInterval(this.intervalAutoCount)
        this.intervalAutoCount = null
      }
    },
    async addSingleFinding(findingData, item) {
      try {
        this.isLoading = true
        console.log(item)
        console.log(findingData, 'findingData')
        await this.$store.dispatch(ADD_NEW_FINDING, findingData)
        await this.getDetail()
        await this.getCategories()
        this.isLoading = false
        toast.success('Success to add data', {
          autoClose: 1000,
        })
        item.is_active_modal = false
      } catch (error) {
        console.log(error)
        toast.error(error)
        this.isLoading = false
      }
    },
    async saveCheckCategory(item, category) {
      try {
        this.isLoading = true
        console.log(category, 'category')
        let checkedData = {
          observation_id: this.$route.params.id,
          category_id: category?.uuid,
          sub_category_id: item?.sub_category_id,
          judgment_id:
            (this.observation?.job_type_nm === 'Type 1' ||
              this.observation?.job_type_nm === 'Type 2' ||
              this.observation?.job_type_nm === 'Type 3') &&
            item.id == '3ce06d66-fe82-4e0a-a1fd-ce927ec85167'
              ? this.judgementID
              : item.judgment_id,
          stw_ct1: item.stw_ct1,
          stw_ct2: item.stw_ct2,
          stw_ct3: item.stw_ct3,
          stw_ct4: item.stw_ct4,
          stw_ct5: item.stw_ct5,
        }
        await this.$store.dispatch(SAVE_OBSERVATION_CATEGORY_V2, checkedData)
        this.isLoading = false
        await this.getDetail()
        await this.getCategories()
        toast.success('Success to save data', {
          autoClose: 1000,
        })
      } catch (error) {
        this.isLoading = false
        console.log(error)
        toast.error(JSON.stringify(error))
      }
    },
    async updateCheckCategory(item, category) {
      try {
        this.isLoading = true
        console.log(category, 'category')
        console.log(item, 'item')
        let checkedData = {
          observation_id: this.$route.params.id,
          category_id: category?.uuid,
          sub_category_id: item?.sub_category_id,
          judgment_id: item.judgment_id,
          stw_ct1: item.stw_ct1,
          stw_ct2: item.stw_ct2,
          stw_ct3: item.stw_ct3,
          stw_ct4: item.stw_ct4,
          stw_ct5: item.stw_ct5,
          obs_result_id: item.obs_result_id,
        }
        await this.$store.dispatch(UPDATE_OBSERVATION_CATEGORY, checkedData)
        this.isLoading = false
        await this.getDetail()
        await this.getCategories()
        toast.success('Success to save data', {
          autoClose: 1000,
        })
      } catch (error) {
        this.isLoading = false
        console.log(error)
        toast.error(JSON.stringify(error))
      }
    },
    async saveCheckObser(value, key) {
      try {
        let data = {
          observation_id: this.$route.params.id,
          [`${key}`]: value,
        }
        await this.$store.dispatch(SAVE_OBSERVATION, data)
        toast.success('Success to save data', {
          autoClose: 1000,
        })
        await this.getDetail()
      } catch (error) {
        console.log(error)
        toast.error(error)
      }
    },
    closeFindingModal(item) {
      this.resetData()
      item.is_active_modal = false
      this.getDetail()
    },
    swalConfDel() {
      return Swal.fire({
        title: 'Kamu yakin ingin menghapus finding ini?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Ya',
        denyButtonText: `Tidak`,
      }).then((result) => {
        if (result.isConfirmed) {
          return true
        } else if (result.isDenied) {
          return false
        }
      })
    },
    async deleteFinding(catID) {
      let is_delete = await this.swalConfDel()

      if (is_delete) {
        let filterFinding = this.findings.filter(
          (finding) => finding.category_id != catID,
        )

        this.findings = filterFinding
        Swal.fire('Berhasil menghapus', '', 'success')
      }
    },
    checkLabelTypeJob(jobType) {
      if (jobType == 'Type 3') {
        ;(this.tskLabel = 'Gentani'), (this.tskkLabel = 'Yamazumi')
      } else {
        ;(this.tskLabel = 'TSK'), (this.tskkLabel = 'TSKK')
      }
    },
    viewReport() {
      this.$router.push(
        `/observation/report/${this.observation.observation_id}`,
      )
    },
    async getDetail() {
      try {
        this.isLoading = true
        await this.$store.dispatch(
          GET_OBSERVATION_DETAIL,
          this.$route.params.id,
        )
        this.isLoading = false
      } catch (error) {
        toast.error(JSON.stringify(error))
      }
    },
    async getJudgments() {
      ApiService.setHeader()
      const judgments = await ApiService.get(`master/judgments`)
      this.judgments = judgments.data.data
    },
    async getFactors() {
      ApiService.setHeader()
      const factors = await ApiService.get(`master/factors`)
      this.factors = factors.data.data
    },
    async getGroups() {
      ApiService.setHeader()
      const groups = await ApiService.get(`master/groups`)
      this.groups = groups.data.data
    },
    resetData() {
      this.finding.obs_result_id = null
      this.finding.line_id = this.observation?.line_id
      this.finding.category_id = null
      this.finding.finding_date = moment().format('YYYY-MM-DD')
      this.finding.finding_location = ''
      this.finding.finding_desc = ''
      this.finding.factor_id = null
      this.finding.cm_desc = ''
      this.finding.cm_priority = null
      this.finding.cm_str_plan_date = ''
      this.finding.cm_end_plan_date = ''
      this.finding.cm_str_act_date = null
      this.finding.cm_end_act_date = null
      this.finding.cm_training_date = null
      this.finding.cm_judg = false
      this.finding.cm_sign_lh_red = null
      this.finding.cm_sign_lh_white = null
      this.finding.cm_sign_sh = null
      this.finding.cm_comments = null
      this.finding.cm_pic_id = null
      this.finding.finding_img = null
      this.selectedFindingImage = null
    },
    addFindingData(categoryID, factorID, findings) {
      let data = {
        line_id: this.observation?.line_id,
        category_id: categoryID,
        factor_id: factorID,
        ...findings,
      }
      this.findings.push(data)
      this.addFindingsModal = false
      this.resetData()
    },
    editFinding(categoryID) {
      const data = this.findings.find((obj) => {
        return obj.category_id == categoryID
      })
      this.finding = data
    },
    updateFindingData(categoryID, factorID, findings) {
      this.finding = findings
    },
    async uploadFindingImage(state, finding) {
      let before_path = null
      this.isUploadLoading = true

      if (finding.finding_img) {
        before_path = finding.finding_img
      }

      ApiService.setHeader()

      this.$refs[state][0]
      const image = this.$refs[state][0].files[0]
      const formData = new FormData()
      formData.append('before_path', before_path)
      formData.append('dest', 'findings')
      formData.append('attachment', image)

      const uploadImage = await ApiService.post(
        `/operational/findingCm/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (uploadImage.data.data) {
        toast.success('Finding image uploaded', {
          autoClose: 1000,
        })
        this.isUploadLoading = false
        this.selectedFindingImage = `${process.env.VUE_APP_URL}/file?path=${uploadImage.data.data}`
        this.finding.finding_img = uploadImage.data.data
      }
    },
    calculateJudgement(newValue, isType3 = false) {
      console.log('isType3', isType3)
      console.log('Judgment', newValue)
      if (isType3) {
        const OK_ID = 'c4f5ff30-1b95-4ad8-8af8-e3e9d90bd942'
        const NG_ID = '2e247c66-3e9c-44b6-951a-0a26791ad37d'

        const result = newValue

        let total = result.stw_ct1
        let totalAvg = total / 1

        let totalPrecentage =
          ((Math.max(result.stw_ct1) - Math.min(result.stw_ct1)) /
            2 /
            totalAvg) *
          100
        this.judgementAverage = totalAvg
        let is_nan = Number.isNaN(totalPrecentage)
        this.judgementPrecentage = is_nan ? 0 : totalPrecentage.toFixed()
        if (totalPrecentage.toFixed() >= 10) {
          return NG_ID
        }
        console.log(newValue, isType3, ': masuuuk!')
        return OK_ID
      }
      const OK_ID = 'c4f5ff30-1b95-4ad8-8af8-e3e9d90bd942'
      const NG_ID = '2e247c66-3e9c-44b6-951a-0a26791ad37d'
      console.log(newValue)

      const result = newValue

      let total = result.stw_ct1 + result.stw_ct2 + result.stw_ct3
      // +
      // result.stw_ct4 +
      // result.stw_ct5
      let totalAvg = total / 3

      let totalPrecentage =
        ((Math.max(
          result.stw_ct1,
          result.stw_ct2,
          result.stw_ct3,
          // result.stw_ct4,
          // result.stw_ct5,
        ) -
          Math.min(result.stw_ct1, result.stw_ct2, result.stw_ct3)) /
          2 /
          totalAvg) *
        100
      this.judgementAverage = totalAvg
      let is_nan = Number.isNaN(totalPrecentage)
      console.log(totalPrecentage, totalAvg, 'totalPrecentage,totalAvg')
      this.judgementPrecentage = is_nan ? 0 : totalPrecentage.toFixed()
      console.log(totalPrecentage.toFixed() >= this.TRESHOLD_STW_NG)
      if (totalPrecentage.toFixed() >= this.TRESHOLD_STW_NG) {
        return NG_ID
      } else {
        return OK_ID
      }
    },
    async getCategories() {
      ApiService.setHeader()
      const convertedJobTypeFormat = `${this.observation?.job_type_nm}`
        .toUpperCase()
        .split(' ')
        .join('_')
      const categories = await ApiService.query(
        `master/categories/categories-v2`,
        {
          job_type: convertedJobTypeFormat,
        },
      )
      const mapCategory = await categories.data.data.map((itm) => {
        itm.sub_categories = itm.sub_categories.map((sub_category) => {
          sub_category.judgment_id = null
          sub_category.factor_id = null
          sub_category.stw_ct1 = null
          sub_category.stw_ct2 = null
          sub_category.stw_ct3 = null
          sub_category.stw_ct4 = null
          sub_category.stw_ct5 = null
          sub_category.is_already_check = false
          sub_category.findings = []
          sub_category.is_active_modal = false
          sub_category.is_active_image = false
          sub_category.obs_result_id = null
          let result = this.resultCheck.find(
            (result) => result.sub_category_id == sub_category.sub_category_id,
          )
          if (result) {
            sub_category.is_already_check = true
            sub_category.obs_result_id = result.obs_result_id
            sub_category.judgment_id = result.judgment_id
            sub_category.factor_id = result.factor_id
            sub_category.stw_ct1 = result.stw_ct1
            sub_category.stw_ct2 = result.stw_ct2
            sub_category.stw_ct3 = result.stw_ct3
            sub_category.stw_ct4 = result.stw_ct4
            sub_category.stw_ct5 = result.stw_ct5
            sub_category.findings = result.findings
            let isType3 = false
            if (this.observation?.job_type_nm === 'Type 3') {
              isType3 = true
            }

            this.calculateJudgement(sub_category, isType3)
          }
          return sub_category
        })
        itm.judgment_id = null
        itm.factor_id = null
        itm.stw_ct1 = null
        itm.stw_ct2 = null
        itm.stw_ct3 = null
        itm.stw_ct4 = null
        itm.stw_ct5 = null
        itm.is_already_check = false
        itm.findings = []
        itm.is_active_modal = false
        itm.is_active_image = false
        itm.obs_result_id = null

        return itm
      })

      this.categories = mapCategory
      await this.getJudgments()
      await this.getFactors()
      await this.getGroups()
    },
    async postCheckObs() {
      try {
        this.resultCheck = []
        for (let i = 0; i < this.categories.length; i++) {
          const element = this.categories[i]
          element.category_id = element.id
          let newObj = {
            category_id: element.category_id,
            judgment_id: i == 0 ? this.judgementID : element.judgment_id,
            stw_ct1: element.stw_ct1,
            stw_ct2: element.stw_ct2,
            stw_ct3: element.stw_ct3,
            stw_ct4: element.stw_ct4,
            stw_ct5: element.stw_ct5,
          }
          this.resultCheck.push(newObj)
        }

        if (
          this.resultCheck[0].judgment_id === null ||
          this.resultCheck[1].judgment_id === null ||
          this.resultCheck[2].judgment_id === null ||
          this.resultCheck[3].judgment_id === null ||
          this.resultCheck[4].judgment_id === null
        ) {
          alert('Pilih semua judgement')
        } else {
          let formInput = {
            observation_id: this.$route.params.id,
            group_id: this.observation?.group_id,
            actual_check_dt: this.form.actual_check_dt,
            comment_sh: this.comment_sh,
            comment_ammgr: this.comment_ammgr,
            results_check: JSON.stringify(this.resultCheck),
            findings: JSON.stringify(this.findings),
          }

          await this.$store
            .dispatch(POST_OBSERVATION_CHECK, formInput)
            .then(() => {
              Swal.showLoading()
              Swal.fire('Pengecekan berhasil di submit', '', 'success')
              setTimeout(() => {
                this.$router.push('/stw/dashboard')
              }, 1000)
            })
        }
      } catch (error) {
        console.log(error)
        Swal.fire('Pengecekan gagal di submit', '', 'error')
      }
    },

    // user functions
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
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push({ pic_id: item.id, pic_name: item.text })
      })
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },
  },
  async mounted() {
    const savedUserName = localStorage.getItem('name')
    if (savedUserName) {
      this.userName = savedUserName
    }

    try {
      const comments = await this.$store.dispatch(GET_COMMENTS, {
        observation_id: this.$route.params.id,
      })

      const noreg = localStorage.getItem('noreg')

      this.chatMessages = comments.map((comment) => {
        return {
          ...comment,
          role: comment.noreg === noreg ? 'user' : 'admin',
          created_at: moment(comment.created_at).format('YYYY-MM-DD HH:mm:ss'), // Format waktu
        }
      })
    } catch (error) {
      console.error('Failed to load comments:', error)
      toast.error('Failed to load comments. Please refresh the page.')
    }
    await this.getDetail()
    await this.getCategories()
    await this.getUsers()
    // await this.getFactors()
    // await this.judgments()
    this.finding.finding_location = await this.observation?.pos_nm
    this.finding.line_id = await this.observation?.line_id

    this.getDepartements()
  },
}
</script>


<style>
table,
th,
td {
  border: 1px solid !important;
  padding: 5px 10px;
}

.chat-card {
  width: 100%;
  margin-top: 10px;
  padding: 20px;
}

.comment-sh-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-box {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.chat-message {
  display: flex;
  margin: 10px 0;
  width: 100%;
}

.chat-left .message-bubble {
  background-color: #e9ecef;
  color: #333;
  margin-right: auto;
  border-radius: 15px 15px 15px 5px;
  padding: 10px;
  max-width: 80%;
}

.chat-right .message-bubble {
  background-color: #daf8cb;
  color: #333;
  margin-left: auto;
  border-radius: 15px 15px 5px 15px;
  padding: 10px;
  max-width: 80%;
}

.message-bubble {
  position: relative;
}

.timestamp {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
  display: block;
  text-align: right;
}

.chat-input {
  display: flex;
  align-items: center;
  padding-top: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
}

.chat-input button {
  margin-left: 15px;
  padding: 8px 15px;
  border-radius: 20px;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
