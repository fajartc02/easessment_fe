<template>
  <div class="d-flex flex-row justify-content-between mb-2">
    <div class="flex-column">
      <h4>Master Kanban 4S</h4>
    </div>
    <div class="flex-column">
      <button class="btn btn-primary" @click="() => { isAddModal = true }">Add Kanban</button>
      <CModal backdrop="static" :visible="isAddModal" @close="() => {
        isAddModal = false
        this.newKanban = {
          line_id: null,
          zone_id: null,
          freq_id: null,
          kanban_no: null,
          area_nm: null,
          dest: null,
          kanban_imgs: []
        }
        selectedImages = []
      }">
        <CModalHeader>
          <CModalTitle>Add Kanban</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div class="row">
            <div class="col">
              <label>Line</label>
              <select class="form-select" v-model="newKanban.line_id">
                <option v-for="(line, index) in getLinesOptsWithoutAll" :key="index" :value="line.id">
                  {{ line.text }}
                </option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label>Zone</label>
              <select v-if="getZoneOptsWithoutAll.length > 0" class="form-select" v-model="newKanban.zone_id"
                :disabled="!newKanban.line_id">
                <option v-for="(line, index) in getZoneOptsWithoutAll" :key="index" :value="line.id">
                  {{ line.text }}
                </option>
              </select>
              <div v-else>
                <input class="form-control" type="text" value="Tidak ada zone" disabled>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label>Periodic</label>
              <select v-if="getFreqsOptsWithoutAll.length > 0" class="form-select" v-model="newKanban.freq_id"
                :disabled="!newKanban.zone_id">
                <option v-for="(line, index) in getFreqsOptsWithoutAll" :key="index" :value="line.id">
                  {{ line.text }}
                </option>
              </select>
              <div v-else>
                <input class="form-control" type="text" value="Tidak ada zone" disabled>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label>Kanban No.</label>
              <input class="form-control" type="text" v-model="newKanban.kanban_no" :disabled="!newKanban.freq_id"
                placeholder="Masukan nomer kanban">
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label>Area</label>
              <input class="form-control" type="text" v-model="newKanban.area_nm" :disabled="!newKanban.kanban_no"
                placeholder="Masukan Area">
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label>Images Ilustration</label><small class="text-danger">(max 4 gambar)</small>
              <input class="form-control" type="file" name="kanban_imgs[]" @change="handleFileInputChange" multiple
                accept="image/*">

              <table v-if="selectedImages.length > 0">
                <tr v-for="(image, index) in selectedImages" :key="index">
                  <td>
                    <img :src="image.url" alt="Selected Image" width="100">
                  </td>
                  <td>
                    <button class="btn btn-sm btn-danger" @click="removeImage(index)">Remove</button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <button class="btn btn-sm btn-primary" @click="storeNewKanban">
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
    </div>
  </div>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <div class="col">
          <label>Line</label>
          <select class="form-select" v-model="filter.line_id" @change="changesLine">
            <option v-for="(line, index) in getLinesOpts" :key="index" :value="line.id">
              {{ line.text }}
            </option>
          </select>
        </div>
        <div class="col">
          <label>Zone</label>
          <select class="form-select" v-model="filter.zone_id" :disabled="filter.line_id == -1">
            <option v-for="(zone, index) in getZoneOpts" :key="index" :value="zone.id">
              {{ zone.text }}
            </option>
          </select>
        </div>
        <div class="col">
          <label>Frequency</label>
          <select class="form-select" v-model="filter.freq_id">
            <option v-for="(freq, index) in getFreqsOpts" :key="index" :value="freq.id">
              {{ freq.text }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="card-body">
      <TableKanban4s :filter="filter" />
    </div>
    <div class="card-footer">
      <div class="row">
        <div class="col-xl-3">
          <div class="input-group mb-3">
            <label class="input-group-text">Limit</label>
            <select class="form-select" v-model="filter.limit">
              <option selected value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div class="col">

        </div>
        <div class="col-xl-3" v-if="filter.total_data > 1">
          <CustPagination :totalItems="filter.total_data" :items-per-page="filter.limit"
            :current-page="filter.current_page" @page-changed="handlePageChange" />
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_ZONES } from '@/store/modules/zone.module'
import { GET_KANBANS, POST_KANBAN } from '@/store/modules/kanban.module'
import { GET_FREQS } from '@/store/modules/freq.module'

import CustPagination from '@/components/pagination/CustPagination.vue';
import TableKanban4s from '@/components/table/TableKanban4s.vue'

