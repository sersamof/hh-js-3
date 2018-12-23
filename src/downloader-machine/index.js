// @flow
import { fromList } from './from-list';
import { fromFetch } from './from-fetch';

import { machine } from '../state-machine';

import type { DownloaderMachine, DownloaderConfig } from './typings';

export const createDownloaderMachine = (
    config: DownloaderConfig,
    onLoad: ({}) => any
): DownloaderMachine => {
    switch (config.type) {
        case 'fetch':
            return machine(fromFetch(config.urlMapper, config.resultMapper, onLoad));
        case 'local':
            return machine(fromList({ ...config.data }, onLoad));
    }
    throw new Error('unknown datasource');
};
