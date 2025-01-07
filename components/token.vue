<template>
  <div class="rounded-full overflow-hidden">
    <img v-if="imgShow" :src="imgShow" class="w-full h-full">
    <div v-else class="w-full h-full flex items-center justify-center bg-primary-900 text-white rounded-full" :class="size === 'small' ? '' : 'text-base font-bold'">
      <span>{{ symbol ? symbol[0] : '-' }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import tokens from '@/libs/tokens.json'
import { useRollupBridgeStore } from '@/stores'

const rollupBridgeStore = useRollupBridgeStore()
const props = withDefaults(
  defineProps<{
    symbol: string
    address: string
    size?: string
  }>(),
  {
    symbol: '',
    address: '',
    size: ''
  }
)
const imgShow = computed(() => {
  try {
    const list = rollupBridgeStore.tokens.filter(item => !item.self)
    const addresses = []
    for (let i in list) {
      addresses.push(list[i].layer1Address.toLowerCase())
      addresses.push(list[i].rollupAddress.toLowerCase())
    }
    for (let i in tokens) {
      if (tokens[i].symbol === props.symbol) {
        if (addresses.includes(props.address.toLowerCase())) {
          return tokens[i].img
        }
      }
    }
  } catch {
    return ''
  }
})
</script>
