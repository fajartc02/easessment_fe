<template>
  <div class="position-relative">
    <CModal backdrop="static" size="xl" :visible="visible" @close="closeModal()"
      aria-labelledby="StaticBackdropExampleLabel">
      <CModalHeader>
        <CModalTitle id="StaticBackdropExampleLabel">{{ title }}</CModalTitle>
      </CModalHeader>
      <CForm class="needs-validation" @submit="handleSubmit" novalidate :validated="isFromFindingValidate">
        <CModalBody>
          <div class="row">
            <!-- #region if want to use direct kanban without parent query -->
            <!-- <div class="col-md-6">
              <div class="mb-2" :class="{ 'invalid': showErrorKanban }">
                <label class="mb-1">Kanban</label>
                <treeselect v-model="form.kanban_id" :options="getKanbansOptsTreeselect" />
              </div>
              <div class="mb-2">
                <label class="mb-1">Line</label>
                <input type="text" class="form-control" :value="selectedKanban?.line_nm" disabled />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-2" :class="{ 'invalid': showErrorZone }">
                <label class="mb-1">Zone</label>
                <input type="text" class="form-control" :value="selectedKanban?.zone_nm" disabled />
              </div>
              <div class="mb-2">
                <label class="mb-1">Freq</label>
                <input type="text" class="form-control" :value="selectedKanban?.freq_nm" disabled />
              </div>
            </div> -->
            <!-- endregion -->
            <div class="col-md-6">
              <div class="mb-2">
                <label class="mb-1">Line</label>
                <select class="form-select" v-model="mainForm.line_id" required>
                  <option v-for="line in getLinesOptsWithoutAll" :key="line.id" :value="line.id">
                    {{ line.text }}
                  </option>
                </select>
              </div>
              <div class="mb-2" :class="{ invalid: showErrorKanban }">
                <label class="mb-1">Kanban</label>
                <treeselect v-model="form.kanban_id" :options="getKanbansOptsTreeselect"
                  :disabled="!mainForm.zone_id" />
              </div>
            </div>
            <div class="col-md-6">
              <!-- <div class="mb-2">
                <label class="mb-1">Freq</label>
                <select class="form-select" v-model="mainForm.freq_id" required>
                  <option v-for="freq in getFreqsOptsWithoutAll" :key="freq.id" :value="freq.id">
                    {{ freq.text }}
                  </option>
                </select>
              </div> -->
              <div class="mb-2" :class="{ invalid: showErrorZone }">
                <label class="mb-1">Zone</label>
                <select class="form-select" v-model="mainForm.zone_id" required :disabled="!mainForm.line_id">
                  <option v-for="zone in getZoneOptsWithoutAll" :key="zone.id" :value="zone.id">
                    {{ zone.text }}
                  </option>
                </select>
              </div>
              <div class="mb-2">
                <label class="mb-1">Freq</label>
                <input type="text" class="form-control" :value="selectedKanban?.freq_nm" disabled />
              </div>
            </div>
            <div class="col-md-12">
              <div class="mb-2" :class="{ invalid: showErrorKanban }">
                <label class="mb-1">Item Check Kanban</label>
                <treeselect v-model="mainForm.item_check_kanban_id" :options="getItemchecksOptsTreeselect"
                  :disabled="!form.kanban_id" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="mb-2">
                <label class="mb-1">Finding Desc</label>
                <input type="text" class="form-control" v-model="form.finding_desc" placeholder="Write Finding Desc"
                  :required="!isEdit" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-2">
                <label class="mb-1">Finding Date</label>
                <input type="date" class="form-control" v-model="form.finding_date" placeholder="Select Finding Date"
                  :required="!isEdit" />
              </div>
              <div class="mb-2" :class="{ invalid: showErrorFindingPic }">
                <label class="mb-1" style="margin-top: 1.5em">
                  Finding PIC
                </label>
                <VueMultiselect v-model="form.finding_pic" :options="picData" :custom-label="customPicOptions"
                  class="vue-multi-select" @close="closeSelectFindingPic">
                </VueMultiselect>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-2">
                <label class="mb-1">Reduce Time Countermeasure (Menit)</label>
                <div class="d-flex align-items-center">
                  <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" v-model="enabledReduceTime"
                    class="me-2" style="height: 20px; width: 20px" />
                  <input type="text" class="form-control" v-model="form.time_cm" :disabled="!enabledReduceTime"
                    @keypress="
                      $event.key.match(/^[\d]$/) ? '' : $event.preventDefault()
                      " />
                </div>
                <small v-if="!enabledReduceTime" class="text-info">* Ceklis & isi waktu pengurangan jika ada</small>
                <small v-else class="text-success">* Abaikan jika tidak ingin di ubah</small>
              </div>
              <div class="mb-2" :class="{ invalid: showErrorActualPic }">
                <label class="mb-1">PIC Countermeasure</label>
                <VueMultiselect v-model="form.actual_pic" :options="picData" :custom-label="customPicOptions"
                  class="vue-multi-select" @close="closeSelectActualPic">
                </VueMultiselect>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="mb-2">
                <label class="mb-1">Plan Countermeasure Date</label>
                <input type="date" class="form-control" v-model="form.plan_cm_date" :required="!isEdit" />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-2">
                <label class="mb-1">Actual Countermeasure Date</label>
                <input type="date" class="form-control" v-model="form.actual_cm_date" :disabled="!isEdit" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="mb-2">
                <label class="mb-1">Plan Countermeasure Desc</label>
                <input type="text" class="form-control" v-model="form.plan_cm_desc"
                  placeholder="Write Plan Countermeasure Desc" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-12">
              <div class="mb-2">
                <label class="mb-1">Department Terkait</label>
                <treeselect class="" v-model="form.opt_department" :multiple="true" :options="getSystemsOptDept" />
              </div>
            </div>
            <div class="col-12 col-md-12">
              <div class="mb-2">
                <label class="mb-1">Perubahan Standart</label>
                <select class="form-select" v-model="form.opt_changes">
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
                  <CFormSwitch v-model="form.is_change_sop" />
                </div>
              </div>
            </div>
            <div class="col-12 col-md-12">
              <div class="mb-2">
                <div class="card p-2">
                  <label>Apakah ada Improvement?</label>
                  <CFormSwitch v-model="form.is_need_improvement" />
                </div>
              </div>
            </div>

            <div class="col-12 col-md-12">
              <div class="mb-2">
                <div class="card p-2">
                  <label>PIC Penanggung Jawab <small>*TL UP</small></label>
                  <treeselect v-model="form.pic_supervisor_id" :options="getUsersTreeselect2" />
                </div>
              </div>
            </div>
          </div>
          <div class="row mb-2">
            <div class="col-md-12">
              <label class="mb-1">Evaluation</label>
              <select class="form-select" v-model="form.evaluation_name">
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
          </div>
          <div class="row">
            <div class="col-md-12">
              <label class="mb-1">Finding Image</label>
              <input ref="finding_image" type="file" class="form-control" />
            </div>
          </div>
          <div v-if="!isEdit" class="mb-2 mt-2">
            <label class="mb-1">Kaizen File</label>
            <input ref="kaizen_file" type="file" class="form-control" />
          </div>
          <div class="mb-2 mt-2">
            <label class="mb-1">Status Countermeasure</label>
            <select v-model="form.cm_judg" class="form-select">
              <option value="true">Sudah</option>
              <option value="false">Belum</option>
            </select>
          </div>
          <div class="mb-2">
            <label class="mb-1">Yokoten</label>
            <select v-model="form.time_yokoten" class="form-select">
              <option value="true">Sudah</option>
              <option value="false" selected>Belum</option>
            </select>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="closeModal()"> Close </CButton>
          <CButton color="primary" type="submit">
            {{ this.loadedFinding?.finding_id ? 'Update' : 'Add' }} Finding Data
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
    <CustomFullLoading :show="isLoadingSave" />
  </div>
