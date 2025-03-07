import { useState, useEffect, useCallback, useMemo } from 'react'
import { currentConfig } from '../yaxis/configs'
import useTokenBalances from './useTokenBalances'
import useAllowances from './useAllowances'
import BigNumber from 'bignumber.js'
import {
	collapseDecimals,
	getYaxisMetaVault,
	getYaxisMetaVaultConverter,
	numberToDecimal,
} from '../yaxis/utils'
import useWeb3Provider from '../hooks/useWeb3Provider'
import useGlobal from './useGlobal'
import useMetaVault from './useMetaVault'
import { getApy } from '../utils/number'
import { Currencies } from '../utils/currencies'
import usePriceMap from './usePriceMap'

const data: any = {
	'3crv': {
		name: '3CRV',
		image: '',
		totalBalance: 68550000.25,
		availableAmount: 15000,
		supportedCurrencies: {
			dai: {
				name: 'DAI',
				tokenId: 'dai',
				balance: 9828908.45,
				percentage: 15.54,
				maxDeposit: 10000,
				maxWithdrawal: 1000,
				icon: '/images/tokens/dai.png',
				currency: Currencies.DAI,
			},
			usdc: {
				name: 'USDC',
				tokenId: 'usdc',
				balance: 19828908.45,
				percentage: 35.54,
				maxDeposit: 10000,
				maxWithdrawal: 1000,
				icon: '/images/tokens/usdc.svg',
				currency: Currencies.USDC,
			},
			usdt: {
				name: 'USDT',
				tokenId: 'usdt',
				balance: 828908.45,
				percentage: 17.54,
				maxDeposit: 10000,
				maxWithdrawal: 1000,
				icon: '/images/tokens/usdt.svg',
				currency: Currencies.USDT,
			},
			'3crv': {
				name: '3CRV',
				tokenId: '3crv',
				balance: 1828908.45,
				percentage: 27.54,
				maxDeposit: 10000,
				maxWithdrawal: 1000,
				icon: '/images/tokens/3crv.png',
				currency: Currencies.CRV3,
			},
		},
	},
}

export interface ICurrency {
	name: string
	tokenId: string
	address: string
	balance?: string
	decimals?: number
	percentage: number
	maxDeposit?: string
	maxWithdrawal?: string
	withdrawal?: string
	icon: string
	allowance?: string
}

interface ICurrencyResponse {
	name: string
	image: string
	totalBalance: number
	availableAmount: number
	supportedCurrencies: {
		[key: string]: ICurrency
	}
}

interface IHookReturn {
	loading: boolean
	error: boolean
	errorMsg: string | undefined
	name: string
	image: string
	balance: number
	availableAmount: number
	currenciesData: Array<ICurrency>
	tabs: Array<{
		id: string
		name: string
	}>
	onUpdateAllowances: () => void
	metaVaultData: MetaVaultData
	onFetchMetaVaultData: () => void
	isEstimating: boolean
	callEstimateWithdrawals: (shares: string) => void
}

export interface MetaVaultData {
	initialized: boolean
	stake: string
	balance: string
	totalBalance: string
	totalSupply: BigNumber
	totalStaked: string
	strategy: string
	cure3CrvPrice: number
	tvl: number
	pendingYax: string
	rewardPerBlock: number
	yaxisPrice: number
	apy: number
	mvltPrice: number
}

