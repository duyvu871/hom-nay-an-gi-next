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
  prompt: z.string().nonempty({ message: "Vui lòng nhập yêu cầu của bạn" }),
  type: z.enum(["random", "ai-agent"], { message: "Vui lòng chọn chế độ tìm kiếm" }),
});

export type Prompt = z.infer<typeof promptValidate>;

const queryModeOptions = [
  {
    label: "AI Thông Minh",
    value: "ai-agent",
    icon: Shuffle,
  },
  {
    label: "Ngẫu Nhiên",
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
  const { showErrorToast, showSuccessToast } = useToast()

  // atom state
  const [recipe, setRecipe] = useAtom(recipeActiveAtom);
  const [recipeList, setRecipeList] = useAtom(recipeListAtom);

  // react state
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [queryMode, setQueryMode] = useState<"random" | "ai-agent">("ai-agent");
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
      showErrorToast("Không thể tìm thấy công thức nấu ăn");
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
      <div ref={mainHeroRef} className="select-none relative min-h-svh flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-20 z-10">
        <GradientBlobs />

        <motion.div
          className="relative text-center space-y-4 max-w-4xl mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-text">
            Bạn đang đói? <span className="text-primary">Hôm nay ăn gì?</span>
          </h1>
          <div className="inline-block bg-primary p-2 sm:p-3 rounded-2xl mx-4 sm:mx-8">
            <h2 className="inline-block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
              <span className='bg-gradient-to-r from-white via-primary-light to-white text-transparent bg-clip-text'>
                Để AI làm bếp trưởng cho bạn nhé!
              </span>
              👨‍🍳
            </h2>
          </div>
          <p className="flex flex-col text-sm sm:text-base md:text-lg text-text-secondary mt-4 px-4 sm:px-0">
            <span>
              Chia sẻ với tôi món ăn bạn thích, nguyên liệu bạn có, hoặc tâm trạng của bạn,...
            </span>
            <span>AI sẽ gợi ý những công thức nấu ăn phù hợp nhất.</span>
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
              </div>
              <div className={"relative flex flex-col group border rounded-2xl overflow-hidden border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-hover focus:border-transparent transition-all duration-300 ease-in-out shadow-sm hover:shadow-md bg-white"}>
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
                      placeholder="Hôm nay bạn muốn ăn gì?"
                      className=" w-full px-4 sm:px-6 py-3 sm:py-3 text-base sm:text-lg outline-none text-text"
                      {...field}
                    />
                  )}
                />
                <div className="flex justify-between gap-2.5 p-3">
                  <Controller
                    control={control}
                    name={"type"}
                    render={({ field }) => (
                      <Select
                        classNames={{
                          base: "max-w-[150px]",
                          trigger: "h-8 border-none shadow-none bg-transparent text-primary",
                          // listbox: "w-[150px] max-w-[150px]",
                        }}
                        popoverProps={{
                          classNames: {
                            base: "before:bg-primary",
                            content: "p-0 border-small",
                          },
                        }}
                        listboxProps={{
                          itemClasses: {
                            base: [
                              // "rounded-md",
                              "text-default-500",
                              "transition-opacity",
                              "data-[hover=true]:text-text-light",
                              "data-[hover=true]:!bg-primary",
                              // "dark:data-[hover=true]:bg-default-50",
                              "data-[selectable=true]:focus:bg-default-50",
                              "data-[pressed=true]:opacity-70",
                              "data-[focus-visible=true]:ring-default-500",
                            ],
                          },
                        }}
                        items={queryModeOptions}
                        onSelectionChange={(item) => {
                          const mode = Object.values(item)[0] as "random" | "ai-agent";
                          field.onChange(mode);
                        }}
                        radius={"sm"}
                        labelPlacement="outside"
                        placeholder="Chọn chế độ"
                        color={"primary"}
                        variant="bordered"
                        renderValue={(items) => {
                          return items.map((item) => (
                            <div key={item.key} className="flex gap-2 items-center">
                              {item.data?.icon && <item.data.icon className="text-primary-hover w-5 h-5" />}
                              <span className="text-primary-hover">{item.data?.label}</span>
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
                  <button
                    className={cn(
                      'w-10 h-10 aspect-square bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors flex items-center justify-center cursor-pointer group',
                      { 'cursor-not-allowed': loading },
                    )}
                    type={'submit'}
                    disabled={loading}
                  >
                    {loading
                      ? (<Spinner color="white" size={'sm'} />)
                      : (<ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-all" />)
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
          <div className={'relative mb-5 flex flex-col justify-center items-center'}>
            <h1 className="text-xl font-bold text-center mb-4">
              Dựa trên yêu cầu của bạn, tôi đã tìm thấy một số công thức nấu ăn:
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
        <div className='my-5' />
        {recipeList.length > 0 && (
          <RecipeList recipes={recipeList} />
        )}
      </div>
    </>
  );
};

export default MainHero;
