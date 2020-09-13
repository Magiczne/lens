import { Resolution } from '@/typings/types'

// Common tablet resolutions - viewports
// Values in parenthesis is an actual screen resolution of the device
// Based on https://docs.adobe.com/content/help/en/target/using/experiences/vec/mobile-viewports.html
const resolutions: Resolution[] = [
    // Windows
    { width: 912, height: 1368, deviceScaleFactor: 2 },     // Microsoft Surface Pro 7 (1824 x 2736)

    // Apple
    { width: 1024, height: 1366, deviceScaleFactor: 2 },    // iPad Pro (2048 x 2732)
    { width: 768, height: 1024, deviceScaleFactor: 2 },     // Basically any other iPad (1536 x 2048)
    { width: 768, height: 1024, deviceScaleFactor: 1 },     // iPad Mini (768 x 1024)

    // Android
    { width: 900, height: 1280, deviceScaleFactor: 2 },     // Google Pixel C (1800 x 2560)
    { width: 800, height: 1280, deviceScaleFactor: 1 },     // Samsung Galaxy Tab 10 (800 x 1280)
    { width: 768, height: 1024, deviceScaleFactor: 2 },     // Google Nexus 9 (1536 x 2048)
    { width: 600, height: 960, deviceScaleFactor: 2 },      // Google Nexus 7 (1200 x 1920)
]

export default resolutions
