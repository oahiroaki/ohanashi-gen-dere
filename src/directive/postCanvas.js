App.directive('postCanvas', ['POST', 'Idols',
function(POST, Idols) {
  var width  = POST.width // 全体幅
    , height = POST.height // 全体高さ
    , margin = POST.margin // 外側とのスペース
    , padding = POST.padding // 内側とのスペース
    , iconSize = POST.iconSize // アイコンサイズ
    , postWidth = width - iconSize // 吹き出し部幅
    , postHeight = height // 吹き出し部高さ
    , diff = margin + padding
    , separaterHeight = POST.separaterHeight // 区切り線部高さ
    , frameWidth = postWidth - margin * 2
    , frameHeight = postHeight - margin * 2
    , contentWidth = frameWidth - padding * 2
    , contentHeight = frameHeight - padding * 2
    , lineHeight = ~~((contentHeight - separaterHeight) / 5)
    , nameFrameWidth = ~~(frameWidth / 2.5)
    , nameFrameHeight = lineHeight + padding

  function drawBackground(context) {
    context.clearRect(0, 0, width, width)
    context.fillStyle = POST.frameBgColor
    context.fillRect(0, 0, width, height)
  }

  function drawIcon(context, imgSrc, option) {
    var opt = option || {}
      , radius = POST.borderRadius
      , iconFrameSize = iconSize - margin * 2

    context.beginPath()
    context.arc(
        margin + radius, margin + radius,
        radius, -Math.PI, -0.5 * Math.PI, false)
    context.arc(
        margin + iconFrameSize - radius, margin + radius,
        radius, -0.5 * Math.PI, 0, false)
    context.arc(
        margin + iconFrameSize - radius, margin + iconFrameSize - radius,
        radius, 0, 0.5 * Math.PI, false)
    context.arc(
        margin + radius, margin + iconFrameSize - radius,
        radius, 0.5 * Math.PI, Math.PI, false)
    context.closePath()

    context.fillStyle = opt.iconBgColor || POST.iconBgColor
    context.fill()
    context.strokeStyle = opt.borderColor || POST.borderColor
    context.lineWidth = opt.borderWidth || POST.borderWidth
    context.stroke()

    var img = new Image()
    img.src = imgSrc
    img.onload = function() {
      var size = iconFrameSize - POST.borderWidth * 2
      context.drawImage(img,
          margin + POST.borderWidth, margin + POST.borderWidth, size, size)
    }
  }

  function drawFrame(context, option) {
    var opt = option || {}
      , radius = POST.borderRadius // 角の丸み
      , curveWidth = 30 // 斜線部の幅
      , bezierCurveWidth = 10 // 斜線部の歪みの大きさ

    function lineToWithMargin(x, y) {
      context.lineTo(iconSize + margin + x, margin + y)
    }
    function bezierCurveToWithMargin(x1, y1, x2, y2, x3, y3) {
      context.bezierCurveTo(
          iconSize + margin + x1, margin + y1,
          iconSize + margin + x2, margin + y2,
          iconSize + margin + x3, margin + y3)
    }
    function moveToWithMargin(x, y) {
      context.moveTo(iconSize + margin + x, margin + y)
    }
    function arcToWithMargin(x1, y1, x2, y2) {
      context.arcTo(
          iconSize + margin + x1, margin + y1,
          iconSize + margin + x2, margin + y2, radius)
    }

    context.beginPath()
    moveToWithMargin(0, radius) // 左上
    arcToWithMargin(0, 0, radius, 0)
    lineToWithMargin(nameFrameWidth, 0) // 斜線部
    bezierCurveToWithMargin(
        nameFrameWidth + bezierCurveWidth, 0,
        nameFrameWidth + curveWidth - bezierCurveWidth, nameFrameHeight,
        nameFrameWidth + curveWidth, nameFrameHeight)
    lineToWithMargin(frameWidth - radius, nameFrameHeight) // 右上
    arcToWithMargin(
        frameWidth, nameFrameHeight,
        frameWidth, nameFrameHeight + radius)
    lineToWithMargin(frameWidth, frameHeight - radius) // 右下
    arcToWithMargin(
        frameWidth, frameHeight,
        frameWidth - radius, frameHeight)
    lineToWithMargin(radius, frameHeight) // 左下
    arcToWithMargin(0, frameHeight, 0, frameHeight - radius)
    context.closePath()

    context.fillStyle = opt.bgColor || POST.bgColor
    context.fill()
    context.lineWidth = opt.borderWidth || POST.borderWidth
    context.strokeStyle = opt.borderColor || POST.borderColor
    context.stroke()
  }

  function drawTitle(context, name, option) {
    var opt = option || {}
      , separaterCenter = ~~(separaterHeight / 2)
      , radius = POST.lineRadius
      , space = POST.lineSpace
      , step = (radius + space) * 2

    function arcWithDiff(x, y) {
      context.arc(x + diff + iconSize, y, radius, 0, Math.PI * 2)
    }
    context.fillStyle = opt.borderColor || POST.borderColor
    // 横の点線
    for (var x = radius, max = contentWidth; x < max; x += step) {
      context.beginPath()
      arcWithDiff(x, nameFrameHeight + margin + separaterCenter)
      context.closePath()
      context.fill()
    }
    // 縦の点線
    for (var i = 0; i < 3; i++) {
      for (var y = nameFrameHeight + separaterCenter + margin,
          min = diff; y > min; y -= step) {
        context.beginPath()
        arcWithDiff(radius + step * i, y)
        context.closePath()
        context.fill()
      }
    }
    context.font = lineHeight + "px 'rounded-mplus-1m-medium'"
    context.textBaseline = 'middle'
    context.fillStyle = opt.nameColor || POST.nameColor
    context.fillText(name, iconSize + diff + 3 * step + 5,
        margin + radius + ~~(nameFrameHeight / 2))
  }

  function drawMessage(context, message, fontSize, option) {
    var opt = option || {}
      , fontPx = 0
    switch (fontSize) {
      case 'S': fontPx = ~~(lineHeight / 2); break
      case 'M': fontPx = lineHeight; break
      case 'L': fontPx = lineHeight * 4; break
      default: throw new Error('Unknown font size'); break
    }
    context.font = (fontPx - 2) + "px 'rounded-mplus-1m-medium'"
    context.fillStyle = opt.color || POST.color
    context.textBaseline = 'middle'
    var fontCenter = ~~(fontPx / 2)
    message.split("\n").forEach(function(line, idx) {
      context.fillText(
        line, iconSize + diff,
        nameFrameHeight + diff + separaterHeight + fontCenter + fontPx * idx)
    })
  }

  function clearMessage(context, option) {
    var opt = option || {}
      , x = iconSize + diff
      , y = diff + nameFrameHeight + separaterHeight
      , w = contentWidth
      , h = contentHeight - nameFrameHeight - separaterHeight
    context.clearRect(x, y, w, h)
    context.fillStyle = opt.bgColor || POST.bgColor
    context.fillRect(x, y, w, h)
  }

  return {
    restrict: 'A',
    link: function(scope, element) {
      var context = element[0].getContext('2d')
      element
        .attr('width', width)
        .attr('height', height)
      scope.$on('drawAll', function() {
        drawBackground(context)
        drawIcon(context, scope.iconSrc, {borderColor: scope.borderColor})
        drawFrame(context, {borderColor: scope.borderColor})
        drawTitle(context, scope.name, {borderColor: scope.borderColor})
        drawMessage(context, scope.message, scope.fontSize)
      })
      scope.$on('drawPost', function() {
        drawFrame(context, {borderColor: scope.borderColor})
        drawTitle(context, scope.name, {borderColor: scope.borderColor})
        drawMessage(context, scope.message, scope.fontSize)
      })
      scope.$on('drawMessage', function() {
        clearMessage(context)
        drawMessage(context, scope.message, scope.fontSize)
      })
    }
  }
}])
