import { Viewport } from 'puppeteer'
import * as Yup from 'yup'

import { Rule, Ruleset } from '@/typings/rules'
import { isStringArray } from '@/utils'
import { availableViewportSets, ViewportType } from '@/viewports'

const viewportSchema: Yup.SchemaOf<Viewport> = Yup.object().shape({
    width: Yup.number().required().integer().moreThan(0),
    height: Yup.number().required().integer().moreThan(0),
    deviceScaleFactor: Yup.number().notRequired().moreThan(0),
    isMobile: Yup.bool().notRequired(),
    hasTouch: Yup.bool().notRequired(),
    isLandscape: Yup.bool().notRequired()
}).required()

const ruleSchema: Yup.SchemaOf<Rule> = Yup.object().shape({
    url: Yup.string().required().test({
        name: 'is-valid-url',
        test (v) {
            let url: URL

            if (v === undefined) {
                return this.createError({
                    message: `Url in path \${path} (${v}) is invalid. Remember to include protocol.`,
                    path: this.path
                })
            }

            try {
                url = new URL(v)
            } catch (e) {
                return this.createError({
                    message: `Url in path \${path} (${v}) is invalid. Remember to include protocol.`,
                    path: this.path
                })
            }

            if (!['http:', 'https:'].includes(url.protocol)) {
                return this.createError({
                    message: `Url in path \${path} (${v}) is invalid. Only http: and https: protocols are allowed`,
                    path: this.path
                })
            }

            return true
        }
    }),
    tag: Yup.string().required(),
    renderFor: Yup.lazy(val => {
        if (Array.isArray(val)) {
            if (isStringArray(val)) {
                return Yup.array()
                    .of(Yup.string().oneOf(availableViewportSets as Array<ViewportType>))
                    .default(availableViewportSets)
            }

            return Yup.array()
                .of(viewportSchema)
                .default(availableViewportSets)
        } else if (val === undefined) {
            return Yup.mixed()
                .default(availableViewportSets)
        } else {
            return Yup.mixed()
                .test({
                    name: 'throw',
                    message: '',
                    test () {
                        return this.createError({
                            message: '${path} needs to be an array',
                            path: this.path
                        })
                    }
                })
        }
    }),
    afterPageLoaded: Yup.lazy(val => {
        if (!val) {
            return Yup.mixed().notRequired()
        }

        return Yup.mixed().test({
            name: 'is-function',
            message: '${path} needs to be a function',
            test (v) {
                return typeof v === 'function'
            }
        })
    })
}).required()

const rulesetSchema: Yup.SchemaOf<Ruleset> = Yup.object().shape({
    disable: Yup.bool().default(false),
    rules: Yup.array().of(ruleSchema).required().min(1)
}).required()

export {
    ruleSchema, rulesetSchema, viewportSchema
}
