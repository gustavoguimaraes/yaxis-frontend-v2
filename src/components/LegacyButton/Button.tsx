import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'

import { Link } from 'react-router-dom'

interface ButtonProps {
	children?: React.ReactNode
	disabled?: boolean
	href?: string
	onClick?: () => void
	size?: 'sm' | 'md' | 'lg'
	text?: string
	to?: string
	variant?: 'default' | 'secondary' | 'tertiary'
}

const Button: React.FC<ButtonProps> = ({
	children,
	disabled,
	href,
	onClick,
	size,
	text,
	to,
	variant,
}) => {
	const { color, spacing } = useContext(ThemeContext)

	let buttonColor: string
	switch (variant) {
		case 'secondary':
			buttonColor = color.grey[100]
			break
		case 'default':
		default:
			buttonColor = color.primary.main
	}

	let boxShadow: string
	let buttonSize: number
	let buttonPadding: number
	let fontSize: number
	switch (size) {
		case 'sm':
			boxShadow = `4px 4px 8px ${color.grey[300]},
        -8px -8px 16px ${color.grey[100]}FF;`
			buttonPadding = spacing[3]
			buttonSize = 36
			fontSize = 12
			break
		case 'lg':
			boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px ${color.grey[100]}ff;`
			buttonPadding = spacing[4]
			buttonSize = 72
			fontSize = 12
			break
		case 'md':
		default:
			boxShadow = `6px 6px 12px ${color.grey[300]},
        -12px -12px 24px -2px ${color.grey[100]}ff;`
			buttonPadding = spacing[4]
			buttonSize = 56
			fontSize = 12
	}

	const ButtonChild = useMemo(() => {
		if (to) {
			return <StyledLink to={to}>{text}</StyledLink>
		} else if (href) {
			return (
				<StyledExternalLink href={href} target="__blank">
					{text}
				</StyledExternalLink>
			)
		} else {
			return text
		}
	}, [href, text, to])

	return (
		<StyledButton
			boxShadow={boxShadow}
			color={buttonColor}
			disabled={disabled}
			fontSize={fontSize}
			onClick={onClick}
			padding={buttonPadding}
			size={buttonSize}
		>
			{children}
			{ButtonChild}
		</StyledButton>
	)
}

interface StyledButtonProps {
	boxShadow: string
	color: string
	disabled?: boolean
	fontSize: number
	padding: number
	size: number
}

const StyledButton = styled.button<StyledButtonProps>`
	align-items: center;
	background-color: ${(props) => props.theme.color.primary.main};
	border: 1px solid transparent;
	color:  ${(props) => props.theme.color.white};
	cursor: pointer;
	display: flex;
	font-size: ${(props) => props.fontSize}px;
	font-weight: 700;
	height: ${(props) => props.size}px;
	justify-content: center;
	outline: none;
	border-radius: 8px;
	padding-left: ${(props) => props.padding}px;
	padding-right: ${(props) => props.padding}px;
	pointer-events: ${(props) => (!props.disabled ? undefined : 'none')};
	width: 100%;
	&:hover {
		color: #0186d3;
		cursor: pointer;
		background-color: rgba(55, 107, 173, 0.44);
	}
	&:active {
		color: #0186d3;
		cursor: pointer;
		box-shadow: rgba(55, 107, 173, 0.44) 0px 0px 0px 1pt;
		background-color: rgba(55, 107, 173, 0.44);
	}
	&:focus {
		color: #0186d3;
		cursor: pointer;
		box-shadow: rgba(55, 107, 173, 0.44) 0px 0px 0px 1pt;
		background-color: rgba(55, 107, 173, 0.44);
	}
	&:disabled {
		background-color: rgba(21, 61, 111, 0.44);
		opacity: 0.5;
		cursor: auto;
	}
`

const StyledLink = styled(Link)`
	align-items: center;
	color: inherit;
	display: flex;
	flex: 1;
	height: 56px;
	justify-content: center;
	margin: 0 ${(props) => -props.theme.spacing[4]}px;
	padding: 0 ${(props) => props.theme.spacing[4]}px;
	text-decoration: none;
	&:hover {
		color: rgb(67, 210, 255);
		cursor: pointer;
		background-color: rgba(55, 107, 173, 0.44);
	}
	&:active {
		color: rgb(67, 210, 255);
		cursor: pointer;
		box-shadow: rgba(55, 107, 173, 0.44) 0px 0px 0px 1pt;
		background-color: rgba(55, 107, 173, 0.44);
	}
	&:focus {
		color: rgb(67, 210, 255);
		cursor: pointer;
		box-shadow: rgba(55, 107, 173, 0.44) 0px 0px 0px 1pt;
		background-color: rgba(55, 107, 173, 0.44);
	}
	&:disabled {
		background-color: rgba(21, 61, 111, 0.44);
		opacity: 0.5;
		cursor: auto;
	}
`

const StyledExternalLink = styled.a`
	align-items: center;
	color: inherit;
	display: flex;
	flex: 1;
	height: 56px;
	justify-content: center;
	margin: 0 ${(props) => -props.theme.spacing[4]}px;
	padding: 0 ${(props) => props.theme.spacing[4]}px;
	text-decoration: none;
	&:hover {
		color: rgb(67, 210, 255);
		cursor: pointer;
		background-color: rgba(55, 107, 173, 0.44);
	}
	&:active {
		color: rgb(67, 210, 255);
		cursor: pointer;
		box-shadow: rgba(55, 107, 173, 0.44) 0px 0px 0px 1pt;
		background-color: rgba(55, 107, 173, 0.44);
	}
	&:focus {
		color: rgb(67, 210, 255);
		cursor: pointer;
		box-shadow: rgba(55, 107, 173, 0.44) 0px 0px 0px 1pt;
		background-color: rgba(55, 107, 173, 0.44);
	}
	&:disabled {
		background-color: rgba(21, 61, 111, 0.44);
		opacity: 0.5;
		cursor: auto;
	}
`

export default Button
