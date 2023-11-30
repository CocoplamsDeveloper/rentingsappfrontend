<script setup>
import { ref } from 'vue';
import { VDataTable } from 'vuetify/labs/VDataTable';

const propertyInvoicesList = ref()
const headers = [
{
    title: 'NAME',
    key: 'invoice_name',
  },
  {
    title: 'category',
    key: 'invoice_type',
  },
  {
    title: 'Amount',
    key: 'invoice_amount'
  },
  {
    title: 'Status',
    key: 'invoice_status'
  },
]

</script>

<template>
  <VRow>
    <!-- 👉 Current Plan -->
    <VCol cols="12">
      <VCard title="Invoices">
        <VDivider />
        <VDataTable
          :items="propertyInvoicesList"
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
</template>
