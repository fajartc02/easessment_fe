<template>
  <CModal backdrop="static" alignment="center" :visible="visible" @close="closeModal()">
    <CModalHeader>
      <CModalTitle>Add PIC </CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="mb-2">
        <label class="mb-1">PIC </label>
        <div class="row">
          <div class="col">
            <VueMultiselect v-model="selectedPIC" :options="getUsersOpts" :custom-label="customPicOptions">
            </VueMultiselect>
          </div>
        </div>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" class="text-white" @click="closeModal()">
        Close
      </CButton>
      <CButton color="info" class="text-white" @click="addPIC()">
        {{ isLoading ? 'Saving..' : 'Save' }}
      </CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
import ApiService from '@/store/api.service'
import { GET_USERS } from '@/store/modules/user.module'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify'
import VueMultiselect from 'vue-multiselect'

export default {
  name: 'ModalOmEditPicSchedule',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    VueMultiselect
  },
  data() {
    return {
      isLoading: false,
      selectedSubScheduleId: null,
      selectedPIC: null,
    }
  },
  async mounted() {
    this.getUsers()
  },
  watch: {
    getOmSelectedChildren: {
      handler() {
        this.selectedPIC = null
        this.selectedSubScheduleId = this.getOmSelectedChildren.om_sub_schedule_id
      },
      deep: true
    },
  },
  computed: {
    ...mapGetters(['getUsersOpts', 'getOmSelectedChildren']),
  },
  methods: {
    async getUsers() {
      try
      {
        await this.$store.dispatch(GET_USERS)
      } catch (error)
      {
        if (error?.response?.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    customPicOptions({ text }) {
      return `${text}`
    },
    async addPIC() {
      try
      {
        this.isLoading = true
        ApiService.setHeader()
        const data = {
          pic_id: this.selectedPIC.id
        };

        await ApiService.put(
          `/operational/om/sub-schedule/edit/${this.selectedSubScheduleId}`,
          data,
        )

        this.isLoading = false
        toast.success('Success to edit PIC om schedule', {
          autoClose: 1000,
        })

        this.closeModal(true)
      } catch (error)
      {
        console.log('error addPIC()', error)
        if (error.response.status == 401) this.$router.push('/login')
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
    closeModal(refresh = false) {
      if (!this.isLoading)
      {
        this.$emit('modalEditPicListener', {
          visible: false,
          refresh: refresh
        })
      }
    }
  },
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
