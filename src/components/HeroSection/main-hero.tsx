"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { ArrowRightIcon, Bot, ChevronsLeftRightEllipsis, Shuffle } from 'lucide-react';
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { recipeActiveAtom, recipeListAtom } from "@store/recipe.ts";
import RecipeViewer from '@component/Recipe/recipe-view.tsx';
import RecipeList from '@component/Recipe/recipe-list.tsx';
import { getRecommendationFromRecipe } from '../../apis/recommendation.ts';
import useToast from '@hook/client/use-toast-notification.ts';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from '@heroui/react';
import { cn } from '@lib/tailwind-merge.ts';
import GradientBlobs from '@component/HeroSection/gradient-blobs.tsx';
import BlobAnimation from '@component/HeroSection/blob-animation.tsx';
import VibratingQuote from '@component/Quote/vibration-quote.tsx';

const promptValidate = z.object({
  prompt: z.string().nonempty({ message: "Prompt cannot be empty" }),
  type: z.enum(["random", "ai-agent"], { message: "Type must be either random or ai-agent" }),
});

export type Prompt = z.infer<typeof promptValidate>;

const queryModeOptions = [
  {
    label: "AI Agent",
    value: "ai-agent",
    icon: Shuffle,
  },
  {
    label: "Random",
    value: "random",
    icon: Bot
  },
]

const MainHero = () => {
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues
  } = useForm<Prompt>({
    mode: "onBlur",
    resolver: zodResolver(promptValidate),
    defaultValues: {
      prompt: "",
      type: "ai-agent"
    }
  });

  // custom hook
  const {showErrorToast, showSuccessToast} = useToast()

  // atom state
  const [recipe, setRecipe] = useAtom(recipeActiveAtom);
  const [recipeList, setRecipeList] = useAtom(recipeListAtom);

  // react state
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [queryMode, setQueryMode] = useState<"random"|"ai-agent">("ai-agent");
  // refs
  const mainHeroRef = useRef<HTMLDivElement>(null);
  const recipeWrappedRef = useRef<HTMLDivElement>(null);

  // functions handler
  const onSubmit = async (data: Prompt) => {
    if (loading) return;
    try {
      setLoading(true);
      const recipesRecommendation = await getRecommendationFromRecipe(data.prompt, data.type);
      setMessage(recipesRecommendation.message);
      setRecipeList(recipesRecommendation.recipes);
      setLoading(false);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to fetch recipes");
    }
  };

  const onSubmitInvalid = (errors: any) => {
    showErrorToast(errors.prompt.message);
  }

  // effect
  useEffect(() => {
    if (recipeList && recipeList.length > 0) {
      recipeWrappedRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipeList]);

  useEffect(() => {
    mainHeroRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <div ref={mainHeroRef} className="relative min-h-svh flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-20 z-10">
        <GradientBlobs />

        <motion.div
          className="relative text-center space-y-4 max-w-3xl mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-text">
            Chào Trup, <span className="text-primary">Nay Trup có khỏe hum</span>
          </h1>
          <div className="bg-primary p-2 sm:p-3 rounded-2xl mx-4 sm:mx-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-primary-light to-white text-transparent bg-clip-text">
              Trup muốn ăn gì hôm nay? 🤔
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary mt-4 px-4 sm:px-0">
            Trup có thể nhập câu hỏi hoặc chọn một trong những lựa chọn dưới đây để nhận được gợi ý món ăn ngon nhất
          </p>
      </motion.div>

      <motion.div
        className="w-full max-w-2xl px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative group">
          <form onSubmit={handleSubmit(onSubmit, onSubmitInvalid)} className={"flex flex-col gap-5 w-full"}>
            <div className={"w-full flex justify-center items-center"}>
              <Controller
                control={control}
                name={"type"}
                render={({field}) => (
                  <Select
                    classNames={{
                      base: "max-w-[200px]",
                      trigger: "h-12",
                    }}
                    items={queryModeOptions}
                    onSelectionChange={(item) => {
                      const mode = Object.values(item)[0] as "random"|"ai-agent";
                      field.onChange(mode);
                    }}
                    radius={"lg"}
                    labelPlacement="outside"
                    placeholder="Chọn chế độ"
                    color={"primary"}
                    variant="bordered"
                    renderValue={(items) => {
                      return items.map((item) => (
                        <div key={item.key} className="flex gap-2 items-center">
                          {item.data?.icon && <item.data.icon className="text-primary w-5 h-5" />}
                          <span className="text-primary">{item.data?.label}</span>
                        </div>
                      ));
                    }}
                  >
                    {(render) => (
                      <SelectItem
                        key={render.value}
                        textValue={render.label}
                      >
                        <div className="flex gap-2 items-center">
                          <render.icon className="w-5 h-5" />
                          <span>{render.label}</span>
                        </div>
                      </SelectItem>
                    )}
                  </Select>
                )}
              />
            </div>
            <div className={"relative group"}>
              <Controller
                name={"prompt"}
                control={control}
                render={({ field }) => (
                  <input
                    autoComplete={"off"}
                    autoCapitalize={"off"}
                    autoCorrect={"off"}
                    spellCheck={"false"}
                    type="text"
                    placeholder="Ask whatever you want..."
                    className=" w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent pr-16 sm:pr-32 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md bg-white text-text"
                    {...field}
                  />
                )}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  className={cn(
                    'p-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors flex items-center',
                    { 'cursor-not-allowed': loading },
                  )}
                  type={'submit'}
                  disabled={loading}
                >
                  {loading
                    ? (<Spinner color="white" size={'sm'} />)
                    : (<ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />)
                  }
                </button>
              </div>
            </div>

          </form>
        </div>
      </motion.div>
      </div>

      <div ref={recipeWrappedRef} className={'relative flex flex-col items-center justify-center px-4 sm:px-6 z-10'}>
        {message && (
          <div className={'relative mb-16 flex flex-col justify-center items-center'}>
            <h1 className="text-xl font-bold text-center mb-4">
              Dựa trên câu hỏi của Trup, đây là gợi ý của AI Agent
            </h1>
            {/*<h2 className={'text-lg font-normal text-center text-zinc-600 mb-8'}>*/}

            {/*</h2>*/}
          </div>
        )}
        {/*<BlobAnimation />*/}
        {message && (
          <VibratingQuote
            quote={message}
            author={"AI Agent"}
          />
        )}

        {recipeList.length > 0 && (
          <RecipeList recipes={recipeList} />
        )}
      </div>
    </>
  );
};

export default MainHero;
