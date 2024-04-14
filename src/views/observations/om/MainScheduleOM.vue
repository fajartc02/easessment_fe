<template>
  <div class="d-flex flex-row justify-content-between mb-2">
    <div class="flex-column">
      <h4>Main Schedule OM</h4>
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
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
import { mapGetters } from 'vuex';

import 'vue3-toastify/dist/index.css';
import { GET_LINES } from '@/store/modules/line.module';

export default {
  name: 'MainScheduleOM',
  data() {
    return {
      isLoading: false,
      filter: {
        line_id: '-1'
      }
    }
  },
  computed: {
    ...mapGetters(['getLinesOpts']),
  },
  methods: {
    async ActionGetLines() {
      try {
        this.isLoading = true
        await this.$store.dispatch(GET_LINES)
        this.isLoading = false
      } catch (error) {
        toast.error(error.response.data.message, {
          autoClose: 1000
        })
      }
    }
  },
  async mounted() {
    await this.ActionGetLines()
  }
}
</script>
