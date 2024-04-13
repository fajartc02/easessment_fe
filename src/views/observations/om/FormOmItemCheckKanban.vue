<template>
  <CModal backdrop="static" :visible="visible" @close="cancel()">
    <CModalHeader>
      <CModalTitle>Add OM Item Check Kanban</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CInputGroup class="mb-3">
        <CInputGroupText>Line</CInputGroupText>
        <CFormSelect v-model="form.line_id">
          <option value="null">Select Line</option>
          <option v-for="line in getLinesOptsWithoutAll" :key="line.id" :value="line.id">{{ line.text }}</option>
        </CFormSelect>
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Periodic</CInputGroupText>
        <CFormSelect v-model="form.freq_id">
          <option value="null">Select Periodic</option>
          <option v-for="freq in getFreqsOptsWithoutAll" :key="freq.id" :value="freq.id">{{ freq.text }}
          </option>
        </CFormSelect>
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Machine</CInputGroupText>
        <CFormSelect v-model="form.machine_id">
          <option value="null">Select Machine</option>
          <option v-for="machine in getMachinesOptsWithoutAll" :key="machine.id" :value="machine.id">{{ machine.text }}
          </option>
        </CFormSelect>
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Item Check Name</CInputGroupText>
        <CFormInput v-model="form.item_check_nm" />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Location</CInputGroupText>
        <CFormInput v-model="form.location_nm" />
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Method Name</CInputGroupText>
        <CFormSelect v-model="form.method_nm">
          <option value="null">Select Method</option>
        </CFormSelect>
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Standart Name</CInputGroupText>
        <CFormSelect v-model="form.standart_nm">
          <option value="null">Select Standart</option>
        </CFormSelect>
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Duration Time</CInputGroupText>
        <CFormInput v-model="form.standart_time" />
      </CInputGroup>
    </CModalBody>
    <CModalFooter>
      <button class="btn btn-sm btn-primary" @click="edit()">
        <template v-if="isLoading">
          <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
          Loading...
        </template>
        <template v-else>
          Submit
        </template>
      </button>
    </CModalFooter>
  </CModal>
</template>

<script>
import { POST_OM_ITEM_CHECK, PUT_OM_ITEM_CHECK } from '@/store/modules/omItemChecks.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_MACHINES } from '@/store/modules/machine.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

export default {
  name: 'FormOmItemCheckKanban',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    loadedData: {
      type: Object,
      required: false
    },
  },
  data() {
    return {
      form: {
        line_id: null,
        freq_id: null,
        machine_id: null,
        item_check_nm: null,
        location_nm: null,
        method_nm: null,
        standart_nm: null,
        standart_time: null,
      },
    }
  },
  watch: {
    form: {
      handler() {
        if (this.form.line_id)
        {
          this.$store.dispatch(GET_MACHINES, { line_id: this.form.line_id })
        }
      },
      deep: true
    },
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getFreqsOpts',
      'getMachinesOpts',
      'getLinesOptsWithoutAll',
      'getFreqsOptsWithoutAll',
      'getMachinesOptsWithoutAll'
    ])
  },
  methods: {
    async getLines() {
      try
      {
        await this.$store.dispatch(GET_LINES)
      } catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }

    },
    async getMachines() {
      try
      {
        await this.$store.dispatch(GET_MACHINES)
      } catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getFreqs() {
      try
      {
        this.$store.dispatch(GET_FREQS)
      } catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async post() {
      try
      {
        let isRequired = true
        for (const key in this.form)
        {
          if (!this.form[key]) isRequired = false
        }
        if (isRequired)
        {
          await this.$store.dispatch(POST_OM_ITEM_CHECK, this.form)
            .then(() => {
              Swal.fire('Berhasil menambah machine', '', 'success')
              //this.$router.push('/master/machine')
            })
          return;
        }
        Swal.fire('Lengkapi Input data', '', 'info')
      } catch (error)
      {
        console.log(error);
        Swal.fire('Gagal menambah job', '', 'error')
      }
    },
    async edit() {
      try
      {
        let isRequired = true
        for (const key in this.form)
        {
          if (!this.form[key]) isRequired = false
        }
        if (isRequired)
        {
          await this.$store.dispatch(PUT_OM_ITEM_CHECK, this.form)
            .then(() => {
              Swal.fire('Berhasil edit OM Item Check', '', 'success')
              //this.$router.push('/master/machine')
            })
          return;
        }
        Swal.fire('Lengkapi Input data', '', 'info')
      } catch (error)
      {
        console.log(error);
        Swal.fire('Gagal edit machine', '', 'error')
      }
    },
    cancel() {
      this.$emit('visible', false);
      this.form = {
        line_id: null,
        freq_id: null,
      }
    }
  },
  async mounted() {
    await this.getLines()
    await this.getFreqs()
    await this.getMachines()
  }
}
</script>
