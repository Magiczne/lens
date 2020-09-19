import each from 'jest-each'

import { arrayToChunks } from '@/utils'

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
