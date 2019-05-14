const NAVBAR_ITEMS = [
    {
        ICON: "home",
        NAME: "Dashboard",
        PATH: "/dashboard"
      },
    {
        ICON: "crop_original",
        NAME: "Container 1",
        PATH: "/container"
      },

];

const WIDGET_ITEMS_DASHBOARD = [
  {
    COLOR: "light-green",
    ICON: "opacity",
    NAME: "Current Humidity",
    VALUE: "88%",
    KEY: "current_moisture",
    FORMAT: " %",
    PATH: "/datasets"
  },
  {
    COLOR: "cyan",
    ICON: "wb_sunny",
    NAME: "Current Temperature",
    VALUE: "30°C",
    KEY: "current_temp",
    FORMAT: " °C",
    PATH: "/models"
  },
  /**
  {
    COLOR: "pink",
    ICON: "shopping_card",
    NAME: "Current Weight",
    VALUE: "2,3 kg",
    KEY: "experimentsCount",
    FORMAT: "numb",
    PATH: "/experiments"
  }**/
];

const DEMO_HEADER = "Insectus BestBugs"

const ENDPOINTS = {
    "url":"http://100.100.148.223:8000",
    "current_data": "/current_data"
}


export {
    NAVBAR_ITEMS,
    WIDGET_ITEMS_DASHBOARD,
    DEMO_HEADER,
    ENDPOINTS
};