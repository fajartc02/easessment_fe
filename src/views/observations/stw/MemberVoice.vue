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
        <h5>Member Voice List</h5>
        <div class="d-flex">
          <div class="mx-2 d-flex align-items-center">
            <div class="d-flex align-items-center">
              <div style="
                  background-color: transparent;
                  width: 20px;
                  height: 20px;
                  border: 2px dotted black;
                "></div>
              <span class="mx-2">Plan</span>
            </div>
            <div class="d-flex align-items-center">
              <div style="
                  background-color: transparent;
                  width: 20px;
                  height: 20px;
                  border: 2px solid black;
                "></div>
              <span class="mx-2">Actual</span>
            </div>
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
            <button class="btn btn-info text-white mx-2" @click="addMemberVoiceOpenModal()">
              Add member voice
            </button>
            <button :disabled="getMemberVoice?.length < 1" class="btn btn-info text-white w-full my-1">
              <download-excel :data="json_data" :fields="json_fields" worksheet="My Worksheet" name="membervoice.xls">
                Export all data
              </download-excel>
            </button>
          </div>
        </div>
      </div>
      <div style="width: 100%; overflow-x: scroll">
        <div class="tableFixHead">
          <table class="table table-bordered overflow-auto table-stripped">
            <thead class="text-center">
              <tr>
                <th id="fixCol-1" rowspan="3">No</th>
                <th id="fixCol-2" rowspan="3">Line name</th>
                <th id="fixCol-3" rowspan="3">Tanggal</th>
                <th id="fixCol-4" rowspan="3">Lokasi</th>
                <th id="fixCol-5" rowspan="3">Problem</th>
                <th rowspan="3">No Proses</th>
                <th rowspan="3">Kategori</th>
                <th rowspan="3">Penanggulangan</th>
                <th rowspan="3">Hasil Evaluasi</th>
                <th colspan="48">Waktu Pelaksanaan</th>
                <th rowspan="3">PIC</th>
                <th id="fixCol-6" rowspan="3">Score</th>
                <th style="min-width: 500px" rowspan="3">Actions</th>
              </tr>
              <tr>
                <th colspan="4">Jan</th>
                <th colspan="4">Feb</th>
                <th colspan="4">Mar</th>
                <th colspan="4">Apr</th>
                <th colspan="4">Mei</th>
                <th colspan="4">Juny</th>
                <th colspan="4">July</th>
                <th colspan="4">Aug</th>
                <th colspan="4">Sept</th>
                <th colspan="4">Oct</th>
                <th colspan="4">Nov</th>
                <th colspan="4">Dec</th>
              </tr>
              <tr>
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
            <tbody>
              <tr v-if="isLoading">
                <td colspan="40" class="p-0" style="height: 200px">
                  <div class="vl-parent p-0" style="height: 100%">
                    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false"
                      :on-cancel="onCancel" />
                  </div>
                </td>
              </tr>
              <tr v-else v-for="(membervoice, index) in getMemberVoice" :key="membervoice.mv_id">
                <td id="fixCol-1">{{ index + 1 }}</td>
                <td id="fixCol-2">{{ membervoice.line_nm }}</td>
                <td id="fixCol-3">{{ formatTheDate(membervoice.mv_date_finding) }}</td>
                <td id="fixCol-4">{{ membervoice.mv_location }}</td>
                <td id="fixCol-5">{{ membervoice.mv_problem }}</td>
                <td>{{ membervoice.mv_process_no }}</td>
                <td>{{ membervoice.mv_category }}</td>
                <td>{{ membervoice.mv_countermeasure }}</td>
                <td>{{ membervoice.mv_evaluation }}</td>
                <td v-for="week in totalWeek" :key="week" style="min-width: 30px !important; padding: 5px">
                  <div v-if="week == membervoice.w_mv_plan_date - 2
                  " :style="`
                      width: 100%;
                      height: 25px;
                      border-radius: 4px;
                      border: 2px solid #64748b
                      ${membervoice.status_check == 'PROGRESS'
                      ? 'background-color: #fff'
                      : ''
                    };
                      ${membervoice.status_check == 'DELAY'
                      ? 'background-color: #fee2e2'
                      : ''
                    };
                      ${membervoice.status_check == 'DONE'
                      ? 'background-color: #bbf7d0'
                      : ''
                    };
                      `"></div>
                  <div class="mt-1" v-if="
                    week == membervoice.w_mv_actual_date - 2
                  " :style="`
                      width: 100%;
                      height: 25px;
                      border-radius: 4px;
                      border: 2px dotted #64748b
                      ${membervoice.status_check == 'PROGRESS'
                      ? 'background-color: #fff'
                      : ''
                    };
                      ${membervoice.status_check == 'DELAY'
                      ? 'background-color: #fee2e2'
                      : ''
                    };
                      ${membervoice.status_check == 'DONE'
                      ? 'background-color: #bbf7d0'
                      : ''
                    };
                      `"></div>
                </td>
                <td>{{ membervoice.mv_pic_nm }}</td>
                <td id="fixCol-9" class="px-4">
                  <template v-if="membervoice.score && membervoice.score !== 0">
                    <template v-for="labelScore in scoreopts">
                      <label :key="labelScore.score" v-if="labelScore.score === membervoice.score">
                        {{ labelScore.label }}
                      </label>
                    </template>
                  </template>
                </td>

                <td class="d-flex justify-content-between">
                  <button v-if="membervoice.findings[0].finding_img" @click="
                    () => {
                      openFindingImage(membervoice.findings[0].finding_img)
                    }
                  " class="btn btn-info btn-sm text-white w-full my-1 mx-1">
                    Finding image
                  </button>
                  <button v-else class="btn btn-secondary btn-sm" disabled>
                    No Image
                  </button>
                  <button v-if="membervoice.findings[0].cm_image" @click="
                    () => {
                      openFindingImage(membervoice.findings[0].cm_image)
                    }
                  " class="btn btn-info btn-sm text-white w-full my-1 mx-1">
                    C/M image
                  </button>
                  <button v-else class="btn btn-secondary btn-sm w-full my-1 mx-1" disabled>
                    No Image C/M
                  </button>
                  <button :class="{
                    'btn btn-sm w-full my-1 mx-1': true,
                    'btn-info text-white': membervoice.findings[0].kaizen_file,
                    'btn-secondary text-white': !membervoice.findings[0].kaizen_file,
                  }" @click="showKaizenModal(membervoice.findings[0].kaizen_file)"
                    :disabled="!membervoice.findings[0].kaizen_file">
                    Kaizen
                  </button>
                  <button class="btn btn-warning btn-sm text-white w-full my-1 mx-1" @click="() => {
                    detailMVModal = true
                    getDetailMVData(index)
                  }
                  ">
                    Detail
                  </button>
                  <button class="btn btn-info btn-sm text-white my-1" @click="getDetailMVToEdit(index)">
                    Edit
                  </button>
                  <button class="btn btn-danger btn-sm text-white w-full my-1 mx-1"
                    @click="deleteMV(membervoice.mv_id)">
                    Delete
                  </button>
                </td>
              </tr>
              <tr v-if="getMemberVoice?.length < 1">
                <td colspan="60" class="text-center">
                  <h3 class="my-2">Data kosong</h3>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- pagination -->
      <Pagination :totalPages="10" :perPage="10" :currentPage="currentPage" :totalPage="totalPage"
        @changePage="onPageChange" @changeLimit="onPageChangeLimit" />
    </div>

    <!-- Add MV modal -->
    <CModal scrollable size="lg" backdrop="static" alignment="center" :visible="addMemberVoiceModal"
      @close="addMemberVoiceModal = false">
      <CModalHeader>
        <CModalTitle>Add member voice</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Member voice input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Tanggal temuan</label>
                  <input type="date" v-model="memberVoiceData.mv_date_finding" class="form-control" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>
                  <VueMultiselect v-model="selectedLineID" :options="lineData" placeholder=""
                    :custom-label="customLineFilterOptions">
                  </VueMultiselect>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Lokasi</label>
                  <input type="text" class="form-control" v-model="memberVoiceData.mv_location" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Problem</label>
                  <input type="text" class="form-control" v-model="memberVoiceData.mv_problem" @input="() => {
                    findingsData.finding_desc = memberVoiceData.mv_problem
                  }" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">No Proses</label>
                  <input type="text" class="form-control" v-model="memberVoiceData.mv_process_no" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Category </label>
                  <select class="form-select" v-model="memberVoiceData.mv_category">
                    <option disabled>Select category</option>
                    <option value="safety">Safety</option>
                    <option value="kesulitan kerja">Kesulitan kerja</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Faktor </label>
                  <select class="form-select" v-model="memberVoiceData.mv_factor_id" @change="() => {
                    findingsData.factor_id = memberVoiceData.mv_factor_id
                  }">
                    <option disabled>Select Factor</option>
                    <option v-for="factor in factors" :key="factor.text" :value="factor.id">
                      {{ factor.text }}
                    </option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Penanggulangan</label>
                  <input type="text" class="form-control" v-model="memberVoiceData.mv_countermeasure" @input="() => {
                    findingsData.cm_desc = memberVoiceData.mv_countermeasure
                  }" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Plan tgl penganggulangan</label>
                  <input type="date" class="form-control" v-model="memberVoiceData.mv_plan_date" @change="() => {
                    findingsData.cm_str_plan_date = memberVoiceData.mv_plan_date
                  }" />
                </div>

                <div class="mb-2">
                  <label class="mb-1">PIC</label>
                  <!-- here -->
                  <treeselect v-if="getUsersTree" class="w-50" v-model="memberVoiceData.mv_pic_id"
                    :options="getUsersTree" />
                </div>
                <div class="row">
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Aktual tgl penganggulangan</label>
                      <input type="date" class="form-control" v-model="memberVoiceData.mv_actual_date" disabled />
                    </div>
                  </div>
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Eval hasil</label>
                      <input type="text" class="form-control" v-model="memberVoiceData.mv_evaluation" disabled />
                    </div>
                  </div>
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Findings input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Tanggal temuan</label>
                  <input type="date" class="form-control" v-model="memberVoiceData.mv_date_finding" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pos</label>
                  <input type="text" class="form-control" v-model="memberVoiceData.mv_location" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>
                  <VueMultiselect v-model="selectedLineID" :options="lineData" placeholder=""
                    :custom-label="customLineFilterOptions">
                  </VueMultiselect>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Finding description</label>
                  <textarea cols="30" rows="5" class="form-control" v-model="findingsData.finding_desc"></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Countermeasure description</label>
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
                  <treeselect v-if="getUsersTree" class="w-50" v-model="findingsData.cm_pic_id"
                    :options="getUsersTree" />
                  <!-- <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions">
                  </VueMultiselect> -->
                </div>

                <div class="mb-2">
                  <label class="mb-1">Countermeasure Start Plan Date </label>
                  <input type="date" class="form-control" v-model="findingsData.cm_str_plan_date" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Countermeasure End Plan Date </label>
                  <input type="date" class="form-control" v-model="findingsData.cm_end_plan_date" />
                </div>

                <div class="mb-2">
                  <div>
                    <label class="mb-1">Finding image </label>
                    <input ref="mv-finding-image" type="file" class="form-control" />
                  </div>
                  <button class="btn btn-info my-2 text-white" :disabled="isUploadLoading" @click="
                    uploadFindingImage('mv-finding-image', null)
                    ">
                    {{ isUploadLoading ? 'Uploading' : 'Upload' }}
                  </button>
                  <div v-if="selectedFindingImage">
                    <img :src="selectedFindingImage" width="300" alt="" />
                  </div>
                </div>
                <!-- CAN'T implemented -->
                <!-- <div class="card p-2 mb-2">
                  <label>Apakah ada perubahan SOP?</label>
                  <CFormSwitch v-model="findingsData.is_change_sop" />

                </div> -->

                <div class="col-12 col-md-12">
                  <div class="mb-2">
                    <div class="card p-2">
                      <label>PIC Penanggung Jawab <small class="text-info">*TL UP</small></label>
                      <treeselect v-model="findingsData.pic_supervisor_id" :options="getUsersTreeselect2" />
                    </div>
                  </div>
                </div>

                <div class="card p-2 mb-2">
                  <label>Apakah ada Improvement?</label>
                  <CFormSwitch v-model="findingsData.is_need_improvement" />

                </div>

                <div class="row">
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Countermeasure Start actual date</label>
                      <input type="date" class="form-control" v-model="findingsData.cm_str_act_date" disabled />
                    </div>
                  </div>
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Countermeasure End actual date</label>
                      <input type="date" class="form-control" v-model="findingsData.cm_end_act_date" disabled />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Countermeasure Training date</label>
                      <input type="date" class="form-control" v-model="findingsData.cm_training_date" disabled />
                    </div>
                  </div>
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Countermeasure Judge</label>
                      <select class="form-select" v-model="findingsData.cm_judg" disabled>
                        <option selected>Select judgement</option>
                        <option value="true">Sudah</option>
                        <option value="false">Belum</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Countermeasure Sign LH Red</label>
                      <input type="file" class="form-control" disabled />
                    </div>
                  </div>
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Countermeasure Sign LH White</label>
                      <input type="file" class="form-control" disabled />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Countermeasure Sign SH</label>
                      <input type="file" class="form-control" disabled />
                    </div>
                  </div>
                  <div class="col">
                    <div class="mb-2">
                      <label class="mb-1">Countermeasure Comments</label>
                      <input type="text" class="form-control" v-model="findingsData.cm_comments" disabled />
                    </div>
                  </div>
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="addMemberVoiceModal = false">
          Close
        </CButton>
        <CButton color="primary" @click="addMemberVoiceData">Save changes</CButton>
      </CModalFooter>
    </CModal>

    <!-- Edit MV Modal -->
    <CModal scrollable size="lg" backdrop="static" alignment="center" :visible="editMVModal"
      @close="editMVModal = false">
      <CModalHeader>
        <CModalTitle>Edit member voice</CModalTitle>
      </CModalHeader>

      <CModalBody>

        <div class="col" v-if="showScoreField">
          <label>Score</label>
          <select class="form-select" v-model="memberVoiceDetail.mv_score">
            <option v-for="opt in scoreopts" :key="opt.score" :value="opt.score">
              {{ opt.label }}
            </option>
          </select>
          <button class="btn btn-info my-2 btn-sm text-white" @click="
            () => {
              updateScoreMemberVoice()
            }
          ">
            Submit Score
          </button>
        </div>
        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Member voice input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Tanggal temuan</label>
                  <div class="row">
                    <div class="col">
                      <input type="text" class="form-control" disabled :value="formatTheDate(memberVoiceDetail.mv_date_finding)
                        " />
                    </div>
                    <div class="col">
                      <input type="date" v-model="memberVoiceDetail.mv_date_finding" class="form-control" />
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>

                  <div class="row">
                    <div class="col">
                      <input type="text" disabled class="form-control"
                        :value="getLineName(memberVoiceDetail.line_id)" />
                    </div>
                    <div class="col">
                      <VueMultiselect v-model="selectedLineID" :options="lineData" placeholder=""
                        :custom-label="customLineFilterOptions">
                      </VueMultiselect>
                    </div>
                  </div>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Lokasi</label>
                  <input type="text" class="form-control" v-model="memberVoiceDetail.mv_location" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Problem</label>
                  <input type="text" class="form-control" v-model="memberVoiceDetail.mv_problem" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">No Proses</label>
                  <input type="text" class="form-control" v-model="memberVoiceDetail.mv_process_no" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Category </label>
                  <select class="form-select" v-model="memberVoiceDetail.mv_category">
                    <option disabled>Select category</option>
                    <option value="safety">Safety</option>
                    <option value="kesulitan kerja">Kesulitan kerja</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Faktor </label>
                  <select class="form-select" v-model="memberVoiceDetail.mv_factor_id">
                    <option disabled>Select Factor</option>
                    <option v-for="factor in factors" :key="factor.text" :value="factor.id">
                      {{ factor.text }}
                    </option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Penanggulangan</label>
                  <input type="text" class="form-control" v-model="memberVoiceDetail.mv_countermeasure" />
                </div>
                <div class="mb-2">

                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Plan tgl penganggulangan</label>
                      <input type="text" class="form-control" disabled
                        :value="formatTheDate(memberVoiceDetail.mv_plan_date)" />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Tanggal Temuan</label>
                      <input type="date" v-model="memberVoiceDetail.mv_plan_date" class="form-control" />
                      <small class="text-success">*Abaikan jika tidak ingin diubah</small>
                    </div>
                  </div>
                </div>

                <div class="mb-2">

                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Aktual tgl penganggulangan</label>
                      <input type="text" class="form-control" disabled
                        :value="formatTheDate(memberVoiceDetail.mv_actual_date)" />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Aktual tgl penganggulangan</label>
                      <input type="date" v-model="memberVoiceDetail.mv_actual_date" class="form-control" />
                      <small v-if="memberVoiceDetail.mv_actual_date" class="text-success">*Abaikan jika tidak ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan tanggal</small>
                    </div>
                  </div>
                </div>

                <div class="mb-2">

                  <div class="row">
                    <div class="col">
                      <label class="mb-1">PIC</label>
                      <input type="text" disabled class="form-control"
                        :value="getPicName(memberVoiceDetail.mv_pic_id)" />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit PIC</label>
                      <treeselect v-if="getUsersTree" class="w-100" v-model="memberVoiceDetail.mv_pic_id"
                        :options="getUsersTree" />
                      <small v-if="selectedPIC" class="text-success">*Abaikan jika tidak ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan pic</small>
                    </div>
                  </div>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Hasil Evaluasi</label>
                  <input type="text" class="form-control" v-model="memberVoiceDetail.mv_evaluation" />
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Findings input </CAccordionHeader>

            <CAccordionBody>
              <div>
                <div class="mb-2">

                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Tanggal temuan</label>
                      <input type="text" class="form-control" disabled :value="formatTheDate(
                        memberVoiceDetail.findings[0].finding_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Tanggal temuan</label>
                      <input type="date" class="form-control" v-model="memberVoiceDetail.findings[0].finding_date" />
                      <small v-if="memberVoiceDetail.findings[0].finding_date" class="text-success">*Abaikan jika tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan tanggal</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">

                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Line</label>
                      <input type="text" disabled class="form-control" :value="getLineName(memberVoiceDetail.findings[0].line_id)
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Line</label>
                      <VueMultiselect v-model="selectedFindingLineID" :options="lineData"
                        :custom-label="customLineFilterOptions">
                      </VueMultiselect>
                      <small v-if="selectedFindingLineID" class="text-success">*Abaikan jika tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan line</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pos</label>
                  <input type="text" class="form-control" v-model="memberVoiceDetail.findings[0].finding_location" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Finding description</label>
                  <textarea cols="30" rows="5" class="form-control"
                    v-model="memberVoiceDetail.findings[0].finding_desc"></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Countermeasure description</label>
                  <textarea cols="30" rows="5" class="form-control"
                    v-model="memberVoiceDetail.findings[0].cm_desc"></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Priority</label>
                  <select class="form-select" v-model="memberVoiceDetail.findings[0].cm_priority">
                    <option selected>Select priority</option>
                    <option value="P1">P1: Safety & Quality Issue</option>
                    <option value="P2">P2: Productivity Issue</option>
                    <option value="P3">P3: Cost Issue</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Faktor </label>
                  <select class="form-select" v-model="memberVoiceDetail.findings[0].factor_id">
                    <option disabled>Select Factor</option>
                    <option v-for="factor in factors" :key="factor.text" :value="factor.id">
                      {{ factor.text }}
                    </option>
                  </select>
                </div>

                <div class="mb-2">

                  <div class="row">
                    <div class="col">
                      <label class="mb-1">PIC</label>
                      <input type="text" disabled class="form-control" :value="getPicName(memberVoiceDetail.findings[0].cm_pic_id)
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit PIC</label>
                      <treeselect class="w-100" v-if="getUsersTree" v-model="memberVoiceDetail.findings[0].cm_pic_id"
                        :options="getUsersTree" />
                      <small v-if="selectedFindingPIC" class="text-success">*Abaikan jika tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan pic</small>
                    </div>
                  </div>
                </div>

                <div class="mb-2">
                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Countermeasure Start Plan Date </label>
                      <input type="text" class="form-control" disabled :value="formatTheDate(
                        memberVoiceDetail.findings[0].cm_str_plan_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure Start Plan Date </label>
                      <input type="date" class="form-control"
                        v-model="memberVoiceDetail.findings[0].cm_str_plan_date" />
                      <small v-if="memberVoiceDetail.findings[0].cm_str_plan_date" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan tanggal</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Countermeasure End Plan Date </label>
                      <input type="text" class="form-control" disabled :value="formatTheDate(
                        memberVoiceDetail.findings[0].cm_end_plan_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure End Plan Date </label>
                      <input type="date" class="form-control"
                        v-model="memberVoiceDetail.findings[0].cm_end_plan_date" />
                      <small v-if="memberVoiceDetail.findings[0].cm_end_plan_date" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan tanggal</small>
                    </div>
                  </div>
                </div>

                <hr />

                <div class="mb-2">
                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Countermeasure Start actual date</label>
                      <input type="text" class="form-control" disabled :value="formatTheDate(
                        memberVoiceDetail.findings[0].cm_str_act_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure Start actual date</label>
                      <input type="date" class="form-control" v-model="memberVoiceDetail.findings[0].cm_str_act_date" />
                      <small v-if="memberVoiceDetail.findings[0].cm_str_act_date" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan tanggal</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Countermeasure End actual date</label>
                      <input type="text" class="form-control" disabled :value="formatTheDate(
                        memberVoiceDetail.findings[0].cm_end_act_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure End actual date</label>
                      <input type="date" class="form-control" v-model="memberVoiceDetail.findings[0].cm_end_act_date" />
                      <small v-if="memberVoiceDetail.findings[0].cm_end_act_date" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan tanggal</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Countermeasure Training date</label>
                      <input type="text" class="form-control" disabled :value="formatTheDate(
                        memberVoiceDetail.findings[0].cm_training_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure Training date</label>
                      <input type="date" class="form-control"
                        v-model="memberVoiceDetail.findings[0].cm_training_date" />
                      <small v-if="memberVoiceDetail.findings[0].cm_training_date" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan tanggal</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Countermeasure Judge</label>
                  <select class="form-select" v-model="memberVoiceDetail.findings[0].cm_judg">
                    <option selected>Select judgement</option>
                    <option value="true">Sudah</option>
                    <option value="false">Belum</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Countermeasure Comments</label>
                  <input type="text" class="form-control" v-model="memberVoiceDetail.findings[0].cm_comments" />
                </div>

                <div class="mb-2">
                  <label class="mb-1">Finding image </label> <br>
                  <img v-if="memberVoiceDetail.findings[0].finding_img" :src="memberVoiceDetail.findings[0].finding_img"
                    alt="image" class="img-fluid rounded mb-2" width="100" style="cursor: pointer"
                    @click="showFindingImg(memberVoiceDetail.findings[0].finding_img)" />
                  <input ref="mv-finding-image" type="file" class="form-control" />
                  <button class="btn btn-info my-2 text-white" :disabled="isUploadLoading" @click="
                    uploadFindingImage('mv-finding-image', memberVoiceDetail.findings[0].finding_img)
                    ">
                    {{ isUploadLoading ? 'Updating' : 'Update image' }}
                  </button>
                  <div v-if="selectedFindingImage">
                    <img :src="selectedFindingImage" width="300" alt="" />
                  </div>
                </div>
                <!-- CAN'T implemented -->
                <!-- <div class="card p-2 mb-2">
                  <label>Apakah ada perubahan SOP?</label>
                  <CFormSwitch v-model="memberVoiceDetail.findings[0].is_change_sop" />
                  <div v-if="memberVoiceDetail.findings[0].is_change_sop" class="col-12 col-md-12">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>SOP</CInputGroupText>
                      <CFormInput aria-label="Input your kaizen file" ref="kanban_sop" class="form-control" type="file"
                        @change="onChangeSopFile($event)" />
                      <CInputGroupText class="p-0">
                        <button class="btn btn-sm btn-success" @click="uploadSopFile()" :disabled="isLoading">Upload
                          SOP</button>
                      </CInputGroupText>
                    </CInputGroup>
                  </div>
                </div> -->

                <!-- IMG FOR CM -->
                <div class="card card-body mb-2">
                  <CInputGroup>
                    <CInputGroupText>C/M Image</CInputGroupText>
                    <CFormInput @change="onChangeCmImage($event)" ref="cm_image" aria-label="Input your kaizen file"
                      type="file" />
                    <CInputGroupText class="p-0">
                      <button class="btn btn-sm btn-success" @click="uploadCmImage(selectedFindingID)"
                        :disabled="isLoading">Upload
                        Image</button>
                    </CInputGroupText>
                  </CInputGroup>
                  <label> CM Image</label>
                  <br>
                  <img v-if="memberVoiceDetail.findings[0].cm_image" :src="memberVoiceDetail.findings[0].cm_image"
                    alt="image" class="img-fluid rounded mb-2" width="100" style="cursor: pointer"
                    @click="showFindingImg(memberVoiceDetail.findings[0].cm_image)" />
                  <label class="text-secondary" v-else>Tidak ada cm image</label>
                </div>

                <div class="col-12 col-md-12">
                  <div class="mb-2">
                    <div class="card p-2">
                      <label>PIC Penanggung Jawab <small class="text-info">*TL UP</small></label>
                      <treeselect v-model="memberVoiceDetail.findings[0].pic_supervisor_id"
                        :options="getUsersTreeselect2" />
                    </div>
                  </div>
                </div>

                <div class="card p-2 mb-2">
                  <label>Apakah ada Improvement?</label>
                  <CFormSwitch v-model="memberVoiceDetail.findings[0].is_need_improvement" />
                  <div v-if="memberVoiceDetail.findings[0].is_need_improvement" class="row">
                    <div class="col-12 col-md-12">
                      <CInputGroup class="mb-3">
                        <CInputGroupText>Kaizen File</CInputGroupText>
                        <CFormInput @change="onChangeKaizenFile($event)" ref="kaizen_file"
                          aria-label="Input your kaizen file" type="file" />
                        <CInputGroupText class="p-0">
                          <button class="btn btn-sm btn-success" @click="uploadKaizen(selectedFindingID)"
                            :disabled="isLoading">Upload
                            Kaizen</button>
                        </CInputGroupText>
                      </CInputGroup>
                    </div>
                  </div>
                </div>
              </div>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="editMVModal = false">
          Close
        </CButton>
        <CButton color="primary" @click="updateMemberVoiceData">Update data</CButton>
      </CModalFooter>
    </CModal>

    <!-- MV Detail modal -->
    <CModal backdrop="static" alignment="center" :visible="detailMVModal" @close="detailMVModal = false" size="xl"
      scrollable>
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
                <input type="date" class="form-control" :value="formatTheDate(detailMVData?.mv_date_finding)"
                  disabled />
              </div>
              <div class="mb-2">
                <label class="mb-1">Line</label>
                <input type="text" class="form-control" :value="detailMVData?.line_nm" disabled />
              </div>
              <div class="mb-2">
                <label class="mb-1">MV Problem</label>
                <input type="text" class="form-control" :value="detailMVData?.mv_problem" disabled />
              </div>
              <div class="mb-2">
                <label class="mb-1">MV Location</label>
                <textarea cols="30" rows="5" class="form-control" :value="detailMVData?.mv_location"
                  disabled></textarea>
              </div>
              <div class="mb-2">
                <label class="mb-1">MV No process</label>
                <textarea cols="30" rows="5" class="form-control" :value="detailMVData?.mv_process_no"
                  disabled></textarea>
              </div>
              <div class="mb-2">
                <label class="mb-1">MV Category</label>
                <textarea cols="30" rows="5" class="form-control" :value="detailMVData?.mv_category"
                  disabled></textarea>
              </div>
              <div class="mb-2">
                <label class="mb-1">Penanggulangan</label>
                <textarea cols="30" rows="5" class="form-control" :value="detailMVData?.mv_countermeasure"
                  disabled></textarea>
              </div>
              <div class="mb-2">
                <label class="mb-1">PIC</label>
                <textarea cols="30" rows="5" class="form-control" :value="detailMVData?.mv_pic_nm" disabled></textarea>
              </div>
            </CAccordionBody>
          </CAccordionItem>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Findings </CAccordionHeader>
            <CAccordionBody>
              <table class="table table-striped table-bordered">
                <thead>
                  <th>No</th>
                  <th>Line</th>
                  <th>Location</th>
                  <th>Desc</th>
                  <th>Priority</th>
                  <th>Countermeasure act str date</th>
                  <th>Countermeasure act end date</th>
                  <th>Countermeasure judge</th>
                  <th>Countermeasure comments</th>
                  <th>Status</th>
                  <th>Finding Img</th>
                </thead>
                <tbody>
                  <tr v-for="(finding, findingIndex) in detailMVData?.findings" :key="findingIndex">
                    <td>{{ findingIndex + 1 }}</td>
                    <td>{{ finding?.line_nm }}</td>
                    <td>{{ finding?.finding_location }}</td>
                    <td>{{ finding?.finding_desc }}</td>
                    <td>{{ finding?.cm_priority }}</td>
                    <td>{{ formatTheDate(finding?.cm_str_act_date) }}</td>
                    <td>{{ formatTheDate(finding?.cm_end_act_date) }}</td>
                    <td>{{ finding?.cm_judg }}</td>
                    <td>{{ finding?.cm_comments }}</td>
                    <td>{{ finding?.status_finding }}</td>
                    <td>
                      <img v-if="finding?.finding_img" :src="finding?.finding_img" alt="image" class="img-fluid rounded"
                        width="100" style="cursor: pointer" @click="showFindingImg(finding?.finding_img)" />
                      <div v-else>
                        No finding img
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
        <div></div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="detailMVModal = false">
          Close
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- Finding image modal -->
    <CModal backdrop="static" alignment="center" :visible="findingImageModal" @close="findingImageModal = false"
      size="xl" scrollable>
      <CModalHeader>
        <CModalTitle>Finding Image Detail</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <img :src="selectedFindingImageToDisplay" width="100%" alt="" />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="() => {
          findingImageModal = false
        }
        ">
          Close
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- Kaizen Modal -->
    <CModal backdrop="static" size="xl" :visible="isKaizenModal" @close="
      () => {
        isKaizenModal = false
      }
    ">
      <CModalHeader>
        <CModalTitle>Kaizen Report</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <table class="table table-bordered">
          <tr>
            <td class="text-center">
              <img v-if="kaizenFile && !kaizenFile.includes('.pdf')" :src="kaizenFile" width="400" alt="KZ" />
              <vue-pdf-embed v-else-if="kaizenFile && kaizenFile.includes('.pdf')" :source="kaizenFile" />
              <h3 v-else>No Kaizen</h3>
            </td>
          </tr>
        </table>
      </CModalBody>
    </CModal>
  </div>
