<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { refreshUserLogin } from '@/common/reusing_functions'
import router from '@/router'
import CardStatisticsGeneratedLeads from '@/views/pages/cards/card-statistics/CardStatisticsGeneratedLeads.vue'
import axios from '@axios'
import { useTheme } from 'vuetify'
import { VDataTable } from 'vuetify/labs/VDataTable'

const vuetifyTheme = useTheme()
const currentTheme = vuetifyTheme.current.value.colors

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const resolveTenantStatusVariant = stat => {

  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'active')
    return {
      color: 'success',
      text: 'Active',
    }
  if (statLowerCase === 'inactive')
    return {
      color: 'secondary',
      text: 'Inactive',
    }
 
  return {
    color: 'primary',
    text: 'No Status',
  }
}

const searchQuery = ref()

const simpleStatisticsDemoCards = [
  {
    icon: 'tabler-users-group',
    color: 'info',
    title: '13',
    subTitle: 'Tenants Last Month',

    // stat: '13',
    change: '+2.2%',
  },
  {
    icon: 'tabler-user-off',
    color: 'warning',
    title: '8',
    subTitle: 'Blocked Tenants',

    // stat: '8',
    change: '+3.2%',
  },
  {
    icon: 'tabler-user-pause',
    color: 'error',
    title: '2',
    subTitle: 'Disabled Tenants',

    // stat: '8',
    change: '+3.2%',
  },
  {
    icon: 'tabler-file-off',
    color: 'warning',
    title: '3',
    subTitle: 'Expiring Contracts',

    // stat: '8',
    change: '+3.2%',
  },
]

const headers = [
  {
    title: 'NAME',
    key: 'tenant.user_fullname',
  },
  {
    title: 'Phone',
    key: 'tenant.user_contact_number',
  },
  {
    title: 'Unit',
    key: 'tenancy.unitName',
  },
  {
    title: 'Unit Floor',
    key: 'tenancy.unitFloor',
  },
  {
    title: 'Start Date',
    key: 'tenancy.details.tenancy_start_date',
  },
  {
    title: 'End Date',
    key: 'tenancy.details.tenancy_end_date',
  },
  {
    title: 'Rent',
    key: 'tenancy.details.monthly_rent',
  },
  {
    title: 'STATUS',
    key: 'tenant.user_status',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
  },
]


const fetchedTenantsList = ref([])

const goToAddTenantPage = () => {
  router.push("/addtenant")
}


const getTenantsData = () => {
  let queryData = {
    "userId": sessionStorage.getItem("userId"),
  }
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }
  axios.get("http://127.0.0.1:8000/prop-app/details/tenants", {
    params: queryData,
    headers: {
      'Authorization': sessionStorage.getItem("accessToken"),
    },
  }).then(response => {
    console.log(response)
    fetchedTenantsList.value = response.data.tenantsData

  }).catch(error => {
    console.log(error)
    if(error.response.status === 401){
      refreshUserLogin()
    }
  })
}


onMounted(() => {
  getTenantsData()
})
</script>



<template>
  <VRow class="match-height">
    <VCol
      v-for="demo in simpleStatisticsDemoCards"
      :key="demo.title"
      cols="12"
      sm="6"
      md="2"
    >
      <VCard>
        <VCardText>
          <VAvatar
            :color="demo.color"
            variant="tonal"
            rounded
            size="42"
          >
            <VIcon :icon="demo.icon" />
          </VAvatar>

          <h2 class="text-h2 mt-3">
            {{ demo.title }}
          </h2>
          <!--
            <p class="mt-1 mb-2">
            {{ demo.stat }}
            </p> 
          -->
          <p class="text-sm text-disabled mt-1 mb-0">
            {{ demo.subTitle }}
          </p>
          <VChip
            :color="demo.color"
            label
          >
            {{ demo.change }}
          </VChip>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Revenue Growth -->
    <!--
      <VCol
      cols="12"
      md="4"
      >
      <CardStatisticsRevenueGrowth />
      </VCol> 
    -->

    <!-- 👉 Generated Leads -->
    <VCol
      cols="12"
      md="4"
    >
      <CardStatisticsGeneratedLeads />
    </VCol>
  </VRow>

  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Tenants">
          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <!--
              <div class="me-3 d-flex gap-3">
              <AppSelect
              :model-value="options.itemsPerPage"
              :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
              ]"
              style="width: 6.25rem;"
              @update:model-value="options.itemsPerPage = parseInt($event, 10)"
              />
              </div> 
            -->

            <div style="inline-size: 20rem;">
              <AppTextField
                v-model="searchQuery"
                placeholder="Search"
                density="compact"
                append-inner-icon="tabler-search"
              />
            </div>
            <VSpacer />


            <!-- 👉 Search  -->

            <VBtn
              size="38"
              color="warning"
              prepend-icon="tabler-filter"
              @click="isUnitsFilterDialogVisible=true"
            />

            <!-- 👉 Export button -->
            <VBtn
              size="38"
              color="info"
              title="download report"
              prepend-icon="tabler-download"
            />



            <!-- 👉 Add user button -->
            <VBtn
              prepend-icon="tabler-plus"
              color="secondary"
              @click="goToAddTenantPage"
            >
              Add Tenants
            </VBtn>
          </VCardText>

          <VDivider />

          <!-- SECTION datatable -->
          <VDataTable
            :headers="headers"
            :items="fetchedTenantsList"
            :items-per-page="10"
          >
            <template #item.tenant.user_fullname="{ item }">
              <div class="d-flex align-center">
                <!-- avatar -->
                
                
                <VAvatar
                  size="32"
                  :color="item.raw.tenant.user_image ? '' : 'primary'"
                  :class="item.raw.tenant.user_image ? '' : 'v-avatar-light-bg primary--text'"
                  :variant="!item.raw.tenant.user_image ? 'tonal' : undefined"
                >
                  <VImg
                    v-if="item.raw.tenant.user_image"
                    :src="'http://127.0.0.1:8000/media/'+item.raw.tenant.user_image"
                  />
                  <span v-else>{{ avatarText(item.raw.tenant.user_fullname) }}</span>
                </VAvatar>  
               
               

                <div class="d-flex flex-column ms-3">
                  <RouterLink 
                    class="d-block font-weight-medium text--primary text-truncate"
                    :to="{ name: 'viewtenant-id', params: { id: item.raw.tenant.user_id } }"
                  >
                    {{ item.raw.tenant.user_fullname }}
                  </RouterLink>
                  <!-- <small>{{ item.raw.post }}</small> -->
                </div>
              </div>
            </template>


            <template #item.tenant.user_status="{ item }">
              <VChip
                :color="resolveTenantStatusVariant(item.raw.tenant.user_status).color"
                size="small"
              >
                {{ resolveTenantStatusVariant(item.raw.tenant.user_status).text }}
              </VChip>
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-1">
                <IconBtn @click="editPropertyItem(item.raw.propertyId)">
                  <VIcon icon="mdi-pencil-outline" />
                </IconBtn>
                <IconBtn @click="deleteItem(item.raw.propertyId)">
                  <VIcon icon="mdi-delete-outline" />
                </IconBtn>
              </div>
            </template>
          </VDataTable>
          <!-- SECTION -->
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>


<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
