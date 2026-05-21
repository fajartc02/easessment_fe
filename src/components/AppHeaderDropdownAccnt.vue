<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0">
      <img 
        :src="avatar" 
        alt="User Avatar"
        class="rounded-circle border shadow-sm" 
        style="width: 40px; height: 40px; object-fit: cover; object-position: top; border-width: 2px !important; border-color: #ddd !important;"
      />
      <span class="ms-2" v-if="name">{{ name }}</span>
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">Account</CDropdownHeader>
      <CDropdownItem>
        <button class="btn btn-outline-primary w-100" @click="this.$router.push('/profile')">
          <CIcon icon="cil-user" /> Profile
        </button>
      </CDropdownItem>
      <CDropdownItem>
        <button class="btn btn-outline-danger w-100" @click="logout()">
          <CIcon icon="cil-lock-locked" /> Logout
        </button>
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
export default {
  name: 'AppHeaderDropdownAccnt',
  data() {
    return {
      name: null,
      avatar: null,
      defaultAvatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      appUrl: process.env.VUE_APP_URL
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('name')
      localStorage.removeItem('noreg')
      localStorage.removeItem('line_id')
      localStorage.removeItem('token')
      localStorage.removeItem('photo_url')
      this.$router.push('/login')
    }
  },
  mounted() {
    this.name = localStorage.getItem('name')
    const photoUrl = localStorage.getItem('photo_url')
    
    const isValidPhoto = (url) => url && url !== 'null' && url !== 'undefined' && url !== '';
    this.avatar = isValidPhoto(photoUrl) ? `${this.appUrl}/file?path=${photoUrl}` : this.defaultAvatar

    // Fallback if name is not yet in localStorage
    if (!this.name) {
      setTimeout(() => {
        this.name = localStorage.getItem('name')
        const photoUrl = localStorage.getItem('photo_url')
        this.avatar = isValidPhoto(photoUrl) ? `${this.appUrl}/file?path=${photoUrl}` : this.defaultAvatar
      }, 500)
    }
  }
}
</script>
