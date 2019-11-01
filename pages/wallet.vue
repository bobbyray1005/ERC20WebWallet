<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex style="max-width:800px">
        <v-container>
          <v-row>
            <v-col>
              <v-card color="#fff" block outlined>
                <v-row justify="center">
                  <p style="color: #424242" class="ma-3 text-xs-center">{{address}}</p>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mb-6">
            <v-col md="6">
              <v-card color="#26c6da" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title class="headline mb-1">{{ethBalance}} ETH</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-avatar tile class="ma-5">
                    <img
                      class="text-xs-center"
                      style="text-align: center; margin-top: 10px; width:auto; height:70px;"
                      src="../assets/ethereum-icon.png"
                    />
                  </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn @click="toggleSendETH()" text>SEND</v-btn>
                  <v-btn @click="toggleShowQRCode()" text>RECEIVE</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col md="6">
              <v-card outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <v-list-item-title class="headline mb-1">{{erc20Balance}} OAS</v-list-item-title>
                  </v-list-item-content>

                  <img
                    class="text-xs-center"
                    style="text-align: center; width:80px; height:80px;"
                    src="../assets/oaschain-logo.png"
                  />
                </v-list-item>

                <v-card-actions>
                  <v-btn @click="toggleSendERC20()" text>SEND</v-btn>
                  <v-btn @click="toggleShowQRCode()" text>RECEIVE</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-show="showQRCode" justify="center">
            <img
              style="text-align: center; width:250px; height:250px;"
              :src="`https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${address}&choe=UTF-8`"
            />
          </v-row>

          <v-row v-show="sendEtherDiv" justify="center">
            <div class="col-12">
              <v-row justify="center">
                <p class="display-1 ml-5 text-xs-center">Send ETH</p>
              </v-row>
              <v-form @submit.prevent="sendEther">
                <v-row justify="center">
                  <v-col cols="12" md="7" sm="6">
                    <kbd class="white--text mb-3 mt-5">To Address</kbd>
                    <v-text-field
                      solo
                      style="max-width:800px"
                      v-model="toAddress"
                      type="text"
                      label="To Address"
                    />
                    <kbd class="white--text mb-3 mt-5">Amount ETH</kbd>
                    <v-text-field
                      solo
                      style="max-width:800px"
                      v-model="amountETH"
                      type="text"
                      label="Amount ETH"
                    />

                    <v-slider
                      v-model="gasPriceSlider"
                      class="mt-5 mb-5"
                      :color="ex1.color"
                      :tick-labels="gasPriceLabels"
                      :max="2"
                      step="1"
                      label="Gas Price"
                      ticks="always"
                      tick-size="4"
                    ></v-slider>
                    <p class="subtitle-1 grey--text">Estimated Fee: {{computeFeesETH}} ETH</p>
                    <v-btn
                      id="styled-input"
                      color="green"
                      class="styled-input"
                      block
                      type="submit"
                    >SEND ETH</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-row>

          <v-row v-show="sendERC20Div" justify="center">
            <div class="col-12">
              <v-row justify="center">
                <p class="display-1 ml-5 text-xs-center">Send OAS</p>
              </v-row>
              <v-form @submit.prevent="sendERC20">
                <v-row justify="center">
                  <v-col cols="12" md="7" sm="6">
                    <kbd class="white--text mb-3 mt-5">To Address</kbd>
                    <v-text-field
                      solo
                      style="max-width:800px"
                      v-model="toAddress"
                      type="text"
                      label="To Address"
                    />
                    <kbd class="white--text mb-3 mt-5">Amount OAS</kbd>
                    <v-text-field
                      solo
                      style="max-width:800px"
                      v-model="amountOAS"
                      type="text"
                      label="Amount OAS"
                    />

                    <v-slider
                      v-model="gasPriceSlider"
                      class="mt-5 mb-5"
                      :color="ex1.color"
                      :tick-labels="gasPriceLabels"
                      :max="2"
                      step="1"
                      label="Gas Price"
                      ticks="always"
                      tick-size="4"
                    ></v-slider>
                    <p class="subtitle-1 grey--text">Estimated Fee: {{computeFeesToken}} ETH</p>
                    <v-btn
                      id="styled-input"
                      color="green"
                      class="styled-input"
                      block
                      type="submit"
                    >SEND OAS</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-row>

          <v-row v-if="txHash" justify="center">
            <kbd class="mt-5 pa-1 text-xs-center">Transaction hash: {{txHash}}</kbd>

            <v-btn
              @click="toEtherScanTxHash(txHash)"
              small
              outlined
              class="mt-5 text-xs-center"
            >Verify on Etherscan</v-btn>
          </v-row>

          <v-row v-if="isTxConfirmed" justify="center">
            <kbd class="green mt-5 pa-1 text-xs-center">Transaction successfully confirmed!</kbd>
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import web3 from "../helpers/web3";
const Tx = require("ethereumjs-tx").Transaction;
var ethUtil = require("ethereumjs-util");
import { Constants } from "../helpers/constants";
import erc20TokenABI from "../helpers/erc20abi";
export default {
  data() {
    return {
      sendERC20Div: false,
      sendEtherDiv: false,
      ethBalance: null,
      erc20Balance: null,
      toAddress: "",
      amountETH: 0,
      amountOAS: 0,
      gasPriceSlider: 1,
      showQRCode: false,
      address: "",
      qrCodeSize: 250,
      totalOAS: 0,
      isMounted: false,
      gasCostWei: 12000000000,
      feesETH: 0,
      gasPriceLabels: ["Slow", "Normal", "Fast"],
      ex1: { label: "color", val: 1, color: "blue darken-3" },
      account: null,
      txHash: "",
      isTxConfirmed: false
    };
  },
  computed: {
    computedGasPrice: function() {
      if (this.gasPriceSlider == 0) {
        return (this.gasCostWei * 50) / 100;
      }
      if (this.gasPriceSlider == 1) {
        return this.gasCostWei;
      }
      if (this.gasPriceSlider == 2) {
        return (this.gasCostWei * 150) / 100;
      }
    },
    computeFeesETH: function() {
      return web3.utils.fromWei(
        (this.computedGasPrice * 2100).toString(),
        "ether"
      );
    },
    computeFeesToken: function() {
      return web3.utils.fromWei(
        (this.computedGasPrice * 50000).toString(),
        "ether"
      );
    }
  },
  mounted() {
    console.log("loaded contract address :", Constants.CONTRACT_ADDRESS);

    if (!localStorage.hasOwnProperty("privateKeyPlain")) {
      window.location.href = "/";
      return;
    }
    this.privateKey = localStorage.getItem("privateKeyPlain");

    const pubKey = ethUtil.privateToPublic("0x" + this.privateKey);
    this.address = "0x" + ethUtil.publicToAddress(pubKey).toString("hex");
    var self = this;
    self.updateBalances();
    setInterval(function() {
      self.updateBalances();
    }, 5000);
  },
  methods: {
    verifyEtherscan() {
      window.open("https://etherscan.io/address/" + this.address, "_blank");
    },
    sendEther() {
      console.log("sending ether...");
      this.isTxConfirmed = false;
      this.txHash = "";

      if (this.toAddress.length != 42) {
        this.$toast.error("Invalid receipient ETH Address");
        return;
      }
      if (this.amountETH <= 0) {
        this.$toast.error("Invalid amount");
        return;
      }
      if (this.amountETH > this.ethBalance) {
        this.$toast.error("seems you don't have enough balance");
      }

      web3.eth.getTransactionCount(this.address).then(txCount => {
        const rawTx = {
          nonce: web3.utils.toHex(txCount),
          gasLimit: web3.utils.toHex(21000),
          gasPrice: web3.utils.toHex(this.computedGasPrice.toString()),
          to: this.toAddress,
          from: this.address,
          value: web3.utils.toHex(
            web3.utils.toWei(this.amountETH.toString(), "ether")
          )
        };

        const transaction = new Tx(rawTx, { chain: "mainnet" }); //transaction = new Tx(txData, {'chain':'rinkeby'});
        transaction.sign(new Buffer(this.privateKey, "hex"));
        var self = this;
        web3.eth
          .sendSignedTransaction("0x" + transaction.serialize().toString("hex"))
          .on("transactionHash", function(txHash) {
            self.txHash = txHash;
          })
          .on("receipt", function(receipt) {
            console.log("receipt:" + receipt);
          })
          .on("confirmation", function(confirmationNumber, receipt) {
            console.log("confirmationNumber :", confirmationNumber);
            console.log("receipt :", receipt);
            if (confirmationNumber >= 1) {
              self.isTxConfirmed = true;
            }
          })
          .on("error", function(error) {
            console.log("error sending ETH", error);
            self.$toast.error("error sending ETH.");
          });
      });
    },
    sendERC20() {
      console.log("sending erc20");
      this.isTxConfirmed = false;
      this.txHash = "";

      if (this.toAddress.length != 42) {
        this.$toast.error("Invalid receipient ETH Address");
        return;
      }
      if (this.amountETH <= 0) {
        this.$toast.error(
          "You need to have some ETH to pay for the transaction fees"
        );
        return;
      }
      if (this.amountOAS > this.erc20Balance) {
        this.$toast.error("seems you don't have enough balance");
      }

      web3.eth.getTransactionCount(this.address).then(nonce => {
        var contract = new web3.eth.Contract(
          erc20TokenABI,
          Constants.CONTRACT_ADDRESS
        );

        var tokenAmount = Number(this.amountOAS) * Math.pow(10, 18); // 18 decimals, hardcoded
        let data = contract.methods
          .transfer(this.toAddress, tokenAmount.toString())
          .encodeABI();
        let rawTx = {
          nonce: web3.utils.toHex(nonce),
          gasLimit: web3.utils.toHex(100000),
          gasPrice: web3.utils.toHex(this.computedGasPrice.toString()),
          to: Constants.CONTRACT_ADDRESS,
          value: "0x00",
          data: data
        };

        const transaction = new Tx(rawTx, { chain: "mainnet" }); //transaction = new Tx(txData, {'chain':'rinkeby'});
        transaction.sign(new Buffer(this.privateKey, "hex"));
        var self = this;
        web3.eth
          .sendSignedTransaction("0x" + transaction.serialize().toString("hex"))
          .on("transactionHash", function(txHash) {
            self.txHash = txHash;
          })
          .on("receipt", function(receipt) {
            console.log("receipt:" + receipt);
          })
          .on("confirmation", function(confirmationNumber, receipt) {
            if (confirmationNumber >= 1) {
              self.isTxConfirmed = true;
            }
          })
          .on("error", function(error) {
            console.log("error sending erc20 token", error);
            self.$toast.error("error sending token.");
          });
      });
    },
    async updateBalances() {
      // ETH Balance
      web3.eth.getBalance(this.address).then(val => {
        this.ethBalance = web3.utils.fromWei(val, "ether");
      });

      //ERC20 Balance
      var decimals, balance, name, symbol;

      var contract = new web3.eth.Contract(
        erc20TokenABI,
        Constants.CONTRACT_ADDRESS
      );

      var self = this;
      contract.methods
        .balanceOf(this.address)
        .call()
        .then(function(result) {
          self.erc20Balance = Number(result) / Math.pow(10, 18); //18 decimals hardcoded
          self.erc20Balance = self.erc20Balance.toFixed(3);
        });
    },
    toggleShowQRCode() {
      this.sendEtherDiv = false;
      this.sendERC20Div = false;
      this.showQRCode = !this.showQRCode;
    },
    toggleSendETH() {
      this.showQRCode = false;
      this.sendERC20Div = false;
      this.sendEtherDiv = !this.sendEtherDiv;
    },
    toggleSendERC20() {
      this.showQRCode = false;
      this.sendEtherDiv = false;
      this.sendERC20Div = !this.sendERC20Div;
    },
    async getConfirmations(txHash) {
      try {
        const trx = await web3.eth.getTransaction(txHash);
        const currentBlock = await web3.eth.getBlockNumber();
        return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber;
      } catch (error) {
        console.log(error);
      }
    },
    confirmEtherTransaction(txHash, confirmations = 1) {
      setTimeout(async () => {
        const trxConfirmations = await this.getConfirmations(txHash);
        if (trxConfirmations >= confirmations) {
          this.$toast.success("Transaction successfully confirmed");
          this.isTxConfirmed = true;
          return;
        }
        return this.confirmEtherTransaction(txHash, confirmations);
      }, 5000);
    },
    toEtherScanAddress(address) {
      window.open("https://etherscan.io/address/" + address, "_blank");
    },
    toEtherScanTxHash(txHash) {
      window.open("https://etherscan.io/tx/" + txHash, "_blank");
    }
  },
  beforeRouteLeave(to, from, next) {
    localStorage.removeItem("privateKeyPlain");
  }
};
</script>

<style lang="scss" scoped>
#styled-input {
  height: 48px;
}
.styled-input label[for] {
  height: 48px;
}
</style>
