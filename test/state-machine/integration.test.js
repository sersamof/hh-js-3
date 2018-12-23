import { machine, useContext, useState } from '../../src/state-machine';
import { unregisterMachine } from './utils';
import StateMachine from '../../src/state-machine/domain/StateMachine';
import {
    StateMachineInitializeError,
    NoOpenTransaction,
    UnknownTransition,
    UnknownAction,
} from '../../src/state-machine/domain/errors';

describe('public api', () => {
    const simpleMachineDesc = {
        id: 'vacancy',
        states: { notResponded: { on: { move: () => {} } }, responded: {} },
        context: { id: 123, data: 234 },
        initialState: 'notResponded',
    };

    it('machine should create state machine', () => {
        const stateMachine = machine(simpleMachineDesc);

        expect(stateMachine).toBeInstanceOf(StateMachine);

        unregisterMachine(stateMachine);
    });

    it('should be error if unknown initialState', () => {
        const machineDesc = { ...simpleMachineDesc };
        machineDesc.initialState = 'wrong';

        expect(() => machine(machineDesc)).toThrow(
            new StateMachineInitializeError('you should provide initial state from states')
        );

        delete machineDesc.initialState;
        expect(() => machine(machineDesc)).toThrow(
            new StateMachineInitializeError('you should provide initial state from states')
        );
    });

    it('useState and useContext should throw error when called outside', () => {
        const stateMachine = machine(simpleMachineDesc);

        expect(useState).toThrow(new NoOpenTransaction());
        expect(useContext).toThrow(new NoOpenTransaction());

        unregisterMachine(stateMachine);
    });

    it('setContext should merge context', () => {
        const machineDesc = {
            id: 'vacancy',
            states: {
                notResponded: {
                    on: {
                        move: {
                            service: (event) => {
                                const [context, setContext] = useContext();
                                setContext(event);
                            },
                        },
                    },
                },
                responded: {},
            },
            context: { id: 123, data: 234 },
            initialState: 'notResponded',
        };
        const expected = [
            machineDesc.initialState,
            {
                ...machineDesc.context,
                id: 22,
                add: 55,
            },
        ];
        const stateMachine = machine(machineDesc);

        const promise = stateMachine.transition('move', { id: 22, add: 55 });

        return expect(promise)
            .resolves.toEqual(expected)
            .then(() => unregisterMachine(stateMachine));
    });

    it('should be error for unknown setState', () => {
        const stateMachine = machine({
            id: 'vacancy',
            states: { notResponded: { on: { move: { target: 'test' } } }, responded: {} },
            initialState: 'notResponded',
        });

        const promise = stateMachine.transition('move');

        return expect(promise)
            .rejects.toThrow(UnknownTransition)
            .then(() => unregisterMachine(stateMachine));
    });

    it('should be error for unknown transition', () => {
        const stateMachine = machine(simpleMachineDesc);

        const promise = stateMachine.transition('smth');

        return expect(promise)
            .rejects.toThrow(new UnknownTransition('smth', 'notResponded'))
            .then(() => unregisterMachine(stateMachine));
    });

    it('trigger may be an action', () => {
        const mockCallback = jest.fn((x) => {});
        const machineDesc = {
            id: 'vacancy',
            states: {
                notResponded: {
                    onExit: 'test',
                    on: { move: { target: 'responded' } },
                },
                responded: {
                    onEntry: ['test1', 'test2'],
                },
            },
            actions: {
                test: () => mockCallback(1),
                test1: () => mockCallback(2),
                test2: () => mockCallback(3),
            },
            initialState: 'notResponded',
        };
        const stateMachine = machine(machineDesc);

        const promise = stateMachine.transition('move');

        return promise
            .then(() => expect(mockCallback.mock.calls.length).toBe(3))
            .then(() => expect(mockCallback.mock.calls[0][0]).toBe(1))
            .then(() => expect(mockCallback.mock.calls[1][0]).toBe(2))
            .then(() => expect(mockCallback.mock.calls[2][0]).toBe(3))
            .then(() => unregisterMachine(stateMachine));
    });

    it('should be error for unknown action', () => {
        const machineDesc = {
            id: 'vacancy',
            states: {
                notResponded: { on: { move: { target: 'responded' } } },
                responded: {
                    onEntry: 'test',
                },
            },
            actions: {},
            initialState: 'notResponded',
        };
        const expected = [true, new UnknownAction('test', 'onEntry', 'responded')];
        const stateMachine = machine(machineDesc);

        const promise = stateMachine
            .transition('move')
            .catch((err) => Promise.reject([stateMachine.isBroken(), err]));

        return expect(promise)
            .rejects.toEqual(expected)
            .then(() => unregisterMachine(stateMachine));
    });

    it('transition should transit machine through target', () => {
        const mockCallback = jest.fn((x) => {});
        const machineDesc = {
            id: 'vacancy',
            states: {
                notResponded: {
                    on: {
                        move: {
                            target: 'responded',
                        },
                    },
                },
                responded: {
                    onEntry: () => mockCallback(1),
                    on: {
                        move: {
                            service: () => mockCallback(2),
                        },
                    },
                },
            },
            initialState: 'notResponded',
        };
        const stateMachine = machine(machineDesc);

        const promise = stateMachine.transition('move').then(() => stateMachine.transition('move'));

        return promise
            .then(() => expect(mockCallback.mock.calls.length).toBe(2))
            .then(() => expect(mockCallback.mock.calls[0][0]).toBe(1))
            .then(() => expect(mockCallback.mock.calls[1][0]).toBe(2))
            .then(() => unregisterMachine(stateMachine));
    });

    it('setState should trigger onEntry and onExit', () => {
        const mockCallback = jest.fn((x) => {});
        const machineDesc = {
            id: 'vacancy',
            states: {
                notResponded: {
                    onExit: () => mockCallback(1),
                    on: { move: { target: 'responded' } },
                },
                responded: {
                    onEntry: () => mockCallback(2),
                },
            },
            initialState: 'notResponded',
        };
        const stateMachine = machine(machineDesc);

        const promise = stateMachine.transition('move');

        return promise
            .then(() => expect(mockCallback.mock.calls.length).toBe(2))
            .then(() => expect(mockCallback.mock.calls[0][0]).toBe(1))
            .then(() => expect(mockCallback.mock.calls[1][0]).toBe(2))
            .then(() => unregisterMachine(stateMachine));
    });

    it('useState should return current state and setState for change state', () => {
        let beforeSetState = 'wrong';
        const machineDesc = {
            id: 'vacancy',
            states: {
                notResponded: {
                    on: {
                        move: {
                            service: (event) => {
                                const [state, setState] = useState();
                                beforeSetState = state;
                                setState('responded');
                            },
                        },
                    },
                },
                responded: {},
            },
            initialState: 'notResponded',
        };
        const stateMachine = machine(machineDesc);
        const expected = [machineDesc.initialState, 'responded'];

        const promise = stateMachine
            .transition('move')
            .then(() => [beforeSetState, stateMachine.getState()]);

        return expect(promise)
            .resolves.toEqual(expected)
            .then(() => unregisterMachine(stateMachine));
    });
});
