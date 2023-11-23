<script setup>
import AppSelect from '@/@core/components/app-form-elements/AppSelect.vue'
import { populatePropertiesList, refreshUserLogin } from '@/common/reusing_functions'
import AddNewUnitDrawer from '@/views/apps/units/AddNewUnitDrawer.vue'
import EditUnitsDrawer from '@/views/apps/units/EditUnitsDrawer.vue'
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

const unitsSearchQuery = ref()
const isAddNewUnitDrawerVisible = ref(false)
const unitTypeFilter = ref(null)
const isUnitsFilterDialogVisible = ref(false)
const unitStatusFilter = ref(null)
const isEditUnitDrawerVisible = ref(false)
const unitPropertyFilter = ref(null)
const unitRentFilter = ref(null)
const fetchedUnitsList = ref([])
const propertyListArr = ref()
const isUnitsCsvDialogVisible = ref(false)
const unitCsvFile = ref()
const rentSliderMin = ref(0)
const rentSliderMax = ref(1000)
const selectedPropertyForCsv = ref()
const unitsCsvRef = ref()
const deleteUnitConfirm = ref(false)
const unitPageAlert = ref({ show: false, message: null, color: null })
const singleUnit = ref({
  "propertyId": '',
  "propertyName": '',
  "unitId": '',
  "name": '',
  "type": '',
  "category": '',
  "bedrooms": '',
  "bathrooms": '',
  "kitchens": '',
  "rent": '',
  "size": '',
  "status": '',
  "floor": '',
})
const unitToDelete = ref(null)
const deleteUnitDialogText = ref()
const totalUnits = ref()
const vacantUnits = ref()
const occupiedUnits = ref()
const undermaintUnits = ref()

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
  if (statLowerCase === 'under maintenance')
    return {
      color: 'warning',
      text: 'Under Maintenance',
    }
 
  return {
    color: 'primary',
    text: 'No Status',
  }
}

const csvUnitsFileUpload = (e) => {
    unitCsvFile.value = e.target.files[0]
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
    title: 'Floor',
    key: 'unitsData.unit_floor',
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
    stats: totalUnits,

    // percentage: +29,
    subtitle: 'Total Units',
  },
  {
    icon: 'tabler-home',
    color: 'secondary',

    // title: 'Occupied',
    stats: occupiedUnits,

    // percentage: +18,
    subtitle: 'Occupied',
  },
  {
    icon: 'tabler-user-check',
    color: 'info',

    // title: 'Vacant',
    stats: vacantUnits,

    // percentage: -14,
    subtitle: 'Vacant',
  },
  {
    icon: 'tabler-tool',
    color: 'warning',

    // title: 'Under Maintenance',
    stats: undermaintUnits,

    // percentage: +42,
    subtitle: 'Under Maintenance',
  },
]

const editUnitItem = async (unitId) => {

  let task = new Promise((resolve, reject) => {
  fetchedUnitsList.value.forEach((element)=>{
    if(element.unitId === unitId){
      fillUnitObj(element)
    }
  })
  resolve(true)
  })
  await task
  isEditUnitDrawerVisible.value = true

}

function fillUnitObj(unit){
  let obj = singleUnit.value
  let details = unit.unitsData
  obj.propertyId = unit.propertyId
  obj.propertyName = unit.propertyName
  obj.unitId = unit.unitId
  obj.name = details.unit_name
  obj.type = details.unit_type
  obj.category = details.unit_category
  obj.rent = details.unit_rent
  obj.size = details.area_insqmts
  obj.floor = details.unit_floor
  obj.status = unit.status
  obj.bedrooms = details.unit_bedrooms
  obj.bathrooms = details.unit_bathrooms_nos
  obj.kitchens = details.unit_kitchens
}




