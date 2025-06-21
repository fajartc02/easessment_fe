<template>
  <CTooltip :style="customTooltipStyle">
    <template #content>
      <table class="table table-striped border-light text-light">
        <tr>
          <th>SOP No</th>
          <td>{{ child.job_no }}</td>
        </tr>
        <tr>
          <th>Member</th>
          <td>{{ child.member_nm }}</td>
        </tr>
        <tr v-if="child?.parent_revision_id">
          <th>Reason Revisi</th>
          <td>{{ child.reason_revision }}</td>
        </tr>
        <tr v-if="child?.parent_revision_id">
          <th>Ke Tanggal</th>
          <td>{{ child.date_revision?.split(' ')[0] }}</td>
        </tr>
      </table>
    </template>
    <template #toggler="{ id, on }">
      <!-- {{ child.is_wajik }} - finding:{{ child.is_finding }} -->
      <!-- add disabled if reschdule activities -->
      <CButton data-bs-toggle="tooltip" :aria-describedby="id" v-on="on" v-if="child" class="mt-1" :color="`${(child.job_type_nm == 'Type 1' ||
        child.job_type_nm == 'Type 2') && !child.is_wajik
        ? 'dark rounded-circle'
        : 'dark rounded'
        }`" html="true" variant="outline" :style="`
      position: relative;
      ${child.is_finding ? 'background-color: #fef2f2;' : ''}
      ${child.is_wajik ? 'transform: rotate(45deg);' : ''}`"
        @click="child?.parent_revision_id ? null : $emit('detail-schedule', child)">
        <img v-if="observation.comments.length > 0" src="@/assets/comment.png" alt="comment" width="45"
          :style="`z-index: 10;position: absolute;top: -30px;left: 20px;${child.is_wajik ? 'transform: rotate(-45deg);left: 10;top:-20px' : ''}`">
        <span v-if="child.is_finding">
          <CIcon icon="cil-bell" class="text-danger font-weight-bold" size="lg"
            :style="child.is_wajik ? 'transform: rotate(-45deg)' : ''" />
        </span>
        <span v-else>
          <h6 class="m-0 p-0 text-primary" v-if="child?.parent_revision_id">R</h6>
          <CIcon v-else-if="child.actual_check_dt" icon="cil-check-circle" class="text-success" size="sm"
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
  },
}
</script>
<style></style>
