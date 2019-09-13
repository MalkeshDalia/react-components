import * as React from "react";
import { ContainerProps } from "react-select/lib/components/containers";
import { components } from "react-select";
import { SelectComponentsConfig } from "react-select/lib/components";
import { OptionProps } from "react-select/lib/components/Option";
import { getOptionValue, getOptionLabel } from "react-select/lib/builtins";

export type SelectAllPropsType<OptionType> = {
  option: OptionType;
  isSelected: boolean;
  onSelectedChange: (isSelected: boolean) => void;
};

const ValueContainerWithSelectAll = <OptionType extends {}>(
  selectAll: SelectAllPropsType<OptionType>
) => ({ children, ...props }: ContainerProps<OptionType>) => {
  return (
    <components.ValueContainer {...props}>
      {selectAll.isSelected ? (
        <components.SingleValue
          {...props}
          data={selectAll.option}
          innerProps={{}}
          isDisabled={false}
        >
          {getOptionLabel(selectAll.option)}
        </components.SingleValue>
      ) : (
        children
      )}
    </components.ValueContainer>
  );
};

const Option = <OptionType extends {}>(
  selectAll: SelectAllPropsType<OptionType>
) => ({ children, ...props }: OptionProps<OptionType>) => {
  return (
    <components.Option
      {...props}
      innerProps={{
        ...props.innerProps,
        onClick: e => {
          selectAll.onSelectedChange(
            getOptionValue(props.data) === getOptionValue(selectAll.option)
          );
          props.innerProps.onClick(e);
          if (getOptionValue(props.data) === getOptionValue(selectAll.option)) {
            props.clearValue();
          }
        }
      }}
    >
      {children}
    </components.Option>
  );
};

export const defaultSelectAllComponents = <OptionType extends {}>(
  selectAll: SelectAllPropsType<OptionType>
): SelectComponentsConfig<OptionType> => ({
  ValueContainer: ValueContainerWithSelectAll<OptionType>(selectAll),
  Option: Option(selectAll)
});
