import React from "react";
import { RecipeProvider } from '@provider/recipe-provider.tsx';
import GradientLayout from '@layout/gradient-layout.tsx';
import HomePage from '@container/home-page.tsx';
import { ImageProvider } from '@provider/image-provider.tsx';

export default function Home() {
    return (
      <RecipeProvider>
        <ImageProvider>
          <GradientLayout>
              <HomePage />
          </GradientLayout>
        </ImageProvider>
      </RecipeProvider>
    )
}