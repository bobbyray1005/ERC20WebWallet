
<template>
  <v-container>
    <v-layout mt-6 v-if="loadedOk" align-center justify-center>
      <v-flex>
        <v-container>
          <v-row justify="center">
            <p class="display-1">
              Prescription ID
              <span style="color:#ff5722">{{prescription_id}}</span>
            </p>
          </v-row>
        </v-container>
        <v-container>
          <v-simple-table style="background: #12171a;">
            <tbody>
              <tr>
                <td>
                  <span style="color: #cfd8dc">STATUS</span>
                </td>
                <td>
                  <span v-if="prescription.status == 'accepted'">
                    <kbd class="green">accepted</kbd>
                  </span>
                  <span v-if="prescription.status == 'rejected'">
                    <kbd class="red">rejected</kbd>
                  </span>
                  <span v-if="prescription.status == 'created'">
                    <kbd class="blue">created</kbd>
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span style="color: #cfd8dc">TX HASH</span>
                </td>
                <td>{{prescription.tx_hash}}</td>
              </tr>

              <tr>
                <td>
                  <span style="color: #cfd8dc">CREATED AT</span>
                </td>
                <td>{{format(prescription.created_at)}}</td>
              </tr>

              <tr>
                <td>
                  <span style="color: #cfd8dc">PRESCRIBED BY</span>
                </td>
                <td>
                  <nuxt-link
                    :to="{ path: '/address/'+prescription.created_by}"
                  >{{prescription.created_by}}</nuxt-link>
                </td>
              </tr>
              <tr v-if="prescription.status != 'created'">
                <td>
                  <span v-if="prescription.status == 'accepted'" style="color: #cfd8dc">ACCEPTED BY</span>
                  <span v-if="prescription.status == 'rejected'" style="color: #cfd8dc">REJECTED BY</span>
                </td>
                <td>
                  <nuxt-link
                    :to="{ path: '/address/'+prescription.obtained_from}"
                  >{{prescription.obtained_from}}</nuxt-link>
                </td>
              </tr>

              <tr v-if="prescription.status != 'created'">
                <td>
                  <span v-if="prescription.status == 'accepted'" style="color: #cfd8dc">ACCEPTED AT</span>
                  <span v-if="prescription.status == 'rejected'" style="color: #cfd8dc">REJECTED AT</span>
                </td>
                <td>{{format(prescription.obtained_at)}}</td>
              </tr>
            </tbody>
          </v-simple-table>

          <p
            style="margin-top: 50px; font-size:0.9em; color: #78909c"
          >Test with: bbb2c9c8 - accepted, f2e3875b - rejected, 9421dbc4 - created</p>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    prescription_id: "",
    search: "",
    prescription: null,
    valid: false,
    isLoading: false,
    loadedOk: false
  }),
  mounted() {
    this.prescription_id = this.$route.params.prescription_id;
    this.search = this.prescription_id;
    this.searchResolver();
  },
  methods: {
    async searchResolver() {
      console.log("loading -> ", this.search);
      if (this.search.length == 42) {
        this.$router.push("/address/" + this.search);
        return;
      }
      if (this.search.length == 8) {
        this.isLoading = true;
        await this.$axios
          .$get(
            "https://frontrx.com/api/explorer/prescription?id=" + this.search
          )
          .then(response => {
            console.log("this.response :", response);
            this.prescription = response;
            this.loadedOk = true;
            this.isLoading = false;
          })
          .catch(error => {
            this.loadedOk = false;
            this.isLoading = false;
            console.log(error);
            let errorObject = JSON.parse(JSON.stringify(error));
            this.$toast.error(errorObject.response.data.error);
          });
        return;
      }

      this.$toast.error("Invalid Prescription ID or address");
    },
    format(date) {
      if (date === 0) {
        return "";
      }
      date = new Date(date * 1000);
      var offset = new Date().getTimezoneOffset(); // getting offset to make time in gmt+0 zone (UTC) (for gmt+5 offset comes as -300 minutes)
      date.setMinutes(date.getMinutes() + offset); // date now in UTC time

      var easternTimeOffset = -240; //for dayLight saving, Eastern time become 4 hours behind UTC thats why its offset is -4x60 = -240 minutes. So when Day light is not active the offset will be -300
      date.setMinutes(date.getMinutes() + easternTimeOffset);

      var formatted = date.toLocaleString();
      return formatted;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.v-data-table .v-table tbody tr:not(:last-child) {
  border-bottom: none;
}
kbd {
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
</style>
