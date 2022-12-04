export { default } from './FormField';

export interface InputProps {
  label: string;
  id: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  valid?: boolean;
  touched?: boolean;
}
