'use strict'

import Markdown from 'marked'

const renderer = new Markdown.Renderer()
const alertRenderer = new Markdown.Renderer()

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

const icon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    class="fill-current stroke-current"
    stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
    class="icon">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
`

alertRenderer.heading = (text: string, level: HeadingLevel) => {
  return `<h${level} class="alert-heading">${text}</h${level}>`
}

renderer.heading = (text: string, level: HeadingLevel) => {
  if (level === 1) {
    return `<h1>${text}</h1>`
  }

  const slug = text.toLowerCase().replace(/[^\w]+/g, '-')

  return `<h${level} class="flex items-center">
            <a href="#${slug}" name="${slug}" class="p-1 -ml-8 mr-2 hover:text-blue-800 hover:bg-blueGray-100 rounded">
              ${icon}
            </a>
            ${text}
          </h${level}>`
}

// eslint-disable-next-line @typescript-eslint/default-param-last
renderer.code = (content: string, identifier = '', escaped: boolean) => {
  if (['info', 'success', 'warning'].includes(identifier)) {
    const html: string = Markdown(content, { renderer: alertRenderer })

    return `<div class="alert alert-${identifier} rounded flex px-4 text-sm">
              <div class="flex-shrink-0">
                  <img src="/images/icons/alerts/${identifier}.svg" />
              </div>
              <div class="ml-4">${html}</div>
            </div>`
  }

  // use standard renderer if not matching alert identifier
  return new Markdown.Renderer().code(content, identifier, escaped)
}

renderer.table = (header: string, body: string) => {
  return `<table class="table table-hover">
      ${header}
      ${body}
    </table>`
}

Markdown.setOptions({ renderer })

export { Markdown }
