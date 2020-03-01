declare module 'ink-router' {
  import { Component } from 'react';

  interface RouteProps {
    exact?: boolean;
    path?: string;
    component?: any;
  }

  export class Router extends Component<{}> {}
  export class CommandLineRouter extends Component<{}> {}
  export class Route extends Component<RouteProps> {}
  export class Switch extends Component<{}> {}
  export function withRouter(): void;
}