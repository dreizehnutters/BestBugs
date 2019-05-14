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

function getHistoryData() {
    return fetch(
        ENDPOINTS.url + ENDPOINTS.history,
         {
          "method": "GET",
          //"credentials": "include",
          "headers": {"Content-Type": "text/plain", "accept": "application/json"},
          //"body": text
        }).then(response => {
            return response.json();
        });
}

function sendFeeding(data) {
    return fetch(
        ENDPOINTS.url + ENDPOINTS.feeding,
         {
          "method": "POST",
          //"credentials": "include",
          "headers": {"Content-Type": "text/plain", "accept": "application/json"},
          "body": JSON.stringify(data),
        }).then(response => {
            return response.json();
        });
}


  export {
    getCurrentData,
    getHistoryData,
    sendFeeding
  }