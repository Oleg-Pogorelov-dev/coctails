import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cocktailsReducer from '@/entities/cocktail/model/slice';
import type { Cocktail } from '@/entities/cocktail/model/types';
import { render, screen } from '@testing-library/react';
import { CocktailPage } from './CocktailPage';

jest.mock('@/entities/cocktail/model/slice', () => {
  const original = jest.requireActual('@/entities/cocktail/model/slice');
  return { ...original, fetchCocktailsByCode: () => ({ type: 'mocked' }) };
});

const renderWithStore = (state: any) => {
  const store = configureStore({
    reducer: { cocktails: cocktailsReducer },
    preloadedState: state as any,
  });
  return render(
    <Provider store={store}>
      <CocktailPage code="margarita" />
    </Provider>,
  );
};

test('renders loading', () => {
  renderWithStore({ cocktails: { byCode: { margarita: { items: [], status: 'loading' } } } });
  expect(screen.getByText(/Загрузка/)).toBeInTheDocument();
});

test('renders items', () => {
  const drinks: Cocktail[] = [
    {
      idDrink: '1',
      strDrink: 'Test',
      strCategory: 'Cat',
      strAlcoholic: 'Alcoholic',
      strGlass: 'Glass',
      strInstructions: 'Do it',
      strDrinkThumb: null,
    },
  ];
  renderWithStore({ cocktails: { byCode: { margarita: { items: drinks, status: 'succeeded' } } } });
  expect(screen.getByText('Test')).toBeInTheDocument();
});
