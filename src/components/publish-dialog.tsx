'use client';

import { useState } from 'react';
import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import { authorsAtom, postsAtom } from '@/provider/hydrate-atoms';
import { AuthorDetails, Post } from '@/types';
import { wait } from '@/util/wait';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtomValue, useSetAtom } from 'jotai';
import { Rocket } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Toast, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { postAtom } from '@/components/write';

const formSchema = z.object({
  title: z.string().nonempty('Title is required').max(100, {
    message: 'Title must be less than 100 characters',
  }),
  subtitle: z.string().nonempty('Subtitle is required').max(140, {
    message: 'Subtitle must be less than 140 characters',
  }),
});

type CreatePostServerResponse = {
  success: string;
  error: string;
  newPost: Post;
  newAuthor: AuthorDetails;
};

const PublishDialog = () => {
  const router = useRouter();
  const content = useAtomValue(postAtom);
  const setPosts = useSetAtom(postsAtom);
  const setAuthors = useSetAtom(authorsAtom);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsDialogOpen(false);

    const { signal } = new AbortController();

    const response = await fetch(`/api/posts`, {
      signal,
      method: 'POST',
      body: JSON.stringify({
        content,
        title: values.title,
        subtitle: values.subtitle,
      }),
    });

    const { success, error, newPost, newAuthor }: CreatePostServerResponse = await response.json();

    if (error) {
      console.log(error);
      throw new Error(error);
    }

    if (success && newPost && newAuthor) {
      /**
       * OPTIMISTIC UPDATE
       * These setters are needed to add new posts to global state so that users can see the new post when
       * navigating to the home page
       * */
      setPosts(prevPosts => [newPost, ...prevPosts]);
      setAuthors(prevAuthors => [newAuthor, ...prevAuthors]);

      setIsToastOpen(true);
      await wait(2000);
      router.push(`/${newAuthor.username}/${newPost._id}`);

      return;
    }

    throw new Error('Something went wrong');
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant='confirmative' className='flex h-[40px] w-[120px] flex-row gap-2'>
            <Rocket className='h-4 w-4' />
            <span className='whitespace-nowrap'>Publish</span>
          </Button>
        </DialogTrigger>
        <DialogContent className='border-none shadow-none'>
          <DialogHeader>
            <DialogTitle className='mb-2 text-left'>Post preview</DialogTitle>
          </DialogHeader>

          <DialogDescription className='mb-2 flex aspect-video w-full items-center justify-center bg-muted/10'>
            Image preview
          </DialogDescription>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='hidden'>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Add a title...'
                        {...field}
                        className='rounded-none border-x-0 border-t-0 border-b-primary/10 text-2xl font-bold'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='subtitle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='hidden'>Subtitle</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Add a subtitle...'
                        {...field}
                        className='rounded-none border-x-0 border-t-0 border-b-primary/10 text-xl font-medium'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogDescription className='text-left text-muted'>
                Note: Changes here will affect how your story appears in public places like Pondero’s
                homepage.
              </DialogDescription>

              <div>
                <DialogDescription className='mt-20 text-2xl text-primary'>
                  Publishing to <b>Adam Ridhwan</b>
                </DialogDescription>
                <DialogDescription className='mb-2 text-lg'>Add a category</DialogDescription>
              </div>

              <Button type='submit' variant='accent' className='w-max'>
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ToastProvider>
        <Toast open={isToastOpen} onOpenChange={setIsToastOpen}>
          <ToastTitle>Your post has been published</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    </>
  );
};

export default PublishDialog;
