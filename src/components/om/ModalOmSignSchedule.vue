<template>
  <CModal backdrop="static" alignment="center" :visible="visible" @close="closeSignModal()" size="lg">
    <CModalHeader>
      <CModalTitle>Add Sign</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <input type="image" v-if="loadedSign" :src="loadedSign" style="width: 100%; height: 100%" />
      <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
        <vueSignature ref="sign" :sigOption="option" :w="'100%'" :h="'100px'">
        </vueSignature>
        <button class="btn btn-info my-3 btn-sm text-white" :disabled="isUploadSignLoading"
          @click="saveSignature()">
          {{ isUploadSignLoading ? 'Saving..' : 'Save' }}
        </button>
        <button class="btn btn-info btn-sm mx-2 my-3 text-white" @click="clearSignature()">
          Clear
        </button>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" class="text-white" @click="closeSignModal()">
        Close
      </CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
import vueSignature from 'vue-signature'
import ApiService from '@/store/api.service'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify'

export default {
  name: 'ModalOmAddSignSchedule',
  components: {
    vueSignature,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    signCheckerId: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      loadedSign: null,
      writedSignature: null,
      isLoading: false,
    }
  },
  async mounted() { },
  watch: {},
  computed: {
    ...mapGetters([
      'getOmSelectedChildren',
    ]),
  },
  methods: {
    saveSignature() {
      this.writedSignature = this.$refs.sign.save()
      this.uploadSignature()
    },
    clearSignature() {
      this.$refs.sign.clear()
    },
    async uploadSignature() {
      try {
        this.isUploadSignLoading = true
        ApiService.setHeader()
        await ApiService.put(
          `/operational/om/sub-schedule/sign/${this.signCheckerId}`,
          { sign: this.writedSignature },
        )

        this.isUploadSignLoading = false
        alert('Sign saved')
        this.closeSignModal()
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    closeSignModal() {
      this.writedSignature = null
      this.loadedSign = null
    },
    async getSignature() {
      try {
        this.isUploadSignLoading = true
        ApiService.setHeader()
        const getData = await ApiService.get(
          `/operational/om/sub-schedule/sign/${this.signCheckerId}`
        )

        this.loadedSign = getData.data.data.sign
        this.isUploadSignLoading = false
      }
      catch (error)
      {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
        toast.error(error.response.data.message, {
          autoClose: 1000,
        })
      }
    },
  },
}
</script>
