
<script setup>
import { refreshUserLogin } from '@/common/reusing_functions'
import TenantBioPanel from '@/views/apps/tenant/view/TenantBioPanel.vue'
import TenantTabBillingsPlans from '@/views/apps/tenant/view/TenantTabBillingsPlans.vue'
import TenantTabNotifications from '@/views/apps/tenant/view/TenantTabNotifications.vue'
import TenantTabSecurity from '@/views/apps/tenant/view/TenantTabSecurity.vue'
import TenantTabUnits from '@/views/apps/tenant/view/TenantTabUnits.vue'
import axios from "@axios"
import { onMounted } from 'vue'

// import { useUserListStore } from '@/views/apps/property/usePropertyListStore'

// const userListStore = useUserListStore()
const route = useRoute()
const tenantData = ref({})
const userTab = ref(null)

const tabs = [
  {
    icon: 'tabler-building-bridge-2',
    title: 'Units',
  },

  {
    icon: 'tabler-lock',
    title: 'Profile',
  },

  {
    icon: 'tabler-currency-dollar',
    title: 'Invoices',
  },

  {
    icon: 'tabler-bell',
    title: 'Maintenance',
  },

]



const fetchTenant = item => {
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }
  axios.get(import.meta.env.VITE_API_URL+"/prop-app/tenant/"+item, {
    params: { "userId": sessionStorage.getItem('userId') },
    headers: {
      "Authorization": sessionStorage.getItem("accessToken"),
    },
  }).then(response => {
    console.log("in tenant id file with single tenant", response)
    tenantData.value = response.data.tenantRecord
  }).catch( error => {
    console.log(error)
    if(error.response.status === 401){
      refreshUserLogin()
    }
  })
}



onMounted(() => {
  fetchTenant(route.params.id)
})

// userListStore.fetchUser(Number(route.params.id)).then(response => {
//   userData.value = response.data
// })
</script>

<template>
  <VRow v-if="tenantData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <TenantBioPanel :tenant-data="tenantData" />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            :size="18"
            :icon="tab.icon"
            class="me-1"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <TenantTabUnits :tenant-data="tenantData" />
        </VWindowItem>

        
        <VWindowItem>
          <TenantTabSecurity />
        </VWindowItem>

        
        <VWindowItem>
          <TenantTabBillingsPlans />
        </VWindowItem> 
       

        
        <VWindowItem>
          <TenantTabNotifications />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>


