import { Box, Button } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

function getPageData(pageParam?: number | string) {
  return api.get("api/images", {
    params: {
      after: pageParam ?? 0
    }
  });
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    async({ pageParam = null }) => getPageData(pageParam),
    {
      getNextPageParam: lastPage => lastPage.data.after
    }
  );

  const formattedData = useMemo(() => {
    let images = data?.pages.flatMap(page => page.data.data);
    return images ?? [];
  }, [data]);

  if(isLoading) {
    return ( 
      <Loading/> 
    );
  } else if(isError) {
    return ( 
      <Error/>
    );
  };

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData}/>

        { hasNextPage && <Button
          isLoading={isFetchingNextPage}
          name="Carregar mais"
          loadingText='Carregando...'
          onClick={() => fetchNextPage()}
          mt={8}
        >
          Carregar mais
        </Button> }
    </Box>
    </>
  );
}
