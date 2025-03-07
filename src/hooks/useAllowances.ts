import { useEffect, useState, useCallback } from 'react'

import BigNumber from 'bignumber.js'
import useWeb3Provider from './useWeb3Provider'

import { getAllowances } from '../utils/erc20'
import useGlobal from './useGlobal'
import { getMutilcallContract } from '../yaxis/utils'

const useAllowances = (
	tokenAddresses: string[],
	spender: string,
): [BigNumber[], () => void] => {
	const [allowances, setAllowances] = useState<BigNumber[]>([
		...Array(tokenAddresses.length),
	])
	const { account, library } = useWeb3Provider()
	const { yaxis, block } = useGlobal()
	let mutilcallContract = getMutilcallContract(yaxis)

	const onUpdateAllowances = useCallback(async () => {
		const balance = await getAllowances(
			yaxis,
			mutilcallContract,
			tokenAddresses,
			account,
			spender,
		)
		setAllowances(balance)
	}, [
		tokenAddresses,
		setAllowances,
		account,
		spender,
		yaxis,
		mutilcallContract,
	])

	useEffect(() => {
		if (account && library && yaxis && yaxis.web3) {
			onUpdateAllowances()
		}
	}, [account, library, yaxis, block, onUpdateAllowances])

	return [allowances, onUpdateAllowances]
}

export default useAllowances
