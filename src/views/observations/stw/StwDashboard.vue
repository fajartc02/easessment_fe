<template>
  <CModal
    backdrop="static"
    alignment="center"
    :visible="addSignModal"
    @close="addSignModal = false"
    size="sm"
  >
    <CModalHeader>
      <CModalTitle>Add sign</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="d-flex justify-content-center" style="height: 150px">
        <div style="width: 100px; height: 100px; border: 1px solid #eaeaea">
          
          <vueSignature ref="sign" :sigOption="option" :w="'100%'" :h="'100px'">
          </vueSignature>
          <button
            class="btn btn-info btn-sm mx-3 my-3 text-white"
            @click="clearSignature()"
          >
            Clear
          </button>
        </div>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton
        color="success"
        class="text-white"
        :disabled="isUploadSignLoading"
        @click="saveSignature()"
      >
        {{ isUploadSignLoading ? 'Saving..' : 'Submit' }}
      </CButton>
      <CButton color="secondary" class="text-white" @click="closeSignModal()">
        Close
      </CButton>
    </CModalFooter>
  </CModal>
 <CModal
  backdrop="static"
  alignment="center"
  :visible="editSignModal"
  @close="editSignModal = false"
  size="sm"
>
  <CModalHeader>
    <CModalTitle>Edit sign</CModalTitle>
  </CModalHeader>
<CModalBody>
  <div class="d-flex justify-content-center">
    <table class="table table-borderless mb-10 text-center ">
      <thead>
        <tr>
          <th>Before</th>
          <th>After</th>
        </tr>
      </thead>
      <tbody>
        <tr class="gap-10">
          <!-- Signature Lama -->
          <td style="width: 120px; height: 120px; border: 1px dashed #ccc;">
            <div
              v-if="signForm.sign"
              style="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin: auto"
            >
              <img
                :src="signForm.sign"
                alt="Old Signature"
                style="max-width: 100%; max-height: 100%"
              />
            </div>
            <div v-else style="height: 100px; line-height: 100px;">No Sign</div>
          </td>

          <!-- Signature Baru -->
          <td style="width: 120px; height: 120px; border: 1px solid #eaeaea; position: relative;">
            <vueSignature ref="sign" :sigOption="option" :w="'100%'" :h="'100px'"></vueSignature>
            <button
              class="btn btn-info btn-sm text-white mt-1 justify-center"
              @click="clearSignature"
              style="position: absolute; bottom: -25px; left: 10"
            >
              Clear
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</CModalBody>

  <CModalFooter>
    <CButton
      color="success"
      class="text-white"
      :disabled="isUploadSignLoading"
      @click="updateSign"
    >
      {{ isUploadSignLoading ? 'Saving..' : 'Submit' }}
    </CButton>
    <CButton color="secondary" class="text-white" @click="closeSignModal">
      Close
    </CButton>
  </CModalFooter>
