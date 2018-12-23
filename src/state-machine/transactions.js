import MachineBox from './domain/MachineBox';
import {
    NoOpenTransaction,
    StateMachineWasBroken,
    StateMachineError,
    NoSuchMachineBox,
    StateMachineInitializeError,
} from './domain/errors';
// при выполнении транзакции возможен вызов операций другого автомата,
// поэтому нам нужен стэк автоматов
const current = [];
const getCurrentMachineBox = () => {
    if (current.length === 0) {
        throw new NoOpenTransaction();
    }
    return current[current.length - 1];
};

const transaction = (machineBox, ...args) => (fun) => {
    if (machineBox.broken) {
        throw new StateMachineWasBroken();
    }

    try {
        current.push(machineBox);
        const retVal = fun(machineBox, ...args);
        return retVal;
    } catch (err) {
        machineBox.broken = true;
        if (err instanceof StateMachineError) {
            throw err;
        } else {
            throw new StateMachineError(err);
        }
    } finally {
        current.pop();
    }
};

const machineBoxes = new WeakSet();
const getMachineBox = (machine) => {
    if (machineBoxes.has(machine)) {
        return machine;
    } else {
        throw new NoSuchMachineBox();
    }
};
const initializeBox = (machine, initialContext, initialState) => {
    if (machineBoxes.has(machine)) {
        throw new StateMachineInitializeError(
            'Machine ' + machine.id.toString() + ' already exists'
        );
    }

    const machineBox = new MachineBox(machine, { ...initialContext }, initialState);
    machineBoxes.add(machineBox);
    return machineBox;
};

const unregisterBox = (box) => {
    machineBoxes.delete(box);
};

export { getMachineBox, initializeBox, getCurrentMachineBox, transaction, unregisterBox };
