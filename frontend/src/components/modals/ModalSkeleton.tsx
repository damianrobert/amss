import {Modal} from '@mui/material';

type ModalSkeletonProps = {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
};

function ModalSkeleton({isOpen, onClose, children}: ModalSkeletonProps) {
	return (
		<Modal open={isOpen} onClose={onClose}>
			<div className="top-2/4 left-2/4 h-fit absolute translate-x-[-50%] translate-y-[-50%] max-md:w-full">
				{children}
			</div>
		</Modal>
	);
}

export default ModalSkeleton;
