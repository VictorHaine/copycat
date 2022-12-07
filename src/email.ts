import faker from '@faker-js/faker'
import { int } from 'fictional'
import { despace } from './despace'
import { firstName as baseFirstName } from './firstName'
import { join } from './join'
import { lastName as baseLastName } from './lastName'
import { oneOfString } from './oneOfString'
import { char, oneOf } from './primitives'

import { Input } from './types'

interface EmailOptions {
  limit?: number
}

const emailifyName = (s: string) => s.replace(/[^A-Za-z]/g, '_')

const firstName = (input: Input): string => emailifyName(baseFirstName(input))
const lastName = (input: Input): string => emailifyName(baseLastName(input))

const domainNameSegments = ['', '-']
  .map((joiner: string) => [
    join(joiner, [
      oneOfString(faker.locales.en!.word!.adjective!.map(despace), char.letter),
      oneOfString(faker.locales.en!.word!.noun!.map(despace), char.letter),
    ]),
    join(joiner, [
      oneOfString(faker.locales.en!.word!.verb!.map(despace), char.letter),
      oneOfString(faker.locales.en!.word!.noun!.map(despace), char.letter),
    ]),
  ])
  .flat()

export const email = (input: Input, options: EmailOptions = {}): string =>
  join(
    input,
    '',
    [
      oneOf([
        join('_', [firstName, lastName]),
        join('.', [firstName, lastName]),
      ]),
      int.options({
        min: 2,
        max: 99999,
      }),
      '@',
      oneOf(domainNameSegments),
      '.',
      oneOfString(faker.locales.en!.internet!.domain_suffix!),
    ],
    options
  )
