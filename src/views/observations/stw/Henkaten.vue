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
        <h5>Henkaten List</h5>
        <div>
          <button class="btn btn-info text-white mx-2" @click="() => {
            addHenkatenModal = true
            mapUsersData()
          }
          ">
            Add henkaten
          </button>
          <button :disabled="getHenkatens?.length < 1" class="btn btn-info text-white w-full my-1">
            <download-excel :data="json_data" :fields="json_fields" worksheet="My Worksheet" name="henkaten.xls">
              Export all data
            </download-excel>
          </button>
        </div>
      </div>
      <div>
        <table class="table table-striped text-center">
          <thead>
            <tr>
              <th>No</th>
              <th>Line</th>
              <th>Date</th>
              <th>Machine</th>
              <th>PIC</th>
              <th>Perubahan</th>
              <th>Tujuan</th>
              <th>Safety</th>
              <th>Quality</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="10" class="p-0" style="height: 200px">
                <div class="vl-parent p-0" style="height: 100%">
                  <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
                </div>
              </td>
            </tr>
            <tr v-else v-for="(henkaten, index) in getHenkatens" :key="index">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ henkaten.line_nm }}</td>
              <td>{{ formatTheDate(henkaten.henkaten_date) }}</td>
              <td>{{ henkaten.henkaten_location }}</td>
              <td>{{ henkaten.henkaten_pic_nm }}</td>
              <td>{{ henkaten.henkaten_desc }}</td>
              <td>{{ henkaten.henkaten_purpose }}</td>
              <td>{{ henkaten.henkaten_flw_safety }}</td>
              <td>{{ henkaten.henkaten_flw_quality }}</td>
              <td id="fixCol-9" class="px-4">
                <template v-for="labelScore in scoreopts">
                  <label :key="labelScore.score" v-if="labelScore.score === henkaten.score">{{ labelScore.label
                    }}</label>
                </template>
              </td>

              <td class="d-flex justify-content-between">
                <!-- <div class="d-flex justify-content-center"> -->
                <button v-if="henkaten.findings[0].finding_img" class="btn btn-info btn-sm text-white w-full my-1 mx-1"
                  @click="showFindingImg(henkaten.findings[0]?.finding_img)"
                  :disabled="!henkaten.findings[0]?.finding_img">Finding
                  Image</button>
                <button v-else class="btn btn-secondary btn-sm w-full my-1 mx-1" disabled>
                  No Image
                </button>
                <button v-if="henkaten.findings[0].cm_image" @click="
                  () => {
                    showFindingImg(henkaten.findings[0].cm_image)
                  }
                " class="btn btn-info btn-sm text-white w-full my-1 mx-1">
                  C/M image
                </button>
                <button v-else class="btn btn-secondary btn-sm w-full my-1 mx-1" disabled>
                  No Image C/M
                </button>
                <button :class="{
                  'btn btn-sm w-full my-1 mx-1': true,
                  'btn-info text-white': henkaten.findings[0].kaizen_file,
                  'btn-secondary text-white': !henkaten.findings[0].kaizen_file,
                }" @click="showKaizenModal(henkaten.findings[0].kaizen_file)"
                  :disabled="!henkaten.findings[0].kaizen_file">
                  Kaizen
                </button>
                <button class="btn btn-info btn-sm text-white w-full my-1 mx-1" @click="getDetailHenkaten(index)">
                  Edit
                </button>
                <button class="btn btn-danger btn-sm text-white w-full my-1 mx-1"
                  @click="deleteHenkaten(henkaten.henkaten_id)">
                  Delete
                </button>
                <!-- </div> -->
              </td>
            </tr>
            <tr v-if="getHenkatens?.length < 1">
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

    <!-- add modals -->
    <CModal scrollable backdrop="static" alignment="center" :visible="addHenkatenModal"
      @close="addHenkatenModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Add henkaten</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Henkaten input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <label class="mb-1">Start date</label>
                  <input type="date" class="form-control" v-model="henkatenData.henkaten_date" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Henkaten location</label>
                  <input type="text" class="form-control" v-model="henkatenData.henkaten_location" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>
                  <VueMultiselect v-model="selectedLineID" :options="lineData" :custom-label="customLineFilterOptions">
                  </VueMultiselect>
                </div>
                <div class="mb-2">
                  <label class="mb-1">PIC</label>
                  <treeselect v-if="getUsersTree" class="w-100" v-model="henkatenData.henkaten_pic"
                    :options="getUsersTree" />
                  <!-- <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions"> -->
                  <!-- </VueMultiselect> -->
                </div>
                <div class="mb-2">
                  <label class="mb-1">Perubahan</label>
                  <textarea type="text" class="form-control" v-model="henkatenData.henkaten_desc">
              </textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Tujuan</label>
                  <textarea type="text" class="form-control" v-model="henkatenData.henkaten_purpose">
              </textarea>
                </div>
                <span style="font-weight: bold" class="mb-2">Follow (2 weeks) item</span>
                <div class="mb-2">
                  <label class="mb-1">Safety</label>
                  <input type="text" class="form-control" v-model="henkatenData.henkaten_flw_safety" />
                </div>
                <div>
                  <label class="mb-1">Quality</label>
                  <input type="text" class="form-control" v-model="henkatenData.henkaten_flw_quality" />
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
                  <input type="date" class="form-control" v-model="henkatenData.henkaten_date" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Line</label>
                  <VueMultiselect v-model="selectedLineID" :options="lineData" :custom-label="customLineFilterOptions">
                  </VueMultiselect>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pos</label>
                  <input type="text" class="form-control" v-model="henkatenData.henkaten_location" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Finding description</label>
                  <textarea cols="30" rows="5" class="form-control" v-model="henkatenData.henkaten_desc"></textarea>
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
                  <!-- here -->
                  <treeselect v-if="getUsersTree" class="w-100" v-model="findingsData.cm_pic_id"
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
                    <input ref="henkaten-finding-image" type="file" class="form-control" />
                  </div>
                  <button class="btn btn-info my-2 text-white" :disabled="isUploadLoading" @click="
                    uploadFindingImage('henkaten-finding-image', null)
                    ">
                    {{ isUploadLoading ? 'Uploading' : 'Upload' }}
                  </button>
                  <div v-if="selectedFindingImage">
                    <img :src="selectedFindingImage" width="300" alt="" />
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
        <CButton color="secondary" @click="addHenkatenModal = false">
          Close
        </CButton>
        <CButton color="primary" @click="addHenkatenData">Save changes</CButton>
      </CModalFooter>
    </CModal>

    <!-- edit modals -->
    <CModal scrollable backdrop="static" alignment="center" :visible="EditHenkatenModal"
      @close="EditHenkatenModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Edit henkaten</CModalTitle>
      </CModalHeader>
      <CModalBody>

        <div class="col" v-if="showScoreField">
          <label>Score</label>
          <select class="form-select" v-model="henkatenDetail.score">
            <option v-for="opt in scoreopts" :key="opt.score" :value="opt.score">
              {{ opt.label }}
            </option>
          </select>
          <button class="btn btn-info my-2 btn-sm text-white" @click="
            () => {
              updateScoreHenkanten()
            }
          ">
            Edit Score
          </button>
          <hr>
        </div>



        <CAccordion :active-item-key="1" always-open>
          <CAccordionItem :item-key="1">
            <CAccordionHeader> Henkaten input </CAccordionHeader>
            <CAccordionBody>
              <div>
                <div class="mb-2">
                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Start date</label>
                      <input type="text" class="form-control" disabled
                        :value="formatTheDate(henkatenDetail.henkaten_date)" />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Start date</label>
                      <input type="date" class="form-control" v-model="henkatenDetail.henkaten_date" />
                      <small v-if="henkatenDetail.henkaten_date" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan tanggal</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Henkaten location</label>
                  <input type="text" class="form-control" v-model="henkatenDetail.henkaten_location" />
                </div>
                <div class="mb-2">
                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Line</label>
                      <input type="text" disabled class="form-control"
                        :value="getLineName(henkatenDetail.henkaten_line_id)" />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Line</label>
                      <VueMultiselect v-model="selectedLineID" :options="lineData"
                        :custom-label="customLineFilterOptions">
                      </VueMultiselect>
                      <small v-if="henkatenDetail.henkaten_line_id" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan line</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <div class="row">
                    <div class="col">
                      <label class="mb-1">PIC</label>
                      <input type="text" disabled class="form-control"
                        :value="getPicName(henkatenDetail.henkaten_pic)" />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit PIC</label>
                      <treeselect v-if="getUsersTree" class="w-100" v-model="henkatenDetail.henkaten_pic"
                        :options="getUsersTree" />
                      <!-- <VueMultiselect v-model="selectedPIC" :options="picData" :custom-label="customPicOptions">
                      </VueMultiselect> -->
                      <small v-if="henkatenDetail.henkaten_pic" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan PIC</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Perubahan</label>
                  <textarea type="text" class="form-control" v-model="henkatenDetail.henkaten_desc">
              </textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Tujuan</label>
                  <textarea type="text" class="form-control" v-model="henkatenDetail.henkaten_purpose">
              </textarea>
                </div>
                <span style="font-weight: bold" class="mb-2">Follow (2 weeks) item</span>
                <div class="mb-2">
                  <label class="mb-1">Safety</label>
                  <input type="text" class="form-control" v-model="henkatenDetail.henkaten_flw_safety" />
                </div>
                <div>
                  <label class="mb-1">Quality</label>
                  <input type="text" class="form-control" v-model="henkatenDetail.henkaten_flw_quality" />
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
                      <input type="text" class="form-control" disabled :value="formatTheDate(henkatenDetail.findings[0].finding_date)
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Tanggal temuan</label>
                      <input type="date" class="form-control" v-model="henkatenDetail.findings[0].finding_date" />
                      <small v-if="henkatenDetail.findings[0].finding_date" class="text-success">*Abaikan jika
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
                      <label class="mb-1">Line</label>
                      <input type="text" disabled class="form-control"
                        :value="getLineName(henkatenDetail.findings[0].line_id)" />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Line</label>
                      <VueMultiselect v-model="selectedFindingLineID" :options="lineData"
                        :custom-label="customLineFilterOptions">
                      </VueMultiselect>
                      <small v-if="henkatenDetail.findings[0].line_id" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan line</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Pos</label>
                  <input type="text" class="form-control" v-model="henkatenDetail.findings[0].finding_location" />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Finding description</label>
                  <textarea cols="30" rows="5" class="form-control"
                    v-model="henkatenDetail.findings[0].finding_desc"></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Countermeasure description</label>
                  <textarea cols="30" rows="5" class="form-control"
                    v-model="henkatenDetail.findings[0].cm_desc"></textarea>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Priority</label>
                  <select class="form-select" v-model="henkatenDetail.findings[0].cm_priority">
                    <option selected>Select priority</option>
                    <option value="P1">P1: Safety & Quality Issue</option>
                    <option value="P2">P2: Productivity Issue</option>
                    <option value="P3">P3: Cost Issue</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Faktor </label>
                  <select class="form-select" v-model="henkatenDetail.findings[0].factor_id">
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
                      <input type="text" disabled class="form-control" :value="getPicName(henkatenDetail.findings[0].cm_pic_id)
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit PIC</label>
                      <treeselect v-if="getUsersTree" class="w-100" v-model="henkatenDetail.findings[0].cm_pic_id"
                        :options="getUsersTree" />
                      <!-- <VueMultiselect v-model="selectedFindingPIC" :options="picData" :custom-label="customPicOptions">
                      </VueMultiselect> -->
                      <small v-if="henkatenDetail.findings[0].cm_pic_id" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan PIC</small>
                    </div>
                  </div>
                </div>

                <div class="mb-2">
                  <div class="row">
                    <div class="col">
                      <label class="mb-1">Countermeasure Start Plan Date </label>
                      <input type="text" class="form-control" disabled :value="formatTheDate(
                        henkatenDetail.findings[0].cm_str_plan_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure Start Plan Date </label>
                      <input type="date" class="form-control" v-model="henkatenDetail.findings[0].cm_str_plan_date" />
                      <small v-if="henkatenDetail.findings[0].cm_str_plan_date" class="text-success">*Abaikan jika
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
                        henkatenDetail.findings[0].cm_end_plan_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure End Plan Date</label>
                      <input type="date" class="form-control" v-model="henkatenDetail.findings[0].cm_end_plan_date" />
                      <small v-if="henkatenDetail.findings[0].cm_end_plan_date" class="text-success">*Abaikan jika
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
                        henkatenDetail.findings[0].cm_str_act_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure Start actual date</label>
                      <input type="date" class="form-control" v-model="henkatenDetail.findings[0].cm_str_act_date" />
                      <small v-if="henkatenDetail.findings[0].cm_str_act_date" class="text-success">*Abaikan jika
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
                        henkatenDetail.findings[0].cm_end_act_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure End actual date</label>
                      <input type="date" class="form-control" v-model="henkatenDetail.findings[0].cm_end_act_date" />
                      <small v-if="henkatenDetail.findings[0].cm_end_act_date" class="text-success">*Abaikan jika
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
                        henkatenDetail.findings[0].cm_training_date,
                      )
                        " />
                    </div>
                    <div class="col">
                      <label class="mb-1">Edit Countermeasure Training date</label>
                      <input type="date" class="form-control" v-model="henkatenDetail.findings[0].cm_training_date" />
                      <small v-if="henkatenDetail.findings[0].cm_training_date" class="text-success">*Abaikan jika
                        tidak
                        ingin
                        diubah</small>
                      <small v-else class="text-danger">*Silahkan masukan tanggal</small>
                    </div>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="mb-1">Countermeasure Judge</label>
                  <select class="form-select" v-model="henkatenDetail.findings[0].cm_judg">
                    <option selected>Select judgement</option>
                    <option value="true">Sudah</option>
                    <option value="false">Belum</option>
                  </select>
                </div>

                <div class="mb-2">
                  <label class="mb-1">Countermeasure Sign LH Red</label>
                  <input type="file" class="form-control" disabled />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Countermeasure Sign LH White</label>
                  <input type="file" class="form-control" disabled />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Countermeasure Sign SH</label>
                  <input type="file" class="form-control" disabled />
                </div>
                <div class="mb-2">
                  <label class="mb-1">Countermeasure Comments</label>
                  <input type="text" class="form-control" v-model="henkatenDetail.findings[0].cm_comments" />
                </div>
                <div class="card card-body mb-2">
                  <label class="mb-1">Finding image</label> <br>
                  <img v-if="henkatenDetail.findings[0].finding_img" :src="henkatenDetail.findings[0].finding_img"
                    alt="image" class="img-fluid rounded mb-2" width="100" style="cursor: pointer"
                    @click="showFindingImg(henkatenDetail.findings[0].finding_img)" />
                  <input ref="henkaten-finding-image" type="file" class="form-control" />
                  <button class="btn btn-info my-2 text-white" :disabled="isUploadLoading" @click="
                    uploadFindingImage('henkaten-finding-image', henkatenDetail.findings[0].finding_img)
                    ">
                    {{ isUploadLoading ? 'Updating' : 'Update image' }}
                  </button>
                  <div v-if="selectedFindingImage">
                    <img :src="selectedFindingImage" width="300" alt="" />
                  </div>
                </div>

                <!-- IMG FOR CM -->
                <div class="card card-body mb-2">
                  <CInputGroup class="mb-2">
                    <CInputGroupText>C/M Image</CInputGroupText>
                    <CFormInput @change="onChangeCmImage($event)" ref="cm_image" aria-label="Input your kaizen file"
                      type="file" />
                    <CInputGroupText class="p-0">
                      <button class="btn btn-sm btn-success" @click="uploadCmImage()" :disabled="isLoading">Upload
                        Image</button>
                    </CInputGroupText>
                  </CInputGroup>
                  <div>
                    <label> CM Image</label>
                    <br>
                    <img v-if="henkatenDetail.findings[0].cm_image" :src="henkatenDetail.findings[0].cm_image"
                      alt="image" class="img-fluid rounded mb-2" width="100" style="cursor: pointer"
                      @click="showFindingImg(henkatenDetail.findings[0].cm_image)" />
                    <label class="text-secondary" v-else>Tidak ada cm image</label>
                  </div>
                </div>

                <div class="card card-body">
                  <label>Apakah ada Improvement?</label>
                  <CFormSwitch v-model="henkatenDetail.findings[0].is_need_improvement" />
                  <div v-if="henkatenDetail.findings[0].is_need_improvement" class="row">
                    <div class="col-12 col-md-12">
                      <CInputGroup class="mb-3">
                        <CInputGroupText>Kaizen File</CInputGroupText>
                        <CFormInput @change="onChangeKaizenFile($event)" ref="kaizen_file"
                          aria-label="Input your kaizen file" type="file" />
                        <CInputGroupText class="p-0">
                          <button class="btn btn-sm btn-success" @click="uploadKaizen()" :disabled="isLoading">Upload
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
        <CButton color="secondary" @click="() => {
          EditHenkatenModal = false
          selectedHenkatenID = null
        }
        ">
          Close
        </CButton>
        <CButton color="primary" @click="updateHenkatenData">Update data</CButton>
      </CModalFooter>
    </CModal>

    <!-- finding image modal -->
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
// import moment from 'moment'
import { mapGetters } from 'vuex'
import { GET_USERS } from '@/store/modules/user.module'
import { GET_HENKATEN } from '@/store/modules/henkaten.module'
import { GET_LINES } from '@/store/modules/line.module'
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'
import ApiService from '@/store/api.service'
import Loading from 'vue-loading-overlay'
import Pagination from '@/components/Pagination.vue'
import { toast } from 'vue3-toastify'
import SCORE_MOCK from '@/mocks/score.mock'
import Treeselect from '@cholakovdev/vue3-treeselect'
import '@cholakovdev/vue3-treeselect/dist/vue3-treeselect.css'


