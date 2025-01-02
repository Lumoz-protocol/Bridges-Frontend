import { ethers, BigNumber } from 'ethers'
import Erc20Abi from '../abi/erc20.abi.json'
import { BASE_TOKEN_CONTRACT_URL } from '@/constants'
import { Multicall, ContractCallContext } from 'ethereum-multicall'
import { L2Config, LAYER1, ROLLUP } from '@/constants/rollup-bridge/networks'
import OPTIMISMPORTAL from '../abi/OptimismPortal.json'
import L1STANDARDBRIDGE from '../abi/L1StandardBridge.json'
import L2TOL1MESSAGEPASSER from '../abi/L2ToL1MessagePasser.json'
import L2STANDARDBRIDGE from '../abi/L2StandardBridge.json'

export class Erc20Contract {
  contract: ethers.Contract
  jsonRpcProvider: any

  constructor(contractAddress: string, rpcUrl: string, chainId: number, signer?: any) {
    if (chainId) {
      this.jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(rpcUrl, { name: '', chainId })
    }
    this.contract = new ethers.Contract(
      contractAddress,
      Erc20Abi,
      signer || this.jsonRpcProvider
    )
  }

  async getBalance(account: string, decimals: number) {
    try {
      let balance = 0
      if (
        this.contract.address === BASE_TOKEN_CONTRACT_URL
      ) {
        balance = await this.jsonRpcProvider.getBalance(account)
      } else {
        balance = await this.contract.balanceOf(account)
      }
      balance =
        Math.floor(Number(ethers.utils.formatUnits(balance, decimals)) * 10000) / 10000
      return Number(Number(balance).toFixed(8))
    } catch(e) {
      return 0
    }
  }

  async allowance(account: string, spenderContractAddress: string) {
    return ethers.utils.formatUnits(
      await this.contract.allowance(account, spenderContractAddress),
      await this.contract.decimals()
    )
  }

  async approve(spenderContractAddress: string) {
    const max = 100000000
    return await this.contract.approve(
      spenderContractAddress,
      ethers.utils.parseUnits(max.toString(), await this.contract.decimals())
    )
  }

  async approveToZero(spenderContractAddress: string) {
    const max = 0
    return await this.contract.approve(
      spenderContractAddress,
      ethers.utils.parseUnits(max.toString(), await this.contract.decimals())
    )
  }
}

export const getBalancesByAddresses = async(network: any, account: string, erc20Addresses: string[]) => {
  const provider = new ethers.providers.StaticJsonRpcProvider(network.rpcUrl, { name: '', chainId:network.chainId })
  const multicall = new Multicall({
    ethersProvider: provider,
    tryAggregate: true,
    multicallCustomContractAddress: network.multicallContractAddress
  })
  const contexts: ContractCallContext[] = []
  for (const i in erc20Addresses) {
    if (erc20Addresses[i] !== BASE_TOKEN_CONTRACT_URL) {
      contexts.push({
        reference: erc20Addresses[i],
        contractAddress: erc20Addresses[i],
        abi: Erc20Abi,
        calls: [{ reference: 'balanceOf', methodName: 'balanceOf', methodParameters: [account] }]
      })
    }
  }
  let data:any[]
  if (contexts.length) {
    data = await Promise.all([provider.getBalance(account), multicall.call(contexts)])
  } else {
    data = await Promise.all([provider.getBalance(account)])
  }
  
  let list = []
  list.push({
    address: BASE_TOKEN_CONTRACT_URL,
    balance: data[0]
  })
  if (!data[1]) {
    return list
  }
  for (let i in data[1].results) {
    try {
      list.push({
        address: i,
        balance: data[1].results[i].callsReturnContext[0].returnValues[0]
      })
    } catch {
      list.push({
        address: i,
        balance: new BigNumber({}, '0x0')
      })
    }
  }
  return list
}


export class OptimismPortalContract {
  contract: ethers.Contract
  jsonRpcProvider: any

  constructor(signer?: any) {
    this.jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(LAYER1?.rpcUrl, { name: '', chainId: LAYER1?.chainId })
    this.contract = new ethers.Contract(
      L2Config.OptimismPortal,
      OPTIMISMPORTAL,
      signer || this.jsonRpcProvider
    )
  }

  async depositERC20Transaction(address: string, amount: number, decimals: number) {
    const _amount = ethers.utils.parseUnits(amount.toString(), decimals)
    return await this.contract.depositERC20Transaction(address, _amount, _amount, 50000, false, '0x')
  }
}

export class L1StandardBridgeContract {
  contract: ethers.Contract
  jsonRpcProvider: any

  constructor(signer?: any) {
    this.jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(LAYER1?.rpcUrl, { name: '',  chainId: LAYER1?.chainId })
    this.contract = new ethers.Contract(
      L2Config?.L1StandardBridge,
      L1STANDARDBRIDGE,
      signer || this.jsonRpcProvider
    )
  }

  async bridgeETH(amount: string, decimals: number) {
    const _amount = ethers.utils.parseUnits(amount.toString(), decimals)
    return await this.contract.bridgeETH(50000, '0x', { value: _amount })
  }

  async bridgeERC20(localToken: string, remoteToken: string,  amount: string, decimals: number) {
    const _amount = ethers.utils.parseUnits(amount.toString(), decimals)
    return await this.contract.bridgeERC20(localToken, remoteToken, _amount, 50000, '0x')
  }
}

export class L2ToL1MessagePasserContract {
  contract: ethers.Contract
  jsonRpcProvider: any

  constructor(signer?: any) {
    this.jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(ROLLUP?.rpcUrl, { name: '',  chainId: ROLLUP?.chainId })
    this.contract = new ethers.Contract(
      L2Config?.L2ToL1MessagePasser,
      L2TOL1MESSAGEPASSER,
      signer || this.jsonRpcProvider
    )
  }

  async initiateWithdrawal(address:string, amount: string, decimals: number) {
    const _amount = ethers.utils.parseUnits(amount.toString(), decimals)
    return await this.contract.initiateWithdrawal(address, 50000, '0x', { value: _amount })
  }
}

export class L2StandardBridgeContract {
  contract: ethers.Contract
  jsonRpcProvider: any

  constructor(signer?: any) {
    this.jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider(ROLLUP?.rpcUrl, { name: '',  chainId: ROLLUP?.chainId })
    this.contract = new ethers.Contract(
      L2Config?.L2StandardBridge,
      L2STANDARDBRIDGE,
      signer || this.jsonRpcProvider
    )
  }

  async withdraw(tokenAddress:string, amount: string, decimals: number) {
    const _amount = ethers.utils.parseUnits(amount.toString(), decimals)
    return await this.contract.withdraw(tokenAddress, _amount, 50000, '0x')
  }
}