</template>
<script>
import 'vue3-treeselect/dist/vue3-treeselect.css'
import Treeselect from 'vue3-treeselect'
import { toast } from 'vue3-toastify'
import ApiService from '@/store/api.service'
import VueMultiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'
import { GET_USERS } from '@/store/modules/user.module'
import { GET_LINES } from '@/store/modules/filter.module'
import { GET_ZONES } from '@/store/modules/zones.module'
import { GET_KANBANS } from '@/store/modules/kanban.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_SYSTEMS } from '@/store/modules/system.module'
import { GET_ITEMCHECKS } from '@/store/modules/itemchecks.module'

export default {
  name: 'ModalForm4sFinding',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loadedFinding: {
      type: Object,
    },
    isInput: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VueMultiselect,
    Treeselect,
  },
  data() {
    return {
      isFromFindingValidate: false,
      isLoadingSave: false,
      picData: [],
      showErrorActualPic: false,
      showErrorFindingPic: false,
      showErrorZone: false,
      showErrorKanban: false,
      showErrorItemCheckKanban: false,
      selectedKanban: null,
      mainForm: {
        line_id: '',
        zone_id: '',
        freq_id: '',
        item_check_kanban_id: null,
      },
      form: {
        kanban_id: null,
        finding_desc: null,
        finding_date: null,
        plan_cm_date: null,
        actual_cm_date: null,
        plan_cm_desc: null,
        opt_department: null,
        opt_changes: null,
        evaluation_name: null,
        cm_judg: null,
        time_yokoten: null,
        finding_pic: null,
        actual_pic: null,
        time_cm: null,
        is_change_sop: false,
        is_need_improvement: false,
        pic_supervisor_id: null,
      },
      optChangeData: null,
      optEvaluation: null,
      optDeptData: null,
      enabledReduceTime: false,
    }
  },
  methods: {
    closeModal(refresh) {
      this.$emit('close', {
        visible: false,
        refresh: refresh,
      })
    },
    async handleSubmit(event) {
      event.preventDefault()

      const findingData = {
        sub_schedule_id: null,
        schedule_item_check_kanban_id: null,
        line_id: this.selectedKanban?.line_id,
        freq_id: this.selectedKanban?.freq_id,
        zone_id: this.selectedKanban?.zone_id,
        group_id: this.selectedKanban?.group_id,
        kanban_id: this.form.kanban_id,
        finding_pic_id: this.form.finding_pic?.pic_id,
        actual_pic_id: this.form.actual_pic?.pic_id,
        finding_date: this.form.finding_date,
        finding_desc: this.form.finding_desc,
        plan_cm_date: this.form.plan_cm_date,
        plan_cm_desc: this.form.plan_cm_desc,
        time_cm: +this.form.time_cm,
        time_yokoten: this.form.time_yokoten,
        opt_changes: this.form.opt_changes,
        opt_depts: this.form.opt_department,
        cm_judg: this.form.cm_judg,
        actual_cm_date: this.form.actual_cm_date,
        evaluation_nm: this.form.evaluation_name,
        is_change_sop: this.form.is_change_sop,
        is_need_improvement: this.form.is_need_improvement,
        is_input: this.isInput,
        judgment_id: null,
        pic_supervisor_id: this.form.pic_supervisor_id,
      }

      console.log('====================================')
      console.log('checkValidity', event.currentTarget.checkValidity())
      console.log('findingData', findingData)
      console.log('====================================')

      const saveFn = async (callback) => {
        console.log('savefn', event.currentTarget.checkValidity())

        if (event.currentTarget.checkValidity() === true) {
          this.isLoadingSave = true
          await callback()
          this.isLoadingSave = false
        } else {
          //event.stopPropagation();

          toast.error('Please complete the field!', {
            autoClose: 700,
          })
        }

        this.isFromFindingValidate = true
      }

      this.showErrorKanban = !this.form.kanban_id || !this.selectedKanban
      this.showErrorItemCheckKanban = !this.mainForm.item_check_kanban_id

      if (this.isEdit) {
        this.showErrorActualPic =
          !this.form.actual_pic || this.actual_pic?.pic_id == '-1'
        if (
          this.showErrorActualPic ||
          this.showErrorKanban ||
          this.showErrorItemCheckKanban
        ) {
          this.isFromFindingValidate = true
          toast.error('Please complete the field!', {
            autoClose: 700,
          })
          return
        }

        await saveFn(async () => await this.updateFinding(findingData))
      } else {
        // non core-ui validating

        this.showErrorFindingPic =
          !this.form.finding_pic || this.form.finding_pic?.pic_id == '-1'
        if (
          this.showErrorFindingPic ||
          this.showErrorKanban ||
          this.showErrorItemCheckKanban
        ) {
          this.isFromFindingValidate = true
          toast.error('Please complete the field!', {
            autoClose: 700,
          })
          return
        }

        await saveFn(async () => await this.addFinding(findingData))
      }
    },
    async addFinding(findingData) {
      ApiService.setHeader()

      console.log('added')

      const add = await ApiService.post(
        `operational/4s/finding/add`,
        findingData,
      )
      if (add.status === 200) {
        const { finding_id } = add.data.data
        if (!finding_id) {
          throw "Finding id not provide can't add finding image"
        }

        console.log('this.$refs.finding_image', this.$refs.finding_image)
        console.log('this.$refs.kaizen_file', this.$refs.kaizen_file)

        if (
          this.$refs.finding_image &&
          this.$refs.finding_image.files.length &&
          this.$refs.finding_image.files[0]
        ) {
          console.log('uploading finding image')
          await this.uploadFindingImage(finding_id)
        }

        if (
          this.$refs.kaizen_file &&
          this.$refs.kaizen_file.files.length &&
          this.$refs.kaizen_file.files[0]
        ) {
          console.log('uploading finding kaizen')
          await this.uploadKaizen(finding_id)
        }

        toast.success('Success add data', {
          autoClose: 700,
        })

        this.closeModal(true)
      } else {
        toast.error('Failed', {
          autoClose: 700,
        })
      }
    },
    async updateFinding(findingData) {
      findingData.sub_schedule_id = this.loadedFinding?.sub_schedule_id
      findingData.schedule_item_check_kanban_id =
        this.loadedFinding?.schedule_item_check_kanban_id

      ApiService.setHeader()

      const update = await ApiService.put(
        `operational/4s/finding/edit/${this.selectedFindingID}`,
        findingData,
      )
      if (update.status === 200) {
        const { finding_id } = update.data.data
        if (!finding_id) {
          throw "Finding id not provide can't add finding image"
        }

        if (this.$refs.finding_image) {
          console.log('uploading finding image')
          await this.uploadFindingImage(finding_id)
        }

        if (this.$refs.kaizen_file) {
          console.log('uploading finding kaizen')
          await this.uploadKaizen(finding_id)
        }

        toast.success('Success edit data', {
          autoClose: 700,
        })

        this.closeModal(true)
      } else {
        toast.error('Failed', {
          autoClose: 700,
        })
      }
    },
    async getUsers() {
      try {
        await this.$store.dispatch(GET_USERS)
        if (this.getUsersOpts) {
          this.mapUsersData()
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getLines() {
      try {
        await this.$store.dispatch(GET_LINES)
        if (this.getLinesOpts) {
          this.mapLinesData()
        }
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getZone() {
      try {
        this.$store.dispatch(GET_ZONES, {
          line_id: this.mainForm.line_id ?? -1,
        })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getKanban() {
      try {
        this.$store.dispatch(GET_KANBANS, {
          zone_id: this.mainForm.zone_id ?? -1,
        })
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
    async getItemCheckKanbans() {
      try {
        this.$store.dispatch(GET_ITEMCHECKS, {
          kanban_id: this.form.kanban_id ?? -1,
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
    mapLinesData() {
      this.lineData = []
      this.getLinesOpts?.map((item) => {
        this.lineData.push({ line_id: item.id, line_name: item.text })
      })
    },
    mapUsersData() {
      this.picData = []
      this.getUsersOpts?.map((item) => {
        this.picData.push({ pic_id: item.id, pic_name: item.text })
      })
    },
    async uploadFindingImage(finding_id, findingImage = null) {
      if (this.$refs.finding_image) {
        try {
          const formData = new FormData()
          formData.append('finding_id', finding_id)
          formData.append('dest', 'finding4s')
          formData.append(
            'attachment',
            findingImage ? findingImage : this.$refs.finding_image.files[0],
          )

          await ApiService.post(
            `/operational/4s/finding/upload-image`,
            formData,
          )
        } catch (e) {
          console.log('error upload finding image', e)
        }
      }
    },
    async uploadKaizen(finding_id, kaizen_file = null) {
      if (!kaizen_file && !this.$refs.kaizen_file.files.length) {
        return
      }

      try {
        const formData = new FormData()
        formData.append('finding_id', finding_id)
        formData.append(
          'item_check_kanban_id',
          this.mainForm.item_check_kanban_id,
        )
        formData.append('dest', '4s-finding-kaizen')
        formData.append(
          'kaizen_file',
          kaizen_file ? kaizen_file : this.$refs.kaizen_file.files[0],
        )

        await ApiService.post(
          `/operational/4s/finding/upload-kaizen?dest=4s-finding-kaizen`,
          formData,
        )
      } catch (e) {
        console.log('uploadKaizen', e)
      }
    },
    customPicOptions({ pic_name }) {
      return `${pic_name}`
    },
    closeSelectFindingPic() {
      this.showErrorFindingPic =
        !this.form.finding_pic || this.finding_pic?.pic_id == '-1'
    },
    closeSelectActualPic() {
      this.showErrorActualPic =
        !this.form.actual_pic || this.actual_pic?.pic_id == '-1'
    },
  },
  computed: {
    ...mapGetters([
      'getLinesOptsWithoutAll',
      'getUsersOpts',
      'getLinesOpts',
      'getFreqsOptsWithoutAll',
      'getSystemsOptDept',
      'getKanbansOptsTreeselect',
      'getKanbans',
      'getZoneOptsWithoutAll',
      'getItemchecksOptsTreeselect',
      'getUsersTreeselect2',
    ]),
    title() {
      return this.loadedFinding?.finding_id
        ? 'Edit 4S Finding'
        : 'Add 4S Finding'
    },
    isEdit() {
      return this.loadedFinding?.finding_id
    },
  },
  watch: {
    visible() {
      this.isFromFindingValidate = false

      this.form = {
        kanban_id: null,
        finding_desc: null,
        finding_date: null,
        plan_cm_date: null,
        actual_cm_date: null,
        plan_cm_desc: null,
        opt_department: null,
        opt_changes: null,
        evaluation_name: null,
        cm_judg: null,
        time_yokoten: null,
        finding_pic: null,
        actual_pic: null,
        time_cm: null,
        is_change_sop: false,
        is_need_improvement: false,
        pic_supervisor_id: null,
      }

      this.mainForm = {
        line_id: '',
        zone_id: '',
        freq_id: '',
        item_check_kanban_id: null,
      }
    },
    'mainForm.line_id': function () {
      this.getZone()
    },
    'mainForm.zone_id': function () {
      this.getKanban()
    },
    'form.kanban_id': function (newVal) {
      if (newVal) {
        this.getItemCheckKanbans()
        this.selectedKanban = this.getKanbans.find(
          (kanban) => kanban.kanban_id == newVal,
        )
        console.log('selectedKanban', this.selectedKanban)
      } else {
        this.selectedKanban = null
      }
    },
  },
  async mounted() {
    this.getUsers()
    this.getLines()
    this.getZone()
    this.getFreq()
    // this.getKanban()
    this.getOptChangeSystem()
    this.getOptDeptSystem()
    this.getEvaluation()
    // this.getItemCheckKanbans()
  },
}
</script>
