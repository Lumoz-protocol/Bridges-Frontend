import UXLINK from '@/assets/img/network/uxlink.jpg'
import ETH from '@/assets/img/network/eth.svg'
import { NETWORK } from '../../env'
import { ethers } from 'ethers'

const getLayer1 = (network: string) => {
  switch (network) {
    case 'testnet':
      return {
          layer1: 'Sepolia',
          name: 'Sepolia',
          chainId: 11155111,
          symbol: 'ETH',
          decimals: 18,
          rpcUrl: 'https://rpc.ankr.com/eth_sepolia',
          explorerUrl: 'https://sepolia.etherscan.io/',
          img: ETH,
          multicallContractAddress: '0x2a1888ed64ba4ced5b21ff691f30b337504ec34c'
        }
    case 'mainnet':
      return {
          // merlin chain info
          // layer1: 'Ethereum',
          // name: 'Ethereum',
          // chainId: 1,
          // symbol: 'ETH',
          // decimals: 18,
          // rpcUrl: 'https://ethereum.publicnode.com',
          // explorerUrl: 'https://eth.blockscout.com',
          // img: ETH_IMG,
          // multicallContractAddress: '0x9695FA23b27022c7DD752B7d64bB5900677ECC21'
        }
    
  }
}


const getRollup = (network: string) => {
  switch (network) {
    case 'testnet':
      return {
        layer1: 'Sepolia',
        name: 'UXLINK',
        chainId: 241230,
        customizeGasName: 'UXLINK',
        customizeGasSymbol: 'UXLINK',
        customizeGasDecimals: 18,
        customizeGasAddress: '0xDaAD01cdcEC5318C7899AF31331564c6c3F3643c',
        img: UXLINK,
        rpcUrl: 'https://alpha-zkrollup-rpc.lumoz.org/uxlink',
        explorerUrl: 'https://uxlink.zkevm.lumoz.info',
        isGasFree: false,
        nativeTokenName: "ETH",
        nativeTokenSymbol: "ETH",
        nativeTokenDecimals: 18,
        multicallContractAddress: '0xdd612E5fAcBE822fcb3eCb44F1B9Bef06Bff2877'
      }
    case 'mainnet':
      return {}
  }
}


const getTokens = (network: string) => {
  switch (network) {
    case 'testnet':
      return [
        // {
        //   name: 'ETH',
        //   symbol: 'ETH',
        //   layer1Address: '0x0000000000000000000000000000000000000000',
        //   rollupAddress: '0x4200000000000000000000000000000000000006',
        //   rollupDecimals: 18,
        //   layer1Decimals: 18
        // },
        {
          name: 'UXLINK',
          symbol: 'UXLINK',
          layer1Address: '0xDaAD01cdcEC5318C7899AF31331564c6c3F3643c',
          rollupAddress: '0x0000000000000000000000000000000000000000',
          gasToken: true,
          rollupDecimals: 18,
          layer1Decimals: 18
        },
        {
          name: 'M1',
          symbol: 'M1',
          layer1Address: '0x44cDE76f09F0Bb81d16d1D9a7762A159D4F39FB7',
          rollupAddress: '0xe631fad97761cA0f3347e33Fa976526A390Dcc33',
          rollupDecimals: 18,
          layer1Decimals: 18
        }
      ]
    case 'mainnet':
      return []
  }
}

const getL2Config = (network: string) => {
  switch (network) {
    case 'testnet':
      return {
        AddressManager: '0x9Bc65d0648fDE969CBbAd704079dA16D488d5905',
        L1CrossDomainMessenger: '0x2912F88b1a4B9Bf29599958D29c305b8C7C8197f',
        L1StandardBridge: '0x63bc92ff4D11e135337DBb2406f54F7f5570fD88',
        OptimismPortal: '0x8818869a2677A2D9599b715A4F29c90aF0D9FFBE',
        L2OutputOracle: '0x3e89ACcAEFE79369DcC358cF8648FC0F2Eac5818',
        L2ToL1MessagePasser: '0x4200000000000000000000000000000000000016',
        L2StandardBridge: '0x4200000000000000000000000000000000000010',
        L2BaseTag: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
        StateCommitmentChain: ethers.constants.AddressZero,
        CanonicalTransactionChain: ethers.constants.AddressZero,
        BondManager: ethers.constants.AddressZero
      }
    case 'mainnet':
      return {
        AddressManager: '',
        L1CrossDomainMessenger: '',
        L1StandardBridge: '',
        OptimismPortal: '',
        L2OutputOracle: '',
        L2ToL1MessagePasser: '0x4200000000000000000000000000000000000016',
        L2StandardBridge: '0x4200000000000000000000000000000000000010',
        L2BaseTag: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
        StateCommitmentChain: ethers.constants.AddressZero,
        CanonicalTransactionChain: ethers.constants.AddressZero,
        BondManager: ethers.constants.AddressZero
      }
  }
}




export const LAYER1 = getLayer1(NETWORK)
export const ROLLUP = getRollup(NETWORK)
export const TOKENS = getTokens(NETWORK)
export const L2Config = getL2Config(NETWORK)
