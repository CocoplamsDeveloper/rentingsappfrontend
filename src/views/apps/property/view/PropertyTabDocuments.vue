<script setup>
import { refreshUserLogin } from '@/common/reusing_functions';
import axios from '@axios';
import { useRoute } from 'vue-router';
import { VDataTable } from 'vuetify/labs/VDataTable';
const propertyDocumentsList = ref([])
const isAddPropDocDialogVisible = ref(false)
const propertyDocumentsAlert = ref({ show: false, message: null, color: null })
const route = useRoute()

// Recent devices Headers
const headers = [
{
    title: 'NAME',
    key: 'document_name',
  },
  {
    title: 'type',
    key: 'document_type',
  },
  {
    title: 'ACTION',
    key: 'actions',
  },
]
const documentName = ref()
const newDocument = ref()
const newDocumentRef = ref()
const documentType = ref()




function getPropertyDocuments(){

let queryData = {
  "userId" : sessionStorage.getItem('userId'),
  "propertyId": route.params.id
}

axios.get("http://localhost:8000/prop-app/property/docs", {
  params: queryData,
  headers: {
    'Authorization' : sessionStorage.getItem('accessToken')
  }
}).then((response) => {
  if(response.status == 200){
    propertyDocumentsList.value = response.data.documents
  }
}).catch((error) => {
  if(error.response.status == 403){
    refreshUserLogin()
  }
})
}

const downloadPropertyDocument = (id) => {
  let queryData = {
    "userId" : sessionStorage.getItem("userId"),
    "documentId": id
  }

  axios.get("http://localhost:8000/prop-app/prop-doc/download", {
    params: queryData,
    responseType: 'blob',
    headers: {
      'Authorization' : sessionStorage.getItem("accessToken")
    }
  }).then((response) => {
    let fileType = response.data.type
    let fileExt = fileType.split('/')[1]
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = downloadUrl
    let current = new Date()
    let docName = "property_document"+'_'+current.toLocaleDateString()+"_"+current.toLocaleTimeString()+"."+fileExt
    link.setAttribute('download', docName)
    document.body.appendChild(link)
    link.click()
    link.remove()
  }).catch((error)=>{
    if(error.response.status === 403){
      refreshUserLogin()
    }
    else{
      propertyDocumentsAlert.value.message = error.response.data.message
      propertyDocumentsAlert.value.color = "error"
      propertyDocumentsAlert.value.show = true
    }
  })
}

const handleDocUpload = (e) => {
  let file = e.target.files[0]
  let derivedType = file.type.split('/')[0]
  if(documentType.value === 'Image' && derivedType !== 'image'){
    propertyDocumentsAlert.value.message = "Invalid Image type!"
    propertyDocumentsAlert.value.color = "warning"
    propertyDocumentsAlert.value.show = true
    newDocumentRef?.value.reset()
    return
  }
  if(documentType.value === 'Document' && derivedType !== 'application'){
    propertyDocumentsAlert.value.message = "Invalid document type!"
    propertyDocumentsAlert.value.color = "warning"
    propertyDocumentsAlert.value.show = true
    newDocumentRef?.value.reset()
    return
  }
  newDocument.value = file
}

function afterDocumentCheck(){
  documentName.value = ""
  documentType.value = ""
  newDocumentRef?.value.reset()
  isAddPropDocDialogVisible.value = false
  getPropertyDocuments()
}

