import { defineStore } from 'pinia'
import _ from 'lodash'
import { ethers } from 'ethers'
import { LAYER1, ROLLUP, TOKENS } from '~~/constants/rollup-bridge/networks'
import { getBalancesByAddresses } from '@/libs/ethers/contract'
import { getJettonWalletAddress, getBridgeRecords } from '@/api/api'
import TonWeb from "tonweb"
import { BASE_TOKEN_CONTRACT_URL } from '~/constants'

let tonWeb = null
if (LAYER1?.rpcUrl) {
  tonWeb = new TonWeb(new TonWeb.HttpProvider(LAYER1.rpcUrl))
} else {
  tonWeb = new TonWeb()
}

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
      const pList = []
      for (let i in this.tokens) {
        if (this.tokens[i].layer1Address === BASE_TOKEN_CONTRACT_URL) {
          pList.push(tonWeb.provider.getBalance(account))
        } else {
          pList.push(this.getTonJettonBalances(account, this.tokens[i].layer1Address))
        }
      }
      const data = await Promise.all(pList)
      for (let i in this.tokens) {
        this.tokens[i].layer1Balance = Number(ethers.utils.formatUnits(data[i], this.tokens[i].layer1Decimals))
        this.tokens[i].layer1Loading = false
      }
    },
    async getTonJettonBalances(address:string, tokenAddress: string) {
      try {
        const userJettonWallet = await getJettonWalletAddress(address, tokenAddress)
        return userJettonWallet.balance
      } catch {
        return 0
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
      // timer = setInterval(() => {
      //   this.getActivities(account)
      // }, 10 * 1000)
    },
    stopActivities() {
      if (timer) {
        this.activities = []
        clearInterval(timer)
      }
    },
    async getActivities(account: string) {
      const data = await getBridgeRecords(account)
      if (data && data.length) {
        this.activities = data
      }
    }
  }
})

