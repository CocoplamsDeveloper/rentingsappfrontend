<!--
  <template>
  <div>
  <p>This is user details page.</p>
  <p>Current user id: {{ $route.params.id }}</p>
  </div>
  </template> 
-->

<script setup>
import { refreshUserLogin } from '@/common/reusing_functions'
import PropertyBioPanel from '@/views/apps/property/view/PropertyBioPanel.vue'
import PropertyTabAccount from '@/views/apps/property/view/PropertyTabAccount.vue'
import PropertyTabBillingsPlans from '@/views/apps/property/view/PropertyTabBillingsPlans.vue'
import PropertyTabNotifications from '@/views/apps/property/view/PropertyTabNotifications.vue'
import PropertyTabSecurity from '@/views/apps/property/view/PropertyTabSecurity.vue'
import axios from "@axios"
import { onMounted } from 'vue'

// import { useUserListStore } from '@/views/apps/property/usePropertyListStore'

// const userListStore = useUserListStore()
const route = useRoute()

const propertyData = ref({})

const userTab = ref(null)

const tabs = [
  {
    icon: 'tabler-user-check',
    title: 'Profile',
  },

  {
    icon: 'tabler-lock',
    title: 'Units',
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

const fetchProperty = item => {

  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }
  axios.get("http://127.0.0.1:8000/prop-app/property/"+item, {
    params: { "userId": sessionStorage.getItem('userId') },
    headers: {
      "Authorization": sessionStorage.getItem("accessToken"),
    },
  }).then(response => {
    console.log(response)
    propertyData.value = response.data.property_data[0]
  }).catch( error => {
    if(error.response.status === 401){
      refreshUserLogin()
    }
    console.log(error)
  })
}

onMounted(() => {
  fetchProperty(route.params.id)
})

// userListStore.fetchUser(Number(route.params.id)).then(response => {
//   userData.value = response.data
// })
</script>

<template>
  <VRow v-if="propertyData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <PropertyBioPanel :property-data="propertyData" />
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
          <PropertyTabAccount />
        </VWindowItem>

        
        <VWindowItem>
          <PropertyTabSecurity />
        </VWindowItem>

        
        <VWindowItem>
          <PropertyTabBillingsPlans />
        </VWindowItem> 
       

        
        <VWindowItem>
          <PropertyTabNotifications />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>

