<script setup>
import {
requiredValidator,
} from '@validators'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDrawerOpen',
  'userData',
])


const tenantRefForm = ref()
const tenantFirstName = ref()
const tenantLastName = ref()
const tenantEmail = ref()
const tenantContactNumber = ref()
const tenantNationality = ref()
const tenantPassword = ref()
const tenantStatus = ref()
const startDateRange = ref()
const endDateRange = ref()
const unitDrawerAlert = ref({ show: false, message: null, color: null })
const isInputEnabled = ref(false)
const role = ref()
const plan = ref()
const status = ref()

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    // refForm.value?.reset()
    // refForm.value?.resetValidation()
  })
}

const createTenant = () => {
  tenantRefForm.value?.validate().then(({ valid }) => {
    if (valid) {

      let tenantData = {
        "userFirstname": tenantFirstName.value,
        "userLastname": tenantLastName.value,
        "contactNumber": tenantContactNumber.value,
        "userNationality": tenantNationality.value,
        "userStatus": tenantStatus.value,
        "userEmail": tenantEmail.value,
        "userPassword": tenantPassword.value,
      }

    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}





// eslint-disable-next-line sonarjs/cognitive-complexity






onMounted(() => {

})
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <AppDrawerHeaderSection
      title="Filter Tenants"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="tenantRefForm">
            <VRow>
              <!-- 👉 Property -->
              <VCol cols="12">
                <AppSelect
                  v-model="tenantFirstName"
                  :rules="[requiredValidator]"
                  label="Unit"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="tenantLastName"
                  :rules="[requiredValidator]"
                  label="Floor"
                />
              </VCol>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <AppSelect
                  v-model="tenantContactNumber"
                  :rules="[requiredValidator]"
                  label="Property"
                />
              </VCol>

              <VCol cols="12">
                <AppDateTimePicker
                  v-model="startDateRange"
                  label="Start Date"
                  :config="{ mode: 'range' }"
                />
              </VCol>

              <VCol cols="12">
                <AppDateTimePicker
                  v-model="endDateRange"
                  label="End Date"
                  :config="{ mode: 'range' }"
                />
              </VCol>


              <!-- 👉 Country -->
              <VCol cols="12">
                <AppTextField
                  v-model="tenantNationality"
                  :rules="[requiredValidator]"
                  label="Nationality"
                />
              </VCol>


              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect
                  v-model="tenantStatus"
                  label="Select Status"
                  :rules="[requiredValidator]"
                  :items="['Active', 'Inactive']"
                />
              </VCol>


              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  class="me-3"
                  @click="createTenant"
                >
                  Submit
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>

  <VSnackbar
    v-model="unitDrawerAlert.show"
    transition="fade-transition"
    location="botton center"
    :color="unitDrawerAlert.color"
  >
    {{ unitDrawerAlert.message }}
  </VSnackbar>
</template>
