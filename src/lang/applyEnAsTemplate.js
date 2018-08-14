/** This script takes the english language file as template and applies all new fields to the other language files.
 * All languages in the support.json file will be updated */

const langs = require('./support')
let template = require('./packages/EN.json')
let fs = require('fs')
let path = process.cwd()

for (let lang in langs) {
  if (lang !== 'EN') {
    let toChange
    try {
      toChange = require(`./packages/${lang}.json`)
    } catch (e) {
      toChange = {}
    }
    for (let view in template) {
      toChange[view] = toChange[view] || {}
      for (let sentence in template[view]) {
        toChange[view][sentence] = toChange[view][sentence] || `[[ ${template[view][sentence]} ]]`
      }
    }
    for (let view in toChange) {
      if (view in template) {
        for (let sentence in toChange[view]) {
          if (!(sentence in template[view])) {
            delete toChange[view][sentence]
          }
        }
      } else {
        delete toChange[view]
      }
    }
    let fileContent = JSON.stringify(toChange, null, 2)
    console.log('Saving ' + lang)
    fs.writeFile(`${path}\\src\\lang\\packages\\${lang}.json`, fileContent, (r) => {})
  }
}
