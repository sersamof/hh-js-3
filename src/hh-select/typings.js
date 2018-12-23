// @flow
import type { DownloaderConfig } from '../downloader-machine/typings';
import type { SelectViewConfig } from './select-view/typings';
import type { ListConfig } from './list/typings';

export type QueryInputConfig = {
    minInputLength: number,
    debounceDelay: number,
};

export type SelectConfig = {
    select: $Shape<SelectViewConfig>,
    selectedList: $Shape<ListConfig>,
    queryInput: $Shape<QueryInputConfig>,
    downloader: DownloaderConfig,
};
