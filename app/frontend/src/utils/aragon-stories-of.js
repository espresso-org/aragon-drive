import React from "react"
import { storiesOf } from "@storybook/react"
import { AragonApp } from '@aragon/ui'

/**
 * Same as storiesOf but wraps the story inside an AragonApp component
 * @param {string} componentName
 * @param {*} moduleRef
 */
export function aragonStoriesOf(componentName, moduleRef) {
  const aragonStories = storiesOf(componentName, moduleRef)

  aragonStories._add = aragonStories.add
  aragonStories.add = (storyName, fn) => aragonStories._add(storyName, () => (
    <AragonApp>
      {fn()}
    </AragonApp>
  ))
  return aragonStories
}
