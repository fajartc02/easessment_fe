<template>
  <CModal backdrop="static" alignment="center" :visible="visible" @close="close" size="lg" scrollable>
    <CModalHeader>
      <CModalTitle>{{ title }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <img :src="img" width="100%" alt="Finding Image" />
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" class="text-white" @click="close">
        Close
      </CButton>
    </CModalFooter>
  </CModal>
</template>
<script>
export default {
  name: "ModalImage",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'Finding Image Detail'
    }
  },
  methods: {
    close() {
      this.$emit('close', false);
    }
  },
  mounted() {

  }
}
</script>
