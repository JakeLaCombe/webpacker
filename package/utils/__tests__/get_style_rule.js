const { chdirTestApp, chdirCwd } = require('../helpers')

chdirTestApp()

const getStyleRule = require('../get_style_rule')

describe('getStyleRule', () => {
  afterAll(chdirCwd)

  test('excludes modules by default', () => {
    const cssRule = getStyleRule(/\.(css)$/i)
    const expectation = {
      test: /\.(css)$/i,
      exclude: /\.module\.[a-z]+$/
    }

    expect(cssRule).toMatchObject(expectation)
  })

  test('includes modules if set to true', () => {
    const cssRule = getStyleRule(/\.(scss)$/i, true)
    const expectation = {
      test: /\.(scss)$/i,
      include: /\.module\.[a-z]+$/
    }

    expect(cssRule).toMatchObject(expectation)
  })

  test('adds extra preprocessors if supplied', () => {
    const expectation = [{ foo: 'bar' }]
    const cssRule = getStyleRule(/\.(css)$/i, true, expectation)

    expect(cssRule.use).toMatchObject(expect.arrayContaining(expectation))
  })

  test('adds default postcssrc if one is not found', () => {
    const fs = require('fs')
    fs.existsSync = jest.fn()
    fs.existsSync.mockReturnValue(false)

    const expectation = [{ foo: 'bar' }]
    const getStyleRule = require('../get_style_rule')
    const cssRule = getStyleRule(/\.(css)$/i, true, expectation)

    const loader = cssRule.use.find((currentLoader) => {
      return currentLoader.loader === 'postcss-loader'
    })

    console.log("Loader");
    console.log(loader.options);
    if (typeof loader.options.config === "string") {
      expect(loader.options).toContain('lib/install/config/.postcssrc.yml');
    } else {
      console.log(loader.options);
      expect(loader.options.config.path).toContain('lib/install/config/.postcssrc.yml');
    }
  });
})
