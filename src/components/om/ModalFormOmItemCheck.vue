<template>
  <CModal backdrop="static" :visible="visible" @close="cancel()">
    <CModalHeader>
      <CModalTitle>{{ loadedData ? 'Edit' : 'Add' }} OM Item Check Kanban</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CInputGroup class="mb-3">
        <CInputGroupText>Line</CInputGroupText>
        <CFormSelect v-model="form.line_id" :disabled="true">
          <option value="null">Select Line</option>
          <option v-for="line in getLinesOptsWithoutAll" :key="line.id" :value="line.id">{{ line.text }}</option>
        </CFormSelect>
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Machine</CInputGroupText>
        <CFormSelect v-model="form.machine_id" :disabled="true">
          <option value="null">Select Machine</option>
          <option v-for="machine in getMachinesOptsWithoutAll" :key="machine.id" :value="machine.id">{{ machine.text }}
          </option>
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
          <option v-for="opt in optMethods" :key="opt.id" :value="opt.text">{{ opt.text }}
          </option>
        </CFormSelect>
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Standart Name</CInputGroupText>
        <CFormSelect v-model="form.standart_nm">
          <option value="null">Select Standart</option>
          <option v-for="opt in optStandarts" :key="opt.id" :value="opt.text">{{ opt.text }}
          </option>
        </CFormSelect>
      </CInputGroup>
      <CInputGroup class="mb-3">
        <CInputGroupText>Duration Time</CInputGroupText>
        <CFormInput v-model="form.standart_time" />
      </CInputGroup>
    </CModalBody>
    <CModalFooter>
      <button class="btn btn-sm btn-primary" @click="submit()">
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
import { GET_SYSTEMS } from '@/store/modules/system.module'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'

const defaultForm = {
  freq_id: null,
  item_check_nm: null,
  location_nm: null,
  method_nm: null,
  standart_nm: null,
  standart_time: null,
}

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
      optStandarts: [],
      optMethods: [],
      optKanbans: [],
      form: defaultForm,
      isLoading: false,
    }
  },
  watch: {
    getGroupMachineDetail: {
      handler() {
        
      }
    },
    loadedData: {
      handler() {
        if (this.loadedData)
        {
          this.form = this.loadedData

          const existMethod = this.optMethods.find((item) => item.text == this.loadedData.method_nm)
          if (!existMethod)
          {
            this.form.method_nm = null
          }

          const existsStandart = this.optStandarts.find((item) => item.text == this.loadedData.standart_nm)
          if (!existsStandart)
          {
            this.form.standart_nm = null
          }
        }
        else
        {
          this.form = this.defaultForm
        }

      },
      deep: true
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getFreqsOpts',
      'getMachinesOpts',
      'getLinesOptsWithoutAll',
      'getFreqsOptsWithoutAll',
      'getMachinesOptsWithoutAll',
      'getGroupMachineDetail'
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
    async getOptStandartsSystem() {
      try
      {
        this.$store.dispatch(GET_SYSTEMS, {
          system_type: 'OM_STANDARD'
        }).then(res => {
          this.optStandarts = res.map((item) => {
            return {
              id: item.id,
              text: item.system_value
            }
          })
        })
      } catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async getOptMethodsSystem() {
      try
      {
        this.$store.dispatch(GET_SYSTEMS, {
          system_type: 'OM_METHOD'
        }).then(res => {
          this.optMethods = res.map((item) => {
            return {
              id: item.id,
              text: item.system_value
            }
          })
        })
      } catch (error)
      {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async submit() {
      this.isLoading = true
      if (this.loadedData)
      {
        await this.edit()
      } else
      {
        await this.post()
      }
      this.isLoading = false
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
              Swal.fire('Berhasil menambah OM Item Check Kanban', '', 'success')
              this.$emit('visible', {
                visible: false,
                refresh: true
              });
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
              Swal.fire('Berhasil edit OM Item Check Kanban', '', 'success')
              this.$emit('visible', {
                visible: false,
                refresh: true
              });
            })
          return;
        }
        Swal.fire('Lengkapi Input data', '', 'info')
      } catch (error)
      {
        console.log(error);
        Swal.fire('Gagal edit OM Item Check Kanban', '', 'error')
      }
    },
    cancel() {
      this.$emit('visible', {
        visible: false,
        refresh: false
      });

      this.form = {
        line_id: null,
        freq_id: null,
      }
    }
  },
  async mounted() {
    this.getLines()
    this.getFreqs()
    this.getMachines()
    await this.getOptStandartsSystem()
    await this.getOptMethodsSystem()
  }
}
</script>
