import dva from 'dva'

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout))

const initDva = (models, component) => {
  const app = dva()
  app.use(require('dva-immer')())
  app.use(require('dva-loading')())
  models.forEach(model => {
    app.model(model)
  })
  app.router(() => (component ? component : <div />))
  const Page = app.start()
  return { app, Page }
}

export { delay, initDva }