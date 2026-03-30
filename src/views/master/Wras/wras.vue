<template>
  <loading :active="isLoading" :can-cancel="true" :is-full-page="false" />
  <div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">Master WRAS</h5>
      <CButton color="primary" size="sm" @click="openAddModal">
        + Add WRAS
      </CButton>
    </div>

    <div class="card-body">
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>No</th>
            <th>WRAS_ID</th>
            <th>Plant</th>
            <th>Shop</th>
            <th>Line</th>
            <th>Pos</th>
            <th>SOP</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
      <tbody>
  <tr v-for="(item, i) in wras" :key="item.wras_id">
    <td>
      {{ i + 1 + ((pagination.currentPage - 1) * pagination.limit) }}
    </td>
    <td>{{ item.wras_id }}</td>
    <td>{{ item.plant_nm ?? '-' }}</td>
    <td>{{ item.shop_nm ?? '-' }}</td>
    <td>{{ item.line_nm ?? '-' }}</td>
    <td>{{ item.pos_nm ?? '-' }}</td>
    <td>{{ item.job_nm ?? '-' }}</td>
    <td class="text-center">
      <CButton color="info" size="sm" class="me-1" @click="handleView(item)">
        <CIcon icon="cil-magnifying-glass" />
      </CButton>
      <CButton color="warning" size="sm" class="me-1" @click="handleEdit(item)">
        <CIcon icon="cil-pencil" />
      </CButton>
      <CButton color="danger" size="sm" @click="deleteWras(item)">
        <CIcon icon="cil-trash" />
      </CButton>
    </td>
  </tr>

  <!-- Jika tidak ada data -->
  <tr v-if="!wras || wras.length === 0">
    <td colspan="8" class="text-center">Tidak ada data</td>
  </tr>
</tbody>

      </table>
    </div>

   <!-- Modal Add WRAS -->
<CModal :visible="isAddOpen" @close="isAddOpen = false" size="xl">
  <CModalHeader>
    <CModalTitle>Add WRAS</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <div class="row">
      <div class="col-md-6">
        <CInputGroup class="mb-3">
  <CInputGroupText>Plant</CInputGroupText>
  <CFormSelect v-model="form.plant">
    <option value="">-- Pilih Plant --</option>
    <option v-for="plant in getPlantsOptsWithoutAll" :key="plant.id" :value="plant.id">{{ plant.text }}</option>
  </CFormSelect>
</CInputGroup>
      </div>
      <div class="col-md-6">
        <CInputGroup class="mb-3">
  <CInputGroupText>Shop</CInputGroupText>
  <CFormSelect :disabled="!form.plant" v-model="form.shop">
    <option value="">-- Pilih Shop --</option>
    <option v-for="shop in getShopsOptsWithoutAll" :key="shop.id" :value="shop.id">{{ shop.text }}</option>
  </CFormSelect>
</CInputGroup>

      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <CInputGroup class="mb-3">
  <CInputGroupText>Line</CInputGroupText>
  <CFormSelect :disabled="!form.shop" v-model="form.line">
    <option value="-1">-- Pilih Line --</option>
    <option v-for="line in getLinesOptsWithoutAll" :key="line.id" :value="line.id">{{ line.text }}</option>
  </CFormSelect>
</CInputGroup>
      </div>
      <div class="col-md-6">
      <CInputGroup class="mb-3">
  <CInputGroupText>Pos</CInputGroupText>
  <CFormSelect :disabled="!form.line" v-model="form.pos">
    <option value="-1">-- Pilih Pos --</option>
    <option v-for="pos in getPosOptsWithoutAll" :key="pos.id" :value="pos.id">{{ pos.text }}</option>
  </CFormSelect>
</CInputGroup>
      </div>
    </div>

   <CInputGroup class="mb-3">
  <CInputGroupText>SOP</CInputGroupText>
  <CFormSelect v-model="form.sop">
    <option value="">-- Pilih SOP --</option>
    <option v-for="sop in getJobOpts" :key="sop.id" :value="sop.id">{{ sop.text }}</option>
  </CFormSelect>
</CInputGroup>
    <!-- LuckySheet muncul di bawah form -->
    <LuckySheetWrapper ref="luckysheetAdd" :readOnly="false" />
  </CModalBody>
  <CModalFooter>
    <CButton color="secondary" @click="isAddOpen = false">Cancel</CButton>
    <CButton color="primary" @click="saveAdd">Save</CButton>
  </CModalFooter>
