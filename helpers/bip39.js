import * as bip39 from 'bip39'

export const generateMnemonic = (language, wordCount) => {
  bip39.setDefaultWordlist(language)
  const strength = Math.floor(parseInt(wordCount) * 10.66666666666) + 1
  return bip39.generateMnemonic(strength)
}

export const mnemonicToSeed = (mnemonic, password) => {
  return bip39.mnemonicToSeedSync(mnemonic, password)
}

export const mnemonicToEntropy = (mnemonic) => {
  return bip39.mnemonicToEntropy(mnemonic)
}

export const entropyToMnemonic = (entropy) => {
  return bip39.entropyToMnemonic(entropy)
}
