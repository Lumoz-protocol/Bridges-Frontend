<template>
  <div class="fixed z-10 top-0 left-0 right-0 h-20 bg-filter flex items-center justify-between px-4">
    <div class="font-bold flex items-center w-30">
      <img src="@/assets/img/network/uxlink.jpg" class="w-12 mr-2 rounded-full">
      UXLINK Bridge
    </div>
    <div class="hidden xl:flex items-center w-full justify-between h-full">
      <div></div>
      <CommonSingleNavItem v-for="item in singleMenus" :key="item.name" :item="item" @click="hideMenu" />
      <CommonNavItems v-for="item in menus" :key="item.name" :name="item.name" :hide-status="navHide">
        <CommonNavItem
          v-for="_item in item.list"
          :key="_item.name"
          :name="_item.name"
          :type="_item.type"
          :local="_item.local"
          :url="_item.url"
          @click.native="hideItems"
        >
        </CommonNavItem>
      </CommonNavItems>
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
          
          <CommonSingleNavItem
            v-for="item in singleMenus"
            :key="item.name"
            :item="item"
            @click.native="hideMenu"
          />
          <CommonNavItems v-for="item in menus" :key="item.name" :name="item.name" :hide-status="navHide">
            <div class="h-2"></div>
            <CommonNavItem
              v-for="_item in item.list"
              :key="_item.name"
              :name="_item.name"
              :type="_item.type"
              :local="_item.local"
              :url="_item.url"
              @click.native="hideMenu"
            >
            </CommonNavItem>
          </CommonNavItems>
        </el-drawer>
      </client-only>
    </div>
  </div>
</template>
<script setup lang="ts">
const vm = getCurrentInstance()?.proxy
const router = useRouter()
const menuShow = ref(false)
const navHide = ref(false)

const singleMenus = ref([
  // { name: vm.$t('header.campaign'), link: '/campaign' }
])

const menus = ref([
  // {
  //   name: 'Rewards',
  //   list: [
  //     {
  //       name: 'Invitation Rewards',
  //       local: true,
  //       url: '/invitation-rewards'
  //     },
  //     {
  //       name: 'Purchase Rebates',
  //       local: true,
  //       url: '/rebates'
  //     }
  //   ]
  // }
])

onMounted(() => {
  window.addEventListener('resize', () => {
    hideItems()
    hideMenu()
  })
})

const open = (url: string) => {
  window.open(url)
}

const hideMenu = () => {
  menuShow.value = false
}
const hideItems = () => {
  navHide.value = !navHide.value
}
</script>
<style class="ra-borders">
.ra-borders {
  border: 2px solid var(--1, #44EF49);
}
</style>

