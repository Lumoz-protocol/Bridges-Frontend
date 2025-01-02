<template></template>
<script lang="ts" setup>
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalProvider, useWeb3ModalAccount, useDisconnect } from '@web3modal/ethers5/vue'
import { useWalletStore } from '@/stores'
import { NODE_NETWORKS } from '@/constants'
const projectId = 'f84f8b1354cd3805ef4253caaadbe45f'
// import OXKIMG from '@/assets/img/networks/okx.png'
// import C98 from '@/assets/img/networks/c98.png'

const { disconnect } = useDisconnect()
const otherNetwork = JSON.parse(JSON.stringify(NODE_NETWORKS)).map(item => {
  return {
    chainId: item.chainId,
    name: item.name,
    currency: item.symbol,
    explorerUrl: item.explorer,
    rpcUrl: item.rpcUrl
  }
})
const networks = [

  ...otherNetwork
]

const metadata = {
  name: 'UXLINK',
  description: 'UXLINK',
  url: 'https://docs.uxlink.io/layer/whitepaper/white-paper',
  icons: []
}

let customWallets = [] 

// if (!window.okxwallet) {
//   customWallets.push({
//     id: "OKX Wallet",
//     name: "OKX Wallet",
//     image_url: OXKIMG,
//     desktop_link: 'https://chromewebstore.google.com/detail/%E6%AC%A7%E6%98%93-web3-%E9%92%B1%E5%8C%85/mcohilncbfahbmgdjkbpemcciiolgcge?hl=zh-CN&utm_source=ext_sidebar'
//   })
// }

// if (!window.coin98) {
//   customWallets.push({
//     id: "Coin98 Wallet",
//     name: "Coin98 Wallet",
//     image_url: C98,
//     desktop_link: 'https://chromewebstore.google.com/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg'
//   })
// }




const modal = createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: false,
    rpcUrl: 'https://rpc.ankr.com/eth_sepolia'
  }),
  customWallets,
  chains: networks,
  allowUnsupportedChain: true,
  projectId,
  enableAnalytics: false
})

const {address} = useWeb3ModalAccount()
const { walletProvider } = useWeb3ModalProvider()
const walletStore = useWalletStore()
watch(() => address.value, () => {
  connect()
}, { deep: true })

onMounted(async () => {
  if (address.value) {
    connect()
  }
})

const connect = async() => {
  await walletStore.connectWallet(walletProvider.value, address.value)
  if (!address.value) {
    try {
      await disconnect()
    } catch {}
  }
}
</script>
