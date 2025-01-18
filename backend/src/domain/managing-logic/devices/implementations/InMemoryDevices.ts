import {IToggleableDevice, IPowerAdjustableDevice, ITemperatureAdjustableDevice, ITemperatureModeSwitchableDevice} from "../DevicesModel";

export class SocketAccessMockImpl implements IToggleableDevice {  
  private on: boolean = false;

  isOn(): boolean {
    return this.on;
  }

  turnOn(): void {
    this.on = true;
  }

  turnOff(): void {
    this.on = false;
  }
}


export class FanAccessMockImpl implements IToggleableDevice, IPowerAdjustableDevice {
  private on: boolean = false;
  private powerLevel: number = 1;
  
  isOn(): boolean {
    return this.on;
  }

  turnOn(): void {
    this.on = true;
  }

  turnOff(): void {
    this.on = false;
  }

  setPowerLevel(pl: number): void {
    this.powerLevel = pl;
  }

  getCurrentPowerLevel(): number {
    return this.powerLevel;
  }
}



export class AirConditionerAccessMockImpl implements 
  IToggleableDevice, 
  ITemperatureAdjustableDevice, 
  ITemperatureModeSwitchableDevice {

  private on: boolean = false;
  private temperature: number = 24;
  private mode: string = "cool";

  isOn(): boolean {
    return this.on;
  }

  turnOn(): void {
    this.on = true;
  }

  turnOff(): void {
    this.on = false;
  }

  setTemperature(t: number): void {
    this.temperature = t;
  }

  getTemperature(): number {
    return this.temperature;
  }

  switchMode(): string {
    this.mode = this.mode === "cool" ? "heat" : "cool";
    return this.mode;
  }

  getCurrentMode(): string {
    return this.mode;
  }
}


export class LightBulbAccessMockImpl implements IToggleableDevice {
  private on: boolean = false;

  isOn(): boolean {
    return this.on;
  }

  turnOn(): void {
    this.on = true;
  }

  turnOff(): void {
    this.on = false;
  }
}


export class SmartLightAccessMockImpl implements
  IToggleableDevice,
  ITemperatureAdjustableDevice {

  private on: boolean = false;
  private temperature: number = 24;

  isOn(): boolean {
    return this.on;
  }

  turnOn(): void {
    this.on = true;
  }

  turnOff(): void {
    this.on = false;
  }

  setTemperature(t: number): void {
    this.temperature = t;
  }

  getTemperature(): number {
    return this.temperature;
  }
}