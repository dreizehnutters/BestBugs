#define DRY_SOIL_MIN 0
#define DRY_SOIL_MAX 300
#define HUMID_SOIL_MIN 300
#define HUMID_SOIL_MAX 700
#define WET_SOIL_MIN 700
#define WET_SOIL_MAX 950


const int analogInPin = A0;  // ESP8266 Analog Pin ADC0 = A0
int sensorValue = 0;

// Values
int drySoilValue = 0;
int humidSoilValue = 0;
int wetSoilValue = 0;

void setup() {
  // initialize serial communication at 115200
  Serial.begin(115200);
}

void loop() {
  // read the analog in value of the moisture sensor
  sensorValue = analogRead(analogInPin);
  
  // map it to the ranges of the moisture states
  // values can range from 0 to 100 (percent)
  drySoilValue = map(sensorValue, DRY_SOIL_MIN, DRY_SOIL_MAX, 0, 100);
  drySoilValue = constrain(drySoilValue, 0, 100);
  humidSoilValue = map(sensorValue, HUMID_SOIL_MIN, HUMID_SOIL_MAX, 0, 100);
  humidSoilValue = constrain(humidSoilValue, 0, 100);
  wetSoilValue = map(sensorValue, WET_SOIL_MIN, WET_SOIL_MAX, 0, 100);
  wetSoilValue = constrain(wetSoilValue, 0, 100);
  
  
  
  
  // print the readings in the Serial Monitor
  Serial.printf("Sensor Value = %d \n", sensorValue);
  Serial.printf("Dry Soil Value = %d %% \n", drySoilValue);
  Serial.printf("Humid Soil Value = %d %% \n", humidSoilValue);
  Serial.printf("Wet Soil Value = %d %% \n", wetSoilValue);

  delay(1000);
}