export default {
  name: 'Henkaten',
  data() {
    return {
      showScoreField: false,
      json_fields: {
        id: 'henkaten_id',
        Date: 'henkaten_date',
        Line: 'line_nm',
        Location: 'henkaten_location',
        'Henkaten Point': 'henkaten_desc',
        Tujuan: 'henkaten_purpose',
        'Safety Point': 'henkaten_flw_safety',
        'Quality Point': 'henkaten_flw_quality',
        Countermeasure: 'cm_desc',
        'Plan Date': 'cm_str_plan_date',
        'Actual Date': 'cm_str_act_date',
        PIC: 'henkaten_pic_nm',
        Status: 'cm_status'
      },
      json_data: null,
      isLoading: false,
      isUploadLoading: false,
      currentPage: 1,
      currentPageLimit: 5,
      selectedMonth: null,
      addHenkatenModal: false,
      EditHenkatenModal: false,
      findingImageModal: false,
      selectedLineID: null,
      selectedFindingLineID: null,
      picData: [],
      lineData: [],
      factors: [],
      categories: [],
      selectedPIC: null,
      selectedFindingPIC: null,
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedFilterLineID: '-1',
      henkatenDetail: null,
      selectedHenkatenID: null,
      henkatenData: {
        henkaten_date: null,
        henkaten_location: null,
        henkaten_pic: null,
        henkaten_desc: null,
        henkaten_purpose: null,
        henkaten_flw_safety: null,
        henkaten_flw_quality: null,
        henkaten_line_id: null,
      },
      // findings data
      findingsData: {
        line_id: null,
        finding_date: null,
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
      selectedFindingImage: null,
      selectedFindingImageToDisplay: null,
      selectedFindingImageToUpdate: null,
      scoreopts: SCORE_MOCK,

      kaizenFile: null,
      isKaizenModal: false,
      cmImage: null

    }
  },
  computed: {
    ...mapGetters(['getUsersOpts', 'getHenkatens', 'getLinesOpts', 'getUsersTree']),
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
        formData.append('finding_id', this.henkatenDetail.findings[0].finding_id)
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
        this.getHenkaten()
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
        formData.append('finding_id', this.henkatenDetail.findings[0].finding_id)
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
    onPageChange(page) {
      if (page == -1) {
        this.currentPage = this.currentPage - 1
        this.getHenkaten()
      } else {
        this.currentPage = this.currentPage + 1
        this.getHenkaten()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getHenkaten()
    },
    formatTheDate(val) {
      if (val) {
        const year = val.split('T')[0].split('-')[0]
        const month = val.split('T')[0].split('-')[1]
        const day = val.split('T')[0].split('-')[2]

        return `${year}-${month}-${day}`
      }
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
    addHenkatenData() {
      this.henkatenData.henkaten_line_id = this.selectedLineID?.line_id
      // this.henkatenData.henkaten_pic = this.selectedPIC?.pic_id

      this.findingsData.cm_result_factor_id = this.findingsData?.factor_id
      this.findingsData.finding_date = this.henkatenData.henkaten_date
      this.findingsData.finding_location = this.henkatenData.henkaten_location
      this.findingsData.finding_desc = this.henkatenData.henkaten_desc
      this.findingsData.line_id = this.selectedLineID?.line_id
      // this.findingsData.cm_pic_id = this.selectedPIC?.pic_id

      if (!this.findingsData.finding_img || !this.findingsData.line_id || !this.findingsData.cm_pic_id || !this.findingsData.finding_location || !this.findingsData.finding_desc || !this.findingsData.finding_location || !this.findingsData.cm_desc || !this.findingsData.cm_priority || !this.findingsData.factor_id || !this.findingsData.cm_str_plan_date || !this.findingsData.cm_end_plan_date) {
        toast.error('Harap isi semua field di finding', {
          autoClose: 1000
        })
      } else {
        let data = {
          ...this.henkatenData,
          findings: this.findingsData,
        }
        this.addHenkaten(data)
      }
    },
    updateHenkatenData() {
      const updateData = {
        henkaten_date: this.formatTheDate(this.henkatenDetail.henkaten_date),
        henkaten_location: this.henkatenDetail.henkaten_location,
        henkaten_pic: this.henkatenDetail.henkaten_pic,
        henkaten_desc: this.henkatenDetail.henkaten_desc,
        henkaten_purpose: this.henkatenDetail.henkaten_purpose,
        henkaten_flw_safety: this.henkatenDetail.henkaten_flw_safety,
        henkaten_flw_quality: this.henkatenDetail.henkaten_flw_quality,
        henkaten_line_id: this.selectedLineID
          ? this.selectedLineID.line_id
          : this.henkatenDetail.henkaten_line_id,
        findings: {
          line_id: this.selectedFindingLineID
            ? this.selectedFindingLineID.line_id
            : this.henkatenDetail.findings[0].line_id,
          finding_date: this.formatTheDate(
            this.henkatenDetail.findings[0].finding_date,
          ),
          finding_location: this.henkatenDetail.findings[0].finding_location,
          finding_desc: this.henkatenDetail.findings[0].finding_desc,
          cm_desc: this.henkatenDetail.findings[0].cm_desc,
          cm_priority: this.henkatenDetail.findings[0].cm_priority,
          category_id: null,
          factor_id: this.henkatenDetail.findings[0].factor_id,
          cm_pic_id: this.henkatenDetail.findings[0].cm_pic_id,
          cm_str_plan_date: this.formatTheDate(
            this.henkatenDetail.findings[0].cm_str_plan_date,
          ),
          cm_end_plan_date: this.formatTheDate(
            this.henkatenDetail.findings[0].cm_end_plan_date,
          ),
          cm_result_factor_id: this.henkatenDetail.findings[0].factor_id,
          cm_str_act_date: this.henkatenDetail.findings[0].cm_str_act_date
            ? this.formatTheDate(
              this.henkatenDetail.findings[0].cm_str_act_date,
            )
            : null,
          cm_end_act_date: this.henkatenDetail.findings[0].cm_end_act_date
            ? this.formatTheDate(
              this.henkatenDetail.findings[0].cm_end_act_date,
            )
            : null,
          cm_training_date: this.henkatenDetail.findings[0].cm_training_date
            ? this.formatTheDate(
              this.henkatenDetail.findings[0].cm_training_date,
            )
            : null,
          cm_judg: this.henkatenDetail.findings[0].cm_judg,
          cm_sign_lh_red: null,
          cm_sign_lh_white: null,
          cm_sign_sh: null,
          cm_comments: this.henkatenDetail.findings[0].cm_comments,
          finding_img: this.selectedFindingImageToUpdate,
        },
      }

      this.updateHenkaten(updateData)
    },
    async updateScoreHenkanten() {
      try {
        const HenkantenId = this.selectedHenkatenID
        const data = { score: this.henkatenDetail.score, }
        ApiService.setHeader()
        ApiService.put(
          `operational/henkaten/score/${HenkantenId}`,
          data,
        )
          .then(res => {
            if (res.data.message == 'Success to EDIT Score of Henkaten') {
              toast.success('Data added', {
                autoClose: 1000
              })
              this.getHenkaten()
              this.EditHenkatenModal = false
            } else {
              Swal.fire('Error', '', 'warning')
            }

          })
      } catch (error) {
        console.log(error);

      }
    },

    async getHenkaten() {
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
        this.$store.dispatch(GET_HENKATEN, objQuery).then((res) => {
          if (res) {
            this.isLoading = false
            //     Countermeasure: 'cm_desc',
            // 'Plan Date': 'cm_end_plan_date',
            // 'Actual Date': 'cm_str_act_date',
            // PIC: 'henkaten_pic_nm',
            // Status: 'cm_status'
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
    async addHenkaten(data) {
      try {
        ApiService.setHeader()
        ApiService.post(
          `operational/henkaten/add`,
          data,
        ).then(res => {
          if (res.data.message == 'Success to POST Henkaten') {
            toast.success('Data added', {
              autoClose: 1000
            })
            this.addHenkatenModal = false
            this.getHenkaten()
            this.henkatenDetail = null
            this.selectedHenkatenID = null
          } else {
            this.addHenkatenModal = false
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
    async updateHenkaten(data) {
      const henkatenID = this.selectedHenkatenID

      try {
        ApiService.setHeader()
        ApiService.put(
          `operational/henkaten/edit/${henkatenID}`,
          data,
        ).then(res => {
          if (res.data.message == 'Success to EDIT Henkaten') {
            toast.success('Data updated', {
              autoClose: 1000
            })
            this.EditHenkatenModal = false
            this.getHenkaten()
            this.selectedFindingImage = null
            this.selectedFindingImageToDisplay = null
            this.selectedFindingImageToUpdate = null
          } else {
            toast.error('Failed to edit data', {
              autoClose: 1000
            })
          }
        })
      } catch (error) {
        console.log(error)
        Swal.fire('Failed to update henkaten data', '', 'error')
        this.EditHenkatenModal = false
      }
    },
    async deleteHenkaten(henkatenID) {
      Swal.fire({
        title: 'Are you sure to delete this Henkaten?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          ApiService.setHeader()
          ApiService.delete(
            `operational/henkaten/delete/${henkatenID}`,
          ).then(res => {
            if (res.data.message == 'Success to DELETE Henkaten') {
              toast.success('Data deleted', {
                autoClose: 1000
              })
              this.getHenkaten()
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

    getDetailHenkaten(index) {
      const data = this.getHenkatens[index]
      this.selectedHenkatenID = this.getHenkatens[index].henkaten_id
      this.henkatenDetail = data
      this.EditHenkatenModal = true
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
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
        if (this.getLinesOpts) {
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

        this.mapUsersData()

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
    addFilter() {
      this.getHenkaten()
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
    await this.getCategories()
    await this.getFactors()
    await this.getHenkaten()
    await this.AccesibilityScore()
  },
  updated() {
    this.mapLinesData()
    this.mapUsersData()
  },
  components: { VueMultiselect, Loading, Pagination, Treeselect },
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
