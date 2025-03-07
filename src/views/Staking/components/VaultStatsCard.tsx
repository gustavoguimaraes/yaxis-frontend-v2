import { useContext } from 'react'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import CountUp from 'react-countup'
import Value from '../../../components/Value'
import useComputeAnnualProfits from '../../../hooks/useComputeAnnualProfits'
import useComputeTVL from '../../../hooks/useComputeTVL'
import useMetaVault from '../../../hooks/useMetaVault'
import BigNumber from 'bignumber.js'

export default function VaultStatsCard() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const t = (s: string) => phrases[s][language]
	const { stakingTvl } = useComputeTVL()
	const annualProfits = useComputeAnnualProfits()
	const { strategy } = useMetaVault()

	return (
		<>
			<ExpandableSidePanel header={t('Vault Stats')} key="1">
				<CardRow
					main={t('Current Strategy')}
					secondary={
						strategy ? (
							<>
								<div>{strategy}</div>
								<div>YearnV2: DAI</div>
							</>
						) : (
							<div></div>
						)
					}
				/>
				<CardRow
					main={t('Total Value Locked')}
					secondary={
						<CountUp
							start={0}
							end={stakingTvl.toNumber()}
							decimals={0}
							duration={1}
							prefix="$"
							separator=","
						/>
					}
				/>
				<CardRow
					main={t('Distributed Interest (annually)')}
					secondary={
						<Value
							value={new BigNumber(annualProfits).toNumber()}
							numberPrefix="$"
							decimals={0}
						/>
					}
				/>
			</ExpandableSidePanel>
		</>
	)
}
