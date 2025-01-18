import { CronJob } from 'cron';
import { Sensor } from './sensors/SensorsModel';
import { Command, CommandTranslator } from './CommandTranslator';
import { Device } from './devices/DevicesModel';

type Action = {
  device: Device;
  command: Command
}

export class Routine {

  private id: number;
  private commandTranslator: CommandTranslator;
  private actions: Array<Action>;  


  constructor(id: number, translator: CommandTranslator, actions: Array<Action>) {
    this.id = id;
    this.commandTranslator = translator;
    this.actions = actions;
  }

  public execute = (): void => {
    this.actions.forEach(action => {
      this.commandTranslator.executeCommand(action.device, action.command);
    }
    );
  }

  public getId(): number {
    return this.id;
  }

}

export abstract class Trigger {
  private id: number;
  private routine: Routine;

  constructor(id: number, routine: Routine) {
    this.id = id;
    this.routine = routine;
  }

  public getId(): number {
    return this.id;
  }

  public trigger = (): void => {
    this.routine.execute();
  }
}


export class TimeTrigger extends Trigger {
  private cronExpression: string;
  private job: CronJob;

  constructor(id: number, routine: Routine, cronExpression: string) {
    super(id, routine);
    this.cronExpression = cronExpression;
    
    try {
      this.job = new CronJob(
        this.cronExpression,
        () => this.trigger(),
        null,
        true,
      );

    } catch {
      throw new Error(`Invalid cron expression`);
    }

  }

  deconstructor() {
    this.job.stop();
  }
}

export enum ThresholdType {
  greaterThan = 'g_than',
  lessThan = 'l_than',
  equals = 'equal',
}

export class SensorTrigger extends Trigger {

  private sensor: Sensor;
  private static readonly cronExpression: string = '*/3 * * * *';
  private job: CronJob;

  private threshold: number;
  private thresholdType: ThresholdType;

  constructor(id: number, routine: Routine, sensor: Sensor, threshold: number, thresholdType: ThresholdType) {
    super(id, routine);

    this.sensor = sensor;

    this.threshold = threshold;
    this.thresholdType = thresholdType;

    try {
      this.job = new CronJob(
        SensorTrigger.cronExpression,
        () => this.checkSensor(),
        null,
        true,
      );

    } catch {
      throw new Error(`Invalid cron expression`);
    }
    
  }

  deconstructor() {
    this.job.stop();
  }

  private checkSensor = (): void => {
    const sensorValue = this.sensor.readValue();

    switch (this.thresholdType) {
      case ThresholdType.greaterThan:
        if (sensorValue > this.threshold) {
          this.trigger();
        }
        break;
      case ThresholdType.lessThan:
        if (sensorValue < this.threshold) {
          this.trigger();
        }
        break;
      case ThresholdType.equals:
        if (sensorValue == this.threshold) {
          this.trigger();
        }
        break;
      default:
        throw new Error(`Invalid threshold type`);
    }
  }  
}