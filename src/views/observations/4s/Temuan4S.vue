<template>
  <div>
    <div class="card mb-5">
      <div class="card-header">
        <div class="row d-flex align-items-center">
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
            <select class="form-select" v-model="selectedLineIDFilter" @change="addFilter()">
              <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Shift / group</label>
            <select class="form-select" v-model="selectedGroupIDFilter" @change="addFilter()">
              <option v-for="group in getGroupsOpts" :key="group.id" :value="group.id">
                {{ group.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Zona</label>
            <Select2 class="form-control" v-model="selectedZoneIDFilter" :options="getZoneOpts" @select="addFilter()" />
          </div>
          <div class="col">
            <label>Kanban</label>
            <Select2 class="form-control" v-model="selectedKanbanIDFilter" :options="getKanbansOpts"
              @select="addFilter()" />
          </div>
          <div class="col">
            <label>Freq</label>
            <select class="form-select" v-model="selectedFreqIDFilter" @change="addFilter()">
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
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>List temuan</h5>
        <div class="d-flex align-items-center justify-content-center">
          <table class="table">
            <tr>
              <th>
                <img src="@/../public/tanoko/0.png" width="20" height="20" />
              </th>
              <th>Order Part</th>
              <th>
                <img src="@/../public/tanoko/1.png" width="20" height="20" />
              </th>
              <th>Countermeasure</th>
              <th>
                <img src="@/../public/tanoko/2.png" width="20" height="20" />
              </th>
              <th>Monitor / Follow</th>
              <th>
                <img src="@/../public/tanoko/3.png" width="20" height="20" />
              </th>
              <th>Finish</th>
            </tr>
          </table>
        </div>
        <div class="d-flex align-items-center">
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
          </div>
          <button class="btn btn-info text-white mx-2" @click="openAddFindingModal()">
            Add Finding
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="tableFixHead">
          <table class="table table-hover">
            <thead class="text-center">
              <tr>
                <th id="fixCol-head-1" rowspan="2">No</th>
                <th id="fixCol-schedule" rowspan="2">
                  Status
                </th>
                <th id="fixCol-head-2" rowspan="2">Line</th>
                <th id="fixCol-head-3" rowspan="2">Zone</th>
                <th id="fixCol-head-4" rowspan="2">No Kanban</th>
                <th rowspan="2">Area</th>
                <th id="fixCol-head-5" rowspan="2">Freq 4S</th>
                <th id="fixCol-head-6" rowspan="2">Date</th>
                <th id="fixCol-head-7" rowspan="2">Problem</th>
                <th class="fix-col-parent" rowspan="2">Pic</th>
                <th class="fix-col-parent" colspan="2">Reduce Time</th>
                <th class="fix-col-parent" :colspan="changeOpts.length">
                  Perubahan
                </th>
                <th class="fix-col-parent" :colspan="deptOpts.length">
                  Departement Terkait
                </th>
                <th class="fix-col-parent" colspan="4">Jan</th>
                <th class="fix-col-parent" colspan="4">Feb</th>
                <th class="fix-col-parent" colspan="4">March</th>
                <th class="fix-col-parent" colspan="4">Apr</th>
                <th class="fix-col-parent" colspan="4">May</th>
                <th class="fix-col-parent" colspan="4">June</th>
                <th class="fix-col-parent" colspan="4">July</th>
                <th class="fix-col-parent" colspan="4">Aug</th>
                <th class="fix-col-parent" colspan="4">Sept</th>
                <th class="fix-col-parent" colspan="4">Oct</th>
                <th class="fix-col-parent" colspan="4">Nov</th>
                <th class="fix-col-parent" colspan="4">Dec</th>
                <th class="fix-col-parent" rowspan="2">Evaluasi</th>
                <th class="fix-col-parent" rowspan="2" colspan="2">Actions</th>
              </tr>
              <tr class="fix-col-child">
                <th>Waktu 4S (mnt)</th>
                <th>Yokoten</th>
                <th v-for="optChange in changeOpts" :key="optChange">
                  {{ optChange.system_value }}
                </th>
                <th v-for="dept in deptOpts" :key="dept">
                  {{ dept.system_value }}
                </th>
                <th width="100">I</th>
                <th width="100">II</th>
                <th width="100">III</th>
                <th class="week">IV</th>
                <th width="100">I</th>
                <th width="100">II</th>
                <th width="100">III</th>
                <th class="week">IV</th>
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
                <td colspan="10" class="p-0" style="height: 200px">
                  <div class="vl-parent p-0" style="height: 100%">
                    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false"
                      :on-cancel="onCancel" />
                  </div>
                </td>
              </tr>

              <tr v-else-if="!isLoading && findingList?.length > 0" v-for="(finding, findingIndex) in findingList"
                :key="finding">
                <td id="fixCol-1">
                  {{ findingIndex + 1 }}
                </td>
                <td id="fixCol-schedule-td" class="text-left">
                  <div v-if="finding.sub_schedule_id">
                    <div class="btn m-1 rounded-pill align-items-center justify-content-center p-1 text-center"
                      style="background: green;height: 15px;width: 15px">
                    </div>
                    <label style="font-size: 9px">Schedule</label>
                  </div>
                  <div v-if="!finding.sub_schedule_id">
                    <div class="btn m-1 rounded-pill align-items-center justify-content-center p-1 text-center"
                      style="background: red;height: 15px;width: 15px">
                    </div>
                    <label style="font-size: 9px">Temuan</label>
                  </div>
                  <div v-if="finding.is_need_improvement">
                    <div class="btn m-1 rounded-pill align-items-center justify-content-center p-1 text-center"
                      style="background: cyan;height: 15px;width: 15px">
                    </div>
                    <label style="font-size: 9px">Kaizen</label>
                  </div>
                  <div v-if="finding.is_change_sop">
                    <div class="btn m-1 rounded-pill align-items-center justify-content-center p-1 text-center"
                      style="background: black;height: 15px;width: 15px">
                    </div>
                    <label style="font-size: 9px">Revisi SOP</label>
                  </div>
                </td>
                <td id="fixCol-2">{{ finding.line_nm }}</td>
                <td id="fixCol-3" class="text-center">{{ finding.zone_nm }}</td>
                <td id="fixCol-4" class="text-center">
                  {{ finding.kanban_no }}
                </td>
                <td class="text-center">
                  {{ finding.area_nm }}
                </td>
                <td id="fixCol-5" class="text-center">{{ finding.freq_nm }}</td>
                <td id="fixCol-6">{{ formatDate(finding.finding_date) }}</td>
                <td id="fixCol-7">{{ finding.finding_desc }}</td>
                <td class="text-center">{{ finding.finding_pic_nm }}</td>
                <td class="text-center">
                  {{ finding.time_cm }}
                </td>
                <td class="text-center">
                  <CIcon v-if="finding.time_yokoten" icon="cil-check" size="sm" />
                </td>
                <td class="text-center" v-for="optChange in changeOpts" :key="optChange">
                  <CIcon v-if="
                    finding.opt_changes != null &&
                    finding.opt_changes
                      ?.split(';')
                      .findIndex((x) => x == optChange.system_value) != -1
                  " icon="cil-check" size="sm" />
                </td>
                <td class="text-center" v-for="dept in deptOpts" :key="dept">
                  <CIcon v-if="
                    finding.opt_depts != null &&
                    finding.opt_depts
                      ?.split(';')
                      .findIndex((x) => x == dept.system_value) != -1
                  " icon="cil-check" size="sm" />
                </td>
                <td v-for="item in totalDate" :key="item.idx" style="min-width: 30px">
                  <div v-if="item == finding.week_plan - 1" :style="`width: 20px; height: 20px; border: 2px dotted #64748b; background-color: ${finding.status_check == 'CLOSED'
                    ? '#bbf7d0'
                    : finding.status_check == 'DELAY'
                      ? '#fee2e2'
                      : '#f3f4f6'
                    }`"></div>

                  <div v-if="item == finding.week_actual - 1" class="mt-2" style="
                      width: 20px;
                      height: 20px;
                      border: 2px solid #64748b;
                      background-color: #bbf7d0;
                    "></div>
                </td>
                <td class="text-center">
                  <img v-if="finding.evaluation_nm" :src="getImage(finding.evaluation_nm)"
                    :alt="getImage(finding.evaluation_nm)" width="50" height="50" />
                  <span v-else class="text-muted"> No Evaluation</span>
                </td>
                <td>
                  <div class="d-flex gap-2">
                    <button v-if="finding.finding_img" class="btn btn-info btn-sm text-white w-full"
                      @click="showModalFindingImage(finding)">
                      Finding image
                    </button>
                    <button v-else class="btn btn-secondary btn-sm" disabled>
                      No Image
                    </button>
                    <!-- isCmImage -->
                    <button :class="{
                      'btn btn-sm': true,
                      'btn-info text-white': finding.cm_image,
                      'btn-secondary text-white': !finding.cm_image,
                    }" @click="showKaizenModal(finding.cm_image)" :disabled="!finding.cm_image">
                      C/M Image
                    </button>
                    <div>
                      <button
                        :class="`btn text-light h-100 ${(finding.sop_file_before || finding.sop_file_after) ? 'btn-info' : 'btn-secondary'} btn-sm`"
                        @click="showSopModal(finding?.sop_file_before, finding?.sop_file_after)"
                        :disabled="(!finding.sop_file_before && !finding.sop_file_after)">
                        File SOP
                      </button>
                    </div>

                    <!-- isKaizenModal -->
                    <button :class="{
                      'btn btn-sm': true,
                      'btn-info text-white': finding.kaizen_file,
                      'btn-secondary text-white': !finding.kaizen_file,
                    }" @click="showKaizenModal(finding.kaizen_file)" :disabled="!finding.kaizen_file">
                      Kaizen Report
                    </button>
                    <button class="btn btn-info btn-sm text-white" @click="openEditFindingModal(finding, findingIndex)">
                      Edit
                    </button>
                    <button class="btn btn-warning btn-sm text-white" @click="deleteFinding(finding.finding_id)">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-else>
                <td colspan="80">
                  <div class="alert alert-danger w-full" role="alert">
                    Data not found!
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Pagination :totalPages="totalPage" :perPage="currentPageLimit" :currentPage="currentPage"
        @changePage="onPageChange" :totalPage="totalPage" @changeLimit="onPageChangeLimit" />
    </div>

    <!-- edit modal -->
    <CModal backdrop="static" size="xl" :visible="editFindingModal" @close="
      () => {
        editFindingModal = false
      }
    " aria-labelledby="StaticBackdropExampleLabel">
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">Update finding 4S</CModalTitle>
      </CModalHeader>
      <!-- <CModalBody>
        <div class="row">
          <div class="col">
            <div class="mb-2">
              <label class="mb-1">Line</label>
              <VueMultiselect disabled v-model="selectedLineID" :options="getLinesOpts" optionLabel="text"
                optionValue="id" :customLabel="customLabel">
              </VueMultiselect>
            </div>
            <div class="mb-2">
              <label class="mb-1">Freq</label>
              <select class="form-select" v-model="selectedFreqID" disabled>
                <option v-for="freq in getFreqsOpts" :key="freq.id" :value="freq.id">
                  {{ freq.text }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Zone {{ selectedZoneName }}</label>
              <select class="form-select" v-model="selectedZoneID">
                <option v-for="zone in getZoneOpts" :key="zone.zone_id" :value="zone.zone_id">
                  {{ zone.text }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Kanban</label>
              <select class="form-select" v-model="selectedKanbanID" disabled>
                <option v-for="kanban in getKanbansOpts" :key="kanban.id" :value="kanban.id">
                  {{ kanban.text }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Finding PIC</label>
              <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions">
              </VueMultiselect>
            </div>
            <div class="mb-2">
              <label class="mb-1">Finding Date</label>
              <input type="date" class="form-control" v-model="findingDate" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Finding Desc</label>
              <input type="text" class="form-control" v-model="findingDesc" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Plan Countermeasure Date</label>
              <input type="date" class="form-control" v-model="planCMDate" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Plan Countermeasure Desc</label>
              <input type="text" class="form-control" v-model="planCMDesc" />
            </div>
          </div>
          <div class="col">
            <div class="mb-2">
              <label class="mb-1">Time CM</label>
              <input type="text" class="form-control" v-model="timeCM" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Time Yokoten</label>
              <select v-model="timeYokoten" class="form-select">
                <option value="true">Sudah</option>
                <option value="false">Belum</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Opt Changes</label>
              <select class="form-select" v-model="optChanges">
                <option v-for="optChange in changeOpts" :key="optChange">
                  {{ optChange.system_value }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Opt Department</label>
              <select class="form-select" v-model="optDepartment">
                <option v-for="optDept in deptOpts" :key="optDept">
                  {{ optDept.system_value }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Countermeasure Judg</label>
              <select v-model="cmJudg" class="form-select">
                <option value="true">Sudah</option>
                <option value="false">Belum</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Actual PIC</label>
              <VueMultiselect v-model="actualPIC" :options="picData" :custom-label="customPicOptions">
              </VueMultiselect>
            </div>
            <div class="mb-2">
              <label class="mb-1">Actual Countermeasure Date</label>
              <input type="date" class="form-control" v-model="actualCMDate" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Evaluation Name</label>
              <input type="text" class="form-control" v-model="evaluationName" />
            </div>
            <div class="mb-2">
              <label class="mb-1">Evaluation</label>
              <select class="form-select" v-model="evaluationName">
                <option value="null" selected>Select Evaluation</option>
                <option v-for="optEval in optEvaluation" :key="optEval" :value="optEval.system_value">
                  {{ optEval.system_value }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </CModalBody> -->

      <CModalBody>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Line</label>
              <!-- <VueMultiselect disabled v-model="selectedLineID" :options="getLinesOpts" optionLabel="text"
                optionValue="id" :customLabel="customLabel">
              </VueMultiselect> -->
              <input type="text" class="form-control" :value="selectedLineNm" disabled />
            </div>
            <div class="mb-2">
              <label class="mb-1">Zone </label>
              <input type="text" class="form-control" :value="selectedZoneName" disabled />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Freq</label>
              <select class="form-select" v-model="selectedFreqID" disabled>
                <option v-for="freq in getFreqsOpts" :key="freq.id" :value="freq.id">
                  {{ freq.text }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label class="mb-1">Kanban</label>
              <input type="text" class="form-control" :value="selectedKanbanNo" disabled />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="mb-2">
              <label class="mb-1">Finding Desc</label>
              <input type="text" class="form-control" v-model="findingDesc" placeholder="Write Finding Desc" disabled />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Finding Date</label>
              <input type="date" class="form-control" v-model="findingDate" placeholder="Select Finding Date"
                disabled />
            </div>
            <div class="mb-2">
              <label class="mb-1">Finding PIC</label>
              <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions"
                class="vue-multi-select" :disabled="true">
              </VueMultiselect>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Reduce Time Countermeasure (Menit)</label>
              <div class="d-flex align-items-center">
                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" v-model="enabledReduceTime"
                  class="me-2" style="height: 20px; width: 20px" />
                <input type="text" class="form-control" v-model="timeCM" :disabled="!enabledReduceTime" @keypress="
                  $event.key.match(/^[\d]$/) ? '' : $event.preventDefault()
                  " />
              </div>
              <small v-if="!enabledReduceTime" class="text-info">* Ceklis & isi waktu pengurangan jika ada</small>
              <small v-else class="text-success">* Abaikan jika tidak ingin di ubah</small>
            </div>
            <div class="mb-2">
              <label class="mb-1">PIC Countermeasure</label>
              <VueMultiselect v-model="actualPIC" :disabled="findingActionType == 'update'" :options="picData"
                :custom-label="customPicOptions" class="vue-multi-select">
              </VueMultiselect>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Plan Countermeasure Date</label>
              <input type="date" class="form-control" v-model="planCMDate" disabled />
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-2">
              <label class="mb-1">Actual Countermeasure Date</label>
              <input type="date" class="form-control" v-model="actualCMDate"
                :disabled="findingActionType == 'update'" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="mb-2">
              <label class="mb-1">Plan Countermeasure Desc</label>
              <input type="text" class="form-control" v-model="planCMDesc"
                placeholder="Write Plan Countermeasure Desc" />
            </div>
          </div>
          <div class="col-md-12 col-12">
            <div class="mb-2">
              <label class="mb-1">Department Terkait</label>
              <treeselect class="" v-if="getSystemsOptDept" v-model="optDepartment" :multiple="true"
                :options="getSystemsOptDept" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 col-12">
            <div class="mb-2">
              <label class="mb-1">Perubahan Standard</label>
              <select class="form-select" v-model="optChanges">
                <option value="null" selected>Select Standart</option>
                <option v-for="optChange in optChangeData" :key="optChange" :value="optChange.system_value">
                  {{ optChange.system_value }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-12 col-md-12">
            <div class="mb-2">
              <div class="card p-2">
                <label>Apakah ada perubahan SOP?</label>
                <CFormSwitch v-model="is_change_sop" />
                <!-- <div v-if="is_change_sop">
                  <input ref="kanban_sop" class="form-control" type="file" @change="onChangeSopFile($event)">
                  <button class="btn btn-sm btn-success" @click="uploadSopFile">Upload SOP</button>
                </div> -->
                <div v-if="is_change_sop" class="col-12 col-md-12">
                  <CInputGroup class="mb-3">
                    <CInputGroupText>SOP</CInputGroupText>
                    <CFormInput aria-label="Input your kaizen file" ref="kanban_sop" class="form-control" type="file"
                      @change="onChangeSopFile($event)" />
                    <CInputGroupText class="p-0">
                      <button class="btn btn-sm btn-success" @click="uploadSopFile()">Upload SOP</button>
                    </CInputGroupText>
                  </CInputGroup>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-12">
            <CInputGroup class="mb-3">
              <CInputGroupText>C/M Image</CInputGroupText>
              <CFormInput @change="onChangeCmImage($event)" ref="cm_image" aria-label="Input your kaizen file"
                type="file" />
              <CInputGroupText class="p-0">
                <button class="btn btn-sm btn-success" @click="uploadCmImage(selectedFindingID)">Upload
                  Image</button>
              </CInputGroupText>
            </CInputGroup>
          </div>
          <div class="col-12 col-md-12">
            <div class="mb-2">
              <div class="card p-2">
                <label>Apakah ada Improvement?</label>
                <CFormSwitch v-model="is_need_improvement" />
                <div v-if="is_need_improvement" class="row">
                  <div class="col-12 col-md-12">
                    <CInputGroup class="mb-3">
                      <CInputGroupText>Kaizen File</CInputGroupText>
                      <CFormInput @change="onChangeKaizenFile($event)" ref="kaizen_file"
                        aria-label="Input your kaizen file" type="file" />
                      <CInputGroupText class="p-0">
                        <button class="btn btn-sm btn-success" @click="uploadKaizen(selectedFindingID)">Upload
                          Kaizen</button>
                      </CInputGroupText>
                    </CInputGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="mb-2">
              <label class="mb-1">Evaluation</label>
              <select class="form-select" v-model="evaluationName" :disabled="findingActionType == 'update'">
                <option value="null" selected>Select Evaluation</option>
                <option v-for="optEval in optEvaluation" :key="optEval" :value="optEval.system_value">
                  {{ optEval.system_value }}
                </option>
              </select>
              <table class="table">
                <tr>
                  <th>
                    <img src="@/../public/tanoko/0.png" width="50" height="50" />
                  </th>
                  <th>Order Part</th>
                  <th>
                    <img src="@/../public/tanoko/1.png" width="50" height="50" />
                  </th>
                  <th>Countermeasure</th>
                  <th>
                    <img src="@/../public/tanoko/2.png" width="50" height="50" />
                  </th>
                  <th>Monitor / Follow</th>
                  <th>
                    <img src="@/../public/tanoko/3.png" width="50" height="50" />
                  </th>
                  <th>Finish</th>
                </tr>
              </table>
            </div>
            <div class="mb-2">
              <label class="mb-1">Status Countermeasure</label>
              <select v-model="cmJudg" class="form-select" :disabled="findingActionType == 'update'">
                <option value="true">Sudah</option>
                <option value="false">Belum</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12">
            <div class="mb-2">
              <label class="mb-1">Yokoten</label>
              <select v-model="timeYokoten" class="form-select">
                <option value="true">Sudah</option>
                <option value="false" selected>Belum</option>
              </select>
            </div>
          </div>
        </div>

      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="
          () => {
            editFindingModal = false
          }
        ">
          Close
        </CButton>
        <CButton color="primary" @click="updateFinding()">
          {{
            isUpdateFindingLoading
              ? 'Updating...'
              : `Update
          finding data`
          }}
        </CButton>
      </CModalFooter>
    </CModal>
    <!-- SOP Modal -->
    <CModal backdrop="static" fullscreen :visible="isSopModal" @close="
      () => {
        isSopModal = false
      }
    ">
      <CModalHeader>
        <CModalTitle>Perubahan SOP</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <table class="table table-bordered">
          <tr>
            <th class="text-center" style="font-size: 30px">Before</th>
          </tr>
          <tr>
            <td class="text-center">
              <img v-if="sopBefore && !sopBefore.includes('.pdf')" :src="sopBefore" width="400" alt="Sop" />
              <vue-pdf-embed v-else-if="sopBefore && sopBefore.includes('.pdf')" :source="sopBefore" />
              <h3 v-else>No SOP</h3>
            </td>
          </tr>
          <tr>
            <th class="text-center" style="font-size: 30px">After</th>
          </tr>
          <tr>
            <td class="text-center"><img v-if="sopAfter && !sopAfter.includes('.pdf')" :src="sopAfter" width="400"
                alt="Sop" />
              <vue-pdf-embed v-else-if="sopAfter && sopAfter.includes('.pdf')" :source="sopAfter" />
              <h3 v-else>No SOP</h3>
            </td>
          </tr>
        </table>
      </CModalBody>
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
    <!-- <ModalForm4sFinding :visiblee="modalFormFinding" :loadedFinding="" /> -->
    <ModalImage :img="selectedFindingImage" :visible="isVisibleFindingImage" @close="isVisibleFindingImage = false" />
    <!-- v-if="addFindingModal" -->
    <ModalForm4sFinding :visible="addFindingModal" :is-input="true" :loadedFinding="null"
      @close="onCloseModalFinding($event)" />
  </div>
</template>

<script>
import moment from 'moment'
import Loading from 'vue-loading-overlay'
import { GET_GROUP } from '@/store/modules/group.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_ZONES } from '@/store/modules/zones.module'
import { GET_KANBANS } from '@/store/modules/kanban.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_USERS } from '@/store/modules/user.module'
import { GET_SYSTEMS } from '@/store/modules/system.module'

import { mapGetters } from 'vuex'
import ApiService from '@/store/api.service'

import VueMultiselect from 'vue-multiselect'
import { GET_4S_FINDINGS } from '@/store/modules/finding.module'
import Swal from 'sweetalert2'
import { toast } from 'vue3-toastify'
import Pagination from '@/components/Pagination.vue'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import Treeselect from 'vue3-treeselect'
import ModalForm4sFinding from '@/components/4s/ModalForm4sFinding.vue'
import ModalImage from '@/components/ModalImage.vue'

import VuePdfEmbed from 'vue-pdf-embed'

export default {
  name: 'Temuan4S',
  // eslint-disable-next-line vue/no-unused-components
  components: {
    Loading,
    VueMultiselect,
    Pagination,
    Treeselect,
    ModalForm4sFinding,
    ModalImage,
    VuePdfEmbed
  },
  data() {
    return {
      enabledReduceTime: false,
      options: [
        {
          id: 'a',
          label: 'a',
        },
        {
          id: 'b',
          label: 'b',
        },
        {
          id: 'c',
          label: 'c',
        },
      ],
      value: null,
      changeOpts: [],
      deptOpts: [],
      evaluationOpts: [],
      totalDate: 48,
      isLoading: false,
      isUpdateFindingLoading: false,
      mainScheduleData: null,
      subScheduleData: null,
      signGLData: null,
      signSHData: null,
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedMonth: null,
      selectedLineIDFilter: null,
      selectedGroupIDFilter: '-1',
      selectedZoneIDFilter: '-1',
      selectedKanbanIDFilter: '-1',
      selectedFreqIDFilter: '-1',
      idxMonth: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ],
      monthStr: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)',
      },
      isUploadSignLoading: false,
      selectedSignature: null,
      selectedSignCheckerID: null,
      selectedSignType: null,
      selectedSign: null,
      addSignModal: false,
      editDataModal: false,
      selectedMainScheduleID: null,
      picData: [],
      lineData: [],
      editFindingModal: false,

      // finding
      findingList: [],
      scheduleItemCheckKanbanID: null,
      selectedLineID: null,
      selectedLineNm: null,
      selectedFreqID: null,
      selectedKanbanID: null,
      selectedKanbanNo: null,
      selectedZoneID: null,
      selectedZoneName: null,
      selectedPIC: null,
      findingDate: null,
      findingDesc: null,
      planCMDate: null,
      planCMDesc: null,
      timeCM: null,
      timeYokoten: null,
      optChanges: null,
      optChange: null,
      optDepartment: null,
      optDept: null,
      cmJudg: null,
      actualPIC: null,
      actualCMDate: null,
      evaluationName: null,
      selectedScheduleItemCheckKanbanID: null,
      selectedFindingID: null,
      currentPage: 0,
      totalPage: 0,
      currentPageLimit: 10,
      selectedSubScheduleID: null,
      optEvaluation: null,
      optDeptData: null,
      selectedFindingImage: null,
      isVisibleFindingImage: false,
      addFindingModal: false,
      is_change_sop: false,
      is_need_improvement: false,
      kanban_sop: null,
      isSopModal: false,
      sopBefore: null,
      sopAfter: null,
      kaizenFile: null,
      cmImage: null,
      isKaizenModal: false,
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getGroupsOpts',
      'getZoneOpts',
      'getKanbansOpts',
      'getFreqsOpts',
      'getUsersOpts',
      'get4sFindings',
      'getSystemsOptDept',
    ]),
    zoneGetID() {
      return this.selectedZoneIDFilter.id
    },
    kanbanGetID() {
      return this.selectedKanbanID.id
    },
  },
  watch: {
    selectedMonth: function () {
      if (this.selectedMonth) {
        this.generateDate()
        let idx = this.idxMonth.indexOf(this.selectedMonth.split('-')[1])
        this.yearMonth = `${this.monthStr[idx]} ${this.selectedMonth.split('-')[0]
          }`
      }
    },
    zoneGetID: function () {
      this.getFindings()
    },
  },
  updated() {
    this.mapUsersData()
    console.log('zones', this.getZoneOpts)
  },
  methods: {
    async uploadKaizen(finding_id, kaizen_file = null) {
      this.isLoading = true
      if (!kaizen_file && !this.kaizenFile) {
        toast.info('Please select file')
        this.isLoading = false
        return
      }

      try {
        const formData = new FormData()
        formData.append('finding_id', finding_id)
        formData.append('dest', '4s-finding-kaizen')
        formData.append(
          'kaizen_file',
          kaizen_file ? kaizen_file : this.kaizenFile,
        )

        await ApiService.post(
          `/operational/4s/finding/upload-kaizen?dest=4s-finding-kaizen`,
          formData,
        )
        this.isLoading = false
        toast.success('Susccessfully Upload Kaizen', {
          autoClose: 1000,
        })
      } catch (e) {
        this.isLoading = false
        console.log('uploadKaizen', e)
        toast.error('Failed to upload Kaizen', {
          autoClose: 1000,
        })
      }
    },
    async uploadCmImage(finding_id) {
      this.isLoading = true
      if (!this.cmImage) {
        toast.info('Please select file')
        this.isLoading = false
        return
      }

      try {
        const formData = new FormData()
        formData.append('finding_id', finding_id)
        formData.append('dest', '4s-finding-kaizen')
        formData.append(
          'cm_image',
          this.cmImage,
        )
        await ApiService.post(
          `/operational/4s/finding/upload-cm-image?dest=4s-finding-kaizen`,
          formData,
        )
        this.isLoading = false
        toast.success('Susccessfully Upload CM Image', {
          autoClose: 1000,
        })
      } catch (e) {
        this.isLoading = false
        console.log('uploadKaizen', e)
        toast.error(JSON.stringify(e.message))
      }
    },
    showSopModal(sopBefore, sopAfter) {
      this.sopBefore = sopBefore
      this.sopAfter = sopAfter
      this.isSopModal = true
    },
    showKaizenModal(kaizenFile) {
      this.kaizenFile = kaizenFile
      this.isKaizenModal = true
    },
    onChangeSopFile(event) {
      this.kanban_sop = event.target.files[0]
    },
    onChangeKaizenFile(event) {
      this.kaizenFile = event.target.files[0]
    },
    onChangeCmImage(event) {
      this.cmImage = event.target.files[0]
    },
    async uploadSopFile() {
      try {
        this.isLoading = true
        if (!this.kanban_sop) {
          toast.info('Please select file')
          this.isLoading = false
          return
        }
        const formData = new FormData()
        formData.append('dest', 'kanban-sop')
        formData.append('kanban_id', this.selectedKanbanID)
        formData.append('sop_file', this.kanban_sop)
        formData.append('finding_4s_id', this.selectedFindingID)

        await ApiService.post(
          `/master/kanbans/upload-sop?dest=kanban-sop`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        )

        toast.success('Susccessfully Upload SOP', {
          autoClose: 1000,
        })
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        toast.error(JSON.stringify(error.message))
        setTimeout(() => {
          toast.remove()
        }, 2000)
      }
    },
    customLabel(value) {
      return `${value.text}`
    },
    onPageChange(page, type) {
      if (type == 'prev') {
        this.currentPage = this.currentPage - 1
        this.getFindings()
      }

      if (type == 'next') {
        this.currentPage = this.currentPage + 1
        this.getFindings()
      }

      if (type == 'fromnumber') {
        this.currentPage = page
        this.getFindings()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getFindings()
    },
    getImage(eval_nm) {
      return `./tanoko/${this.evaluationOpts.findIndex((x) => x.system_value == eval_nm) + '.png'
        }`
    },
    async getSystem() {
      try {
        ApiService.setHeader()
        const changeOpts = await ApiService.get(
          `master/systems/get/4S_OPT_CHANGE`,
        )
        const depts = await ApiService.get('master/systems/get/4S_OPT_DEPT')
        let evaluation = await ApiService.get(
          'master/systems/get/4S_EVALUATION',
        )
        this.changeOpts = changeOpts.data.data
        this.deptOpts = depts.data.data
        this.evaluationOpts = evaluation.data.data
      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
    addScheduleCheck(mainScheduleID, subScheduleID) {
      this.$router.push(`/4s/schedule-check/${mainScheduleID}/${subScheduleID}`)
    },
    async getFindings() {
      console.log(this.currentPageLimit, 'LIMIT');
      if (this.currentPageLimit == -1) {
        this.currentPageLimit = 100000
      }
      let objQuery = {
        line_id: this.selectedLineIDFilter,
        kanban_id: this.selectedKanbanIDFilter,
        zone_id: this.zoneGetID,
        freq_id: this.selectedFreqIDFilter,
        group_id: this.selectedGroupIDFilter,
        start_date: this.selectedFilterStartDate,
        end_date: this.selectedFilterEndDate,
        limit: this.currentPageLimit,
        current_page: this.currentPage,
      }
      await this.$store.dispatch(GET_4S_FINDINGS, objQuery).then((res) => {
        this.findingList = res.list
        this.totalPage = res.total_page
        this.currentPage = res.current_page
      })
    },
    openAddFindingModal() {
      this.addFindingModal = true
    },
    openEditFindingModal(finding) {
      console.log(finding)

      const data = finding
      this.selectedFindingID = finding.finding_id
      this.scheduleItemCheckKanbanID = data.schedule_item_check_kanban_id
      this.selectedLineID = { text: data.line_nm, id: data.line_id }
      this.selectedLineNm = data.line_nm
      this.selectedFreqID = data.freq_id
      this.selectedZoneID = data.zone_id
      this.selectedZoneName = data.zone_nm
      this.selectedKanbanID = data.kanban_id
      this.selectedKanbanNo = data.kanban_no
      this.selectedPIC =
        data.finding_pic_id != null
          ? {
            pic_name: data.finding_pic_nm,
            pic_id: data.finding_pic_id,
          }
          : null
      this.findingDate = data.finding_date
      this.findingDesc = data.finding_desc
      this.planCMDate = data.plan_cm_date
      this.planCMDesc = data.plan_cm_desc
      this.timeCM = data.time_cm
      this.timeYokoten = data.time_yokoten
      this.optChanges = data.opt_changes
      this.is_change_sop = data.is_change_sop
      this.is_need_improvement = data.is_need_improvement
      // this.optDepartment = data.opt_depts
      this.optDepartment =
        data.opt_depts != null ? data.opt_depts.split(';') : null
      this.cmJudg = data.cm_judg
      this.actualPIC =
        data.actual_pic_id != null
          ? { pic_name: data.actual_pic_nm, pic_id: data.actual_pic_id }
          : null
      this.actualCMDate =
        data.actual_cm_date != null ? data.actual_cm_date.split(' ')[0] : null // formating form yyy-mm-dd HH:mm:ss
      this.evaluationName = data.evaluation_nm
      this.selectedSubScheduleID = data.sub_schedule_id
      if (data.time_cm) {
        this.enabledReduceTime = true
      } else {
        this.enabledReduceTime = false
      }
      this.editFindingModal = true
    },

    async updateFinding() {
      ApiService.setHeader()
      this.isUpdateFindingLoading = true
      const findingData = {
        sub_schedule_id: this.selectedSubScheduleID,
        schedule_item_check_kanban_id: this.scheduleItemCheckKanbanID,
        finding_pic_id: this.selectedPIC.pic_id,
        finding_date: this.findingDate,
        finding_desc: this.findingDesc,
        plan_cm_date: this.planCMDate,
        plan_cm_desc: this.planCMDesc,
        time_cm: +this.timeCM,
        time_yokoten: this.timeYokoten,
        opt_changes: this.optChanges,
        opt_depts:
          this.optDepartment?.length > 0 ? this.optDepartment.join(';') : null,
        cm_judg: this.cmJudg,
        actual_pic_id: this.actualPIC != null ? this.actualPIC.pic_id : null,
        actual_cm_date: this.actualCMDate,
        evaluation_nm: this.evaluationName,
        is_change_sop: this.is_change_sop,
        is_need_improvement: this.is_need_improvement,
      }

      const add = await ApiService.put(
        `operational/4s/finding/edit/${this.selectedFindingID}`,
        findingData,
      )
      if (add.data.message == 'Success to edit 4s finding') {
        toast.success('Success edit data', {
          autoClose: 700,
        })
        this.editFindingModal = false
        this.isUpdateFindingLoading = false
        await this.getFindings()
      } else {
        toast.error('Failed to edit data', {
          autoClose: 700,
        })
        this.isUpdateFindingLoading = false
        this.editFindingModal = false
      }
    },

    async deleteFinding(findingID) {
      Swal.fire({
        title: 'Are you sure to delete this Finding?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          ApiService.setHeader()
          const deleteData = ApiService.delete(
            `operational/4s/finding/delete/${findingID}`,
          )

          if (deleteData) {
            toast.success('Success to delete data', {
              autoClose: 700,
            })
            this.getFindings()
          } else {
            toast.error('Failed edit data', {
              autoClose: 700,
            })
          }
        } else if (result.isDenied) {
          Swal.fire('Canceled', '', 'info')
        }
      })
    },

    async addFilter() {
      await this.getFindings()
    },
    resetFilter() {
      ; (this.selectedLineIDFilter = ' -1'),
        (this.selectedFreqIDFilter = '-1'),
        (this.selectedGroupIDFilter = '-1'),
        (this.selectedZoneIDFilter = '-1')
        ; (this.selectedKanbanIDFilter = '-1'), this.getFindings()
    },

    async getUsers() {
      try {
        await this.$store.dispatch(GET_USERS)
        this.mapUsersData()
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },
    mapUsersData() {
      this.picData = []
      this.getUsersOpts?.map((item) => {
        this.picData.push({ pic_id: item.id, pic_name: item.text })
      })
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getGroup() {
      try {
        this.$store.dispatch(GET_GROUP)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getZone() {
      try {
        this.$store.dispatch(GET_ZONES, { line_id: this.selectedLineIDFilter })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getKanban() {
      try {
        this.$store.dispatch(GET_KANBANS)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getFreq() {
      try {
        this.$store.dispatch(GET_FREQS)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getEvaluation() {
      let objQuery = {
        system_type: '4S_EVALUATION',
      }
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then((res) => {
          this.optEvaluation = res
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getOptChangeSystem() {
      let objQuery = {
        system_type: '4S_OPT_CHANGE',
      }
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then((res) => {
          this.optChangeData = res
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },

    async getOptDeptSystem() {
      let objQuery = {
        system_type: '4S_OPT_DEPT',
      }
      try {
        this.$store.dispatch(GET_SYSTEMS, objQuery).then((res) => {
          this.optDeptData = res
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    generateDate() {
      let year = new Date(this.selectedMonth).getFullYear()
      let month = new Date(this.selectedMonth).getMonth() + 1
      let selectedMonth = new Date(`${year}-${month}`)
      var lastDay = new Date(year, month, 0)
      let container = []
      this.containerDate = []
      for (let i = 1; i <= lastDay.getDate(); i++) {
        let setDt = new Date(selectedMonth).setDate(i)
        let newDate = new Date(setDt)
        container.push(newDate.getDate())
        let dateObj = {
          bg: ``,
          date: newDate,
          idx: `${i}`,
        }
        if (newDate.getDay() === 0 || newDate.getDay() === 6)
          dateObj.bg = `bg-secondary`
        this.containerDate.push(dateObj)
      }
    },
    customKanbanFilterOptions({ text }) {
      return `${text}`
    },
    showModalFindingImage(finding) {
      this.selectedFindingImage = finding.finding_img
      this.isVisibleFindingImage = true
    },
    onClickDownloadKaizen(file) {
      window.open(file, '_blank').focus()
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    onCloseModalFinding(e) {
      this.addFindingModal = false
      if (e.refresh) {
        this.getFindings()
      }
    },
  },

  async mounted() {
    this.isLoading = true
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedFilterStartDate = `${year}-01-01`
    this.selectedFilterEndDate = `${year}-12-30`

    if (localStorage.getItem('line_id')) {
      this.selectedLineIDFilter = localStorage.getItem('line_id')
    }
    await this.getSystem()
    await this.getLines()
    await this.getOptDeptSystem()
    await this.getGroup()
    await this.getZone()
    await this.getKanban()
    await this.getFreq()
    await this.getUsers()
    await this.getFindings()
    await this.getEvaluation()
    await this.getOptChangeSystem()
    this.isLoading = false
    // TRY OPTIMIZING
    // try {
    //   // 1. Get things that are required before others
    //   await Promise.all([
    //     this.getLines(),
    //     this.getSystem(),
    //   ])

    //   // 2. Then things that depend on lines or system
    //   await Promise.all([
    //     this.getZone(),
    //     this.getOptDeptSystem(),
    //     this.getGroup(),
    //     this.getKanban(),
    //     this.getFreq(),
    //     this.getUsers(),
    //     this.getFindings(),
    //     this.getEvaluation(),
    //     this.getOptChangeSystem(),
    //   ])
    // } catch (e) {
    //   console.error('Load error:', e)
    // } finally {
    //   this.isLoading = false
    // }
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
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
  width: 10px;
  height: 10px;
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

.fixed-td {
  position: absolute;
}

.tableFixHead {
  overflow: auto;
  height: 100%;
  max-height: 70vh;
}

.tableFixHead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

#fixCol-head-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 6;
  background-color: white;
}

#fixCol-schedule {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 37px;
  z-index: 6;
  background-color: white;
}

#fixCol-head-2 {
  position: sticky;
  top: 0px;
  left: 120px;
  z-index: 6;
  min-width: 100px;
  background-color: white;
}

#fixCol-head-3 {
  position: sticky;
  min-width: 131px;
  top: 0px;
  left: 190px;
  z-index: 6;
  background-color: white;
}

#fixCol-head-4 {
  position: sticky;
  top: 0px;
  left: 300px;
  min-width: 100px;
  z-index: 6;
  background-color: white;
}

#fixCol-head-5 {
  position: sticky;
  top: 0px;
  left: 400px;
  min-width: 100px;
  z-index: 6;
  background-color: white;
}

#fixCol-head-6 {
  position: sticky;
  top: 0px;
  left: 500px;
  min-width: 100px;
  z-index: 6;
  background-color: white;
}

#fixCol-head-7 {
  position: sticky;
  top: 0px;
  left: 600px;
  min-width: 100px;
  z-index: 6;
  background-color: white;
}

#fixCol-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 3;
  background-color: white;
}

#fixCol-schedule-td {
  position: sticky;
  top: 0px;
  left: 35px;
  min-width: 100px;
  z-index: 3;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  left: 120px;
  min-width: 100px;
  z-index: 3;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  min-width: 131px;
  top: 0px;
  left: 190px;
  z-index: 3;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 300px;
  min-width: 100px;
  z-index: 3;
  background-color: white;
}

#fixCol-5 {
  position: sticky;
  top: 0px;
  left: 400px;
  min-width: 100px;
  z-index: 3;
  background-color: white;
}

#fixCol-6 {
  position: sticky;
  top: 0px;
  left: 500px;
  min-width: 100px;
  z-index: 3;
  background-color: white;
}

#fixCol-7 {
  position: sticky;
  top: 0px;
  left: 600px;
  min-width: 100px;
  z-index: 3;
  background-color: white;
}

.vue-multi-select {
  width: auto !important;
  flex: 1 1 auto !important;
}

.fix-col-parent {
  z-index: 5 !important;
}

.fix-col-child {
  position: sticky;
  top: 41px !important;
}

/* highlight on hover */

.multiselect--disabled>.multiselect__tags,
.multiselect--disabled>.multiselect__tags>.multiselect__single,
.multiselect--disabled>.multiselect__select {
  background: #d8dbe0 !important;
}
</style>