const getFilteredUnits = () => {

  let queryData = {
    "userId" : sessionStorage.getItem("userId"),
  }
  if(unitTypeFilter.value){
    queryData['type'] = unitTypeFilter.value
  }
  if(unitStatusFilter.value){
    queryData['status'] = unitStatusFilter.value
  }
  if(unitPropertyFilter.value){
    queryData['property'] = unitPropertyFilter.value
  }
  if(unitRentFilter.value){
    queryData['rent'] = unitRentFilter.value
  }

  axios.get("http://localhost:8000/prop-app/units/filter", {
    params: queryData,
    headers: {
      'Authorization' : sessionStorage.getItem('accessToken')
    }
  }).then((response) => {
    fetchedUnitsList.value = response.data.filteredData
    isUnitsFilterDialogVisible.value = false
  }).catch((error) => {
    if(error.response.status === 403){
      refreshUserLogin();
    }
  })

}

function unitsSearchedResults(){
    if(unitsSearchQuery.value !== null || unitsSearchQuery.value !== ''){

      let queryData = {
        "userId" : sessionStorage.getItem('userId'),
        "searchParam" : unitsSearchQuery.value
      }

      axios.get("http://localhost:8000/prop-app/unit/search", {
        params: queryData,
        headers: {
          'Authorization' : sessionStorage.getItem('accessToken')
        }        
      }).then((response) => {
        fetchedUnitsList.value = response.data.result
      }).catch((error) => {
        if(error.response.status === 403){
          refreshUserLogin();
        }
      })

    }
}

function deleteUnitItem(unit){

  deleteUnitDialogText.value = "Are you sure you want to delete "+unit.unitsData.unit_name+"?"
  unitToDelete.value = unit.unitId
  deleteUnitConfirm.value = true

}

function deleteUnit(){
  if(unitToDelete.value){
  let queryData = {
    "userId" : sessionStorage.getItem("userId"),
    "unitId" : unitToDelete.value
  }

  axios.delete("http://127.0.0.1:8000/prop-app/unit/delete", {
    params: queryData,
    headers:{
      'Authorization' : sessionStorage.getItem("accessToken")
    }
  }).then(response => {
    if(response.status == 200){
      unitPageAlert.value.message = response.data.message
      unitPageAlert.value.color = "success"
      unitPageAlert.value.show = true
      deleteUnitConfirm.value = false
      getAllUnits()
    }
  }).catch(error => {
    unitPageAlert.value.message = error.response.data.message
    unitPageAlert.value.color = "error"
    unitPageAlert.value.show = true
    if(error.response.status == 403){
      refreshUserLogin()
    }
  })
  }
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
    url: 'http://127.0.0.1:8000/prop-app/allunits/get',
    method: 'GET',
    params: queryData,
    headers: {
      'Authorization': sessionStorage.getItem("accessToken"),
    },
  }).then(response => {
    console.log(response)
    fetchedUnitsList.value = response.data.unitsData
    rentSliderMax.value = response.data.currentMaxRent
  }).catch(error => {
    if(error.response.status === 401){
      refreshUserLogin()
    }
  })

}

function uploadCsvUnits(){


  if(!selectedPropertyForCsv.value){
    unitPageAlert.message = "Kindly select property first"
    unitPageAlert.color = "warning"
    unitPageAlert.show = true
    return
  }

  const formData = new FormData()
  formData.append("userId", sessionStorage.getItem("userId"))
  formData.append("propertyId", parseInt(selectedPropertyForCsv.value))
  if(unitCsvFile.value){
    formData.append("unitscsvfile", unitCsvFile.value)
  }


  axios.post("http://localhost:8000/prop-app/units/csv-add", formData,{
    headers: {
      'Authorization' : sessionStorage.getItem("accessToken")
    }
  }).then((response) => {
    if(response.status == 200){
      unitPageAlert.message = response.data.message
      unitPageAlert.color = "success"
      unitPageAlert.show = true
    }
  }).catch((error) => {
    if(error.response.status == 403){
      refreshUserLogin()
    }
  })
}


