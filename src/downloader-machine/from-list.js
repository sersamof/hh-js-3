// @flow
import type { Downloader } from './typings';
import { machine, useState, useContext } from '../state-machine';

export const fromList = (data: { text: string }, updateResults: ({}) => any): Downloader => {
    const id = Symbol('downloader');
    return {
        id: id,
        initialState: 'ready',
        context: { data: data },
        states: {
            ready: {
                onEntry: updateResults,
                on: {
                    load: {
                        action: 'load',
                    },
                },
            },
            downloading: {
                onEntry: () => {
                    console.log('downloading');
                },
                on: {
                    load: {
                        action: 'load',
                    },
                },
            },
        },
        actions: {
            load: (event) => {
                const [context, setContext] = useContext();
                const [state, setState] = useState();

                setState('ready', context.data.filter((value) => value.text.includes(event.text)));
            },
        },
    };
};