</CModal>

    <!-- Modal View -->
    <CModal :visible="isViewOpen" @close="isViewOpen = false" size="xl">
      <CModalHeader>
        <CModalTitle>View WRAS</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <loading :active="modalLoading" :can-cancel="false" :is-full-page="false" />
        <LuckySheetWrapper
          v-if="selectedJob"
          :data="selectedJob.file"
          :readOnly="true"
        />
      </CModalBody>
    </CModal>

    <!-- Modal Edit -->
    <CModal :visible="isEditOpen" @close="isEditOpen = false" size="xl">
      <CModalHeader>
        <CModalTitle>Edit WRAS</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <loading :active="modalLoading" :can-cancel="false" :is-full-page="false" />
        <div class="row">
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Plant</CInputGroupText>
              <CFormSelect v-model="editForm.plant">
                <option value="">-- Pilih Plant --</option>
                <option v-for="plant in getPlantsOptsWithoutAll" :key="plant.id" :value="plant.id">{{ plant.text }}</option>
              </CFormSelect>
            </CInputGroup>
          </div>
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Shop</CInputGroupText>
              <CFormSelect :disabled="!editForm.plant" v-model="editForm.shop">
                <option value="">-- Pilih Shop --</option>
                <option v-for="shop in getShopsOptsWithoutAll" :key="shop.id" :value="shop.id">{{ shop.text }}</option>
              </CFormSelect>
            </CInputGroup>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Line</CInputGroupText>
              <CFormSelect :disabled="!editForm.shop" v-model="editForm.line">
                <option value="-1">-- Pilih Line --</option>
                <option v-for="line in getLinesOptsWithoutAll" :key="line.id" :value="line.id">{{ line.text }}</option>
              </CFormSelect>
            </CInputGroup>
          </div>
          <div class="col-md-6">
            <CInputGroup class="mb-3">
              <CInputGroupText>Pos</CInputGroupText>
              <CFormSelect :disabled="!editForm.line" v-model="editForm.pos">
                <option value="-1">-- Pilih Pos --</option>
                <option v-for="pos in getPosOptsWithoutAll" :key="pos.id" :value="pos.id">{{ pos.text }}</option>
              </CFormSelect>
            </CInputGroup>
          </div>
        </div>

        <CInputGroup class="mb-3">
          <CInputGroupText>SOP</CInputGroupText>
          <CFormSelect v-model="editForm.sop">
            <option value="">-- Pilih SOP --</option>
            <option v-for="sop in getJobOpts" :key="sop.id" :value="sop.id">{{ sop.text }}</option>
          </CFormSelect>
        </CInputGroup>

        <LuckySheetWrapper
            ref="luckysheetEdit"
            v-if="selectedJob"
            :data="selectedJob.file"
            :readOnly="false"
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="isEditOpen = false">Cancel</CButton>
        <CButton color="primary" @click="saveEdit">Save</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script>
import LuckySheetWrapper from "@/components/Luckysheet/Luckysheet.vue";
import { GET_WRAS, PUT_WRAS, POST_WRAS, DELETE_WRAS } from "@/store/modules/wras.module";
import { GET_JOB } from '@/store/modules/job.module'
import { GET_SHOPS } from '@/store/modules/shop.module'
import { GET_LINES } from "@/store/modules/line.module"
import { GET_POS } from '@/store/modules/pos.module'
import { mapGetters } from "vuex";
import { GET_PLANTS } from "@/store/modules/plant.module";

