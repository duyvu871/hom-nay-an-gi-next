import { useState, useEffect } from 'react';
import { CheckIcon, Clipboard } from 'lucide-react';
// import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface VibratingQuoteProps {
	quote: string;
	author: string;
	vibrationIntensity?: number;
	enableVibration?: boolean;
}

const VibratingQuote = ({
													quote,
													author,
													vibrationIntensity = 2,
													enableVibration = true,
												}: VibratingQuoteProps) => {
	const [isVibrating, setIsVibrating] = useState(false);
	const [showCopyButton, setShowCopyButton] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const vibrationAnimation = `
    @keyframes vibration-${vibrationIntensity} {
      0% { transform: translate(0) scale(1.02); }
      20% { transform: translate(-${vibrationIntensity}px, ${vibrationIntensity}px) scale(1.02); }
      40% { transform: translate(-${vibrationIntensity}px, -${vibrationIntensity}px) scale(1.02); }
      60% { transform: translate(${vibrationIntensity}px, ${vibrationIntensity}px) scale(1.02); }
      80% { transform: translate(${vibrationIntensity}px, -${vibrationIntensity}px) scale(1.02); }
      100% { transform: translate(0) scale(1.02); }
    }

    .animate-vibration-${vibrationIntensity} {
      animation: vibration-${vibrationIntensity} 0.3s ease-in-out;
    }
  `;

	useEffect(() => {
		let timeout: NodeJS.Timeout;
		if (isCopied) {
			timeout = setTimeout(() => setIsCopied(false), 2000);
		}
		return () => clearTimeout(timeout);
	}, [isCopied]);

	const handleVibration = () => {
		if (!enableVibration) return;
		setIsVibrating(true);
	};

	const handleAnimationEnd = () => {
		setIsVibrating(false);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(`${quote} - ${author}`);
			setIsCopied(true);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<div
			className="py-5 flex items-center justify-center"
			onMouseEnter={() => {
				setShowCopyButton(true);
				setIsHovered(true);
			}}
			onMouseLeave={() => {
				setShowCopyButton(false);
				setIsHovered(false);
			}}
			role="region"
			aria-label="Quote container"
		>
			<div
				className={`relative max-w-md p-8 bg-white rounded-2xl shadow-lg transition-transform`}
				style={{
					transform: isHovered ? 'scale(1.02)' : 'scale(1)',
				}}
				onAnimationEnd={handleAnimationEnd}
				onMouseEnter={handleVibration}
				data-testid="quote-card"
			>
				{showCopyButton && (
					<button
						onClick={handleCopy}
						className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
						aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
						disabled={isCopied}
					>
						{isCopied ? (
							<CheckIcon className="w-5 h-5 text-green-500" />
						) : (
							<Clipboard className="w-5 h-5 text-gray-400 hover:text-gray-600" />
						)}
					</button>
				)}

				<div className="relative">
					{/*<svg*/}
					{/*	className="absolute -top-4 -left-6 w-16 h-16 text-gray-200"*/}
					{/*	fill="currentColor"*/}
					{/*	viewBox="0 0 100 100"*/}
					{/*	aria-hidden="true"*/}
					{/*>*/}
					{/*	<path d="M30 20 L20 50 L30 80 L70 80 L80 50 L70 20 Z" />*/}
					{/*</svg>*/}

					<blockquote className="text-xl font-medium text-gray-800" cite={author}>
						&ldquo;{quote}&rdquo;
					</blockquote>

					<cite className="mt-4 block text-right text-gray-600 not-italic">
						<span className="font-semibold">{author}</span>
					</cite>
				</div>
			</div>

			<style jsx global>{vibrationAnimation}</style>
		</div>
	);
};

export default VibratingQuote;