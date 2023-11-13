<script setup>
import { refreshUserLogin } from '@/common/reusing_functions'
import router from '@/router'
import { useUserListStore } from '@/views/apps/user/useUserListStore'

import axios from 'axios'
import { onMounted } from 'vue'

const userListStore = useUserListStore()
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const totalPage = ref(1)
const landlordsData = ref([])
const totalUsers = ref(0)
const users = ref([])
const landlordsCount = ref()
const activeLandlords = ref()
const totalProperties = ref()
const totalUnits = ref()

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const goToAddLandlord = () => {
  router.push('/addlandlord')
}

// Headers
const headers = [
  {
    title: 'Name',
    key: 'landlordDetails.landlord_name',
  },
  {
    title: 'Company Name',
    key: 'landlordDetails.company_name',
  },
  {
    title: 'Contact Name',
    key: 'landlordDetails.contact_name',
  },
  {
    title: 'Contact Number',
    key: 'landlordDetails.contact_number',
  },
  {
    title: 'Nos of Properties',
    key: 'propertyNos',
  },
  {
    title: 'Charges',
    key: 'landlordDetails.charges',
  },
  {
    title: 'Status',
    key: 'status',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

// 👉 Fetching users
const fetchUsers = () => {
  userListStore.fetchUsers({
    q: searchQuery.value,
    status: selectedStatus.value,
    plan: selectedPlan.value,
    role: selectedRole.value,
    options: options.value,
  }).then(response => {
    users.value = response.data.users
    totalPage.value = response.data.totalPage
    totalUsers.value = response.data.totalUsers
    options.value.page = response.data.page
  }).catch(error => {
    console.error(error)
  })
}

const resolveLandlordImage = (documents) => {
  console.log(documents)
  let imageUrl = null
  if(documents !== null && documents.length > 0){
  documents.forEach((element)=>{
    if(element.document_name === "user/landlord Image"){
      imageUrl = element.image
    }
  })
  return imageUrl
}
}


// watchEffect(fetchUsers)

// 👉 search filters
const roles = [
  {
    title: 'Admin',
    value: 'admin',
  },
  {
    title: 'Author',
    value: 'author',
  },
  {
    title: 'Editor',
    value: 'editor',
  },
  {
    title: 'Maintainer',
    value: 'maintainer',
  },
  {
    title: 'Subscriber',
    value: 'subscriber',
  },
]

const plans = [
  {
    title: 'Basic',
    value: 'basic',
  },
  {
    title: 'Company',
    value: 'company',
  },
  {
    title: 'Enterprise',
    value: 'enterprise',
  },
  {
    title: 'Team',
    value: 'team',
  },
]

const status = [
  {
    title: 'Pending',
    value: 'pending',
  },
  {
    title: 'Active',
    value: 'active',
  },
  {
    title: 'Inactive',
    value: 'inactive',
  },
]

const resolveUserRoleVariant = role => {
  // const roleLowerCase = role.toLowerCase()
  // if (roleLowerCase === 'subscriber')
  //   return {
  //     color: 'warning',
  //     icon: 'tabler-circle-check',
  //   }
  // if (roleLowerCase === 'author')
  //   return {
  //     color: 'success',
  //     icon: 'tabler-user',
  //   }
  // if (roleLowerCase === 'maintainer')
  //   return {
  //     color: 'primary',
  //     icon: 'tabler-chart-pie-2',
  //   }
  // if (roleLowerCase === 'editor')
  //   return {
  //     color: 'info',
  //     icon: 'tabler-edit',
  //   }
  // if (roleLowerCase === 'admin')
  //   return {
  //     color: 'secondary',
  //     icon: 'tabler-device-laptop',
  //   }
  
  // return {
  //   color: 'primary',
  //   icon: 'tabler-user',
  // }
}

const resolveLandlordStatusVariant = stat => {
  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'pending')
    return 'warning'
  if (statLowerCase === 'active')
    return 'success'
  if (statLowerCase === 'inactive')
    return 'secondary'
  
  return 'primary'
}


const addNewUser = userData => {
  userListStore.addUser(userData)

  // refetch User
  fetchUsers()
}

function getLandlordData(){

  let queryData = {
    "userId" : sessionStorage.getItem("userId"),
  }

  axios.get("http://localhost:8000/prop-app/landlords/get", {
    params: queryData,
    headers: {
      'Authorization' : sessionStorage.getItem('accessToken')
    }
  }).then(response => {
    console.log(response)
    landlordsData.value = response.data.landlordData
  }).catch(error => {
    if(error.response.status == 403){
      refreshUserLogin();
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

// 👉 List
const userListMeta = [
  {
    icon: 'tabler-user',
    color: 'primary',
    // title: 'Landlords',
    stats: landlordsCount,
    subtitle: 'Landlords',
  },
  {
    icon: 'tabler-user-plus',
    color: 'info',
    // title: 'Paid Users',
    stats: activeLandlords,
    // percentage: +18,
    subtitle: 'Active Landlords',
  },
  {
    icon: 'tabler-user-check',
    color: 'success',
    // title: 'Active Users',
    stats: totalProperties,
    // percentage: -14,
    subtitle: 'Total Properties',
  },
  {
    icon: 'tabler-user-exclamation',
    color: 'success',
    // title: 'Pending Users',
    stats: totalUnits,
    // percentage: +42,
    subtitle: 'Total Units',
  },
]

const deleteUser = id => {
  userListStore.deleteUser(id)

  // refetch User
  fetchUsers()
}

onMounted(() => {
  getLandlordData();
  fetchLandlordsStats();
})

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

      <VCol cols="12">
        <VCard title="Landlords">
          <!-- <VCardText>
            <VRow>
              <VCol
                cols="12"
                sm="4"
              >
                <AppSelect
                  v-model="selectedRole"
                  label="Select Role"
                  :items="roles"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
              <VCol
                cols="12"
                sm="4"
              >
                <AppSelect
                  v-model="selectedPlan"
                  label="Select Plan"
                  :items="plans"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
              <VCol
                cols="12"
                sm="4"
              >
                <AppSelect
                  v-model="selectedStatus"
                  label="Select Status"
                  :items="status"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
            </VRow>
          </VCardText> -->

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <!-- <div class="me-3 d-flex gap-3">
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
            </div> -->
            <VSpacer />

            <!-- <div class="app-user-search-filter d-flex align-center flex-wrap gap-4"> -->
              <!-- <div style="inline-size: 10rem;">
                <AppTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>

              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
              >
                Export
              </VBtn> -->

              <!-- 👉 Add user button -->

            <!-- </div> -->
            <VBtn
                prepend-icon="tabler-plus"
                @click="goToAddLandlord"
              >
                Add Landlord
            </VBtn>
          </VCardText>

          <VDivider />

          <!-- SECTION datatable -->
          <!-- <VDataTableServer
            v-model:items-per-page="options.itemsPerPage"
            v-model:page="options.page"
            :items="landlordsData"
            :items-length="totalUsers"
            :headers="headers"
            class="text-no-wrap"
            @update:options="options = $event"
          >
            <template #item.landlord="{ item }">
              <div class="d-flex align-center">
                <VAvatar
                  size="34"
                  :variant="!item.raw.avatar ? 'tonal' : undefined"
                  :color="!item.raw.avatar ? resolveUserRoleVariant(item.raw.role).color : undefined"
                  class="me-3"
                >
                  <VImg
                    v-if="item.raw.avatar"
                    :src="item.raw.avatar"
                  />
                  <span v-else>{{ avatarText(item.raw.fullName) }}</span>
                </VAvatar>

                <div class="d-flex flex-column">
                  <h6 class="text-base">
                    <RouterLink
                      :to="{ name: 'apps-user-view-id', params: { id: item.raw.id } }"
                      class="font-weight-medium user-list-name"
                    >
                      {{ item.raw.fullName }}
                    </RouterLink>
                  </h6>

                  <span class="text-sm text-medium-emphasis">@{{ item.raw.email }}</span>
                </div>
              </div>
            </template> -->

            <!-- <template #item.role="{ item }">
              <div class="d-flex align-center gap-4">
                <VAvatar
                  :size="30"
                  :color="resolveUserRoleVariant(item.raw.role).color"
                  variant="tonal"
                >
                  <VIcon
                    :size="20"
                    :icon="resolveUserRoleVariant(item.raw.role).icon"
                  />
                </VAvatar>
                <span class="text-capitalize">{{ item.raw.role }}</span>
              </div>
            </template> -->

            <!-- <template #item.plan="{ item }">
              <span class="text-capitalize font-weight-medium">{{ item.raw.currentPlan }}</span>
            </template>  -->

            <!-- <template #item.status="{ item }">
              <VChip
                :color="resolveLandlordStatusVariant(item.raw.status)"
                size="small"
                label
                class="text-capitalize"
              >
                {{ item.raw.status }}
              </VChip>
            </template>

            <template #item.actions="{ item }">
              <IconBtn @click="deleteUser(item.raw.id)">
                <VIcon icon="tabler-trash" />
              </IconBtn>

              <IconBtn>
                <VIcon icon="tabler-edit" />
              </IconBtn>

              <VBtn
                icon
                variant="text"
                size="small"
                color="medium-emphasis"
              >
                <VIcon
                  size="24"
                  icon="tabler-dots-vertical"
                />

                <VMenu activator="parent">
                  <VList>
                    <VListItem :to="{ name: 'apps-user-view-id', params: { id: item.raw.id } }">
                      <template #prepend>
                        <VIcon icon="tabler-eye" />
                      </template>

                      <VListItemTitle>View</VListItemTitle>
                    </VListItem>

                    <VListItem link>
                      <template #prepend>
                        <VIcon icon="tabler-pencil" />
                      </template>
                      <VListItemTitle>Edit</VListItemTitle>
                    </VListItem>

                    <VListItem @click="deleteUser(item.raw.id)">
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>
                      <VListItemTitle>Delete</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
            </template>

            <template #bottom>
              <VDivider />
              <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
                <p class="text-sm text-disabled mb-0">
                  {{ paginationMeta(options, totalUsers) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(totalUsers / options.itemsPerPage)"
                  :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalUsers / options.itemsPerPage)"
                >
                  <template #prev="slotProps">
                    <VBtn
                      variant="tonal"
                      color="default"
                      v-bind="slotProps"
                      :icon="false"
                    >
                      Previous
                    </VBtn>
                  </template>

                  <template #next="slotProps">
                    <VBtn
                      variant="tonal"
                      color="default"
                      v-bind="slotProps"
                      :icon="false"
                    >
                      Next
                    </VBtn>
                  </template>
                </VPagination>
              </div>
            </template>
          </VDataTableServer> -->
        </VCard>


      </vcol>
    </vrow>
  </section>

  <VRow  >
  <VCol
      cols="12"
      sm="6"
      md="4"
      v-for="landlord in landlordsData" key="landlord.landlordId">
      <VCard>
        <template v-if="landlord.landlordDocuments">
        <VImg :src="'http://127.0.0.1:8000/media/'+resolveLandlordImage(landlord.landlordDocuments)" />
        </template>
        <VCardText class="position-relative">
          <!-- User Avatar -->
          <VAvatar
            size="75"
            class="avatar-center"
            :image="avatar1"
          />

          <!-- Title, Subtitle & Action Button -->
          <div class="d-flex justify-space-between flex-wrap pt-8">
            <div class="me-2 mb-2">
              <VCardTitle class="pa-0">
                {{ landlord.landlordDetails.landlord_name }}
              </VCardTitle>
              <VCardSubtitle class="text-caption pa-0">
                {{ landlord.landlordDetails.email }}
              </VCardSubtitle>
            </div>
            <VBtn>View Details</VBtn>
          </div>

          <!--  Mutual Friends -->
          <div class="d-flex justify-space-between align-center mt-8">
            <span class="font-weight-medium">18 mutual friends</span>

            <div class="v-avatar-group">
              <VAvatar
                v-for="avatar in avatars"
                :key="avatar"
                :image="avatar"
                size="38"
              />
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
</style>
