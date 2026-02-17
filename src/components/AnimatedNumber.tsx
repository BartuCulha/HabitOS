import React, { useEffect, useRef } from 'react';
import { Animated, Text, TextStyle, StyleProp } from 'react-native';
import { colors } from '../constants/theme';

interface AnimatedNumberProps {
  value: number;
  style?: StyleProp<TextStyle>;
  prefix?: string;
  suffix?: string;
  flashColor?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  style,
  prefix = '',
  suffix = '',
  flashColor = colors.xp,
}) => {
  const flashAnim = useRef(new Animated.Value(0)).current;
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      prevValue.current = value;
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: false }),
      ]).start();
    }
  }, [value, flashAnim]);

  const animatedColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,215,0,0)', flashColor],
  });

  return (
    <Animated.View style={{ backgroundColor: animatedColor, borderRadius: 4, paddingHorizontal: 2 }}>
      <Text style={style}>{prefix}{value.toLocaleString()}{suffix}</Text>
    </Animated.View>
  );
};
