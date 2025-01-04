import {
    chainConfig,
    publicActionsL1,
    publicActionsL2,
    walletActionsL1,
    getWithdrawals
} from "viem/op-stack"
import { createPublicClient, createWalletClient, defineChain, http } from "viem"
import { sepolia } from "viem/chains"
import { L2Config, LAYER1, ROLLUP } from "~/constants/rollup-bridge/networks"

export const rollupChain = defineChain({
    id: ROLLUP?.chainId,
    name: 'UXLINK',
    rpcUrls: {
        default: {
            http: LAYER1?.rpcUrl
        },
    },
    contracts: {
        ...chainConfig.contracts,
        disputeGameFactory: {
            [sepolia.id]: {
                address: L2Config?.DisputeGameFactory,
            },
        },
        l2OutputOracle: {
            [sepolia.id]: {
                address: L2Config?.L2OutputOracle,
            },
        },
        portal: {
            [sepolia.id]: {
                address: L2Config?.OptimismPortal,
            },
        },
    },
})

export const getParentClient = (account: string) => {
    return createWalletClient({
        account,
        sepolia,
        transport: http(LAYER1?.rpcUrl)
    }).extend(walletActionsL1()).extend(publicActionsL1())
}

export const getRollupClient = () => {
    return createPublicClient({
        chain: rollupChain,
        transport: http(ROLLUP?.rpcUrl)
    }).extend(publicActionsL2())
}

export const getWithdrawParams = async(hash: string, account: string) => {
    const rollupClient = getRollupClient()
    const parentClient = getParentClient(account)
    const receipt = await rollupClient.getTransactionReceipt({
        hash
    })
       
    const [withdrawal] = getWithdrawals(receipt)
    const output = await parentClient.getL2Output({
        l2BlockNumber: receipt.blockNumber,
        targetChain: rollupChain,
    })
    
    const args = await rollupClient.buildProveWithdrawal({
        output,
        withdrawal,
    })
    return [
        [
            args.withdrawal.nonce,
            args.withdrawal.sender,
            args.withdrawal.target,
            args.withdrawal.value,
            args.withdrawal.gasLimit,
            args.withdrawal.data
        ],
        args.l2OutputIndex,
        [
            args.outputRootProof.version,
            args.outputRootProof.stateRoot,
            args.outputRootProof.messagePasserStorageRoot,
            args.outputRootProof.latestBlockhash,
        ],
        args.withdrawalProof
    ]
}
