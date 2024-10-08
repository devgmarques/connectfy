'use client'

import { Dispatch, SetStateAction, useState } from 'react'

import { z } from 'zod'
import { toast } from 'sonner'
import { PiNotePencilBold } from 'react-icons/pi'
import { useForm } from 'react-hook-form'
import { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'

import { updatePost } from '@/http'
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

const schemaUpdatePost = z.object({
  title: z.string().nonempty({ message: 'O titulo não pode ser vazio.' }),
  body: z.string().nonempty({ message: 'O corpo não pode ser vazio.' }),
})

type CreatePost = z.infer<typeof schemaUpdatePost>

type DialogUpdatePostProps = {
  data: Post
  setData: Dispatch<SetStateAction<Post>>
}

export function DialogUpdatePost({ data, setData }: DialogUpdatePostProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { register, handleSubmit, formState } = useForm<CreatePost>({
    defaultValues: {
      title: data.title,
      body: data.body,
    },
    resolver: zodResolver(schemaUpdatePost),
  })

  async function onSubmit({ body, title }: CreatePost) {
    try {
      const { post } = await updatePost({
        id: data.id,
        body,
        title,
        userId: data.userId,
        author: data.author,
        createdAt: data.createdAt,
      })

      toast.success('A publicação foi Updateada com sucesso.')

      setData(post)
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
        <Button
          variant="ghost"
          className="flex gap-3 bg-transparent hover:bg-transparent p-0 m-0"
        >
          <PiNotePencilBold className="w-5 h-5" />
          Atualizar esta publicação
        </Button>
      </DialogTrigger>

      <DialogContent className="w-72 sm:w-96">
        <DialogHeader>
          <DialogTitle>Atualizar publicação</DialogTitle>
          <DialogDescription>
            Informe os campos necessários para Atualizar sua publicação
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
            Atualizar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
