<template>
  <CModal backdrop="static" alignment="center" :visible="visible" @close="closeSignModal()">
    <CModalHeader>
      <CModalTitle>Add Sign</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <!-- <input type="image" v-if="signCheckerData.sign" :src="signCheckerData.sign" style="width: 100%; height: 100%" /> -->
      <div style="width: 100%; height: 100px; border: 1px solid #eaeaea">
        <CustomSignature ref="sign" :sigOption="option" :w="'100%'" :h="'100px'" :defaultUrl="signCheckerData?.sign">
        </CustomSignature>
      </div>
    </CModalBody>
    <CModalFooter>
      <div class="d-flex w-100">
        <div class="flex-grow-1">
          <CButton color="info" class="text-white me-2" @click="clearSignature()">
            Clear
          </CButton>
          <CButton color="info" class="text-white" @click="saveSignature()">
            {{ isLoading ? 'Saving..' : 'Save' }}
          </CButton>
        </div>
        <CButton color="secondary" class="text-white" @click="closeSignModal()">
          Close
        </CButton>
      </div>
    </CModalFooter>
  </CModal>
</template>
<script>
import ApiService from '@/store/api.service'
import CustomSignature from '@/components/CustomSignature'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify'

export default {
  name: 'ModalOmAddSignSchedule',
  components: {
    CustomSignature
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    signCheckerData: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      writedSignature: null,
      isLoading: false,
    }
  },
  async mounted() { },
  watch: {
    signCheckerData: {
      handler() {
        console.log('====================================');
        console.log('signcheckerdata', this.signCheckerData);
        console.log('====================================');
      }
    }
  },
  computed: {
    ...mapGetters([
      'getOmSelectedChildren',
    ]),
  },
  methods: {
    saveSignature() {
      if (!this.$refs.sign.isEmpty())
      {
        this.writedSignature = this.$refs.sign.save()
        this.uploadSignature()
      }
      else
      {
        toast.warning('Please write sign first', {
          autoClose: 5000,
        })
      }
    },
    clearSignature() {
      this.$refs.sign.clear()
    },
    async uploadSignature() {
      try
      {
        this.isLoading = true
        ApiService.setHeader()
        await ApiService.put(
          `/operational/om/sub-schedule/sign/${this.signCheckerData.sign_checker_id}`,
          { sign: this.writedSignature },
        )

        this.isLoading = false
        toast.success('Success to add sign om schedule', {
          autoClose: 10000,
        })
        this.closeSignModal(true)
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
    closeSignModal(refresh = false) {
      this.writedSignature = null

      if (!this.isLoading)
      {
        this.$emit('modalSignListener', {
          visible: false,
          refresh: refresh
        })
      }
    },
  },
}
</script>
