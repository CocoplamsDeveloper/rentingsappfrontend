<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable';

import { ref } from 'vue';

const propertyUnitsList = ref([])

const headers = [
{
    title: 'NAME',
    key: 'unit_name',
  },
  {
    title: 'type',
    key: 'unit_type',
  },
  {
    title: 'Floor',
    key: 'unit_floor'
  },
  {
    title: 'Status',
    key: 'status',
  },
]



</script>

<template>
  <VRow>
    <!-- 👉 Current Plan -->
    <VCol cols="12">
      <VCard title="Units">
        <VDivider />
        <VDataTable
          :items="propertyUnitsList"
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

<!-- <style lang="scss">
.billing-address-table {
  tr {
    td:first-child {
      inline-size: 148px;
    }
  }
}
</style> -->
