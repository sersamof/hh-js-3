// @flow
import { resetPosition, move, moveTo, createRow, clearHighlights } from './helpers.js';
import type { SelectViewConfig } from './typings.js';

const defaultConfig: SelectViewConfig = {
    wrapperClass: 'hh-select',
    wrapperOpenClass: 'hh-select hh-select_open',
    rowClass: 'hh-select__row',
    listClass: 'hh-select__list',
    hoverClass: 'hh-select__row hh-select__row_hover',
    inputClass: 'hh-select__input',
    placeholderClass: 'hh-select__placeholder',
};

export const MOVE_UP = -1;
export const MOVE_DOWN = +1;

const bindEventHandlers = (selectView: SelectView) => {
    selectView.dom.input.addEventListener('keyup', (event: KeyboardEvent) => {
        selectView.inputHandlers.forEach((handler) => {
            handler(event);
        });
    });
    selectView.dom.input.addEventListener('click', (event: MouseEvent) => {
        selectView.clickHandlers.forEach((handler) => {
            handler(event);
        });
    });
    selectView.dom.input.addEventListener('keydown', (event: KeyboardEvent) => {
        selectView.keyDownHandlers.forEach((handler) => {
            handler(event);
        });
    });
};

export class SelectView {
    config: SelectViewConfig;
    currentPos: number;
    posToKey: { [key: number]: string };
    keyToPos: { [key: string]: number };
    inputHandlers: Array<(event: KeyboardEvent | void) => any>;
    keyDownHandlers: Array<(event: KeyboardEvent | void) => any>;
    changeHandlers: Array<(string) => any>;
    clickHandlers: Array<(event: MouseEvent | void) => any>;
    dom: {
        wrapper: HTMLElement,
        input: HTMLElement,
        list: HTMLElement,
        items: { [key: string]: HTMLElement },
        placeholder: HTMLElement | null,
    };

    constructor(wrapper: HTMLElement, config: SelectViewConfig) {
        this.config = { ...defaultConfig, ...config };
        this.dom = {
            wrapper: wrapper,
            input: document.createElement('input'),
            list: document.createElement('ul'),
            items: {},
            placeholder: null,
        };
        this.dom.wrapper.appendChild(this.dom.input);
        this.dom.wrapper.appendChild(this.dom.list);
        this.dom.wrapper.className = this.config.wrapperClass;
        this.dom.input.className = this.config.inputClass;
        this.dom.list.className = this.config.listClass;

        this.dom.list.addEventListener('mouseleave', () => {
            clearHighlights(this);
        });

        this.inputHandlers = [];
        this.keyDownHandlers = [];
        this.changeHandlers = [];
        this.clickHandlers = [() => this.open()];
        this.posToKey = {};

        bindEventHandlers(this);
        resetPosition(this);
    }

    updateItems(items: { [id: string]: { text: string } }) {
        this.posToKey = {};
        this.keyToPos = {};

        // удалим узлы, которых нет в новых данных
        Object.keys(this.dom.items)
            .filter((el) => !Object.keys(items).includes(el))
            .map((el) => {
                this.dom.list.removeChild(this.dom.items[el]);
                delete this.dom.items[el];
            });

        // обновим оставшиеся / добавим новые
        let pos = 0;
        Object.keys(items).forEach((id) => {
            const item = items[id];
            if (id in this.dom.items) {
                this.dom.items[id].textContent = item.text;
            } else {
                const li = createRow(this, id, item.text);
                this.dom.list.appendChild(li);
                this.dom.items[id] = li;
            }
            this.keyToPos[id] = pos;
            this.posToKey[pos++] = id;
        });
        resetPosition(this);
    }

    placeholder(text: string) {
        this.clear();
        const placeholder = document.createElement('li');
        placeholder.className = this.config.placeholderClass;
        placeholder.textContent = text;
        this.dom.placeholder = placeholder;
        this.dom.list.appendChild(placeholder);
    }

    clearPlaceholder() {
        if (this.dom.placeholder !== null) {
            this.dom.list.removeChild(this.dom.placeholder);
            this.dom.placeholder = null;
        }
    }

    clear() {
        this.clearPlaceholder();
        while (this.dom.list.firstChild) {
            this.dom.list.removeChild(this.dom.list.firstChild);
        }
        this.dom.items = {};
    }

    onInput(fun: (event: KeyboardEvent | void) => void) {
        this.inputHandlers.push(fun);
    }

    onKeyDown(fun: (event: KeyboardEvent | void) => void) {
        this.keyDownHandlers.push(fun);
    }

    onChange(fun: (string) => void) {
        this.changeHandlers.push(fun);
    }

    onClick(fun: (event: MouseEvent | void) => void) {
        this.clickHandlers.push(fun);
    }

    choose(key: string) {
        if (key) {
            this.changeHandlers.forEach((handler) => handler(key));
        }
    }

    chooseCurrent() {
        this.choose(this.posToKey[this.currentPos]);
    }

    open() {
        this.dom.wrapper.className = this.config.wrapperOpenClass;
        this.dom.list.style.display = 'block';
    }
    close() {
        this.dom.wrapper.className = this.config.wrapperClass;
        this.dom.list.style.display = 'none';
    }
    move(step: number) {
        move(this, step);
    }
}
