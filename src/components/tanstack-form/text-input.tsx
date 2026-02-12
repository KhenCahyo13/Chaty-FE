import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { Field, FieldError, FieldLabel } from '../ui/field';

interface TfTextInputProps<
    TForm extends { Field: any; state: { values: Record<string, any> } },
> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'form' | 'name'> {
    form: TForm;
    name: keyof TForm['state']['values'];
    label?: string;
}

export function TfTextInput<
    TForm extends { Field: any; state: { values: Record<string, any> } },
>({ form, name, label, ...props }: TfTextInputProps<TForm>) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form.Field name={name as string}>
            {(field: any) => {
                const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                    <Field data-invalid={isInvalid}>
                        {label && (
                            <FieldLabel htmlFor={field.name}>
                                {label}{' '}
                                {props.required && (
                                    <span className="text-destructive">*</span>
                                )}
                            </FieldLabel>
                        )}
                        <div className='relative'>
                            <Input
                                id={field.name}
                                type={props.type === 'password' && !showPassword ? 'password' : props.type === 'password' ? 'text' : props.type ?? 'text'}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                    if (props.type === 'number') {
                                        const val = e.target.value;

                                        field.handleChange(
                                            val === '' ? '' : Number(val)
                                        );
                                    } else {
                                        field.handleChange(e.target.value);
                                    }
                                }}
                                aria-invalid={isInvalid}
                                placeholder={props.placeholder}
                                autoComplete={props.autoComplete ?? 'off'}
                                disabled={props.disabled}
                                readOnly={props.readOnly}
                                className={props.className}
                            />

                            {props.type === 'password' && (
                                <div className='absolute right-2 top-1/2 -translate-y-1/2'>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() => {
                                            setShowPassword(!showPassword);
                                        }}
                                        type='button'
                                    >
                                        {showPassword ? <IconEyeOff /> : <IconEye />}
                                    </Button>
                                </div>
                            )}
                        </div>

                        {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                        )}
                    </Field>
                );
            }}
        </form.Field>
    );
}
