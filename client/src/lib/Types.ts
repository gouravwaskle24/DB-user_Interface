    export type attribute = {
    type: string;
    allowNull: boolean;
    };

    export type attributes = {
    [key: string]: {
        type: string;
        required: boolean;
    };
    };
