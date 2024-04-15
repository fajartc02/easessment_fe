<template>
  <CTooltip placement="top" :style="customTooltipStyle">
    <template #content>
      <div class='card'>
        <div class='card-header text-dark'>Detail data</div>
        <div class='card-body text-dark'>
          SOP No: {{ child.job_no }} Member: {{ child.member_nm }}
        </div>
      </div>
    </template>
    <template #toggler="{ id, on }">
      <CButton :aria-describedby="id" v-on="on" v-if="child" class="mt-1" :color="`${child.job_type_nm == 'Type 1' ||
        child.job_type_nm == 'Type 2'
        ? 'dark rounded-circle'
        : 'dark rounded'
        }`" html="true" variant="outline" :style="`
      position: relative;
      ${child.is_finding ? 'background-color: #fef2f2;' : ''}
      ${child.is_wajik ? 'transform: rotate(45deg)' : ''}`" @click="$emit('detail-schedule', child)">
        <button v-if="observation.comment_sh !== null" disabled :style="`
          position: absolute;
          margin-left: 20px;
          background-color: #e0f2fe;
          border: none;
          border: 1px solid #7dd3fc;
          color: #0369a1;
          border-radius: 6px;
          ${child.is_wajik ? 'transform: rotate(-45deg);left: 10;top:-20px' : ''}
        `">
          1
        </button>
        <span v-if="child.is_finding">
          <CIcon icon="cil-bell" class="text-warning" size="sm"
            :style="child.is_wajik ? 'transform: rotate(-45deg)' : ''" />
        </span>
        <span v-else>
          <CIcon v-if="child.actual_check_dt" icon="cil-check-circle" class="text-success" size="sm"
            :style="child.is_wajik ? 'transform: rotate(-45deg)' : ''" />
          <CIcon v-else-if="+currentDate <= +child.idxdate" icon="cil-circle" class="text-dark" size="sm"
            :style="child.is_wajik ? 'transform: rotate(-45deg)' : ''" />
          <CIcon v-else icon="cil-circle" class="text-danger" size="sm"
            :style="child.is_wajik ? 'transform: rotate(-45deg)' : ''" />
        </span>
      </CButton>
    </template>
  </CTooltip>
</template>
<script>
export default {
  name: "TooltipStwSchedule",
  props: {
    observation: Object,
    child: Object,
    currentDate: String,
    customTooltipStyle: Object
  }
}
</script>
<style></style>
