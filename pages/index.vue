
<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex style="max-width:800px">
        <v-container>
          <v-row justify="center">
            <img
              class="text-xs-center"
              style="text-align: center; width:200px"
              src="@/assets/oaschainlogo.png"
            />
          </v-row>
          <v-row justify="center">
            <p class="display-3 text-xs-center">
              <span style="font-weight:bold">OAS</span>
              <span style="color:cyan;">CHAIN</span>
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

          <v-form @submit.prevent="toWallet">
            <v-row justify="center">
              <v-col cols="12" md="7" sm="6">
                <v-text-field
                  solo
                  style="max-width:800px"
                  v-model="privateKey"
                  type="text"
                  label="Private Key"
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
export default {
  data() {
    return {
      privateKey: "",
      isMounted: false
    };
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    toWallet() {
      if (this.privateKey.length < 60) {
        this.$toast.error(
          "Seems that the private key is invalid. Are you sure you have the correct one ?"
        );
        return;
      }
      localStorage.setItem("privateKey", this.privateKey.trim());
      this.$router.push("wallet");
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