</template>

<script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_USERS } from '@/store/modules/user.module'
import {
  GET_MEMBERVOICE,
} from '@/store/modules/membervoice.module'
import { mapGetters } from 'vuex'
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'
import ApiService from '@/store/api.service'
import Loading from 'vue-loading-overlay'
import { toast } from 'vue3-toastify'
import Pagination from '@/components/Pagination.vue'

import Treeselect from '@cholakovdev/vue3-treeselect'
import '@cholakovdev/vue3-treeselect/dist/vue3-treeselect.css'
import SCORE_MOCK from '@/mocks/score.mock'
export default {
  name: 'Member Voice',
  data() {
    return {

      json_fields: {
        id: 'mv_id',
        Date: 'mv_date_finding',
        Problem: 'mv_problem',
        'Location': 'mv_location',
        'Process': 'mv_process_no',
        'Category': 'mv_category',
        'Countermeasure': 'mv_countermeasure',
        'C/M Plan Date': 'mv_plan_date',
        'Plan Date': 'cm_str_plan_date',
        'Actual Date': 'cm_str_act_date',
        'PIC': 'mv_pic_nm',
        Status: 'cm_status'
      },
      showScoreField: false,
      json_data: null,
      isLoading: false,
      isUploadLoading: false,
      currentPage: 1,
      currentPageLimit: 10,
      totalWeek: 48,
      lineData: [],
      selectedMonth: null,
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      addMemberVoiceModal: false,
      findingImageModal: false,
      selectedLine: null, // init and filter line state
      detailMVModal: false,
      editMVModal: false,
      picData: [],
      selectedPIC: null,
      selectedFactor: null,
      selectedLineID: null,
      selectedFindingPIC: null,
      selectedFindingLineID: null,
      factors: [],
      categories: [],
      detailMVData: null,
      memberVoiceDetail: null,
      selectedMVID: null,
      memberVoiceData: {
        mv_date_finding: moment().format('YYYY-MM-DD'),
        mv_location: null,
        mv_problem: null,
        mv_process_no: null,
        mv_category: null,
        mv_factor_id: null,
        mv_countermeasure: null,
        mv_evaluation: null,
        mv_plan_date: null,
        mv_actual_date: null,
        mv_pic_id: null,
        line_id: null,
        mv_score: null,
      },
      // findings data
      findingsData: {
        line_id: null,
        finding_date: moment().format('YYYY-MM-DD'),
        finding_location: null,
        finding_desc: null,
        cm_desc: null,
        cm_priority: 0,
        category_id: null,
        factor_id: null,
        cm_pic_id: null,
        finding_img: null,
        cm_str_plan_date: null,
        cm_end_plan_date: null,
        cm_result_factor_id: null,
        cm_str_act_date: null,
        cm_end_act_date: null,
        cm_training_date: null,
        cm_judg: false,
        cm_sign_lh_red: null,
        cm_sign_lh_white: null,
        cm_sign_sh: null,
        cm_comments: null,
      },

      memberVoiceDataReadyToUpload: {},
      accordionAddMVActiveKey: 1,
      selectedFindingImage: null,
      selectedFindingImageToDisplay: null,
      selectedFindingImageToUpdate: null,
      totalPage: 0,
      scoreopts: SCORE_MOCK,

      // additional for kaizen file
      kaizenFile: null,
      cmImage: null,
      isKaizenModal: false
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getUsersTree', 'getMemberVoice', 'getUsersOpts', 'getUsersTreeselect2']),
  },
  watch: {
    selectedPIC(newVal) {
      if (newVal) {
        this.accordionAddMVActiveKey = 2
      }
    },
    ['memberVoiceData.mv_date_finding'](newVal) {
      console.log(newVal)
      this.findingsData.finding_date = newVal
    }
  },
  updated() {
    this.mapLinesData()
    this.mapUsersData()
  },
  methods: {
    openFindingImage(findingImage) {
      this.findingImageModal = true
      this.selectedFindingImageToDisplay = findingImage
    },
    showKaizenModal(kaizenFile) {
      this.kaizenFile = kaizenFile
      this.isKaizenModal = true
    },
    async uploadCmImage() {
      this.isLoading = true
      if (!this.cmImage) {
        toast.info('Please select file')
        this.isLoading = false
        return
      }

      try {
        const formData = new FormData()
        formData.append('finding_id', this.memberVoiceDetail.findings[0].finding_id)
        formData.append('dest', 'findings')
        formData.append(
          'cm_image',
          this.cmImage,
        )
        await ApiService.post(
          `/operational/findingCm/upload-cm-image?dest=findings`,
          formData,
        )

        toast.success('Susccessfully Upload Cm image', {
          autoClose: 1000,
        })
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        console.log('uploadKaizen', e)
        toast.error(JSON.stringify(e.message))
      }
    },
    onChangeCmImage(event) {
      this.cmImage = event.target.files[0]
    },
    async uploadKaizen(finding_id, kaizen_file = null) {
      this.isLoading = true
      if (!kaizen_file && !this.kaizenFile) {
        toast.info('Please select file')
        this.isLoading = false
        return
      }

      try {
        const formData = new FormData()
        formData.append('finding_id', this.memberVoiceDetail.findings[0].finding_id)
        formData.append('dest', 'pinkSheet')
        formData.append(
          'kaizen_file',
          kaizen_file ? kaizen_file : this.kaizenFile,
        )

        await ApiService.post(
          `/operational/findingCm/upload-kaizen?dest=pinkSheet`,
          formData,
        )
        toast.success('Susccessfully Upload Kaizen', {
          autoClose: 1000,
        })
        this.isLoading = false
      } catch (e) {
        console.log('uploadKaizen', e)
        this.isLoading = false
        toast.error(JSON.stringify(e.message))
      }
    },
    onChangeKaizenFile(event) {
      this.kaizenFile = event.target.files[0]
    },
    onPageChange(page, type) {
      if (type == 'prev') {
        this.currentPage = this.currentPage - 1
        this.getFindingsFunc()
      }

      if (type == 'next') {
        this.currentPage = this.currentPage + 1
        this.getFindingsFunc()
      }

      if (type == 'fromnumber') {
        this.currentPage = page
        this.getFindingsFunc()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getMemberVoices()
    },
    async addMemberVoiceOpenModal() {
      await this.getUsers()
      await this.mapUsersData()
      this.addMemberVoiceModal = true
    },
    async uploadFindingImage(state, oldFindingImg) {
      ApiService.setHeader()
      let before_path = null
      this.isUploadLoading = true

      if (oldFindingImg !== null) {
        before_path = oldFindingImg
      } else {
        before_path = null
      }

      this.$refs[state]
      const image = this.$refs[state].files[0]
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
          autoClose: 700
        })
        this.isUploadLoading = false
        this.selectedFindingImage = `${process.env.VUE_APP_URL}/file?path=${uploadImage.data.data}`
        this.findingsData.finding_img = uploadImage.data.data
        this.selectedFindingImageToUpdate = uploadImage.data.data
      }

    },
    showFindingImg(findingImg) {
      this.findingImageModal = true
      this.selectedFindingImageToDisplay = findingImg
    },
    addMemberVoiceData() {
      this.memberVoiceData.line_id = this.selectedLineID?.line_id
      // this.memberVoiceData.mv_pic_id = this.selectedPIC?.id
      this.findingsData.line_id = this.selectedLineID?.line_id
      this.findingsData.cm_result_factor_id = this.findingsData?.factor_id
      // this.findingsData.cm_pic_id = this.selectedPIC?.id
      this.findingsData.finding_location = this.memberVoiceData.mv_location
      console.log(this.findingsData)
      if (!this.findingsData.finding_img || !this.findingsData.line_id || !this.findingsData.cm_pic_id || !this.findingsData.finding_location || !this.findingsData.finding_desc || !this.findingsData.finding_location || !this.findingsData.cm_desc || !this.findingsData.cm_priority || !this.findingsData.factor_id || !this.findingsData.cm_str_plan_date || !this.findingsData.cm_end_plan_date) {
        toast.error('Harap isi semua field di finding', {
          autoClose: 1000
        })
      } else {
        let data = {
          ...this.memberVoiceData,
          findings: this.findingsData,
        }

        this.addMemberVoice(data)
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
    async getMemberVoices() {
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
        this.$store.dispatch(GET_MEMBERVOICE, objQuery).then((res) => {
          if (res) {
            this.totalPage = res[0]?.total_page
            this.isLoading = false
            if (res.length > 0) {
              const remapFinding = res.map(itm => {
                return {
                  ...itm,
                  cm_desc: itm.findings[0].cm_desc,
                  cm_str_plan_date: itm.findings[0].cm_str_plan_date,
                  cm_str_act_date: itm.findings[0].cm_str_act_date,
                  cm_status: itm.findings[0].cm_judg ? 'Closed' : 'Open',
                }
              })
              this.json_data = remapFinding
              return
            }
            this.json_data = res
          }
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        this.isLoading = false
      }
    },
    async addMemberVoice(data) {
      try {
        ApiService.setHeader()
        ApiService.post(
          `operational/member-voice/add`,
          data,
        ).then(res => {
          if (res.data.message == 'Success to POST Member Voice') {
            toast.success('Data added', {
              autoClose: 1000
            })
            this.getMemberVoices()
            this.addMemberVoiceModal = false
          } else {
            this.addMemberVoiceModal = false
            toast.error('Failed to add data', {
              autoClose: 1000
            })
          }
        })
      } catch (error) {
        console.log(error)
        toast.error('Internal server error', {
          autoClose: 1000
        })
        this.editFocusThemeModal = false
      }
    },
    deleteMV(MVID) {
      Swal.fire({
        title: 'Are you sure to delete this member voice?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          ApiService.setHeader()
          ApiService.delete(
            `operational/member-voice/delete/${MVID}`,
          ).then(res => {
            if (res.data.message == 'Success to DELETE Member Voice') {
              toast.success('Data deleted', {
                autoClose: 1000
              })
              this.getMemberVoices()
            } else {
              toast.error('Failed to delete data', {
                autoClose: 1000
              })
            }
          })
        } else if (result.isDenied) {
          Swal.fire('Canceled', '', 'info')
        }
      })
    },
    updateMemberVoiceData() {
      const updateData = {
        mv_date_finding: this.formatTheDate(
          this.memberVoiceDetail.mv_date_finding,
        ),
        mv_score: this.memberVoiceDetail.mv_score,
        mv_location: this.memberVoiceDetail.mv_location,
        mv_problem: this.memberVoiceDetail.mv_problem,
        mv_process_no: this.memberVoiceDetail.mv_process_no,
        mv_category: this.memberVoiceDetail.mv_category,
        mv_factor_id: this.memberVoiceDetail.mv_factor_id,
        mv_countermeasure: this.memberVoiceDetail.mv_countermeasure,
        mv_evaluation: this.memberVoiceDetail.mv_evaluation,
        mv_plan_date: this.formatTheDate(this.memberVoiceDetail.mv_plan_date),
        mv_actual_date: this.formatTheDate(
          this.memberVoiceDetail.mv_actual_date,
        ),
        mv_pic_id: this.memberVoiceDetail.mv_pic_id,
        line_id: this.selectedLineID
          ? this.selectedLineID.line_id
          : this.memberVoiceDetail.line_id,
        findings: {
          line_id: this.selectedFindingLineID
            ? this.selectedFindingLineID.line_id
            : this.memberVoiceDetail.findings[0].line_id,
          finding_date: this.formatTheDate(
            this.memberVoiceDetail.findings[0].finding_date,
          ),
          finding_location: this.memberVoiceDetail.findings[0].finding_location,
          finding_desc: this.memberVoiceDetail.findings[0].finding_desc,
          cm_desc: this.memberVoiceDetail.findings[0].cm_desc,
          cm_priority: this.memberVoiceDetail.findings[0].cm_priority,
          category_id: null,
          factor_id: this.memberVoiceDetail.findings[0].factor_id,
          cm_pic_id: this.memberVoiceDetail.findings[0].cm_pic_id,
          cm_str_plan_date: this.formatTheDate(
            this.memberVoiceDetail.findings[0].cm_str_plan_date,
          ),
          cm_end_plan_date: this.formatTheDate(
            this.memberVoiceDetail.findings[0].cm_end_plan_date,
          ),
          cm_result_factor_id: this.memberVoiceDetail.findings[0].factor_id,
          cm_str_act_date: this.memberVoiceDetail.findings[0].cm_str_act_date
            ? this.formatTheDate(
              this.memberVoiceDetail.findings[0].cm_str_act_date,
            )
            : null,
          cm_end_act_date: this.memberVoiceDetail.findings[0].cm_end_act_date
            ? this.formatTheDate(
              this.memberVoiceDetail.findings[0].cm_end_act_date,
            )
            : null,
          cm_training_date: this.memberVoiceDetail.findings[0].cm_training_date
            ? this.formatTheDate(
              this.memberVoiceDetail.findings[0].cm_training_date,
            )
            : null,
          cm_judg: this.memberVoiceDetail.findings[0].cm_judg,
          cm_sign_lh_red: null,
          cm_sign_lh_white: null,
          cm_sign_sh: null,
          cm_comments: this.memberVoiceDetail.findings[0].cm_comments,
          is_need_improvement: this.memberVoiceDetail.findings[0]
            .is_need_improvement,
          finding_img: this.selectedFindingImageToUpdate,
          pic_supervisor_id: this.findingsData.pic_supervisor_id ? this.findingsData.pic_supervisor_id : this.memberVoiceDetail.findings[0].pic_supervisor_id
        },
      }

      this.updateMemberVoice(updateData)
    },
    async updateScoreMemberVoice() {
      try {
        const MVID = this.selectedMVID
        const data = { score: this.memberVoiceDetail.mv_score, }
        ApiService.setHeader()
        ApiService.put(
          `operational/member-voice/score/${MVID}`,
          data,
        )
          .then(res => {
            if (res.data.message == 'Success to EDIT Score of MV') {
              toast.success('Data added', {
                autoClose: 1000
              })
              this.getMemberVoices()
              this.editMVModal = false
            } else {
              Swal.fire('Error', '', 'warning')
            }
          })
      } catch (error) {
        console.log(error)
        Swal.fire('Failed to update MV   data', '', 'error')
        this.editMVModal = false
      }
    },
    updateMemberVoice(data) {
      const MVID = this.selectedMVID

      try {
        ApiService.setHeader()
        ApiService.put(
          `operational/member-voice/edit/${MVID}`,
          data,
        ).then(res => {
          if (res.data.message == 'Success to EDIT Member Voice') {
            this.editMVModal = false
            toast.success('Data updated', {
              autoClose: 1000
            })
            this.getMemberVoices()
            this.selectedFindingImage = null
            this.selectedFindingImageToDisplay = null
            this.selectedFindingImageToUpdate = null
          } else {
            toast.error('Failed to update data', {
              autoClose: 1000
            })
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

    AccesibilityScore() {
      const role = localStorage.getItem('role')
      this.showScoreField = role != 'TM' && role != 'null'
    },

    customLineFilterOptions({ line_name }) {
      return `${line_name}`
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },

    formatTheDate(val) {
      if (val) {
        const year = val.split('T')[0].split('-')[0]
        const month = val.split('T')[0].split('-')[1]
        const day = val.split('T')[0].split('-')[2]

        return `${year}-${month}-${day}`
      }
    },
    getDetailMVData(MVIndex) {
      const data = this.getMemberVoice[MVIndex]
      this.detailMVData = data
    },
    getDetailMVToEdit(MVIndex) {
      this.editMVModal = true
      const data = this.getMemberVoice[MVIndex]
      this.selectedMVID = data.mv_id
      this.memberVoiceDetail = data
    },
    addFilter() {
      this.getMemberVoices()
    },
    getLineName(lineID) {
      if (lineID) {
        const data = this.getLinesOpts.filter((line) => {
          return line.id === lineID
        })

        return data[0].text
      }
    },
    getPicName(picID) {
      const data = this.getUsersTree.find((pic) => pic.id === picID)
      return data?.label
    },
    activateFindingsAccordionItem() {
      this.accordionAddMVActiveKey = 2
    },
  },
  async mounted() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : `0${new Date().getMonth() + 1}`
    const lastDateThisMonth = new Date(year, month, 0).getDate()
    this.selectedMonth = `${year}-${month}`
    this.selectedFilterStartDate = `${year}-${month}-01`
    this.selectedFilterEndDate = `${year}-${month}-${lastDateThisMonth}`
    this.selectedLine = localStorage.getItem('line_id')

    await this.getLines()
    await this.getUsers()
    await this.getMemberVoices()
    await this.getFactors()
    await this.getCategories()
    await this.AccesibilityScore()
  },
  components: { VueMultiselect, Loading, Pagination, Treeselect },
}
</script>

<style scoped>
.tableFixHead {
  overflow: auto;
  height: 60vh;
}

.tableFixHead th {
  position: sticky;
  top: 0;
  background-color: white;
}

#fixCol-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 1;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 1;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 105px;
  z-index: 1;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 230px;
  z-index: 1;
  background-color: white;
}

#fixCol-5 {
  position: sticky;
  top: 0px;
  left: 300px;
  z-index: 1;
  background-color: white;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
