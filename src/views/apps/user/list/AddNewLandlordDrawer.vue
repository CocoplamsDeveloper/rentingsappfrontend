<script setup>
import {
emailValidator,
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

const isFormValid = ref(false)
const refForm = ref()
const landlordDetailsToAdd = ref({
'firstName' : '',
'lastName' : '',
'email' : '',
'password' : '',
'nationality' : '',
'contactNumber' : '',
'landlordContactPerson' : '',
'landlordCompanyName' : '',
'status' : '',
'type': ''
})

const email = ref('')
const company = ref('')
const country = ref('')
const contact = ref('')
const role = ref()
const plan = ref()
const status = ref()

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)
  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

const onSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit('userData', {
        id: 0,
        fullName: fullName.value,
        company: company.value,
        role: role.value,
        country: country.value,
        contact: contact.value,
        email: email.value,
        currentPlan: plan.value,
        status: status.value,
        avatar: '',
        billing: 'Auto Debit',
      })
      emit('update:isDrawerOpen', false)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }
  })
}

const handleDrawerModelValueUpdate = val => {
  emit('update:isDrawerOpen', val)
}
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
      title="Add User"
      @cancel="closeNavigationDrawer"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.firstName"
                  :rules="[requiredValidator]"
                  label="First Name"
                />
              </VCol>


              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.lastName"
                  :rules="[requiredValidator]"
                  label="Last Name"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                />
              </VCol>

              <!-- 👉 company -->
              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.password"
                  :rules="[requiredValidator]"
                  label="Password"
                />
              </VCol>

              <!-- 👉 Country -->
              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.nationality"
                  :rules="[requiredValidator]"
                  label="Nationality"
                />
              </VCol>

              <!-- 👉 Contact -->
              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.contactNumber"
                  :rules="[requiredValidator]"
                  label="Contact"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.landlordCompanyName"
                  :rules="[requiredValidator]"
                  label="Company Name"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.landlordContactPerson"
                  :rules="[requiredValidator]"
                  label="Contact Person Name"
                />
              </VCol>

              <VCol cols="12">
                <AppSelect
                  v-model="landlordDetailsToAdd.type"
                  label="Type"
                  :rules="[requiredValidator]"
                  :items="['Demo', 'Paid']"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.bankName"
                  label="Bank Name"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.bankAccountNo"
                  label="Bank Account No."
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.bankIbanNo"
                  label="Bank Iban No."
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="landlordDetailsToAdd.comments"
                  label="Comments"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <AppSelect
                  v-model="landlordDetailsToAdd.status"
                  label="Status"
                  :rules="[requiredValidator]"
                  :items="['Active', 'Inactive']"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
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
</template>
