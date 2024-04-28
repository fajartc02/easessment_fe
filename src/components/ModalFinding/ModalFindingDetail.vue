<template>
  <CModal backdrop="static" alignment="center" :visible="detailTemuanModal" @close="$emit('close-modal')" size="lg"
    scrollable>
    <CModalHeader>
      <CModalTitle>Detail temuan</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Line</label>
            <input type="text" class="form-control" :value="findingDetail?.line_nm" disabled />
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Source cat</label>
            <input type="text" class="form-control" :value="findingDetail?.source_category" disabled />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Tanggal temuan</label>
            <input type="date" class="form-control" :value="formatTheDate(findingDetail?.finding_date)" disabled />
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Pos</label>
            <input type="text" class="form-control" :value="findingDetail?.finding_location" disabled />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Priority</label>
            <select class="form-select" :value="findingDetail?.cm_priority" :disabled="true">
              <option selected>Select priority</option>
              <option value="P1">P1: Safety and Quality Issue</option>
              <option value="P2">P2: Productivity Issue</option>
              <option value="P3">P3: Cost Issue</option>
            </select>
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">PIC </label>
            <input type="text" class="form-control" :value="findingDetail?.cm_pic_nm" disabled />
          </div>
        </div>
      </div>


      <div class="mb-2">
        <label class="mb-1">Finding description / problem</label>
        <textarea cols="30" rows="5" class="form-control" :value="findingDetail?.finding_desc" disabled></textarea>
      </div>
      <div class="mb-2">
        <label class="mb-1">Rencana perbaikan</label>
        <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_str_plan_date)" disabled />
      </div>


      <div class="mb-2">
        <label class="mb-1">Countermeasure description</label>
        <textarea cols="30" rows="5" class="form-control" :value="findingDetail?.cm_desc" disabled></textarea>
      </div>

      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure Start Plan Date </label>
            <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_str_plan_date)" disabled />
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure End Plan Date </label>
            <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_end_plan_date)" disabled />
          </div>
        </div>
      </div>
      <hr />


      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure Start actual date</label>
            <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_str_act_date)" disabled />
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure End actual date</label>
            <input type="date" class="form-control" :value="formatTheDate(findingDetail?.cm_end_act_date)" disabled />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure Training date</label>
            <input type="date" class="form-control" disabled />
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure Judge</label>
            <select class="form-select" :value="findingDetail?.cm_judg" disabled>
              <option value="true">Sudah</option>
              <option value="false">Belum</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure Sign LH White</label>
            <input type="file" class="form-control" disabled />
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure Sign SH</label>
            <input type="file" class="form-control" disabled />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure Sign LH Red</label>
            <input type="file" class="form-control" disabled />
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12">
          <div class="mb-2">
            <label class="mb-1">Countermeasure Comments</label>
            <input type="text" class="form-control" disabled />
          </div>
        </div>
      </div>









    </CModalBody>
    <CModalFooter>
      <router-link v-if="findingDetail?.observation_id !== null" :to="`/observation/${findingDetail?.observation_id}`"
        @click="$emit('close-modal')">
        <CButton color="primary" class="text-white"> View Activity </CButton>
      </router-link>
    </CModalFooter>
  </CModal>
</template>
<script>
export default {
  name: "ModalFindingDetail",
  props: {
    detailTemuanModal: Boolean,
    findingDetail: Object,
    formatTheDate: Function
  }
}
</script>
<style></style>
