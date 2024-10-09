import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { PropsWithChildren } from 'react';

const ios = Platform.OS == 'ios';
export default function CustomKeyboardView({children}: PropsWithChildren) {
  return (
    <KeyboardAvoidingView
      behavior={ios? 'padding': 'height'}
      style={{flex: 1}}
    >
      <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {
          children
        }
      </ScrollView>
    </KeyboardAvoidingView>
  )
}