import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import Checkbox from '../../atoms/Checkbox';
import Radio from '../../atoms/Radio';
import Typography from '../../atoms/Typography';

import {
  DropdownContainer,
  Toggle,
  Chevron,
  OptionsContainer,
  Options,
} from './StyledDropdown';
import type { DropdownProps } from '.';

const Dropdown = ({
  width,
  title,
  type,
  isOpen = false,
  options = [],
  recieveValue,
}: DropdownProps) => {
  const [menuOpen, setMenuOpen] = useState(isOpen);

  const node = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (node.current?.contains(e.target as Node)) return;
    setMenuOpen(false);
  };

  const onChange = (e: ChangeEvent, text: string) => {
    const { checked } = e.target as HTMLInputElement;
    if (type === 'radio')
      setCheckedOptions((prev) => {
        Object.keys(prev).forEach((key) => (prev[key] = false));
        prev[text] = checked;
        return prev;
      });
    if (type === 'checkbox')
      setCheckedOptions((prev) => {
        prev[text] = checked;
        return prev;
      });
    // callbackFn(text);
    console.log(`checked options ${JSON.stringify(checkedOptions, null, 2)}`);
    recieveValue?.(checkedOptions);
  };
  // add typings here
  const [checkedOptions, setCheckedOptions] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <DropdownContainer ref={node} width={width}>
      <Toggle onClick={() => setMenuOpen(!menuOpen)}>
        <Typography type="label">{title}</Typography>
        <Chevron isOpen={menuOpen} />
      </Toggle>
      <OptionsContainer isOpen={menuOpen}>
        <Options>
          {options.map(({ text, disabled }, i) => {
            return type === 'checkbox' ? (
              <Checkbox
                key={i}
                label={text}
                onChange={onChange}
                disabled={disabled}
              />
            ) : (
              <Radio
                key={i}
                label={text}
                onChange={onChange}
                disabled={disabled}
              />
            );
          })}
        </Options>
      </OptionsContainer>
    </DropdownContainer>
  );
};

export default Dropdown;
