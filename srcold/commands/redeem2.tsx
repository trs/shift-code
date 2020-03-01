import React from 'react';
import { render, Box, Color } from "ink";

export const Redeem = () => {
  const [counter, setCounter] = React.useState(0);

	React.useEffect(() => {
		const timer = setInterval(() => {
			setCounter(prevCounter => prevCounter + 1);
		}, 100);

		return () => {
			clearInterval(timer);
		};
	});


  return (
    <Box><Color green>{counter}</Color> tests passed</Box>
  );
};
