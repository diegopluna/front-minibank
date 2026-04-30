import { createFormHook } from '@tanstack/react-form'
import { fieldContext, formContext } from './contexts'
import { TextField } from './text-field'
import { TextareaField } from './textarea-field'
import { MoneyField } from './money-field'
import { AccountField } from './account-field'
import { CpfField } from './cpf-field'
import { SubmitButton } from './submit-button'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    MoneyField,
    AccountField,
    CpfField,
  },
  formComponents: {
    SubmitButton,
  },
})
