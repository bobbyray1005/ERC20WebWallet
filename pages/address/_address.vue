
<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex>
        <v-container>
          <v-simple-table style="background: #12171a;" :dense="dense" :fixed-header="fixedHeader">
            <thead>
              <tr>
                <th class="text-left">ID</th>
                <th class="text-left">Status</th>
                <th class="text-left">Created At</th>
                <th class="text-left">Prescribed By</th>
                <th class="text-left">Pharmacist</th>
                <th class="text-left">Obtained At</th>
                <th class="text-left">TX Hash</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prescription in prescriptions" :key="prescription.id">
                <td>
                  <nuxt-link :to="{ path: '/prescription/'+prescription.id}">{{prescription.id}}</nuxt-link>
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
                <td>{{ format(prescription.created_at) }}</td>
                <td>
                  <nuxt-link
                    :to="{ path: '/address/'+prescription.created_by}"
                  >{{prescription.created_by}}</nuxt-link>
                </td>
                <td>
                  <nuxt-link
                    :to="{ path: '/address/'+prescription.obtained_from}"
                  >{{prescription.obtained_from}}</nuxt-link>
                </td>
                <td>{{ format(prescription.obtained_at) }}</td>
                <td>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <span color="primary" dark v-on="on">{{ maskedHash(prescription.tx_hash) }}</span>
                    </template>
                    <span>{{prescription.tx_hash}}</span>
                  </v-tooltip>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    address: "",
    prescriptions: [],
    valid: false,
    isLoading: false,
    loadedOk: false,
    dense: false,
    fixedHeader: false
  }),
  mounted() {
    this.address = this.$route.params.address;
    this.loadAddress();
  },
  methods: {
    async loadAddress() {
      console.log("loading -> address :", this.address);
      if (this.address.length != 42) {
        this.$toast.error("This doesn't look like a valid address");
        return;
      }
      this.isLoading = true;

      await this.$axios
        .$get("https://frontrx.com/api/explorer/history/" + this.address)
        .then(response => {
          console.log("this.response :", response);
          if (response == null) {
            this.$toast.error("no prescriptions found for this address");
            return;
          }
          this.prescriptions = response;
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
    },
    maskedHash(txHash) {
      return txHash.replace(txHash.substring(7, 61), "...");
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
#styled-input {
  height: 48px;
}
.styled-input label[for] {
  height: 48px;
}
.v-data-table .v-table tbody tr:not(:last-child) {
  border-bottom: none;
}
th {
  font-size: 0.9em;
  color: #fff;
}
kbd {
  width: 80px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
</style>
