import test from 'ava'
import { resolve } from 'path'
import { intercept } from './helpers/console'
import { Nuxt, Builder } from '..'

const port = 4001
// const url = route => 'http://localhost:' + port + route
const rootDir = resolve(__dirname, 'fixtures/basic')

let nuxt = null

// Init nuxt.js and create server listening on localhost:4000
test.serial('Init Nuxt.js', async t => {
  const options = {
    rootDir,
    buildDir: '.nuxt-dev',
    dev: true,
    build: {
      stats: false,
      profile: true,
      extractCSS: {
        allChunks: true
      }
    }
  }

  const spies = await intercept({ log: true, stderr: true }, async () => {
    nuxt = new Nuxt(options)
    await new Builder(nuxt).build()
    await nuxt.listen(port, 'localhost')
  })

  t.true(spies.log.calledWithMatch('DONE'))
  t.true(spies.log.calledWithMatch('OPEN'))
})

// TODO: enable test when style-loader.js:60 was resolved
// test.serial('/extractCSS', async t => {
//   const window = await nuxt.renderAndGetWindow(url('/extractCSS'))
//   const html = window.document.head.innerHTML
//   t.true(html.includes('vendor.css'))
//   t.true(!html.includes('30px'))
//   t.is(window.getComputedStyle(window.document.body).getPropertyValue('font-size'), '30px')
// })

// test.serial('/stateless', async t => {
//   const spies = await intercept()
//   const window = await nuxt.renderAndGetWindow(url('/stateless'))
//   const html = window.document.body.innerHTML
//   t.true(html.includes('<h1>My component!</h1>'))
//   t.true(spies.info.calledWithMatch('You are running Vue in development mode.'))
//   release()
// })

// test('/_nuxt/test.hot-update.json should returns empty html', async t => {
//   try {
//     await rp(url('/_nuxt/test.hot-update.json'))
//   } catch (err) {
//     t.is(err.statusCode, 404)
//     t.is(err.response.body, '')
//   }
// })

// Close server and ask nuxt to stop listening to file changes
test.after.always('Closing server and nuxt.js', async t => {
  await nuxt.close()
})
