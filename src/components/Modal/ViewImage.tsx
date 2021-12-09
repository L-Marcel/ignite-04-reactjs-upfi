import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  if(isOpen) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay/>
        <ModalContent
          bg="pGray.800"
          maxW="900px"
          w="auto"
          h="auto"
        >
          <ModalBody
            display="inline-flex"
            p={0}
            m={0}
          >
            <Image 
              src={imgUrl}
              minH="600px"
              borderTopRadius={8}
            />
          </ModalBody>
          <ModalFooter
            p={5}
            display="flex"
            justifyContent="flex-start"
          >
            <Link href={imgUrl}>Abrir original</Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return null;
}
