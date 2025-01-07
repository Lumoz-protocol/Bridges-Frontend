<template>
  <div class="relative lg:flex justify-between mt-40 lg:mt-0">
    <div class="bg-filter bg-[#00000088] rounded-xl overflow-hidden">
      <div class="flex p-4 pb-0" :class="reverse ? 'flex-col-reverse' : 'flex-col'">
        <div>
          <h2 class="p-2 pt-0 text-[#fff]">
            {{ reverse ? $t('home.to') : $t('home.from') }}
          </h2>
          <div class="rounded-2xl bg-[#00000055]">
            <div class="p-4 flex items-center justify-between">
              <RollupLayer1Selector :reverse="reverse" />
              <div class=" text-[#fff] text-xs flex items-center font-bold"
                :class="reverse ? 'justify-end' : 'justify-between'">
                <div class="flex items-center font-normal">
                  <div class="text-[#fff] flex items-center text-xs">
                    {{ $t('home.balance') }}:
                    <div v-if="walletStore.account" class="text-white">
                      <span v-if="!rollupBridgeStore.token?.layer1Loading" class="ml-1 font-bai">
                        {{ rollupBridgeStore.token?.layer1Balance || 0 }}
                        {{ rollupBridgeStore.token?.symbol }}
                      </span>
                      <img v-else src="@/common/assets/img/icon/loading.svg" class="img-rotate w-4 ml-2" />
                    </div>
                    <div v-else>--</div>
                  </div>
                  <div v-if="!reverse"
                    class="text-[#fff] border-[#fff] rounded-full border px-2 hover:(text-primary-900 border-primary-900) cursor-pointer text-xs ml-2"
                    @click="setMax">
                    {{ $t('home.max') }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between py-2 px-4">
              <div class="flex-1 flex justify-between items-center">
                <div class="w-24">
                  <RollupTokenSelector :admin="true" />
                </div>
                <div v-if="!reverse" class="flex items-center justify-between">
                  <input v-model="amount" type="number" :min="0" placeholder="0"
                    class="rounded-lg bg-[#353533] text-right font-bai px-2 py-1 font-bold text-lg text-primary-900 hover:border-primary-900" step="0.000000000000000001"
                    style="outline: none;" :class="overAmount ? 'text-error-900' : 'text-primary-900'" />
                </div>
                <h1 v-else class="text-xl w-full lg:w-68 text-right font-bai"
                  :class="amount ? 'text-white' : 'text-[#666]'">
                  <span>{{ amount || 0 }}</span>
                </h1>
              </div>
            </div>
          </div>
          <div v-if="!reverse && overAmount" class="text-error-900 h-4 text-right text-xs">
            {{ $t('home.insufficientBalance') }}
          </div>
          <div v-else class="h-4"></div>
        </div>
        <div class="pb-3 pt-4 flex items-center justify-center">
          <img src="@/assets/img/home/direction.svg" class="opacity-85 hover:opacity-100 w-8 cursor-pointer"
            :class="reverse === false ? 'toggle-down' : reverse === true ? 'toggle-up' : ''" @click="clickReverse" />
        </div>
        <div>
          <h2 class="p-2 pt-0 text-[#fff]">
            {{ reverse ? $t('home.from') : $t('home.to') }}
          </h2>
          <div class="rounded-2xl bg-[#00000055]">
            <div class="p-4 flex items-center justify-between">
              <RollupNetworkSelector />
              <div class="flex items-center">
                <div class="text-[#fff] text-xs flex items-center font-normal"
                  :class="reverse ? 'justify-between' : 'justify-end'">
                  <div class=" text-[#fff] flex items-center">
                    {{ $t('home.balance') }}:
                    <div v-if="walletStore.account" class="text-white font-bai">
                      <span v-if="!rollupBridgeStore.token?.rollupLoading" class="ml-1">
                        {{ rollupBridgeStore.token?.rollupBalance || 0 }}
                        {{ rollupBridgeStore.token?.symbol }}
                      </span>
                      <img v-else src="@/common/assets/img/icon/loading.svg" class="img-rotate w-4 ml-2" />
                    </div>
                    <div v-else>--</div>
                  </div>
                </div>
                <div v-if="reverse"
                  class="text-[#fff] border-[#fff] rounded-full border px-2 hover:(text-primary-900 border-primary-900) cursor-pointer text-xs ml-2"
                  @click="setMax">
                  {{ $t('home.max') }}
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between py-2 px-4">
              <div class="flex-1 flex justify-between items-center">
                <div class="w-24">
                  <RollupTokenSelector />
                </div>
                <div v-if="reverse" class="flex items-center justify-between">
                  <input v-model="amount" type="number" :min="0" placeholder="0"
                    class="rounded-lg bg-[#353533] text-right font-bai px-2 py-1 font-bold text-lg text-primary-900 hover:border-primary-900" step="0.000000000000000001"
                    style="outline: none;" :class="overAmount ? 'text-error-900' : 'text-primary-900'" />
                </div>
                <h1 v-else class="text-xl w-full lg:w-68 text-right font-bai"
                  :class="amount ? 'text-white' : 'text-[#666]'">
                  <span>{{ amount || 0 }}</span>
                </h1>
              </div>
            </div>
          </div>
          <div v-if="reverse && overAmount" class="text-error-900 h-4 text-right text-xs">
            {{ $t('home.insufficientBalance') }}
          </div>
          <div v-else class="h-4"></div>
        </div>
      </div>
      <div class="text-xs px-5 pb-4">
        <div class="flex justify-between items-center mt-2">
          <span class="text-white">Estimated time of arrival</span>
          <div class="">
            <span class="font-bai">
              <span class="font-bai">{{ reverse ? '1 ~ 2' : '1 ~ 3' }}</span>
              <span>{{ reverse ? ' Hours' : ' Minutes' }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="px-5 pb-4">
        <Wallet v-if="!walletStore.account">
          <CommonButton large class="w-full text-base">
            {{ $t('wallet.connect') }}
          </CommonButton>
        </Wallet>
        <RollupSubmitButton v-else :submit="submit" :reverse="reverse" :balance="reverse ? rollupBridgeStore.token?.rollupBalance : rollupBridgeStore.token?.layer1Balance" :amount="amount" :fees="fees" :fees-loading="feesLoading" @on-click="confirmButton" />
      </div>
    </div>
    <div class="mt-4 lg:(mt-0 ml-8) h-120 overflow-y-auto">
      <RollupWithdrawItem v-for="item in rollupBridgeStore.activities" :item="item" :key="item.transactionHash" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { CrossChainMessenger } from '@eth-optimism/sdk'
import { ElNotification } from 'element-plus'
import { ethers } from 'ethers'
import { BASE_TOKEN_CONTRACT_URL } from '@/constants'
import { L2Config, ROLLUP } from '@/constants/rollup-bridge/networks'
import { useWalletStore, useRollupBridgeStore } from '@/stores'
import { getBridge } from '@/stores/wallet'
import { notifySuccess, notifyError } from '@/libs/utils'
import { Erc20Contract, OptimismPortalContract, L1StandardBridgeContract, L2ToL1MessagePasserContract } from '~/libs/ethers/contract'

const vm = getCurrentInstance()?.proxy
const walletStore = useWalletStore()
const rollupBridgeStore = useRollupBridgeStore()
const reverse = ref(false)
const amount = ref()
const submit = ref(0)
const txHash = ref('')
const explorer = ref({})
const fees = ref(0)
const feesLoading = ref(false)
const gas = ref([0, 0])
let storeSubmitStatus: any = {}

const overAmount = computed(() => {
  let balance = reverse.value
    ? rollupBridgeStore.token?.rollupBalance
    : rollupBridgeStore.token?.layer1Balance
  balance = balance || 0
  return Number(amount.value) > Number(balance)
})


watch(
  () => [rollupBridgeStore.token, rollupBridgeStore.rollup],
  () => {
    amount.value = null
  }
)

watch(
  () => walletStore.account,
  () => {
    if (walletStore.account) {
      rollupBridgeStore.getLayer1Balances(walletStore.account)
      rollupBridgeStore.getRollupBalances(walletStore.account)
    }
  }
)


function clickReverse() {
  reverse.value = !reverse.value
}

async function confirmButton() {
  try {
    await confirm()
  } catch (e) {
    if (e.code === -32603) {
      notifyError(vm?.$t('insufficient1') + reverse.value ? 'USDC' : 'ETH' + vm?.$t('insufficient2'))
    } else {
      notifyError(vm?.$t('deposit.fail'))
    }
    submit.value = 0
    storeSubmitStatus = {}
  }
}

function storeSubmit() {
  const transAmount = amount.value
  const transNetwork = reverse.value
    ? JSON.parse(JSON.stringify(rollupBridgeStore.rollup))
    : JSON.parse(JSON.stringify(rollupBridgeStore.layer1))
  const destNetwork = reverse.value
    ? JSON.parse(JSON.stringify(rollupBridgeStore.layer1))
    : JSON.parse(JSON.stringify(rollupBridgeStore.rollup))
  const tokenContractAddress = reverse.value
    ? rollupBridgeStore.token.rollupAddress
    : rollupBridgeStore.token.layer1Address
  explorer.value = reverse.value
    ? rollupBridgeStore.rollup.explorerUrl
    : rollupBridgeStore.layer1.explorerUrl
  const symbol = rollupBridgeStore.token.symbol
  const decimals = reverse.value ? rollupBridgeStore.token.rollupDecimals : rollupBridgeStore.token.layer1Decimals
  const transAddress = walletStore.account
  return {
    transAmount,
    transNetwork,
    destNetwork,
    token: JSON.parse(JSON.stringify(rollupBridgeStore.token)),
    tokenContractAddress,
    chainId: rollupBridgeStore.rollup.chainId,
    reversed: reverse.value,
    decimals,
    symbol,
    transAddress
  }
}

async function confirm() {
  txHash.value = ''
  if (submit.value === 0) {
    storeSubmitStatus = storeSubmit()
  }
  const {
    transAmount,
    transNetwork,
    destNetwork,
    tokenContractAddress,
    token,
    decimals,
    reversed,
    symbol,
    transAddress
  } = storeSubmitStatus
  if (
    tokenContractAddress !== BASE_TOKEN_CONTRACT_URL
  ) {
    if (submit.value === 0) {
      submit.value = 1
    } else {
      submit.value = 4
    }
    const switched = await walletStore.checkAndSwitchNetwork(transNetwork)
    if (!switched) {
      throw new Error(vm?.$t('notSwitch'))
    }
    if (!reversed) {
      let erc20Contract = new Erc20Contract(tokenContractAddress, transNetwork.rpcUrl, transNetwork.chainId)
      const allowance = await erc20Contract.allowance(transAddress, token.gasToken ? L2Config?.OptimismPortal : L2Config?.L1StandardBridge)
      if (Number(allowance) < transAmount) {
        submit.value = 2
        erc20Contract = new Erc20Contract(
          tokenContractAddress,
          transNetwork.rpcUrl,
          transNetwork.chainId,
          getBridge().web3Provider.getSigner()
        )
        // if (Number(allowance)) {
        //   const result = await erc20Contract.approveToZero(token.gasToken ? L2Config?.OptimismPortal : L2Config?.L1StandardBridge)
        //   await result.wait()
        // }
        const result = await erc20Contract.approve(token.gasToken ? L2Config?.OptimismPortal : L2Config?.L1StandardBridge)

        if (!result) {
          submit.value = 0
          return
        }
        await result.wait()
        submit.value = 0
        notifySuccess(vm?.$t('home.approveSuccess'))
        return
      }
    } else {
      let erc20Contract = new Erc20Contract(tokenContractAddress, transNetwork.rpcUrl, transNetwork.chainId)
      const allowance = await erc20Contract.allowance(transAddress, L2Config?.L2StandardBridge)
      if (Number(allowance) < transAmount) {
        submit.value = 2
        erc20Contract = new Erc20Contract(
          tokenContractAddress,
          transNetwork.rpcUrl,
          transNetwork.chainId,
          getBridge().web3Provider.getSigner()
        )
        // if (Number(allowance)) {
        //   const result = await erc20Contract.approveToZero(token.gasToken ? L2Config?.OptimismPortal : L2Config?.L1StandardBridge)
        //   await result.wait()
        // }
        const result = await erc20Contract.approve(L2Config?.L2StandardBridge)

        if (!result) {
          submit.value = 0
          return
        }
        await result.wait()
        submit.value = 0
        notifySuccess(vm?.$t('home.approveSuccess'))
        return
      }
    }
  }

  submit.value = 4
  const switched = await walletStore.checkAndSwitchNetwork(transNetwork)
  if (!switched) {
    throw new Error(vm?.$t('notSwitch'))
  }
  
  const messenger = await getMessenger(reversed, transNetwork, destNetwork)

  let tx:any = null
  if (tokenContractAddress === BASE_TOKEN_CONTRACT_URL) {
    if (!reversed) {
     
    } else {
      const contract = new L2ToL1MessagePasserContract(getBridge().web3Provider.getSigner())
      tx = await contract.initiateWithdrawal(transAddress, transAmount, decimals)
    }
  } else {
    if (!reversed) {
      if (token.gasToken) {
        const contract = new OptimismPortalContract(getBridge().web3Provider.getSigner())
        tx = await contract.depositERC20Transaction(transAddress, transAmount, decimals)
      } else {
        const contract = new L1StandardBridgeContract(getBridge().web3Provider.getSigner())
        tx = await contract.bridgeERC20(token.layer1Address, token.rollupAddress, transAmount, decimals)
      }
    } else {
      tx = await messenger.withdrawERC20(token.layer1Address, token.rollupAddress, ethers.utils.parseUnits(transAmount.toString(), decimals))
    }
  }

  await tx.wait()
  txHash.value = tx.hash

  submit.value = 0
  if (reversed && tokenContractAddress === BASE_TOKEN_CONTRACT_URL) {
    const provider = new ethers.providers.StaticJsonRpcProvider(ROLLUP?.rpcUrl, { name: '',  chainId: ROLLUP?.chainId })
    const _tx = await provider.getTransaction(tx.hash)
    const item = {
        amount: ethers.utils.parseEther(transAmount.toString()).toHexString(),
        data: "0x",
        direction: 1,
        blockNumber: _tx.blockNumber,
        from: walletStore.account,
        l1Token: ROLLUP?.customizeGasAddress,
        l2Token: L2Config?.L2BaseTag,
        to: walletStore.account,
        transactionHash: tx.hash
    }
    rollupBridgeStore.iniWithdrawSuccess(item)
  }
  initFinish(reversed ? vm?.$t('home.withdraw') : vm?.$t('home.deposit'), transAmount, symbol, reversed ? vm?.$t('home.arrivel2') : vm?.$t('home.arrivel1'))
  if (reversed) {
    rollupBridgeStore.getRollupBalances(walletStore.account)
  } else {
    rollupBridgeStore.getLayer1Balances(walletStore.account)
  }
  amount.value = null
  storeSubmitStatus = {}
  rollupBridgeStore.initActivities(walletStore.account)
}


const getMessenger = async(reversed: boolean, transNetwork: any, destNetwork: any) => {
  let messenger:any = null
  if (!reversed) {
    const l1Signer = getBridge().web3Provider.getSigner()
    const l2Provider = new ethers.providers.JsonRpcProvider(destNetwork.rpcUrl)
    messenger = new CrossChainMessenger({
      l1ChainId: transNetwork.chainId,
      l2ChainId: destNetwork.chainId,
      l1SignerOrProvider: l1Signer,
      l2SignerOrProvider: l2Provider,
      contracts: {
        l1: {
          ...L2Config
        }
      }
    })
  } else {
    const l1Provider = new ethers.providers.JsonRpcProvider(destNetwork.rpcUrl)
    const l2Signer = getBridge().web3Provider.getSigner()
    messenger = new CrossChainMessenger({
      l1ChainId: destNetwork.chainId,
      l2ChainId: transNetwork.chainId,
      l1SignerOrProvider: l1Provider,
      l2SignerOrProvider: l2Signer,
      contracts: {
        l1: {
          ...L2Config,
        }
      }
    })
  }
  return messenger
}

const setMax = () => {
  const tokenContractAddress = reverse.value
    ? rollupBridgeStore.token.rollupAddress
    : rollupBridgeStore.token.layer1Address
  const gasFee = reverse.value ? gas.value[1] : gas.value[0]

  const balance = reverse.value
    ? rollupBridgeStore.token.rollupBalance
    : rollupBridgeStore.token.layer1Balance
  if (tokenContractAddress === BASE_TOKEN_CONTRACT_URL) {
    const _amount = balance - fees.value - gasFee
    amount.value = _amount < 0 ? 0 : _amount.toFixed(4)
  } else {
    amount.value = balance
  }
}

const initFinish = (title: string, amount: number, symbol: string, content: string) => {
  ElNotification({
    title: '',
    dangerouslyUseHTMLString: true,
    duration: 10000,
    customClass: 'home-el-no',
    message: `
      <div class="mx-4 mb-2">
        <div class="font-bold">${title} ${amount} ${symbol}</div>
        <div>${content}</div>
      </div>
      <div class="home-el-no-fade h-1 bg-primary-900"></div>
    `
  })
  // <a class="text-primary-900 cursor-pointer opacity-90 hover:opacity-100" href="/activities">${vm.$t('home.view')}</a>
}
</script>
<style lang="less">
.bridge-header-box-1,
.bridge-header-box-2 {
  margin: 0 auto;
  position: relative;
}

.bridge-header-box-1 div,
.bridge-header-box-2 div {
  position: relative;
  height: 100%;
  float: left;
}

.bridge-header-box-1 {
  .bridge-header-box-r {
    width: calc(50% + 15px);
  }

  .bridge-header-box-l {
    width: calc(50% - 15px);
  }

  .bridge-header-box-r:before {
    content: "";
    position: absolute;
    left: 0;
    border-left: 30px solid #131313;
    border-top: 100px solid transparent;
  }
}

.bridge-header-box-2 {
  .bridge-header-box-l {
    width: calc(50% + 15px);
  }

  .bridge-header-box-l:after {
    content: "";
    position: absolute;
    right: 0;
    border-right: 30px solid #131313;
    border-top: 100px solid transparent;
  }

  .bridge-header-box-r {
    width: calc(50% - 15px);
  }
}

.home-el-no {
  padding-right: 0px;
  padding-left: 0px;
  padding-bottom: 0px;
  border-radius: 10px 10px 0 0;
  background: #131313;
  border: 0;
  color: white;

  .el-notification__group {
    margin: 0;
    width: 100%;
  }

  .home-el-no-fade {
    width: 0px;
    animation: fadenum 10s;
  }
}

@keyframes fadenum {
  100% {
    width: 100%
  }
}
</style>



