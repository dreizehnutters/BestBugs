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
    {
        ICON: "crop_original",
        NAME: "Container 2",
        PATH: "/container"
      },
    {
        ICON: "crop_original",
        NAME: "Container 3",
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
  
  {
    COLOR: "pink",
    ICON: "shopping_card",
    NAME: "Breeding Status",
    VALUE: "2. Stage",
    KEY: "breed_status",
    FORMAT: "numb",
    PATH: "/experiments"
  }
];

const DEMO_HEADER = "Insectus BestBugs"

const ENDPOINTS = {
    "url":"http://100.100.148.223:8000",
    "current_data": "/current_data",
    "history":"/historical_data"
}


export {
    NAVBAR_ITEMS,
    WIDGET_ITEMS_DASHBOARD,
    DEMO_HEADER,
    ENDPOINTS
};