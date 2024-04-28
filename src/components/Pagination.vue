<template>
  <div class="card-footer">
    <div class="d-flex justify-content-between">
      <div>
        <label>Total data</label>
        <select class="form-control mt-1" v-model="selectedLimit" @change="onPageChangeLimitClick">
          <option v-for="limit in limitOpts" :key="limit.label" :value="limit.vals">
            {{ limit.label }}
          </option>
        </select>
      </div>
      <div class="overflow-auto">
        <label class="mx-2">Page {{ currentPage }}</label>
        <nav aria-label="Page navigation example" class="mt-1 px-2">
          <ul class="pagination">
            <li class="page-item">
              <button class="page-link text-black" :disabled="totalPage == 1 || currentPage == 1"
                :style="`${totalPage == 1 ? 'background-color: #fff;' : ''}`" @click="onPageChangeClick(-1, 'prev')">
                Prev
              </button>
            </li>
            <li v-for="n in totalPage" :key="n" class="page-item">
              <button class="page-link" @click="onPageChangeClick(n, 'fromnumber')" :disabled="n == currentPage"
                :style="`${n == currentPage ? 'background-color: #eaeaea;' : ''}`">
                {{ n }}
              </button>
            </li>
            <li class="page-item">
              <button class="page-link text-black" :style="`${totalPage == 1 ? 'background-color: #fff;' : ''}`"
                :disabled="totalPage == 1 || totalPage == undefined || currentPage == totalPage"
                @click="onPageChangeClick(1, 'next')">
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
    }
  },
  computed: {
    startPage() {
      // When on the first page
      if (this.currentPage === 1) {
        return 1
      }
      // When on the last page
      if (this.currentPage === this.totalPages) {
        return this.totalPages - this.maxVisibleButtons
      }
      // When inbetween
      return this.currentPage - 1
    },
    pages() {
      const range = []

      for (
        let i = this.startPage;
        i <=
        Math.min(this.startPage + this.maxVisibleButtons - 1, this.totalPages);
        i++
      ) {
        range.push({
          name: i,
          isDisabled: i === this.currentPage,
        })
      }

      return range
    },
  },
  methods: {
    onPageChangeClick(page, type) {
      this.$emit('changePage', page, type)
    },
    onPageChangeLimitClick() {
      this.$emit('changeLimit', this.selectedLimit)
    },
    // onClickFirstPage() {
    //   this.$emit('pagechanged', 1)
    // },
    // onClickPreviousPage() {
    //   this.$emit('pagechanged', this.currentPage - 1)
    // },
    // onClickPage(page) {
    //   this.$emit('pagechanged', page)
    // },
    // onClickNextPage() {
    //   this.$emit('pagechanged', this.currentPage + 1)
    // },
    // onClickLastPage() {
    //   this.$emit('pagechanged', this.totalPages)
    // },
  },
}
</script>

<style></style>
