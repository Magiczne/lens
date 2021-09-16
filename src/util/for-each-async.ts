type AsyncForEachCallback<T> = (value: T, index: number, array: T[]) => Promise<void>

const forEachAsync = async <T>(array: T[], callback: AsyncForEachCallback<T>): Promise<void> => {
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
