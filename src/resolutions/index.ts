import desktop from '@/resolutions/desktop'
import phone from '@/resolutions/phone'
import tablet from '@/resolutions/tablet'

import { Resolution } from '@/typings/types'

const defaultResolutions: Record<string, Resolution[]> = {
    desktop,
    phone,
    tablet
}

export {
    defaultResolutions
}
