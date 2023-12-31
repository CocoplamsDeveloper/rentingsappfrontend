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
  
  return axios('http://127.0.0.1:8000/prop-app/landlord-prop/get', {
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
  
  axios('http://127.0.0.1:8000/prop-app/login/refresh', {
    params: queryData,
  }).then(response => {
    if(response.status == 200){
      data = response.data.access_tokens
      sessionStorage.setItem("accessToken", data.accessToken)
      sessionStorage.setItem("tokenId", data.refreshTokenId)
      router.push('/')
    }
    else{
      router.push('/login')
    }
  }).catch(error => {
    router.push('/login')
  })
}

function getFacilities(){
  let queryData = {
    "userId": sessionStorage.getItem('userId')
  }

  return axios.get("http://localhost:8000/prop-app/facility/get", {
  params: queryData,
  headers: {
  'Authorization': sessionStorage.getItem("accessToken")
  }
  })

} 


export { getFacilities, populatePropertiesList, refreshUserLogin }





