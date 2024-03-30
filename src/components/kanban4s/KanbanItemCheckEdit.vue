<template>
  <template v-if="getKanbanDetail && !isLoading">

    <div class="row">
      <div class="col">
        <button v-if="!isEditKanban" class="btn btn-sm btn-warning" @click="isEditKanban = true">Edit Kanban</button>
        <button v-else class="btn btn-sm btn-success" @click="ActionEditKanban">Save Kanban</button>
        <!-- Start:TABLE VIEW KANBAN -->
        <table v-if="!isEditKanban" class="table table-bordered">
          <thead class="text-light bg-dark">
            <tr>
              <th colspan="3">
                4S Kanban {{ getKanbanDetail.line_nm }} PRODUCTION
              </th>
              <th>
                {{ getKanbanDetail.freq_nm }}
              </th>
            </tr>
            <tr>
              <th>
                No Kanban
              </th>
              <th>
                Area Check
              </th>
              <th>
                Waktu 4S (min)
              </th>
              <th>
                Zone
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ getKanbanDetail.kanban_no }}</td>
              <td>{{ getKanbanDetail.area_nm }}</td>
              <td>{{ totalItemCheckTime }}</td>
              <td>{{ getKanbanDetail.zone_nm }}</td>
            </tr>
          </tbody>
        </table>
        <!-- End:TABLE VIEW KANBAN -->
        <!-- Start:TABLE EDIT KANBAN -->
        <table v-else class="table table-bordered">
          <thead class="text-light bg-dark">
            <tr>
              <th colspan="3">
                4S Kanban
                <CFormSelect v-model="getKanbanDetail.line_id">
                  <option v-for="line in getLinesOptsWithoutAll" :key="line.id" :value="line.id">{{ line.text }}
                  </option>
                </CFormSelect>
                PRODUCTION
              </th>
              <th>
                <CFormSelect v-model="getKanbanDetail.freq_id">
                  <option v-for="freq in getFreqsOptsWithoutAll" :key="freq.id" :value="freq.id">{{ freq.text }}
                  </option>
                </CFormSelect>
              </th>
            </tr>
            <tr>
              <th>
                No Kanban
              </th>
              <th>
                Area Check
              </th>
              <th>
                Waktu 4S (min)
              </th>
              <th>
                Zone
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="text" class="form-control" v-model="getKanbanDetail.kanban_no">
              </td>
              <td><input type="text" class="form-control" v-model="getKanbanDetail.area_nm"></td>
              <td>{{ totalItemCheckTime }}</td>
              <td>
                <CFormSelect v-model="getKanbanDetail.zone_id">
                  <option v-for="zone in getZoneOptsWithoutAll" :key="zone.id" :value="zone.id">{{ zone.text }}
                  </option>
                </CFormSelect>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- End:TABLE EDIT KANBAN -->
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col">
        <table class="table table-bordered">
          <thead class="text-light bg-dark">
            <tr>
              <th>No</th>
              <th>Itemcheck</th>
              <th>Standard Time</th>
              <th>Ilustrations</th>
              <th colspan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="getItemchecksWithEditableStatus">
              <tr v-for="(itemcheck) in getItemchecksWithEditableStatus" :key="itemcheck.item_check_kanban_id">
                <template v-if="!itemcheck.is_edit">
                  <td>{{ itemcheck.no }}</td>
                  <td>{{ itemcheck.item_check_nm }}</td>
                  <td>{{ +itemcheck.standart_time }}</td>
                  <td>
                    <div class="row">
                      <div class="col">
                        <img
                          src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                          width="100">
                      </div>
                      <div class="col">
                        <img
                          src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                          width="100">
                      </div>
                    </div>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-warning" @click="() => { itemcheck.is_edit = true }">Edit</button>
                  </td>
                </template>
                <template v-else>
                  <td>{{ itemcheck.no }}</td>
                  <td>
                    <input type="text" class="form-control" v-model="itemcheck.item_check_nm">
                  </td>
                  <td>{{ +itemcheck.standart_time }}</td>
                  <td>
                    <div class="row">
                      <div class="col">
                        <img
                          src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                          width="100">
                      </div>
                      <div class="col">
                        <img
                          src="https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="
                          width="100">
                      </div>
                    </div>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-success" @click="() => {
    itemcheck.is_edit = false
    ActionUpdateItemCheck(itemcheck)
  }">Save</button>
                  </td>
                </template>
                <td>
                  <button class="btn btn-sm btn-danger"
                    @click="ActionDeleteItemCheck(itemcheck.item_check_kanban_id)">Delete</button>
                </td>
              </tr>
            </template>
            <template v-else>
              <NoDataTable :colspan="4" v-if="!isAddItemCheck" />
            </template>
            <tr v-if="isAddItemCheck">
              <td></td>
              <td>
                <input class="form-control" type="text" placeholder="Masukan itemcheck"
                  v-model="newItemcheck.item_check_nm">
              </td>
              <td>
                <input class="form-control" type="number" placeholder="Masukan Waktu"
                  v-model="newItemcheck.standart_time">
              </td>
              <td>
                <input class="form-control" type="file" name="kanban_imgs[]" @change="handleFileInputChange" multiple
                  accept="image/*">

                <table v-if="selectedImages.length > 0">
                  <tr v-for="(image, index) in selectedImages" :key="index">
                    <td>
                      <img :src="image.url" alt="Selected Image" width="100">
                    </td>
                    <td>
                      <button class="btn btn-sm btn-sm btn-danger" @click="removeImage(index)">Remove</button>
                    </td>
                  </tr>
                </table>
              </td>
              <td>
                <button class="btn btn-sm btn-success" @click="ActionAddItemCheck">Save</button>
              </td>
              <td>
                <button class="btn btn-sm btn-warning" @click="cancelAddItemcheck">
                  Cancel
                </button>
              </td>
            </tr>
            <tr>
              <td colspan="6"><button class="btn btn-sm btn-primary mx-auto"
                  @click="() => { isAddItemCheck = true }">Add
                  Item
                  Check</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  <template v-else>
    <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
    Loading...
  </template>