const addNewPropertyDocument = () => {

  if(documentName.value === "property image"){
    return propertyDocumentsList.value.forEach((ele) => {
      if(ele.document_name === documentName.value){
        propertyDocumentsAlert.value.message = "property Image exists! Please refill document name field"
        propertyDocumentsAlert.value.color = "warning"
        propertyDocumentsAlert.value.show = true
      }
    })
    return
  }

  let docType = newDocument.value.type.split('/')[0]
  if(documentType.value === 'Image' &&  docType !== 'image'){
    propertyDocumentsAlert.value.message = "Invalid Image type!"
    propertyDocumentsAlert.value.color = "warning"
    propertyDocumentsAlert.value.show = true
    return
  }
  if(documentType.value === 'Document' && docType !== 'application'){
    propertyDocumentsAlert.value.message = "Invalid document type!"
    propertyDocumentsAlert.value.color = "warning"
    propertyDocumentsAlert.value.show = true
    return
  }

  const formData = new FormData()
  formData.append("userId", sessionStorage.getItem("userId"))
  formData.append("propertyId", route.params.id)
  formData.append("documentName", documentName.value)
  formData.append("documentType", documentType.value)
  if(newDocument.value){
    formData.append("document", newDocument.value)
  }
  axios.post("http://localhost:8000/prop-app/prop-doc/add", formData, {
    headers: {
      'Authorization' : sessionStorage.getItem("accessToken")
    }
  }).then((response) => {
    console.log(response)
    if(response.status == 201){
    propertyDocumentsAlert.value.message = response.data.message
    propertyDocumentsAlert.value.color = "success"
    propertyDocumentsAlert.value.show = true
    afterDocumentCheck();
    }
  }).catch((error) => {
    propertyDocumentsAlert.value.message = error.response.data.message
    propertyDocumentsAlert.value.color = "error"
    propertyDocumentsAlert.value.show = true
    if(error.response.status === 403){
      refreshUserLogin()
    }
  })
}

const clearAddDocDialog = () => {
  documentName.value = ""
  documentType.value = ""
  newDocumentRef?.value.reset()
  isAddPropDocDialogVisible.value = false
}

const resolveDocType = (document) => {
  if(document.image){
    return "Image"
  }
  else{
    return "Document"
  }
}

onMounted(() => {
  getPropertyDocuments()
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard>
        <div class="d-flex align-center justify-space-between">
        <VCardText>
          <h4>Documents</h4>
        </VCardText>
        <VBtn
          prepend-icon="tabler-plus"  
          :style="{marginRight: '10px'}"
          @click="isAddPropDocDialogVisible=true"
          >
            Add
        </VBtn>
        </div>
        <VDivider />
        <VDataTable
          :items="propertyDocumentsList"
          :headers="headers"
          :items-per-page="10"

        >
          <template #item.document_type="{ item }">
            <div class="d-flex">
              <span>{{resolveDocType(item.raw)}}</span>
            </div>
          </template>

          <template #item.actions="{ item }">
              <div class="d-flex gap-1">
                <!--
                  <IconBtn @click="isEditPropertyDrawerVisible = true">
                  <VIcon icon="mdi-pencil-outline" />
                  </IconBtn>  
                -->
               
                <!-- <IconBtn @click="editPropertyItem(item.raw.propertyId)"> -->
                <IconBtn @click="downloadPropertyDocument(item.raw.document_id)">
                  <VIcon icon="tabler-download" />
                </IconBtn>
                <!-- <IconBtn @click="deleteDocument(item.raw.document_id)">
                  <VIcon icon="mdi-delete-outline" />
                </IconBtn> -->
              </div>
            </template>
        </VDataTable>
      </VCard>
    </VCol>
  </VRow>

  <VDialog
    v-model="isAddPropDocDialogVisible"
    max-width="350"
    persistent
  >
    <!-- Dialog Activator -->

    <!-- Dialog close btn -->
    <DialogCloseBtn @click="clearAddDocDialog" />

    <!-- Dialog Content -->
    <VCard title="Add New Document">

      <VCardText>
        <VRow>
          <VCol cols="12">
            <AppTextField
            v-model="documentName"
            label="Document Name"
            />
          </VCol>

          <VCol cols="12">
            <AppSelect
            v-model="documentType"
            label="Document type"
            :items="['Image', 'Document']"
            />
          </VCol>

          <VCol cols="12">
            <label>Document</label>
            <VFileInput
              ref="newDocumentRef"
              prepend-icon="tabler-file"
              label="Add document"
              chips
              density="compact"
              @change="handleDocUpload"
            />
          </VCol>
        </VRow>
      </VCardText>

      <VCardText class="d-flex justify-end flex-wrap gap-3">
        <VBtn
          variant="tonal"
          color="secondary"
          @click="isAddPropDocDialogVisible = false"
        >
          Cancel
        </VBtn>
        <VBtn @click="addNewPropertyDocument">
          Upload
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VSnackbar
    v-model="propertyDocumentsAlert.show"
    transition="fade-transition"
    location="botton center"
    :color="propertyDocumentsAlert.color"
  >
    {{ propertyDocumentsAlert.message }}
  </VSnackbar>


</template>
