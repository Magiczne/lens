import { Viewport } from 'puppeteer'

import desktop from '@/viewports/desktop'
import phone from '@/viewports/phone'
import tablet from '@/viewports/tablet'

const defaultViewports: Record<string, Viewport[]> = {
    desktop,
    phone,
    tablet
}

export {
    defaultViewports
}
