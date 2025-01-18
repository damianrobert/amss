interface TemperatureCommand {
  type: "set_temperature";
  value?: number;
}

interface PowerCommand {
  type: "set_power";
  value?: number;
}

interface ToggleCommand {
  type: "turn_on" | "turn_off";
}

interface ModeCommand {
  type: "switch_mode";
}

export type Command = TemperatureCommand | PowerCommand | ToggleCommand | ModeCommand;

export class CommandTranslator {
  executeCommand(dev: unknown, command: Command) {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const device = dev as unknown as any;

    switch (command.type) {
      case "set_temperature":
        if ("setTemperature" in device) {
          if (command.value !== undefined) {
            device.setTemperature(command.value);
          } else {
            throw new Error("Temperature value is required.");
          }
        } else {
          throw new Error("Device does not support temperature adjustment.");
        }
        break;

      case "set_power":
        if ("setPowerLevel" in device) {
          if (command.value !== undefined) {
            device.setPowerLevel(command.value);
          } else {
            throw new Error("Power level value is required.");
          }
        } else {
          throw new Error("Device does not support power adjustment.");
        }
        break;

      case "turn_on":
        if ("turnOn" in device) {
          device.turnOn();
        } else {
          throw new Error("Device does not support turning on.");
        }
        break;

      case "turn_off":
        if ("turnOff" in device) {
          device.turnOff();
        } else {
          throw new Error("Device does not support turning off.");
        }
        break;

      case "switch_mode":
        if ("switchMode" in device) {
          return device.switchMode();
        } else {
          throw new Error("Device does not support mode switching.");
        }

      default:
        throw new Error("Unsupported command type.");
    }
  }
}
