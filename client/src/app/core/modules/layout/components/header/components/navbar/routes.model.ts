type BaseRoute = {
  label: string;
  desc?: string;
  type: 'single' | 'multi' | 'multi-sub';
  path: string;
};

type SingularRoute = BaseRoute & {
  type: 'single';
};

type SubRoute = BaseRoute & {
  type: 'multi-sub';
};

type MultiRouteRoot = BaseRoute & {
  type: 'multi';
  subPaths: SubRoute[];
  uiOpen: boolean;
};

export type AppRoute = SingularRoute | MultiRouteRoot | SubRoute;
