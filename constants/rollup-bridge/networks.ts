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
        name: 'UXLINK One Testnet',
        chainId: 7181,
        customizeGasName: 'UXLINK',
        customizeGasSymbol: 'UXLINK',
        customizeGasDecimals: 18,
        customizeGasAddress: '0xDaAD01cdcEC5318C7899AF31331564c6c3F3643c',
        img: UXLINK,
        // rpcUrl: 'https://rpc-sepolia.uxlinkone.com',
        rpcUrl: 'http://103.231.86.36:8845',
        explorerUrl: 'https://testnet-scan.uxlinkone.com',
        isGasFree: false,
        nativeTokenName: "ETH",
        nativeTokenSymbol: "ETH",
        nativeTokenDecimals: 18,
        multicallContractAddress: '0x30a89c9cb8e20f6154cebde925d8c2369301364f'
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
        // {
        //   name: 'M1',
        //   symbol: 'M1',
        //   layer1Address: '0x44cDE76f09F0Bb81d16d1D9a7762A159D4F39FB7',
        //   rollupAddress: '0xe631fad97761cA0f3347e33Fa976526A390Dcc33',
        //   rollupDecimals: 18,
        //   layer1Decimals: 18
        // }
      ]
    case 'mainnet':
      return []
  }
}

const getL2Config = (network: string) => {
  switch (network) {
    case 'testnet':
      return {
        AddressManager: '0xfD7C32D4b38430e73AeDfE82FFFC08050eE29c70',
        L1CrossDomainMessenger: '0xE99389f7d0253f727F2b4c23D2c6a0211F191781',
        L1StandardBridge: '0x68a49C79568e42D41E72dF1D816f52C6a8a2CC0B',
        OptimismPortal: '0x6EFe0808db5A886a79219043BCf8bE11851d7b20',
        L2OutputOracle: '0x00DcEcDD33686cCb64858cFFD998e3880E101891',
        L2ToL1MessagePasser: '0x4200000000000000000000000000000000000016',
        L2StandardBridge: '0x4200000000000000000000000000000000000010',
        L2BaseTag: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000',
        DisputeGameFactory: '0x7913bBAb2d8c75745b952134cC8CEbef47FD5595',
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
        DisputeGameFactory: '',
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
