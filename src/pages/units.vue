<script setup>
import AppSelect from '@/@core/components/app-form-elements/AppSelect.vue'
import { populatePropertiesList, refreshUserLogin } from '@/common/reusing_functions'
import AddNewUnitDrawer from '@/views/apps/units/AddNewUnitDrawer.vue'
import axios from '@axios'
import { onMounted } from 'vue'
import { VDataTable } from 'vuetify/labs/VDataTable'

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const searchQuery = ref()
const isAddNewUnitDrawerVisible = ref(false)
const unitTypeFilter = ref()
const isUnitsFilterDialogVisible = ref(false)
const unitStatusFilter = ref()
const unitPropertyFilter = ref()
const unitRentFilter = ref(0)
const propertyListArr = ref()
const isUnitsCsvDialogVisible = ref(false)

const rentSliderMin = ref(0)
const rentSliderMax = ref(1000)


const resolveUnitsStatusVariant = stat => {

  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'vacant')
    return {
      color: 'success',
      text: 'Vacant',
    }
  if (statLowerCase === 'occupied')
    return {
      color: 'secondary',
      text: 'Occupied',
    }
 
  return {
    color: 'primary',
    text: 'No Status',
  }
}


// Headers
const headers = [
  {
    title: 'NAME',
    key: 'unitsData.unit_name',
  },
  {
    title: 'TYPE',
    key: 'unitsData.unit_type',
  },
  {
    title: 'RENT',
    key: 'unitsData.unit_rent',
  },
  {
    title: 'ROOMS',
    key: 'unitsData.unit_bedrooms',
  },
  {
    title: 'RESTROOMS',
    key: 'unitsData.unit_bathrooms_nos',
  },
  {
    title: 'SIZE(in sqmtrs)',
    key: 'unitsData.area_insqmts',
  },
  {
    title: 'PROPERTY',
    key: 'propertyName',
  },
  {
    title: 'STATUS',
    key: 'unitsData.unit_status',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
  },
]

const userListMeta = [
  {
    icon: 'tabler-home',
    color: 'primary',

    // title: 'Total Units',
    stats: '376',

    // percentage: +29,
    subtitle: 'Total Units',
  },
  {
    icon: 'tabler-home',
    color: 'secondary',

    // title: 'Occupied',
    stats: '100',

    // percentage: +18,
    subtitle: 'Occupied',
  },
  {
    icon: 'tabler-user-check',
    color: 'info',

    // title: 'Vacant',
    stats: '276',

    // percentage: -14,
    subtitle: 'Vacant',
  },
  {
    icon: 'tabler-tool',
    color: 'warning',

    // title: 'Under Maintenance',
    stats: '237',

    // percentage: +42,
    subtitle: 'Under Maintenance',
  },
]


const fetchedUnitsList = ref([])

const getFilteredUnits = () => {

}

function getAllUnits(){

  let queryData = {
    "userId": sessionStorage.getItem("userId"),
  }
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }

  axios({
    url: 'http://backend-rentings-env.eba-bdnqs3bn.me-south-1.elasticbeanstalk.com/prop-app/allunits/get',
    method: 'GET',
    params: queryData,
    headers: {
      'Authorization': sessionStorage.getItem("accessToken"),
    },
  }).then(response => {
    console.log(response)
    fetchedUnitsList.value = response.data.unitsData
  }).catch(error => {
    if(error.response.status === 401){
      refreshUserLogin()
    }
  })

}


const clearSelectedFilterOptions = () => {
  unitTypeFilter.value = ""
  unitPropertyFilter.value = ""
  unitStatusFilter.value = ""
}