export default {
  name: "WrasScreen",
  components: { LuckySheetWrapper },
  data() {
    return {
      wras: [],
      pagination: { currentPage: 1, limit: 10 },
      isViewOpen: false,
      isEditOpen: false,
      isAddOpen: false,
      selectedLine: '-1',
      selectedJob: null,
      form: {
        plant: null,
        shop: null,
        line: null,
        pos: null,
        sop: null
      },
      editForm: {
        plant: null,
        shop: null,
        line: null,
        pos: null,
        sop: null
      },
      isLoading: false,
      modalLoading: false
    };
  },
watch: {
    getJob: function () {
      this.posState = this.jobData
      if (this.jobData.length > 0) {
        console.log(this.jobData[0]);
        this.selectedLine = this.jobData[0].line_id
        this.form.machine_id = this.jobData[0].machine_id
        this.form.pos_id = this.jobData[0].pos_id
        this.form.job_nm = this.jobData[0].job_nm
        this.form.job_type_id = this.jobData[0].job_type_id
        this.form.job_no = this.jobData[0].job_no
        this.embedFile = `${process.env.VUE_APP_URL}/file?path=${this.jobData[0].attachment}`
      }
    },
    selectedLine: async function () {
      await this.getPos({ line_id: this.selectedLine })
      // await this.getUser()
    },
    ['form.pos_id']: function () {
      if (this.form.pos_id) this.getJob({ pos_id: this.form.pos_id })
    },
    ['form.shop']: function () {
      console.log(this.form.shop)
      if (this.form.shop) this.getLines({shop_id: this.form.shop})
    },
    ['form.line']: function () {
      console.log(this.form.line)
      if (this.form.line) this.getPos({line_id: this.form.line})
    },
   ['form.pos']: function () {
      console.log(this.form.pos)
      if (this.form.pos) this.getJobType({pos_id: this.form.pos})
    },
    // Watchers for editForm
    ['editForm.shop']: function () {
      if (this.editForm.shop) this.getLines({shop_id: this.editForm.shop})
    },
    ['editForm.line']: function () {
      if (this.editForm.line) this.getPos({line_id: this.editForm.line})
    },
    ['editForm.pos']: function () {
      if (this.editForm.pos) this.getJobType({pos_id: this.editForm.pos})
    },
  },

  computed: {
    getPlantNm() {
      if (this.form.plant) {
        const found = this.getPlantsOptsWithoutAll.find(item => item.id == this.form.plant);
        return found ? found.text : '';
      }
      return '';
    },
    getLineNm() {
      if (this.form.line) {
        const found = this.getLinesOptsWithoutAll.find(item => item.id == this.form.line);
        return found ? found.text : '';
      }
      return '';
    },
    getShopNm() {
      if (this.form.shop) {
        const found = this.getShopsOptsWithoutAll.find(item => item.id == this.form.shop);
        return found ? found.text : '';
      }
      return '';
    },
    getSopNm() {
      if (this.form.sop) {
        const found = this.getJobOpts.find(item => item.id == this.form.sop);
        return found ? found.text : '';
      }
      return '';
    },
    // Computed properties for Edit form
    getEditPlantNm() {
      if (this.editForm.plant) {
        const found = this.getPlantsOptsWithoutAll.find(item => item.id == this.editForm.plant);
        return found ? found.text : '';
      }
      return '';
    },
    getEditLineNm() {
      if (this.editForm.line) {
        const found = this.getLinesOptsWithoutAll.find(item => item.id == this.editForm.line);
        return found ? found.text : '';
      }
      return '';
    },
    getEditShopNm() {
      if (this.editForm.shop) {
        const found = this.getShopsOptsWithoutAll.find(item => item.id == this.editForm.shop);
        return found ? found.text : '';
      }
      return '';
    },
    getEditSopNm() {
      if (this.editForm.sop) {
        const found = this.getJobOpts.find(item => item.id == this.editForm.sop);
        return found ? found.text : '';
      }
      return '';
    },
    ...mapGetters([
      'getJobOpts',
      'getLinesOptsWithoutAll',
      'getShopsOptsWithoutAll',
      'getZoneOpts',
      'getKanbansOpts',
      'getPosOptsWithoutAll',
      'getPlantsOptsWithoutAll'
    ]),
  },

  methods: {
    async getShops() {
      this.isLoading = true;
      try {
        await this.$store.dispatch(GET_SHOPS);
      } finally {
        this.isLoading = false;
      }
    },
    async getPos(query = null) {
      this.isLoading = true;
      try {
        await this.$store.dispatch(GET_POS, query);
      } finally {
        this.isLoading = false;
      }
    },
    async getLines(query = null) {
      this.isLoading = true;
      try {
        await this.$store.dispatch(GET_LINES, query);
      } finally {
        this.isLoading = false;
      }
    },
    async getJobType(query = null) {
      this.isLoading = true;
      try {
        await this.$store.dispatch(GET_JOB, query);
      } finally {
        this.isLoading = false;
      }
    },
    async getPlant() {
      this.isLoading = true;
      try {
        await this.$store.dispatch(GET_PLANTS);
      } finally {
        this.isLoading = false;
      }
    },
    openAddModal() {
      this.form = {
        plant: null,
        shop: null,
        line: null,
        pos: null,
        sop: null
      };
      this.isAddOpen = true;
    },
    async getWras() {
      this.isLoading = true;
      try {
        const res = await this.$store.dispatch(GET_WRAS, {
          page: this.pagination.currentPage,
          limit: this.pagination.limit,
        });
        
        const rawData = Array.isArray(res) ? res : res?.data || [];

        this.wras = rawData.map((item) => {
          let parsedFile;
          try {
            parsedFile = JSON.parse(item.file);
          } catch (e) {
            parsedFile = item.file;
          }
          return { ...item, file: parsedFile };
        });
      } catch (err) {
        console.error("Gagal ambil data WRAS:", err);
      } finally {
        this.isLoading = false;
      }
    },

    handleView(wras) {
      this.modalLoading = true;
      this.selectedJob = { ...wras };
      this.isViewOpen = true;
      
      // Allow time for Luckysheet to initialize
      setTimeout(() => {
        this.modalLoading = false;
      }, 500);
    },

    handleEdit(wras) {
      this.modalLoading = true;
      this.selectedJob = { ...wras };
      
      // Populate editForm with existing values from API data
      this.editForm = {
        plant: wras.plant || null,
        shop: wras.shop || null,
        line: wras.line || null,
        pos: wras.pos || null,
        sop: wras.job || null
      };
      
      this.isEditOpen = true;
      
      // Allow time for Luckysheet and dropdowns to initialize
      setTimeout(() => {
        this.modalLoading = false;
      }, 500);
    },

    async saveEdit() {
      this.isLoading = true;
      try {
        await this.$nextTick();
        const sheetApi = this.$refs.luckysheetEdit.sheetApi();
        
        // Update Luckysheet cells with new values from editForm
        sheetApi.setCellValue(1, 3, `:${this.getEditPlantNm}`);
        sheetApi.setCellValue(3, 3, `:${this.getEditShopNm} / ${this.getEditLineNm}`);
        sheetApi.setCellValue(5, 4, `:${this.getEditSopNm}`);
        
        const allData = sheetApi.getAllSheets();

        if (!allData || allData.length === 0) {
          console.error("Tidak bisa ambil data dari Luckysheet");
          return;
        }

        const payload = { 
          ...this.editForm,
          file: JSON.stringify(allData) 
        };

        await this.$store.dispatch(PUT_WRAS, {
          id: this.selectedJob.wras_id,
          data: payload,
        });

        this.isEditOpen = false;
        await this.getWras();
      } catch (err) {
        console.error("Gagal update WRAS:", err);
      } finally {
        this.isLoading = false;
      }
}




,
    saveAdd() {
      try {
        console.log("DEBUG saveAdd - Form:", this.form);
        console.log("DEBUG saveAdd - PlantNm:", this.getPlantNm);
        console.log("DEBUG saveAdd - ShopNm:", this.getShopNm);
        console.log("DEBUG saveAdd - LineNm:", this.getLineNm);
        console.log("DEBUG saveAdd - SopNm:", this.getSopNm);

        const sheetApi = this.$refs.luckysheetAdd.sheetApi();

    // set value ke cell
sheetApi.setCellValue(1, 3, `:${this.getPlantNm}`);
sheetApi.setCellValue(3, 3, `:${this.getShopNm} / ${this.getLineNm}`);
sheetApi.setCellValue(5, 4, `:${this.getSopNm}`);
    

    // ambil semua data sheet
    const allData = sheetApi.getAllSheets();
    console.log("All sheets:", allData);
     const payload = {
      ...this.form,
      file: JSON.stringify(allData),
    };
this.$store.dispatch(POST_WRAS, payload);

    this.isAddOpen = false;
   this.getWras();
  } catch (err) {
    console.error("Gagal tambah WRAS:", err);
  }
}

,

    async deleteWras(id) {
      try {

        await this.$store.dispatch(DELETE_WRAS, id.wras_id);

        // refresh list
        await this.getWras();
   
      } catch (err) {
        console.error("Gagal hapus WRAS:", err);
        this.$toast.error("Gagal hapus WRAS");
      }
    },

 
  },
  async mounted() {
    
    this.getWras();
    this.isLoading=true
    await this.getLines()
    await this.getShops()
    await this.getPos()
    await this.getJobType()
    await this.getPlant()
      if (this.$route.query.id) {
      this.isUpdate = true
      this.$store.dispatch(GET_JOB, { id: this.$route.query.id })
      }

  },
};
</script>
