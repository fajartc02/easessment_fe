<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0">
      <!-- <CAvatar :src="avatar" size="md" /> -->
      <CIcon v-if="name" icon="cil-user" /> {{ name }}
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
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
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('name')
      localStorage.removeItem('noreg')
      localStorage.removeItem('line_id')
      localStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
  mounted() {
    setTimeout(() => {
      this.name = localStorage.getItem('name')
    }, 100)
  }
}
</script>
