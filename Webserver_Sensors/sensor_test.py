import flask, grove, time


while True:
    print(grove.analogRead(0))
    time.sleep(1)
