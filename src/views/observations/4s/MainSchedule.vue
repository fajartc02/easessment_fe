<template>
  <div>
    <div class="card mb-5">
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
            <select class="form-select" v-model="selectedZoneID" @change="addFilter()">
              <option v-for="zone in getZoneOpts" :key="zone.id" :value="zone.id">
                {{ zone.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <label>Kanban</label>
            <select class="form-select" v-model="selectedKanbanID" @change="addFilter()">
              <option v-for="kanban in getKanbansOpts" :key="kanban.id" :value="kanban.id">
                {{ kanban.text }}
              </option>
            </select>
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
                <div class="bullet" style="width: 20px; height: 20px"></div>
                <span class="mx-2">Planning</span>
              </div>
              <div class="d-flex align-items-center">
                <div class="bullet-filled" style="width: 20px; height: 20px"></div>
                <span class="mx-2">Sudah Cleaning</span>
              </div>
              <div class="d-flex align-items-center">
                <div class="bullet-cancel d-flex justify-content-center align-items-center"
                  style="width: 20px; height: 20px">
                  <CIcon icon="cil-x" class="text-danger" size="sm" />
                </div>
                <span class="mx-2">Sudah Cleaning, ada temuan abnormally</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="card-body p-0 overflow-x-auto" style="width: 100%; height: 500px">
        <div class="vl-parent p-0" style="width: 100%; height: 100%">
          <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="false" :on-cancel="onCancel" />
        </div>
      </div>


      <div class="card-body p-0 overflow-x-auto">
        <div class="tableFixHead">
          <table class="table table-hover" style="width: 100%" v-for="mainSchedule in newSubScheduleData"
            :key="mainSchedule.id">
            <thead>
              <tr>
                <th colspan="40" class="text-center">
                  4S Schedule Activities ({{ mainSchedule[0].line_nm }} - {{ mainSchedule[0].group_nm }})
                </th>
              </tr>
              <tr>
                <th id="fixCol-1" rowspan="2">No</th>
                <th id="fixCol-2" rowspan="2">Zona</th>
                <th id="fixCol-3" rowspan="2">No Kanban</th>
                <th id="fixCol-4" rowspan="2">Area</th>
                <th rowspan="2">Time</th>
                <th rowspan="2">PIC</th>
                <th rowspan="2">Freq</th>
                <th :colspan="getDateThisMonth" class="text-center">{{ getMonthStr }}</th>
              </tr>
              <tr>
                <td v-for="n in getDateThisMonth" :key="n">{{ n }}</td>
              </tr>
            </thead>
            <tbody>
              <template v-if="!isLoading">
                <tr v-for="(data, scheduleIndex) in mainSchedule" :key="scheduleIndex">
                  <td id="fixCol-1">{{ scheduleIndex + 1 }}</td>
                  <td id="fixCol-2" style="min-width: 100px">
                    {{ data.zone_nm }}</td>
                  <td id="fixCol-3" style="min-width: 120px">{{ data.kanban_no }}</td>
                  <td id="fixCol-4" style="min-width: 200px">{{ data.area_nm }}</td>
                  <td style="min-width: 50px">{{ data.standart_time }}</td>
                  <td style="min-width: 100px">
                    <div style="cursor: pointer;" v-if="data.pic_nm"
                      @click="openEditModal(data.sub_schedule_id, data.pic_id, data.pic_nm)">
                      <p class="cursor-pointer"> {{ data.pic_nm }}</p>
                    </div>
                    <div v-else>
                      <button class="btn btn-info btn-sm mx-2 text-white"
                        @click="openEditModal(data.sub_schedule_id, null, null)">
                        Add
                      </button>
                    </div>
                  </td>
                  <td> {{ data.freq_nm }}</td>

                  <td v-for="(children, childrenIndex) in data?.children" :key="childrenIndex" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
                    }`">

                    <CDropdown variant="btn-group" v-if="!children.is_holiday && children.status == 'PLANNING'">
                      <CButton color="secondary" class="text-secondary bg-white"
                        @click="addScheduleCheck(data.main_schedule_id, data.sub_schedule_id)">
                        <div class="bullet"></div>
                      </CButton>
                      <CDropdownToggle color="secondary" class="text-white" split> item </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem @click="openChangeDateModal(children.date, data.sub_schedule_id)">Change date
                        </CDropdownItem>
                        <CDropdownItem @click="deleteScheduleCheck(data.sub_schedule_id)">Delete</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>

                    <CDropdown variant="btn-group" v-if="!children.is_holiday && children.status == 'ACTUAL'">
                      <CButton color="secondary" class="text-secondary bg-white"
                        @click="addScheduleCheck(data.main_schedule_id, data.sub_schedule_id)">
                        <div class="bullet-filled"></div>
                      </CButton>
                      <CDropdownToggle color="secondary" class="text-white" split> item </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem @click="openChangeDateModal(children.date, data.sub_schedule_id)">Change date
                        </CDropdownItem>
                        <CDropdownItem @click="deleteScheduleCheck(data.sub_schedule_id)">Delete</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>

                    <CDropdown variant="btn-group" v-if="!children.is_holiday && children.status == 'PROBLEM'">
                      <CButton color="secondary" class="text-secondary bg-white p-0 px-2"
                        @click="addScheduleCheck(data.main_schedule_id, data.sub_schedule_id)">
                        <div class="bullet-cancel d-flex justify-content-center align-items-center"
                          style="width: 20px; height: 20px">
                          <CIcon icon="cil-x" class="text-danger text-bold" size="sm" />
                        </div>
                      </CButton>
                      <CDropdownToggle color="secondary" class="text-white" split> item </CDropdownToggle>
                      <CDropdownMenu>
                        <CDropdownItem @click="openChangeDateModal(children.date, data.sub_schedule_id)">Change date
                        </CDropdownItem>
                        <CDropdownItem @click="deleteScheduleCheck(data.sub_schedule_id)">Delete</CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </td>
                </tr>
              </template>


              <!-- Sign TL 1 -->
              <tr v-if="newSubScheduleData && !isLoading">
                <td colspan="7" class="text-center">Sign TL 1 </td>
                <td v-for="children in mainSchedule[0].children" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
                  }`">
                  <button @click="
                    openSignModal(children.tl1_sign_checker_id, 'sign_tl_1')
                    " v-if="!children.is_holiday && !children.sign_tl_1"
                    class="check-wrapper-null d-flex align-items-center justify-content-center">
                    <CIcon icon="cil-x" class="text-danger" size="sm" />
                  </button>
                  <button @click="
                    openSignModal(children.tl1_sign_checker_id, 'sign_tl_1')
                    " v-else-if="!children.is_holiday && children.sign_tl_1"
                    class="check-wrapper d-flex align-items-center justify-content-center">
                    <CIcon icon="cil-check" class="text-black" size="sm" />
                  </button>
                </td>
              </tr>
              <!-- SIGN TL 2 -->
              <tr v-if="newSubScheduleData && !isLoading">
                <td colspan="7" class="text-center">Sign TL 2</td>
                <td v-for="children in mainSchedule[0].children" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
                  }`">
                  <button @click="
                    openSignModal(children.tl2_sign_checker_id, 'sign_tl_2')
                    " v-if="!children.is_holiday && !children.sign_tl_2"
                    class="check-wrapper-null d-flex align-items-center justify-content-center">
                    <CIcon icon="cil-x" class="text-danger" size="sm" />
                  </button>
                  <button @click="
                    openSignModal(children.tl2_sign_checker_id, 'sign_tl_2')
                    " v-else-if="!children.is_holiday && children.sign_tl_2"
                    class="check-wrapper d-flex align-items-center justify-content-center">
                    <CIcon icon="cil-check" class="text-black" size="md" />
                  </button>
                </td>
              </tr>
              <!-- SIGN GL -->
              <tr v-if="signGLData && !isLoading">
                <td colspan="7" class="text-center">Sign GL</td>
                <td v-for="children in signGLData" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
                  }`" :colspan="children.col_span">
                  <button @click="
                    openSignModal(children.sign_checker_id, 'sign_gl')
                    " v-if="!children.is_holiday && !children.sign"
                    class="check-wrapper-null d-flex align-items-center justify-content-center">
                    <CIcon icon="cil-x" class="text-danger" size="md" />
                  </button>
                  <button @click="
                    openSignModal(children.sign_checker_id, 'sign_gl')
                    " v-else-if="!children.is_holiday && children.sign"
                    class="check-wrapper d-flex align-items-center justify-content-center">
                    <CIcon icon="cil-check" class="text-black" size="md" />
                  </button>
                </td>
              </tr>
              <!-- SIGN SH -->
              <tr v-if="signSHData && !isLoading">
                <td colspan="7" class="text-center">Sign SH</td>
                <td v-for="children in signSHData" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
                  }`" :colspan="children.col_span">
                  <button @click="
                    openSignModal(children.sign_checker_id, 'sign_sh')
                    " v-if="!children.is_holiday && !children.sign"
                    class="check-wrapper-null d-flex align-items-center justify-content-center">
                    <CIcon icon="cil-x" class="text-danger" size="md" />
                  </button>
                  <button @click="
                    openSignModal(children.sign_checker_id, 'sign_sh')
                    " v-else-if="!children.is_holiday && children.sign"
                    class="check-wrapper d-flex align-items-center justify-content-center">
                    <CIcon icon="cil-check" class="text-black" size="md" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


      <!-- <div class="card-body p-0 overflow-x-auto">
        <table class="table table-bordered" style="width: 100%" v-for="mainSchedule in subScheduleData"
          :key="mainSchedule.id">
          <thead>
            <tr>
              <th colspan="40" class="text-center">
                4S Schedule Activities {{ mainSchedule.group_nm }}
              </th>
            </tr>
            <tr>
              <th rowspan="2">No</th>
              <th rowspan="2">Zona</th>
              <th rowspan="2">No Kanban</th>
              <th rowspan="2">Area</th>
              <th rowspan="2">Time</th>
              <th rowspan="2">PIC</th>
              <th rowspan="2">Freq</th>
              <th :colspan="getDateThisMonth" class="text-center">{{ getMonthStr }}</th>
            </tr>
            <tr>
              <td v-for="n in getDateThisMonth" :key="n">{{ n }}</td>
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
            <tr v-else v-for="(data, scheduleIndex) in mainSchedule" :key="scheduleIndex">
              <td>{{ scheduleIndex + 1 }}</td>
              <td style="min-width: 100px" v-if="data.zone_id != subScheduleData[scheduleIndex - 1]?.zone_id"
                :rowspan="data.row_span_zone">
                {{ data.zone_nm }}</td>
              <td style="min-width: 120px">{{ data.kanban_no }}</td>
              <td style="min-width: 200px">{{ data.area_nm }}</td>
              <td style="min-width: 50px">{{ data.standart_time }}</td>
              <td style="min-width: 100px" :rowspan="data.row_span_pic">
                <div style="cursor: pointer;" v-if="data.pic_nm"
                  @click="openEditModal(data.sub_schedule_id, data.pic_id, data.pic_nm)">
                  <p class="cursor-pointer"> {{ data.pic_nm }}</p>
                </div>
                <div v-else>
                  <button class="btn btn-info btn-sm mx-2 text-white"
                    @click="openEditModal(data.sub_schedule_id, null, null)">
                    Add
                  </button>
                </div>
              </td>
              <td v-if="data.freq_id != subScheduleData[scheduleIndex - 1]?.freq_id" :rowspan="data.row_span_freq">
                {{ data.freq_nm }}</td>
              <td v-for="(children, childrenIndex) in data?.children" :key="childrenIndex" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`">

                <CDropdown variant="btn-group" v-if="!children.is_holiday && children.status == 'PLANNING'">
                  <CButton color="secondary" class="text-secondary bg-white"
                    @click="addScheduleCheck(data.main_schedule_id, data.sub_schedule_id)">
                    <div class="bullet"></div>
                  </CButton>
                  <CDropdownToggle color="secondary" class="text-white" split> item </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem @click="openChangeDateModal(children.date, data.sub_schedule_id)">Change date
                    </CDropdownItem>
                    <CDropdownItem @click="deleteScheduleCheck(data.sub_schedule_id)">Delete</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>

                <CDropdown variant="btn-group" v-if="!children.is_holiday && children.status == 'ACTUAL'">
                  <CButton color="secondary" class="text-secondary bg-white"
                    @click="addScheduleCheck(data.main_schedule_id, data.sub_schedule_id)">
                    <div class="bullet-filled"></div>
                  </CButton>
                  <CDropdownToggle color="secondary" class="text-white" split> item </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem @click="openChangeDateModal(children.date, data.sub_schedule_id)">Change date
                    </CDropdownItem>
                    <CDropdownItem @click="deleteScheduleCheck(data.sub_schedule_id)">Delete</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>

                <CDropdown variant="btn-group" v-if="!children.is_holiday && children.status == 'PROBLEM'">
                  <CButton color="secondary" class="text-secondary bg-white p-0 px-2"
                    @click="addScheduleCheck(data.main_schedule_id, data.sub_schedule_id)">
                    <div class="bullet-cancel d-flex justify-content-center align-items-center"
                      style="width: 20px; height: 20px">
                      <CIcon icon="cil-x" class="text-danger text-bold" size="sm" />
                    </div>
                  </CButton>
                  <CDropdownToggle color="secondary" class="text-white" split> item </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem href="#">Change date</CDropdownItem>
                    <CDropdownItem href="#">Delete</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>

              </td>
            </tr>

            <tr v-if="subScheduleData && !isLoading">
              <td colspan="7" class="text-center">Sign TL 1</td>
              <td v-for="children in subScheduleData[0]?.children" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`">
                <button @click="
              openSignModal(children.tl1_sign_checker_id, 'sign_tl_1')
              " v-if="!children.is_holiday && !children.sign_tl_1"
                  class="check-wrapper-null d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-x" class="text-danger" size="sm" />
                </button>
                <button @click="
              openSignModal(children.tl1_sign_checker_id, 'sign_tl_1')
              " v-else-if="!children.is_holiday && children.sign_tl_1"
                  class="check-wrapper d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-check" class="text-black" size="sm" />
                </button>
              </td>
            </tr>
            <tr v-if="subScheduleData && !isLoading">
              <td colspan="7" class="text-center">Sign TL 2</td>
              <td v-for="children in subScheduleData[0].children" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`">
                <button @click="
              openSignModal(children.tl2_sign_checker_id, 'sign_tl_2')
              " v-if="!children.is_holiday && !children.sign_tl_2"
                  class="check-wrapper-null d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-x" class="text-danger" size="sm" />
                </button>
                <button @click="
              openSignModal(children.tl2_sign_checker_id, 'sign_tl_2')
              " v-else-if="!children.is_holiday && children.sign_tl_2"
                  class="check-wrapper d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-check" class="text-black" size="md" />
                </button>
              </td>
            </tr>
            <tr v-if="signGLData && !isLoading">
              <td colspan="7" class="text-center">Sign GL</td>
              <td v-for="children in signGLData" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`" :colspan="children.col_span">
                <button @click="
              openSignModal(children.sign_checker_id, 'sign_gl')
              " v-if="!children.is_holiday && !children.sign"
                  class="check-wrapper-null d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-x" class="text-danger" size="md" />
                </button>
                <button @click="
              openSignModal(children.sign_checker_id, 'sign_gl')
              " v-else-if="!children.is_holiday && children.sign"
                  class="check-wrapper d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-check" class="text-black" size="md" />
                </button>
              </td>
            </tr>
            <tr v-if="signSHData && !isLoading">
              <td colspan="7" class="text-center">Sign SH</td>
              <td v-for="children in signSHData" :key="children" :style="`${children.is_holiday ? 'background-color: #f9fafb' : ''
              }`" :colspan="children.col_span">
                <button @click="
              openSignModal(children.sign_checker_id, 'sign_sh')
              " v-if="!children.is_holiday && !children.sign"
                  class="check-wrapper-null d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-x" class="text-danger" size="md" />
                </button>
                <button @click="
              openSignModal(children.sign_checker_id, 'sign_sh')
              " v-else-if="!children.is_holiday && children.sign"
                  class="check-wrapper d-flex align-items-center justify-content-center">
                  <CIcon icon="cil-check" class="text-black" size="md" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->



    </div>

    <!-- add sign modal -->
    <CModal backdrop="static" alignment="center" :visible="addSignModal" @close="addSignModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Add sign </CModalTitle>
      </CModalHeader>
      <CModalBody>

        <input type="image" v-if="selectedSign" :src="selectedSign" style="width: 100%; height: 100%" />

        <div style="height: 150px" v-if="selectedSignType == 'sign_tl_1'">
          <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="sign_tl_1" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('sign_tl_1')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save TL 1' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature('sign_tl_1')">
              Clear
            </button>
          </div>
        </div>

        <div style="height: 150px" v-else-if="selectedSignType == 'sign_tl_2'">
          <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="sign_tl_2" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('sign_tl_2')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save TL 2' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature('sign_tl_2')">
              Clear
            </button>
          </div>
        </div>

        <div style="height: 150px" v-else-if="selectedSignType == 'sign_gl'">
          <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="sign_gl" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('sign_gl')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save Sign GL' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature('sign_gl')">
              Clear
            </button>
          </div>
        </div>

        <div style="height: 150px" v-else-if="selectedSignType == 'sign_sh'">
          <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
            <vueSignature ref="sign_sh" :sigOption="option" :w="'100%'" :h="'100px'">
            </vueSignature>
            <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
              @click="saveSignature('sign_sh')">
              {{ isUploadSignLoading ? 'Saving..' : 'Save Sign SH' }}
            </button>
            <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature('sign_sh')">
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
        <CModalTitle>Add PIC </CModalTitle>
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
          {{ isAddPICLoading ? 'Saving..' : 'Save' }}
        </CButton>
      </CModalFooter>
    </CModal>

    <!-- change date modal -->
    <CModal backdrop="static" alignment="center" :visible="changeDateModal" @close="changeDateModal = false" size="lg">
      <CModalHeader>
        <CModalTitle>Change Date </CModalTitle>
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
          {{ isChangeDateLoading ? 'Saving..' : 'Save' }}
        </CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import moment from 'moment'
import Loading from 'vue-loading-overlay'
import {
  GET_SCHEDULES,
  GET_SUB_SCHEDULES,
} from '@/store/modules/schedule4s.module'
import { GET_GROUP } from '@/store/modules/group.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_ZONES } from '@/store/modules/zones.module'
import { GET_KANBANS } from '@/store/modules/kanban.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_USERS } from '@/store/modules/user.module'

import { mapGetters } from 'vuex'
import vueSignature from 'vue-signature'
import ApiService from '@/store/api.service'
import VueMultiselect from 'vue-multiselect'
import Swal from 'sweetalert2'


export default {
  name: 'Main Schedule',
  components: { Loading, vueSignature, VueMultiselect },
  data() {
    return {
      totalDate: 31,
      isLoading: true,
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
      changeDateModal: false,
      selectedSubScheduleID: null,
      picData: [],
      selectedPIC: null,
      selectedPICName: null,
      updateDate: null,
      selectedBeforeDate: null,
      newSubScheduleData: [],
      mainSubScheduleID: []
    }
  },
  updated() {
    console.log(this.newSubScheduleData)
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getGroups',
      'getZoneOpts',
      'getKanbansOpts',
      'getFreqsOpts',
      'getUsersOpts',
    ]),
    getDateThisMonth() {
      const year = this.selectedMonth.split('-')[0]
      const month = +this.selectedMonth.split('-')[1] + 1
      return new Date(year, month + 1, 0).getDate();
    },
    getMonthStr() {
      const monthStr = ['January', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
      return monthStr[+this.selectedMonth.split('-')[1] - 1]
    }
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
  },
  methods: {
    addScheduleCheck(mainScheduleID, subScheduleID) {
      this.$router.push(`/4s/schedule-check/${mainScheduleID}/${subScheduleID}`)
    },
    async getSchedules() {
      this.newSubScheduleData = []
      this.subScheduleData = []
      this.isLoading = true
      let objQuery = {
        month_year_num: this.selectedMonth,
        line_id: this.selectedLineID,
      }
      await this.$store.dispatch(GET_SCHEDULES, objQuery).then((res) => {
        if (res) {
          const data = res.list
          this.mainScheduleData = data
          data.map((item) => {
            this.mainSubScheduleID.push(item.main_schedule_id)
            this.getSubSchedules(item.main_schedule_id)
          })
        }
      })
    },
    async getSubSchedules(mainScheduleID) {
      this.newSubScheduleData = []
      this.subScheduleData = []
      this.isLoading = true
      let objQuery = {
        main_schedule_id: mainScheduleID,
        line_id: this.selectedLineID,
        kanban_id: this.selectedKanbanID,
        zone_id: this.selectedZoneID,
        freq_id: this.selectedFreqID,
        month_year_num: this.selectedMonth,
      }
      await this.$store.dispatch(GET_SUB_SCHEDULES, objQuery).then((res) => {
        if (res) {
          this.subScheduleData.push(res.schedule)
          this.newSubScheduleData.push(res.schedule)
          this.signGLData = res.sign_checker_gl
          this.signSHData = res.sign_checker_sh
          this.isLoading = false
        }
      })
    },

    async addPIC() {
      this.isAddPICLoading = true
      ApiService.setHeader()
      const data = {
        pic_id: this.selectedPIC.pic_id
      };

      const add = await ApiService.put(
        `/operational/4s/sub-schedule/edit/${this.selectedSubScheduleID}`,
        data,
      )
      if (add.data.message == 'Success to edit 4s schedule plan') {
        this.isAddPICLoading = false
        this.editDataModal = false
        await this.getSchedules()
      }
    },

    openChangeDateModal(beforeDate, subScheduleID) {
      this.changeDateModal = true
      this.selectedBeforeDate = beforeDate
      this.selectedSubScheduleID = subScheduleID
    },

    async changeDate() {
      this.isChangeDateLoading = true
      ApiService.setHeader()
      const data = {
        plan_date: this.updateDate,
        before_plan_date: this.selectedBeforeDate
      };

      const change = await ApiService.put(
        `/operational/4s/sub-schedule/edit/${this.selectedSubScheduleID}`,
        data,
      )
      if (change.data.message == 'Success to edit 4s schedule plan') {
        this.isChangeDateLoading = false
        this.changeDateModal = false
        await this.getSchedules()
      }

    },

    async deleteScheduleCheck(subScheduleID) {
      Swal.fire({
        title: 'Are you sure to delete this item?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          ApiService.setHeader()
          const deleteData = ApiService.delete(`operational/4s/sub-schedule/delete/${subScheduleID}`)

          if (deleteData) {
            Swal.fire('Data deleted!', '', 'success')
            this.getSchedules()
          } else {
            Swal.fire('Error', '', 'warning')
          }
        } else if (result.isDenied) {
          Swal.fire('Canceled', '', 'info')
        }
      })

    },

    async addFilter() {
      await this.getSchedules()
    },
    resetFilter() {
      this.selectedLineID = "-1"
      this.selectedFreqID = "-1"
      this.selectedGroupID = "-1"
      this.selectedZoneID = "-1"
      this.selectedKanbanID = "-1"
      this.getSchedules()
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
    mapUsersData() {
      this.getUsersOpts?.map((item) => {
        this.picData.push({ pic_id: item.id, pic_name: item.text })
      })
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
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
        this.$store.dispatch(GET_ZONES)
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

    // sign methods
    openSignModal(signCheckerID, from) {
      this.selectedSignType = from
      this.addSignModal = true
      this.selectedSignCheckerID = signCheckerID
      this.getSignature()
    },
    async closeSignModal() {
      this.addSignModal = false
      this.selectedSignCheckerID = null
      this.selectedSignature = null
      this.selectedSignType = null
      this.selectedSign = null
      await this.getSchedules()
    },
    saveSignature(from) {
      var signFile

      switch (from) {
        case 'sign_tl_1':
          signFile = this.$refs[from].save()
          this.selectedSignature = signFile
          break
        default:
          break
      }
      switch (from) {
        case 'sign_tl_2':
          signFile = this.$refs[from].save()
          this.selectedSignature = signFile
          break
        default:
          break
      }
      switch (from) {
        case 'sign_gl':
          signFile = this.$refs[from].save()
          this.selectedSignature = signFile
          break
        default:
          break
      }
      switch (from) {
        case 'sign_sh':
          signFile = this.$refs[from].save()
          this.selectedSignature = signFile
          break
        default:
          break
      }

      this.uploadSignature()
    },
    clearSignature(from) {
      this.$refs[from].clear()
    },
    async uploadSignature() {
      this.isUploadSignLoading = true
      ApiService.setHeader()
      const upload = await ApiService.put(
        `/operational/4s/sub-schedule/sign/${this.selectedSignCheckerID}`,
        { sign: this.selectedSignature },
      )
      if (upload.data.message == 'success to sign 4s schedule') {
        this.isUploadSignLoading = false
        alert('Sign saved')
        this.closeSignModal()
      }
    },
    async getSignature() {
      this.isUploadSignLoading = true
      ApiService.setHeader()
      const getData = await ApiService.get(
        `/operational/4s/sub-schedule/sign/${this.selectedSignCheckerID}`
      )

      if (getData.data.message == 'Success to get 4s sign checker') {
        this.selectedSign = getData.data.data.sign
        this.isUploadSignLoading = false
      }
    },

    // edit data
    openEditModal(subScheduleID, picID, picName) {
      if (picName) {
        this.selectedPICName = picName
      }
      this.editDataModal = true
      this.selectedSubScheduleID = subScheduleID
      this.mapUsersData()
    },
  },

  async mounted() {
    this.newSubScheduleData = []
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    await this.getLines()
    await this.getGroup()
    await this.getZone()
    await this.getKanban()
    await this.getFreq()
    await this.getUsers()
    if (localStorage.getItem('line_id')) {
      this.selectedLineID = localStorage.getItem('line_id')
    }
    await this.getSchedules()
  },

}
</script>

<style scoped>
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
  top: 0px;
  left: 0px;
  z-index: 3;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 3;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 125px;
  z-index: 3;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 220px;
  z-index: 3;
  background-color: white;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
