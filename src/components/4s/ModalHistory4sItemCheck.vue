<template>
  <CModal backdrop="static" size="lg" :visible="visible" @close="close" aria-labelledby="StaticBackdropExampleLabel"
          alignment="center">
    <CModalHeader>
      <CModalTitle id="StaticBackdropExampleLabel">History Item Check Kanban <span class="fw-bold">{{selectedItemCheck.item_check_nm}}</span></CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="row">
        <div class="col-12 col-md-12">
          <table class="table table-bordered">
            <thead>
            <tr class="tr-centered">
              <th>No.</th>
              <th>Date</th>
              <th>Time</th>
              <th>Kaizen</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="isLoading">
              <td colspan="4">
                <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
                Loading...
              </td>
            </tr>
            <tr class="tr-centered" v-else v-for="(item, index) in histories" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.history_created_dt }}</td>
              <td>{{ item.before_standart_time ?? '-' }}</td>
              <td>
                <span v-if="!item.kaizen_file" class="text-secondary">No Kaizen</span>
                <button v-else class="btn btn-sm "
                        :class="{'btn-primary': item.kaizen_file, 'btn-secondary': !item.kaizen_file}"
                        :disabled="!item.kaizen_file"
                @click="onClickDownloadKaizen(item.kaizen_file)">
                  Download
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CModalBody>
  </CModal>
</template>
<script>
import ApiService from "@/store/api.service";
import { toast } from "vue3-toastify";

export default {
  name: "ModalHistory4sItemCheck",
  props: {
    visible: Boolean,
    selectedItemCheck: {
      type: Object,
      required: true
    }
  },
  components: {},
  data() {
    return {
      isLoading: false,
      histories: []
    };
  },
  mounted() {
  },
  computed: {},
  watch: {
    visible() {
      if (this.visible && this.selectedItemCheck) {
        this.histories = [];
        this.getHistory();
      }
    }
  },
  methods: {
    async getHistory() {
      this.isLoading = true;
      try {
        ApiService.setHeader();
        const result = await ApiService.get(`master/item-check-kanbans/get/history/${this.selectedItemCheck.item_check_kanban_id}`);
        if (result.status === 200) {
          this.histories = result.data.data;
        } else {
          toast.error(result?.response?.data?.message ?? "Failed to load history", {
            autoClose: 10000
          });
        }
      } catch (e) {
        console.error("getHistory()", e);
        toast.error(e, { autoClose: 10000 });
      } finally {
        this.isLoading = false;
      }
    },
    onClickDownloadKaizen(file) {
      window.open(file, "_blank").focus();
    },
    close() {
      this.$emit("close", true);
    }
  }
};
</script>
