import * as React from "react";
import { ObjectOmit } from "../utils";
import * as cx from "classnames";
import Input from "../Input";
import { FormField } from "./FormField";

type DefaultProps = {
  /** An optional custom renderer for Input */
  inputRenderer: (props: Input.Props) => JSX.Element;
};

type FieldProps = {
  /** the label for the field */
  label: FormField.Props["label"];
  /** whether the field is required */
  required?: FormField.Props["required"];
  /** optional props to pass to the wrapping View */
  viewProps?: FormField.Props["viewProps"];
  hint?: FormField.Props["hint"];
  /** an optional class name to pass to top level element of the component */
  className?: string;
  /** an optional style object to pass to top level element of the component */
  style?: React.CSSProperties;
};

type NonDefaultProps = FieldProps & ObjectOmit<Input.Props, keyof FieldProps>;

type InternalProps = DefaultProps & NonDefaultProps;

export namespace InputField {
  export type Props = NonDefaultProps & Partial<DefaultProps>;
}

export class InputField extends React.PureComponent<InternalProps> {
  static defaultProps: DefaultProps = {
    inputRenderer: (props: Input.Props) => <Input {...props} />
  };

  render() {
    const {
      label,
      required,
      className: _className,
      viewProps,
      hint,
      disabled,
      inputRenderer,
      ..._inputProps
    } = this.props;
    const className = cx("input-field", _className);
    const inputProps = {
      ..._inputProps,
      disabled
    };

    return (
      <FormField
        label={label}
        required={required}
        className={className}
        viewProps={viewProps}
        disabled={disabled}
        hint={hint}
        render={(onFocus, onBlur) =>
          inputRenderer({ ...inputProps, onFocus, onBlur })
        }
      />
    );
  }
}
