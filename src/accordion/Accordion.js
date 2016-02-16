import React from 'react';
import cx from 'classnames';
import { skinnable, props, t } from '../utils';
import FlexView from '../flex/FlexView';
import Icon from '../Icon/Icon';

import './accordion.scss';

@skinnable()
@props({
  children: t.ReactChildren,
  isOpen: t.Boolean,
  isSelected: t.maybe(t.Boolean),
  onChange: t.Function,
  onOpen: t.maybe(t.Function),
  onClose: t.maybe(t.Function),
  content: t.maybe(t.ReactChild),
  icons: t.maybe(t.struct({
    open: t.maybe(t.String),
    closed: t.maybe(t.String)
  })),
  className: t.maybe(t.String),
  id: t.maybe(t.String),
  style: t.maybe(t.Object)
})
export default class Accordion extends React.Component {

  static defaultProps = {
    onOpen: () => {},
    onClose: () => {}
  };

  _onChange = () => {
    const { onChange, onOpen, onClose, isOpen } = this.props;
    onChange(!isOpen);
    if (isOpen) {
      onClose();
    } else {
      onOpen();
    }
  };

  getLocals() {
    const {
      props: {
        isOpen, children, content,
        icons, className, isSelected
      },
      _onChange: onChange
    } = this;

    return {
      isOpen,
      children,
      content,
      icons,
      onChange,
      className: cx(className, 'accordion', { 'is-open': isOpen, 'is-selected': isSelected })
    };
  }

  templateIcons = ({ isOpen, icons }) => (
    icons && <Icon icon={isOpen ? icons.open : icons.closed} />
  );

  template({ isOpen, children, onChange, content, icons }) {
    return (
      <div className='accordion'>
        <FlexView className='header' onClick={onChange}>
          <div>{content}</div>
          <FlexView marginLeft='auto' shrink={false}>
            {this.templateIcons({ isOpen, icons })}
          </FlexView>
        </FlexView>
        {isOpen &&
          <div className='content'>
            {children}
          </div>
        }
      </div>
    );
  }

}
