<template>
  <loading v-model:active="isLoading" :can-cancel="true" :is-full-page="true" />
  <div class="card">
    <button class="btn btn-primary" @click="exportToPDF()">Export PDF</button>
  </div>
  <div class="card" id="content-pdf" ref="content">
    <div class="card-header">
      <div class="row">
        <div class="col-10">Checksheet Observasi SW</div>
        <div class="col">

        </div>
      </div>
    </div>
    <div class="card-body" v-if="observation">
      <table class="table">
        <tr>
          <td>
            Nama: <b>{{ observation.member_nm }}</b>
          </td>
          <td>
            Line: <b>{{ observation.line_nm }}</b>
          </td>
          <td>
            Pos: <b>{{ observation.pos_nm }}</b>
          </td>
          <td style="min-width: 300px">
            No SOP: <b>{{ observation.job_no }}</b>
          </td>
          <td>
            Shift: <b>{{ observation.group_nm }}</b>
          </td>
        </tr>
        <tr class="text-center">
          <td :colspan="category.category_nm == 'Quality' ? '' : ''" class="bg-warning" v-for="category in categories"
            :key="category.id">
            {{ category.category_nm }}
          </td>
        </tr>
        <tr>
          <td :colspan="category.category_nm == 'Quality' ? '' : ''" v-for="category in categories" :key="category.id">
            {{ category.category_desc }}
          </td>
        </tr>
      </table>
      <table class="table table-bordered">
        <tr class="bg-dark text-light text-center">
          <th>No</th>
          <th>Category</th>
          <th>Judgment</th>
          <th>Factor</th>
          <th>Findings</th>
          <th>Image</th>
        </tr>
        <tr v-for="(item, i) in categories" :key="i">
          <td class="text-center">{{ i + 1 }}</td>
          <td>{{ item.category_nm }}</td>
          <td>
            <CFormSelect :disabled="isCheck" v-model="item.judgment_id">
              <option>Select Judgment</option>
              <option v-for="judg in judgments" :key="judg.id" :value="judg.id">
                {{ judg.text }}
              </option>
            </CFormSelect>
          </td>
          <td v-if="item.judgment_id == '2e247c66-3e9c-44b6-951a-0a26791ad37d' &&
            item.judgment_id
          ">
            <div>
              {{ item.findings[0]?.factor_nm }}
            </div>
          </td>
          <td v-else></td>
          <td v-if="item.judgment_id == '2e247c66-3e9c-44b6-951a-0a26791ad37d' &&
            item.judgment_id
          ">
            <div>
              {{ item.findings[0]?.finding_desc }}
            </div>
          </td>
          <td v-if="item.judgment_id == '2e247c66-3e9c-44b6-951a-0a26791ad37d' &&
            item.judgment_id
          ">
            <div v-if="item.findings[0]?.finding_img">
              <!-- <input type="image" :src="item.findings[0]?.finding_img" width="200" /> -->
              <img :src="item.findings[0]?.finding_pict" width="100">
            </div>
            <div v-else>no image</div>
          </td>
          <td v-else></td>
        </tr>
      </table>
      <div class="row">
        <div class="col">
          <h5>Comment AM/SH</h5>
          <p>
            <span> Comment AMMGR : {{ observation.comment_ammgr }} </span>
            <br />
            <span> Comment SH : {{ observation.comment_sh }} </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import ApiService from '@/store/api.service'
import moment from 'moment'

import Loading from 'vue-loading-overlay'
export default {
  name: 'ReportObservation',
  data() {
    return {
      observation: null,
      form: {
        actual_check_dt: moment().toISOString().split('T')[0],
      },
      categories: [],
      judgments: [],
      factors: [],
      resultCheck: [],
      isCheck: false,
      xlDemo: false,
      ignoringExport: false,
      isLoading: false
    }
  },
  computed: {

  },
  methods: {
    exportToPDF(nameFile) {
      console.log(nameFile)
      this.ignoringExport = true
      html2pdf(this.$refs.content, {
        margin: 1,
        filename: `REPORT_SW_${this.observation.job_no}_${this.observation.pos_nm}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true, useCORS: true },
        jsPDF: { unit: 'pt', format: 'a3', orientation: 'l' },
        allowTaint: true,
      }).then((pdf) => {
        console.log(pdf)
        // this.$router.go(-1);
        this.ignoringExport = false
        this.dialogLoading = false
      })
    },
    async getDetail() {
      this.isLoading = true
      ApiService.setHeader()
      const detailObser = await ApiService.get(
        `operational/observation/schedule`,
        this.$route.params.id,
      )

      console.log(detailObser)
      this.observation = detailObser.data.data[0]
      let resCheckData = detailObser.data.data[1]
      if (resCheckData.length > 0) this.isCheck = true
      let actualDate = detailObser.data.data[0].actual_check_dt
      this.form.actual_check_dt = actualDate
        ? moment(actualDate).toISOString().split('T')[0]
        : moment().toISOString().split('T')[0]
      this.resultCheck = resCheckData
      if (resCheckData.length > 0) {
        setTimeout(() => {
          if (this.$route.query?.is_back) {
            this.exportToPDF(`REPORT_SW_${this.observation.job_no}_${this.observation.pos_nm}.pdf`);
            this.$router.go(-1);
          }
          this.isLoading = false
        }, 3000)
      }
    },
    async getJudgments() {
      ApiService.setHeader()
      const judgments = await ApiService.get(`master/judgments`)
      // console.log(judgments);
      this.judgments = judgments.data.data
    },
    async getFactors() {
      ApiService.setHeader()
      const factors = await ApiService.get(`master/factors`)
      // console.log(factors);
      this.factors = factors.data.data
    },
    async getBase64ImageFromUrl(imageUrl) {
      var res = await fetch(imageUrl);
      var blob = await res.blob();

      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
          resolve(reader.result);
        }, false);

        reader.onerror = () => {
          return reject(this);
        };
        reader.readAsDataURL(blob);
      })
    },
    async getCategories() {
      ApiService.setHeader()
      const categories = await ApiService.get(`master/categories`)
      const mapCategory = await categories.data.data.map(async (itm, i) => {
        itm.judgment_id = null
        itm.factor_id = null
        itm.findings = null
        if (this.resultCheck.length > 0) {
          let result = this.resultCheck[i]
          itm.judgment_id = result.judgment_id
          itm.factor_id = result.factor_id
          result.findings = await Promise.all(result.findings.map(async finding => {
            finding.finding_pict = await this.getBase64ImageFromUrl(finding.finding_img)
            return finding
          }))
          itm.findings = result.findings
        }
        return itm
      })
      this.categories = await Promise.all(mapCategory)
      await this.getJudgments()
      await this.getFactors()
    },
  },
  components: {
    Loading
  },
  async mounted() {
    console.log(this.$route.params.id)
    await this.getDetail()
    await this.getCategories()
  },
}
</script>

<style scoped>
.table,
th,
td {
  border: 1px solid;
}
</style>
