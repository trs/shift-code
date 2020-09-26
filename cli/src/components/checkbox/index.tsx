import React, {useState, useEffect} from 'react';
import {Box, Text} from 'ink';
import {useFocus, useStdin} from 'ink';

const ARROW_UP = '\u001B[A';
const ARROW_DOWN = '\u001B[B';
const ENTER = '\r';
const TAB = '\t';
const SPACE = ' ';

interface CheckboxItem {
  label: string;
  value: string;
}

interface CheckboxProps {
  onCheck: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  const {isFocused} = useFocus();
  const {stdin, setRawMode} = useStdin();

  const [isChecked, setChecked] = useState(false);

  const handleInput = (data: any) => {
    if (!isFocused) return;

    switch (data.toString()) {
      case SPACE:
      case ENTER:
        console.log('go', isChecked, '->', !isChecked);
        setChecked(!isChecked);
        break;
    }
  }

  useEffect(() => {
    if (!isFocused) return;

    setRawMode(true);

    stdin?.on('data', handleInput);

    return () => {
      stdin?.off('data', handleInput);

      setRawMode(false);
    };
  }, [stdin, isFocused]);

  useEffect(() => {
    props.onCheck(isChecked);
  }, [isChecked]);

  return (
    <Box flexDirection="row" padding={1}>
      <Text>{isFocused ? '► ' : '  '}</Text>
      <Text>{isChecked ? ' ▣ ' : ' ▢ '}</Text>
      <Text color={isFocused ? undefined : 'gray'}>{props.children}</Text>
    </Box>
  );
}
