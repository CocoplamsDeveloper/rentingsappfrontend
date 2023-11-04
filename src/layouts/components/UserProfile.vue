<script setup>
import axios from '@axios'
import avatar1 from '@images/avatars/avatar-1.png'

const route = useRoute()
const router = useRouter()

const logoutConfirm = ref(false)

function userLogout(){

  let data = {
    userId: sessionStorage.getItem("userId"),
  }
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }
  if(sessionStorage.getItem("tokenId")){
    data['tokenId'] = sessionStorage.getItem("tokenId")
  }

  axios({
    url: "https://api.rentings.me/prop-app/user/logout",
    method: "get",
    params: data,
  }).then(response => {
    if (response.status === 200){
      sessionStorage.removeItem("userId"),
      sessionStorage.removeItem("accessToken"),
      sessionStorage.removeItem("tokenId")
      sessionStorage.removeItem("role")
      router.push('/login')
    }
  }).catch(error => {
    console.log(error)
    console.log(error.response.data)
  })

}
</script>

<template>
  <VDialog 
    v-model="logoutConfirm" 
    :width="500"
  >
    <DialogCloseBtn @click="logoutConfirm = !logoutConfirm" />
    <VCard title="Logout">
      <VCardText>
        Are you sure, you want to Logout!
      </VCardText>

      <VCardText class="d-flex justify-end">
        <VBtn 
          :style="{marginRight:'10px'}"
          @click="logoutConfirm = false"
        >
          No
        </VBtn>
        <VBtn @click="userLogout">
          Yes
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>

  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatar1" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              John Doe
            </VListItemTitle>
            <VListItemSubtitle>Admin</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-settings"
                size="22"
              />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>

          <!-- 👉 Pricing -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-currency-dollar"
                size="22"
              />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-help"
                size="22"
              />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logoutConfirm = true">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
