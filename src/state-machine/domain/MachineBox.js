import { UnknownTransition, UnknownAction } from './errors';

const getActionOrBreakMachine = (machineBox, transitionName) => {
    const transitions = machineBox.machine.states[machineBox.state].on;
    const defaultHandler = machineBox.machine.states[machineBox.state].default;
    if (transitions !== undefined && transitions[transitionName] !== undefined) {
        return transitions[transitionName];
    } else if (defaultHandler !== undefined) {
        return defaultHandler;
    }
    machineBox.broken = true;
    throw new UnknownTransition(transitionName, machineBox.state);
};

// позволяет тригернуть обработчики события on стейта state машины machine с данными event
const trigger = (machineBox, on, state, event) => {
    const maybeMapActionNameToHandler = (action) => {
        if (typeof action === 'string') {
            if (action in machine.actions) {
                return machine.actions[action];
            } else {
                machineBox.broken = true;
                throw new UnknownAction(action, on, state);
            }
        }
        return action;
    };

    const machine = machineBox.machine;
    const handlers = [machine.states[state][on]]; // дабы не обрабатывать отдельно случаи array / not array
    handlers
        .reduce((acc, val) => acc.concat(val), []) // flatMap in stage-3 :(
        .map(maybeMapActionNameToHandler)
        .filter((handler) => typeof handler === 'function')
        .forEach((handler) => handler(event));
};

export default class MachineBox {
    constructor(machine, context, state) {
        this.machine = machine;
        this.context = context;
        this.state = state;
        this.broken = false;
    }

    transition(transitionName, event) {
        const action = getActionOrBreakMachine(this, transitionName);
        if ('service' in action) {
            action.service(event);
        } else if ('target' in action) {
            this.setState(action.target, event);
        } else if ('action' in action) {
            this.machine.actions[action.action](event);
        }
    }

    setContext(context) {
        const currentContext = this.context;
        const updated = { ...currentContext, ...context };
        this.context = updated;
        return { ...updated };
    }

    setState(state, event) {
        if (!(state in this.machine.states)) {
            throw new UnknownTransition('target to', state);
        }

        trigger(this, 'onExit', this.state, event);
        this.state = state;
        trigger(this, 'onEntry', state, event);
        return this.state;
    }
}
