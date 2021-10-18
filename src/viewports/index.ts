import { Viewport } from 'puppeteer'

import desktop from '@/viewports/desktop'
import phone from '@/viewports/phone'
import tablet from '@/viewports/tablet'

type ViewportType = 'desktop' | 'phone' | 'tablet'

const defaultViewports: Record<ViewportType, Viewport[]> = {
    desktop,
    phone,
    tablet
}

const availableViewportSets = Object.keys(defaultViewports) as ReadonlyArray<ViewportType>

export {
    availableViewportSets,
    defaultViewports,
    ViewportType
}
