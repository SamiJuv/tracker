const stringToMachineName = (string) => {
  return string
    .toLowerCase()
    .replace(/[^A-Za-z0-9 ]/g,'') // Remove unwanted characters, only accept alphanumeric and space
    .replace(/\s{2,}/g,' ') // Replace multi spaces with a single space
    .replace(/\s/g, "_"); // Replace space with a '-' symbol
}

module.exports = {
  stringToMachineName
}