</CModal>

  <div>
    <div class="card mb-3">
      <!-- filter -->
      <div class="card-header">
        <div class="row align-items-end justify-content-between">
          <div class="col">
            <label>Select month</label>
            <input type="month" class="form-control" v-model="selectedMonth" />
          </div>
          <div class="col">
            <label>Line</label>
            <select class="form-select" v-model="selectedLine">
              <option
                v-for="(line, index) in getLinesOpts"
                :key="index"
                :value="line.id"
              >
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col">
            <CButton color="primary" @click="searchData">Search</CButton>
          </div>
        </div>
      </div>
      <!-- end filter -->

      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h6>Schedule Observation</h6>
        <div class="d-flex align-items-center">
          <div class="d-flex" style="margin-right: 20px">
            <div>
              Type 1 & 2:
              <CButton color="dark rounded-circle" variant="outline" disabled>
                <CIcon icon="cil-circlea" class="text-dark" size="sm" />
              </CButton>
            </div>
            <div class="mx-2">
              Type 3:
              <CButton color="dark" variant="outline" disabled>
                <CIcon icon="cil-circlea" class="text-dark" size="sm" />
              </CButton>
            </div>
            <div>
              Pengecekan 2 TL:
              <CButton
                color="dark"
                variant="outline"
                disabled
                style="
                  margin-left: 5px;
                  width: 35px;
                  height: 35px;
                  transform: rotate(45deg);
                "
              >
                <CIcon icon="cil-circlea" class="text-dark" size="sm" />
              </CButton>
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center">
            OnProgress:
            <CIcon icon="cil-circle" class="text-dark" size="sm" />
            Done:
            <CIcon icon="cil-check-circle" class="text-success" size="sm" />
            Delay:
            <CIcon icon="cil-circle" class="text-danger" size="sm" />
            Is Finding:
            <CIcon icon="cil-bell" class="text-warning" size="sm" />
            Revision:
            <h6 class="m-0 p-0 text-primary">R</h6>
          </div>
        </div>
      </div>

      <!-- white shift -->
      <div class="card">
        <div class="card-header">
          <h6>White Shift</h6>
        </div>
        <div class="card-body">
          <div class="tableFixHead">
            <table class="table table-bordered text-center table-stripped">
              <thead>
                <tr>
                  <th id="fixCol-head-1" rowspan="2">No</th>
                  <th id="fixCol-head-2" rowspan="2">Line</th>
                  <th id="fixCol-head-3" rowspan="2">Pos</th>
                  <th id="fixCol-head-4" rowspan="2">Observer</th>
                  <th id="fixCol-head-5" rowspan="2">Shift</th>
                  <th :colspan="containerDate.length">{{ yearMonth }}</th>
                </tr>
                <tr>
                  <th
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    {{ date.idx }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="40" class="p-0" style="height: 200px">
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
                  v-for="(observation, i) in observationSchedule"
                  :key="observation.pos_id"
                >
                  <td id="fixCol-1">{{ i + 1 }}</td>
                  <td id="fixCol-2">{{ observation.line_snm }}</td>
                  <td id="fixCol-3">{{ observation.pos_nm }}</td>
                  <td id="fixCol-4">
                    <template
                      v-for="observer in observation.checkers"
                      :key="observer"
                    >
                      <CBadge color="secondary">
                        {{ observer }}
                      </CBadge>
                      <br />
                    </template>
                  </td>
                  <td id="fixCol-5">{{ observation.group_nm }}</td>
                  <td
                    v-for="item in containerDate"
                    :key="item.idx"
                    style="min-width: 63px"
                  >
                    <template
                      v-for="child in observation.children"
                      :key="child.observation_id"
                    >
                      <template v-if="child.idxdate === String(item.idx)">
                        <TooltipStwSchedule
                          :child="child"
                          :customTooltipStyle="customTooltipStyle"
                          :observation="child"
                          :currentDate="currentDate"
                          @detail-schedule="detailSchedule"
                        />
                      </template>
                    </template>
                  </td>
                </tr>
                <tr v-if="observationSchedule?.length < 1 && !isLoading">
                  <td colspan="50">
                    <h3 class="my-2">Data kosong</h3>
                  </td>
                </tr>
                <tr
                  style="
                    position: sticky;
                    bottom: 120px;
                    z-index: 10;
                    background-color: white;
                  "
                >
                  <td colspan="5">
                    <h5>Sign TL</h5>
                  </td>
                  <td
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    <template
                      v-if="
                        observationSchedule.find((obserChild) =>
                          obserChild.children.find(
                            (childObser) => childObser.idxdate == date.idx,
                          ),
                        )
                      "
                    >
                      <!-- make condition for switch if sign in this date is available -->

                      <CButton
                        v-if="
                          !signObservationsTL_1.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'TL_1' &&
                              obserChild.group_nm == 'WHITE',
                          )
                        "
                        color="dark"
                        variant="outline"
                        size="sm"
                        @click="
                          () => {
                            showModalSignTL(
                              date.date,
                              'WHITE',
                              'TL_1',
                              date.idx,
                            )
                          }
                        "
                      >
                        <CIcon icon="cil-pencil" class="text-dark" size="sm" />
                      </CButton>
                      <img
                        v-else
                        :src="
                          signObservationsTL_1.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'TL_1' &&
                              obserChild.group_nm == 'WHITE',
                          )?.sign
                        "
                        width="50"
                        height="50"
                        alt="sign"
                        style="cursor: pointer"
  @click="
    () => {
      const signData = signObservationsTL_1.find(
        (obserChild) =>
          obserChild.date_idx == date.idx &&
          obserChild.role_sign_sys == 'TL_1' &&
          obserChild.group_nm == 'WHITE'
      )
      if (signData) {
        openEditSignModal(signData) // <-- Panggil fungsi edit modal
      }
    }
  "
                      />
                    </template>
                  </td>
                </tr>
                <!-- <tr
                  style="
                    position: sticky;
                    bottom: 80px;
                    z-index: 10;
                    background-color: white;
                  "
                >
                  <td colspan="5">
                    <h5>Sign TL 2</h5>
                  </td>
                  <td
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    <template
                      v-if="
                        observationSchedule.find((obserChild) =>
                          obserChild.children.find(
                            (childObser) => childObser.idxdate == date.idx,
                          ),
                        )
                      "
                    >
                      <CButton
                        v-if="
                          !signObservationsTL_2.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'TL_2' &&
                              obserChild.group_nm == 'WHITE',
                          )
                        "
                        color="dark"
                        variant="outline"
                        size="sm"
                        @click="
                          () => {
                            showModalSignTL(
                              date.date,
                              'WHITE',
                              'TL_2',
                              date.idx,
                            )
                          }
                        "
                      >
                        <CIcon icon="cil-pencil" class="text-dark" size="sm" />
                      </CButton>
                      <img
                        v-else
                        :src="
                          signObservationsTL_2.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'TL_2' &&
                              obserChild.group_nm == 'WHITE',
                          )?.sign
                        "
                        width="50"
                        height="50"
                        alt="sign"
                      />
                    </template>
                  </td>
                </tr> -->
                <tr
                  style="
                    position: sticky;
                    bottom: 30px;
                    z-index: 10;
                    background-color: white;
                  "
                >
                  <td colspan="5">
                    <h5>Sign GL</h5>
                  </td>
                  <td
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    <template
                      v-if="
                        observationSchedule.find((obserChild) =>
                          obserChild.children.find(
                            (childObser) => childObser.idxdate == date.idx,
                          ),
                        )
                      "
                    >
                      <!-- make condition for switch if sign in this date is available -->

                      <CButton
                        v-if="
                          !signObservationsGL.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'GL' &&
                              obserChild.group_nm == 'WHITE',
                          )
                        "
                        color="dark"
                        variant="outline"
                        size="sm"
                        @click="
                          () => {
                            showModalSignTL(date.date, 'WHITE', 'GL', date.idx)
                          }
                        "
                      >
                        <CIcon icon="cil-pencil" class="text-dark" size="sm" />
                      </CButton>
                      <img
                        v-else
                        :src="
                          signObservationsGL.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'GL' &&
                              obserChild.group_nm == 'WHITE',
                          )?.sign
                        "
                        width="50"
                        height="50"
                        alt="sign"
                        style="cursor: pointer"
  @click="
    () => {
      const signData = signObservationsGL.find(
        (obserChild) =>
          obserChild.date_idx == date.idx &&
          obserChild.role_sign_sys == 'GL' &&
          obserChild.group_nm == 'WHITE'
      )
      if (signData) {
        openEditSignModal(signData) // <-- Panggil fungsi edit modal
      }
    }
  "
                      />
                    </template>
                  </td>
                </tr>
                <tr
                  style="
                    position: sticky;
                    bottom: 0px;
                    z-index: 10;
                    background-color: white;
                  "
                >
                  <td colspan="5">
                    <h5>Sign SH</h5>
                  </td>
                  <td
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    <template
                      v-if="
                        observationSchedule.find((obserChild) =>
                          obserChild.children.find(
                            (childObser) => childObser.idxdate == date.idx,
                          ),
                        )
                      "
                    >
                      <!-- make condition for switch if sign in this date is available -->

                      <CButton
                        v-if="
                          !signObservationsSH.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'SH' &&
                              obserChild.group_nm == 'WHITE',
                          )
                        "
                        color="dark"
                        variant="outline"
                        size="sm"
                        @click="
                          () => {
                            showModalSignTL(date.date, 'WHITE', 'SH', date.idx)
                          }
                        "
                      >
                        <CIcon icon="cil-pencil" class="text-dark" size="sm" />
                      </CButton>
                      <img
                        v-else
                        :src="
                          signObservationsSH.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'SH' &&
                              obserChild.group_nm == 'WHITE',
                          )?.sign
                        "
                        width="50"
                        height="50"
                        alt="sign"
                        style="cursor: pointer"
                        @click="
                         
    () => {
      const signData = signObservationsSH.find(
        (obserChild) =>
          obserChild.date_idx == date.idx &&
          obserChild.role_sign_sys == 'SH' &&
          obserChild.group_nm == 'WHITE'
      )
      if (signData) {
        openEditSignModal(signData) // <-- Panggil fungsi edit modal
      }
    }
  "
                      />
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <hr />

      <!-- Red shift table -->
      <div class="card">
        <div class="card-header">
          <h6>Red Shift</h6>
        </div>
        <div class="card-body">
          <div class="tableFixHead">
            <table class="table table-bordered text-center">
              <thead>
                <tr>
                  <th id="fixCol-head-1" rowspan="2">No</th>
                  <th id="fixCol-head-2" rowspan="2">Line</th>
                  <th id="fixCol-head-3" rowspan="2">Pos</th>
                  <th id="fixCol-head-4" rowspan="2">Observer</th>
                  <th id="fixCol-head-5" rowspan="2">Shift</th>
                  <th :colspan="containerDate.length">{{ yearMonth }}</th>
                </tr>
                <tr>
                  <th
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    {{ date.idx }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isRedShiftLoading">
                  <td colspan="40" class="p-0" style="height: 200px">
                    <div class="vl-parent p-0" style="height: 100%">
                      <loading
                        v-model:active="isRedShiftLoading"
                        :can-cancel="true"
                        :is-full-page="false"
                        :on-cancel="onCancel"
                      />
                    </div>
                  </td>
                </tr>

                <tr
                  v-for="(
                    observationRedShift, i
                  ) in observationScheduleRedShift"
                  :key="observationRedShift.pos_id"
                >
                  <td id="fixCol-1">{{ i + 1 }}</td>
                  <td id="fixCol-2">{{ observationRedShift.line_snm }}</td>
                  <td id="fixCol-3">{{ observationRedShift.pos_nm }}</td>
                  <td id="fixCol-4">
                    <CBadge
                      v-for="observer in observationRedShift.checkers"
                      :key="observer"
                      color="secondary"
                      >{{ observer }}
                    </CBadge>
                  </td>
                  <td id="fixCol-5">{{ observationRedShift.group_nm }}</td>
                  <td
                    v-for="item in containerDate"
                    :key="item.idx"
                    style="min-width: 63px"
                  >
                    <template
                      v-for="child in observationRedShift.children"
                      :key="child.observation_id"
                    >
                      <template v-if="child.idxdate === String(item.idx)">
                        <TooltipStwSchedule
                          :child="child"
                          :customTooltipStyle="customTooltipStyle"
                          :observation="child"
                          :currentDate="currentDate"
                          @detail-schedule="detailSchedule"
                        />
                      </template>
                    </template>
                  </td>
                </tr>
                <tr
                  v-if="observationScheduleRedShift?.length < 1 && !isLoading"
                >
                  <td colspan="50">
                    <h3 class="my-2">Data kosong</h3>
                  </td>
                </tr>
                <tr
                  style="
                    position: sticky;
                    bottom: 0px;
                    z-index: 10;
                    background-color: white;
                  "
                  v-if="observationScheduleRedShift?.length > 0"
                >
                  <td colspan="5">
                    <h5>Sign TL</h5>
                  </td>
                  <td
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    <template
                      v-if="
                        observationScheduleRedShift.find((obserChild) =>
                          obserChild.children.find(
                            (childObser) => childObser.idxdate == date.idx,
                          ),
                        )
                      "
                    >
                      <!-- make condition for switch if sign in this date is available -->

                      <CButton
                        v-if="
                          !signObservationsTL_1_RED.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'TL_1' &&
                              obserChild.group_nm == 'RED',
                          )
                        "
                        color="dark"
                        variant="outline"
                        size="sm"
                        @click="
                          () => {
                            showModalSignTL(date.date, 'RED', 'TL_1', date.idx)
                          }
                        "
                      >
                        <CIcon icon="cil-pencil" class="text-dark" size="sm" />
                      </CButton>
                      <img
                        v-else
                        :src="
                          signObservationsTL_1_RED.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'TL_1' &&
                              obserChild.group_nm == 'RED',
                          )?.sign
                        "
                        width="50"
                        height="50"
                        alt="sign"
                                            style="cursor: pointer"
                        @click="
    () => {
      const signData = signObservationsTL_1_RED.find(
        (obserChild) =>
          obserChild.date_idx == date.idx &&
          obserChild.role_sign_sys == 'TL_1' &&
          obserChild.group_nm == 'RED'
      )
      if (signData) {
        openEditSignModal(signData) // <-- Panggil fungsi edit modal
      }
    }
  "
                      />
                    </template>
                  </td>
                </tr>
                <!-- <tr
                  style="
                    position: sticky;
                    bottom: 80px;
                    z-index: 10;
                    background-color: white;
                  "
                >
                  <td colspan="5">
                    <h5>Sign TL 2</h5>
                  </td>
                  <td
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    <template
                      v-if="
                        observationScheduleRedShift.find((obserChild) =>
                          obserChild.children.find(
                            (childObser) => childObser.idxdate == date.idx,
                          ),
                        )
                      "
                    >
                      <CButton
                        v-if="
                          !signObservationsTL_2_RED.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'TL_2' &&
                              obserChild.group_nm == 'RED',
                          )
                        "
                        color="dark"
                        variant="outline"
                        size="sm"
                        @click="
                          () => {
                            showModalSignTL(date.date, 'RED', 'TL_2', date.idx)
                          }
                        "
                      >
                        <CIcon icon="cil-pencil" class="text-dark" size="sm" />
                      </CButton>
                      <img
                        v-else
                        :src="
                          signObservationsTL_2_RED.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'TL_2' &&
                              obserChild.group_nm == 'RED',
                          )?.sign
                        "
                        width="50"
                        height="50"
                        alt="sign"
                      />
                    </template>
                  </td>
                </tr> -->
                <tr
                  style="
                    position: sticky;
                    bottom: 30px;
                    z-index: 10;
                    background-color: white;
                  "
                >
                  <td colspan="5">
                    <h5>Sign GL</h5>
                  </td>
                  <td
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    <template
                      v-if="
                        observationScheduleRedShift.find((obserChild) =>
                          obserChild.children.find(
                            (childObser) => childObser.idxdate == date.idx,
                          ),
                        )
                      "
                    >
                      <!-- make condition for switch if sign in this date is available -->

                      <CButton
                        v-if="
                          !signObservationsGL_RED.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'GL' &&
                              obserChild.group_nm == 'RED',
                          )
                        "
                        color="dark"
                        variant="outline"
                        size="sm"
                        @click="
                          () => {
                            showModalSignTL(date.date, 'RED', 'GL', date.idx)
                          } 
                        "
                      >
                        <CIcon icon="cil-pencil" class="text-dark" size="sm" />
                      </CButton>
                      <img
  v-else
  :src="signObservationsGL_RED.find(
    (obserChild) =>
      obserChild.date_idx == date.idx &&
      obserChild.role_sign_sys == 'GL' &&
      obserChild.group_nm == 'RED'
  )?.sign"
  width="50"
  height="50"
  alt="sign"
  style="cursor: pointer"
  @click="
    () => {
      const signData = signObservationsGL_RED.find(
        (obserChild) =>
          obserChild.date_idx == date.idx &&
          obserChild.role_sign_sys == 'GL' &&
          obserChild.group_nm == 'RED'
      )
      if (signData) {
        openEditSignModal(signData) // <-- Panggil fungsi edit modal
      }
    }
  "
