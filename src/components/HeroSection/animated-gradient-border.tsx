import React, { CSSProperties, useEffect, useRef } from 'react';

export const AnimatedGradientBorderTW: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const boxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const boxElement = boxRef.current;

		if (!boxElement) {
			return;
		}

		const updateAnimation = () => {
			const angle =
				(parseFloat(boxElement.style.getPropertyValue("--angle")) + 0.5) % 360;
			boxElement.style.setProperty("--angle", `${angle}deg`);
			requestAnimationFrame(updateAnimation);
		};

		requestAnimationFrame(updateAnimation);
	}, []);

	return (
		<div
			ref={boxRef}
			style={
				{
					"--angle": "0deg",
					"--border-color": "linear-gradient(var(--angle), #070707, #687aff)",
					"--bg-color": "linear-gradient(#131219, #131219)",
				} as CSSProperties
			}
			className="flex items-center justify-center rounded-2xl border-2 border-[#0000] [background:padding-box_var(--bg-color),border-box_var(--border-color)]"
		>
			{children}
		</div>
	);
};