function useMetaVaultData(id: string): IHookReturn {
	const { account, library, chainId } = useWeb3Provider()
	const {
		slippage,
		pickleWithdrawFee,
		vaultWithdrawFee,
		strategy,
	} = useMetaVault()
	const { yaxis, block } = useGlobal()
	const { YAXIS: yaxPrice, Cure3Crv: cure3CrvPrice } = usePriceMap()

	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<boolean>(false)
	const [errorMsg, setErrorMsg] = useState<string | undefined>()
	const [name, setName] = useState<string | undefined>()
	const [image, setImage] = useState<string | undefined>()
	const [balance, setBalance] = useState<number>(0)
	const [availableAmount, setAvailableAmount] = useState<number>(0)
	const [currenciesData, setCurrenciesData] = useState<Array<any>>([])
	// const [maxWithdraws, setMaxWithdraws] = useState<string[]>([])
	const [isEstimating, setEstimating] = useState<boolean>(false)
	const [estimatedWithdrawals, setEstimatedWithdrawals] = useState<string[]>(
		[],
	)
	const [metaVaultData, setMetaVaultData] = useState<MetaVaultData>(
		{} as MetaVaultData,
	)

	const vaultConfig = currentConfig(chainId).vault
	const tokenAddresses: string[] = useMemo(() => {
		return [
			vaultConfig.dai,
			vaultConfig.usdc,
			vaultConfig.usdt,
			vaultConfig.threeCrv,
		]
	}, [vaultConfig])

	const balances = useTokenBalances(tokenAddresses)
	const [daiBalance, usdcBalance, usdtBalance, threeCrvBalance] = balances
	const [allowances, onUpdateAllowances] = useAllowances(
		tokenAddresses,
		currentConfig(chainId).contractAddresses.yAxisMetaVault,
	)
	const [daiApprove, usdcApprove, usdtApprove, threeCrvApprove] = allowances

	const [
		daiWithdrawal,
		usdcWithdrawal,
		usdtWithdrawal,
		threeCrvWithdrawal,
	] = estimatedWithdrawals

	const getMetaVaultData = useCallback(async () => {
		return {
			name: 'MetaVault v1',
			image: '',
			totalBalance: 0,
			availableAmount: 15000,
			supportedCurrencies: {
				dai: {
					name: 'DAI',
					tokenId: 'dai',
					address: vaultConfig.dai,
					decimals: 18,
					allowance: collapseDecimals(daiApprove, 18),
					balance: collapseDecimals(daiBalance, 18),
					percentage: 15.54,
					maxDeposit: collapseDecimals(daiBalance, 18),
					// maxWithdrawal: collapseDecimals(daiMaxWithdraw, 18),
					withdrawal: collapseDecimals(daiWithdrawal, 18),
					icon: '/images/tokens/dai.png',
				},
				usdc: {
					name: 'USDC',
					tokenId: 'usdc',
					address: vaultConfig.usdc,
					decimals: 6,
					allowance: collapseDecimals(usdcApprove, 6),
					balance: collapseDecimals(usdcBalance, 6),
					percentage: 35.54,
					maxDeposit: collapseDecimals(usdcBalance, 6),
					// maxWithdrawal: collapseDecimals(usdcMaxWithdraw, 6),
					withdrawal: collapseDecimals(usdcWithdrawal, 6),
					icon: '/images/tokens/usdc.svg',
				},
				usdt: {
					name: 'USDT',
					tokenId: 'usdt',
					address: vaultConfig.usdt,
					decimals: 6,
					allowance: collapseDecimals(usdtApprove, 6),
					balance: collapseDecimals(usdtBalance, 6),
					percentage: 17.54,
					maxDeposit: collapseDecimals(usdtBalance, 6),
					// maxWithdrawal: collapseDecimals(usdtMaxWithdraw, 6),
					withdrawal: collapseDecimals(usdtWithdrawal, 6),
					icon: '/images/tokens/usdt.svg',
				},
				'3crv': {
					name: '3CRV',
					tokenId: '3crv',
					address: vaultConfig.threeCrv,
					decimals: 18,
					allowance: collapseDecimals(threeCrvApprove, 18),
					balance: collapseDecimals(threeCrvBalance, 18),
					percentage: 27.54,
					maxDeposit: collapseDecimals(threeCrvBalance, 18),
					// maxWithdrawal: collapseDecimals(threeCrvMaxWithdraw, 18),
					withdrawal: collapseDecimals(threeCrvWithdrawal, 18),
					icon: '/images/tokens/3crv.png',
				},
			},
		}
	}, [
		daiApprove,
		daiBalance,
		daiWithdrawal,
		threeCrvApprove,
		threeCrvBalance,
		threeCrvWithdrawal,
		usdcApprove,
		usdcBalance,
		usdcWithdrawal,
		usdtApprove,
		usdtBalance,
		usdtWithdrawal,
		vaultConfig.dai,
		vaultConfig.threeCrv,
		vaultConfig.usdc,
		vaultConfig.usdt,
	])

	const nomalizeData = (input?: ICurrencyResponse) => {
		const balance = input?.totalBalance ?? 0
		const name = input?.name
		const image = input?.image
		const availableAmount = input?.availableAmount ?? 0
		const currenciesData = Object.values(input?.supportedCurrencies ?? {})
		return {
			balance,
			name,
			image,
			availableAmount,
			currenciesData,
		}
	}

	const tabs = Object.keys(data).map((v) => ({
		id: v,
		name: data[v].name,
	}))

	useEffect(() => {
		;(async () => {
			try {
				setErrorMsg(undefined)
				setError(false)
				setLoading(true)
				const rawData = await getMetaVaultData()
				const {
					balance,
					name,
					image,
					availableAmount,
					currenciesData,
				} = nomalizeData(rawData)
				setBalance(balance)
				setName(name)
				setImage(image)
				setAvailableAmount(availableAmount)
				setCurrenciesData(currenciesData)
			} catch (e) {
				setError(true)
				setErrorMsg(e.toString())
			} finally {
				setLoading(false)
			}
		})()
	}, [id, balances, allowances, estimatedWithdrawals, getMetaVaultData])

	const fetchMetaVaultData = useCallback(async () => {
		try {
			const contract: any = getYaxisMetaVault(yaxis)
			if (contract) {
				const [
					balance,
					userInfo,
					totalStaked,
					pendingYax,
					totalSupply,
					yaxPerBlock,
					rewardMultiplier,
				]: any[] = await Promise.all([
					account ? contract.methods.balanceOf(account).call() : '0',
					account
						? contract.methods.userInfo(account).call()
						: {
								accEarned: '0',
								amount: '0',
								yaxRewardDebt: '0',
						  },
					contract.methods.balance().call(),
					account ? contract.methods.pendingYax(account).call() : '0',
					contract.methods.totalSupply().call(),
					contract.methods.yaxPerBlock().call(),
					contract.methods.getMultiplier(block, block + 1).call(),
				])
				const data = {} as MetaVaultData
				const rewardPerBlock = new BigNumber(
					collapseDecimals(
						new BigNumber(yaxPerBlock).multipliedBy(
							rewardMultiplier,
						),
					),
				)
				data.initialized = true
				data.stake = collapseDecimals(userInfo.amount)
				data.balance = collapseDecimals(balance)
				data.totalBalance = collapseDecimals(
					new BigNumber(balance).plus(userInfo.amount),
				)
				data.totalStaked = collapseDecimals(totalStaked)
				data.pendingYax = collapseDecimals(pendingYax)
				data.totalSupply = new BigNumber(totalSupply)
				data.rewardPerBlock = Number(rewardPerBlock)
				data.yaxisPrice = yaxPrice
				data.cure3CrvPrice = cure3CrvPrice
				data.strategy = strategy
				data.tvl = new BigNumber(data.totalStaked)
					.multipliedBy(cure3CrvPrice)
					.toNumber()
				data.apy = getApy(
					Number(data.tvl),
					yaxPrice,
					data.rewardPerBlock,
					1,
				)
				data.mvltPrice = new BigNumber(totalStaked)
					.div(totalSupply)
					.multipliedBy(cure3CrvPrice)
					.toNumber()
				setMetaVaultData(data)
				return data
			}
		} catch (e) {
			console.error(e)
			return {} as MetaVaultData
		}
	}, [
		yaxis,
		account,
		setMetaVaultData,
		yaxPrice,
		cure3CrvPrice,
		block,
		strategy,
	])

	const callEstimateWithdrawals = useCallback(
		async (balanceShares) => {
			setEstimating(true)
			try {
				const contract: any = getYaxisMetaVaultConverter(yaxis)
				if (contract) {
					// const shares = await contract.methods.balanceOf(account).call()
					// maxDaiWithdrawn = metavault.calc_token_amount_withdraw(shares,daiAddres) * ( 1 -slippage)
					const shares = numberToDecimal(balanceShares || 0, 18)
					const values = await Promise.all(
						tokenAddresses.map(async (addr) => {
							if (
								new BigNumber(balanceShares).gt(
									metaVaultData.totalSupply,
								)
							) {
								return '0'
							}
							const total3CrvInPool = numberToDecimal(
								metaVaultData.totalStaked || 0,
								18,
							)
							const r = new BigNumber(total3CrvInPool)
								.multipliedBy(shares)
								.dividedBy(metaVaultData.totalSupply)
								.toFixed(0)
							const withdrawnFee = new BigNumber(1)
								.times(1 - vaultWithdrawFee)
								.times(1 - pickleWithdrawFee)
							let isCrv =
								addr === currentConfig(chainId).vault.threeCrv
							const value = isCrv
								? r
								: await contract.methods
										.calc_token_amount_withdraw(r, addr)
										.call()
							let real = new BigNumber(value)
								.times(withdrawnFee)
								.times(isCrv ? 1 : 1 - slippage)
								.toFixed()
							return real
						}),
					)
					setEstimatedWithdrawals(values)
				}
			} catch (e) {
				console.error(e)
			}
			setEstimating(false)
		},
		[
			yaxis,
			slippage,
			setEstimatedWithdrawals,
			tokenAddresses,
			metaVaultData.totalStaked,
			metaVaultData.totalSupply,
			pickleWithdrawFee,
			vaultWithdrawFee,
			chainId,
		],
	)

	useEffect(() => {
		setMetaVaultData({} as MetaVaultData)
		if (account) setLoading(true)
	}, [account])

	useEffect(() => {
		if (
			library &&
			yaxis &&
			yaxis.web3 &&
			yaxPrice &&
			cure3CrvPrice &&
			block
		)
			fetchMetaVaultData()
	}, [
		account,
		library,
		yaxis,
		fetchMetaVaultData,
		yaxPrice,
		cure3CrvPrice,
		block,
	])

	return {
		loading,
		error,
		errorMsg,
		name,
		image,
		balance,
		availableAmount,
		currenciesData,
		tabs,
		onUpdateAllowances,
		metaVaultData,
		onFetchMetaVaultData: fetchMetaVaultData,
		isEstimating,
		callEstimateWithdrawals,
	}
}

export default useMetaVaultData