const clearSelectedFilterOptions = () => {
  unitTypeFilter.value = ""
  unitPropertyFilter.value = ""
  unitStatusFilter.value = ""
  unitRentFilter.value = ""
  getAllUnits()
  isUnitsFilterDialogVisible.value = false
}

function getUnitsStats(){

  let queryData = {
    "userId" :  sessionStorage.getItem("userId")
  }

  axios.get("http://127.0.0.1:8000/prop-app/unit/stats", {
    params: queryData,
    headers: {
      'Authorization': sessionStorage.getItem('accessToken')
    }
  }).then(response => {
    if(response.status == 200){
      let data = response.data
      totalUnits.value = data.totalUnits
      occupiedUnits.value = data.occupiedUnits
      vacantUnits.value = data.vacantUnits
      undermaintUnits.value = data.underMaintenanceUnits
    }
  }).catch((error) => {
    if(error.response.status == 403){
      refreshUserLogin()
    }
  })
}

onMounted(() => {
  getAllUnits()
  populatePropertiesList().then(res => {
    propertyListArr.value = res.data.propertiesData
  }).catch(err => {
    console.log(err)
  })
  getUnitsStats()

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
                v-model="unitsSearchQuery"
                placeholder="Search"
                density="compact"
                append-inner-icon="tabler-search"
                @keyup.enter="unitsSearchedResults"
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
                  :src="'http://127.0.0.1:8000/media/'+item.raw.details.property_image"
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
                :color="resolveUnitsStatusVariant(item.raw.status).color"
                size="small"
              >
                {{ resolveUnitsStatusVariant(item.raw.status).text }}
              </VChip>
            </template>

            <!-- Actions -->
            <template #item.actions="{ item }">
              <div class="d-flex gap-1">
                <IconBtn @click="editUnitItem(item.raw.unitId)">
                  <VIcon icon="mdi-pencil-outline" />
                </IconBtn>
                <IconBtn @click="deleteUnitItem(item.raw)">
                  <VIcon icon="mdi-delete-outline" />
                </IconBtn>
              </div>
            </template>
          </VDataTable>
          <!-- SECTION -->
        </VCard>

        <AddNewUnitDrawer v-model:isDrawerOpen="isAddNewUnitDrawerVisible" @get-all-units="getAllUnits"/>
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
              :items="['Room', 'Shop', 'Office']"
              label="Type"
            />
          </VCol>
          <VCol cols="12">
            <AppSelect
              v-model="unitStatusFilter"
              :items="['vacant', 'occupied', 'under maintenance']"
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
        <VBtn @click="getFilteredUnits">
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
            <AppSelect
            v-model="selectedPropertyForCsv"
            label="Select Property"
            prepend-icon="tabler-building"
            :items="propertyListArr"
            item-title="propertyName"
            item-value="propertyId"
            />
          </VCol>

          <VCol cols="12">
            <VFileInput
              ref="unitsCsvRef"
              prepend-icon="tabler-file"
              label="Upload csv file"
              chips
              density="compact"
              @change="csvUnitsFileUpload"
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
        <VBtn @click="uploadCsvUnits">
          Upload
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VDialog 
    v-model="deleteUnitConfirm" 
    :width="500"
  >
    <DialogCloseBtn @click="deleteUnitConfirm = !deleteUnitConfirm" />
    <VCard title="Delete">
      <VCardText>
        {{ deleteUnitDialogText }}
      </VCardText>

      <VCardText class="d-flex justify-end">
        <VBtn 
          :style="{marginRight:'10px'}"
          @click="deleteUnitConfirm = false"
        >
          No
        </VBtn>
        <VBtn @click="deleteUnit">
          Yes
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <EditUnitsDrawer 
    v-model:isDrawerOpen="isEditUnitDrawerVisible"
    :single-unit="singleUnit"
    @get-all-units="getAllUnits"
  />


  <VSnackbar
    v-model="unitPageAlert.show"
    transition="fade-transition"
    location="botton center"
    :color="unitPageAlert.color"
  >
    {{ unitPageAlert.message }}
  </VSnackbar>
</template>
