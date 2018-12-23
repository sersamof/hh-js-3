// @flow
export type StateMachine<StateContext, State, Transition> = {
    transition: (transitionName: Transition, payload?: any) => Promise<[State, StateContext]>,
    syncTransition: (transitionName: Transition, payload?: any) => [State, StateContext],
    getState: () => State,
    getContext: () => StateContext,
};

type ActionDefinition<Action> = { action: Action };
type TargetDefinition<State> = { target: State };
type ServiceDefition = { service: Function };

export type StateMachineDescription<StateContext, State, Transition, Action> = {
    id: any,
    initialState: State,
    context: StateContext,
    states: {
        [key: State]: {
            onEntry?: Array<Action | Function> | Action | Function,
            onExit?: Array<Action | Function> | Action | Function,
            on?: {
                [key: Transition]:
                    | ActionDefinition<Action>
                    | TargetDefinition<State>
                    | ServiceDefition,
            },
            default?: ActionDefinition<Action> | TargetDefinition<State> | ServiceDefition,
        },
    },
};
