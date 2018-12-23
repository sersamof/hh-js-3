// @flow
import { SelectView, MOVE_UP, MOVE_DOWN } from './select-view';
import { fromView } from './select-machine';
import { machine } from '../state-machine';
import { createDownloaderMachine } from '../downloader-machine';
import { createSelectMachine } from './select-machine';
import { debounce } from '../helpers/debounce';
import { List } from './list';
import { onInput, keyboardControl } from './handlers';

import type { StateMachine } from '../state-machine/typings';
import type { SelectMachine, SelectContext } from './select-machine/typings';
import type { DownloaderMachine } from '../downloader-machine/typings';
import type { SelectConfig, QueryInputConfig } from './typings';
import type { SelectViewConfig } from './select-view/typings';

const defaultConfig: QueryInputConfig = {
    debounceDelay: 2000,
    minInputLength: 2,
};

export const setSelectable = (wrapper: HTMLElement, config: $Shape<SelectConfig>) => {
    const { downloader } = config;
    const viewConfig = { ...defaultConfig, ...config.queryInput };

    const selectWrapper = document.createElement('div');
    const selectedWrapper = document.createElement('div');
    wrapper.appendChild(selectWrapper);
    wrapper.appendChild(selectedWrapper);

    const list = new List(selectedWrapper, { ...config.selectedList });
    const selectView = new SelectView(selectWrapper, viewConfig);
    const svm = createSelectMachine(selectView, list);

    const downloaderMachine = createDownloaderMachine(downloader, (res) =>
        svm.transition('update', { res })
    );
    selectView.onClick(() => svm.transition('open'));
    selectView.onInput(
        debounce(
            onInput(svm, downloaderMachine, viewConfig.minInputLength),
            viewConfig.debounceDelay
        )
    );
    selectView.onChange((key) => {
        svm.transition('addSelected', key).then(([state, context]) => {
            changeHandlers.forEach((handler) => handler(context));
        });
    });
    list.onRemove((key) => {
        svm.transition('removeSelected', key).then(([state, context]) => {
            changeHandlers.forEach((handler) => handler(context));
        });
    });
    selectView.onKeyDown(keyboardControl(svm));

    const changeHandlers = [];

    return {
        onChange: (fun: (data: SelectContext) => void) => {
            changeHandlers.push(fun);
        },
        getSelected: () => {
            return svm.getContext();
        },
    };
};
