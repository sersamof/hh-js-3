// @flow
import type { StateMachine, StateMachineDescription } from '../state-machine/typings';

export type DownloaderAction = 'load';
export type DownloaderState = 'ready' | 'downloading';
export type DownloaderTransition = 'load';
export type DownloaderContext = any;
export type DownloaderMachine = StateMachine<DownloaderContext, DownloaderState, DownloaderContext>;
export type Downloader = StateMachineDescription<
    DownloaderContext,
    DownloaderState,
    DownloaderTransition,
    DownloaderAction
>;

export type DownloaderRawResult = { items: Array<Object> };
export type DownloaderResult = { id: string, text: string };

export type DownloaderUrlMapper = (string) => string;
export type DownloaderResultMapper = (DownloaderRawResult) => Array<DownloaderResult>;

export type DownloaderFetchSource = {
    type: 'fetch',
    urlMapper: DownloaderUrlMapper,
    resultMapper: DownloaderResultMapper,
};
export type DownloaderLocalSource = {
    type: 'local',
    data: { text: string },
};
export type DownloaderConfig = DownloaderFetchSource | DownloaderLocalSource;