/>

                    </template>
                  </td>
                </tr>
                <tr
                  style="
                    position: sticky;
                    bottom: 0px;
                    z-index: 10;
                    background-color: white;
                  "
                >
                  <td colspan="5">
                    <h5>Sign SH</h5>
                  </td>
                  <td
                    v-for="date in containerDate"
                    :key="date"
                    :class="date.bg"
                  >
                    <template
                      v-if="
                        observationScheduleRedShift.find((obserChild) =>
                          obserChild.children.find(
                            (childObser) => childObser.idxdate == date.idx,
                          ),
                        )
                      "
                    >
                      <!-- make condition for switch if sign in this date is available -->

                      <CButton
                        v-if="
                          !signObservationsSH_RED.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'SH' &&
                              obserChild.group_nm == 'RED',
                          )
                        "
                        color="dark"
                        variant="outline"
                        size="sm"
                        @click="
                          () => {
                            showModalSignTL(date.date, 'RED', 'SH', date.idx)
                          }
                        "
                      >
                        <CIcon icon="cil-pencil" class="text-dark" size="sm" />
                      </CButton>
                      <img
                        v-else
                        :src="
                          signObservationsSH_RED.find(
                            (obserChild) =>
                              obserChild.date_idx == date.idx &&
                              obserChild.role_sign_sys == 'SH' &&
                              obserChild.group_nm == 'RED',
                          )?.sign
                        "
                        width="50"
                        height="50"
                        alt="sign"
                        style="cursor: pointer"
                         @click="
    () => {
      const signData = signObservationsSH_RED.find(
        (obserChild) =>
          obserChild.date_idx == date.idx &&
          obserChild.role_sign_sys == 'SH' &&
          obserChild.group_nm == 'RED'
      )
      if (signData) {
        openEditSignModal(signData) // <-- Panggil fungsi edit modal
      }
    }
  "
                      />
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Yamazumi -->
    <!-- <div class="card">
      <div class="card-body">
        <Yamazumi />
      </div>
    </div> -->
  </div>
