<template>
  <div class="row">
    <div class="col h-100">
      <draggable v-model="items">
        <template v-slot:item="{ item }">
          <CButton v-c-tooltip="`
            <div class='card'>
              <div class='card-header text-dark'>Detail data</div>
              <div class='card-body text-dark'>
                SOP:  ${item.job_nm}
              </div>
            </div>
            `" data-coreui-toggle="tooltip" class="mt-3" :color="`dark rounded`" html="true" variant="outline">
            <div class="alert mb-0 border border-dark" :style="`background-color: #${item.bgCol};color: white`">
              <h6 class="mx-auto p-1 px-auto text-center"
                style="color: black;background-color: white;width: 30px;border-radius: 5px;">
                {{
                  item.title
                }}</h6>
            </div>
          </CButton>
        </template>
      </draggable>
    </div>
    <div class="col">
      <draggable v-model="items2">
        <template v-slot:item="{ item }">
          <!-- example -->
          <div class="alert mb-0 text-center border border-dark">
            {{ item.title }}
          </div>
          <!-- or your own template -->
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
      items: [
        {
          id: 0,
          title: 10,
          job_nm: "Jalan kaki",
          bgCol: Math.floor(Math.random() * 16777215).toString(16),
        },
        {
          id: 1,
          title: 20,
          job_nm: "Buka pintu",
          bgCol: Math.floor(Math.random() * 16777215).toString(16),
        }
      ],
      items2: [
        {
          id: 2,
          title: 4,
          job_nm: "Start Mesin",
          bgCol: Math.floor(Math.random() * 16777215).toString(16),
        },
        {
          id: 3,
          title: 5,
          ob_nm: "Dorong work",
          bgCol: Math.floor(Math.random() * 16777215).toString(16),
        }
      ]
    }
  },
  components: {
    Draggable,
  },
}
</script>
