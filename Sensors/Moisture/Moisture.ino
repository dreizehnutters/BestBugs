#include <FastLED.h>
#include "bme680.h"
#include "bme680.c"
#include "bme680_defs.h"

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

CRGB leds[N_LEDS];
CRGB led_color = CRGB::Black;


// BME //////////////////////////////////////////////////////////////////////////////////////

struct bme680_dev gas_sensor;
gas_sensor.dev_id = BME680_I2C_ADDR_PRIMARY;
gas_sensor.intf = BME680_I2C_INTF;
gas_sensor.read = user_i2c_read;
gas_sensor.write = user_i2c_write;
gas_sensor.delay_ms = user_delay_ms;
/* amb_temp can be set to 25 prior to configuring the gas sensor 
 * or by performing a few tempegrature readings without operating the gas sensor.
 */
gas_sensor.amb_temp = 25;
uint8_t set_required_settings;

/* Set the temperature, pressure and humidity settings */
gas_sensor.tph_sett.os_hum = BME680_OS_2X;
gas_sensor.tph_sett.os_pres = BME680_OS_4X;
gas_sensor.tph_sett.os_temp = BME680_OS_8X;
gas_sensor.tph_sett.filter = BME680_FILTER_SIZE_3;

/* Set the remaining gas sensor settings and link the heating profile */
gas_sensor.gas_sett.run_gas = BME680_ENABLE_GAS_MEAS;
/* Create a ramp heat waveform in 3 steps */
gas_sensor.gas_sett.heatr_temp = 320; /* degree Celsius */
gas_sensor.gas_sett.heatr_dur = 150; /* milliseconds */

/* Select the power mode */
/* Must be set before writing the sensor configuration */

gas_sensor.power_mode = BME680_FORCED_MODE; 

/* Set the required sensor settings needed */
set_required_settings = BME680_OST_SEL | BME680_OSP_SEL | BME680_OSH_SEL | BME680_FILTER_SEL 
    | BME680_GAS_SENSOR_SEL;

/* Set the desired sensor configuration */
rslt = bme680_set_sensor_settings(set_required_settings,&gas_sensor);

/* Set the power mode */
rslt = bme680_set_sensor_mode(&gas_sensor);


/* Get the total measurement duration so as to sleep or wait till the
 * measurement is complete */
uint16_t meas_period;
bme680_get_profile_dur(&meas_period, &gas_sensor);

struct bme680_field_data data;

// BME //////////////////////////////////////////////////////////////////////////////////////

bme680_field_data readBME680(){
  user_delay_ms(meas_period); /* Delay till the measurement is ready */
  rslt = bme680_get_sensor_data(&data, &gas_sensor);
  Serial.printf("T: %.2f degC, P: %.2f hPa, H %.2f %%rH ", data.temperature / 100.0f,
      data.pressure / 100.0f, data.humidity / 1000.0f );
  /* Avoid using measurements from an unstable heating setup */
  if(data.status & BME680_GASM_VALID_MSK)
      Serial.printf(", G: %d ohms", data.gas_resistance);
  Serial.printf("\r\n");
  /* Trigger the next measurement if you would like to read data out continuously */
  if (gas_sensor.power_mode == BME680_FORCED_MODE) {
      rslt = bme680_set_sensor_mode(&gas_sensor);
}

int8_t rslt = BME680_OK;
rslt = bme680_init(&gas_sensor);

void setup() {
  // initialize serial communication at 115200
  Serial.begin(115200);
  // LED setup
  FastLED.addLeds<WS2812B, LED_PIN, GRB>(leds, N_LEDS);
}

void loop() {
  int hue = 0;
  int sat = SAT;
  int val = VAL;
  int moistureValue = readMoisture();  
  //Serial.printf("Moisture Value = %d %% \n", readMoisture());
  Serial.printf("Temperature %d deg C", readBME680());

//  if(moistureValue < MOISTURE_TOO_DRY){
//    led_color = CRGB::Red;
//    }
//  else if(moistureValue < MOISTURE_TOO_WET){
//    led_color = CRGB::Green;
//  }
//  else{
//    led_color = CRGB::Blue;
//  }
  hue = map(moistureValue, 0, 100, 0, 160);
  for(int i=0; i<N_LEDS; i++){
    leds[i] = CHSV(hue, sat, val);
  }
  FastLED.show();

  delay(1000);
}
