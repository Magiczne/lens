/**
 * Split array into chunks of specified length.
 *
 * If the number of items in the array is not dividable by the itemsPerChunk,
 * the last chunk will contain only remainder of items.
 *
 * @param array Array to be chunked
 * @param itemsPerChunk How many items should be included in one chunk
 * @return Array of chunks
 */
const arrayToChunks = <T>(array: Array<T>, itemsPerChunk: number): Array<Array<T>> => {
    if (itemsPerChunk <= 0 || isNaN(itemsPerChunk)) {
        return [array]
    }

    return array.reduce((result: Array<Array<T>>, item: T, index: number) => {
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
