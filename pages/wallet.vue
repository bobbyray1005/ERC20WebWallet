<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex style="max-width:800px">
        <v-container>
          <v-row justify="center">
            <p class="pa-1 text-xs-center">{{address}}</p>
            <v-btn small outlined class="ml-5 text-xs-center">Verify on Etherscan</v-btn>
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
                  <v-btn text>SEND</v-btn>
                  <v-btn @click="toggleShowQRCode()" text>RECEIVE</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-show="showQRCode" justify="center">
            <img
              style="text-align: center; width:300px; height:300px;"
              :src="`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${address}&choe=UTF-8`"
            />
            <v-row justify="center">
              <kbd class="mt-5 pa-1 headline text-xs-center">{{address}}</kbd>
            </v-row>
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
                      v-model="gasPrice"
                      class="mt-5 mb-5"
                      :color="ex1.color"
                      :tick-labels="gasPriceLabels"
                      :max="2"
                      step="1"
                      label="Gas Price"
                      ticks="always"
                      tick-size="4"
                    ></v-slider>
                    <v-btn
                      id="styled-input"
                      color="green"
                      class="styled-input"
                      block
                      type="submit"
                    >SEND</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import web3 from "../helpers/web3";
import erc20TokenABI from "../helpers/erc20abi";
export default {
  data() {
    return {
      sendEtherDiv: true,
      ethBalance: null,
      erc20Balance: null,
      toAddress: "0x...",
      amountETH: 0,
      amountWei: 0,
      gasPrice: 1,
      showQRCode: false,
      privateKey: "",
      address: "",
      qrCodeSize: 300,
      totalOAS: 0,
      isMounted: false,
      estimateGas: 0,
      gasPriceLabels: ["Slow", "Normal", "Fast"],
      ex1: { label: "color", val: 1, color: "blue darken-3" }
    };
  },
  mounted() {
    this.privateKey = localStorage.getItem("privateKey");
    console.log("Private Key Loaded OK");
    var account = web3.eth.accounts.privateKeyToAccount(this.privateKey);
    this.privateKey = account.privateKey;
    this.address = account.address;

    var self = this;
    self.updateBalances();
    setInterval(function() {
      self.updateBalances();
    }, 5000);
  },
  methods: {
    estimateGas() {
      web3.eth
        .estimateGas({
          from: this.address,
          to: this.toAddress,
          value: this.amountWei
        })
        .then(val => (this.estimateGas = val));
    },
    verifyEtherscan() {
      window.open("https://etherscan.io/address/" + this.address, "_blank");
    },
    sendEther() {
      console.log("sending ether...");
      if (this.toAddress.length != 42) {
        this.$toast.error("Invalid sending ETH Address");
        return;
      }
      if (this.amountETH <= 0) {
        this.$toast.error("Invalid amount");
        return;
      }
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
        "0x7ec133d17f253bf759d58882bf9ff18fddcf2155" //Andy's Token
      );

      var self = this;
      contract.methods
        .balanceOf("0x000000dE5F9e90CE604Da5FD78ACd6FAE789eCCA")
        .call()
        .then(function(result) {
          self.erc20Balance = Number(result) / Math.pow(10, 18); //18 decimals hardcoded
          self.erc20Balance = self.erc20Balance.toFixed(3);
        });

      // // Call balanceOf function
      // contract.balanceOf(walletAddress, (error, balance) => {
      //   // Get decimals
      //   contract.decimals((error, decimals) => {
      //     // calculate a balance
      //     balance = balance.div(10 ** decimals);
      //     console.log(balance.toString());
      //   });
      // });
      // decimals = promisify(cb => tokenContract.decimals(cb));
      // balance = promisify(cb => tokenContract.balanceOf(address, cb));
      // name = promisify(cb => tokenContract.name(cb));
      // symbol = promisify(cb => tokenContract.symbol(cb));

      // try {
      //   adjustedBalance = (await balance) / Math.pow(10, await decimals);
      //   console.log("Adjusted Balance = ", adjustedBalance);

      //   var ssymbol = await symbol;
      //   var sname = await name;
      //   console.log(ssymbol + " " + sname);
      // } catch (error) {
      //   this.$toast.error(error);
      // }
    },
    toggleShowQRCode() {
      this.sendEtherDiv = false;
      this.showQRCode = !this.showQRCode;
    },
    toggleSendETH() {
      this.showQRCode = false;
      this.sendEtherDiv = !this.sendEtherDiv;
    },
    toggleSendERC20() {
      this.showQRCode = false;
      this.sendEtherDiv = !this.sendEtherDiv;
    }
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
