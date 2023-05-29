export function forEachReverse<T>(arr: T[], fn: (el: T, i: number) => void){
    for (var i = arr.length - 1; i >= 0; i--) {
        fn(arr[i], i)
    }
}