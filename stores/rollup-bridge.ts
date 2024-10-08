import { defineStore } from 'pinia'
import { CrossChainMessenger } from '@eth-optimism/sdk'
import _ from 'lodash'
import { ethers } from 'ethers'
import { LAYER1, ROLLUP, TOKENS, L2Config } from '~~/constants/rollup-bridge/networks'
import { getBalancesByAddresses } from '@/libs/ethers/contract'
let timer:any = null

export const useRollupBridgeStore = defineStore('rollup-bridge', {
  state: () => ({
    layer1: LAYER1,
    rollup: ROLLUP,
    rollupList: [ROLLUP],
    tokens: JSON.parse(JSON.stringify(TOKENS)),
    token: JSON.parse(JSON.stringify(TOKENS[0])),
    activities: [],
    acLoading: false
  }),
  actions: {
    initTokens() {
      this.tokens = JSON.parse(JSON.stringify(TOKENS))
      let storeList = JSON.parse(localStorage.getItem('zkevm:tokens'))
      if (!Array.isArray(storeList)) {
        storeList = []
      }
      let list = []
      for (let i in storeList) {
        if (!this.tokens.find(item => item.layer1Address === storeList[i].layer1Address && item.rollupAddress === storeList[i].rollupAddress)) {
          list.push(storeList[i])
        }
      }
      this.tokens = this.tokens
        .concat(list)
        .map(item => {
          return {
            ...item,
            layer1Loading: false,
            rollupLoading: false,
            layer1Balance: 0,
            rollupBalance: 0
          }
        })
    },
    async getLayer1Balances(account: string) {
      for (let i in this.tokens) {
        this.tokens[i].layer1Loading = true
      }
      const layer1Balances = await getBalancesByAddresses(this.layer1, account, this.tokens.map(item => item.layer1Address))
      
      for (let i in this.tokens) {
        try {
          let balance = layer1Balances.find(item => item.address === this.tokens[i].layer1Address)?.balance
          balance = Math.floor(Number(ethers.utils.formatUnits(balance, this.tokens[i].layer1Decimals)) * 10000) / 10000
          this.tokens[i].layer1Balance = balance
        } catch(e) {
          console.log(e.toString())
        }
        this.tokens[i].layer1Loading = false
      }
    },
    async getRollupBalances(account: string) {
      for (let i in this.tokens) {
        this.tokens[i].rollupLoading = true
      }
      const rollupBalances = await getBalancesByAddresses(this.rollup, account, this.tokens.map(item => item.rollupAddress))

      for (let i in this.tokens) {
        try {
          let balance = rollupBalances.find(item => item.address === this.tokens[i].rollupAddress)?.balance
          balance = Math.floor(Number(ethers.utils.formatUnits(balance, this.tokens[i].rollupDecimals)) * 10000) / 10000
          this.tokens[i].rollupBalance = balance
        } catch(e) {
          console.log(e.toString())
        }
        this.tokens[i].rollupLoading = false
      }
    },
    setToken(token) {
      this.token = token
    },
    setTokens(tokens) {
      this.tokens = tokens
    },
    async initActivities(account: string) {
      await this.getActivities(account)
      timer = setInterval(() => {
        this.getActivities(account)
      }, 2 * 60 * 1000)
    },
    stopActivities() {
      if (timer) {
        this.activities = []
        clearInterval(timer)
      }
    },
    async getActivities(account: string) {
      const l1Provider = new ethers.providers.StaticJsonRpcProvider(LAYER1.rpcUrl)
      const l2Provider = new ethers.providers.StaticJsonRpcProvider(ROLLUP.rpcUrl)
      const messenger = new CrossChainMessenger({
        l1ChainId: LAYER1.chainId,
        l2ChainId: ROLLUP.chainId,
        l1SignerOrProvider: l1Provider,
        l2SignerOrProvider: l2Provider,
        contracts: {
          l1: {
           ...L2Config
          }
        }
      })
      const withdrawMessages = await messenger.getWithdrawalsByAddress(account)
      this.activities = withdrawMessages
    }
  }
})
