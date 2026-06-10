import Svg, { Circle, Line } from "react-native-svg";

export default function Logo() {
  return (
    <Svg width="100" height="100" viewBox="0 0 100 100" fill="none">
      <Circle cx="50" cy="20" r="12" stroke="currentColor" strokeWidth="4" />
      <Line x1="50" y1="32" x2="50" y2="60" stroke="currentColor" strokeWidth="4" />
      <Line x1="30" y1="42" x2="70" y2="42" stroke="currentColor" strokeWidth="4" />
      <Line x1="50" y1="60" x2="30" y2="85" stroke="currentColor" strokeWidth="4" />
      <Line x1="50" y1="60" x2="70" y2="85" stroke="currentColor" strokeWidth="4" />
    </Svg>
  );
}
