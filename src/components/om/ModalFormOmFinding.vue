<template>
  <CModal backdrop="static" :visible="visible" @close="closeModal()" size="xl">
    <CModalHeader>
      <CModalTitle>{{ title }}</CModalTitle>
    </CModalHeader>
    <CForm @submit="submit" novalidate :validated="formValidated">
      <CModalBody>
        <div class="row pt-4">
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Line</CInputGroupText>
              <CFormInput :value="loadedFinding?.line_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Periodic</CInputGroupText>
              <CFormInput :value="loadedFinding?.freq_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Location</CInputGroupText>
              <CFormInput :value="loadedFinding?.location_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Methode</CInputGroupText>
              <CFormInput :value="loadedFinding?.method_nm" disabled />
            </CInputGroup>
          </div>
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Group</CInputGroupText>
              <CFormInput :value="loadedFinding?.group_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Machine</CInputGroupText>
              <CFormInput :value="loadedFinding?.machine_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Item Check</CInputGroupText>
              <CFormInput :value="loadedFinding?.item_check_nm" disabled />
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Standart</CInputGroupText>
              <CFormInput :value="loadedFinding?.standart_nm" disabled />
            </CInputGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Finding Date</CInputGroupText>
              <input type="date" class="form-control" v-model="form.finding_date" :disabled="isEdit" required>
            </CInputGroup>
          </div>
          <div class="col-md-6">
            <CInputGroup class="mb-3" :class="{ 'invalid': showErrorFindingPic }">
              <CInputGroupText>Finding PIC</CInputGroupText>
              <VueMultiselect v-model="selectedFindingPic" :options="getUsersOpts" :custom-label="customPicOptions"
                class="vue-multi-select" :disabled="isEdit" @close="closeFindingPic">
              </VueMultiselect>
            </CInputGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <CInputGroup class="mb-3">
              <CInputGroupText>Finding Desc</CInputGroupText>
              <CFormInput v-model="form.finding_desc" :disabled="isEdit" required />
            </CInputGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Source TAG</CInputGroupText>
              <CFormSelect v-model="form.source_tag" :disabled="isEdit" required>
                <option selected="" disabled="" value="">Select Source TAG</option>
                <option v-for="opt in optTags" :key="opt.id" :value="opt.text">{{ opt.text }}
                </option>
              </CFormSelect>
            </CInputGroup>
          </div>
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Priority</CInputGroupText>
              <CFormSelect v-model="form.priority_num" :disabled="isEdit" required>
                <option selected="" disabled="" value="">Select Priority</option>
                <option v-for="opt in optPriorities" :key="opt.id" :value="opt.id">{{ opt.text }}
                </option>
              </CFormSelect>
            </CInputGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Plan Countermeasure Date</CInputGroupText>
              <input type="date" class="form-control" v-model="form.plan_cm_date" :disabled="isEdit" required>
            </CInputGroup>
          </div>
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Departement</CInputGroupText>
              <CFormSelect v-model="form.dept" :disabled="isEdit" required>
                <option selected="" disabled="" value="">Select Departement</option>
                <option v-for="opt in optDepts" :key="opt.id" :value="opt.text">{{ opt.text }}
                </option>
              </CFormSelect>
            </CInputGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <CInputGroup class="mb-3">
              <CInputGroupText>Plan Countermeasure Desc</CInputGroupText>
              <CFormInput v-model="form.plan_cm_desc" :disabled="isEdit" required />
            </CInputGroup>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <CInputGroup class="mb-3" :class="{ 'invalid': showErrorActualPic }">
              <CInputGroupText>Actual PIC</CInputGroupText>
              <VueMultiselect v-model="selectedActualPic" :options="getUsersOpts" :custom-label="customPicOptions"
                class="vue-multi-select" :disabled="!isEdit" @close="closeActualPic">
              </VueMultiselect>
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Progress</CInputGroupText>
              <CFormSelect v-model="form.progress_num" :disabled="!isEdit">
                <option value="null">Select Progress</option>
                <option v-for="opt in optProgress" :key="opt.id" :value="opt.id">{{ opt.text }}
                </option>
              </CFormSelect>
            </CInputGroup>
          </div>
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Actual Countermeasure Date</CInputGroupText>
              <input type="date" class="form-control" v-model="form.actual_cm_date" :disabled="!isEdit">
            </CInputGroup>
            <CInputGroup class="mb-3">
              <CInputGroupText>Countermeasure Judg</CInputGroupText>
              <CFormSelect v-model="form.cm_judg" :disabled="!isEdit">
                <option value="null">Select Countermeasure Judg</option>
                <option value="true">Done</option>
                <option value="false">Not Yet</option>
              </CFormSelect>
            </CInputGroup>
          </div>
        </div>
        <div v-if="!isEdit" class="row mt-3">
          <div class="col-md-12">
            <h5 class="me-3">Finding Image</h5>
            <input ref="finding_image" type="file" class="form-control" />
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-12">
            <div class="d-flex mb-1">
              <h5 class="me-3">Finding LH Sign</h5>
              <CButton v-if="!isEdit" color="info" class="btn-sm text-white me-2"
                @click="clearSignature('finding_sign_lh')">
                Clear
              </CButton>
            </div>
            <Watermark :options="wmSign('Finding LH Sign')">
              <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
                <CustomSignature ref="finding_sign_lh" :w="'100%'" :h="'100px'"
                  :defaultUrl="loadedFinding?.finding_sign_lh" :disabled="isEdit">
                </CustomSignature>
              </div>
            </Watermark>
            <span v-if="showErrorSignFindingLh" class="text-danger mt-1">Sign Finding LH Harus di Isi</span>
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-12">
            <div class="d-flex mb-1">
              <h5 class="me-3">Countermeasure LH Sign</h5>
              <CButton v-if="isEdit" color="info" class="btn-sm text-white me-2" @click="clearSignature('cm_sign_lh')">
                Clear
              </CButton>
            </div>
            <Watermark :options="wmSign('Countermeasure LH Sign')">
              <div :style="`width: 100%; height: 100px; border: 1px solid #eaeaea;`">
                <CustomSignature ref="cm_sign_lh" :w="'100%'" :h="'100px'" :defaultUrl="loadedFinding?.cm_sign_lh"
                  :disabled="!isEdit">
                </CustomSignature>
              </div>
            </Watermark>
            <!-- <span v-if="showErrorSignCmLh" class="text-danger mt-1">Sign Countermeasure LH Harus di Isi</span> -->
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-md-12">
            <div class="d-flex mb-1">
              <h5 class="me-3">Countermeasure SH Sign</h5>
              <CButton v-if="isEdit" color="info" class="btn-sm text-white me-2" @click="clearSignature('cm_sign_sh')">
                Clear
              </CButton>
            </div>
            <Watermark :options="wmSign('Countermeasure SH Sign')">
              <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
                <CustomSignature ref="cm_sign_sh" :w="'100%'" :h="'100px'" :defaultUrl="loadedFinding?.cm_sign_sh"
                  :disabled="!isEdit">
                </CustomSignature>
              </div>
            </Watermark>
            <!-- <span v-if="showErrorSignCmSh" class="text-danger mt-1">Sign Countermeasure SH Harus di Isi</span> -->
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" class="text-white" @click="closeModal()">
          Close
        </CButton>
        <CButton type="submit" color="info" class="text-white">
          {{ isLoadingSave ? 'Saving..' : 'Save' }}
        </CButton>
      </CModalFooter>
    </CForm>
  </CModal>
