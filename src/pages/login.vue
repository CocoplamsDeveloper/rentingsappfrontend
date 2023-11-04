<script setup>

import axios from '@axios'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'
// import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'




const route = useRoute()
const router = useRouter()
// const ability = useAppAbility()

const authThemeImg = useGenerateImageVariant(authV2LoginIllustrationLight, authV2LoginIllustrationDark, authV2LoginIllustrationBorderedLight, authV2LoginIllustrationBorderedDark, true)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)
const isPasswordVisible = ref(false)

// const refVForm = ref()

const email = ref()
const password = ref()
const rememberMe = ref(false)
const loginScreenAlert = ref(false)
const loginScreenAlertMessage = ref("Nothing")

function loginUsers (){
  console.log(email.value)
  console.log(password.value)
  let data = {
    userEmail: email.value,
    userPassword: password.value,
  }
  axios({
    url: "http://127.0.0.1:8000/prop-app/user/login",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  }).then(response=>{
    console.log(response)
    if(response.status === 200){
      let data = response.data.userData
      sessionStorage.setItem("userId", data.userId)
      sessionStorage.setItem("accessToken", data.accessToken)
      sessionStorage.setItem("tokenId", data.refreshTokenId)
      sessionStorage.setItem("role", data.userRole)
      router.push('/')
    }
      
  }).catch(error => {
    console.log(error.response.data.message)
    loginScreenAlertMessage.value = error.response.data.message
    loginScreenAlert.value = true
  })

  // axios.post('http://localhost:8000/properties/user/login', {
  //   email: email.value,
  //   password: password.value,
  // }).then(r => {
  //   console.log(r.data)

  // const { accessToken, userData, userAbilities } = r.data

  // // sessionStorage.setItem('userAbilities', JSON.stringify(userAbilities))
  // // ability.update(userAbilities)
  // sesssionStorage.setItem('userData', JSON.stringify(userData))
  // sessionStorage.setItem('accessToken', JSON.stringify(accessToken))

  // Redirect to `to` query if exist or redirect to index route
  // router.replace(route.query.to ? String(route.query.to) : '/')
  // }).catch(e => {
  //   const { errors: formErrors } = e.response.data

  //   errors.value = formErrors
  //   console.error(e.response.data)
  // })

}
</script>

<template>
  <VSnackbar 
    v-model="loginScreenAlert"
    color="error"
  >
    {{ loginScreenAlertMessage }}
    <template #actions>
      <VBtn
        color="white"
        variant="text"
        @click="loginScreenAlert = false"
      >
        Close
      </VBtn>
    </template>
  </VSnackbar>


  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol
      lg="8"
      class="d-none d-lg-flex"
    >
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg
          :src="authThemeMask"
          class="auth-footer-mask"
        />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="mb-6"
          />

          <h5 class="text-h5 mb-1">
            Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
          </h5>

          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>

        <!--
          <VCardText>
          <VAlert
          color="primary"
          variant="tonal"
          >
          <p class="text-caption mb-2">
          Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
          </p>

          <p class="text-caption mb-0">
          Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
          </p>
          </VAlert>
          </VCardText> 
        -->

        <VCardText>
          <VForm>
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  autofocus
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="password"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>

                <VBtn
                  block
                  type="button"
                  @click="loginUsers"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <!--
                <VCol
                cols="12"
                class="text-center"
                >
                <span>New on our platform?</span>

                <a
                class="text-primary ms-2"
                href="#"
                >
                Create an account
                </a>
                </VCol> 
              -->

              <!--
                <VCol
                cols="12"
                class="d-flex align-center"
                >
                <VDivider />

                <span class="mx-4">or</span>

                <VDivider />
                </VCol> 
              -->

              <!-- auth providers -->
              <!-- <VCol -->
              <!-- cols="12" -->
              <!-- class="text-center" -->
              <!-- > -->
              <!-- <AuthProvider /> -->
              <!-- </VCol> -->
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
