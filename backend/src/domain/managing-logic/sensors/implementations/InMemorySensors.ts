import { IHumiditySensor, ITemperatureSensor } from "../SensorsModel";

export class InMemoryTemperatureReader implements ITemperatureSensor {

  public readTemperature(): number {
    return Math.random() * (40 - -20) + -20;
  }
}

export class InMemoryHumidityReader implements IHumiditySensor {

  public readHumidity(): number {
    return Math.random() * 100;
  }
}