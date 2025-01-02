<template>
  <div>
    <span
      v-if="!content"
      class="text-primary-900 opacity-75 hover:(opacity-100 underline) cursor-pointer"
      @click="manage"
      >{{ $t('asset.manage') }}</span
    >
    <CommonButton v-else @click="manage">
      {{ $t('assets.manageTokenList') }}
    </CommonButton>
    <el-dialog
      v-model="tokenModal"
      :width="modalWidth"
      class="uxlink-node-dialog"
      :modal="content ? true : false"
      center
      :align-center="true"
      :title="$t('asset.manageTitle')"
      :append-to-body="true"
    >
      <div v-if="!rollupBridgeStore.tokens.filter(item => item.self).length" class="flex flex-col justify-center items-center">
        <img src="@/assets/img/home/none.svg" class="w-2/3 mt-4" />
        <div class="text-center my-8 word text-[#777]">{{ $t('asset.noCustomize') }}</div>
      </div>
      <div v-else class="h-102 overflow-y-auto bridge-scroll-bar">
        <div class="flex items-center justify-between w-full text-xs mb-2 px-2">
          <span>{{ $t('asset.token') }}</span>
          <span>{{ $t('asset.action') }}</span>
        </div>
        <button
          v-for="item in rollupBridgeStore.tokens.filter(item => item.self)"
          :key="item"
          class="w-full flex items-center justify-between p-1.5 rounded-full mb-2 border-1 bg-[#141414] border-[#2f2f2f] hover:(border-primary-900)"
        >
          <div class="flex items-center">
            <Token :symbol="item.symbol" :address="item.layer1Address" class="w-8 h-8" />
            <h3 class="ml-4 flex-1 text-white">{{ item.symbol }}</h3>
          </div>
          <div class="icon-box flex items-center" @click="removeToken(item)">
            <img src="@/assets/img/home/remove.svg" class="icon-dark w-8" />
            <img src="@/assets/img/home/remove-light.svg" class="icon-light w-8" />
          </div>
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useCommonModalSize } from '~~/common/hooks/useCommonModalSize'
import { useRollupBridgeStore } from '~~/stores'
const { modalWidth } = useCommonModalSize()

const rollupBridgeStore = useRollupBridgeStore()
const tokenModal = ref(false)

withDefaults(
  defineProps<{
    content?: boolean
  }>(),
  {
    content: false
  }
)

// watch(
//   () => rollupBridgeStore.tokens,
//   () => {
//     if (!rollupBridgeStore.tokens.filter(item => item.self).length) {
//       tokenModal.value = false
//     }
//   }, { deep: true}
// )

const manage = () => {
  if (!rollupBridgeStore.tokens.filter(item => item.self).length) {
    rollupBridgeStore.initTokens()
  }
  tokenModal.value = true
}

const removeToken = token => {
  rollupBridgeStore.removeToken(token)
}
</script>
