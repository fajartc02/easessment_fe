<template>
  <div>
    <div class="card mb-3">
      <div class="card-header d-flex align-items-center">
        <h6>Add list temuan</h6>
      </div>
      <div class="card-body">
        <div>
          <div class="mb-2">
            <label class="mb-1">Source Category (pake ID category)</label>
            <input type="text" class="form-control" disabled />
          </div>
          <div class="mb-2">
            <label class="mb-1">Tanggal temuan</label>
            <input type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Pos</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Temuan problem</label>
            <textarea cols="30" rows="5" class="form-control"></textarea>
          </div>
          <div class="mb-2">
            <label class="mb-1">Rencana perbaikan</label>
            <textarea cols="30" rows="5" class="form-control"></textarea>
          </div>
          <div class="mb-2">
            <label class="mb-1">Priority</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Stop 6
              <span class="badge rounded-pill bg-primary text-white">Safety</span></label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Rank WRAS
              <span class="badge rounded-pill bg-primary text-white">Safety</span>
            </label>
            <input type="text" class="form-control" />
          </div>
          <div class="row mb-2">
            <div class="col">
              <label class="mb-1">SOP/EIS
                <span class="badge rounded-pill bg-primary text-white">Method</span>
              </label>
              <input type="text" class="form-control" />
            </div>
            <div class="col">
              <label class="mb-1">TSKK
                <span class="badge rounded-pill bg-primary text-white">Man</span>
              </label>
              <input type="text" class="form-control" />
            </div>
            <div class="col">
              <label class="mb-1">TSK
                <span class="badge rounded-pill bg-primary text-white">Man</span>
              </label>
              <input type="text" class="form-control" />
            </div>
          </div>
          <div class="mb-2">
            <label class="mb-1">PCI/ECI
              <span class="badge rounded-pill bg-primary text-white">Material</span>
            </label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">MT/KZ/ENG
              <span class="badge rounded-pill bg-primary text-white">Machine</span>
            </label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">PIC Schedule </label>
            <input type="date" class="form-control" />
          </div>

          <hr />

          <div class="row mb-2">
            <div class="col">
              <label class="mb-1">LH Red </label>
              <input type="text" class="form-control" />
            </div>
            <div class="col">
              <label class="mb-1">LH White </label>
              <input type="text" class="form-control" />
            </div>
            <div class="col">
              <label class="mb-1">SH </label>
              <input type="text" class="form-control" />
            </div>
          </div>
          <div class="mb-2">
            <label class="mb-1">Comments</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Adjusment</label>
            <input type="text" class="form-control" />
          </div>

          <hr />

          <div class="mb-2">
            <label class="mb-1">Factor result</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Plan date training</label>
            <input type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Actual date training</label>
            <input type="date" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Comments</label>
            <input type="text" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Sign upload</label>
            <input type="file" class="form-control" />
          </div>
          <div class="mb-2">
            <label class="mb-1">Kaizen report upload</label>
            <input type="file" class="form-control" />
          </div>
          <div class="mb-2 mt-5">
            <button class="btn btn-info text-white">Submit data</button>
          </div>

          <!-- <div class="mb-2">
            <label class="mb-1">PIC</label>
            <VueMultiselect v-model="selectedPIC" :options="picData">
            </VueMultiselect>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'List Temuan Add',
  data() {
    return {}
  },
  components: {},
}
</script>


<style src="vue-multiselect/dist/vue-multiselect.css"></style>
