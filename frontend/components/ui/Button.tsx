import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  className = '',
  textClassName = '',
  disabled = false,
}) => {
  const baseButtonClass =
    'px-6 py-3 rounded-2xl shadow-md bg-blue-500';
  const disabledClass = disabled ? ' bg-gray-400' : '';
  const combinedButtonClass = `${baseButtonClass}${disabledClass} ${className}`;

  const baseTextClass = 'font-bold text-lg text-white';
  const combinedTextClass = `${baseTextClass} ${textClassName}`;

  return (
    <TouchableOpacity
      className={combinedButtonClass.trim()}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className={combinedTextClass.trim()}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