</template>
<script>
import ApiService from '@/store/api.service'
import VueMultiselect from 'vue-multiselect'
import { Watermark } from '@watermarkify/vue-watermark'
// import vueSignature from 'vue-signature'
import CustomSignature from '@/components/CustomSignature'
import { GET_USERS } from '@/store/modules/user.module'
import { GET_SYSTEMS } from '@/store/modules/system.module'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify'

const defaultForm = {
  finding_id: null,
  line_id: null,
  group_id: null,
  machine_id: null,
  freq_id: null,
  om_item_check_kanban_id: null,
  om_sub_schedule_id: null,
  finding_pic_id: null,
  actual_pic_id: null,
  source_tag: null,
  finding_date: null,
  finding_desc: null,
  plan_cm_date: null,
  actual_cm_date: null,
  cm_judg: false,
  plan_cm_desc: null,
  dept: null,
  priority_num: null,
  progress_num: null,
}

export default {
  name: "ModalFormOmFinding",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loadedFinding: {
      type: Object,
    }
  },
  components: {
    VueMultiselect,
    CustomSignature,
    Watermark
  },
  data() {
    return {
      form: defaultForm,
      formValidated: null,
      selectedFindingPic: null,
      selectedActualPic: null,
      isLoadingSave: false,
      showErrorSignFindingLh: false,
      showErrorSignCmLh: false,
      showErrorSignCmSh: false,
      showErrorActualPic: false,
      showErrorFindingPic: false,
      optPriorities: [],
      optTags: [],
      optProgress: [],
      optDepts: [],
    }
  },
  methods: {
    async getUsers() {
      try
      {
        await this.$store.dispatch(GET_USERS)
      } catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
      }
    },
    async getOptSystems(type, id = null, text = null) {
      try
      {
        const response = await this.$store.dispatch(GET_SYSTEMS, {
          system_type: type
        })

        return response.map((item) => {
          return {
            id: id ? item[id] : item.id,
            text: text ? item[text] : item.system_value
          }
        })
      }
      catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        return []
      }
    },
    wmSign(content) {
      return {
        content: content,
        gap: [15, 15],
        offset: [10, 10],
        zIndex: 2,
        rotate: -20,
      }
    },
    clearSignature(from) {
      this.$refs[from].clear()
    },
    customPicOptions({ text }) {
      return `${text}`
    },
    async submit(event) {
      const priority = this.filterId(this.optPriorities, this.form.priority_num)
      const progress = this.filterId(this.optProgress, this.form.progress_num)

      this.form = {
        ...this.form,
        finding_pic_id: this.selectedFindingPic && this.selectedFindingPic.id != '-1' ? this.selectedFindingPic.id : null,
        actual_pic_id: this.selectedActualPic && this.selectedActualPic.id != '-1' ? this.selectedActualPic.id : null,
        priority_num: priority?.id,
        priority_desc: priority?.text,
        progress_num: progress?.id,
        progress_desc: progress?.text,
        finding_sign_lh: this.$refs.finding_sign_lh.isEmpty() ? null : this.$refs.finding_sign_lh.save(),
        cm_sign_lh: this.$refs.cm_sign_lh.isEmpty() ? null : this.$refs.cm_sign_lh.save(),
        cm_sign_sh: this.$refs.cm_sign_sh.isEmpty() ? null : this.$refs.cm_sign_sh.save(),
      }


      //console.log('form', this.form)

      const saveFn = async (callback) => {
        if (event.currentTarget.checkValidity() === false)
        {
          event.preventDefault()
          event.stopPropagation()
        }
        else
        {
          this.isLoadingSave = true
          await callback()
          this.isLoadingSave = false
          this.closeModal(true)
        }

        this.formValidated = true
      }

      if (this.isEdit)
      {
        // non core-ui validating
        this.showErrorActualPic = !this.selectedActualPic || this.selectedActualPic.id == '-1'
        if (this.showErrorActualPic)
        {
          this.formValidated = true
          return
        }

        await saveFn(() => this.updateFinding())
      }
      else
      {
        // non core-ui validating
        this.showErrorSignFindingLh = this.$refs.finding_sign_lh.isEmpty()
        this.showErrorFindingPic = !this.selectedFindingPic || this.selectedFindingPic?.id == '-1'
        if (
          this.showErrorSignFindingLh
          || this.showErrorFindingPic
        )
        {
          this.formValidated = true
          return
        }

        await saveFn(() => this.saveFinding())
      }
    },
    async updateFinding() {
      try
      {
        ApiService.setHeader()
        await ApiService.put(
          `/operational/om/finding/edit/${this.form.finding_id}`,
          this.form,
        )

        toast.success('Success to update finding', {
          autoClose: 10000,
        })
      }
      catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error?.response?.data?.message ?? error, {
          autoClose: 1000,
        })
      }
    },
    async saveFinding() {
      try
      {
        // eslint-disable-next-line no-unused-vars
        const { finding_id, ...request } = this.form
        ApiService.setHeader()
        const addResponse = await ApiService.post(
          `/operational/om/finding/add`,
          request,
        )

        if (addResponse && addResponse.status === 200)
        {
          // eslint-disable-next-line no-unused-vars
          const { om_finding_id } = addResponse.data.data
          if (!om_finding_id)
          {
            throw "Finding id not provide can't add finding image"
          }

          if (this.$refs.finding_image)
          {
            const formData = new FormData()
            formData.append('om_finding_id', om_finding_id)
            formData.append('dest', 'findingOm')
            formData.append('attachment', this.$refs.finding_image.files[0])

            await ApiService.post(`/operational/om/finding/upload-image`, formData)
          }

          toast.success('Success to save finding', {
            autoClose: 10000,
          })
        }
        else
        {
          throw "Failed to add finding"
        }
      }
      catch (error)
      {
        console.log(error)
        if (error?.response?.status == 401) this.$router.push('/login')
        toast.error(error?.response?.data?.message ?? error, {
          autoClose: 1000,
        })
      }
    },
    filterId(arr, id) {
      return arr.find((item) => item.id == id)
    },
    closeModal(refresh) {
      if (!this.isLoadingSave)
      {
        this.form = defaultForm
        this.$refs.finding_sign_lh.clear()
        this.$refs.cm_sign_lh.clear()
        this.$refs.cm_sign_sh.clear()

        this.$emit('modalFormOmFindingListener', {
          visible: false,
          refresh: refresh
        })
      }
    },
    closeFindingPic() {
      this.showErrorFindingPic = !this.selectedFindingPic || this.selectedFindingPic?.id == '-1'
    },
    closeActualPic() {
      this.showErrorActualPic = !this.selectedActualPic || this.selectedActualPic?.id == '-1'
    },
  },
  computed: {
    ...mapGetters(['getUsersOpts']),
    isEdit() {
      return this.loadedFinding?.finding_id != undefined && this.loadedFinding?.finding_id != null
    },
    title() {
      return this.loadedFinding?.finding_id ? "Edit OM Finding" : "Add OM Finding"
    },
  },
  watch: {

  },
  updated() {
    this.form = {
      finding_id: this.loadedFinding?.finding_id,
      line_id: this.loadedFinding?.line_id,
      group_id: this.loadedFinding?.group_id,
      machine_id: this.loadedFinding?.machine_id,
      freq_id: this.loadedFinding?.freq_id,
      om_item_check_kanban_id: this.loadedFinding?.om_item_check_kanban_id,
      om_sub_schedule_id: this.loadedFinding?.om_sub_schedule_id,
      finding_pic_id: this.loadedFinding?.finding_pic_id,
      actual_pic_id: this.loadedFinding?.actual_pic_id,
      source_tag: this.loadedFinding?.source_tag,
      finding_date: this.loadedFinding?.finding_date,
      finding_desc: this.loadedFinding?.finding_desc,
      plan_cm_date: this.loadedFinding?.plan_cm_date,
      actual_cm_date: this.loadedFinding?.actual_cm_date,
      cm_judg: this.loadedFinding?.cm_judg ?? false,
      plan_cm_desc: this.loadedFinding?.plan_cm_desc,
      dept: this.loadedFinding?.dept,
      priority_num: this.loadedFinding?.priority_num,
      progress_num: this.loadedFinding?.progress_num,
    }

    if (this.loadedFinding?.finding_pic_id)
    {
      this.selectedFindingPic = {
        id: this.loadedFinding?.finding_pic_id,
        text: this.loadedFinding?.finding_pic_nm,
      }
    }
    else
    {
      this.selectedFindingPic = null
    }

    if (this.loadedFinding?.actual_pic_id)
    {
      this.selectedActualPic = {
        id: this.loadedFinding?.actual_pic_id,
        text: this.loadedFinding?.actual_pic_nm,
      }
    }
    else
    {
      this.selectedActualPic = null
    }
  },
  mounted() {
    this.getUsers()
    this.getOptSystems('OM_PRIORITY', 'system_value', 'system_desc').then((r) => this.optPriorities = r)
    this.getOptSystems('OM_TAG').then((r) => this.optTags = r)
    this.getOptSystems('OM_PROGRESS', 'system_value', 'system_desc').then((r) => this.optProgress = r)
    this.getOptSystems('OPT_DEPT').then((r) => this.optDepts = r)
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
.vue-multi-select {
  width: auto !important;
  flex: 1 1 auto !important;
}

.canvas {
  border: 1px #b3b3b3 solid;
  border-radius: 10px;
}

.multiselect--disabled>.multiselect__tags,
.multiselect--disabled>.multiselect__tags>.multiselect__single,
.multiselect--disabled>.multiselect__select {
  background: #D8DBE0 !important;
}

.invalid .multiselect__tags {
  border-color: #f04124 !important
}
</style>
