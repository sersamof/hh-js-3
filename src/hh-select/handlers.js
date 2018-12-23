//@flow

import type { SelectMachine } from './select-machine/typings';
import type { DownloaderMachine } from '../downloader-machine/typings';

import { MOVE_UP, MOVE_DOWN } from './select-view';

export const onInput = (
    selectorMachine: SelectMachine,
    downloaderMachine: DownloaderMachine,
    minLength: number
) => {
    let prevState = '';
    return (event: EventHandler) => {
        const newState = event.target.value;
        if (newState.length >= minLength && newState !== prevState) {
            prevState = newState;
            downloaderMachine.transition('load', { text: newState });
        }
        event.preventDefault();
    };
};

export const keyboardControl = (svm: SelectMachine) => (event: KeyboardEvent) => {
    switch (event.code) {
        case 'ArrowUp':
            svm.transition('move', MOVE_UP);
            event.preventDefault();
            break;
        case 'ArrowDown':
            svm.transition('move', MOVE_DOWN);
            event.preventDefault();
            break;
        case 'Escape':
            svm.transition('close');
            event.preventDefault();
            break;
        case 'Enter':
            svm.transition('choose');
            event.preventDefault();
            break;
        default:
            break;
    }
};
