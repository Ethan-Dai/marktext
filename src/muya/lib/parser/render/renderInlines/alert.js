import { CLASS_OR_ID } from '../../../config'

function alertStyle (str) {
  switch (str) {
    case 'NOTE':
      return { text: ' Note', color: '#4493f8' }
    case 'TIP':
      return { text: ' Tip', color: '#3FB950' }
    case 'IMPORTANT':
      return { text: ' Important', color: '#AB7DF8' }
    case 'WARNING':
      return { text: '! Warning', color: '#D29922' }
    case 'CAUTION':
      return { text: ' Caution', color: '#F85149' }
    default:
      return { text: '', color: '#FFFFFF' }
  }
}

// render token of alert to vdom
export default function alert (h, cursor, block, token, outerClass) {
  const { start: rStart, end: rEnd } = token.range
  const className = this.getClassName(outerClass, block, token, cursor)
  const contentSelector = className !== CLASS_OR_ID.AG_GRAY
    ? `span.${className}.${CLASS_OR_ID.AG_INLINE_RULE}.${CLASS_OR_ID.AG_ALERT_MARKED_TEXT}`
    : `span.${CLASS_OR_ID.AG_INLINE_RULE}.${CLASS_OR_ID.AG_ALERT_MARKED_TEXT}`

  let startMarkerSelector = `span.${className}.${CLASS_OR_ID.AG_ALERT_MARKER}`
  let endMarkerSelector = startMarkerSelector
  let content = token.content
  let pos = rStart + token.marker.length

  if (token.highlights && token.highlights.length) {
    content = []
    for (const light of token.highlights) {
      let { start, end, active } = light
      const HIGHLIGHT_CLASSNAME = this.getHighlightClassName(active)
      if (start === rStart) {
        startMarkerSelector += `.${HIGHLIGHT_CLASSNAME}`
        start++
      }
      if (end === rEnd) {
        endMarkerSelector += `.${HIGHLIGHT_CLASSNAME}`
        end--
      }
      if (pos < start) {
        content.push(block.text.substring(pos, start))
      }
      if (start < end) {
        content.push(h(`span.${HIGHLIGHT_CLASSNAME}`, block.text.substring(start, end)))
      }
      pos = end
    }
    if (pos < rEnd - token.marker.length) {
      content.push(block.text.substring(pos, rEnd - 1))
    }
  }

  const { text, color } = alertStyle(content)
  const alertVdom = h(contentSelector, {
    attrs: {
      spellcheck: 'false'
    },
    dataset: {
      alert: text
    },
    style: {
      '--icon-color': color
    }
  }, content)

  return [
    h(startMarkerSelector, '[!'),
    alertVdom,
    h(endMarkerSelector, ']')
  ]
}