</template>

<script>
import moment from 'moment'
import { GET_LINES } from '@/store/modules/line.module'
import {
  GET_OBSERVATION_SCHEDULE,
  GET_OBSERVATION_SCHEDULE_RED_SHIFT,
} from '@/store/modules/observation.module'
import { mapGetters } from 'vuex'
import Loading from 'vue-loading-overlay'
// import Yamazumi from '@/components/yamazumi/Yamazumi.vue'
import TooltipStwSchedule from '@/components/TooltipSchedule/TooltipStwSchedule.vue'
import vueSignature from 'vue-signature'
import ApiService from '@/store/api.service'
import { toast } from 'vue3-toastify'

export default {
  name: 'STW Dashboard',
  data() {
    return {
      customTooltipStyle: {
        width: '100%',
      },
      isLoading: false,
      isRedShiftLoading: false,
      currentPage: 1,
      currentPageLimit: 100,
      selectedMonth: null,
      selectedFilterStartDate: '',
      selectedFilterEndDate: '',
      selectedLine: '',
      containerDate: [],
      schedules: [],
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
      yearMonth: '',
      whiteShiftID: 'cb7e9c37-b39c-49b4-b34d-b0a8f9f462df',
      redShiftID: '36ad3451-e2fe-4b50-84b0-2d6ca942ae1e',
      currentDate: `${new Date().getDate()}`,
      // for sign
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)',
      },
      selectedSignature: null,
      isShowSignModal: false,
      signForm: {
        date_sign: null,
        sign: null,
        group_nm: null,
        role_sign_sys: null,
        date_idx: null,
        line_id: null,
      },
      addSignModal: false,
      editSignModal:false,
      isUploadSignLoading: false,
      signObservationsTL_1: [],
      signObservationsTL_1_RED: [],
      signObservationsTL_2: [],
      signObservationsTL_2_RED: [],
      signObservationsGL: [],
      signObservationsGL_RED: [],
      signObservationsSH: [],
      signObservationsSH_RED: [],
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'observationSchedule',
      'observationScheduleRedShift',
    ]),
  },
  methods: {
    showModalSignTL(date_sign, group_nm, role_sign_sys, date_idx) {
      this.addSignModal = true
      this.signForm.date_sign = moment(date_sign).format('YYYY-MM-DD')
      this.signForm.group_nm = group_nm
      this.signForm.role_sign_sys = role_sign_sys
      this.signForm.date_idx = date_idx
      this.signForm.line_id = this.selectedLine
    },
    saveSignature() {
      var signFile

      signFile = this.$refs['sign'].save()
      this.signForm.sign = signFile

      this.addSign()
    },
   updateSign() {
  // Ambil data signature dari vueSignature
  const signatureData = this.$refs.sign.save(); // default-nya akan berbentuk base64

  if (!signatureData) {
    toast.error("Signature belum diisi.");
    return;
  }

  this.isUploadSignLoading = true;

  // Masukkan signature ke payload
  const payload = {
    sign: signatureData, // sudah dalam format base64 image
  };

  // Simpan ke API

  ApiService.put(`/operational/observation/sign/${this.signForm.id}`, payload)
    .then(() => {
      toast.success("Signature updated successfully!");
      this.editSignModal = false;
    })
    this.getSignature('TL_1', 'signObservationsTL_1')
          this.getSignature('TL_1', 'signObservationsTL_1_RED')
          this.getSignature('TL_2', 'signObservationsTL_2')
          this.getSignature('TL_2', 'signObservationsTL_2_RED')
          this.getSignature('GL', 'signObservationsGL')
          this.getSignature('GL', 'signObservationsGL_RED')
          this.getSignature('SH', 'signObservationsSH')
          this.getSignature('SH', 'signObservationsSH_RED')
    .catch((err) => {
      console.error(err);
      toast.error("Gagal menyimpan tanda tangan.");
    })
    .finally(() => {
      this.isUploadSignLoading = false;
    });
},


    async addSign() {
      this.isUploadSignLoading = true
      try {
        ApiService.setHeader()
        const addSign = await ApiService.post(
          `/operational/observation/sign`,
          this.signForm,
        )
        // console.log(addSign, 'addSign')
        if (addSign.data.message == 'Success to add sign') {
          this.isUploadSignLoading = false
          this.closeSignModal(true)
          toast.success('Success to add sign', {
            autoClose: 1000,
          })
          this.getSignature('TL_1', 'signObservationsTL_1')
          this.getSignature('TL_1', 'signObservationsTL_1_RED')
          this.getSignature('TL_2', 'signObservationsTL_2')
          this.getSignature('TL_2', 'signObservationsTL_2_RED')
          this.getSignature('GL', 'signObservationsGL')
          this.getSignature('GL', 'signObservationsGL_RED')
          this.getSignature('SH', 'signObservationsSH')
          this.getSignature('SH', 'signObservationsSH_RED')
        }
      } catch (error) {
        toast.error('error to add toast')
      }
    },
  EditshowModal(date_sign, group_nm, role_sign_sys, date_idx) {
  this.editSignModal = true
  this.signForm.date_sign = moment(date_sign).format('YYYY-MM-DD')
      this.signForm.group_nm = group_nm
      this.signForm.role_sign_sys = role_sign_sys
      this.signForm.date_idx = date_idx
      this.signForm.line_id = this.selectedLine
  

  
},
openEditSignModal(data) {
  this.editSignModal = true
this.signForm = { ...data }

  // Tampilkan tanda tangan yang sudah ada ke canvas
this.$nextTick(() => {
  const pad = this.$refs.sign?.signaturePad
  if (data.sign && pad) {
    pad.fromDataURL(data.sign)
  }
})
},



    closeSignModal() {
      this.addSignModal = false
      this.signForm = {
        date_sign: null,
        sign: null,
        group_nm: null,
        role_sign_sys: null,
        date_idx: null,
        line_id: null,
      }
      this.clearSignature()
    },
    clearSignature() {
      this.$refs['sign'].clear()
    },
    async getSignature(role_sign_sys = 'TL_1', state = 'signObservationsTL1') {
      try {
        ApiService.setHeader()
        const getData = await ApiService.query(
          `/operational/observation/sign`,
          {
            month: +this.selectedMonth.split('-')[1],
            year: +this.selectedMonth.split('-')[0],
            line_id: this.selectedLine,
            role_sign_sys: role_sign_sys,
          },
        )
        if (getData.data.message == 'Success to get sign') {
          this[state] = getData.data.data
        }
      } catch (error) {
        toast.error('Error to get signature data', {
          autoClose: 1000,
        })
      }
    },
    searchData() {
      if (this.selectedMonth || this.selectedLine != '0') {
        this.generateDate()
        let idx = this.idxMonth.indexOf(this.selectedMonth.split('-')[1])
        this.yearMonth = `${this.monthStr[idx]} ${
          this.selectedMonth.split('-')[0]
        }`
        this.getObsSchedule()
        this.getObsScheduleRedShift()
        this.getSignature('TL_1', 'signObservationsTL_1')
        this.getSignature('TL_1', 'signObservationsTL_1_RED')
        this.getSignature('TL_2', 'signObservationsTL_2')
        this.getSignature('TL_2', 'signObservationsTL_2_RED')
        this.getSignature('GL', 'signObservationsGL')
        this.getSignature('GL', 'signObservationsGL_RED')
        this.getSignature('SH', 'signObservationsSH')
        this.getSignature('SH', 'signObservationsSH_RED')
      }
    },
    onPageChange(page) {
      if (page == -1) {
        this.currentPage = this.currentPage - 1
        this.getObsSchedule()
      } else {
        this.currentPage = this.currentPage + 1
        this.getObsSchedule()
      }
    },
    onPageChangeLimit(limit) {
      this.currentPageLimit = limit
      this.getObsSchedule()
    },
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
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
    async getObsSchedule() {
      this.isLoading = true
      let objQuery = {
        line: this.selectedLine,
        month: this.selectedMonth.split('-')[1],
        year: this.selectedMonth.split('-')[0],
        limit: this.currentPageLimit,
        currentPage: this.currentPage,
        group_id: this.whiteShiftID,
      }
      if (this.selectedLine != '0') objQuery.line = this.selectedLine
      await this.$store
        .dispatch(GET_OBSERVATION_SCHEDULE, objQuery)
        .then((res) => {
          if (res) {
            this.isLoading = false
          }
        })
    },
    async getObsScheduleRedShift() {
      this.isRedShiftLoading = true
      let objQuery = {
        line: this.selectedLine,
        month: this.selectedMonth.split('-')[1],
        year: this.selectedMonth.split('-')[0],
        limit: this.currentPageLimit,
        currentPage: this.currentPage,
        group_id: this.redShiftID,
      }
      if (this.selectedLine != '0') objQuery.line = this.selectedLine
      await this.$store
        .dispatch(GET_OBSERVATION_SCHEDULE_RED_SHIFT, objQuery)
        .then((res) => {
          if (res) {
            this.isRedShiftLoading = false
          }
        })
    },
    detailSchedule(obser) {
      if (obser.is_new_form) {
        this.$router.push(`/new-observation/${obser.observation_id}`)
      } else {
        this.$router.push(`/observation/${obser.observation_id}`)
      }
    },
    addFilter() {
      this.getObsSchedule()
      this.getObsScheduleRedShift()
    },
  },
  async mounted() {
    await this.getLines()
    const year = moment(new Date()).toISOString().split('T')[0].split('-')[0]
    const month = moment(new Date()).toISOString().split('T')[0].split('-')[1]
    this.selectedMonth = `${year}-${month}`
    this.selectedLine = localStorage.getItem('line_id')

    // await this.getObsSchedule()
    // await this.getObsScheduleRedShift()
    this.searchData()
    this.getSignature('TL_1', 'signObservationsTL_1')
    this.getSignature('TL_1', 'signObservationsTL_1_RED')
    this.getSignature('TL_2', 'signObservationsTL_2')
    this.getSignature('TL_2', 'signObservationsTL_2_RED')
    this.getSignature('GL', 'signObservationsGL')
    this.getSignature('GL', 'signObservationsGL_RED')
    this.getSignature('SH', 'signObservationsSH')
    this.getSignature('SH', 'signObservationsSH_RED')
  },
  updated() {
    if (this.$route.query.line) {
      this.selectedLine = this.$route.query.line
    }
  },
  components: {
    Loading,
    // Yamazumi,
    TooltipStwSchedule,
    vueSignature,
  },
}
</script>

<style scoped>
.fixed-td {
  position: absolute;
}

.tableFixHead {
  overflow: auto;
  height: 100vh;
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
  z-index: 3;
  background-color: white;
}

#fixCol-head-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 85px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-4 {
  position: sticky;
  top: 0px;
  left: 200px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-5 {
  position: sticky;
  top: 0px;
  left: 290px;
  z-index: 3;
  background-color: white;
}

#fixCol-1 {
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 2;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 2;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  top: 0px;
  left: 85px;
  z-index: 2;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 200px;
  z-index: 2;
  background-color: white;
}

#fixCol-5 {
  position: sticky;
  top: 0px;
  left: 290px;
  z-index: 2;
  background-color: white;
}
</style>
