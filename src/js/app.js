
export default class App {
  constructor (props) {
    console.log('Environment', window.__configApp.environment)
  }

  onload () {
    console.log('App up!')
  }
}

var app = new App()
app.onload()
