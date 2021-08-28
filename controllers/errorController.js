const errorController = {
  sendError: function (req, res, title, code) {
    res.status(code)
    res.render('error', {
      title: title,
      css: ['global', 'error'],
      status: {
        code: parseInt(code),
        message: title
      },
      backLink: '/main_page'
    })
  }
}

module.exports = errorController
