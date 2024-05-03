<template>
  <div>
    <div class="card-header d-flex flex-column">
      <div class="d-flex justify-content-between">
        <h4>List temuan</h4>
      </div>
      <div class="d-flex align-items-center justify-content-between my-3">
        <div class="d-flex flex-column">
          <h6 class="">Progress</h6>
          <table class="borderless" border="0">
            <tr>
              <th><img src="@/../public/tanoko/0.png" width="25" height="25"></th>
              <th>&nbsp;</th>
              <th>Order Part</th>
              <th>&nbsp;</th>
              <th><img src="@/../public/tanoko/1.png" width="25" height="25"></th>
              <th>&nbsp;</th>
              <th>Countermeasure</th>
              <th>&nbsp;</th>
              <th><img src="@/../public/tanoko/2.png" width="25" height="25"></th>
              <th>&nbsp;</th>
              <th>Monitor / Follow</th>
              <th>&nbsp;</th>
              <th><img src="@/../public/tanoko/3.png" width="25" height="25"></th>
              <th>&nbsp;</th>
              <th>Finish</th>
            </tr>
          </table>
        </div>
        <div class="d-flex flex-grow-1 ">
        </div>
        <div class="d-flex flex-column">
          <h6 class="">Priority</h6>
          <table class="borderless">
            <tr>
              <template v-for="value in priorities" :key="value">
                <th>
                  <span class="circle">
                    {{ value.id }}
                  </span>
                </th>
                <th>=</th>
                <th>{{ value.text }}</th>
                <th>&nbsp;</th>
              </template>
            </tr>
          </table>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div></div>
        <div class="mx-2 d-flex align-items-center">
          <div class="d-flex align-items-center">
            <div style="
                  background-color: transparent;
                  width: 20px;
                  height: 20px;
                  border: 2px dotted black;
                "></div>
            <span class="mx-2">Plan</span>
          </div>
          <div class="d-flex align-items-center">
            <div style="
                  background-color: transparent;
                  width: 20px;
                  height: 20px;
                  border: 2px solid black;
                "></div>
            <span class="mx-2">Actual</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body p-0 overflow-x-auto">
      <div class="card-body p-0">
        <div class="tableFixHead">
          <table class="table table-hover">
            <thead class="text-center aling-middle">
              <tr>
                <th id="fixCol-1" rowspan="2">No</th>
                <th id="fixCol-2" rowspan="2">Card No</th>
                <th id="fixCol-3" rowspan="2">Date</th>
                <th id="fixCol-4" rowspan="2">M/C No.</th>
                <th id="fixCol-5" rowspan="2">Problem Contents / Defect</th>
                <th id="fixCol-6" rowspan="2">Priority</th>
                <th rowspan="2">Checker Penemu</th>
                <th rowspan="2">L/H Sign</th>
                <th rowspan="2">Countermeasure Request Content</th>
                <th rowspan="2">Request To</th>
                <th colspan="4">Jan</th>
                <th colspan="4">Feb</th>
                <th colspan="4">March</th>
                <th colspan="4">Apr</th>
                <th colspan="4">May</th>
                <th colspan="4">June</th>
                <th colspan="4">July</th>
                <th colspan="4">Aug</th>
                <th colspan="4">Sept</th>
                <th colspan="4">Oct</th>
                <th colspan="4">Nov</th>
                <th colspan="4">Dec</th>
                <th rowspan="2">Progress</th>
                <th rowspan="2">L/H Sign</th>
                <th rowspan="2">S/H Sign</th>
                <th rowspan="2" colspan="2">Actions</th>
              </tr>
              <tr>
                <th width="100">I</th>
                <th width="100">II</th>
                <th width="100">III</th>
                <th class="week">IV</th>
                <th width="100">I</th>
                <th width="100">II</th>
                <th width="100">III</th>
                <th class="week">IV</th>
                <th width="100">I</th>
                <th width="100">II</th>
                <th width="100">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
                <th class="week">I</th>
                <th class="week">II</th>
                <th class="week">III</th>
                <th class="week">IV</th>
              </tr>
            </thead>
            <tbody class="align-middle">
              <template v-if="getOmIsLoadingFindingList">
                <tr>
                  <td colspan="62" class="p-0" style="height: 200px">
                    <div class="vl-parent p-0" style="height: 100%">
                      <Loading :active="true" :can-cancel="true" :is-full-page="false" />
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else-if="getOmFindings?.length > 0">
                <tr v-for=" (finding, findingIndex) in getOmFindings" :key="`itm-${findingIndex}`">
                  <td id="fixCol-1">{{ findingIndex + 1 }}</td>
                  <td id="fixCol-2">{{ finding.card_no }}</td>
                  <td id="fixCol-3">{{ finding.finding_date }}</td>
                  <td id="fixCol-4">{{ finding.machine_nm }}</td>
                  <td id="fixCol-5">{{ finding.finding_desc }}</td>
                  <td id="fixCol-6" class="text-center">
                    {{ finding.priority_num }}
                  </td>
                  <td class="text-center">
                    {{ finding.finding_pic_nm }}
                  </td>
                  <td class="text-center align-middle">
                    <input v-if="finding.finding_sign_lh" type="image" :src="finding.finding_sign_lh" alt=""
                      width="200" />
                  </td>
                  <td>
                    {{ finding.plan_cm_desc }}
                  </td>
                  <td class="text-center">
                    {{ finding.dept }}
                  </td>
                  <td v-for="item in totalDate" :key="item.idx" style="min-width: 30px">
                    <div v-if="item == finding.week_plan - 1"
                      style="width: 20px; height: 20px; border: 2px dotted #64748b; background-color: #bbf7d0">
                    </div>
                    <div v-if="item == finding.week_actual - 1" class="mt-2"
                      style="width: 20px; height: 20px; border: 2px solid #64748b; background-color: #bbf7d0">
                    </div>
                  </td>
                  <td class="text-center align-middle">
                    <img v-if="finding.progress_num - 1 >= 0" :src="progressNumImg(finding.progress_num)"
                      :alt="progressNumImg(finding.progress_num)" width="30" height="30">
                  </td>
                  <td class="text-center align-middle">
                    <input v-if="finding.cm_sign_lh" type="image" :src="finding.cm_sign_lh" alt="" width="200" />
                  </td>
                  <td class="text-center align-middle">
                    <input v-if="finding.cm_sign_sh" type="image" :src="finding.cm_sign_sh" alt="" width="200" />
                  </td>
                  <td>
                    <div class="d-flex">
                      <button v-if="finding.finding_img" class="btn btn-info btn-sm text-white w-full my-1 mx-1"
                        @click="showModalFindingImage(finding)">
                        Finding image
                      </button>
                      <button v-else class="btn btn-secondary btn-sm" disabled>
                        No Image
                      </button>
                      <button class="btn btn-info btn-sm text-white mx-2"
                        @click="showModalFormFinding(finding)">Edit</button>
                      <button class="btn btn-warning btn-sm text-white"
                        @click="deleteFinding(finding.finding_id)">Delete</button>
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="80" class="text-center">
                    <div class="alert alert-danger w-full" role="alert">
                      Data not found!
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { GET_SYSTEMS } from '@/store/modules/system.module'
import { GET_OM_FINDING_DETAIL } from '@/store/modules/omFinding.module'
import ApiService from '@/store/api.service'
import Swal from 'sweetalert2'
import Loading from 'vue-loading-overlay'

