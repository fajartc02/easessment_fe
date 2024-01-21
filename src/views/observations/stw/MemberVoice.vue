<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex row align-items-center">
          <div class="col-10">
              Member Voice
          </div>
          <div class="col">
            <button class="btn btn-success" @click="this.$router.push('/stw/member-voice/add')">
              Member Voice
              <CIcon
                  icon="cil-plus"
                  size="sm"
              />
            </button>
          </div>
      </div>
    </div>
    <div class="card-body overflow-auto">
      <table class="table table-bordered table-stripped">
        <thead class="text-center">
          <tr>
            <th rowspan="3">No</th>
            <th rowspan="3">Tanggal</th>
            <th rowspan="3">Lokasi</th>
            <th rowspan="3">Problem</th>
            <th rowspan="3">No Proses</th>
            <th rowspan="3">Kategori</th>
            <th rowspan="3">Penanggulangan</th>
            <th rowspan="3">Evaluasi Hasil</th>
            <th colspan="24">Waktu Pelaksanaan</th>
            <th rowspan="3">PIC</th>
          </tr>
          <tr>
            <th colspan="4">
              Jan
            </th>
            <th colspan="4">
              Feb
            </th>
            <th colspan="4">
              Mar
            </th>
            <th colspan="4">
              Apr
            </th>
            <th colspan="4">
              Mei
            </th>
            <th colspan="4">
              Jun
            </th>
          </tr>
          <tr>
            <th>I</th>
            <th>II</th>
            <th>III</th>
            <th>IV</th>
            <th>I</th>
            <th>II</th>
            <th>III</th>
            <th>IV</th>
            <th>I</th>
            <th>II</th>
            <th>III</th>
            <th>IV</th>
            <th>I</th>
            <th>II</th>
            <th>III</th>
            <th>IV</th>
            <th>I</th>
            <th>II</th>
            <th>III</th>
            <th>IV</th>
            <th>I</th>
            <th>II</th>
            <th>III</th>
            <th>IV</th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MemberVoice'
}
</script>
