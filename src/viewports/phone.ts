import { Viewport } from 'puppeteer'

// Common tablet resolutions - viewports
// Values in parenthesis is an actual screen resolution of the device
// Based on https://docs.adobe.com/content/help/en/target/using/experiences/vec/mobile-viewports.html
const resolutions: Viewport[] = [
    // Apple
    { width: 414, height: 896, deviceScaleFactor: 2 },              // iPhone XR (828 x 1792)
    { width: 414, height: 896, deviceScaleFactor: 3 },              // iPhone XS Max (1242 x 2688)
    { width: 414, height: 736, deviceScaleFactor: 1080 / 414 },     // iPhone 8 Plus, 7 Plus, 6 Plus, 6S Plus (1080 x 1920)
    { width: 375, height: 812, deviceScaleFactor: 3 },              // iPhone XS & iPhone X (1125 x 2436)
    { width: 375, height: 667, deviceScaleFactor: 2 },              // iPhone 8, 7, 6, 6S (750 x 1334)

    // Android
    { width: 480, height: 853, deviceScaleFactor: 3 },              // Samsung Galaxy Note 5, LG G5 (1440 x 2560)
    { width: 412, height: 892, deviceScaleFactor: 1080 / 412 },     // OnePlus 6T, 7 (1080 x 2340)
    { width: 411, height: 731, deviceScaleFactor: 1440 / 411 },     // Google Nexus 6P, Pixel XL (1440 x 2560)
    { width: 411, height: 731, deviceScaleFactor: 1080 / 411 },     // Google Nexus 5X, Pixel, Pixel 2 (1080 x 1920)
    { width: 360, height: 740, deviceScaleFactor: 4 },              // Samsung Galaxy S9, S9+, S8, S8+ (1440 x 2960)
    { width: 360, height: 640, deviceScaleFactor: 4 },              // Samsung Galaxy S7, S7 Edge (1440 x 2560)
]

export default resolutions
