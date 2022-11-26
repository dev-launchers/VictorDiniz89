export { default } from './FormField';

export interface InputProps {
  label: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}
