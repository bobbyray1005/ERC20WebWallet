<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex style="max-width:800px">
        <v-container>
          <v-row justify="center">
            <kbd class="pa-1 headline text-xs-center">{{address}}</kbd>
          </v-row>

          <v-row justify="center">
            <v-btn
              @click="verifyEtherscan"
              small
              class="mt-5 pa-1 text-xs-center"
            >Verify on Etherscan</v-btn>
          </v-row>

          <v-row class="mb-6">
            <v-col md="6">
              <v-card color="cyan" class="mt-5" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="headline mb-4">ETHER</div>
                    <v-list-item-title class="headline mb-1">{{totalETH}}</v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-avatar tile class="ma-5">
                    <img
                      class="text-xs-center"
                      style="text-align: center; margin-top: 10px; width:auto; height:70px;"
                      src="@/assets/ethereum-icon.png"
                    />
                  </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn text>SEND</v-btn>
                  <v-btn @click="showQRCode = !showQRCode" text>RECEIVE</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <v-col md="6">
              <v-card color="indigo darken-4" class="mt-5" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="headline mb-4">OAS</div>
                    <v-list-item-title class="headline mb-1">{{totalOAS}}</v-list-item-title>
                  </v-list-item-content>

                  <img
                    class="text-xs-center"
                    style="text-align: center; width:80px; height:80px;"
                    src="@/assets/oaschainlogo.png"
                  />
                </v-list-item>

                <v-card-actions>
                  <v-btn text>SEND</v-btn>
                  <v-btn @click="showQRCode = !showQRCode" text>RECEIVE</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <v-row v-show="showQRCode" justify="center">
            <img
              style="text-align: center; width:300px; height:300px;"
              :src="`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${address}&choe=UTF-8`"
            />
          </v-row>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showQRCode: false,
      privateKey: "",
      address: "",
      totalETH: 0,
      qrCodeSize: 300,
      totalOAS: 0,
      isMounted: false
    };
  },
  mounted() {
    this.privateKey = localStorage.getItem("privateKey");
    console.log("Private Key Loaded OK");
    var account = window.web3.eth.accounts.privateKeyToAccount(this.privateKey);
    this.privateKey = account.privateKey;
    this.address = account.address;
  },
  methods: {
    verifyEtherscan() {
      window.open("https://etherscan.io/address/" + this.address, "_blank");
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
