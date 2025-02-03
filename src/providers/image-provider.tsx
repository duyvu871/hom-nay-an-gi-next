// src/providers/image-provider.tsx
'use client'
import { atom, useAtom } from 'jotai'
import { ReactNode, useCallback } from 'react'
import { createPortal } from 'react-dom'

const imageModalAtom = atom<{ url: string | null }>({ url: null })
const imagesAtom = atom<string[]>([])

export const ImageProvider = ({ children }: { children: ReactNode }) => {
	const [state, setState] = useAtom(imageModalAtom)

	const closeModal = useCallback(() => {
		setState({ url: null })
	}, [setState])

	return (
		<>
			{children}
			{state.url &&
				createPortal(
					<div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
						<div className="relative w-full max-w-6xl h-full max-h-[90vh]">
							{/* Overlay click để đóng */}
							<div
								className="absolute inset-0 -z-10"
								onClick={closeModal}
							/>

							{/* Image container */}
							<div className="relative w-full h-full rounded-xl overflow-hidden">
								<img
									src={state.url}
									alt="Fullscreen preview"
									className="object-contain w-full h-full"
								/>

								{/* Close button */}
								<button
									onClick={closeModal}
									className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</div>
						</div>
					</div>,
					document.body
				)}
		</>
	)
}

export const ImageWrapper = ({
															 src,
															 children,
														 }: {
	src: string
	children: ReactNode
}) => {
	const [, setState] = useAtom(imageModalAtom)
	const [images] = useAtom(imagesAtom)

	const openModal = () => {
		setState({ url: src })
	}

	return (
		<div
			onClick={openModal}
			className="cursor-zoom-in transition-transform hover:scale-105"
		>
			{children}
		</div>
	)
}

export const useImageModal = () => {
	const [, setImages] = useAtom(imagesAtom)
	const [, setState] = useAtom(imageModalAtom)

	const registerImages = (urls: string[]) => {
		setImages(urls)
	}

	return {
		registerImages,
		openModal: (url: string) => setState({ url }),
		closeModal: () => setState({ url: null }),
	}
}