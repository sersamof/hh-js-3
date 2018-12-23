// @flow
import { machine, useState, useContext } from '../../state-machine';

import type { Downloader, DownloaderTransition } from '../../downloader-machine/typings';
import type { SelectView } from '../select-view';
import type { Select, SelectMachine } from './typings';
import type { List } from '../list';

type Data = { [key: string]: mixed };
const arrayToMap = (raw): { [key: string]: mixed } => {
    const res = {};
    raw.forEach((element) => {
        res[element.id] = element;
    });
    return res;
};

export const fromView = (selectView: SelectView, selectedList: List): Select => {
    return {
        id: Symbol('select'),
        initialState: 'empty',
        context: { data: {}, selected: {} },
        states: {
            empty: {
                on: { open: { action: 'initial' }, update: { action: 'update' } },
                default: { action: 'ignored' },
            },
            opened: {
                onEntry: () => {
                    const [context, setContext] = useContext();
                    selectView.open();
                },
                on: {
                    close: { target: 'closed' },
                    update: { action: 'update' },
                    addSelected: { action: 'addSelected' },
                    removeSelected: { action: 'removeSelected' },
                    move: { action: 'move' },
                    choose: { action: 'choose' },
                },
                default: { action: 'ignored' },
            },
            closed: {
                onEntry: () => {
                    const [context, setContext] = useContext();
                    selectView.close();
                },
                on: {
                    open: { target: 'opened' },
                    update: { action: 'update' },
                    move: { target: 'opened' },
                    removeSelected: { action: 'removeSelected' },
                },
                default: { action: 'ignored' },
            },
        },
        actions: {
            ignored: () => {},
            removeSelected: (key) => {
                const [context, setContext] = useContext();
                const [state, setState] = useState();
                const selected = { ...context.selected };
                delete selected[key];
                setContext({ selected });
                setState('closed');
            },
            addSelected: (key) => {
                const [context, setContext] = useContext();
                const [state, setState] = useState();
                const selected = { ...context.selected };
                selected[key] = context.data[key];
                setContext({ selected });
                selectedList.add(key, context.data[key].text);
                setState('closed');
            },
            choose: () => {
                selectView.chooseCurrent();
            },
            initial: () => {
                const [state, setState] = useState();
                selectView.placeholder('Start typing');
                setState('opened');
            },
            update: (payload) => {
                const [context, setContext] = useContext();
                const [state, setState] = useState();
                if (payload.res.length === 0) {
                    selectView.placeholder('nothing found');
                } else {
                    selectView.clearPlaceholder();
                }
                const data = arrayToMap(payload.res);
                setContext({ data });
                selectView.updateItems(data);
                setState('opened');
            },
            move: (direction) => {
                selectView.move(direction);
            },
        },
    };
};
export const createSelectMachine = (selectView: SelectView, selectedView: List): SelectMachine =>
    machine(fromView(selectView, selectedView));
