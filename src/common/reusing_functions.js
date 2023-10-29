import axios from '@axios'



function populatePropertiesList(){
  let queryData =  {
    "userId": sessionStorage.getItem('userId'),
  }
  
  return axios('http://localhost:8000/prop-app/landlord-prop/get', {
    params: queryData,
    headers: {
      "Authorization": sessionStorage.getItem("AccessToken"),
    },
  })

}

export default populatePropertiesList





