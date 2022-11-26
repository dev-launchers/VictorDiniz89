import errorIcon from '../../../assets/icons/rawSvg/alert-triangle.svg';
import successIcon from '../../../assets/icons/rawSvg/check-circle.svg';
import {
  Label,
  Input,
  StyledInlineErrorMessage,
  Icon,
  InputWrapper,
} from './StyledFormField';
import type { InputProps } from '.';

function FormField({
  label,
  placeholder,
  required = false,
  disabled = false,
  error,
  touched,
}: InputProps) {
  return (
    <>
      <Label htmlFor={label}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
        <InputWrapper>
          <Input
            type="text"
            name={label}
            id={label}
            autoCorrect="off"
            autoComplete="off"
            placeholder={placeholder}
            valid={touched && !error}
            error={touched && error}
            disabled={disabled}
          />
          {required && touched && (
            <Icon src={error ? errorIcon : successIcon} />
          )}
        </InputWrapper>
      </Label>
      {error && touched && (
        <StyledInlineErrorMessage>{error}</StyledInlineErrorMessage>
      )}
    </>
  );
}

export default FormField;
