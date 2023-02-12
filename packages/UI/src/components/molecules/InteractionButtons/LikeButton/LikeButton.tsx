import Like from '../../../../assets/icons/Like';
import Box from '../../../atoms/Box';
import { InteractionButton } from '../StyledCommonComponents';
import type { LikeButtonProps } from '.';

const LikeButton = ({ text, filled, disabled, ...props }: LikeButtonProps) => {
  return (
    <InteractionButton disabled={disabled} {...props}>
      <Box gap="8px" justifyContent="center" alignItems="center">
        <Like fill={filled ? 'black' : ''} />
        {text}
      </Box>
    </InteractionButton>
  );
};

export default LikeButton;
