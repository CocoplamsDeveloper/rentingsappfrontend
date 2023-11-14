<script setup>
import { refreshUserLogin } from '@/common/reusing_functions'
import LandlordBioPanel from '@/views/apps/landlord_user/view/LandlordBioPanel.vue'
import PropertyTabAccount from '@/views/apps/property/view/PropertyTabAccount.vue'
import PropertyTabBillingsPlans from '@/views/apps/property/view/PropertyTabBillingsPlans.vue'
import PropertyTabNotifications from '@/views/apps/property/view/PropertyTabNotifications.vue'
import PropertyTabSecurity from '@/views/apps/property/view/PropertyTabSecurity.vue'
import axios from "@axios"
import { onMounted } from 'vue'

// import { useUserListStore } from '@/views/apps/property/usePropertyListStore'

// const userListStore = useUserListStore()
const route = useRoute()

const landlordData = ref({})
const landlordsCount = ref()
const activeLandlords = ref()
const totalProperties = ref()
const totalUnits = ref()
const userTab = ref(null)

const tabs = [
  {
    icon: 'tabler-user-check',
    title: 'Profile',
  },

  {
    icon: 'tabler-building',
    title: 'Properties',
  },

  {
    icon: 'tabler-currency-dollar',
    title: 'documents',
  },

  {
    icon: 'tabler-bell',
    title: 'Maintenance',
  },

]

const userListMeta = [
  {
    icon: 'tabler-building',
    color: 'success',
    // title: 'Active Users',
    stats: totalProperties,
    // percentage: -14,
    subtitle: 'Total Properties',
  },
  {
    icon: 'tabler-home-2',
    color: 'success',
    // title: 'Pending Users',
    stats: totalUnits,
    // percentage: +42,
    subtitle: 'Total Units',
  },
  {
    icon: 'tabler-user',
    color: 'primary',
    // title: 'Landlords',
    stats: landlordsCount,
    subtitle: 'Total Tenants',
  },
  {
    icon: 'tabler-user-check',
    color: 'info',
    // title: 'Paid Users',
    stats: activeLandlords,
    // percentage: +18,
    subtitle: 'Total Users',
  }
]


function getSingleLandlord(){
    let queryData = {
      "userId" :  sessionStorage.getItem("userId")
    }

    axios.get("http://localhost:8000/prop-app/landlord/"+sessionStorage.getItem("userId"), {
      params: queryData,
      headers: {
        'Authorization': sessionStorage.getItem("accessToken")
      }
    }).then((response) => {
      console.log(response)
      landlordData.value = response.data.landlord
      // fillCurrentDetails(response.data.landlord)
    }).catch((error) => {
      if(error.response.status === 403){
        refreshUserLogin()
      }
    })

}




function fetchLandlordsStats(){

let queryData = {
  "userId" : sessionStorage.getItem('userId')
}

axios.get("http://localhost:8000/prop-app/landlord-page/stats", {
  params: queryData,
  headers: {
    'Authorization' : sessionStorage.getItem('accessToken')
  }
}).then((response) => {
  if(response.status == 200){
    let data = response.data.pageData
    landlordsCount.value = data.landlords
    activeLandlords.value = data.activeLandlords
    totalProperties.value = data.properties
    totalUnits.value = data.units
  }
}).catch((error) => {
  if(error.response.status == 403){
    refreshUserLogin()
  }
})
}

onMounted(() => {
  getSingleLandlord()
  fetchLandlordsStats()
})

// userListStore.fetchUser(Number(route.params.id)).then(response => {
//   userData.value = response.data
// })
</script>


<template>
<section>
    <VRow>
      <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h4">
                  {{ meta.stats }}
                </h6>
                <span :class="meta.percentage > 0 ? 'text-success' : 'text-error'"> {{ meta.percentage > 0 ? '+' : '' }} {{ meta.percentage }}</span>
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              :icon="meta.icon"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
</section>
<section>
  <VRow v-if="landlordData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <LandlordBioPanel :landlord-data="landlordData" />
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
</section>
</template>
