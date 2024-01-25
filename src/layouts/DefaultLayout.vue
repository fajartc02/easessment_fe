<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100 bg-white">
      <AppHeader />
      <div class="body flex-grow-1 px-3">
        <router-view />
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

import { VERIFY_AUTH } from '@/store/modules/auth.module'
import { mapGetters } from 'vuex'

export default {
  name: 'DefaultLayout',
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  async mounted() {
    this.$store.dispatch(VERIFY_AUTH)
    if (!this.isAuthenticated) this.$router.push('/login')
  },
  components: {
    AppFooter,
    AppHeader,
    AppSidebar,
  },
}
</script>
