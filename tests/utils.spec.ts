import each from 'jest-each'

import { arrayToChunks, filterObject, isStringArray } from '@/utils'

describe('arrayToChunks', () => {
    const array = ['a', 'b', 'c', 'd', 'e']

    it('splits array into chunks', () => {
        const chunks = arrayToChunks(array, 2)

        expect(chunks).toStrictEqual([
            ['a', 'b'],
            ['c', 'd'],
            ['e']
        ])
    })

    each([
        0, -1, -10, -Infinity
    ]).it('returns one chunk when chunk size is less than 1 (%s)', (chunkSize: number) => {
        const chunks = arrayToChunks(array, chunkSize)

        expect(chunks).toStrictEqual([
            ['a', 'b', 'c', 'd', 'e']
        ])
    })

    it('returns one chunk when chunk size is infinity', () => {
        const chunks = arrayToChunks(array, Infinity)

        expect(chunks).toStrictEqual([
            ['a', 'b', 'c', 'd', 'e']
        ])
    })

    it('returns one chunk when chunk size is NaN', () => {
        const chunks = arrayToChunks(array, NaN)

        expect(chunks).toStrictEqual([
            ['a', 'b', 'c', 'd', 'e']
        ])
    })
})

describe('filterObject', () => {
    it('filters object', () => {
        const obj = {
            a: 10,
            b: 'test',
            c: {
                d: 15
            }
        }

        const filteredObj = filterObject(obj, ['a', 'c'])

        expect(filteredObj).toStrictEqual({
            a: 10,
            c: {
                d: 15
            }
        })
    })
})

describe('isStringArray', () => {
    it('returns true when array consists only of strings', () => {
        const arr = ['a', 'b', 'c']

        expect(isStringArray(arr)).toBe(true)
    })

    it('returns false when array contains element of another type', () => {
        const arr = ['a', 'b', 10]

        expect(isStringArray(arr)).toBe(false)
    })
})
