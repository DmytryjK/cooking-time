const debounce = function <T extends (...args: any[]) => any>(
    func: T,
    delay: number
) {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

export default debounce;
