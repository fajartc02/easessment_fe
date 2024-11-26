<template>
  <table class="table table-stripped">
    <thead>
    <tr class="text-center">
      <th>No</th>
      <th>Line</th>
      <th>Zone</th>
      <th>Area</th>
      <th>Kanban No</th>
      <th>Frequency</th>
      <th colspan="3">Actions</th>
    </tr>
    </thead>
    <tbody>
    <template v-if="getKanbansWithStatusModal && !isLoading">
      <tr v-for="(kanban, i) in getKanbansWithStatusModal" :key="i">
        <td>
          {{ kanban.no }}
        </td>
        <td>
          {{ kanban.line_nm }}
        </td>
        <td>
          {{ kanban.zone_nm }}
        </td>
        <td>
          {{ kanban.area_nm }}
        </td>
        <td>
          {{ kanban.kanban_no }}
        </td>
        <td>
          {{ kanban.freq_nm }}
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-primary" @click="() => { kanban.status = true }">Kanban</button>
          <CModal :visible="kanban.status" @close="() => { kanban.status = false }" size="lg">
            <CModalBody>
              <KanbanItemCheck :kanban_id="kanban.kanban_id" />
            </CModalBody>
          </CModal>
        </td>

        <td class="text-center">
          <button class="btn btn-sm btn-warning" @click="() => { isVisibleModalEdit = true; selectedKanban = kanban; }">
            Edit
          </button>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-danger" @click="ActionDeleteKanban(kanban.kanban_id)">Delete</button>
        </td>
      </tr>
    </template>
    <template v-else-if="isLoading && getKanbansWithStatusModal?.length != 0">
      <tr>
        <td class="text-center" colspan="9">
          <CSpinner component="span" size="sm" variant="grow" aria-hidden="true" />
          Loading...
        </td>
      </tr>
    </template>
    <template v-else>
      <NoDataTable :colspan="9" />
    </template>
    </tbody>
  </table>
  <CModal backdrop="static" :visible="isVisibleModalEdit"
          @close="() => { isVisibleModalEdit = false; selectedKanban = null; }" clos
          size="xl">
    <CModalHeader>
      <CModalTitle>Edit Kanban</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <KanbanItemCheckEdit v-if="selectedKanban" :kanban_id="selectedKanban.kanban_id" />
    </CModalBody>
  </CModal>
</template>


<script>
import KANBANS_MOCK from "@/mocks/kanban.mock";
import NoDataTable from "./NoDataTable.vue";
import KanbanItemCheck from "../kanban4s/KanbanItemCheck.vue";
import KanbanItemCheckEdit from "../kanban4s/KanbanItemCheckEdit.vue";
import { DELETE_KANBAN, GET_KANBANS } from "@/store/modules/kanban.module";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";

export default {
  name: "TableKanban4s",
  data() {
    return {
      kanbans: [] || KANBANS_MOCK,
      visibleLiveDemo: false,
      setId: null,
      isLoading: false,
      isVisibleModalEdit: false,
      selectedKanban: null
    };
  },
  computed: {
    ...mapGetters(["getKanbans", "getKanbansWithStatusModal"])
  },
  methods: {
    async getKanban() {
      try {
        this.isLoading = true;
        await this.$store.dispatch(GET_KANBANS, this.filter);
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        if (error.response.status == 401) this.$router.push("/login");
      }
    },
    async editKanban(kanban_id) {
      try {
        console.log(kanban_id);

      } catch (error) {
        console.log(error);
        if (error.response.status == 401) this.$router.push("/login");
      }
    },
    async ActionDeleteKanban(kanban_id) {
      try {
        await Swal.fire({
          title: `Apakah kamu yakin ingin menghapus kanban ini?`,
          showCancelButton: true,
          confirmButtonText: "Delete"
        }).then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.isLoading = true;
            this.$store.dispatch(DELETE_KANBAN, kanban_id);
            await this.getKanban();
          }
        });
      } catch (error) {
        console.log(error);
        if (error.response.status == 401) this.$router.push("/login");
      }
    }
  },
  props: {
    filter: {
      type: Object
    }
  },
  components: {
    NoDataTable,
    KanbanItemCheck,
    KanbanItemCheckEdit
  },
  watch: {
    filter: {
      handler() {
        this.getKanban();
      },
      deep: true
    },
    selectedZone() {
      this.getKanban();
    },
    getKanbans() {
      this.kanbans = this.getKanbansWithStatusModal;
    }
  },
  mounted() {
    this.isLoading = true;
    this.getKanban();

    // eslint-disable-next-line no-unused-vars
    this.emitter.on("toggleModalItemCheckEdit", (val) => {
      this.isVisibleModalEdit = val.visible;
    });
  }
};
</script>
