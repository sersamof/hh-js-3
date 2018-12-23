// @flow
import { setSelectable } from './hh-select';

const select = setSelectable(window.document.getElementById('select-wrapper'), {
    queryInput: {
        debounceDelay: 400,
        minInputLength: 2,
    },
    selectedList: {
        removeText: '',
    },
    downloader: {
        type: 'fetch',
        urlMapper: (input) => `https://api.hh.ru/suggests/areas?text=${input}`,
        resultMapper: (data) => data.items,
    },
});
select.onChange(console.log);
