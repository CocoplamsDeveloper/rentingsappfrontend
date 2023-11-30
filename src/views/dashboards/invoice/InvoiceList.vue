<script setup>
import { computed, ref } from 'vue'

import { VDataTableServer } from 'vuetify/labs/VDataTable'

import { useInvoiceStore } from '@/views/apps/invoice/useInvoiceStore'

const invoiceListStore = useInvoiceStore()
const searchQuery = ref('')
const dateRange = ref('')
const selectedStatus = ref('')
const totalInvoices = ref(0)
const selectedRows = ref([])

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const isLoading = ref(false)
const currentPage = ref(1)

currentPage.value = options.value.page

// Dummy data for the table
const invoices = ref([
  {
    id: 5036,
    issuedDate: '2023-11-19',
    client: {
      address: '78083 Laura Pines',
      company: 'Richardson and Sons LLC',
      companyEmail: 'pwillis@cross.org',
      country: 'Bhutan',
      contact: '(687) 660-2473',
      name: 'Andrew Burns',
    },
    service: 'Unlimited Extended License',
    total: 3171,
    avatar: '/src/assets/images/avatars/avatar-3.png',
    invoiceStatus: 'Paid',
    balance: -205,
    dueDate: '2023-11-25',
  },
  {
    id: 5038,
    issuedDate: '2023-11-19',
    client: {
      address: '123 Main Street',
      company: 'ABC Corporation',
      companyEmail: 'jdoe@abc.com',
      country: 'USA',
      contact: '(123) 456-7890',
      name: 'John Doe',
    },
    service: 'Software License',
    total: 1500,
    avatar: '/src/assets/images/avatars/avatar-4.png',
    invoiceStatus: 'Partial Payment',
    balance: 750,
    dueDate: '2023-11-30',
  },
  {
    id: 5039,
    issuedDate: '2023-11-20',
    client: {
      address: '456 Elm Street',
      company: 'XYZ Ltd',
      companyEmail: 'jsmith@xyz.com',
      country: 'Canada',
      contact: '(987) 654-3210',
      name: 'Jane Smith',
    },
    service: 'Consulting Services',
    total: 2000,
    avatar: '/src/assets/images/avatars/avatar-5.png',
    invoiceStatus: 'Draft',
    balance: 2000,
    dueDate: '2023-12-05',
  },
  {
    id: 5040,
    issuedDate: '2023-11-20',
    client: {
      address: '789 Oak Street',
      company: 'Acme Inc',
      companyEmail: 'rjones@acme.com',
      country: 'USA',
      contact: '(111) 222-3333',
      name: 'Robert Jones',
    },
    service: 'Product Purchase',
    total: 500,
    avatar: '/src/assets/images/avatars/avatar-6.png',
    invoiceStatus: 'Sent',
    balance: 0,
    dueDate: '2023-11-30',
  },
  {
    id: 5041,
    issuedDate: '2023-11-21',
    client: {
      address: '101 Maple Avenue',
      company: 'Maple Enterprises',
      companyEmail: 'jwilliams@maple.com',
      country: 'Canada',
      contact: '(555) 888-9999',
      name: 'James Williams',
    },
    service: 'Web Design',
    total: 1800,
    avatar: '/src/assets/images/avatars/avatar-7.png',
    invoiceStatus: 'Downloaded',
    balance: 0,
    dueDate: '2023-12-10',
  },
  {
    id: 5042,
    issuedDate: '2023-11-22',
    client: {
      address: '222 Pine Street',
      company: 'Pine Corporation',
      companyEmail: 'ksmith@pine.com',
      country: 'USA',
      contact: '(222) 333-4444',
      name: 'Karen Smith',
    },
    service: 'Maintenance Contract',
    total: 2500,
    avatar: '/src/assets/images/avatars/avatar-8.png',
    invoiceStatus: 'Past Due',
    balance: 1000,
    dueDate: '2023-11-15',
  },
  {
    id: 5043,
    issuedDate: '2023-11-23',
    client: {
      address: '333 Elm Street',
      company: 'Elm Enterprises',
      companyEmail: 'btaylor@elm.com',
      country: 'Canada',
      contact: '(888) 999-1111',
      name: 'Barbara Taylor',
    },
    service: 'Software License',
    total: 1200,
    avatar: '/src/assets/images/avatars/avatar-9.png',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: '2023-12-03',
  },
  {
    id: 5044,
    issuedDate: '2023-11-24',
    client: {
      address: '444 Oak Street',
      company: 'Oak Ltd',
      companyEmail: 'mroberts@oak.com',
      country: 'USA',
      contact: '(123) 123-4567',
      name: 'Michael Roberts',
    },
    service: 'Consulting Services',
    total: 3000,
    avatar: '/src/assets/images/avatars/avatar-10.png',
    invoiceStatus: 'Partial Payment',
    balance: 1500,
    dueDate: '2023-12-07',
  },
  {
    id: 5045,
    issuedDate: '2023-11-25',
    client: {
      address: '555 Maple Avenue',
      company: 'Maple Enterprises',
      companyEmail: 'gwilson@maple.com',
      country: 'Canada',
      contact: '(777) 666-5555',
      name: 'George Wilson',
    },
    service: 'Product Purchase',
    total: 800,
    avatar: '/src/assets/images/avatars/avatar-11.png',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: '2023-12-01',
  },
  {
    id: 5046,
    issuedDate: '2023-11-26',
    client: {
      address: '666 Pine Street',
      company: 'Pine Corporation',
      companyEmail: 'lcooper@pine.com',
      country: 'USA',
      contact: '(555) 444-3333',
      name: 'Lisa Cooper',
    },
    service: 'Web Design',
    total: 2200,
    avatar: '/src/assets/images/avatars/avatar-12.png',
    invoiceStatus: 'Draft',
    balance: 2200,
    dueDate: '2023-12-05',
  },
  {
    id: 5047,
    issuedDate: '2023-11-27',
    client: {
      address: '777 Elm Street',
      company: 'Elm Enterprises',
      companyEmail: 'jgreen@elm.com',
      country: 'Canada',
      contact: '(999) 888-7777',
      name: 'John Green',
    },
    service: 'Maintenance Contract',
    total: 2800,
    avatar: '/src/assets/images/avatars/avatar-13.png',
    invoiceStatus: 'Sent',
    balance: 0,
    dueDate: '2023-12-20',
  },
  {
    id: 5048,
    issuedDate: '2023-11-28',
    client: {
      address: '888 Oak Street',
      company: 'Oak Ltd',
      companyEmail: 'sbrown@oak.com',
      country: 'USA',
      contact: '(222) 333-4444',
      name: 'Susan Brown',
    },
    service: 'Software License',
    total: 1800,
    avatar: '/src/assets/images/avatars/avatar-14.png',
    invoiceStatus: 'Downloaded',
    balance: 0,
    dueDate: '2023-12-15',
  },
])




