<template>
  <div class="absolute overflow-y-auto bridge-scroll-bar top-0 left-0 right-0 bottom-0" :class="bottomAbsolute ? '' : ''">
    <BridgeBox>
        <RollupBridge />
    </BridgeBox>
  </div>
</template>
<script setup lang="ts">
useHead({
    title: 'UXLINK - Bridge'
})

const bottomAbsolute = ref(true)

onMounted(async() => {
  if (document.documentElement.clientHeight < 900) {
    bottomAbsolute.value = false
  }
  window.onresize = () => {
    if (document.documentElement.clientHeight < 900) {
      bottomAbsolute.value = false
    } else {
      bottomAbsolute.value = true
    }
  }
})
</script>
<style scoped>

</style>
