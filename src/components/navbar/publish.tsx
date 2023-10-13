'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authorsAtom, postsAtom } from '@/providers/hydrate-atoms';
import { delay } from '@/util/delay';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Rocket } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { AuthorDetails, Post } from '@/types/types';
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
import { contentAtom } from '@/components/write-page/write-page';

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

const Publish = () => {
  const router = useRouter();

  const setPosts = useSetAtom(postsAtom);
  const [authors, setAuthors] = useAtom(authorsAtom);
  const content = useAtomValue(contentAtom);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
    },
  });

  /** ────────────────────────────────────────────────────────────────────────────────────────────────────
   * SUBMITTING NEW POST
   * ────────────────────────────────────────────────────────────────────────────────────────────────── */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsDialogOpen(false);

    const { signal } = new AbortController();

    // add new post to database (will also add the author to the database if they don't exist)
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
      // No need to add new post to global state if there's an error
      console.log(error);
      throw new Error(error);
    }

    if (success && newPost && newAuthor) {
      toast.success('Your post has been published');

      /**
       * OPTIMISTIC UPDATE (kind of)
       * These setters are needed to add new posts to global state so that users can see the new main-section
       * when navigating to the home page
       *
       * If the response returns a success, then add the new main-section and author to the global state
       * */

      // filter out duplicate authors
      const seenAuthors = new Set();
      const uniqueAuthors = [...authors, newAuthor].filter(author => {
        if (!seenAuthors.has(author._id)) {
          seenAuthors.add(author._id);
          return true;
        }
        return false;
      });

      // update global state
      setAuthors(uniqueAuthors);
      setPosts(prevPosts => [newPost, ...prevPosts]);

      await delay(2000);
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
        <DialogContent className='border-none shadow-none' onOpenAutoFocus={e => e.preventDefault()}>
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
                {/*<DialogDescription className='mb-2 text-lg'>Add a category</DialogDescription>*/}
              </div>

              <Button type='submit' variant='accent' className='w-max'>
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/*<ToastProvider>*/}
      {/*  <Toast open={isToastOpen} onOpenChange={setIsToastOpen} className='border-2 border-confirmative'>*/}
      {/*    <ToastTitle className='text-confirmative'>Your post has been published</ToastTitle>*/}
      {/*  </Toast>*/}
      {/*  <ToastViewport />*/}
      {/*</ToastProvider>*/}
    </>
  );
};

export default Publish;
