#include <FastLED.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

#define MOISTURE_SENSOR_ANALOG_PIN A0
#define MOISTURE_SENSOR_MIN 0
#define MOISTURE_SENSOR_MAX 950
#define LED_PIN 5
#define N_LEDS 3
#define SAT 255
#define VAL 255

// 0 < moistureValue < MOISTURE_TOO_DRY -> more water needed (red LEDs)
// MOISTURE_TOO_DRY < moistureValue < MOISTURE_TOO_WET -> moisture ok (green LEDs)
// MOISTURE_TOO_WET < moistureValue < 100 -> too wet, raise temperature (blue LEDs)
#define MOISTURE_TOO_DRY 30
#define MOISTURE_TOO_WET 60



CRGB leds[N_LEDS];
CRGB led_color = CRGB::Black;


int readMoisture() {
  // initialize data
  int sensorValue = 0;
  int moistureValue = 0;

  // read the analog in value of the moisture sensor
  sensorValue = analogRead(MOISTURE_SENSOR_ANALOG_PIN);

  // map it to the moisture rating
  moistureValue = map(sensorValue, MOISTURE_SENSOR_MIN, MOISTURE_SENSOR_MAX, 0, 100);
  moistureValue = constrain(moistureValue, 0, 100);

  return(moistureValue);
}

void postMyData(){
    if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
 
      StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
      JsonObject& JSONencoder = JSONbuffer.createObject(); 
   
      JSONencoder["sensorType"] = "Temperature";
   
      JsonArray& values = JSONencoder.createNestedArray("values"); //JSON array
      values.add(20); //Add value to array
      values.add(21); //Add value to array
      values.add(23); //Add value to array
   
      JsonArray& timestamps = JSONencoder.createNestedArray("timestamps"); //JSON array
      timestamps.add("10:10"); //Add value to array
      timestamps.add("10:20"); //Add value to array
      timestamps.add("10:30"); //Add value to array
   
      char JSONmessageBuffer[300];
      JSONencoder.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
      Serial.println(JSONmessageBuffer);
   
      HTTPClient http;    //Declare object of class HTTPClient
   
      http.begin("http://anteph.pythonanywhere.com/postjson");      //Specify request destination
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
  // LED setup
  FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, N_LEDS);
  // WiFi setup
  WiFi.begin("BestBugsLAN", "yummybugs<3");   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }
  postMyData();
}

void loop() {
  int hue = 0;
  int sat = SAT;
  int val = VAL;
  int moistureValue = readMoisture();  
  Serial.printf("Moisture Value = %d %% \n", readMoisture());
  
  hue = map(moistureValue, 0, 100, 0, 160);
  for(int i=0; i<N_LEDS; i++){
    leds[i] = CHSV(hue, sat, val);
  }
  FastLED.show();

  delay(1000);
}
