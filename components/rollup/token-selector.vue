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

      <div v-if="partShow === 'token'" class="h-92 overflow-y-auto bridge-scroll-bar">
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
            <!-- <div class="text-xs text-[#aaa]">~ $ 0.00</div> -->
          </div>
        </button>
        <div
          v-if="tokens.filter(item => item.self).length"
          class="flex items-center justify-between w-full text-xs mb-2 px-2 mt-4"
        >
          <span class="">{{ $t('asset.customizedToken') }}</span>
          <RollupTokenManage />
        </div>
        <button
          v-for="item in tokens.filter(item => item.self)"
          :key="item"
          class="w-full flex items-center justify-between p-1.5 rounded-full mb-2 border-1 bg-[#141414] border-[#2f2f2f] hover:(border-primary-900)"
          @click="setToken(item)"
        >
          <div class="flex items-center">
            <Token :symbol="item.symbol" :address="item.layer1Address" class="w-8 h-8" />
            <h3 class="ml-4 flex-1 text-white">{{ item.symbol }}</h3>
          </div>
          <div class="flex items-end flex-col mr-4 font-bai">
            <div class="text-white font-bold">{{ admin ? item.layer1Balance : item.rollupBalance }}</div>
            <!-- <div class="text-xs text-[#aaa]">~ $ 0.00</div> -->
          </div>
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { LAYER1 } from '@/constants/rollup-bridge/networks'
import { useCommonModalSize } from '~~/common/hooks/useCommonModalSize'
import { useRollupBridgeStore, useWalletStore } from '~~/stores'


const { modalWidth } = useCommonModalSize()
const addressReg = /^0x[0-9a-fA-F]{40}$/
const rollupBridgeStore = useRollupBridgeStore()
const walletStore = useWalletStore()
const route = useRoute()

const tokenModal = ref(false)
const search = ref('')
const partShow = ref('token')
const searchError = ref(false)

const props = withDefaults(
  defineProps<{
    admin: boolean
  }>(),
  {
    admin: false
  }
)

watch(
  () => tokenModal.value,
  () => {
    searchError.value = false
    search.value = ''
  }
)

const tokens = computed(() => {
  const str = search.value.toLowerCase().trim().replace(/ +/g, '')
  if (str) {
    if (addressReg.test(str)) {
      return rollupBridgeStore.tokens.filter(token => {
        return (
          token.layer1Address.toLowerCase() === str || token.rollupAddress.toLowerCase() === str
        )
      })
    } else {
      return rollupBridgeStore.tokens.filter(token => {
        return (
          token.name.trim().replace(/ +/g, '').toLowerCase().includes(str) ||
          token.symbol.replace(/ +/g, '').toLowerCase().includes(str)
        )
      })
    }
  }
  return rollupBridgeStore.tokens
})

onMounted(async () => {
  if (props.admin) {
    rollupBridgeStore.initTokens()
    const address = route.query?.address || ''
    const network = route.query?.network || ''
    
    if (address) {
      if (network === LAYER1.name.toLowerCase()) {
        const item = rollupBridgeStore.tokens.find(item => item.layer1Address.toLowerCase() === address.toLowerCase())
        if (item) {
          setToken(item)
          return
        }
      } else {
        const item = rollupBridgeStore.tokens.find(item => item.rollupAddress.toLowerCase() === address.toLowerCase())
        if (item) {
          setToken(item)
          return
        }
      }
    } else {
      setToken(rollupBridgeStore.tokens[0])
    }
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