onMounted(() => {
  getAllUnits()
  populatePropertiesList().then(res => {
    propertyListArr.value = res.data.propertiesData
  }).catch(err => {
    console.log(err)
  })

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

      <VSpacer />


      <VCol cols="12">
        <VCard title="Units">
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

            <VBtn
              size="38"
              color="secondary"
              title="upload Csv Units File"
              prepend-icon="tabler-cloud-upload"
              @click="isUnitsCsvDialogVisible = true"
            />



            <!-- 👉 Add user button -->
            <VBtn
              prepend-icon="tabler-plus"
              @click="isAddNewUnitDrawerVisible = true"
            >
              Add Units
            </VBtn>
          </VCardText>

          <VDivider />

          <!-- SECTION datatable -->
          <VDataTable
            :headers="headers"
            :items="fetchedUnitsList"
            :items-per-page="10"
          >
            <template #item.unitsData="{ item }">
              <div class="d-flex align-center">
                <!-- avatar -->
                
                <!--
                  <VAvatar
                  size="32"
                  :color="item.raw.unitsData.property_image ? '' : 'primary'"
                  :class="item.raw.details.property_image ? '' : 'v-avatar-light-bg primary--text'"
                  :variant="!item.raw.details.property_image ? 'tonal' : undefined"
                  >
                  <VImg
                  v-if="item.raw.unitsData.unit"
                  :src="'http://backend-rentings-env.eba-bdnqs3bn.me-south-1.elasticbeanstalk.com/media/'+item.raw.details.property_image"
                  />
                  <span v-else>{{ avatarText(item.raw.unitsData.unit_name) }}</span>
                  </VAvatar>  
                -->
               

                <div class="d-flex flex-column ms-3">
                  <RouterLink class="d-block font-weight-medium text--primary text-truncate">
                    {{ item.raw.unitsData.unit_name }}
                  </RouterLink>
                  <!-- <small>{{ item.raw.post }}</small> -->
                </div>
              </div>
            </template>


            <template #item.unitsData.unit_status="{ item }">
              <VChip
                :color="resolveUnitsStatusVariant(item.raw.unitsData.unit_status).color"
                size="small"
              >
                {{ resolveUnitsStatusVariant(item.raw.unitsData.unit_status).text }}
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

        <AddNewUnitDrawer v-model:isDrawerOpen="isAddNewUnitDrawerVisible" />
      </VCol>
    </VRow>
  </section>

  <VDialog
    v-model="isUnitsFilterDialogVisible"
    max-width="450"
  >
    <!-- Dialog Activator -->

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isUnitsFilterDialogVisible = !isUnitsFilterDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Select Filters">
      <VCardText>
        <VRow>
          <VCol cols="12">
            <AppSelect
              v-model="unitTypeFilter"
              :items="['room', 'shop', 'store', 'office', 'other']"
              label="Type"
            />
          </VCol>
          <VCol cols="12">
            <AppSelect
              v-model="unitStatusFilter"
              :items="['vacant', 'occupied']"
              label="Status"
            />
          </VCol>
          <VCol cols="12">
            <AppSelect
              v-model="unitPropertyFilter"
              :items="propertyListArr"
              item-title="propertyName"
              item-value="propertyId"
              label="Property"
            />
          </VCol>
          <VCol cols="12">
            <VSlider
              v-model="unitRentFilter"
              label="Rent"
              :max="rentSliderMax"
              :min="rentSliderMin"
              :step="1"
            >
              <template #append>
                <AppTextField
                  v-model="unitRentFilter"
                  type="number"
                  style="inline-size: 100px;"
                />
              </template>
            </VSlider>
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="clearSelectedFilterOptions"
        >
          Clear
        </VBtn>
        <VBtn @click="isUnitsFilterDialogVisible = false">
          Apply
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog
    v-model="isUnitsCsvDialogVisible"
    max-width="350"
  >
    <!-- Dialog Activator -->

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isUnitsCsvDialogVisible = !isUnitsCsvDialogVisible" />

    <!-- Dialog Content -->
    <VCard title="Upload Units File">
      <VCardText>
        Add Units from a .csv file upload below. 
        <p>
          Download a reference csv file 
          <VBtn
            size="28"
            color="info"
            prepend-icon="tabler-download"
          />
        </p>
      </VCardText>

      <VCardText>
        <VRow>
          <VCol cols="12">
            <VFileInput
              ref=""
              prepend-icon="tabler-file"
              label="Units CSV file"
              chips
              accept="image/*"
              density="compact"
              @change="imageUpload"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isUnitsCsvDialogVisible = false"
        >
          Cancel
        </VBtn>
        <VBtn @click="isUnitsCsvDialogVisible = false">
          Upload
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
