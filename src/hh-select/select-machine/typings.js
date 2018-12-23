// @flow
import type { StateMachine, StateMachineDescription } from '../../state-machine/typings';

type SelectAction =
    | 'ignored'
    | 'removeSelected'
    | 'addSelected'
    | 'choose'
    | 'initial'
    | 'update'
    | 'move';

export type SelectContext = {
    data: { [key: number]: { id: string, text: string } },
    selected: { [key: number]: { id: string, text: string } },
};
export type SelectState = 'empty' | 'loading' | 'opened' | 'closed';
export type SelectTransition =
    | 'update'
    | 'open'
    | 'close'
    | 'choose'
    | 'move'
    | 'addSelected'
    | 'removeSelected';

export type Select = StateMachineDescription<
    SelectContext,
    SelectState,
    SelectTransition,
    SelectAction
>;
export type SelectMachine = StateMachine<SelectContext, SelectState, SelectTransition>;
