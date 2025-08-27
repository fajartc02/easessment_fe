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
      <div class="overflow-auto card-header d-flex justify-content-between align-items-center">
        <h5>List temuan</h5>
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
          <div class="mx-2">
            <span class="badge bg-info"> P1: Safety & Quality Issue </span>
            <span class="badge bg-info mx-2"> P2: Productivity Issue </span>
            <span class="badge bg-info"> P3: Cost Issue </span>
          </div>
          <div>
            <button :disabled="getFindings?.length < 1" class="btn btn-info btn-sm text-white w-full my-1">
              <download-excel :data="json_data" :fields="json_fields" worksheet="My Worksheet" name="findinglist.xls">
                Export all data
              </download-excel>
            </button>
          </div>
        </div>
      </div>
      <div style="
          width: 100%;
          height: 500px;
          display: block;
          overflow-x: auto;
          white-space: nowrap;
        ">
        <div class="tableFixHead">
          <table class="table table-hover text-center">
            <HeadFindingList />
            <tbody>
              <tr v-if="isLoading">
                <td colspan="50" class="p-0" style="height: 200px">
                  <div class="vl-parent p-0" style="height: 100%">
                    <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false"
                      :on-cancel="onCancel" />
                  </div>
                </td>
              </tr>
              <tr v-else v-for="(finding, findingIndex) in getFindings" :key="finding.no" :style="`${this.todayDate > formatTheDate(finding.cm_str_plan_date) &&
                finding.cm_judg == false
                ? 'background-color: #fee2e2'
                : ''
                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ${finding.cm_judg ==
                  true
                  ? 'background-color: #f0fdf4'
                  : ''
                }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ${finding.cm_judg ==
                  false &&
                  this
                    .todayDate <
                  formatTheDate(
                    finding.cm_str_plan_date,
                  )
                  ? 'background-color: #fff'
                  : ''
                }
                `">
                <th id="fixCol-1">{{ findingIndex + 1 }}</th>
                <td id="fixCol-2" class="px-2">{{ finding.line_nm }}</td>
                <td id="fixCol-3" class="px-2">
                  <button class="btn btn-info" :style="`background-color: ${COLOR_STW[finding.source_category]
                    }`" v-if="finding.observation_id" @click="
                      () => {
                        if (finding?.is_new_form) {
                          $router.push(
                            `/new-observation/${finding.observation_id}`,
                          )
                        } else {
                          $router.push(`/observation/${finding.observation_id}`)
                        }
                      }
                    ">
                    Observation
                  </button>
                  <template v-else>
                    <div class="card text-light" :style="`background-color: ${COLOR_STW[finding.source_category]
                      }`">
                      {{ finding.source_category }}
                    </div>
                  </template>
                </td>
                <td id="fixCol-4" class="px-2">
                  {{ formatTheDate(finding.finding_date) }}
                </td>
                <td id="fixCol-5" class="px-2 text-start">
                  {{ finding.group_nm }}
                </td>
                <td id="fixCol-6" class="px-2 text-start">
                  {{ finding.job_no }}
                </td>
                <td id="fixCol-7" class="px-2 text-start">
                  {{ finding.finding_location }}
                </td>
                <td id="fixCol-8" class="px-2 text-start">
                  <template v-if="
                    `${finding?.finding_desc}`.length > 30 && !finding.is_open
                  ">
                    {{ `${finding?.finding_desc}`.slice(0, 30) }}
                    <span class="text-info" style="cursor: pointer" @click="
                      () => {
                        finding.finding_desc = finding.finding_desc
                        finding.is_open = true
                      }
                    ">...</span>
                  </template>
                  <template v-else-if="finding.is_open">
                    <div class="text-start" style="overflow: auto">
                      {{ finding.finding_desc }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-start">
                      {{ finding.finding_desc }}
                    </div>
                  </template>
                </td>
                <td class="px-2 text-start">
                  {{ finding.cm_desc }}
                </td>
                <td class="px-2">{{ finding.cm_priority }}</td>
                <td colspan="2">
                  <CIcon v-if="finding.factor_nm == 'Safety'" icon="cil-check" size="sm" />
                </td>
                <td>
                  <CIcon v-if="finding.factor_nm == 'Method'" icon="cil-check" size="sm" />
                </td>
                <td colspan="2">
                  <CIcon v-if="finding.factor_nm == 'Man'" icon="cil-check" size="sm" />
                </td>
                <td>
                  <CIcon v-if="finding.factor_nm == 'Material'" icon="cil-check" size="sm" />
                </td>
                <td>
                  <CIcon v-if="finding.factor_nm == 'Machine'" icon="cil-check" size="sm" />
                </td>
                <td>{{ finding.cm_pic_nm }}</td>
                <td v-for="n in num" :key="n" style="min-width: 30px !important; padding: 5px">
                  <div v-if="
                    n >= finding.w_str_plan_date - 1 &&
                    n <= finding.w_end_plan_date - 1
                  " :style="`
                      width: 100%;
                      height: 25px;
                      border-radius: 4px;
                      border: 2px dotted #64748b;
                      ${finding.status_check == 'PROGRESS'
                      ? 'background-color: #fff'
                      : ''
                    };
                      ${finding.status_check == 'DELAY'
                      ? 'background-color: #fee2e2'
                      : ''
                    };
                      ${finding.status_check == 'DONE'
                      ? 'background-color: #bbf7d0'
                      : ''
                    };
                      `"></div>

                  <div class="my-2" v-if="
                    n >= finding.w_str_act_date - 1 &&
                    n <= finding.w_end_act_date - 1
                  " :style="`
                      width: 100%;
                      height: 25px;
                      border-radius: 4px;
                      border: 2px solid #64748b;
                      ${finding.status_check == 'PROGRESS'
                      ? 'background-color: #fff'
                      : ''
                    };
                      ${finding.status_check == 'DELAY'
                      ? 'background-color: #fee2e2'
                      : ''
                    };
                      ${finding.status_check == 'DONE'
                      ? 'background-color: #bbf7d0'
                      : ''
                    };
                      `"></div>
                </td>
                <td>
                  <input v-if="finding.cm_sign_lh_red" type="image" :src="finding.cm_sign_lh_red" alt="" width="200" />
                </td>
                <td>
                  <input v-if="finding.cm_sign_lh_white" type="image" :src="finding.cm_sign_lh_white" alt=""
                    width="200" />
                </td>
                <td>
                  <input v-if="finding.cm_sign_sh" type="image" :src="finding.cm_sign_sh" alt="" width="200" />
                </td>
                <td>
                  <div class="d-flex m-2">
                    <div class="d-flex" style="width: 400px">
                      <input type="text" class="form-control w-full" :value="finding.cm_comments" @input="
                        updateCMComments(
                          finding.finding_id,
                          $event.target.value,
                          findingIndex,
                        )
                        " />
                      <button class="btn btn-info btn-sm text-white w-full mx-1" @click="saveCMComments()">
                        save
                      </button>
                    </div>
                  </div>
                </td>
                <td id="fixCol-9" class="px-4">
                  <template v-if="finding.score && finding.score !== 0">
                    <template v-for="labelScore in scoreopts">
                      <label :key="labelScore.score" v-if="labelScore.score === finding.score">
                        {{ labelScore.label }}
                      </label>
                    </template>
                  </template>
                </td>

                <td class="px-1">
                  <div class="px-2 d-flex">
                    <button v-if="finding.finding_img" @click="
                      () => {
                        openFindingImage(finding.finding_img)
                      }
                    " class="btn btn-info btn-sm text-white w-full my-1 mx-1">
                      Finding image
                    </button>
                    <button v-else class="btn btn-secondary btn-sm" disabled>
                      No Image
                    </button>
                    <button v-if="finding.cm_image" @click="
                      () => {
                        openFindingImage(finding.cm_image)
                      }
                    " class="btn btn-info btn-sm text-white w-full my-1 mx-1">
                      C/M image
                    </button>
                    <button v-else class="btn btn-secondary btn-sm w-full my-1 mx-1" disabled>
                      No Image
                    </button>
                    <button
                      :class="`btn text-light btn-sm w-full my-1 mx-1 ${((finding?.attachment_before || finding?.attachment) && finding.is_change_sop) ? 'btn-info' : 'btn-secondary'} btn-sm`"
                      @click="showSopModal(finding?.attachment_before, finding?.attachment)"
                      :disabled="!finding.is_change_sop">
                      File SOP
                    </button>
                    <button :class="{
                      'btn btn-sm w-full my-1 mx-1': true,
                      'btn-info text-white': finding.kaizen_file,
                      'btn-secondary text-white': !finding.kaizen_file,
                    }" @click="showKaizenModal(finding.kaizen_file)" :disabled="!finding.kaizen_file">
                      Kaizen
                    </button>
                    <button @click="
                      () => {
                        getDetailTemuan(findingIndex)
                        addSignModal = true
                      }
                    " class="btn btn-info btn-sm text-white w-full my-1 mx-1">
                      Add sign
                    </button>
                    <!-- <button class="btn btn-info btn-sm text-white w-full mx-1 my-1" style="margin-right: 10px" @click="() => {
                      getDetailTemuan(findingIndex)
                      detailTemuanModal = true
                    }
                      ">
                      Detail
                    </button> -->
                    <button @click="
                      () => {
                        getDetailTemuan(findingIndex)
                        editTemuanModal = true
                      }
                    " class="btn btn-info btn-sm text-white w-full my-1">
                      Edit
                    </button>
                    <button @click="deleteFinding(finding.finding_id)"
                      class="btn btn-danger mx-1 btn-sm text-white w-full my-1">
                      Delete
                    </button>
                    <!-- <button
                      @click="
                        downloadPinkSheet(
                          finding.file_pinksheet,
                          finding.observation_id,
                          finding.source_category,
                        )
                      "
                      class="btn btn-info btn-sm text-white w-full my-1"
                    >
                      Download
                    </button> -->
                    <CDropdown size="sm" class="mx-1">
                      <CDropdownToggle color="info" class="btn-sm" size="sm">Download</CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem>
                          <button :disabled="finding.source_category !== 'Obs'" class="btn btn-info btn-sm text-white"
                            @click="downloadReport(finding.observation_id)">
                            Download Report
                          </button>
                        </CDropdownItem>
                        <CDropdownItem>
                          <button :disabled="finding.file_pinksheet == null"
                            @click="downloadPinkSheet(finding.file_pinksheet)" class="btn btn-info btn-sm text-white">
                            Download Pinksheet
                          </button>
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
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
      </div>
      <Pagination :totalPages="10" :perPage="10" :currentPage="currentPage" :totalPage="totalPage"
        @changePage="onPageChange" @changeLimit="onPageChangeLimit" />
    </div>

    <!-- detail modal -->
    <ModalFindingDetail :detailTemuanModal="detailTemuanModal" @close-modal="() => (detailTemuanModal = false)"
      :findingDetail="findingDetail" :formatTheDate="formatTheDate" />

    <!-- edit modal -->
    <CModal backdrop="static" alignment="center" :visible="editTemuanModal" @close="editTemuanModal = false" size="lg"
      scrollable>
      <CModalHeader>
        <CModalTitle>Edit temuan</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="col" v-if="showScoreField">
          <label>Score</label>
          <select class="form-select" v-model="findingDetail.score">
            <option v-for="opt in scoreopts" :key="opt.score" :value="opt.score">
              {{ opt.label }}
            </option>
          </select>
          <button class="btn btn-info my-2 btn-sm text-white" @click="
            () => {
              updateScoreFindingList()
            }
          ">
            Edit Score
          </button>
          <hr>
        </div>


        <div class="mb-2">
          <label class="mb-1">Line</label>
          <input type="text" class="form-control" v-model="findingDetail.line_nm" />
        </div>
        <div class="mb-2">
          <label class="mb-1">Source cat</label>
          <input type="text" class="form-control" v-model="findingDetail.source_category" disabled />
        </div>
        <div class="mb-2">
          <!-- <label class="mb-1">Tanggal temuan</label> -->
          <div class="row">
            <div class="col">
              <label class="mb-1">Tanggal Temuan</label>
              <input type="text" class="form-control" disabled :value="formatTheDate(findingDetail?.finding_date)" />
            </div>
            <div class="col">
              <label class="mb-1">Edit Tanggal Temuan</label>
              <input type="date" class="form-control" v-model="findingDetail.finding_date" />
              <small class="text-success">*Abaikan jika tidak ingin diubah</small>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <label class="mb-1">Pos</label>
          <input type="text" class="form-control" :value="findingDetail?.finding_location" />
        </div>
        <div class="mb-2">
          <label class="mb-1">Finding description / problem</label>
          <textarea cols="30" rows="5" class="form-control" v-model="findingDetail.finding_desc"></textarea>
        </div>
        <div class="mb-2">
          <div class="row">
            <div class="col">
              <label class="mb-1">Rencana Perbaikan</label>
              <input type="text" class="form-control" disabled
                :value="formatTheDate(findingDetail?.cm_str_plan_date)" />
            </div>
            <div class="col">
              <label class="mb-1">Edit Rencana Perbaikan</label>
              <input type="date" class="form-control" v-model="findingDetail.cm_str_plan_date" />
              <small class="text-success">*Abaikan jika tidak ingin diubah</small>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <label class="mb-1">Priority</label>
          <select class="form-select" v-model="findingDetail.cm_priority">
            <option selected>Select priority</option>
            <option value="P1">P1: Safety and Quality Issue</option>
            <option value="P2">P2: Productivity Issue</option>
            <option value="P3">P3: Cost Issue</option>
          </select>
        </div>
        <div class="mb-2">
          <div class="row">
            <div class="col">
              <label class="mb-1">PIC </label>
              <input type="text" class="form-control py-2" :value="findingDetail?.cm_pic_nm" disabled />
            </div>
            <div class="col">
              <label class="mb-1">Edit PIC</label>
              <!-- <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions">
              </VueMultiselect> -->
              <treeselect v-model="selectedPIC" :options="getUsersTreeselect2" />
              <small class="text-success">*Abaikan jika tidak ingin diubah</small>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <label class="mb-1">Countermeasure description</label>
          <textarea cols="30" rows="5" class="form-control" v-model="findingDetail.cm_desc"></textarea>
        </div>

        <div class="mb-2">
          <div class="row">
            <div class="col">
              <label class="mb-1">Countermeasure Start Plan Date</label>
              <input type="text" class="form-control" disabled
                :value="formatTheDate(findingDetail?.cm_str_plan_date)" />
            </div>
            <div class="col">
              <label class="mb-1">Edit Countermeasure Start Plan Date</label>
              <input type="date" class="form-control" v-model="findingDetail.cm_str_plan_date" />
              <small class="text-success">*Abaikan jika tidak ingin diubah</small>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <div class="row">
            <div class="col">
              <label class="mb-1">Countermeasure End Plan Date </label>
              <input type="text" class="form-control" disabled
                :value="formatTheDate(findingDetail?.cm_end_plan_date)" />
            </div>
            <div class="col">
              <label class="mb-1">Edit Countermeasure End Plan Date </label>
              <input type="date" class="form-control" v-model="findingDetail.cm_end_plan_date" />
              <small class="text-success">*Abaikan jika tidak ingin diubah</small>
            </div>
          </div>
        </div>

        <hr />

        <div class="mb-2">
          <div class="row">
            <div class="col">
              <label class="mb-1">Countermeasure Start actual date</label>
              <input type="text" class="form-control" disabled :value="formatTheDate(findingDetail?.cm_str_act_date)" />
            </div>
            <div class="col">
              <label class="mb-1">Edit Countermeasure Start actual date</label>
              <input type="date" class="form-control" v-model="findingDetail.cm_str_act_date" />
              <small v-if="findingDetail.cm_str_act_date" class="text-success">*Abaikan jika tidak ingin diubah</small>
              <small v-else class="text-danger">*Silahkan masukan tanggal</small>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <div class="row">
            <div class="col">
              <label class="mb-1">Countermeasure End actual date</label>
              <input type="text" class="form-control" disabled :value="formatTheDate(findingDetail?.cm_end_act_date)" />
            </div>
            <div class="col">
              <label class="mb-1">Edit Countermeasure End actual date</label>
              <input type="date" class="form-control" v-model="findingDetail.cm_end_act_date" />
              <small v-if="findingDetail.cm_end_act_date" class="text-success">*Abaikan jika tidak ingin diubah</small>
              <small v-else class="text-danger">*Silahkan masukan tanggal</small>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <div class="row">
            <div class="col">
              <label class="mb-1">Countermeasure Training date</label>
              <input type="text" class="form-control" disabled
                :value="formatTheDate(findingDetail?.cm_training_date)" />
            </div>
            <div class="col">
              <label class="mb-1">Edit Countermeasure Training date</label>
              <input type="date" class="form-control" v-model="findingDetail.cm_training_date" />
              <small v-if="findingDetail.cm_training_date" class="text-success">*Abaikan jika tidak ingin diubah</small>
              <small v-else class="text-danger">*Silahkan masukan tanggal</small>
            </div>
          </div>
        </div>
        <div class="mb-2">
          <label class="mb-1">Countermeasure Judge</label>
          <select class="form-select" v-model="findingDetail.cm_judg">
            <option value="true">Selesai</option>
            <option value="false">On Progress</option>
          </select>
          <small class="text-danger">*Wajib di isi</small>
        </div>
        <CInputGroup class="mb-3">
          <CInputGroupText>C/M Image</CInputGroupText>
          <CFormInput @change="onChangeCmImage($event)" ref="cm_image" aria-label="Input your kaizen file"
            type="file" />
          <CInputGroupText class="p-0">
            <button class="btn btn-sm btn-success" @click="uploadCmImage(selectedFindingID)"
              :disabled="isLoading">Upload
              Image</button>
          </CInputGroupText>
        </CInputGroup>
        <div class="col-12 col-md-12">
          <div class="mb-2">
            <div class="card p-2">
              <label>PIC Penanggung Jawab <small class="text-info">*TL UP</small></label>
              <!-- <VueMultiselect v-model="findingDetail.pic_supervisor_id" :options="picData"
                :custom-label="customPicOptions">
              </VueMultiselect> -->
              <treeselect v-model="findingDetail.pic_supervisor_id" :options="getUsersTreeselect2" />
            </div>
          </div>
        </div>
        <div v-if="findingDetail.observation_id" class="mb-2">
          <div class="card p-2">
            <label>Apakah ada perubahan SOP?</label>
            <CFormSwitch v-model="findingDetail.is_change_sop" />
            <div v-if="findingDetail.is_change_sop" class="col-12 col-md-12">
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
          </div>
        </div>
        <div v-if="findingDetail.observation_id" class="mb-2">
          <div class="card p-2">
            <label>Apakah ada Improvement?</label>
            <CFormSwitch v-model="findingDetail.is_need_improvement" />
            <div v-if="findingDetail.is_need_improvement" class="row">
              <div class="col-12 col-md-12">
                <CInputGroup class="mb-3">
                  <CInputGroupText>Kaizen File</CInputGroupText>
                  <CFormInput @change="onChangeKaizenFile($event)" ref="kaizen_file" aria-label="Input your kaizen file"
                    type="file" />
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
        <div class="mb-5">
          <label class="mb-1">Countermeasure Sign LH Red</label>
          <br />
          <div v-if="findingDetail?.cm_sign_lh_red" style="border: 1px solid #eaeaea; width: 100%; height: 100px">
            <input type="image" v-if="updatedLHRedSign" :src="updatedLHRedSign" style="width: 100%; height: 100%" />
            <input type="image" v-else :src="findingDetail?.cm_sign_lh_red" style="width: 100%; height: 100%" />

            <button class="btn btn-secondary my-2 btn-sm text-white" @click="
              () => {
                showSignLhRed = true
                showSignLhWhite = false
                showSignSH = false
              }
            ">
              Edit sign
            </button>
          </div>
          <!-- to add sign -->
          <div v-else>
            <button class="btn btn-info my-2 btn-sm text-white" @click="showAddSignature('lhred')">
              Add signature
            </button>

            <div v-if="showSignLhRed" id="sign-wrapper" style="width: 100%; height: 100px; border: 1px solid #eaeaea">
              <vueSignature ref="cm_sign_lh_red" :sigOption="option" :w="'100%'" :h="'100px'">
              </vueSignature>
              <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
                @click="saveSignature('cm_sign_lh_red')">
                {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
              </button>
              <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_lh_red')">
                Clear
              </button>
            </div>
          </div>
          <!-- to edit sign -->
          <div v-if="showSignLhRed && findingDetail?.cm_sign_lh_red" id="sign-wrapper"
            style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="cm_sign_lh_red" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('cm_sign_lh_red')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_lh_red')">
              Clear
            </button>
          </div>
        </div>

        <div class="mb-2 my-3">
          <label class="mb-1">Countermeasure Sign LH White</label>
          <br />
          <div v-if="findingDetail?.cm_sign_lh_white" style="border: 1px solid #eaeaea; width: 100%; height: 100px">
            <input type="image" v-if="updatedLHWhiteSign" :src="updatedLHWhiteSign" style="width: 100%; height: 100%" />
            <input type="image" v-else :src="findingDetail?.cm_sign_lh_white" style="width: 100%; height: 100%" />

            <button class="btn btn-secondary my-2 btn-sm text-white" @click="
              () => {
                showSignLhRed = false
                showSignLhWhite = true
                showSignSH = false
              }
            ">
              Edit sign
            </button>
          </div>
          <!-- to add sign -->
          <div v-else>
            <button class="btn btn-info my-2 btn-sm text-white" @click="showAddSignature('lhwhite')">
              Add signature
            </button>

            <div v-if="showSignLhWhite" id="sign-wrapper" style="width: 100%; height: 100px; border: 1px solid #eaeaea">
              <vueSignature ref="cm_sign_lh_white" :sigOption="option" :w="'100%'" :h="'100px'">
              </vueSignature>
              <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
                @click="saveSignature('cm_sign_lh_white')">
                {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
              </button>
              <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_lh_white')">
                Clear
              </button>
            </div>
          </div>
          <!-- to edit sign -->
          <div v-if="showSignLhWhite && findingDetail?.cm_sign_lh_white" id="sign-wrapper"
            style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="cm_sign_lh_white" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('cm_sign_lh_white')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_lh_white')">
              Clear
            </button>
          </div>
        </div>

        <div class="mb-2 my-5">
          <label class="mb-1">Countermeasure Sign SH/AM/MGR</label>
          <br />
          <div v-if="findingDetail?.cm_sign_sh" style="border: 1px solid #eaeaea; width: 100%; height: 100px">
            <input type="image" v-if="updatedSHSign" :src="updatedSHSign" style="width: 100%; height: 100%" />
            <input type="image" v-else :src="findingDetail?.cm_sign_sh" style="width: 100%; height: 100%" />

            <button class="btn btn-secondary my-2 btn-sm text-white" @click="
              () => {
                showSignLhRed = false
                showSignLhWhite = false
                showSignSH = true
              }
            ">
              Edit sign
            </button>
          </div>
          <!-- to add sign -->
          <div v-else>
            <button class="btn btn-info my-2 btn-sm text-white" @click="showAddSignature('sh')">
              Add signature
            </button>

            <div v-if="showSignSH" id="sign-wrapper" style="width: 100%; height: 100px; border: 1px solid #eaeaea">
              <vueSignature ref="cm_sign_sh" :sigOption="option" :w="'100%'" :h="'100px'">
              </vueSignature>
              <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
                @click="saveSignature('cm_sign_sh')">
                {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
              </button>
              <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_sh')">
                Clear
              </button>
            </div>
          </div>
          <!-- to edit sign -->
          <div v-if="showSignSH && findingDetail?.cm_sign_sh" id="sign-wrapper"
            style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="cm_sign_sh" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('cm_sign_sh')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_sh')">
              Clear
            </button>
          </div>
        </div>

        <div class="mb-2 my-5" style="margin-top: 40px">
          <label class="mb-1">File Pink sheet (*file pdf)</label>
          <input ref="pink_sheet" type="file" class="form-control" />

          <div v-if="selectedPinkSheet || findingDetail?.file_pinksheet">
            <button @click="viewPinkSheet()" v-if="selectedPinkSheet" class="btn btn-info btn-sm my-2 text-white">
              View updated file
            </button>
            <button @click="viewPinkSheet()" v-else class="btn btn-info btn-sm my-2 text-white">
              View file
            </button>
            <button class="btn btn-info btn-sm my-2 mx-2 text-white" :disabled="isUploadKaizenFile"
              @click="uploadPinkSheet('pink_sheet')">
              {{ isUploadKaizenFile ? 'Updating..' : 'Update pink sheet' }}
            </button>
          </div>
          <div v-else>
            <button class="btn btn-info btn-sm my-2 text-white" :disabled="isUploadKaizenFile"
              @click="uploadPinkSheet('pink_sheet')">
              {{ isUploadKaizenFile ? 'Uploading..' : 'Upload pink sheet' }}
            </button>
          </div>
        </div>
        <div class="mb-2">
          <label class="mb-1">Countermeasure Comments</label>
          <input type="text" class="form-control" v-model="findingDetail.cm_comments" />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="info" class="text-white" @click="
          () => {
            updateFindingList()
          }
        ">
          Update data
        </CButton>
        <CButton color="secondary" class="text-white" @click="
          () => {
            selectedFindingIndex = null
            editTemuanModal = false
          }
        ">
          Close
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- add sign modal -->
    <CModal backdrop="static" alignment="center" :visible="addSignModal" @close="addSignModal = false" size="lg"
      scrollable>
      <CModalHeader>
        <CModalTitle>Add sign</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-5">
          <label class="mb-1">Countermeasure Sign LH Red</label>
          <br />
          <div v-if="findingDetail?.cm_sign_lh_red" style="border: 1px solid #eaeaea; width: 100%; height: 100px">
            <input type="image" v-if="updatedLHRedSign" :src="updatedLHRedSign" style="width: 100%; height: 100%" />
            <input type="image" v-else :src="findingDetail?.cm_sign_lh_red" style="width: 100%; height: 100%" />

            <button class="btn btn-secondary my-2 btn-sm text-white" @click="
              () => {
                showSignLhRed = true
                showSignLhWhite = false
                showSignSH = false
              }
            ">
              Edit sign
            </button>
          </div>
          <!-- to add sign -->
          <div v-else>
            <div v-if="updatedLHRedSign" style="border: 1px solid #eaeaea; width: 100%; height: 100px">
              <img :src="updatedLHRedSign" alt="" style="width: 100%; height: 100%" />
            </div>

            <button class="btn btn-info my-2 btn-sm text-white" @click="showAddSignature('lhred')">
              Add signature
            </button>

            <div v-if="showSignLhRed" id="sign-wrapper" style="width: 100%; height: 100px; border: 1px solid #eaeaea">
              <vueSignature ref="cm_sign_lh_red" :sigOption="option" :w="'100%'" :h="'100px'">
              </vueSignature>
              <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
                @click="saveSignature('cm_sign_lh_red')">
                {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
              </button>
              <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_lh_red')">
                Clear
              </button>
            </div>
          </div>
          <!-- to edit sign -->
          <div v-if="showSignLhRed && findingDetail?.cm_sign_lh_red" id="sign-wrapper"
            style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="cm_sign_lh_red" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('cm_sign_lh_red')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_lh_red')">
              Clear
            </button>
          </div>
        </div>

        <div class="mb-2 my-3">
          <label class="mb-1">Countermeasure Sign LH White</label>
          <br />
          <div v-if="findingDetail?.cm_sign_lh_white" style="border: 1px solid #eaeaea; width: 100%; height: 100px">
            <input type="image" v-if="updatedLHWhiteSign" :src="updatedLHWhiteSign" style="width: 100%; height: 100%" />
            <input type="image" v-else :src="findingDetail?.cm_sign_lh_white" style="width: 100%; height: 100%" />

            <button class="btn btn-secondary my-2 btn-sm text-white" @click="
              () => {
                showSignLhRed = false
                showSignLhWhite = true
                showSignSH = false
              }
            ">
              Edit sign
            </button>
          </div>
          <!-- to add sign -->
          <div v-else>
            <div v-if="updatedLHWhiteSign" style="border: 1px solid #eaeaea; width: 100%; height: 100px">
              <img :src="updatedLHWhiteSign" alt="" style="width: 100%; height: 100%" />
            </div>

            <button class="btn btn-info my-2 btn-sm text-white" @click="showAddSignature('lhwhite')">
              Add signature
            </button>

            <div v-if="showSignLhWhite" id="sign-wrapper" style="width: 100%; height: 100px; border: 1px solid #eaeaea">
              <vueSignature ref="cm_sign_lh_white" :sigOption="option" :w="'100%'" :h="'100px'">
              </vueSignature>
              <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
                @click="saveSignature('cm_sign_lh_white')">
                {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
              </button>
              <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_lh_white')">
                Clear
              </button>
            </div>
          </div>
          <!-- to edit sign -->
          <div v-if="showSignLhWhite && findingDetail?.cm_sign_lh_white" id="sign-wrapper"
            style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="cm_sign_lh_white" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('cm_sign_lh_white')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_lh_white')">
              Clear
            </button>
          </div>
        </div>

        <div class="mb-2 my-5">
          <label class="mb-1">Countermeasure Sign SH/AM/MGR</label>
          <br />
          <div v-if="findingDetail?.cm_sign_sh" style="border: 1px solid #eaeaea; width: 100%; height: 100px">
            <input type="image" v-if="updatedSHSign" :src="updatedSHSign" style="width: 100%; height: 100%" />
            <input type="image" v-else :src="findingDetail?.cm_sign_sh" style="width: 100%; height: 100%" />

            <button class="btn btn-secondary my-2 btn-sm text-white" @click="
              () => {
                showSignLhRed = false
                showSignLhWhite = false
                showSignSH = true
              }
            ">
              Edit sign
            </button>
          </div>
          <!-- to add sign -->
          <div v-else>
            <div v-if="updatedSHSign" style="border: 1px solid #eaeaea; width: 100%; height: 100px">
              <img :src="updatedSHSign" alt="" style="width: 100%; height: 100%" />
            </div>

            <button class="btn btn-info my-2 btn-sm text-white" @click="showAddSignature('sh')">
              Add signature
            </button>

            <div v-if="showSignSH" id="sign-wrapper" style="width: 100%; height: 100px; border: 1px solid #eaeaea">
              <vueSignature ref="cm_sign_sh" :sigOption="option" :w="'100%'" :h="'100px'">
              </vueSignature>
              <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
                @click="saveSignature('cm_sign_sh')">
                {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
              </button>
              <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_sh')">
                Clear
              </button>
            </div>
          </div>
          <!-- to edit sign -->
          <div v-if="showSignSH && findingDetail?.cm_sign_sh" id="sign-wrapper"
            style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="cm_sign_sh" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-2 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('cm_sign_sh')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-2 text-white" @click="clearSignature('cm_sign_sh')">
              Clear
            </button>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="
          () => {
            selectedFindingIndex = null
            addSignModal = false
            getFindingsFunc()
          }
        ">
          Close
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- finding image detail modal -->
    <CModal backdrop="static" alignment="center" :visible="findingImageModal" @close="findingImageModal = false"
      size="lg" scrollable>
      <CModalHeader>
        <CModalTitle>Finding Image Detail</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <img :src="selectedFindingImage" width="100%" alt="" />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="
          () => {
            findingImageModal = false
          }
        ">
          Close
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
  </div>
</template>

<script>
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

import { GET_USERS } from '@/store/modules/user.module'
import { GET_FINDINGS } from '@/store/modules/finding.module'
import { GET_LINES } from '@/store/modules/line.module'
import { mapGetters } from 'vuex'
// import VueMultiselect from 'vue-multiselect'
import Loading from 'vue-loading-overlay'
import ApiService from '@/store/api.service'
import Pagination from '@/components/Pagination.vue'
import Swal from 'sweetalert2'
import vueSignature from 'vue-signature'
import { toast } from 'vue3-toastify'
import ModalFindingDetail from '@/components/ModalFinding/ModalFindingDetail.vue'
import HeadFindingList from '@/components/table/HeadFindingList.vue'
import { COLOR_STW } from '@/constant/COLOR_STW'
import VuePdfEmbed from 'vue-pdf-embed'
import SCORE_MOCK from '@/mocks/score.mock'

export default {
  name: 'List Temuan',
  data() {
    return {
      // for export data
      showScoreField: false,
      COLOR_STW,
      json_fields: {
        FindingID: 'finding_id',
        'Finding Date': 'finding_date',
        Line: 'line_nm',
        Shift: 'group_nm',
        Suorce: 'source_category',
        Location: 'finding_location',
        Finding: 'finding_desc',
        Countermeasure: 'cm_desc',
        Pic: 'cm_pic_nm',
        'CM Priority': 'cm_priority',
        'CM Factor': 'factor_nm',
        'Plan Date Start CM': 'cm_str_plan_date',
        'End Date Start CM': 'cm_end_plan_date',
        Status: 'status_finding',
      },

      json_data: null,
      selected_json_data: null,
      isLoading: false,
      isUploadKaizenFile: false,
      isUploadSignLoading: false,
      currentPage: 1,
      currentPageLimit: 10,
      num: 48,
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
      addSignModal: false,
      selectedFindingIndex: null,
      selectedFindingIndexToAddSign: null,
      picData: [],
      selectedPIC: null,
      todayDate: '2024-02-16',
      // sign
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)',
      },
      disabled: false,
      dataUrl: 'https://avatars2.githubusercontent.com/u/17644818?s=460&v=4',
      selectedPinkSheet: null,
      showSignLhRed: false,
      showSignLhWhite: false,
      showSignSH: false,
      selectedSignature: null,
      selectedFindingID: null,
      updatedLHWhiteSign: null,
      updatedLHRedSign: null,
      updatedSHSign: null,
      findingDataToExport: null,
      cm_comments: null,
      APPURL: process.env.VUE_APP_URL,
      findingImageModal: false,
      selectedFindingImage: null,
      totalPage: 0,
      isLinkAbnormality: false,
      attachment: null,
      cmImage: null,
      kaizenFile: null,
      isKaizenModal: false,
      isSopModal: false,
      sopBefore: null,
      sopAfter: null,
      scoreopts: SCORE_MOCK,
    }
  },
  watch: {
    selectedLine: {
      immediate: true,
      handler() {
        this.$router.push({
          path: '/stw/list-temuan',
          query: {
            line_id: this.selectedLine,
            source_category: this.selectedFilterSourceCat,
            cm_judg: this.selectedFilterJudge,
            start_date: this.selectedFilterStartDate,
            end_date: this.selectedFilterEndDate,
          },
        })
      },
    },
    selectedFilterSourceCat: {
      immediate: true,
      handler() {
        this.$router.push({
          path: '/stw/list-temuan',
          query: {
            line_id: this.selectedLine,
            source_category: this.selectedFilterSourceCat,
            cm_judg: this.selectedFilterJudge,
            start_date: this.selectedFilterStartDate,
            end_date: this.selectedFilterEndDate,
          },
        })
      },
    },
    selectedFilterJudge: {
      immediate: true,
      handler() {
        this.$router.push({
          path: '/stw/list-temuan',
          query: {
            line_id: this.selectedLine,
            source_category: this.selectedFilterSourceCat,
            cm_judg: this.selectedFilterJudge,
            start_date: this.selectedFilterStartDate,
            end_date: this.selectedFilterEndDate,
          },
        })
      },
    },
    selectedFilterStartDate: {
      immediate: true,
      handler() {
        this.$router.push({
          path: '/stw/list-temuan',
          query: {
            line_id: this.selectedLine,
            source_category: this.selectedFilterSourceCat,
            cm_judg: this.selectedFilterJudge,
            start_date: this.selectedFilterStartDate,
            end_date: this.selectedFilterEndDate,
          },
        })
      },
    },
    selectedFilterEndDate: {
      immediate: true,
      handler() {
        this.$router.push({
          path: '/stw/list-temuan',
          query: {
            line_id: this.selectedLine,
            source_category: this.selectedFilterSourceCat,
            cm_judg: this.selectedFilterJudge,
            start_date: this.selectedFilterStartDate,
            end_date: this.selectedFilterEndDate,
          },
        })
      },
    },
  },
  computed: {
    ...mapGetters(['getUsersOpts', 'getFindings', 'getLinesOpts', 'getUsersTreeselect2']),
  },
  methods: {
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },
    showKaizenModal(kaizenFile) {
      this.kaizenFile = kaizenFile
      this.isKaizenModal = true
    },
    showSopModal(sopBefore, sopAfter) {
      this.sopBefore = sopBefore
      this.sopAfter = sopAfter
      this.isSopModal = true
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
        formData.append('finding_id', this.selectedFindingID)
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
    onChangeCmImage(event) {
      this.cmImage = event.target.files[0]
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
        formData.append('finding_id', this.selectedFindingID)
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
    onChangeSopFile(event) {
      this.attachment = event.target.files[0]
    },
    async uploadSopFile() {
      try {
        this.isLoading = true
        if (!this.attachment) {
          toast.info('Please select file')
          this.isLoading = false
          return
        }
        const formData = new FormData()
        formData.append('dest', 'job')
        formData.append('job_id', this.findingDetail.job_id)
        formData.append('attachment', this.attachment)
        formData.append('stw_finding_id', this.selectedFindingID)

        await ApiService.put(
          `/master/job/upload-sop?dest=job`,
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
        toast.error(JSON.stringify(error.message))
        this.isLoading = false
        setTimeout(() => {
          toast.remove()
        }, 2000)
      }
    },
    saveSignature(from) {
      var signFile
      switch (from) {
        case 'cm_sign_lh_red':
          signFile = this.$refs[from].save()
          this.selectedSignature = {
            [`finding_id`]: this.selectedFindingID,
            [`${from}`]: signFile,
          }
          break
        case 'cm_sign_lh_white':
          signFile = this.$refs[from].save()
          this.selectedSignature = {
            [`finding_id`]: this.selectedFindingID,
            [`${from}`]: signFile,
          }
          break
        case 'cm_sign_sh':
          signFile = this.$refs[from].save()
          this.selectedSignature = {
            [`finding_id`]: this.selectedFindingID,
            [`${from}`]: signFile,
          }
          break

        default:
          break
      }

      this.uploadSignature(from)
    },
    clearSignature(from) {
      var _this = this

      switch (from) {
        case 'cm_sign_lh_red':
          _this.$refs[from].clear()
          break
        case 'cm_sign_lh_white':
          _this.$refs[from].clear()
          break
        case 'cm_sign_sh':
          _this.$refs[from].clear()
          break

        default:
          break
      }
    },
    showAddSignature(from, index) {
      if (from == 'lhred') {
        this.showSignLhRed = true
        this.selectedFindingIndexToAddSign = index
        this.showSignLhWhite = false
        this.showSignSH = false
      } else if (from == 'lhwhite') {
        this.showSignLhRed = false
        this.showSignLhWhite = true
        this.showSignSH = false
      } else {
        this.showSignLhRed = false
        this.showSignLhWhite = false
        this.showSignSH = true
      }
    },
    async uploadSignature(from) {
      this.isUploadSignLoading = true
      ApiService.setHeader()
      const upload = await ApiService.put(
        `/operational/findingCm/upload-sign`,
        this.selectedSignature,
      )
      if (upload.data.message == 'success to sign finding') {
        this.isUploadSignLoading = false

        switch (from) {
          case 'cm_sign_lh_red':
            this.updatedLHRedSign = upload.data.data.cm_sign_lh_red
            this.showSignLhRed = false
            break
          case 'cm_sign_lh_white':
            this.updatedLHWhiteSign = upload.data.data.cm_sign_lh_white
            this.showSignLhWhite = false
            break
          case 'cm_sign_sh':
            this.updatedSHSign = upload.data.data.cm_sign_sh
            this.showSignSH = false
            break
          default:
            break
        }
        alert('Sign saved')
      }
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
        await this.$store.dispatch(GET_USERS)
        if (this.getUsersOpts) {
          await this.mapUsersData()
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
            this.totalPage = res[0]?.total_page
            this.isLoading = false
            this.json_data = res
          }
        })
      } catch (error) {
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async deleteFinding(findingID) {
      Swal.fire({
        title: 'Are you sure to delete this finding?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          ApiService.setHeader()
          await ApiService.delete(
            `operational/findingCm/delete/${findingID}`,
          ).then((res) => {
            if (res.data.message == 'Success to DELETE finding') {
              toast.success('Data deleted', {
                autoClose: 1000,
              })
              this.getFindingsFunc()
            } else {
              toast.error('Failed to add data', {
                autoClose: 1000,
              })
            }
          })
        } else if (result.isDenied) {
          toast.error('Internal system error', {
            autoClose: 700,
          })
        }
      })
    },

    async updateCMComments(findingID, val, findingIndex) {
      this.cm_comments = val
      this.selectedFindingID = findingID
      this.getDetailTemuan(findingIndex)
    },
    async saveCMComments() {
      try {
        const data = {
          line_id: this.findingDetail.line_id,
          finding_date: this.formatTheDate(this.findingDetail.finding_date), // from henkaten_date
          finding_location: this.findingDetail.finding_location, // from mv_location
          finding_desc: this.findingDetail.finding_desc, // from mv_problem
          cm_desc: this.findingDetail.cm_desc, // from mv_countermeasure
          cm_priority: this.findingDetail.cm_priority,
          category_id: '5b5bfd20-f5f7-4edc-8030-1d3e3f15d0e6', // select manual (STW, Safety, quality,etc.)
          factor_id: this.findingDetail.factor_id, // from mv_factor_id
          cm_pic_id: this.findingDetail.cm_pic_id, // from henkaten_pic
          cm_str_plan_date: this.findingDetail.cm_str_plan_date, // from mv_plan_date
          cm_end_plan_date: this.findingDetail.cm_end_plan_date, // from mv_plan_date
          cm_result_factor_id: this.findingDetail.factor_id,
          // below can input after findings input (no mandatory)
          cm_str_act_date: this.findingDetail.cm_str_act_date, // from mv_actual_date
          cm_end_act_date: this.findingDetail.cm_end_act_date, // from mv_actual_date
          cm_training_date: this.findingDetail.cm_training_date, // from mv_training_date
          cm_judg: this.findingDetail.cm_judg,
          cm_sign_lh_red: this.findingDetail.cm_sign_lh_red
            ? this.findingDetail.cm_sign_lh_red
            : null,
          cm_sign_lh_white: this.findingDetail.cm_sign_lh_white
            ? this.findingDetail.cm_sign_lh_white
            : null,
          cm_sign_sh: this.findingDetail.cm_sign_sh
            ? this.findingDetail.cm_sign_sh
            : null,
          cm_comments: this.cm_comments,
        }

        ApiService.setHeader()
        const updateData = await ApiService.put(
          `operational/findingCm/edit/${this.selectedFindingID}`,
          data,
        )

        if (updateData) {
          Swal.fire('Data updated!', '', 'success')
          this.editTemuanModal = false
          this.getFindingsFunc()
        } else {
          Swal.fire('Error', '', 'warning')
        }
      } catch (error) {
        console.log(error)
        Swal.fire('Failed to update finding data', '', 'error')
        this.editTemuanModal = false
      }
    },
    async updateScoreFindingList() {
      try {
        const findingID = this.selectedFindingID
        const data = { score: this.findingDetail.score, }
        ApiService.setHeader()
        const updateData = await ApiService.put(
          `operational/findingCm/score/${findingID}`,
          data,
        )
        if (updateData) {
          Swal.fire('Data updated!', '', 'success')
          this.editTemuanModal = false
          this.getFindingsFunc()
        } else {
          Swal.fire('Error', '', 'warning')
        }
      } catch (error) {
        console.log(error)
        Swal.fire('Failed to update finding data', '', 'error')
        this.editTemuanModal = false
      }
    },



    async updateFindingList() {
      try {
        const findingID = this.selectedFindingID
        const data = {
          score: this.findingDetail.score,
          line_id: this.findingDetail.line_id,
          finding_date: this.formatTheDate(this.findingDetail.finding_date), // from henkaten_date
          finding_location: this.findingDetail.finding_location, // from mv_location
          finding_desc: this.findingDetail.finding_desc, // from mv_problem
          cm_desc: this.findingDetail.cm_desc, // from mv_countermeasure
          cm_priority: this.findingDetail.cm_priority,
          category_id: '5b5bfd20-f5f7-4edc-8030-1d3e3f15d0e6', // select manual (STW, Safety, quality,etc.)
          factor_id: this.findingDetail.factor_id, // from mv_factor_id
          cm_pic_id: this.selectedPIC, // from henkaten_pic
          cm_str_plan_date: this.findingDetail.cm_str_plan_date, // from mv_plan_date
          cm_end_plan_date: this.findingDetail.cm_end_plan_date, // from mv_plan_date
          cm_result_factor_id: this.findingDetail.factor_id,
          // below can input after findings input (no mandatory)
          cm_str_act_date: this.findingDetail.cm_str_act_date, // from mv_actual_date
          cm_end_act_date: this.findingDetail.cm_end_act_date, // from mv_actual_date
          cm_training_date: this.findingDetail.cm_training_date, // from mv_training_date
          cm_judg: this.findingDetail.cm_judg,
          cm_sign_lh_red: this.findingDetail.cm_sign_lh_red
            ? this.findingDetail.cm_sign_lh_red
            : null,
          cm_sign_lh_white: this.findingDetail.cm_sign_lh_white
            ? this.findingDetail.cm_sign_lh_white
            : null,
          cm_sign_sh: this.findingDetail.cm_sign_sh
            ? this.findingDetail.cm_sign_sh
            : null,
          cm_comments: this.cm_comments,
          is_need_improvement: this.findingDetail.is_need_improvement,
          is_change_sop: this.findingDetail.is_change_sop,
          cm_image: this.findingDetail.cm_image,
          pic_supervisor_id: this.findingDetail.pic_supervisor_id
        }
        ApiService.setHeader()
        const updateData = await ApiService.put(
          `operational/findingCm/edit/${findingID}`,
          data,
        )

        if (updateData) {
          Swal.fire('Data updated!', '', 'success')
          this.editTemuanModal = false
          this.getFindingsFunc()
        } else {
          Swal.fire('Error', '', 'warning')
        }
      } catch (error) {
        console.log(error)
        Swal.fire('Failed to update finding data', '', 'error')
        this.editTemuanModal = false
      }
    },



    async uploadPinkSheet(state) {
      this.isUploadKaizenFile = true
      let findingID = await this.getFindings[this.selectedFindingIndex]
        .finding_id
      let is_before_path = await this.getFindings[this.selectedFindingIndex]
        .file_pinksheet
      let before_path

      if (is_before_path == null) {
        before_path = null
      } else {
        before_path = is_before_path
      }

      ApiService.setHeader()
      const image = this.$refs[state].files[0]

      const formData = new FormData()
      formData.append('finding_id', findingID)
      formData.append('before_path', before_path)
      formData.append('dest', 'pinkSheet')
      formData.append('attachment', image)

      const upload = await ApiService.post(
        `/operational/findingCm/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (upload.data.data) {
        alert('Kaizen file updated')
        this.isUploadKaizenFile = false
        this.selectedPinkSheet = `${process.env.VUE_APP_URL}/file?path=${upload.data.data}`
      }
    },
    viewPinkSheet() {
      if (this.selectedPinkSheet) {
        window.open(`${this.selectedPinkSheet}`, '_blank')
      } else {
        window.open(
          `${process.env.VUE_APP_URL}/file?path=${this.findingDetail?.file_pinksheet}`,
          '_blank',
        )
      }
    },
    openFindingImage(findingImage) {
      this.findingImageModal = true
      this.selectedFindingImage = findingImage
    },
    getDetailTemuan(findingIndex) {
      const data = this.getFindings[findingIndex]
      this.selectedFindingID = data.finding_id
      this.selectedFindingIndex = findingIndex
      this.findingDetail = data
    },
    refetchDetailTemuan() {
      const data = this.getFindings[this.selectedFindingID]
      this.findingDetail = data
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
    downloadPinkSheet(filePath) {
      window.open(`${process.env.VUE_APP_URL}/file?path=${filePath}`, '_blank')
    },
    downloadReport(obsID) {
      this.$router.push(`/observation/report/${obsID}?is_back=true`, '_blank')
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
    this.selectedFilterStartDate = this.$route.query.start_date
    this.selectedFileterEndDate = this.$route.query.end_date

    // const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    // const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]

    // this.selectedMonth = `${year}-${month}`
    // this.selectedFilterStartDate = `${year}-01-01`
    // this.selectedFilterEndDate = `${year}-12-31`

    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : `0${new Date().getMonth() + 1}`
    const lastDateThisMonth = new Date(year, month, 0).getDate()
    this.selectedMonth = `${year}-${month}`
    this.selectedFilterStartDate = `${year}-${month}-01`
    this.selectedFilterEndDate = `${year}-${month}-${lastDateThisMonth}`
    this.selectedLine = this.$route.query.line_id
      ? this.$route.query.line_id
      : localStorage.getItem('line_id')
    await this.getUsers()
    await this.getFindingsFunc()
    await this.getLines()
    await this.AccesibilityScore()
  },
  components: {
    // VueMultiselect,
    Loading,
    Pagination,
    vueSignature,
    ModalFindingDetail,
    HeadFindingList,
    VuePdfEmbed,
    Treeselect
  },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
.fixed-td {
  position: absolute;
}

.tableFixHead {
  overflow: auto;
  height: 100%;
}

.tableFixHead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

#fixCol-1 {
  position: sticky;
  width: 38px;
  top: 125px;
  left: 0px;
  z-index: 30;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 125px;
  left: 37px;
  z-index: 1;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  min-width: 121px;
  top: 125px;
  left: 125px;
  z-index: 1;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 125px;
  left: 220px;
  z-index: 1;
  background-color: white;
}

#fixCol-5 {
  position: sticky;
  top: 125px;
  left: 320px;
  z-index: 1;
  background-color: white;
}

#fixCol-6 {
  position: sticky;
  max-width: 300px;
  min-width: 300px;
  width: 300px;
  top: 125px;
  left: 370px;
  z-index: 1;
  background-color: white;
}
</style>
