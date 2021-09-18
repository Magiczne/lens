import * as Yup from 'yup'
import { Viewport } from 'puppeteer'

const viewportSchema: Yup.SchemaOf<Viewport> = Yup.object().shape({
    width: Yup.number().required().integer().moreThan(0),
    height: Yup.number().required().integer().moreThan(0),
    deviceScaleFactor: Yup.number().notRequired().moreThan(0),
    isMobile: Yup.bool().notRequired(),
    hasTouch: Yup.bool().notRequired(),
    isLandscape: Yup.bool().notRequired()
}).required()

export {
    viewportSchema
}
