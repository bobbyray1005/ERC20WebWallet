
<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex style="max-width:800px">
        <v-container>
          <v-row justify="center">
            <p class="headline text-xs-center">{{address}}</p>
          </v-row>

          <v-row justify="center">
            <v-card color="green" class="ma-3" max-width="400">
              <v-card-title>ETH: {{totalETH}}</v-card-title>
            </v-card>

            <v-card color="cyan" class="ma-3" max-width="400">
              <v-card-title>OAS: {{totalOAS}}</v-card-title>
            </v-card>
          </v-row>

          <v-form class="mt-5" @submit.prevent="toSearchResolver">
            <v-row justify="center">
              <v-col cols="12" md="7" sm="6">
                <v-text-field
                  style="max-width:800px"
                  v-model="address"
                  type="text"
                  label="Address"
                />
                <v-textarea
                  rows="2"
                  style="max-width:800px"
                  v-model="privateKey"
                  type="text"
                  label="Private Key"
                />
                <p style="color: #78909c; text-align: center" class="text-xs-center">
                  Save your private key using a password manager
                  <br />like 1password, last pass etc.
                </p>
              </v-col>
            </v-row>

            <v-row class="mt-5" justify="center">
              <v-col cols="12" md="7" sm="6">
                <v-btn
                  id="styled-input"
                  @click="backToHome"
                  class="styled-input"
                  color="green"
                  block
                >BACK TO HOME</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      privateKey: "",
      address: "",
      totalETH: 0,
      totalOAS: 0,
      isMounted: false
    };
  },
  mounted() {
    this.privateKey = localStorage.getItem("privateKey");
    console.log("Private Key Loaded ", this.privateKey);

    var account = window.web3.eth.accounts.create();
    this.privateKey = account.privateKey;
    this.address = account.address;
  },
  methods: {
    backToHome() {
      if (!this.saveCheckbox) {
        this.$toast.error("Please tick the checkbox...");
        return;
      }
      this.$router.push("/");
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
