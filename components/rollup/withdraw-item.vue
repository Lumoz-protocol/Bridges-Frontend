<template>
    <div class="rounded-xl mb-2 w-full lg:w-80">
        <div class="bg-[#ffffff22] p-4 rounded-xl">
            <div class="flex items-center justify-between">
                <div class="flex items-center text-sm" :class="item.direction == 1 ? 'flex-row-reverse' : ''">
                    <div class="flex items-center">
                        <img :src="LAYER1.img" class="w-5" alt="">
                        <div class="ml-2">{{ LAYER1.name }}</div>
                    </div>
                    <div class="mx-2">-></div>
                    <div class="flex items-center">
                        <img :src="ROLLUP.img" class="w-6 rounded-full" alt="">
                        <div class="ml-2">{{ ROLLUP.name }}</div>
                    </div>
                </div>
                <div class="flex text-xs font-bold items-center">
                    {{ amount }}
                    <Token :symbol="symbol" :address="item.l1Token" class="ml-2 w-5 h-5" />
                </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
                <div class="text-xs">
                    Tx: <a :href="item.direction == 0 ? LAYER1.explorerUrl+'/tx/'+item.transactionHash : ROLLUP.explorerUrl+'/tx/'+item.transactionHash" target="_blank" class="ml-2 text-primary-900 underline cursor-pointer hover:opacity-90">{{ formatAddress(item.transactionHash, 6) }}</a>
                </div>
                <div class="text-xs">
                    <div v-if="item.direction === 0 || status == 6" class="text-primary-900 text-sm">Success</div>
                    <div v-else class="text-xs">
                        <div v-if="status >= 0 && status < 3" class="text-primary-900">Wait To Prove(1 ～ 2 hours)</div>
                        <CommonButton v-if="status == 3"
                            :loading="loading"
                            @click="startProve"
                            class="px-4 ml-2 h-6 cursor-pointer"
                        >
                            Prove
                        </CommonButton>
                        <div v-if="status > 3 && status < 5" class="text-primary-900">Wait To Relay(10 ～ 20 minutes)</div>
                        <CommonButton v-if="status == 5"
                            :loading="loading"
                            @click="startRelay"
                            class="px-4 ml-2 h-6 cursor-pointer"
                        >
                            Relay
                        </CommonButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useWalletStore, useRollupBridgeStore } from '@/stores'
import { notifySuccess, notifyError, formatAddress } from '@/libs/utils'
import { ethers } from 'ethers'
import { getBridge } from '@/stores/wallet'
import { LAYER1, ROLLUP, TOKENS } from '~~/constants/rollup-bridge/networks'
import { CrossChainMessenger } from '@eth-optimism/sdk'
import { getBridgeStatus } from '@/api/api'

const walletStore = useWalletStore()
const rollupBridgeStore = useRollupBridgeStore()

const status = ref(-1)
const loading = ref(false)
let timer:any = null

const props = withDefaults(
    defineProps<{
        item: any
    }>(),
    {
        item: () => {
            return {}
        }
    }
)

onMounted(() => {
    getStatus()
})

const symbol = computed(() => {
    const item = TOKENS.find(item => (item.rollupAddress.toLowerCase() === props.item.l2Token.toLowerCase()) || (item.layer1Address.toLowerCase() === props.item.l1Token.toLowerCase()))
    if (item) {
        return item.symbol
    }
    return '-'
})

const amount = computed(() => {
    const item = TOKENS.find(item => (item.rollupAddress.toLowerCase() === props.item.l2Token.toLowerCase()) || (item.layer1Address.toLowerCase() === props.item.l1Token.toLowerCase()))
    if (item) {
        try {
            return Number(ethers.utils.formatUnits(props.item.amount, item.layer1Decimals))
        } catch {
            return '-'
        }
        
    }
    return '-'
})

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
    }
})

const getStatus = async () => {
    if (timer) {
        clearInterval(timer)
    }
    if (props.item.direction == 0 || status.value == 6) {
        return
    }

    getS()

    // timer = setInterval(() => {
    //     getS()
    // }, 1000 * 2 * 60)
}

const getS = async() => {
    if (status.value == 6) {
        return
    }
    try {
        const data = await getBridgeStatus(props.item.transactionHash)
        const _status = data.op_withdrawals[0].status
        switch(_status) {
            case 'Waiting for state root': status.value = 2;break;
            case 'ready to prove': status.value = 3;break;
            case 'In challenge period': status.value = 4;break;
            case 'Ready for relay': status.value = 5;break;
            case 'Relayed': status.value = 6;break;
        }
    } catch {
        status.value = -1
    }
    
}

const startProve = async() => {
    try {
        loading.value = true
        const switched = await walletStore.checkAndSwitchNetwork(LAYER1)
        if (!switched) {
            throw new Error(vm?.$t('notSwitch'))
        }
        const l1Signer = getBridge().web3Provider.getSigner()
        const l2Provider = new ethers.providers.JsonRpcProvider(ROLLUP.rpcUrl)
        const messenger = new CrossChainMessenger({
            l1ChainId: LAYER1.chainId,
            l2ChainId: ROLLUP.chainId,
            l1SignerOrProvider: l1Signer,
            l2SignerOrProvider: l2Provider,
            contracts: {
                l1: {
                    ...L2Config
                }
            }
        })
        const tx = await messenger.proveMessage(props.item.transactionHash)
        await tx.wait()
        status.value = 4
        notifySuccess('Prove success!')
    } catch {
        loading.value = false
        notifyError('Prove failed!')
    }
}

const startRelay = async() => {
    try {
        loading.value = true
        const switched = await walletStore.checkAndSwitchNetwork(LAYER1)
        if (!switched) {
            throw new Error(vm?.$t('notSwitch'))
        }
        const l1Signer = getBridge().web3Provider.getSigner()
        const l2Provider = new ethers.providers.JsonRpcProvider(ROLLUP.rpcUrl)
        const messenger = new CrossChainMessenger({
            l1ChainId: LAYER1.chainId,
            l2ChainId: ROLLUP.chainId,
            l1SignerOrProvider: l1Signer,
            l2SignerOrProvider: l2Provider,
            contracts: {
                l1: {
                    ...L2Config
                }
            }
        })
        const tx = await messenger.finalizeMessage(props.item.transactionHash)
        await tx.wait()
        status.value = 6
        loading.value = false
        // rollupBridgeStore.getLayer1Balances(walletStore.account)
        notifySuccess('Withdraw success!')
    } catch {
        loading.value = false
        notifyError('Withdraw failed!')
    }
}
</script>
