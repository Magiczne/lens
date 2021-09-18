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

export {
    arrayToChunks
}