// 👉 headers
const headers = [
  {
    title: '#ID',
    key: 'id',
  },
  {
    title: 'Trending',
    key: 'trending',
    sortable: false,
  },
  {
    title: 'Client',
    key: 'client',
  },
  {
    title: 'Total',
    key: 'total',
  },
  {
    title: 'Issued Date',
    key: 'date',
  },
  {
    title: 'Balance',
    key: 'balance',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]


// 👉 Fetch Invoices
const fetchInvoices = (query, currentStatus, firstDate, lastDate, option) => {
  isLoading.value = true
  invoiceListStore.fetchInvoices({
    q: query,
    status: currentStatus,
    startDate: firstDate,
    endDate: lastDate,
    options: option,
  }).then(response => {
    invoices.value = response.data.invoices
    totalInvoices.value = response.data.totalInvoices
    options.value.page = response.data.page
  }).catch(error => {
    console.log(error)
  })
  isLoading.value = false
}

// 👉 Invoice balance variant resolver
const resolveInvoiceBalanceVariant = (balance, total) => {
  if (balance === total)
    return {
      status: 'Unpaid',
      chip: { color: 'error' },
    }
  if (balance === 0)
    return {
      status: 'Paid',
      chip: { color: 'success' },
    }
  
  return {
    status: balance,
    chip: { variant: 'text' },
  }
}

const resolveInvoiceStatusVariantAndIcon = status => {
  if (status === 'Partial Payment')
    return {
      variant: 'success',
      icon: 'tabler-circle-half-2',
    }
  if (status === 'Paid')
    return {
      variant: 'warning',
      icon: 'tabler-chart-pie',
    }
  if (status === 'Downloaded')
    return {
      variant: 'info',
      icon: 'tabler-arrow-down-circle',
    }
  if (status === 'Draft')
    return {
      variant: 'primary',
      icon: 'tabler-device-floppy',
    }
  if (status === 'Sent')
    return {
      variant: 'secondary',
      icon: 'tabler-circle-check',
    }
  if (status === 'Past Due')
    return {
      variant: 'error',
      icon: 'tabler-alert-circle',
    }
  
  return {
    variant: 'secondary',
    icon: 'tabler-x',
  }
}

const computedMoreList = computed(() => {
  return paramId => [
    {
      title: 'Download',
      value: 'download',
      prependIcon: 'tabler-download',
    },
    {
      title: 'Edit',
      value: 'edit',
      prependIcon: 'tabler-pencil',
      to: {
        name: 'apps-invoice-edit-id',
        params: { id: paramId },
      },
    },
    {
      title: 'Duplicate',
      value: 'duplicate',
      prependIcon: 'tabler-layers-intersect',
    },
  ]
})

const deleteInvoice = id => {
  invoiceListStore.deleteInvoice(id).then(() => {
    fetchInvoices(searchQuery.value, selectedStatus.value, dateRange.value?.split('to')[0], dateRange.value?.split('to')[1], options.value)
  }).catch(error => {
    console.log(error)
  })
}

// 👉 watch for data table options like itemsPerPage,page,searchQuery,sortBy etc...
// watchEffect(() => {
//   const [start, end] = dateRange.value ? dateRange.value.split('to') : ''

//   fetchInvoices(searchQuery.value, selectedStatus.value, start, end, options.value)
// })
const logClientName = item => {
  console.log(item)
}
</script>

<template>
  <div>
    <VCard id="invoice-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <VSelect
            v-model="options.itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="width: 6.25rem;"
          />
          <VBtn
            prepend-icon="mdi-plus"
            @click="createInvoice"
          >
            Create Invoice
          </VBtn>
        </div>
        <VSpacer />
        <div class="d-flex align-center flex-wrap gap-4">
          <div class="invoice-list-filter">
            <VTextField
              v-model="searchQuery"
              placeholder="Search Invoice"
              dense
            />
          </div>
          <div class="invoice-list-filter">
            <VSelect
              v-model="selectedStatus"
              placeholder="Select Status"
              clearable
              clear-icon="mdi-close"
              single-line
              :items="['Downloaded', 'Draft', 'Sent', 'Paid', 'Partial Payment', 'Past Due']"
            />
          </div>
        </div>
      </VCardText>
      <VDivider />
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="options.itemsPerPage"
        v-model:page="options.page"
        :loading="isLoading"
        :items-length="totalInvoices"
        :headers="headers"
        :items="invoices"
        class="text-no-wrap"
        @update:options="options = $event"
      >
        <template #column.trending>
          <VIcon
            size="22"
            icon="tabler-trending-up"
          />
        </template> 
       

        <!--         
          <template #item.id="{ item }">
          <RouterLink :to="{ name: 'apps-invoice-preview-id', params: { id: item.value } }">
          #{{ item?.raw?.id }}
          </RouterLink>
          </template> 
        -->

        <template #item.trending="{ item }">
          <VTooltip>
            <template #activator="{ props }">
              <VAvatar
                :size="30"
                v-bind="props"
                :color="resolveInvoiceStatusVariantAndIcon(item?.raw?.invoiceStatus).variant"
                variant="tonal"
              >
                <VIcon
                  :size="20"
                  :icon="resolveInvoiceStatusVariantAndIcon(item?.raw?.invoiceStatus).icon"
                />
              </VAvatar>
            </template> 
           
            <p class="mb-0">
              {{ item?.raw?.invoiceStatus }}
            </p>
            <p class="mb-0">
              Balance: {{ item?.raw?.balance }}
            </p>
            <p class="mb-0">
              Due date: {{ item?.raw?.dueDate }}
            </p>
          </VTooltip>
        </template>

        
        <template #item.client="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="38"
              :color="!item.raw.avatar.length ? resolveInvoiceStatusVariantAndIcon(item.raw.invoiceStatus).variant : undefined"
              :variant="!item.raw.avatar.length ? 'tonal' : undefined"
              class="me-3"
            >
              <VImg
                v-if="item.raw.avatar.length"
                :src="item.raw.avatar"
              />
              <span v-else>{{ avatarText(item.raw.client.name) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-body-1 font-weight-medium mb-0">
                {{ item.raw.client.name }}
              </h6>
              <span class="text-sm text-disabled">{{ item.raw.client.companyEmail }}</span>
            </div>
          </div>
        </template>

        
        <template #item.total="{ item }">
          ${{ item?.raw?.total }}
        </template>

        <template #item.date="{ item }">
          {{ item?.raw?.issuedDate }}
        </template>

        
        <template #item.balance="{ item }">
          <VChip
            v-if="typeof ((resolveInvoiceBalanceVariant(item?.raw?.balance, item?.raw?.total)).status) === 'string'"
            :color="resolveInvoiceBalanceVariant(item?.raw?.balance, item?.raw?.total).chip.color"
            label
          >
            {{ (resolveInvoiceBalanceVariant(item?.raw?.balance, item?.raw?.total)).status }}
          </VChip>

          <template v-else>
            <span class="text-base">
              {{ Number((resolveInvoiceBalanceVariant(item?.raw?.balance, item?.raw?.total)).status) > 0 ? `$${(resolveInvoiceBalanceVariant(item?.raw?.balance, item?.raw?.total)).status}` : `-$${Math.abs(Number((resolveInvoiceBalanceVariant(item?.raw?.balance, item?.raw?.total)).status))}` }}
            </span>
          </template>
        </template> 
         
        <template #item.actions="{ item }">
          <IconBtn @click="deleteInvoice(item?.raw?.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>

          <IconBtn>
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <MoreBtn
            :menu-list="computedMoreList(item.raw.id)"
            item-props
            color="undefined"
          />
        </template> 
       
        <template #bottom>
          <VDivider />
          <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-disabled mb-0">
              <!-- {{ paginationMeta(options, totalInvoices) }} -->
            </p>

            <VPagination
              v-model="options.page"
              :length="Math.ceil(totalInvoices / options.itemsPerPage)"
              :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalInvoices / options.itemsPerPage)"
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
      </VDataTableServer>
    </VCard>
  </div>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 12rem;
  }
}
</style>

