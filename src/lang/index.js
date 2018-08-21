/**
 * This file enables the dashboard to display various languages and to easily add new language support
 * Worklow:
 * Add new language - Add an entry for your new language in 'support.json' and run 'build/applyEnAsTemplate.js'. The new
 * langage file will be automatically built
 * Add a new entry for all langs: Add the new entry in 'EN.json' and run 'build/applyEnAsTemplate.js'. The entry will be
 * added to all other lang files
 * */

export default (lang) => {
  let l
  try {
    return require(`./packages/${lang}.json`)
  } catch (e) {
    return require(`./packages/EN.json`) // English is the fallback
  }
}
