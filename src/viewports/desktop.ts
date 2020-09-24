import { Viewport } from 'puppeteer'

// Common desktop resolutions
const resolutions: Viewport[] = [
    // 21:9-like
    { width: 2560, height: 1080 },  // 64:27
    { width: 3440, height: 1440 },  // 43:18
    { width: 1920, height: 800 },   // 12:5

    // 16:10
    { width: 1920, height: 1200 },  // WUXGA
    { width: 1680, height: 1050 },  // WSXGA+
    { width: 1440, height: 900 },   // WXGA+
    { width: 1280, height: 800 },   // WXGA

    // 16:9
    { width: 2560, height: 1440 },  // QHD
    { width: 2048, height: 1152 },  // QWXGA
    { width: 1920, height: 1080 },  // FHD
    { width: 1600, height: 900 },   // HD+
    { width: 1536, height: 864 },   // 125% scaling on a FHD display
    { width: 1280, height: 720 },   // WXGA

    // ~16:9
    { width: 1366, height: 768 },   // HD
    { width: 1360, height: 768 },   // HD

    // 5:4
    { width: 1280, height: 1024 },  // SXGA

    // 3:2
    { width: 2160, height: 1440 },  // 3.11M2
    { width: 1920, height: 1280 },  // FHD+
    { width: 1368, height: 712 },   // 200% scaling on a Microsoft Surface Pro 7
]

export default resolutions
