import { XMLParser as XMLParserClass } from 'fast-xml-parser'
import { isArrayBuffer } from 'lodash-es'

type ParseParams = Parameters<XMLParserClass['parse']>
type ParsingData = ParseParams[0] | ArrayBuffer
type ValidationOptions = ParseParams[1]

const XMLParser = new XMLParserClass({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
})

export const parseXML = (data: ParsingData, options?: ValidationOptions) => {
  if (isArrayBuffer(data)) {
    const buffer = Buffer.from(data)
    return XMLParser.parse(buffer, options)
  }
  return XMLParser.parse(data, options)
}
