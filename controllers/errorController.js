const messages = {
  401: 'Unauthorized Access',
  404: 'Page Not Found'
}

const errorController = {
  sendError: function (req, res, code, msg = null) {
    res.status(code)
    msg = msg === null ? messages[code] : msg
    try {
      res.render('error', {
        title: msg,
        css: ['global', 'error'],
        status: {
          code: parseInt(code),
          message: msg
        },
        backLink: '/main_page',
        level: req.session.level
      })
    } catch (error) {
      res.send(false)
    }
  }
}

module.exports = errorController
