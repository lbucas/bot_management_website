<template>
  <div id="botSelectionBackground">
    <b-row class="topRow">
      <b-col class="text-center">
        <div class="imgWrapper">
          <img class="mercklogo" src="@/assets/logo/merckgreen.png">
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="1" md="2"/>
      <b-col id="selectionCol">
        <Loader :loading="loading"/>
        <b-row>
          <b-col cols="12" id="bsHeader">
            <p>{{l.availableBots}}</p>
          </b-col>
          <b-col v-for="bot in bots" lg="3" md="4" sm="6" cols="12">
            <div @click="gotoBot(bot.url)" class="botlink shadow-lg">
              <p>{{bot.name}}</p>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="1" md="2"/>
    </b-row>
    <b-row>
      <b-col id="toAdmin" class="text-center">
        <a @click="gotoAdmin">
          <icon icon="admin"/>
          {{l.toAdmin}}
        </a>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import Loader from "../components/Loader"

  export default {
    name: "Botselection",
    components: {Loader},
    computed: {
      bots() {
        let bots = this.$store.state.bots
        let activeBots = {}
        for (let botId in bots) {
          let bot = bots[botId]
          if (bot.url) activeBots[botId] = bot
        }
        return activeBots
      },
      loading() {
        return this.$store.state.loaders.bots
      },
      l() {
        return this.$store.state.lang.botselection
      }
    },
    activated() {
      this.$store.dispatch('getOwnBots')
    },
    methods: {
      gotoBot(url) {
        window.location.href = `${url}/chat.html?accessToken=${this.$store.state.api.token}`
      },
      gotoAdmin() {
        window.location.href = window.location.href + 'admin/'
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/colors";
  @import "../style/mixins";

  .botlink {
    background: @vibGreen;
    max-width: 85%;
    height: 6rem;
    text-align: center;
    margin-left:auto;
    margin-right:auto;
    display:block;
    color: white;
    cursor: pointer;
    margin-bottom: 1rem;
    #noUserSelect;
    p {
      padding: 2rem 5px 0 5px;
      color: @richPurple;
    }
  }

  #botSelectionBackground {
    background: @richPurple;
    position: absolute;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    margin-top: -2px;
    padding: 1rem;
    overflow-y: hidden;
  }

  #bsHeader {
    text-align: center;
    padding: 1rem 0 1rem;
  }

  .imgWrapper {
    height: 100%;
    margin-right: 1rem;
  }

  .mercklogo {
    width: 40vw;
    max-width: 200px;
    margin: auto;
  }

  #selectionCol {
    background: white;
    height: 70vh;
    overflow-y: auto;
  }

  .topRow {
    margin-bottom: 1rem;
  }

  #toAdmin {
    a {
      color: white;
      font-size: 1.2rem;
      #noUserSelect;
      cursor: pointer;
    }
    margin-top: 1rem;

  }

</style>
