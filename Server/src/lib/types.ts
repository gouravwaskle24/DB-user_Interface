export type attribute = {
  type: string;
  allowNull: boolean;
};

export type attributes = {
  [key: string]: {
    type: any;
    allowNull?: boolean;
    primaryKey?: boolean;
    defaultValue?: any;
    autoIncrement ?: boolean;
  };
};