import FnRequireFullFillInput from '@/functions/FnRequireFullFillInput'
import { toast } from 'vue3-toastify'

export default {
  name: 'Kanban4s',
  data() {
    return {
      filter: {
        line_id: -1,
        zone_id: -1,
        limit: 10,
        total_data: 1,
        current_page: 1,
        freq_id: -1
      },
      isAddModal: false,
      newKanban: {
        line_id: null,
        zone_id: null,
        freq_id: null,
        kanban_no: null,
        area_nm: null,
        dest: null,
        kanban_imgs: []
      },
      selectedImages: [],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'getLinesOpts',
      'getZoneOpts',
      'getPagination',
      'getFreqsOpts',
      'getLinesOptsWithoutAll',
      'getZoneOptsWithoutAll',
      'getFreqsOptsWithoutAll'
    ]),
    getLineName() {
      let line = this.getLinesOptsWithoutAll.find(line => line.id == this.newKanban.line_id)
      return line.text
    }
  },
  watch: {
    getPagination: {
      handler() {
        this.filter = {
          ...this.filter,
          limit: this.getPagination.limit,
          total_data: this.getPagination.total_data,
          current_page: this.getPagination.current_page
        }
      },
      deep: true
    },
    filter: {
      handler() {
        this.$store.dispatch(GET_KANBANS, this.filter)
      },
      deep: true
    },
    ['filter.line_id']: function () {
      // this.changesLine()

    },
    newKanban: {
      handler() {
        if (this.newKanban.line_id) {
          this.$store.dispatch(GET_ZONES, { line_id: this.newKanban.line_id })
        }
      },
      deep: true
    }
  },
  methods: {
    async getLines() {
      try {
        this.$store.dispatch(GET_LINES)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    changesLine() {
      if (this.filter.selectedLine != -1) {
        this.getZones()
      } else {
        this.filter.selectedZone = -1
      }
    },
    async getZones() {
      try {
        this.$store.dispatch(GET_ZONES, { line_id: this.filter.line_id })
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async fetchFreqs() {
      try {
        this.$store.dispatch(GET_FREQS)
      } catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    async storeNewKanban() {
      try {
        this.isLoading = true
        const isInputFullFill = FnRequireFullFillInput(this.newKanban)
        if (isInputFullFill) {
          this.newKanban.dest = `KANBAN_${this.getLineName}_${this.newKanban.kanban_no}`
          delete this.newKanban.line_id
          let newFormKanbanData = new FormData()
          for (const key in this.newKanban) {
            const element = this.newKanban[key];
            if (Array.isArray(this.newKanban[key])) {
              this.newKanban.kanban_imgs.forEach((item) => {
                newFormKanbanData.append(`kanban_imgs`, item);
              });
            } else {
              newFormKanbanData.append(key, element);
            }
          }
          await this.$store.dispatch(POST_KANBAN, newFormKanbanData)
          this.isLoading = false
          this.isAddModal = false
          this.newKanban = {
            line_id: null,
            zone_id: null,
            freq_id: null,
            kanban_no: null,
            area_nm: null,
            dest: null,
            kanban_imgs: []
          }
          this.selectedImages = []
        } else {
          toast.info('Lengkapi input terlebih dahulu', {
            autoClose: 1000
          })
          // alert("Lengkapi input terlebih dahulu")
          this.isLoading = false
        }
      } catch (error) {
        this.isLoading = false
        alert(error.response.data.message)
        // if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
      }
    },
    handlePageChange(page) {
      this.filter.current_page = page;
      this.$store.dispatch(GET_KANBANS, this.filter)
    },
    handleFileInputChange(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if (this.selectedImages.length < 4) {
          this.newKanban.kanban_imgs.push(files[i]);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedImages.push({ url: e.target.result, file: files[i] });
          };
          reader.readAsDataURL(files[i]);
        }
      }
    },
    removeImage(index) {
      this.newKanban.kanban_imgs.splice(index, 1);
      this.selectedImages.splice(index, 1);
    }
  },
  async mounted() {
    this.filter.current_page = this.getPagination.current_page
    this.filter.limit = this.getPagination.limit
    this.filter.total_data = this.getPagination.total_data
    this.isLoading = true
    await this.getLines();
    await this.getZones();
    await this.fetchFreqs();
    await this.$store.dispatch(GET_KANBANS, this.filter)
    this.isLoading = false
  },
  components: {
    TableKanban4s,
    CustPagination
  }
}
</script>
@/functions/FnRequireFullFillInput
