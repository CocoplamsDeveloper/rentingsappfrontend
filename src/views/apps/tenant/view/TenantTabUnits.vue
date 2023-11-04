<script setup>
import AppCombobox from '@/@core/components/app-form-elements/AppCombobox.vue'
import { requiredValidator } from '@/@core/utils/validators'
import { paginationMeta } from '@/@fake-db/utils'
import { populatePropertiesList, refreshUserLogin } from '@/common/reusing_functions'
import axios from '@axios'
import { VDataTable } from 'vuetify/labs/VDataTable'


const props = defineProps({
  tenantData: {
    type: Object,
    required: true,
  },
})

const route = useRoute()

const tenancyDetailsHeaders = [
  {
    title: 'Name',
    key: 'unitName',
  },
  {
    title: 'Floor',
    key: 'unitFloor',
  },
  {
    title: 'Property',
    key: 'details.property_id_id',
  },
  {
    title: 'StartDate',
    key: 'details.tenancy_start_date',
  },
  {
    title: 'EndDate',
    key: 'details.tenancy_end_date',
  },
  {
    title: 'Rent',
    key: 'details.monthly_rent',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
]

const search = ref('')

const options = ref({
  itemsPerPage: 5,
  page: 1,
})

const tenantTabAlertSnackbar = ref({ show: false, message: null, color: null })
const availableUnits = ref([])
const selectedPropertyToAssign = ref()
const selectedFloorToAssign = ref()
const selectedUnitToAssign = ref()
const selectedUnitRent = ref()
const isAssignUnitDialogVisible = ref(false)
const propertyList = ref([])
const floorsArr = ref([])
const contractDocument = ref()
const tenancyStartDate = ref('')
const tenancyEndDate = ref('')
const assignUnitForm = ref()
const contractDocRef = ref()
const contractFileChangeRef = ref()
const updatedContractDoc = ref()
const selectedContractPeriod = ref()


function getFloorUnits(){

  if(selectedPropertyToAssign.value && selectedFloorToAssign.value >= 0){
    let sendData = {
      "userId": sessionStorage.getItem("userId"),
    }

    if(!sessionStorage.getItem("accessToken")){
      router.push('/login')

      return 
    }
    sendData['propertyId'] = selectedPropertyToAssign.value
    sendData['floor'] = selectedFloorToAssign.value

    axios.get("http://localhost:8000/prop-app/floors/units", {
      params: sendData,
      headers: {
        'Authorization': sessionStorage.getItem('accessToken'),
      },
    }).then(response => {
      availableUnits.value = response.data.units
    }).catch(error => {
      console.log(error)
      if(error.response.status){
        refreshUserLogin()
      }
    })
  }
}


const fillUnitRent = () => {
  if(selectedUnitToAssign.value){
    availableUnits.value.forEach(element =>{
      if(element.unit_id === selectedUnitToAssign.value){
        selectedUnitRent.value = element.unit_rent
      }
    })
  }
}

const closeUnitAssignForm = () => {
  isAssignUnitDialogVisible.value = false
  assignUnitForm?.value.reset()
}

const calculateContractEndDate = () => {
  
  let start = new Date(tenancyStartDate.value)
  let months = selectedContractPeriod.value
  let days = months*30
  var end = new Date(tenancyStartDate.value);
  end.setDate(end.getDate() + days);
  // let futureDate = new Date(new Date().getFullYear(),months-1, start.getDate())
  console.log(start.getDate(), months, end)

} 

const handleContractDoc = e => {
  contractDocument.value = e.target.files[0]
  let fileName = contractDocument.value.name
  let fileSize = contractDocument.value.size/1000
  let res = fileValidation(fileName, fileSize)
  if (!res){
    contractDocRef?.value.reset()
  }
}

const changedContractDoc = e => {
  updatedContractDoc.value = e.target.files[0]
  let fileName = updatedContractDoc.value.name
  let fileSize = updatedContractDoc.value.size/1000
  let res = fileValidation(fileName, fileSize)
  if (!res){
    contractFileChangeRef?.value.reset()
  }
}

const downloadContractDocument = (Id, tenantName) => {

  axios.get("http://localhost:8000/prop-app/contract-doc/download", {
    params: {
      "userId": sessionStorage.getItem('userId'),
      "tenancyId": Id,
    },
    responseType: 'blob',
    headers: {
      'Authorization': sessionStorage.getItem("accessToken"),
    },
  }).then(response => {
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')

    link.href = downloadUrl
    let docName = tenantName+"_contract.pdf"
    link.setAttribute('download', docName)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }).catch(error => {
    tenantTabAlertSnackbar.value.message = error.response.data.message
    tenantTabAlertSnackbar.value.color = "error"
    tenantTabAlertSnackbar.value.show = true
  })

}

const fileValidation = (fileName, fileSize) => {
  let fileExt =  fileName.split('.')[fileName.split('.').length-1].toLowerCase()
  if((fileExt) !== 'pdf'){
    tenantTabAlertSnackbar.value.message = "please upload a pdf file, other type of file not accepted!"
    tenantTabAlertSnackbar.value.color = "error"
    tenantTabAlertSnackbar.value.show = true

    return false
  }
  if(fileSize > 2048){
    tenantTabAlertSnackbar.value.message = "please upload a file of size upto 2 MB only"
    tenantTabAlertSnackbar.value.color = "error"
    tenantTabAlertSnackbar.value.show = true

    return false
  }

  return true
}

const createTenancyRecord = () =>{

  assignUnitForm?.value.validate().then(({ valid: isValid }) => {
    if(isValid){

      let tenancyData = {
        "propertyId": selectedPropertyToAssign.value,
        "tenantId": route.params.id,
        "floorNo": selectedFloorToAssign.value,
        "unitId": selectedUnitToAssign.value,
        "tenancyRent": selectedUnitRent.value,
        "startDate": tenancyStartDate.value,
        "endDate": tenancyEndDate.value,
        "contractMonths": selectedContractPeriod.value,
      }

      console.log(tenancyData)

      calculateContractEndDate()
      //     let currentDate = new Date()
      //     if(new Date(tenancyStartDate.value).getTime() <= currentDate.getTime()){
      //       tenantTabAlertSnackbar.value.message = "Please enter a valid Start Date"
      //       tenantTabAlertSnackbar.value.color = "error"
      //       tenantTabAlertSnackbar.value.show = true

      //       return
      //     }
      //     if(new Date(tenancyEndDate.value).getTime() <= currentDate.getTime()){
      //       tenantTabAlertSnackbar.value.message = "Please enter a valid End Date"
      //       tenantTabAlertSnackbar.value.color = "error"
      //       tenantTabAlertSnackbar.value.show = true

      //       return
      //     }
      //     const formData = new FormData()

      //     formData.append('userId', sessionStorage.getItem('userId'))
      //     formData.append('tenancyData', JSON.stringify(tenancyData))
      //     if(contractDocument.value){
      //       formData.append('contractDoc', contractDocument.value)
      //     }

      //     axios.post("http://localhost:8000/prop-app/tenancy-record/create", formData, {
      //       headers: {
      //         'Authorization': sessionStorage.getItem("accessToken"),
      //       },
      //     }).then(response => {
      //       tenantTabAlertSnackbar.value.message = response.data.message
      //       tenantTabAlertSnackbar.value.color = "success"
      //       tenantTabAlertSnackbar.value.show = true
      //       assignUnitForm?.value.reset()
      //       isAssignUnitDialogVisible.value = false
      //     }).catch(error => {
      //       tenantTabAlertSnackbar.value.message = error.response.data.message
      //       tenantTabAlertSnackbar.value.color = "error"
      //       tenantTabAlertSnackbar.value.show = true
      //       assignUnitForm?.value.reset()
      //       isAssignUnitDialogVisible.value = false
      //     })
      //   }
    }
  })
}


const resolveUnitFloorName = floor => {

  if(floor == 0){
    return "Ground Floor"
  }
  else{
    return "Floor "+floor
  }
}

function updateContractDocument(tenancyId){

  if(!updatedContractDoc.value){
    tenantTabAlertSnackbar.value.message = "please select the file to upload"
    tenantTabAlertSnackbar.value.color = "error"
    tenantTabAlertSnackbar.value.show = true
    
    return
  }

  const formData = new FormData()

  formData.append('updatedTenancyDoc', updatedContractDoc.value)
  formData.append('userId', sessionStorage.getItem('userId'))
  formData.append('tenancyId', tenancyId)

  axios.post("http://localhost:8000/prop-app/contract-doc/update", formData, {
    headers: {
      'Authorization': sessionStorage.getItem("accessToken"),
    },
  }).then(response => {
    tenantTabAlertSnackbar.value.message = response.data.message
    tenantTabAlertSnackbar.value.color = "success"
    tenantTabAlertSnackbar.value.show = true
    contractFileChangeRef?.value.reset()
  }).catch(error => {
    tenantTabAlertSnackbar.value.message = error.response.data.message
    tenantTabAlertSnackbar.value.color = "error"
    tenantTabAlertSnackbar.value.show = true
    contractFileChangeRef?.value.reset()
  })



}

const resolvePropertyNameFromId = propertyId => {
  console.log("line 189", propertyId)
  let propertyName = null
  propertyList.value.forEach(ele => {
    if(ele.propertyId === propertyId){
      console.log("line 192", propertyId)
      console.log(ele.propertyName)
      propertyName = ele.propertyName
    }
  })
  
  return propertyName
}


// eslint-disable-next-line sonarjs/cognitive-complexity
function populateAssignUnitFloorsDropdown(){

  if(selectedPropertyToAssign.value){
    propertyList.value.forEach(element => {
      if(element.propertyId === selectedPropertyToAssign.value){

        floorsArr.value = []
        if(element.floors === 0){
          floorsArr.value.push({
            "text": "ground floor",
            "value": 0,
          })
        
          return
        }
        else{
          for(let i = 0; i < element.floors; i++){

            let key = "floor "+i
            if(i == 0){
              key = "ground floor"
            }
            floorsArr.value.push({
              "text": key,
              "value": i,
            })
          }
        }
      }
    })
  }
}

watchEffect(getFloorUnits)
watchEffect(populateAssignUnitFloorsDropdown)
watchEffect(fillUnitRent)

onMounted(() => {
  populatePropertiesList().then(response => {
    propertyList.value = response.data.propertiesData
  }).catch(error => {
    console.log(error)
    if(error.response.status){
      refreshUserLogin()
    }
  }) 
})
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <!-- 👉 User Project List Table -->

        <!-- 👉 Search  -->
        <VCardText class="d-flex flex-wrap">
          <h2>Units</h2>
          <VSpacer />
          <VBtn
            prepend-icon="tabler-plus"
            @click="isAssignUnitDialogVisible = true"
          >
            Assign
          </VBtn>
        </VCardText>

        <VCardText v-if="props.tenantData.tenancy">
          <VCardText 
            v-if="props.tenantData.tenancy.tenancyContractId === '--'"
            :style="{textAlign: 'center'}"
          >
            Units Not Assigned Yet!
          </VCardText>


          <VDataTable
            v-else
            v-model:page="options.page"
            :headers="tenancyDetailsHeaders"
            :items="props.tenantData.tenancy"
            :search="search"
            :items-per-page="options.itemsPerPage"
            @update:options="options = $event"
          >
            <!-- projects -->

            <template #item.details.property_id_id="{ item }">
              <div class="d-flex">
                <span>{{ resolvePropertyNameFromId(item.raw.details.property_id_id) }}</span>
              </div>
            </template>




            <template #item.name="{ item }">
              <div class="d-flex">
                <VAvatar
                  :size="34"
                  class="me-3"
                  :image="item.raw.logo"
                />
                <div>
                  <p class="font-weight-medium mb-0">
                    {{ item.raw.name }}
                  </p>
                  <p class="text-xs text-medium-emphasis mb-0">
                    {{ item.raw.project }}
                  </p>
                </div>
              </div>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex gap-1">
                <IconBtn @click="editPropertyItem(item.raw.propertyId)">
                  <VIcon icon="tabler-eye" />
                </IconBtn>
              </div>
            </template>


            <!-- pagination -->
            <template #bottom>
              <VDivider />
              <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
                <p class="text-sm text-disabled mb-0">
                  {{ paginationMeta(options, props.tenantData.tenancy.length) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(props.tenantData.tenancy.length / options.itemsPerPage)"
                  :total-visible="Math.ceil(props.tenantData.tenancy.length / options.itemsPerPage)"
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
          </VDataTable>
          <!--
            <VCardText v-else>
            <VCard>
            <VCol cols="12">
            <VList>
            <VListItem>
            {{ props.tenantData.tenancy.unitName.toUpperCase() }}
            <VBtn
            prepend-icon="tabler-file-download"
            color="warning"
            size="26"
            :style="{marginLeft: '30px'}"
            @click="downloadContractDocument(props.tenantData.tenancy.tenancyContractId, props.tenantData.tenant.user_fullname)"
            >
            <VTooltip
            activator="parent"
            location="top"
            >
            Download Contract Document
            </VTooltip>
            </VBtn>
            </VListItem>
            <VListItem>Property: {{ resolvePropertyNameFromId(props.tenantData.tenancy.propertyId) }}</VListItem>
            <VListItem>Rent: {{ props.tenantData.tenancy.tenantRent }}</VListItem>
            <VListItem>Start Date: {{ props.tenantData.tenancy.ContractStartDate }}</VListItem>
            <VListItem>End Date: {{ props.tenantData.tenancy.ContractEndDate }}</VListItem>
            <VListItem>Floor: {{ resolveUnitFloorName(props.tenantData.tenancy.unitFloor) }}</VListItem>
            <VListItem>
            <p>Add Contract File Below</p>
            <VRow>
            <VCol
            cols="12"
            md="6"
            >
            <VFileInput
            ref="contractFileChangeRef"
            density="compact"
            label="Contract"
            @change="changedContractDoc"
            />
            </VCol>
            <VCol
            cols="8"
            md="6"
            >
            <VBtn
            prepend-icon="tabler-upload"
            size="38"
            @click="updateContractDocument(props.tenantData.tenancy.tenancyContractId)"
            >
            <VTooltip
            activator="parent"
            location="top"
            >
            if file already exists, this upload will replace it.
            </VTooltip>
            </VBtn>
            </VCol>
            </VRow>
            </VListItem>
            </VList>
            </VCol>
            </VCard>
            </VCardText> 
          -->
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <VDialog
    v-model="isAssignUnitDialogVisible"
    max-width="600"
    persistent
  > 
    <DialogCloseBtn @click="isAssignUnitDialogVisible = !isAssignUnitDialogVisible" />

    <VCard title="Assign Unit">
      <VCardText>
        <VForm ref="assignUnitForm">
          <VRow>
            <VCol
              cols="12"
              sm="6"
            >
              <AppSelect
                v-model="selectedPropertyToAssign"
                label="Select Property"
                :items="propertyList"
                item-title="propertyName"
                item-value="propertyId"
                :rules="[requiredValidator]"
                chips
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <AppSelect
                v-model="selectedFloorToAssign"
                label="Select Floor"
                :items="floorsArr"
                item-title="text"
                item-value="value"
                :rules="[requiredValidator]"
                chips
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <AppSelect
                v-model="selectedUnitToAssign"
                :items="availableUnits"
                item-title="unit_name"
                item-value="unit_id"
                :rules="[requiredValidator]"
                label="Select Unit"
                chips
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <AppTextField
                v-model="selectedUnitRent"
                :rules="[requiredValidator]"
                label="Monthly Rent"
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <AppCombobox
                v-model="selectedContractPeriod"
                :items="[3, 6, 12, 18, 24]"
                :rules="[requiredValidator]"
                label="Select Contract Period(Months)"
                chips
              />
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <AppDateTimePicker
                v-model="tenancyStartDate"
                :rules="[requiredValidator]"
                label="Contract Start Date"
              />
            </VCol>
            <VCol
              cols="12"
              sm="6"
            >
              <AppDateTimePicker
                v-model="tenancyEndDate"
                label="Contract End Date"
                :rules="[requiredValidator]"
              />
            </VCol>
            <VCol cols="12">
              <label>Contract Document</label>
              <VFileInput
                ref="contractDocRef"
                label="Document"
                @change="handleContractDoc"
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="closeUnitAssignForm"
        >
          Close
        </VBtn>
        <VBtn @click="createTenancyRecord">
          Save
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VSnackbar
    v-model="tenantTabAlertSnackbar.show"
    transition="fade-transition"
    location="botton center"
    :color="tenantTabAlertSnackbar.color"
  >
    {{ tenantTabAlertSnackbar.message }}
  </VSnackbar>
</template>
