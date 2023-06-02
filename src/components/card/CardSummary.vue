<template>
    <CCard class="mb-4">
        <CCardHeader>
          <strong>Summary</strong>
        </CCardHeader>
        <CCardBody class="overflow-auto">
            <CRow>
                <CCol>
                    <CCard class="mb-4">
                        <CCardHeader>
                        <strong>Delay</strong>
                        </CCardHeader>
                        <CCardBody class="overflow-auto">
                            <h1 class="text-danger">0</h1>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard class="mb-4">
                        <CCardHeader>
                        <strong>Done</strong>
                        </CCardHeader>
                        <CCardBody class="overflow-auto">
                            <h1 class="text-success">6</h1>
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol>
                    <CCard class="mb-4">
                        <CCardHeader>
                        <strong>Total</strong>
                        </CCardHeader>
                        <CCardBody class="overflow-auto">
                            <h1 >6/8</h1>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CCardBody>
    </CCard>
</template>

<script>
    export default {
        name: 'CardSummary',
        data() {
            return {

            }
        }
    }
</script>

<style scoped>

</style>