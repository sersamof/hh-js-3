// @flow
export const debounce = (handler: (...args: Array<any>) => any, delay: number) => {
    let timeout;
    return (...args: Array<any>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => handler(...args), delay);
    };
};
