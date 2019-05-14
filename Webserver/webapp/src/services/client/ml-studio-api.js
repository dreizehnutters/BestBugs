import { ENDPOINTS } from "../../constants";

import { toast } from "react-toastify";

function getCurrentData() {
    return fetch(
        ENDPOINTS.url + ENDPOINTS.current_data,
         {
          "method": "GET",
          //"credentials": "include",
          "headers": {"Content-Type": "text/plain", "accept": "application/json"},
          //"body": text
        }).then(response => {
            return response.json();
        });
}


  export {
    getCurrentData
  }