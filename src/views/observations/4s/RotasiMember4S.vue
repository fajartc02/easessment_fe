<template>
  <div>
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Filter Rotasi Member 4S</h5>
      </div>
      <div class="card-body">
        <div class="row align-items-end">
          <div class="col-md-3">
            <label class="form-label">Line</label>
            <select class="form-select" v-model="selectedLine">
              <option value="" disabled>Select Line</option>
              <option v-for="line in getLinesOpts" :key="line.id" :value="line.id">
                {{ line.text }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Shift / Group</label>
            <select class="form-select" v-model="selectedGroup">
              <option value="" disabled>Select Group</option>
              <option v-for="group in getGroupsOptsWithoutAll" :key="group.id" :value="group.id">
                {{ group.text }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Tahun</label>
            <select class="form-select" v-model="selectedYear">
              <option v-for="yr in years" :key="yr" :value="yr">
                {{ yr }}
              </option>
            </select>
          </div>
          <div class="col-md-3 d-flex gap-2">
            <button class="btn btn-primary" @click="fetchRotations" :disabled="isLoading || !selectedLine || !selectedGroup">
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
              Search
            </button>
            <button class="btn btn-success text-white" @click="exportToExcel" :disabled="isLoading || rotations.length === 0">
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card" v-if="rotations.length > 0">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Matrix Rotasi Member 4S - {{ selectedYear }}</h5>
        <button class="btn btn-info text-white" @click="saveRotations" :disabled="isSaving">
          <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
          Save Mappings
        </button>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-bordered table-striped align-middle text-center mb-0">
            <thead class="table-dark">
              <tr>
                <th rowspan="2" class="align-middle sticky-col-1">No</th>
                <th rowspan="2" class="align-middle sticky-col-2">Zone</th>
                <th rowspan="2" class="align-middle sticky-col-3">Kanban</th>
                <th rowspan="2" class="align-middle sticky-col-4">Area</th>
                <th rowspan="2" class="align-middle sticky-col-5">Frek</th>
                <th colspan="12">Bulan</th>
              </tr>
              <tr>
                <th v-for="m in months" :key="m">{{ m }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in rotations" :key="row.kanban_id">
                <td class="sticky-col-1">{{ idx + 1 }}</td>
                <td class="sticky-col-2">{{ row.zone_nm }}</td>
                <td class="sticky-col-3" :style="{ backgroundColor: row.color || '#ffffff' }"><strong>{{ row.kanban_no }}</strong></td>
                <td class="sticky-col-4 text-start">{{ row.area_nm }}</td>
                <td class="sticky-col-5">{{ row.freq_nm }}</td>
                 <td v-for="mIdx in 12" :key="mIdx" style="min-width: 140px; padding: 4px; position: relative;">
                   <div class="position-relative w-100">
                     <select 
                       class="form-select form-select-sm text-transparent" 
                       style="color: transparent !important;"
                       v-model="row['month_' + mIdx + '_pic_id']"
                     >
                       <option :value="null" class="text-dark">- Select PIC -</option>
                       <option v-for="user in userOptions" :key="user.id" :value="user.id" class="text-dark">
                         {{ user.text }}
                       </option>
                     </select>
                     <div 
                       class="position-absolute top-50 translate-middle-y start-0 ps-2 pe-4 w-100 text-start text-truncate" 
                       style="pointer-events: none; font-size: 0.825rem; font-weight: 500;"
                     >
                       {{ getSelectedUserName(row['month_' + mIdx + '_pic_id']) }}
                     </div>
                   </div>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="text-center py-5 text-muted" v-else-if="hasSearched && !isLoading">
      No Kanban items found for the selected Line and Group.
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'
import ApiService from '@/store/api.service'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { GET_LINES } from "@/store/modules/line.module"
import { GET_GROUP } from "@/store/modules/group.module"
import { GET_USERS } from "@/store/modules/user.module"
import axios from 'axios'
import JwtService from '@/store/jwt.service'

export default defineComponent({
  name: 'RotasiMember4S',
  data() {
    const currentYear = new Date().getFullYear();
    return {
      selectedLine: '',
      selectedGroup: '',
      selectedYear: currentYear,
      years: [currentYear - 1, currentYear, currentYear + 1, currentYear + 2],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      rotations: [],
      isLoading: false,
      isSaving: false,
      hasSearched: false,
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts', 'getGroupsOptsWithoutAll', 'getUsersOpts']),
    userOptions() {
      // Map user list to dropdown format (id, text)
      if (!this.getUsersOpts) return [];
      return this.getUsersOpts
        .filter(u => u.id !== '-1' && u.id !== '')
        .map(u => ({
          id: u.id,
          text: u.text || u.fullname
        }));
    }
  },
  mounted() {
    // Fetch default lists if they aren't loaded yet
    if (!this.getLinesOpts || this.getLinesOpts.length <= 1) {
      this.$store.dispatch(GET_LINES);
    }
    if (!this.getGroupsOptsWithoutAll || this.getGroupsOptsWithoutAll.length === 0) {
      this.$store.dispatch(GET_GROUP);
    }
    if (!this.getUsersOpts || this.getUsersOpts.length <= 1) {
      this.$store.dispatch(GET_USERS);
    }
  },
  methods: {
    async fetchRotations() {
      if (!this.selectedLine || !this.selectedGroup) return;
      this.isLoading = true;
      this.hasSearched = true;
      try {
        ApiService.setHeader();
        const response = await ApiService.query('/operational/4s/member-rotation', {
          line_uuid: this.selectedLine,
          group_uuid: this.selectedGroup,
          year: this.selectedYear
        });
        if (response.data && response.data.status) {
          const list = response.data.data.list || [];
          
          // Sort items by frequency to match template style (Daily first, Weekly second, Monthly last)
          const daily = list.filter(s => (s.freq_nm || "").toLowerCase().includes("day"));
          const weekly = list.filter(s => (s.freq_nm || "").toLowerCase().includes("week"));
          const monthly = list.filter(s => {
            const fn = (s.freq_nm || "").toLowerCase();
            return !fn.includes("day") && !fn.includes("week");
          });
          
          this.rotations = [...daily, ...weekly, ...monthly];
        } else {
          toast.error("Failed to load rotations");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error connecting to server");
      } finally {
        this.isLoading = false;
      }
    },
    async saveRotations() {
      this.isSaving = true;
      try {
        ApiService.setHeader();
        const payload = {
          rotations: this.rotations.map(r => {
            const rot = { kanban_id: r.kanban_id };
            for (let m = 1; m <= 12; m++) {
              rot[`month_${m}_pic_id`] = r[`month_${m}_pic_id`];
            }
            return rot;
          })
        };
        const response = await ApiService.put(
          `/operational/4s/member-rotation?line_uuid=${this.selectedLine}&group_uuid=${this.selectedGroup}&year=${this.selectedYear}`,
          payload
        );
        if (response.data && response.data.status) {
          toast.success("Rotation mappings saved successfully!");
          await this.fetchRotations();
        } else {
          toast.error("Failed to save rotations");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error saving configuration");
      } finally {
        this.isSaving = false;
      }
    },
    async exportToExcel() {
      if (!this.selectedLine || !this.selectedGroup) return;
      this.isLoading = true;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_URL}/operational/4s/member-rotation/export`,
          {
            params: {
              line_uuid: this.selectedLine,
              group_uuid: this.selectedGroup,
              year: this.selectedYear
            },
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${JwtService.getToken()}`
            }
          }
        );
        
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        
        let filename = 'Schedule_Rotasi_PIC_4S.xlsx';
        const disposition = response.headers['content-disposition'];
        if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches != null && matches[1]) { 
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(err);
        toast.error("Failed to export Excel");
      } finally {
        this.isLoading = false;
      }
    },
    getFreqStyle(freq) {
      if (!freq) return {};
      const f = freq.toLowerCase();
      if (f.includes('day')) {
        return { backgroundColor: '#2eb85c' }; // Green
      } else if (f.includes('week')) {
        return { backgroundColor: '#e55353' }; // Red/Pink (Matching schedule4s delay/problem color)
      } else {
        return { backgroundColor: '#39f' }; // Blue
      }
    },
    getSelectedUserName(id) {
      if (!id) return '- Select PIC -';
      if (!this.getUsersOpts) return '- Select PIC -';
      const user = this.getUsersOpts.find(u => u.id === id);
      if (user && user.text) {
        const parts = user.text.split('-');
        if (parts.length > 1) {
          return parts.slice(1).join('-');
        }
        return user.text;
      }
      return '- Select PIC -';
    }
  }
})
</script>

<style scoped>
.table th, .table td {
  vertical-align: middle;
}

.sticky-col-1 {
  position: sticky;
  left: 0px;
  width: 38px;
  min-width: 38px;
  background-color: white !important;
  z-index: 5;
}
.sticky-col-2 {
  position: sticky;
  left: 37px;
  width: 100px;
  min-width: 100px;
  background-color: white !important;
  z-index: 5;
}
.sticky-col-3 {
  position: sticky;
  left: 137px;
  width: 120px;
  min-width: 120px;
  z-index: 5;
}
.sticky-col-4 {
  position: sticky;
  left: 257px;
  width: 200px;
  min-width: 200px;
  background-color: white !important;
  z-index: 5;
}
.sticky-col-5 {
  position: sticky;
  left: 457px;
  width: 100px;
  min-width: 100px;
  background-color: white !important;
  z-index: 5;
}

thead th.sticky-col-1,
thead th.sticky-col-2,
thead th.sticky-col-3,
thead th.sticky-col-4,
thead th.sticky-col-5 {
  background-color: #3c4b64 !important;
  z-index: 10 !important;
  color: white !important;
}

tbody td.sticky-col-1,
tbody td.sticky-col-2,
tbody td.sticky-col-3,
tbody td.sticky-col-4,
tbody td.sticky-col-5 {
  border-right: 1px solid #dee2e6 !important;
}
</style>
