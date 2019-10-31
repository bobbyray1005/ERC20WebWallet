
<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex style="max-width:800px">
        <v-container>
          <v-row justify="center">
            <p class="display-3 text-xs-center">
              NEW
              <span style="color:#ff5722">WALLET</span>
            </p>
          </v-row>

          <v-row justify="center">
            <div class="col-12">
              <v-form @submit.prevent="generateNewAccount">
                <v-row justify="center">
                  <v-col cols="12" md="7" sm="6">
                    <kbd class="white--text mb-3 mt-5">Pick a Password</kbd>
                    <v-text-field
                      solo
                      style="max-width:800px"
                      v-model="password"
                      type="password"
                      label="Password"
                    />
                    <kbd class="white--text mb-3 mt-1">Repeat Password</kbd>
                    <v-text-field
                      solo
                      style="max-width:800px"
                      v-model="repeatPassword"
                      type="password"
                      label="Repeat Password"
                    />

                    <v-radio-group row v-model="languageChoice" :mandatory="true">
                      <v-radio label="English" value="english"></v-radio>
                      <v-radio label="中文(简体)" value="chinese_simplified"></v-radio>
                      <v-radio label="中文(繁體)" value="chinese_traditional"></v-radio>
                      <v-radio label="한국어" value="korean"></v-radio>
                      <v-radio label="日本語" value="japanese"></v-radio>
                    </v-radio-group>

                    <v-btn
                      id="styled-input"
                      color="green"
                      class="mt-5 styled-input"
                      block
                      type="submit"
                    >CREATE NEW WALLET</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </div>
          </v-row>

          <v-form v-if="showMnemonicDiv" class="mt-5" @submit.prevent="toSearchResolver">
            <v-row justify="center">
              <v-col cols="12" md="7" sm="6">
                <kbd class="yellow black--text mb-3">Address</kbd>
                <v-text-field
                  style="max-width:800px"
                  v-model="address"
                  type="text"
                  solo
                  label="Address"
                />
                <kbd class="yellow black--text mb-3 mt-5">Mnemonic</kbd>
                <v-textarea
                  rows="3"
                  style="max-width:800px"
                  v-model="mnemonic"
                  type="text"
                  solo
                  label="Mnemonic"
                />
                <p style="color: #78909c; text-align: center" class="text-xs-center">
                  Save your mnemonic & password using a password manager
                  <br />like 1password, last pass etc.
                </p>
              </v-col>
            </v-row>

            <v-row justify="center">
              <v-col cols="12" md="7" sm="6">
                <v-checkbox
                  v-model="saveCheckbox"
                  label="I saved it somewhere safe!"
                  color="green"
                  hide-details
                ></v-checkbox>
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
import web3 from "../helpers/web3";
import {
  generateMnemonic,
  mnemonicToSeed,
  shortenMnemonic
} from "../helpers/bip39";
var hdkey = require("ethereumjs-wallet/hdkey");
var ethUtil = require("ethereumjs-util");
var CryptoJS = require("crypto-js");

export default {
  data() {
    return {
      showMnemonicDiv: false,
      saveCheckbox: false,
      privateKey: "",
      languageChoice: "english",
      address: "",
      mnemonic: "",
      password: "123123123",
      repeatPassword: "123123123",
      isMounted: false
    };
  },
  mounted() {
    this.isMounted = true;
    var account = web3.eth.accounts.create();
    this.privateKey = account.privateKey;
    this.address = account.address;
  },
  methods: {
    generateNewAccount() {
      console.log("generating a new account....");
      if (this.password.length < 8) {
        this.$toast.error("Please make at least a 8 character password");
        return;
      }
      if (this.password !== this.repeatPassword) {
        this.$toast.error("Passwords don't match");
        return;
      }

      this.showMnemonicDiv = true;
      this.mnemonic = generateMnemonic(this.languageChoice, 12);

      let seed = mnemonicToSeed(this.mnemonic, this.password);

      const pubKey = ethUtil.privateToPublic(
        hdkey
          .fromMasterSeed(seed)
          .derivePath(`m/44'/60'/0'/0/0`)
          .getWallet()
          .getPrivateKey()
      );
      const addr = ethUtil.publicToAddress(pubKey).toString("hex");
      this.address = ethUtil.toChecksumAddress(addr);

      // Encrypt the mnemonic
      var ciphertext = CryptoJS.AES.encrypt(
        this.mnemonic,
        this.password
      ).toString();

      localStorage.setItem("mnemonic", ciphertext);
    },
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
