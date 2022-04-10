// C++ code
//

long readUltrasonicDistance(int triggerPin, int echoPin)
{
    pinMode(triggerPin, OUTPUT); // Clear the trigger
    digitalWrite(triggerPin, LOW);
    delayMicroseconds(2);
    // Sets the trigger pin to HIGH state for 10 microseconds
    digitalWrite(triggerPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(triggerPin, LOW);
    pinMode(echoPin, INPUT);
    // Reads the echo pin, and returns the sound wave travel time in microseconds
    return 0.01723 * pulseIn(echoPin, HIGH) / 2.54;
}

void setup()
{
    Serial.begin(9600);
    pinMode(LED_BUILTIN, OUTPUT);
    pinMode(11, OUTPUT);
}

void loop()
{
    long Distance = readUltrasonicDistance(2, 2);
    Serial.println(Distance);
    if (Distance <= 10)
    {
        digitalWrite(LED_BUILTIN, HIGH);
        analogWrite(11, 300);
    }
    else
    {
        digitalWrite(LED_BUILTIN, LOW);
        analogWrite(11, 0);
    }

    delay(100); // Delay a little bit to improve simulation performance
}