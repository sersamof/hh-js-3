// @flow
import type { SelectView } from './typings';

const NULL_POS = -1;

const getNextPos = (selectView: SelectView, position: number, step: number) => {
    const mod = Object.keys(selectView.posToKey).length;
    // NULL_POS перед первым элементом и после последнего
    // иначе - циклическая прокрутка
    if (mod === 0) {
        return NULL_POS;
    }
    if (mod === 1 && position === NULL_POS) {
        return 0;
    }
    return ((((position - NULL_POS + step) % mod) + mod) % mod) + NULL_POS;
};
export const resetPosition = (selectView: SelectView) => {
    selectView.currentPos = NULL_POS;
};

export const createRow = (selectView: SelectView, key: string, value: string): HTMLElement => {
    const onClick = (event: MouseEvent) => {
        const { target } = event;
        if (target instanceof HTMLElement) {
            const key = target.getAttribute('data-key');
            if (key) {
                selectView.choose(key);
            }
        }
    };
    const onHover = (event: MouseEvent) => {
        moveTo(selectView, key);
    };

    const li = document.createElement('li');
    li.setAttribute('data-key', key);
    li.textContent = value;
    li.className = selectView.config.rowClass;
    li.addEventListener('click', onClick);
    li.addEventListener('mouseenter', onHover);
    return li;
};

export const clearHighlights = (selectView: SelectView) => {
    const currentPos = selectView.currentPos;
    if (currentPos !== NULL_POS) {
        selectView.dom.items[selectView.posToKey[currentPos]].className =
            selectView.config.rowClass;
    }
};

export const move = (selectView: SelectView, step: number) => {
    const currentPos = selectView.currentPos;
    clearHighlights(selectView);
    const newPos = getNextPos(selectView, currentPos, step);
    selectView.currentPos = newPos;
    if (newPos !== NULL_POS) {
        moveTo(selectView, selectView.posToKey[newPos]);
    }
};
export const moveTo = (selectView: SelectView, id: string) => {
    clearHighlights(selectView);
    selectView.currentPos = selectView.keyToPos[id];
    selectView.dom.items[id].className = selectView.config.hoverClass;
};
