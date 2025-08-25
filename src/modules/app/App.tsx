import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/widgets/layout/Layout';
import { CocktailPage } from '@/pages/cocktail/CocktailPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { cocktailCodes } from '@/entities/cocktail/model/consts';

export const App = () => {
  const first = cocktailCodes[0];
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to={`/${first}`} replace />} />
        {cocktailCodes.map((code) => (
          <Route key={code} path={`/${code}`} element={<CocktailPage code={code} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};


