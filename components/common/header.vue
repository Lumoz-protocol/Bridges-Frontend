<template>
  <div class="fixed z-10 top-0 left-0 right-0 h-20 bg-filter flex items-center justify-between px-4">
    <div class="font-bold flex items-center w-50">
      <img src="@/assets/img/network/uxlink.jpg" class="w-12 mr-2 rounded-full">
      UXLINK Bridge
    </div>
    <div class="hidden xl:flex items-center w-full justify-between h-full">
      <div></div>
      <Wallet class="pl-8"/>
    </div>
    <div class="xl:hidden relative">
      <img
        src="@/assets/img/icon/menu.svg"
        class="w-4 mr-2 cursor-pointer hvr-bounce-in"
        v-if="!menuShow"
        @click="menuShow = !menuShow"
      />
      <client-only>
        <el-drawer v-model="menuShow" :with-header="false" :append-to-body="true" :size="400">
          <div class="flex items-center justify-between mb-8">
            <CommonLogo />
            <div @click="hideMenu">
              <Wallet  />
            </div>
          </div>
        </el-drawer>
      </client-only>
    </div>
  </div>
</template>
<script setup lang="ts">
const menuShow = ref(false)
onMounted(() => {
  window.addEventListener('resize', () => {
    hideMenu()
  })
})

const hideMenu = () => {
  menuShow.value = false
}
</script>
