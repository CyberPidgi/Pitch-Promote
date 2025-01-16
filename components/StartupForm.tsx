'use client'

import React, { useActionState, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from './ui/textarea'

import MDEditor from '@uiw/react-md-editor'
import { Button } from './ui/button'
import { SendIcon } from 'lucide-react'
import { formSchema } from '@/lib/validation'

import z from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

import { createPitch } from '@/lib/actions'


const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [pitch, setPitch] = useState('**Hi There!**')
  const { toast } = useToast()
  const router = useRouter()

  const handleFormSubmit = async (prevState: any, formData: FormData) => {

    // console.log('hello?')
    try {
      const formValues = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        link: formData.get('link') as string,
        pitch,
      }
      // console.log(formValues)

      await formSchema.parseAsync(formValues)


      const res = await createPitch(prevState, formData, pitch)

      if (res.status == 'SUCCESS') {
        toast({
          title: 'Success',
          description: 'Startup submitted successfully',
        })
        router.push(`/startup/${res._id}`)
      }

      return res

    } catch (error) {
      // console.log("form error: ", error)

      toast({
        title: 'Error',
        description: 'Please check your inputs',
        variant: 'destructive'
      })

      if (error instanceof z.ZodError){
        const fieldErrors = error.flatten().fieldErrors;

        setErrors(fieldErrors as unknown as Record<string, string>)

        return { ...prevState, error: 'Invalid form data', status: 'ERROR'}
      } 

      return {
        ...prevState,
        error: 'An unexpected error occurred',
        status: 'ERROR'
      }
    } 
  }

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: '',
    status: 'INITIAL'
  }, '/');

  return (
    <form action={formAction} className='startup-form'>
      <div>
        <label htmlFor='title' className='startup-form_label'>
          Title
        </label>
        <Input
          id='title'
          name='title'
          className='startup-form_input'
          placeholder='Startup Title'
        />

        {errors.title && <p className='startup-form_error'>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor='description' className='startup-form_label'>
          Description
        </label>
        <Textarea
          id='description'
          name='description'
          className='startup-form_textarea'
          placeholder='Startup Description'
        />

        {errors.description && <p className='startup-form_error'>{errors.description}</p>}
      </div>

      <div>
        <label htmlFor='category' className='startup-form_label'>
          Category
        </label>
        <Input
          id='category'
          name='category'
          className='startup-form_input'
          placeholder='Startup Category'
        />

        {errors.category && <p className='startup-form_error'>{errors.category}</p>}
      </div>

      <div>
        <label htmlFor='link' className='startup-form_label'>
          Image URL
        </label>
        <Input
          id='link'
          name='link'
          className='startup-form_input'
          placeholder='Startup Image URL'
        />

        {errors.link && <p className='startup-form_error'>{errors.link}</p>}
      </div>

      <div data-color-mode='light'>
        <label htmlFor='pitch' className='startup-form_label'>
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview='edit'
          height={300}
          className='border border-black-100 rounded-lg overflow-hidden'
          textareaProps={{
            placeholder: 'Briefly describe your idea and what problem it solves'
          }}
          previewOptions={{
            disallowedElements: ['style']
          }}
        />

        {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
      </div>

      <Button type='submit'       className='startup-form_btn'
        disabled={isPending}
      >
        {isPending ? 'Submitting...' : 'Submit'}
        <SendIcon className='ml-2'/>
      </Button>
    </form>
  )
}

export default StartupForm