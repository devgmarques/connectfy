'use client'

import { Dispatch, SetStateAction, useState } from 'react'

import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'

import { createPost } from '@/http'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from '@/components/ui'
import { Post } from '@/@types'

const schemaCreatePost = z.object({
  title: z.string().nonempty({ message: 'O titulo não pode ser vazio.' }),
  body: z.string().nonempty({ message: 'O corpo não pode ser vazio.' }),
})

type CreatePost = z.infer<typeof schemaCreatePost>

type DialogCreatePostProps = {
  setPostsState?: Dispatch<SetStateAction<Post[]>>
}

export function DialogCreatePost({ setPostsState }: DialogCreatePostProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { register, handleSubmit, formState } = useForm<CreatePost>({
    resolver: zodResolver(schemaCreatePost),
  })

  async function onSubmit({ body, title }: CreatePost) {
    try {
      const { post } = await createPost({ body, title })

      toast.success('A publicação foi criada com sucesso.')

      if (setPostsState) {
        setPostsState((state) => {
          return [...state, post]
        })
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response) {
          toast.error(err.response.data.message)

          return
        }
      }

      toast.error('Ocorreu um erro inesperado. Tente novamente mais tarde.')
    } finally {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Criar uma publicação</Button>
      </DialogTrigger>

      <DialogContent className="w-72  sm:w-96">
        <DialogHeader>
          <DialogTitle>Criar publicação</DialogTitle>
          <DialogDescription>
            Informe os campos necessários para criar sua publicação
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Digite o titulo</Label>
            <Input id="title" type="text" {...register('title')} />
            {formState.errors.title && (
              <span className="mt-2 text-sm text-[#e51e3e]">
                {formState.errors.title.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Digite o corpo</Label>
            <Textarea id="body" {...register('body')} />
            {formState.errors.body && (
              <span className="mt-2 text-sm text-[#e51e3e]">
                {formState.errors.body.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={formState.isSubmitting ?? true}
          >
            Criar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
