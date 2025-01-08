import { NETWORK } from '../env'

export const BASE_TOKEN_CONTRACT_URL = '0x0000000000000000000000000000000000000000'

const getConfig = (network: string) => {
  switch (network) {
    case 'testnet':
      return {
        BRIDGE_SERVICE_API: 'https://testnet-scan.uxlinkone.com/api/v2/transactions/'
      }
    case 'mainnet':
      return {
         BRIDGE_SERVICE_API: ''
      }
  }
}

export const NODE_NETWORKS = []

export const CONFIG = getConfig(NETWORK)

