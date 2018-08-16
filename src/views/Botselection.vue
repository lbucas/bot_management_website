<template>
  <div>
    <h4>Bots available for you:</h4>
    <b-row>
      <b-col v-for="bot in bots" class="botlink shadow-lg"><p>{{bot.name}}</p></b-col>
    </b-row>
  </div>
</template>

<script>
  export default {
    name: "Botselection",
    data() {
      return {
        bots: {
          1: {
            id: 1,
            name: 'Test',
            link: 'abc.de'
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../style/colors";

  .botlink {
    background: @vibCyan;
    max-width: 12rem;
    height: 6rem;
    text-align: center;
    color: white;
    p {
      margin-top: 2rem;
      font-size: 1.2rem;
    }
  }
</style>
