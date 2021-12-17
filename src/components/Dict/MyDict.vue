<template>
  <div>
    <slot v-if="mode=='list'">
      <span v-for="item in dict.dictDetails" :key="item.id">
        <span v-if="item.code==value">{{item.name}}</span>
      </span>
    </slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MyDict',
  props: {
    mode: {
      type: String,
      default: 'list'
    },
    value: {
      type: [String, Number]
    },
    dictKey: {
      type: String
    }
  },
  created() {
    if (!this.dictMap[this.dictKey]) {
      this.$store.dispatch('dict/getDict', this.dictKey)
    }
  },
  computed: {
    ...mapGetters([
      'dictMap'
    ]),
    dict() {
      return this.dictMap[this.dictKey]
    }
  }
}
</script>

<style scoped>

</style>
