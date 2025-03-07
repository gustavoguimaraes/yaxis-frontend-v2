import { createContext } from 'react'
import { Transaction, TransactionsMap } from './types'

interface TransactionsContext {
	transactions: TransactionsMap
	onAddTransaction: (tx: Transaction) => void
	onClearTransactions: () => void
}

export default createContext<TransactionsContext>({
	transactions: {},
	onAddTransaction: (tx: Transaction) => {},
	onClearTransactions: () => {},
})
