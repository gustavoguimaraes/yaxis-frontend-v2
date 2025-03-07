import React, { useMemo } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import InvestmentDetailOverview from './components/InvestmentDetailOverview'
import InvestmentAccountActionCard from './components/InvestmentAccountActionCard'
import VaultStatsCard from './components/VaultStatsCard'
import Stake from './components/Stake'
import RecentTransactionsCard from './components/RecentTransactionsCard'
import useMetaVaultData from '../../hooks/useMetaVaultData'
import useContractReadAccount from '../../hooks/useContractReadAccount'
import './index.less'
import BigNumber from 'bignumber.js'
import { currentConfig } from '../../yaxis/configs'
import { etherscanUrl } from '../../yaxis/utils'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { NETWORK_NAMES } from '../../connectors'

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

const MetaVault: React.FC = () => {
	const { account, chainId } = useWeb3Provider()

	const { data: stakedBalance } = useContractReadAccount({
		contractName: `rewards.MetaVault`,
		method: 'balanceOf',
		args: [account],
	})

	const {
		metaVaultData: { totalBalance, mvltPrice },
		loading,
	} = useMetaVaultData('v1')

	const totalUSDBalance = useMemo(() => {
		const sBalance = new BigNumber(stakedBalance || 0).dividedBy(10 ** 18)
		const balance = new BigNumber(totalBalance || '0')
		return balance
			.plus(sBalance)
			.multipliedBy(mvltPrice || '0')
			.toFixed(2)
	}, [mvltPrice, stakedBalance, totalBalance])

	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])
	const address = currentConfig(chainId).contractAddresses['yAxisMetaVault']

	return (
		<div className="investing-view">
			<Page
				loading={false}
				mainTitle="MetaVault Account"
				secondaryText="MetaVault 2.0"
				secondaryTextLink={
					address &&
					etherscanUrl(`/address/${address}#code`, networkName)
				}
				value={
					'$' +
					Number(totalUSDBalance).toLocaleString(
						undefined, // leave undefined to use the browser's locale,
						// or use a string like 'en-US' to override it.
						{ minimumFractionDigits: 2 },
					)
				}
				valueInfo="Balance"
			>
				<Row gutter={16}>
					<Col xs={24} sm={24} md={24} lg={16}>
						<InvestmentAccountActionCard />
						<Stake />
					</Col>
					<StyledCol xs={24} sm={24} md={24} lg={8}>
						<InvestmentDetailOverview
							totalUSDBalance={totalUSDBalance}
							balanceLoading={loading}
						/>
						<VaultStatsCard />
						<RecentTransactionsCard />
					</StyledCol>
				</Row>
			</Page>
		</div>
	)
}

export default MetaVault
