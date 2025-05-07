export function debounce(callback: Function, delay: number) {
    let timer: ReturnType<typeof setTimeout>;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback();
        }, delay);
    };
}
