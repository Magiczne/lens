type AsyncForEachCallback<T> = (value: T, index: number, array: T[]) => Promise<void>

const arrayToChunks = <T>(array: T[], itemsPerChunk: number): Array<T[]> => {
    if (itemsPerChunk <= 0 || isNaN(itemsPerChunk)) {
        return [array]
    }

    return array.reduce((result: Array<T[]>, item: T, index: number) => {
        const chunkIndex = Math.floor(index / itemsPerChunk)

        if (!result[chunkIndex]) {
            result[chunkIndex] = []
        }

        result[chunkIndex].push(item)

        return result
    }, [])
}

const filterObject = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: ReadonlyArray<K>): Pick<T, K> => {
    return (Object.keys(obj) as Array<K>)
        .filter(key => keys.includes(key))
        .reduce((ret, key) => {
            return Object.assign(ret, {
                [key]: obj[key]
            })
        }, {}) as Pick<T, K>
}

const forEachAsync = async <T>(array: T[], callback: AsyncForEachCallback<T>): Promise<void> => {
    for (let i = 0; i < array.length; i++) {
        await callback(array[i], i, array)
    }
}

const isStringArray = (array: Array<unknown>): array is Array<string> => {
    return array.every(el => (typeof el === 'string'))
}

export {
    arrayToChunks,
    filterObject,
    forEachAsync,
    isStringArray
}
