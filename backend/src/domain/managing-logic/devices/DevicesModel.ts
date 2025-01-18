export abstract class Device {
  private id: number;


  constructor(id: number) {
    this.id = id;
  }


  getId(): number {
    return this.id;
  }
}

export interface IToggleableDevice {
  isOn(): boolean;
  turnOn(): void;
  turnOff(): void;
}

export interface ITemperatureAdjustableDevice {
  setTemperature(t: number): void;
  getTemperature(): number;
}

export interface IPowerAdjustableDevice {
  setPowerLevel(pl: number): void;
  getCurrentPowerLevel(): number;
}

export interface ITemperatureModeSwitchableDevice {
  switchMode(): string;
  getCurrentMode(): string;
}


export class Socket extends Device implements IToggleableDevice {

  private access: IToggleableDevice;

  constructor(id: number, access: IToggleableDevice) {
    super(id);
    this.access = access;
  }


  isOn(): boolean {
    return this.access.isOn();
  }

  turnOn(): void {
    this.access.turnOn();
  }

  turnOff(): void {
    this.access.turnOff();
  }
}


export class Fan extends Device implements IToggleableDevice, IPowerAdjustableDevice {

  private access: IToggleableDevice & IPowerAdjustableDevice;

  constructor(id: number, access: IToggleableDevice & IPowerAdjustableDevice) {
    super(id);
    this.access = access;
  }


  isOn(): boolean {
    return this.access.isOn();
  }

  turnOn(): void {
    this.access.turnOn();
  }

  turnOff(): void {
    this.access.turnOff();
  }

  setPowerLevel(pl: number): void {
    this.access.setPowerLevel(pl);
  }

  getCurrentPowerLevel(): number {
    return this.access.getCurrentPowerLevel();
  }
}


export class AirConditioner extends Device implements 
  IToggleableDevice, 
  ITemperatureAdjustableDevice, 
  ITemperatureModeSwitchableDevice {

  private access: IToggleableDevice & ITemperatureAdjustableDevice & ITemperatureModeSwitchableDevice;

  constructor(id: number, access: IToggleableDevice & ITemperatureAdjustableDevice & ITemperatureModeSwitchableDevice) {
    super(id);
    this.access = access;
  }

  isOn(): boolean {
    return this.access.isOn();
  }

  turnOn(): void {
    this.access.turnOn();
  }

  turnOff(): void {
    this.access.turnOff();
  }
  
  setTemperature(t: number): void {
    this.access.setTemperature(t);
  }

  getTemperature(): number {
    return this.access.getTemperature();
  }

  switchMode(): string {
    return this.access.switchMode();
  }

  getCurrentMode(): string {
    return this.access.getCurrentMode();
  }


}



export class LightBulb extends Device implements IToggleableDevice {
  private on: boolean = false;

  private access: IToggleableDevice;

  constructor(id: number, access: IToggleableDevice) {
    super(id);
    this.access = access;
  }

  isOn(): boolean {
    return this.access.isOn();
  }

  turnOn(): void {
    this.access.turnOn();
  }

  turnOff(): void {
    this.access.turnOff();
  }
}



export class SmartLight extends Device implements 
  IToggleableDevice, 
  ITemperatureAdjustableDevice {

  private access: IToggleableDevice & ITemperatureAdjustableDevice;

  constructor(id: number, access: IToggleableDevice & ITemperatureAdjustableDevice) {
    super(id);
    this.access = access;
  }

  isOn(): boolean {
    return this.access.isOn();
  }

  turnOn(): void {
    this.access.turnOn();
  }

  turnOff(): void {
    this.access.turnOff();
  }

  setTemperature(t: number): void {
    this.access.setTemperature(t);
  }

  getTemperature(): number {
    return this.access.getTemperature();
  }
}
