declare module 'ink-box' {
  import { Component } from 'react';

  interface BorderStyle {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    horizontal: string;
    vertical: string;
  }
  
  interface PaddingMargin {
    top: number;
    right: number;
    bottom: number;
    left: number;
  }

  interface BoxProps {
    borderColor?: 
      | 'black'
			| 'red'
			| 'green'
			| 'yellow'
			| 'blue'
			| 'magenta'
			| 'cyan'
			| 'white'
			| 'gray'
			| 'grey'
			| 'blackBright'
			| 'redBright'
			| 'greenBright'
			| 'yellowBright'
			| 'blueBright'
			| 'magentaBright'
			| 'cyanBright'
      | 'whiteBright'
      | string;

    borderStyle?:
      | 'single'
      | 'double'
      | 'round'
      | 'bold'
      | 'singleDouble'
      | 'doubleSingle'
      | 'classic'
      | BorderStyle;

    dimBorder?: boolean;
    padding?: number | PaddingMargin;
    margin?: number | PaddingMargin;
    float?:
      | 'left'
      | 'right'
      | 'center';
    align?:
      | 'left'
      | 'right'
      | 'center';

    backgroundColor?: 
      | 'black'
			| 'red'
			| 'green'
			| 'yellow'
			| 'blue'
			| 'magenta'
			| 'cyan'
			| 'white'
			| 'gray'
      | 'grey'
      | string;
  }

  export default class Box extends Component<BoxProps> {}
}