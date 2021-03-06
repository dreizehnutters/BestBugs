#include <FastLED.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

#define MOISTURE_SENSOR_ANALOG_PIN A0
#define MOISTURE_SENSOR_MIN 0
#define MOISTURE_SENSOR_MAX 950
#define LED_PIN 5
#define N_LEDS 17
#define SAT 255
#define VAL 255

#define POST_INTERVAL_MS 10000

// 0 < moistureValue < MOISTURE_TOO_DRY -> more water needed (red LEDs)
// MOISTURE_TOO_DRY < moistureValue < MOISTURE_TOO_WET -> moisture ok (green LEDs)
// MOISTURE_TOO_WET < moistureValue < 100 -> too wet, raise temperature (blue LEDs)
#define MOISTURE_TOO_DRY 30
#define MOISTURE_TOO_WET 60


#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_BME680.h"
#define SEALEVELPRESSURE_HPA (1013.25)
Adafruit_BME680 bme; // I2C


CRGB leds[N_LEDS];
CRGB led_color = CRGB::Black;
float lastTemperature = 24.1;


unsigned long postTimer;

int readMoisture(){
  // initialize data
  int sensorValue = 0;
  int moistureValue = 0;

  // read the analog in value of the moisture sensor
  sensorValue = analogRead(MOISTURE_SENSOR_ANALOG_PIN);

  // map it to the moisture rating
  moistureValue = map(sensorValue, MOISTURE_SENSOR_MIN, MOISTURE_SENSOR_MAX / 2, 0, 100);
  moistureValue = constrain(moistureValue, 0, 100);

  return(moistureValue);
}

float readTemperature(){
  if (! bme.performReading()) {
    Serial.println("Failed to perform reading :( Returning old temperature value");
    return(lastTemperature);
  }
  float temperature = bme.temperature;
  lastTemperature = temperature;
  Serial.print("Temperature = ");
  Serial.print(temperature);
  Serial.println(" *C");
  return(temperature);
}

void postMyData(int moisture, float temperature){
    if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
      StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
      JsonObject& JSONencoder = JSONbuffer.createObject(); 

      JSONencoder["current_moisture"] = moisture;
      JSONencoder["current_temp"] = temperature;
   
      char JSONmessageBuffer[300];
      JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
      Serial.println(JSONmessageBuffer);
   
      HTTPClient http;    //Declare object of class HTTPClient
   
      http.begin("http://192.168.137.1:8000/containers/1");      //Specify request destination
      http.addHeader("Content-Type", "application/json");  //Specify content-type header
   
      int httpCode = http.POST(JSONmessageBuffer);   //Send the request
      String payload = http.getString();                                        //Get the response payload
   
      Serial.println(httpCode);   //Print HTTP return code
      Serial.println(payload);    //Print request response payload
   
      http.end();  //Close connection
 
  } else {
 
    Serial.println("Error in WiFi connection");
 
  }
 
}


void setup() {
  // initialize serial communication at 115200
  Serial.begin(115200);
  
  // BME680 setup
  while (!Serial);
  Serial.println(F("BME680 test"));

  if (!bme.begin()) {
    Serial.println("Could not find a valid BME680 sensor, check wiring!");
    while (1);
  }

  // Set up oversampling and filter initialization
  bme.setTemperatureOversampling(BME680_OS_8X);
  bme.setHumidityOversampling(BME680_OS_2X);
  bme.setPressureOversampling(BME680_OS_4X);
  bme.setIIRFilterSize(BME680_FILTER_SIZE_3);
  bme.setGasHeater(320, 150); // 320*C for 150 ms
  
  // LED setup
  FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, N_LEDS);
  
  // WiFi setup
  WiFi.begin("BestBugsLAN", "yummybugs");   //WiFi connection
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }

  postTimer = millis();
}

void loop() {
  int hue = 0;
  int sat = SAT;
  int val = VAL;
  int moistureValue = readMoisture();
  float temperatureValue = readTemperature();
  Serial.printf("Moisture Value = %d %% \n", readMoisture());
  
  hue = map(moistureValue, 0, 100, 0, 160);
  for(int i=0; i<N_LEDS; i++){
    leds[i] = CHSV(hue, sat, val);
  }
  FastLED.show();

  if((millis() - postTimer) > POST_INTERVAL_MS) {
    postMyData(moistureValue, temperatureValue);
    postTimer = millis();
  }
  
  delay(500);
}
