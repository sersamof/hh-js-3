import { getMachineBox, initializeBox, unregisterBox } from '../../src/state-machine/transactions';

const createBox = (machineFullDesc) => {
    const machineDesc = { ...machineFullDesc.desc };
    const initialContext = { ...machineFullDesc.initialContext };
    const initialState = machineFullDesc.initialState;
    return initializeBox(machineDesc, initialContext, initialState);
};
const unregisterMachine = (machine) => {
    unregisterBox(machine);
};
export { getMachineBox, createBox, unregisterBox, unregisterMachine };
