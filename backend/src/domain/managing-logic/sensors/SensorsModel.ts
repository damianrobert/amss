export interface ITemperatureSensor {
  readTemperature(): number;
}

export interface IHumiditySensor {
  readHumidity(): number;
}

export abstract class Sensor {
  private id: number;

  constructor(id: number) {
    this.id = id;
  }

  public getId(): number {
    return this.id;
  }
  
  abstract readValue(): number;
}


export class TemperatureSensor extends Sensor implements ITemperatureSensor {
  private currentTemperature: number = 25; 

  public readTemperature(): number {
    return this.currentTemperature;
  }

  public readValue(): number {
    return this.readTemperature();
  }
}

export class HumiditySensor extends Sensor implements IHumiditySensor {
  private currentHumidity: number = 45; 

  readHumidity(): number {
    return this.currentHumidity;
  }

  readValue(): number {
    return this.readHumidity();
  }
}



