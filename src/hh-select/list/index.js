// @flow
import type { ListConfig } from './typings';

const defaultConfig: ListConfig = {
    listClass: 'hh-select__selected-list',
    rowClass: 'hh-select__selected-row',
    removeClass: 'hh-select__selected-remove',
    removeText: 'X',
};

export class List {
    config: ListConfig;
    dom: {
        wrapper: HTMLElement,
        list: HTMLElement,
        items: { [key: string]: HTMLElement },
    };
    removeHandlers: Array<(key: string, Array<string>) => void>;
    constructor(wrapper: HTMLElement, config: $Shape<ListConfig>) {
        this.config = { ...defaultConfig, ...config };

        const list = document.createElement('ul');
        list.className = this.config.listClass;

        this.dom = {
            wrapper: wrapper,
            list: list,
            items: {},
        };
        wrapper.appendChild(this.dom.list);
        this.removeHandlers = [];
    }

    add(key: string, text: string) {
        const remove = document.createElement('span');
        remove.className = this.config.removeClass;
        remove.textContent = this.config.removeText;
        remove.addEventListener('click', () => this.remove(key));
        if (key in this.dom.items) {
            this.dom.items[key].textContent = text;
            this.dom.items[key].prepend(remove);
        } else {
            const element = document.createElement('li');
            element.className = this.config.rowClass;
            element.textContent = text;

            element.prepend(remove);

            this.dom.list.appendChild(element);
            this.dom.items[key] = element;
        }
    }

    remove(key: string) {
        const item = this.dom.items[key];
        if (item) {
            this.dom.list.removeChild(item);
            delete this.dom.items[key];
        }
        const restKeys = Object.keys(this.dom.items);
        this.removeHandlers.forEach((handler) => handler(key, restKeys));
    }

    onRemove(handler: (key: string, Array<string>) => void) {
        this.removeHandlers.push(handler);
    }
}
