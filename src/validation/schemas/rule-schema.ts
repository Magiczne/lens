import * as Yup from 'yup'
import { Rule } from '@/typings/rules'
import { isStringArray } from '@/util'
import { availableViewportSets, ViewportType } from '@/viewports'

import { viewportSchema } from '@/validation/schemas/viewport-schema'

const ruleSchema: Yup.SchemaOf<Rule> = Yup.object().shape({
    url: Yup.string().required().test({
        name: 'is-valid-url',
        test (v) {
            let url: URL

            if (v === undefined) {
                return this.createError({
                    message: 'Url in path ${path} does not exist. That should not be a case.',
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

export {
    ruleSchema
}
