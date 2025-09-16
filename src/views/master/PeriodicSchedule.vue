<template>
  <div class="d-flex flex-row justify-content-between mb-2">
    <div class="flex-column">
      <h4>Master Periodic Schedule</h4>
    </div>
    <div class="flex-column">
      <button class="btn btn-primary" @click="() => { is_modal_add = true }">Add Periodic Schedule</button>
      <CModal backdrop="static" :visible="is_modal_add" @close="() => { is_modal_add = false }" size="lg">
        <CModalHeader>
          <CModalTitle>Edit Periodic</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
              <label>Periodic</label>
              <input v-model="input.freq_nm" class="form-control" type="text" placeholder="Masukan Periodic">
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
              <label>Type</label>
              <select class="form-select" v-model="input.type_val">
                <option v-for="(type, index) in typePeriodics" :key="index" :value="type.value">
                  {{ type.text }}
                </option>
              </select>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12 mt-3">
      <label>Color</label>
     <input 
    v-model="input.color" 
    type="color"
    class="form-control form-control-color w-100"
  
  >
    </div>

          </div>
        </CModalBody>
        <CModalFooter>
          <template v-if="isLoading">
            <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
            Loading...
          </template>
          <template v-else>
            <CButton color="primary" @click="actionAddFreq">Submit</CButton>
          </template>
          <CButton color="secondary" @click="() => { freq.is_edit = false }">Close</CButton>
        </CModalFooter>
      </CModal>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <table class="table table-striped text-center">
        <thead>
          <tr>
            <th>No</th>
            <th>Periodic</th>
            <th>Created By</th>
            <th>Created Date</th>
             <th>Color</th>
            <th colspan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
  <template v-if="getFreqsStatusEdit.length > 0 && !isLoading">
    <tr 
      v-for="freq in getFreqsStatusEdit" 
      :key="freq.id"
      :style="{ backgroundColor: freq.color || 'transparent' }"
    >
      <td>{{ freq.no }}</td>
      <td>{{ freq.freq_nm }}</td>
      <td>{{ freq.created_by }}</td>
      <td>{{ freq.created_dt.split(' ')[0] }}</td>
      <td>
        <div 
          :style="{ backgroundColor: freq.color, width: '30px', height: '30px', borderRadius: '4px', margin: 'auto' }"
        ></div>
      </td>
      <td>
        <button class="btn btn-warning w-100" @click="preventEdit(freq)">Edit</button>
        <!-- Modal edit tetap sama -->
      </td>
      <td>
        <button class="btn btn-danger w-100" @click="actionDeleteFreq(freq.id)">Delete</button>
      </td>
    </tr>
  </template>
  <template v-else-if="!isLoading && getFreqsStatusEdit.length == 0">
    <NoDataTable :colspan="6" />
  </template>
  <template v-else>
    <tr>
      <td colspan="6">
        <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
        Loading...
      </td>
    </tr>
  </template>
</tbody>

      </table>
    </div>
  </div>
</template>
<script>
import { EDIT_FREQ, GET_FREQS, DELETE_FREQ, POST_FREQ } from '@/store/modules/freq.module'
import { mapGetters } from 'vuex'
import { toast } from 'vue3-toastify';

import NoDataTable from '@/components/table/NoDataTable.vue';

import 'vue3-toastify/dist/index.css';
export default {
  name: "PeriodicSchedule",
  data() {
    return {
      is_modal_add: false,
      input: {
        freq_nm: null,
        type_val: 1,
        color: '#000000',
      },
      typePeriodics: [{
        value: 1,
        text: "Day"
      }, {
        value: 7,
        text: "Week"
      }, {
        value: 30,
        text: "Month"
      }, {
        value: 365,
        text: "Year"
      }],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'getFreqsStatusEdit'
    ]),
    getPrecVals() {
      return String(this.input.type_val * this.input.freq_nm)
    },
    getStringFreq() {
      return `${this.input.freq_nm} ${this.typePeriodics.find(type => type.value == this.input.type_val).text}`
    }

  },
  components: {
    NoDataTable
  },
  methods: {
    preventEdit(freq) {
      freq.is_edit = true
      console.log(freq.freq_nm.split(' ')[1]);
      this.input.type_val = this.typePeriodics.find(type => type.text == freq.freq_nm.split(' ')[1]).value
      this.input.freq_nm = +freq.freq_nm.split(' ')[0]
    },
    async actionGetFreqs() {
      try {
        await this.$store.dispatch(GET_FREQS)
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message, {
          autoClose: 1000
        })
      }
    },
    async actionAddFreq() {
      try {
        this.isLoading = true
        let data = {
          freq_nm: this.getStringFreq,
          precition_val: this.getPrecVals,
          color: this.input.color
        }
        await this.$store.dispatch(POST_FREQ, data)
        await this.actionGetFreqs()
        this.isLoading = false
        toast.success('Berhasil menambah periodic', {
          autoClose: 1000
        })
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message, {
          autoClose: 1000
        })
      }
    },
    async actionEditFreq(id) {
      try {
        this.isLoading = true
        let data = {
          id,
          freq_nm: this.getStringFreq,
          precition_val: this.getPrecVals,
          color: this.input.color
        }
        await this.$store.dispatch(EDIT_FREQ, data)
        await this.actionGetFreqs()
        toast.success('Berhasil mengubah periodic', {
          autoClose: 1000
        });
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message, {
          autoClose: 1000
        });
      }
    },
    async actionDeleteFreq(id) {
      try {
        this.isLoading = true
        let is_delete = confirm("Are you sure you want to delete this data?")
        if (!is_delete) return
        await this.$store.dispatch(DELETE_FREQ, id)
        await this.actionGetFreqs()
        toast.success('Berhasil menghapus periodic', {
          autoClose: 1000
        });
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
        toast.error(error.response.data.message, {
          autoClose: 1000
        });
      }
    }
  },
  async mounted() {
    await this.actionGetFreqs()
  }
}
</script>
<style></style>
