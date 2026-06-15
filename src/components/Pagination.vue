<template>
  <div class="card-footer bg-white py-3 border-top">
    <div class="d-flex justify-content-between align-items-center">
      <!-- Limit dropdown on the left -->
      <div>
        <div class="input-group input-group-sm">
          <span class="input-group-text bg-light text-secondary border-end-0">Limit</span>
          <select class="form-select border-start-0" v-model="selectedLimit" @change="onPageChangeLimitClick" style="width: 75px;">
            <option v-for="limit in limitOpts" :key="limit.label" :value="limit.vals">
              {{ limit.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Pagination buttons on the right -->
      <div class="overflow-auto">
        <nav aria-label="Page navigation">
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="onPageChangeClick(currentPage - 1, 'prev')" :disabled="currentPage === 1">
                Previous
              </button>
            </li>
            <li v-for="page in pages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <button class="page-link" @click="onPageChangeClick(page, 'fromnumber')">
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPage || totalPage === 0 }">
              <button class="page-link" @click="onPageChangeClick(currentPage + 1, 'next')" :disabled="currentPage === totalPage || totalPage === 0">
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 3,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    perPage: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    totalPage: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      selectedLimit: 10,
      limitOpts: [
        {
          label: 5,
          vals: 5,
        },
        {
          label: 10,
          vals: 10,
        },
        {
          label: 100,
          vals: 100,
        },
        {
          label: 'All',
          vals: -1,
        },
      ],
      selectedPage: 1,
    }
  },
  watch: {
    selectedPage(newVal) {
      this.$emit('changePage', newVal, 'fromnumber')
    },
    currentPage(newVal) {
      this.selectedPage = newVal
    },
    perPage(newVal) {
      if (newVal === 100000 || newVal === -1) {
        this.selectedLimit = -1
      } else {
        this.selectedLimit = newVal
      }
    }
  },
  created() {
    this.selectedPage = this.currentPage
    if (this.perPage === 100000 || this.perPage === -1) {
      this.selectedLimit = -1
    } else {
      this.selectedLimit = this.perPage
    }
  },
  computed: {
    pages() {
      const range = [];
      const start = Math.max(1, this.currentPage - 2);
      const end = Math.min(this.totalPage, this.currentPage + 2);
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      return range;
    }
  },
  methods: {
    onPageChangeClick(page, type) {
      this.$emit('changePage', page, type)
    },
    onPageChangeLimitClick() {
      this.$emit('changeLimit', this.selectedLimit)
    },
  },
}
</script>

<style scoped>
.page-item.active .page-link {
  background-color: #1e3a5f; /* Deep Navy blue color */
  border-color: #1e3a5f;
  color: white !important;
}
.page-link {
  color: #1e3a5f;
  cursor: pointer;
}
.page-item.disabled .page-link {
  color: #6c757d;
  cursor: not-allowed;
  background-color: #fff;
  border-color: #dee2e6;
}
</style>

