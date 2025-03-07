import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useWeb3Provider from './useWeb3Provider'

import { getBalance } from '../utils/erc20'
import useGlobal from './useGlobal'

const useTokenBalanceOf = (tokenAddress: string, account: string) => {
	const [balance, setBalance] = useState(new BigNumber(0))
	const { library } = useWeb3Provider()
	const { block } = useGlobal()

	const fetchBalance = useCallback(async () => {
		if (account && library) {
			const balance = await getBalance(library, tokenAddress, account)
			setBalance(new BigNumber(balance))
		}
	}, [account, library, tokenAddress])

	useEffect(() => {
		fetchBalance()
	}, [block, fetchBalance])

	return balance
}

export default useTokenBalanceOf