export default {
  name: "TableOmFinding",
  props: {

  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Loading
  },
  data() {
    return {
      totalDate: 48,
      priorities: null,
    }
  },
  methods: {
    progressNumImg(progressNum) {
      console.log('====================================');
      console.log('progressNum', progressNum - 1);
      console.log('====================================');
      return `./tanoko/${progressNum - 1}.png`
    },
    async getOptSystems(type, id = null, textHandler = null) {
      try {
        const response = await this.$store.dispatch(GET_SYSTEMS, {
          system_type: type
        })

        return response.map((item) => {
          return {
            id: id ? item[id] : item.id,
            text: textHandler ? textHandler(item) : item.system_value
          }
        })
      }
      catch (error) {
        if (error.response.status == 401) this.$router.push('/login')
        console.log(error)
        return []
      }
    },
    async deleteFinding(findingID) {
      Swal.fire({
        title: 'Are you sure to delete this Finding?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Sure',
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          ApiService.setHeader()
          const deleteData = ApiService.delete(`operational/om/finding/delete/${findingID}`)

          if (deleteData) {
            Swal.fire('Data deleted!', '', 'success')
            this.$emit('refreshDeleted', true)
          } else {
            Swal.fire('Error', '', 'warning')
          }
        } else if (result.isDenied) {
          Swal.fire('Canceled', '', 'info')
        }
      })

    },
    showModalFormFinding(finding) {
      this.$store.dispatch(GET_OM_FINDING_DETAIL, finding)
      this.$emit('showFormModalOmFinding', true)
    },
    showModalFindingImage(finding) {
      this.$emit('showModalFindingImage', finding.finding_img)
    }
  },
  computed: {
    ...mapGetters([
      'getOmFindings',
      'getOmIsLoadingFindingList'
    ]),
  },
  watch: {
    getOmFindings: {
      handler() {
        //console.log('getOmFindings', this.getOmFindings);
      }
    }
  },
  mounted() {
    this.getOptSystems('OM_PRIORITY', 'system_value', (item) => `${item.system_desc}`)
      .then((r) => this.priorities = r)
  }
}
</script>
<style scoped>
.borderless td,
.borderless th {
  border: none;
  border-style: hidden !important;
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  padding: 2px;
}

.circle {
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  background: grey;
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  border-radius: 50%;
  text-align: center;
  font-size: 0.8em;
}

.no-border {
  border: none !important;
}

.tableFixHead {
  overflow: auto;
  height: 100%;
}

.tableFixHead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

#fixCol-1 {
  position: sticky;
  width: 40px;
  top: 0px;
  left: 0px;
  z-index: 999;
  background-color: white;
}

#fixCol-2 {
  position: sticky;
  top: 0px;
  min-width: 100px;
  width: 100px;
  left: 38px;
  z-index: 999;
  background-color: white;
}

#fixCol-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 138px;
  z-index: 999;
  background-color: white;
}

#fixCol-4 {
  position: sticky;
  top: 0px;
  left: 260px;
  z-index: 999;
  min-width: 100px;
  background-color: white;
}

#fixCol-5 {
  min-width: 250px;
  position: sticky;
  top: 0px;
  left: 360px;
  z-index: 999;
  background-color: white;
}

#fixCol-6 {
  position: sticky;
  top: 0px;
  left: 610px;
  min-width: 150px;
  z-index: 999;
  background-color: white;
}
</style>
