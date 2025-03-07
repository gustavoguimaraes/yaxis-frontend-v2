import { Contract } from 'web3-eth-contract'

export interface RewardsContracts {
	MetaVault: string
	Yaxis: string
	YaxisEth: string
}

export interface StakePool {
	pid?: number
	active: boolean
	type: string
	liquidId: string
	lpAddress: string
	lpContract?: Contract
	tokenContract?: Contract
	lpTokens: {
		symbol: string
		decimals: number
		address?: string
		weight?: number
	}[]
	tokenAddress: string
	name: string
	symbol: string
	tokenSymbol: string
	icon: string
	lpUrl: string
	legacy?: boolean
	rewards?: keyof RewardsContracts
}

export interface Config {
	contractAddresses: {
		multicall: string
		yaxis: string
		yax: string
		swap: string
		yaxisChef: string
		weth: string
		xYaxStaking: string
		yAxisMetaVault: string
		stableSwap3PoolConverter: string
		pickleChef: string
		pickleJar: string
		uniswapRouter: string
		curve3pool: string
	}
	rewards: RewardsContracts
	pools: StakePool[]
	vault: {
		usdc: string
		dai: string
		usdt: string
		threeCrv: string
		metaVaultOpenTime: number
	}
	staking: {
		openTime: number
		strategy: string
	}
}
