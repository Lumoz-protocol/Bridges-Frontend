<template>
  <div>
    <div
      class="flex items-center justify-start opacity-85 hover:opacity-100 cursor-pointer icon-box hover:text-primary-900"
      @click="tokenModal = true"
    >
      <div v-if="rollupBridgeStore.token?.symbol" class="flex items-center">
        <Token :symbol="rollupBridgeStore.token?.symbol" :address="rollupBridgeStore.token?.layer1Address" class="w-5 h-5" />
        <span class="ml-2">{{ rollupBridgeStore.token?.symbol }}</span>
      </div>
      <img src="@/common/assets/img/icon/arrow-down.svg" class="icon-dark h-5 ml-1" />
      <img src="@/common/assets/img/icon/arrow-down-primary.svg" class="icon-light h-5 ml-1" />
    </div>
    <el-dialog
      v-model="tokenModal"
      :width="modalWidth"
      class="uxlink-node-dialog"
      center
      effect="dark"
      :align-center="true"
      :title="$t('asset.title')"
      :append-to-body="true"
    >
      <div class="h-92 overflow-y-auto bridge-scroll-bar">
        <div v-if="!tokens.length" class="flex flex-col justify-center items-center">
          <img src="@/assets/img/home/none.svg" class="w-2/3 mt-4" />
          <div class="text-center my-8 word text-[#fff]">{{ $t('asset.none') }}</div>
        </div>
        <div
          v-if="tokens.filter(item => !item.self).length"
          class="flex items-center justify-between w-full text-xs mb-4 px-2 text-[#fff]"
        >
          <span>{{ $t('asset.token') }}</span>
          <span>{{ $t('asset.balance') }}</span>
        </div>
        <button
          v-for="item in tokens.filter(item => !item.self)"
          :key="item"
          class="w-full flex items-center justify-between p-1.5 rounded-full mb-2 hover:(border-primary-900 text-primary-900 bg-[#BEFE0044])"
          @click="setToken(item)"
        >
          <div class="flex items-center">
            <Token :symbol="item.symbol" :address="item.layer1Address" class="w-8 h-8" />
            <h3 class="ml-4 flex-1 text-white">{{ item.symbol }}</h3>
          </div>
          <div class="flex items-end flex-col mr-4 font-bai">
            <div class="text-white font-bold">{{ admin ? item.layer1Balance : item.rollupBalance }}</div>
          </div>
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useCommonModalSize } from '~~/common/hooks/useCommonModalSize'
import { useRollupBridgeStore, useWalletStore } from '~~/stores'

const { modalWidth } = useCommonModalSize()
const rollupBridgeStore = useRollupBridgeStore()
const walletStore = useWalletStore()

const tokenModal = ref(false)

const props = withDefaults(
  defineProps<{
    admin: boolean
  }>(),
  {
    admin: false
  }
)

const tokens = computed(() => {
  return rollupBridgeStore.tokens
})

onMounted(async () => {
  if (props.admin) {
    rollupBridgeStore.initTokens()
    setToken(rollupBridgeStore.tokens[0])
  }
  if (walletStore.account && props.admin) {
    rollupBridgeStore.getLayer1Balances(walletStore.account)
    rollupBridgeStore.getRollupBalances(walletStore.account)
  }
})

const setToken = token => {
  rollupBridgeStore.setToken(token)
  tokenModal.value = false
}
</script>
