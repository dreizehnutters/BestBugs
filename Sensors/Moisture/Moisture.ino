#define MOISTURE_SENSOR_ANALOG_PIN A0
#define MOISTURE_SENSOR_MIN 0
#define MOISTURE_SENSOR_MAX 950

int sensorValue = 0;

// moisture value ranges from 0 to 100 %
int moistureValue = 0;

void setup() {
  // initialize serial communication at 115200
  Serial.begin(115200);
}

void loop() {
  // read the analog in value of the moisture sensor
  sensorValue = analogRead(MOISTURE_SENSOR_ANALOG_PIN);

  // map it to the moisture rating
  moistureValue = map(sensorValue, MOISTURE_SENSOR_MIN, MOISTURE_SENSOR_MAX, 0, 100);
  moistureValue = constrain(moistureValue, 0, 100);  
  
  // print the readings in the Serial Monitor
  Serial.printf("Sensor Value = %d \n", sensorValue);
  Serial.printf("Moisture Value = %d %% \n", moistureValue);

  delay(1000);
}
