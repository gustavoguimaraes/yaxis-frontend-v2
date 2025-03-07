import React, { createContext, useCallback, useState } from 'react'
import styled from 'styled-components'

interface ModalsContext {
	content?: React.ReactNode
	isOpen?: boolean
	onPresent: (content: React.ReactNode, key?: string) => void
	onDismiss: () => void
}

export const Context = createContext<ModalsContext>({
	onPresent: () => { },
	onDismiss: () => { },
})

const Modals: React.FC = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [content, setContent] = useState<React.ReactNode>()

	const handlePresent = useCallback(
		(modalContent: React.ReactNode, key?: string) => {
			setContent(modalContent)
			setIsOpen(true)
		},
		[setContent, setIsOpen],
	)

	const handleDismiss = useCallback(() => {
		setContent(undefined)
		setIsOpen(false)
	}, [setContent, setIsOpen])

	return (
		<Context.Provider
			value={{
				content,
				isOpen,
				onPresent: handlePresent,
				onDismiss: handleDismiss,
			}}
		>
			{children}
			{isOpen && (
				<StyledModalWrapper>
					<StyledModalBackdrop onClick={handleDismiss} />
					{React.isValidElement(content) &&
						React.cloneElement(content, {
							onDismiss: handleDismiss,
						})}
				</StyledModalWrapper>
			)}
		</Context.Provider>
	)
}

const StyledModalWrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 2;
`

const StyledModalBackdrop = styled.div`
	background-color: ${(props) => props.theme.color.grey[600]};
	opacity: 0.4;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 2;
`

export default Modals
