
<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex style="max-width:800px">
        <v-container>
          <v-row justify="center">
            <img
              class="text-xs-center"
              style="text-align: center; width:200px"
              src="../assets/oaschain-logo.png"
            />
          </v-row>
          <v-row justify="center">
            <p class="display-3 text-xs-center">
              <span style="font-weight:bold">OAS</span>
              <span style="color:#00afcc;">CHAIN</span>
            </p>
          </v-row>

          <v-row justify="center">
            <p style="color: #eee" class="headline text-xs-center">web wallet</p>
          </v-row>

          <v-row class="mt-5" justify="center">
            <v-col cols="12" md="7" sm="6">
              <v-btn
                id="styled-input"
                @click="gotoCreate"
                class="styled-input"
                color="green"
                block
              >CREATE NEW WALLET</v-btn>
            </v-col>
          </v-row>

          <v-row class="mt-5" justify="center">
            <p style="color: #78909c" class="text-xs-center">or access existing</p>
          </v-row>

          <v-form v-if="!mnemonicPresent" @submit.prevent="toWallet">
            <v-row justify="center">
              <v-col cols="12" md="7" sm="6">
                <v-text-field
                  solo
                  id="mnemonic"
                  style="max-width:800px"
                  v-model="mnemonic"
                  type="text"
                  label="Mnemonic"
                />
                <v-text-field
                  solo
                  style="max-width:800px"
                  v-model="password"
                  type="password"
                  label="Password"
                />
                <v-btn
                  id="styled-input"
                  class="styled-input"
                  block
                  color="green"
                  type="submit"
                >Continue</v-btn>
              </v-col>
            </v-row>
          </v-form>

          <v-form v-if="mnemonicPresent" @submit.prevent="unlockWallet">
            <v-row justify="center">
              <v-col cols="12" md="7" sm="6">
                <v-text-field
                  solo
                  style="max-width:800px"
                  v-model="existingPassword"
                  type="password"
                  label="Password"
                />
                <v-btn
                  id="styled-input"
                  class="styled-input"
                  block
                  color="green"
                  type="submit"
                >Continue</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
var CryptoJS = require("crypto-js");
import { mnemonicToSeed } from "../helpers/bip39";
var hdkey = require("ethereumjs-wallet/hdkey");
var ethUtil = require("ethereumjs-util");

export default {
  data() {
    return {
      mnemonic: "",
      password: "",
      existingPassword: "",
      mnemonicPresent: false,
      isMounted: false
    };
  },
  mounted() {
    this.isMounted = true;
    if (localStorage.hasOwnProperty("privateKey")) {
      this.mnemonicPresent = true;
    } else {
      this.mnemonicPresent = false;
    }
  },
  methods: {
    // imports an existing wallet
    toWallet() {
      if (this.mnemonic.length < 10) {
        this.$toast.error("invalid mnemonic length");
        return;
      }

      var ciphertext = CryptoJS.AES.encrypt(
        this.mnemonic,
        this.password
      ).toString();

      let seed = mnemonicToSeed(this.mnemonic, this.password);

      var privateKey = hdkey
        .fromMasterSeed(seed)
        .derivePath(`m/44'/60'/0'/0/0`)
        .getWallet()
        .getPrivateKey();

      localStorage.setItem("privateKeyPlain", privateKey.toString("hex"));

      this.$router.push("wallet");
    },
    // unlocks an existing wallet
    unlockWallet() {
      var ciphertext = localStorage.getItem("privateKey");
      try {
        var bytes = CryptoJS.AES.decrypt(ciphertext, this.existingPassword);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);

        if (originalText.length < 60) {
          this.$toast.error("invalid password");
          return;
        }

        localStorage.setItem("privateKeyPlain", originalText);

        this.$router.push("wallet");
      } catch (err) {
        console.log("err :", err);
        this.$toast.error("Invalid Password");
      }
    },
    gotoCreate() {
      this.$router.push("create");
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
