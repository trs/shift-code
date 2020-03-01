import React, { useState, useEffect } from 'react';
import {Box, Text} from 'ink';
import { Tabs, Tab } from 'ink-tab';

const Home = () => {

  const [tab, setTab] = useState();

  useEffect(() => {

  });

  return (
    <Box flexDirection="column">
      <Text>Home</Text>

      <Tabs onChange={this.handleTabChange}>
          <Tab name="foo">Foo</Tab>
          <Tab name="bar">Bar</Tab>
          <Tab name="baz">Baz</Tab>
        </Tabs>
    </Box>
  )
}

export default Home;