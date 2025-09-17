<template>
  <thead class="text-center">
    <tr style="position: sticky; top: 0">
      <th id="fixCol-head-1" rowspan="3">No</th>
      <th id="fixCol-head-2" rowspan="3" width="120">Line name</th>
      <th id="fixCol-head-3" rowspan="3">Source</th>
      <th id="fixCol-head-4" rowspan="3" width="120">Tanggal</th>
      <th id="fixCol-head-5" rowspan="3" width="120">Shift</th>
      <th id="fixCol-head-6" rowspan="3" width="180">SOP No</th>
      <th id="fixCol-head-7" rowspan="3" width="180">Pos</th>
      <th id="fixCol-head-8" rowspan="3" width="120">Temuan prob</th>
      <th rowspan="3" width="120">Rencana perbaikan</th>
      <th rowspan="3">priority</th>
      <th>Stop 6</th>
      <th>Rank WRAS</th>
      <th colspan="3">3 slip</th>
      <th rowspan="2">PCI/ECI</th>
      <th rowspan="2">MT/KZ/ENG</th>
      <th rowspan="3">Schedule PIC</th>
      <th rowspan="2" colspan="4">Jan</th>
      <th rowspan="2" colspan="4">Feb</th>
      <th rowspan="2" colspan="4">March</th>
      <th rowspan="2" colspan="4">Apr</th>
      <th rowspan="2" colspan="4">May</th>
      <th rowspan="2" colspan="4">June</th>
      <th rowspan="2" colspan="4">July</th>
      <th rowspan="2" colspan="4">Aug</th>
      <th rowspan="2" colspan="4">Sept</th>
      <th rowspan="2" colspan="4">Oct</th>
      <th rowspan="2" colspan="4">Nov</th>
      <th rowspan="2" colspan="4">Dec</th>
      <th rowspan="3" class="px-2">LH Red sign</th>
      <th rowspan="3" class="px-2">LH White sign</th>
      <th rowspan="3" class="px-2">SH/AM/Mgr Sign</th>
      <th rowspan="3" class="px-2">Countermeasure Comment</th>
      <th id="fixCol-head-9" rowspan="3" width="120">Score</th>
      <th rowspan="3">Actions</th>
    </tr>
    <tr>
      <th colspan="2" rowspan="2">Safety</th>
      <th colspan="">SOP</th>
      <th colspan="">TSKK</th>
      <th colspan="">TSK</th>
    </tr>
    <tr>
      <th>Method</th>
      <th colspan="2">Man</th>
      <th>Material</th>
      <th>Machine</th>
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
</template>
<script>
export default {
  name: "HeadFindingList"
}
</script>
<style scoped>
.week {
  width: 20px !important;
}

#fixCol-head-1 {
  position: sticky;
  width: 38px;
  top: 0px;
  left: 0px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-2 {
  position: sticky;
  top: 0px;
  left: 37px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-3 {
  position: sticky;
  min-width: 121px;
  top: 0px;
  left: 125px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-4 {
  position: sticky;
  top: 0px;
  left: 220px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-5 {
  position: sticky;
  top: 0px;
  left: 310px;
  z-index: 3;
  background-color: white;
}

#fixCol-head-6 {
  position: sticky;
  top: 0px;
  left: 370px;
  z-index: 3;
  background-color: white;
}

thead th:first-child {
  z-index: 4;
  /* highest to appear above both */
}
</style>
