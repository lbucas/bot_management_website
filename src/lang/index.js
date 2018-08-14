export default (lang) => {
  let l
  try {
    return require(`./packages/${lang}.json`)
  } catch (e) {
    return require(`./packages/EN.json`)
  }
}
