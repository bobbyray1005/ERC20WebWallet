import Web3 from 'web3'
window.addEventListener('load', function () {
  window.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/5d09436c72db420e87ce0c587e48c073'));
  this.console.log("web3 initialized ok!");
})
