<template>
  <div class="card">
    <div class="card-header">
      <div class="d-flex row align-items-center">
          <div class="col-10">
            Add Member Voice
          </div>
      </div>
    </div>
    <div class="card-body overflow-auto">
      <div class="row">
        <div class="col-lg-3 col-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Tgl. Temuan</CInputGroupText>
            <CFormInput type="date"/>
          </CInputGroup>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 col-12 mb-2">
          <CInputGroup class="mb-12">
            <CInputGroupText>Lokasi</CInputGroupText>
            <CFormInput placeholder="masukan lokasi..."/>
          </CInputGroup>
        </div>
        <div class="col-lg-6 col-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Problem</CInputGroupText>
            <CFormInput placeholder="masukan problem..."/>
          </CInputGroup>
        </div>
        <div class="col-lg-6 col-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Proses</CInputGroupText>
            <CFormInput placeholder="masukan proses..."/>
          </CInputGroup>
        </div>
        <div class="col-lg-6 col-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Ketegori</CInputGroupText>
            <CFormInput placeholder="masukan kategori..."/>
          </CInputGroup>
        </div>
        <div class="col-lg-6 col-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>C/M</CInputGroupText>
            <CFormInput placeholder="masukan penganggulangan..."/>
          </CInputGroup>
        </div>
        <div class="col-lg-3 col-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Tgl. C/M</CInputGroupText>
            <CFormInput type="date"/>
          </CInputGroup>
        </div>
        <div class="col-lg-6 col-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Evaluasi</CInputGroupText>
            <CFormInput placeholder="masukan evaluasi..."/>
          </CInputGroup>
        </div>
        <div class="col-lg-6 col-12">
          <CInputGroup class="mb-3">
            <CInputGroupText>Pic</CInputGroupText>
            <CFormInput placeholder="masukan pic..."/>
          </CInputGroup>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="row">
        <div class="col-lg-6 col-6">
          <button class="btn btn-sm btn-primary w-100">Submit</button>
        </div>
        <div class="col-lg-6 col-6">
          <router-link to="/stw/member-voice">
            <button class="btn btn-sm btn-warning w-100">Cancel</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MemberVoiceAdd'
}
</script>
