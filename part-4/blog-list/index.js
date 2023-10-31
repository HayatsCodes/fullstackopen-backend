const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'test') {
    console.log(`Server running on port ${PORT}`)
  }
  logger.info(`Server running on port ${PORT}`)
})