export type ReducerType<ActionType extends string, Action, DataType> = Record<
	ActionType,
	(state: DataType, action: Action) => DataType
>;
