/* eslint-disable @typescript-eslint/no-explicit-any */

const path = jest.createMockFromModule('path') as any

// eslint-disable-next-line @typescript-eslint/no-unused-vars
path.resolve = (...pathSegments: string[]): string => {
    return 'resolved path'
}

export default path
