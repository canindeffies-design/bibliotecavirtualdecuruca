
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { CATEGORIES } from '../constants';

export const CategoryMenu: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? CATEGORIES[categoryId] : null;

  if (!category) {
    return (
      <Layout>
        <div className="flex-grow flex items-center justify-center text-white p-6 text-center">
          <h2 className="text-3xl font-serif-library">Categoria não encontrada</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout backgroundImage={category.bgImage}>
      <div className="flex-grow flex flex-col items-center justify-start p-6 md:p-16">
        <div className="max-w-4xl w-full">
            <h1 className="text-3xl md:text-5xl font-serif-library font-bold text-white mb-10 md:mb-16 drop-shadow-md text-center md:text-left uppercase">
                {category.title}
            </h1>

            <div className="flex flex-col gap-4 md:gap-8 items-center md:items-start">
                {category.subCategories.map((sub) => (
                    <Link
                        key={sub.id}
                        to={`/categoria/${category.id}/${sub.id}`}
                        className="w-full md:w-auto md:min-w-[400px] bg-[#001f5c] border-2 border-[#ffff00] py-4 md:py-6 px-6 md:px-10 text-center transition-all hover:scale-[1.02] active:scale-95 shadow-2xl"
                    >
                        <span className="text-white text-lg md:text-2xl font-bold uppercase tracking-wide font-serif-library">
                            {sub.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </Layout>
  );
};
