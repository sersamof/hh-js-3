// @flow
import type {
    Downloader,
    DownloaderResult,
    DownloaderUrlMapper,
    DownloaderResultMapper,
} from './typings';
import { machine, useState, useContext } from '../state-machine';

export const fromFetch = (
    urlMapper: DownloaderUrlMapper,
    resultMapper: DownloaderResultMapper,
    updateResults: (Array<DownloaderResult>) => void
): Downloader => {
    const id = Symbol('downloader');
    return {
        id: id,
        initialState: 'ready',
        context: { abortController: new AbortController() },
        states: {
            ready: {
                onEntry: (data) => {
                    console.log('downloaded');
                    updateResults(data);
                },
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
            load: (payload) => {
                const [context, setContext] = useContext();
                const [state, setState] = useState();
                const url = urlMapper(payload.text);

                context.abortController.abort();

                const abortController = new AbortController();
                setContext({ abortController });

                fetch(url, { signal: abortController.signal })
                    .then((val) => val.json())
                    .catch((err) => {
                        console.log(err);
                        return { items: [] };
                    })
                    .then((data) => setState('ready', resultMapper(data)));
                setState('downloading');
            },
        },
    };
};
