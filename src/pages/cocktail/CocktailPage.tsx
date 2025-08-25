import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchCocktailsByCode } from '@/entities/cocktail/model/slice';
import type { Cocktail, } from '@/entities/cocktail/model/types';
import type { CocktailCode } from '@/entities/cocktail/model/consts';
import styles from './CocktailPage.module.scss';

type Props = { code: CocktailCode };

export const CocktailPage = ({ code }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const slice = useSelector((s: RootState) => s.cocktails.byCode[code]);

  useEffect(() => {
    if (!slice || (slice.status !== 'loading' && slice.status !== 'succeeded')) {
      dispatch(fetchCocktailsByCode(code));
    }
  }, [code]);

  if (!slice || slice.status === 'loading') return <div>Загрузка...</div>;
  if (slice.status === 'failed') return <div>Ошибка: {slice.error}</div>;
  if (slice.items.length === 0) return <div>Нет данных</div>;

  return (
    <div className={styles.wrapper}>
      {slice.items.map((item) => (
        <CocktailCard key={item.idDrink} cocktail={item} />
      ))}
    </div>
  );
};

const CocktailCard = ({ cocktail }: { cocktail: Cocktail }) => {
  const pairs: Array<{ measure: string | null; ing: string | null }> = [];
  for (let i = 1; i <= 15; i += 1) {
    pairs.push({ measure: cocktail[`strMeasure${i}`], ing: cocktail[`strIngredient${i}`] });
  }
  const ingredients = pairs.filter((e) => e.ing);

  return (
    <article className={styles.card}>
      <div className={styles.headerRow}>
        <div className={styles.leftCol}>
          <h2 className={styles.title}>{cocktail.strDrink}</h2>
          <div className={styles.meta}>
            <span>{cocktail.strCategory}</span>
            <span>{cocktail.strAlcoholic}</span>
            <span>{cocktail.strGlass}</span>
          </div>
          {cocktail.strInstructions && (
            <section className={styles.instructions}>
              <h3>Instructions:</h3>
              <p>{cocktail.strInstructions}</p>
            </section>
          )}
          {ingredients.length > 0 && (
            <section>
              <h3>List of ingredients:</h3>
              <ul className={styles.ingredientsList}>
                {ingredients.map((e, idx) => (
                  <li key={idx}>
                    <span>{e.measure ?? ''}</span>
                    <span>{e.ing}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        {cocktail.strDrinkThumb && (
          <div className={styles.thumbBox}>
            <img
              src={cocktail.strDrinkThumb}
              alt={cocktail.strDrink}
              loading="lazy"
            />
          </div>
        )}
      </div>
    </article>
  );
};



