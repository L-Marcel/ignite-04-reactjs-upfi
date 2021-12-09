import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: "Arquivo obrigatório",
      validate: {
        lessThan10MB: v => parseInt(v[0].size) < 10000000
        || "O arquivo deve ser menor que 10MB",
        acceptedFormats: v => (/(image\/(jpeg|png|gif))/).test(v[0].type)
        || "Somente são aceitos arquivos PNG, JPEG e GIF"
      }
    },
    title: {
      required: "Título obrigatório",
      minLength: {
        value: 2,
        message: "Mínimo de 2 caracteres"
      },
      maxLength: {
        value: 20,
        message: "Máximo de 20 caracteres"
      }
    },
    description: {
      required: "Descrição obrigatória",
      maxLength: {
        value: 65,
        message: "Máximo de 65 caracteres"
      }
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: any) => {
      return api.post("api/images", data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if(!imageUrl) {
        toast({
          title: "Imagem não adicionada",
          description: "- Verificar se o `imageUrl` existe. Se não existir, mostrar um `toast` de informação com o título `Imagem não adicionada` e descrição `É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.` e sair imediatamente da função. Caso exista, basta seguir para as próximas etapas.",
          status: "error"
        });
      };

      mutation.mutateAsync({ url: imageUrl, ...data });
  
      toast({
        title: "Imagem cadastrada",
        description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
        status: "success"
      });
    } catch {
      toast({
        title: "Falha no cadastro",
        description: "Ocorreu um erro ao tentar cadastrar a sua imagem.",
        status: "error"
      });
    } finally {
      reset();
      setImageUrl("");
      setLocalImageUrl("");
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register("image", formValidations.image)}
          error={errors["image"]}
        />

        <TextInput
          placeholder="Título da imagem..."
          name=""
          {...register("title", formValidations.title)}
          error={errors["title"]}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          name=""
          {...register("description", formValidations.description)}
          error={errors["description"]}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
