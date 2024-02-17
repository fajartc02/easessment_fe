<template>
  <div class="card-footer">
    <div class="row justify-content-between">
      <div class="col-1">
        <label>Total data</label>
        <select class="form-control" @change="changePageLimit()">
          <option
            v-for="limit in limitOpts"
            :key="limit.label"
            :value="limit.vals"
          >
            {{ limit.label }}
          </option>
        </select>
      </div>
      <div class="col-4 overflow-auto">
        <label>Page </label>
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item">
              <button class="page-link" @click="pageControl(-1)">
                Previous
              </button>
            </li>
            <li class="page-item">
              <button class="page-link" @click="pageControl(1)">Next</button>
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
  data() {
    return {
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
  pageControl() {},
  changePageLimit() {},
}
</script>

<style>
</style>