/**
 * Checks if array contains only string elements
 *
 * @param array Array of items
 */
const isStringArray = (array: Array<unknown>): array is Array<string> => {
    return array.every(el => (typeof el === 'string'))
}

export {
    isStringArray
}
