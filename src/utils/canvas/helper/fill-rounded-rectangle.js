import drawRoundedRect from './draw-rounded-rectangle.js'

const zeroValue = 0
const hexBase = 16
const hexLength = 6

const fillRoundedRect = ({ context, rectInfo, color }) => {
  let fillColor = color

  if (typeof fillColor === 'number')
    fillColor = `#${(fillColor & 0xffffff).toString(hexBase).padStart(hexLength, '0')}`

  const ctx = context

  ctx.fillStyle = fillColor

  const { x, y, width, height, radius = zeroValue } = rectInfo

  drawRoundedRect({
    context: ctx,
    x,
    y,
    width,
    height,
    radius
  })

  ctx.fill()
}

export default fillRoundedRect