</template>


<script>
import ITEMCHECK_KANBAN from '@/mocks/ITEMCHECK_KANBAN.mock'
import NoDataTable from '@/components/table/NoDataTable.vue'
import { DELETE_ITEMCHECK, GET_ITEMCHECKS, POST_ITEMCHECK, PUT_ITEMCHECK } from '@/store/modules/itemchecks.module'
import { mapGetters } from 'vuex'
import { GET_KANBAN_DETAIL, PUT_KANBAN } from '@/store/modules/kanban.module'
import { GET_LINES } from '@/store/modules/line.module'
import { GET_FREQS } from '@/store/modules/freq.module'
import { GET_ZONES } from '@/store/modules/zones.module'
import Swal from 'sweetalert2'

export default {
  name: "KanbanItemCheckEdit",
  data() {
    return {
      itemchecks: [] || ITEMCHECK_KANBAN,
      newItemcheck: {
        kanban_id: null,
        item_check_nm: null,
        standart_time: null,
        item_check_imgs: []
      },
      isLoading: false,
      isEditKanban: false,
      isAddItemCheck: false,
      selectedImages: [],
    }
  },
  computed: {
    ...mapGetters([
      'getItemchecksWithEditableStatus',
      'getKanbanDetail',
      'getLinesOptsWithoutAll',
      'getFreqsOptsWithoutAll',
      'getZoneOptsWithoutAll'
    ]),
    totalItemCheckTime() {
      let total = 0
      if (this.getItemchecksWithEditableStatus) {
        this.getItemchecksWithEditableStatus.forEach(itemcheck => {
          total += +itemcheck.standart_time
        })
      }
      return total
    }
  },
  methods: {
    async getKanbanItemCheck() {
      try {
        this.isLoading = true
        await this.$store.dispatch(GET_ITEMCHECKS, { kanban_id: this.kanban_id })
        this.isLoading = false
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async ActionKanbanDetail() {
      try {
        this.isLoading = true
        await this.$store.dispatch(GET_KANBAN_DETAIL, { id: this.kanban_id })
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async preEditKanban() {
      try {
        await this.$store.dispatch(GET_LINES)
        await this.$store.dispatch(GET_FREQS)
        await this.$store.dispatch(GET_ZONES, { line_id: this.getKanbanDetail.line_id })
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async ActionEditKanban() {
      try {
        this.isLoading = true
        const data = {
          id: this.getKanbanDetail.kanban_id,
          line_id: this.getKanbanDetail.line_id,
          freq_id: this.getKanbanDetail.freq_id,
          zone_id: this.getKanbanDetail.zone_id,
          kanban_no: this.getKanbanDetail.kanban_no,
          area_nm: this.getKanbanDetail.area_nm
        }

        await this.$store.dispatch(PUT_KANBAN, data)
        this.isLoading = false
        this.isEditKanban = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    cancelAddItemcheck() {
      this.isAddItemCheck = false
      this.newItemcheck = {
        kanban_id: null,
        item_check_nm: null,
        standart_time: null,
        item_check_imgs: []
      }
    },
    async ActionAddItemCheck() {
      try {
        this.isLoading = true
        this.newItemcheck.kanban_id = this.getKanbanDetail.kanban_id
        // FOR TEMP WAITING BE ENHANCE
        delete this.newItemcheck.item_check_imgs
        await this.$store.dispatch(POST_ITEMCHECK, this.newItemcheck)
        await this.getKanbanItemCheck()
        this.isLoading = false
        this.isAddItemCheck = false
        this.newItemcheck = {
          kanban_id: null,
          item_check_nm: null,
          standart_time: null,
          item_check_imgs: []
        }
      } catch (error) {
        console.log(error)
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async ActionUpdateItemCheck(itemcheck) {
      try {
        // TEMPORARY WAITING BE enhance
        this.isLoading = true
        const data = {
          id: itemcheck.item_check_kanban_id,
          kanban_id: this.getKanbanDetail.kanban_id,
          item_check_nm: itemcheck.item_check_nm,
          standart_time: itemcheck.standart_time,
          // item_check_imgs: itemcheck.item_check_imgs
        }
        await this.$store.dispatch(PUT_ITEMCHECK, data)
        await this.getKanbanItemCheck()
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async ActionDeleteItemCheck(item_check_kanban_id) {
      try {
        await Swal.fire({
          title: `Apakah kamu yakin ingin menghapus item check ini?`,
          showCancelButton: true,
          confirmButtonText: "Delete",
        }).then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.isLoading = true
            await this.$store.dispatch(DELETE_ITEMCHECK, item_check_kanban_id)
            await this.getKanbanItemCheck()
          }
        });
      } catch (error) {
        console.log(error)
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    handleFileInputChange(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        if (this.selectedImages.length < 4) {
          this.newItemcheck.item_check_imgs.push(files[i]);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedImages.push({ url: e.target.result, file: files[i] });
          };
          reader.readAsDataURL(files[i]);
        }
      }
    },
    removeImage(index) {
      this.newItemcheck.item_check_imgs.splice(index, 1);
      this.selectedImages.splice(index, 1);
    }
  },
  watch: {
    kanban_id: {
      immediate: true,
      handler: function () {
        this.getKanbanItemCheck();
        this.ActionKanbanDetail()
      }
    },
    getItemchecksWithEditableStatus: {
      immediate: true,
      handler: function () {
        this.itemchecks = this.getItemchecksWithEditableStatus
      }
    },
  },
  props: {
    kanban_id: {
      type: String,
      default: -1
    },
  },
  components: {
    NoDataTable
  },
  mounted() {
    this.preEditKanban()
  }
}
</script>

<style scoped>
table {
  border-collapse: collapse;
}

td {
  text-align: center;
  /* Horizontal alignment */
  vertical-align: middle;
  /* Vertical alignment */
}
</style>
