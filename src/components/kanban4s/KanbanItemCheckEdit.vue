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
              <th>
                Method
              </th>
              <th>Control Point</th>
              <th>Ilustrations</th>
              <th colspan="2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Start: EDIT ITEMCHECK -->
            <template v-if="getItemchecksWithEditableStatus">
              <tr v-for="(itemcheck) in getItemchecksWithEditableStatus" :key="itemcheck.item_check_kanban_id">
                <template v-if="!itemcheck.is_edit">
                  <td>{{ itemcheck.no }}</td>
                  <td>{{ itemcheck.item_check_nm }}</td>
                  <td>{{ +itemcheck.standart_time }}</td>
                  <td>{{ itemcheck.method }}</td>
                  <td>{{ itemcheck.control_point }}</td>
                  <td>
                    <div class="row" v-if="itemcheck.ilustration_imgs">
                      <div v-for="itemcheckImg in itemcheck.ilustration_imgs" :key="itemcheckImg.path" class="col-4">
                        <img :src="itemcheckImg.img" width="90">
                      </div>
                    </div>
                    <template v-else>
                      <p class="text-danger">No Ilustrations</p>
                    </template>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-warning" @click="() => {
                      itemcheck.is_edit = true
                    }">Edit</button>
                  </td>
                </template>
                <template v-else>
                  <td>{{ itemcheck.no }}</td>
                  <td>
                    <input type="text" class="form-control" v-model="itemcheck.item_check_nm">
                  </td>
                  <td>
                    <input type="number" class="form-control" v-model="itemcheck.standart_time">
                  </td>
                  <td>
                    <input type="text" class="form-control" v-model="itemcheck.method">
                  </td>
                  <td>
                    <input type="text" class="form-control" v-model="itemcheck.control_point">
                  </td>
                  <td>
                    <input class="form-control" type="file" name="ilustration_imgs[]" @change="handleFileInputChange"
                      multiple>
                    <table v-if="itemcheck.ilustration_imgs">
                      <tr v-for="(image, index) in itemcheck.ilustration_imgs" :key="index">
                        <td>
                          <img v-if="!image.is_deleted" :src="image.img" alt="Selected Image" width="100">
                        </td>
                        <td>
                          <button v-if="!image.is_deleted" class="btn btn-sm btn-sm btn-danger"
                            @click="removeImage(index, itemcheck)">Remove</button>
                        </td>
                      </tr>
                    </table>
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
            <!-- End: EDIT ITEMCHECK -->
            <template v-else>
              <NoDataTable :colspan="4" v-if="!isAddItemCheck" />
            </template>
            <!-- Start: ADD ITEMCHECK -->
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
                <input class="form-control" type="text" placeholder="Masukan Waktu" v-model="newItemcheck.method">
              </td>
              <td>
                <input class="form-control" type="text" placeholder="Masukan Waktu"
                  v-model="newItemcheck.control_point">
              </td>
              <td>
                <input class="form-control" type="file" name="ilustration_imgs[]" @change="handleFileInputChange"
                  multiple>

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
            <!-- End: ADD ITEMCHECK -->
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
import {
  DELETE_ITEMCHECK,
  GET_ITEMCHECKS,
  POST_ITEMCHECK,
  PUT_ITEMCHECK
} from '@/store/modules/itemchecks.module'
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
        method: null,
        control_point: null,
        dest: "ITEM_CHECKS_KANBAN",
        ilustration_imgs: []
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
    },
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
          freq_id: this.getKanbanDetail.freq_id,
          zone_id: this.getKanbanDetail.zone_id,
          kanban_no: this.getKanbanDetail.kanban_no,
          area_nm: this.getKanbanDetail.area_nm
        }

        await this.$store.dispatch(PUT_KANBAN, data)
        await this.ActionKanbanDetail()
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
        method: null,
        control_point: null,
        ilustration_imgs: []
      }
    },
    async ActionAddItemCheck() {
      try {
        this.isLoading = true
        this.newItemcheck.kanban_id = this.getKanbanDetail.kanban_id
        this.newItemcheck.dest += `_${this.getKanbanDetail.line_nm}_${this.getKanbanDetail.kanban_no}`
        let newFormKanbanData = new FormData()
        for (const key in this.newItemcheck) {
          const element = this.newItemcheck[key];
          if (Array.isArray(this.newItemcheck[key])) {
            this.newItemcheck.ilustration_imgs.forEach((item) => {
              newFormKanbanData.append(`ilustration_imgs`, item);
            });
          } else {
            newFormKanbanData.append(key, element);
          }
        }
        await this.$store.dispatch(POST_ITEMCHECK, newFormKanbanData)
        await this.getKanbanItemCheck()
        this.isLoading = false
        this.isAddItemCheck = false
        this.newItemcheck = {
          kanban_id: null,
          item_check_nm: null,
          standart_time: null,
          dest: null,
          ilustration_imgs: [],
          method: null,
          control_point: null
        }
      } catch (error) {
        console.log(error)
        this.isLoading = false
        if (error.response.status == 401) this.$router.push('/login')
      }
    },
    async ActionUpdateItemCheck(itemcheck) {
      try {
        this.isLoading = true
        //   newItemcheck: {
        //   kanban_id: null,
        //   item_check_nm: null,
        //   standart_time: null,
        //   dest: "ITEM_CHECKS_KANBAN",
        //   ilustration_imgs: []
        // },
        const data = {
          id: itemcheck.item_check_kanban_id,
          kanban_id: this.getKanbanDetail.kanban_id,
          item_check_nm: itemcheck.item_check_nm,
          standart_time: itemcheck.standart_time,
          method: itemcheck.method,
          control_point: itemcheck.control_point,
          dest: "ITEM_CHECKS_KANBAN",
          previous_img_paths: itemcheck.ilustration_imgs ? JSON.stringify(itemcheck.ilustration_imgs) : null, // for handled image
          ilustration_imgs: [],
        }
        console.log(data);
        data.dest += `_${this.getKanbanDetail.line_nm}_${this.getKanbanDetail.kanban_no}`
        let newFormKanbanData = new FormData()
        for (const key in data) {
          const element = data[key];
          if (Array.isArray(data[key]) && key != 'previous_img_paths') {
            this.selectedImages.forEach((item) => {
              newFormKanbanData.append(`ilustration_imgs`, item.file);
            });
          } else {
            newFormKanbanData.append(key, element);
          }
        }
        this.isLoading = false
        await this.$store.dispatch(PUT_ITEMCHECK, newFormKanbanData)
        this.selectedImages = []
        this.newItemcheck.ilustration_imgs = []
        this.newItemcheck.dest = "ITEM_CHECKS_KANBAN"
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
        if (this.selectedImages.length < 3) {
          this.newItemcheck.ilustration_imgs.push(files[i]);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.selectedImages.push({ url: e.target.result, file: files[i] });
          };
          reader.readAsDataURL(files[i]);
        }
      }
    },
    removeImage(index, itemcheck = null) {
      if (itemcheck) {
        // console.log(itemcheck);
        itemcheck.ilustration_imgs[index].is_deleted = true
        console.log(itemcheck.ilustration_imgs);
        // itemcheck.ilustration_imgs[index] = itemcheck.ilustration_imgs[index].reduce(itemcheck => itemcheck.)
        // itemcheck.splice(index, 1);
        return;
      }
      this.newItemcheck.ilustration_imgs.splice(index, 1);
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
