type AsyncForEachCallback<T> = (value: T, index: number, array: Array<T>) => Promise<void>

/**
 * Performs asynchronous for loop, awaiting each callback function
 *
 * @param array Array
 * @param callback Callback function to be applied to each item
 */
const forEachAsync = async <T>(array: Array<T>, callback: AsyncForEachCallback<T>): Promise<void> => {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i, array)
    }
}

export type {
    AsyncForEachCallback
}

export {
    forEachAsync
}
