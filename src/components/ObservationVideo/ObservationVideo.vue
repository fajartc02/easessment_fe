<template>
  <label style="width: 200px;">Video Observation</label>
  <CInputGroup class="mb-3">
    <input ref="video" type="file" class="form-control" />
    <CInputGroupText class="p-0">
      <CButton color="success" style="font-weight:900;" @click="submitVideoObservation">Save</CButton>
    </CInputGroupText>
  </CInputGroup>
  <template v-if="videoLink && !isLoading">
    <video width="320" height="240" autoplay controls>
      <source :src="videoLink">
      Your browser does not support the video tag.
    </video>
  </template>
  <template v-else-if="isLoading">
    <div class="d-flex justify-content-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </template>
  <hr>
</template>
<script>
import ApiService from '@/store/api.service';
import { toast } from 'vue3-toastify'

export default {
  name: 'ObservationVideo',
  data() {
    return {
      videoLink: null,
      isLoading: false
    }
  },
  watch: {
    observationVideo() {
      console.log(this.observationVideo);

      this.videoLink = this.observationVideo
    }
  },
  methods: {
    async submitVideoObservation() {
      try {
        this.isLoading = true
        const formData = new FormData()
        const video = this.$refs.video.files[0]
        if (this.observationVideo) formData.append('before_path', this.observationVideo)
        toast.loading('Uploading...')
        formData.append('dest', 'observationVideos')
        formData.append('attachment', video)
        const uploadImage = await ApiService.post(
          `/operational/observation/upload-video/${this.$route.params.id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        if (uploadImage.data.data) {
          toast.success('Video observation uploaded', {
            autoClose: 1000
          })
          this.$emit('on-video-change', uploadImage.data.data)
        }
        setTimeout(() => {
          toast.remove()
        }, 2000)
        setTimeout(() => {
          this.isLoading = false
        }, 2000)
      } catch (error) {
        setTimeout(() => {
          this.isLoading = false
        }, 1000)
        toast.error(JSON.stringify(error.message))
        setTimeout(() => {
          toast.remove()
        }, 2000)
      }
    }
  },
  props: {
    observationVideo: {
      type: String,
      default: null
    }
  }
}
</script>
<style></style>
