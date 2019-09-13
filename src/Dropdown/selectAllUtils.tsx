import * as React from "react";
import { ContainerProps } from "react-select/lib/components/containers";
import { components } from "react-select";
import { SelectComponentsConfig } from "react-select/lib/components";
import { getOptionLabel, getOptionValue } from "react-select/lib/builtins";
import { GroupType } from "react-select/lib/types";

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

const isOptionGroupArray = <OptionType extends {}>(
  options: GroupType<OptionType>[] | OptionType[]
): options is GroupType<OptionType>[] => {
  return options.length > 0 && options[0].hasOwnProperty("options");
};

const optionsToGroups = <OptionType extends {}>(
  options: GroupType<OptionType>[] | OptionType[]
): GroupType<OptionType>[] => {
  return isOptionGroupArray(options)
    ? options
    : [
        {
          options
        }
      ];
};

export const getSelectAllProps = <OptionType extends {}>(
  options: OptionType[] | GroupType<OptionType>[],
  customComponents: SelectComponentsConfig<OptionType>,
  selectAll: SelectAllPropsType<OptionType>,
  onChange: (newValues: OptionType[]) => void
) => {
  // react-select can't accept a mix of OptionType and OptionGroup<OptionType>.
  // In case a "selectAll" option must be added, every spare option is added to an unlabelled OptionGroup
  const optionGroups: GroupType<OptionType>[] = optionsToGroups(options);

  const onChangeWithSelectAll = (newValues: OptionType[]) => {
    const allSelected = newValues.some(
      o => getOptionValue(o) === getOptionValue(selectAll.option)
    );

    if (allSelected) {
      onChange([]);
      selectAll.onSelectedChange(true);
    } else {
      onChange(newValues);
      selectAll.onSelectedChange(false);
    }
  };

  return {
    options: [
      {
        options: [selectAll.option]
      },
      ...optionGroups
    ],
    components: {
      ValueContainer: ValueContainerWithSelectAll<OptionType>(selectAll),
      ...customComponents
    },
    onChange: onChangeWithSelectAll
  };
};
