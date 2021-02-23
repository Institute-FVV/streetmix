import React from 'react'
import { FormattedMessage } from 'react-intl'
import TeamMember from './TeamMember'
import CREDITS from './credits.json'
import './Credits.scss'

// NOTE: on testing this component
//
// The `<Credits />` component is rendered inside of a snapshot of `<AboutDialog />`
// and does not need to be unit-tested on its own. When `<AboutDialog />` renders a
// snapshot, it uses a mock version of `credits.json`. This allows the component to
// test rendering logic without needing to change the snapshot when the credits
// themselves change.

function alphabetizeNames (a, b) {
  // Ignore case
  const nameA = a.name.toLowerCase()
  const nameB = b.name.toLowerCase()

  if (nameA < nameB) {
    return -1
  }

  if (nameA > nameB) {
    return 1
  }

  // If names are equal
  return 0
}

// This is a temporary stash of English-language labels for credits
// because right now we don't have a way to fall back when a label is untranslated.
// We can remove this once this has been built into our localization infrastructure.
const UNTRANSLATED_LABELS = {
  advisors: 'Advisors',
  'additional-illustrations': 'Additional illustrations',
  'additional-code': 'Additional code',
  'additional-contributors': 'Additional contributors',
  'special-thanks': 'Special thanks to',
  ar: 'Arabic',
  ca: 'Catalan',
  de: 'German',
  en: 'English',
  es: 'Spanish',
  'es-mx': 'Spanish (Mexico)',
  'es-419': 'Spanish (Latin America)',
  fi: 'Finnish',
  fr: 'French',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  pl: 'Polish',
  'pt-br': 'Portuguese (Brazil)',
  ru: 'Russian',
  sv: 'Swedish',
  zh: 'Chinese'
}

function Credits (props) {
  return (
    <>
      <h2>
        <FormattedMessage
          id="credits.extension-team-heading"
          defaultMessage="This local adaptation for Austria made by"
        />
      </h2>

      <div className="credits-team">
        {CREDITS.fvv
          .filter((person) => person.active)
          .sort(alphabetizeNames)
          .map((person) => (
            <TeamMember {...person} key={person.name} />
          ))}
      </div>
      <h2>
        <FormattedMessage
          id="credits.core-team-heading"
          defaultMessage="Project team"
        />
      </h2>

      <div className="credits-team">
        {CREDITS.team
          .filter((person) => person.active)
          .sort(alphabetizeNames)
          .map((person) => (
            <TeamMember {...person} key={person.name} />
          ))}
      </div>

      <h2>
        <FormattedMessage
          id="credits.past-team-heading"
          defaultMessage="Past team members"
        />
      </h2>

      <div className="credits-team credits-team-past">
        {CREDITS.team
          .filter((person) => !person.active)
          .sort(alphabetizeNames)
          .map((person) => (
            <TeamMember {...person} key={person.name} />
          ))}
      </div>

      <div className="credits-container">
        <div className="credits-credits-left">
          {Object.entries(CREDITS.contributors).map(([key, value]) => (
            <React.Fragment key={key}>
              <h3>
                <FormattedMessage
                  id={`credits.${key}`}
                  defaultMessage={UNTRANSLATED_LABELS[key]}
                />
              </h3>
              <ul>
                {value.sort().map((name) =>
                  Array.isArray(name) ? (
                    <li key={name[0]}>
                      {name[0]}, <i>{name[1]}</i>
                    </li>
                  ) : typeof name === 'string' ? (
                    <li key={name}>{name}</li>
                  ) : (
                    <li key={name.label}>
                      <h4>{name.label}</h4>
                      <ul>
                        {name.people.map((person) => (
                          <li key={person}>{person}</li>
                        ))}
                      </ul>
                    </li>
                  )
                )}
              </ul>
            </React.Fragment>
          ))}
        </div>
        <div className="credits-credits-right">
          <h3>
            <FormattedMessage
              id="credits.translators"
              defaultMessage="Translators"
            />
          </h3>

          <ul>
            {/* TODO: Alphabetize language names for each locale */}
            {Object.entries(CREDITS.translators).map(([key, value]) => (
              <li key={key}>
                <h4>
                  <FormattedMessage
                    id={`i18n.lang.${key}`}
                    defaultMessage={UNTRANSLATED_LABELS[key]}
                  />
                </h4>
                <ul>
                  {value.sort().map((name) =>
                    Array.isArray(name) ? (
                      <li key={name[0]}>
                        {name[0]}, <i>{name[1]}</i>
                      </li>
                    ) : (
                      <li key={name}>{name}</li>
                    )
                  )}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h3>Disclaimer</h3>
      <p>This tool is provided as is, and no support will be given. This tool is based on Streetmix, and terms and condition of Streetmix's developer may apply. Querying a large amount of data within a very short time, for example by automated means, is prohibited. Technische Universität Wien (TU Wien hereafter) retains the right to block the use of this geoencoding tool if such a high-intensity request is detected. TU Wien, the developers and any other person assume no responsibility for the accuracy of the data. The street cross-section represented in this programme serves for an information purpose. Should the actual street cross-section and the representation in this tool are different, the actual cross-section has precedence. In no event shall TU Wien, the developers and any other person be liable to any person for any damage or loss that may arise from the use of this geoencoding tool. Please be aware that the use of this tool will be deemed as agreeing to the terms of these conditions.</p>
    </>
  )
}

export default Credits
