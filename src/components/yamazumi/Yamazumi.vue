<template>
  <div class="row align-items-end" style="border-left: 1px solid black;">
    <!-- need  -->
    <!-- 20px means higher index of total pos -->
    <div :style="`border-bottom: 2px dotted red;position: absolute; top: ${heightLines}px;`">

    </div>
    <div class="col" style="text-align: end;">
      <draggable v-model="items">
        <template v-slot:item="{ item }">
          <!-- <CButton v-c-tooltip="`
            <div class='card'>
              <div class='card-header text-dark'>Detail data</div>
              <div class='card-body text-dark'>
                SOP:  ${item.job_nm}
              </div>
            </div>
            `" data-coreui-toggle="tooltip" class="m-0 w-100" :color="`dark rounded`" html="true" variant="outline"
            :style="`background-color: #${item.bgCol};color: white;height: ${item.title * 2}px`">
            <h6 class="mx-auto p-1 px-auto text-center"
              style="color: black;background-color: white;width: 20px;border-radius: 5px;font-size: 8px;">
              {{
                item.title
              }}</h6>
          </CButton> -->
          <div class="m-0 w-100 p-0" :color="`dark rounded`" html="true" variant="outline"
            :style="`background-color: #${item.bgCol};color: white;height: ${item.title <= 10 ? item.title * 5 : item.title * 2.5}px`">
            <!-- height: ${item.title * 2}px -->
            <h6 class="mx-auto my-auto p-1 text-center"
              style="color: black;background-color: white;width: 20px;border-radius: 5px;font-size: 8px;">
              {{
                item.title
              }}</h6>
          </div>
        </template>
      </draggable>
    </div>
  </div>
  <div class="row">
    <div class="col border-top border-dark">
      <h6 class="text-center">Pos 1</h6>
    </div>
    <div class="col border-top border-dark">
      <h6 class="text-center">Pos 2</h6>
    </div>
  </div>
</template>
<script>
import Draggable from "vue3-draggable";
export default {
  name: "Yamazumi",
  data() {
    return {
      heightLines: 95,
      items: [
        {
          id: 0,
          title: 3,
          job_nm: "Jalan kaki",
          // positionBottom: 0,
          bgCol: Math.floor(Math.random() * 16777215).toString(16),
        },
        {
          id: 1,
          title: 5,
          job_nm: "Buka pintu",
          // positionBottom: 10,
          bgCol: Math.floor(Math.random() * 16777215).toString(16),
        },
        {
          id: 2,
          title: 13,
          job_nm: "Buka pintu",
          // positionBottom: 20,
          bgCol: Math.floor(Math.random() * 16777215).toString(16),
        },
      ],
      items2: [
        {
          id: 1,
          title: 4,
          job_nm: "Start Mesin",
          // positionBottom: 0,
          bgCol: Math.floor(Math.random() * 16777215).toString(16),
        },
        {
          id: 2,
          title: 5,
          ob_nm: "Dorong work",
          // positionBottom: 4,
          bgCol: Math.floor(Math.random() * 16777215).toString(16),
        }
      ]
    }
  },
  watch: {
    items() {

      console.log(this.items)
      // let totalHeight = this.items
    }
  },
  components: {
    Draggable,
  },
}
</script>
