import router from '@/router'
import axios from '@axios'



function populatePropertiesList(){
  let queryData =  {
    "userId": sessionStorage.getItem('userId'),
  }
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }
  
  return axios.get(import.meta.env.VITE_API_URL+'/prop-app/landlord-prop/get', {
    params: queryData,
    headers: {
      "Authorization": sessionStorage.getItem("AccessToken"),
    },
  })

}

function refreshUserLogin(){
  let queryData =  {
    "userId": sessionStorage.getItem('userId'),
    "refreshTokenId": sessionStorage.getItem('tokenId'),
  }
  if(!sessionStorage.getItem("accessToken")){
    router.push('/login')

    return 
  }
  
  axios.get(import.meta.env.VITE_API_URL+'/prop-app/login/refresh', {
    params: queryData,
  }).then(response => {
    if(response.status == 200){
      data = response.data.access_tokens
      sessionStorage.setItem("accessToken", data.accessToken)
      sessionStorage.setItem("tokenId", data.refreshTokenId)
    }
    else{
      router.push('/login')
    }
  }).catch(error => {
    router.push('/login')
  })
}

export { populatePropertiesList, refreshUserLogin }





