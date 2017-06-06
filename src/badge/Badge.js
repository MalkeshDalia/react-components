import React from 'react';
import cx from 'classnames';
import { skinnable, props, t } from '../utils';
import FlexView from 'react-flexview';

export const Props = {
  label: t.ReactChildren,
  active: t.maybe(t.Boolean),
  className: t.maybe(t.String),
  style: t.maybe(t.Object)
};

/** A small descriptive element to attach to other UI components
 * @param label - the descriptive content of the badge
 * @param active - tells if the badge is active (for styling purposes)
 */
@skinnable()
@props(Props)
export default class Badge extends React.PureComponent {

  getLocals() {
    const { label, active, className, style } = this.props;

    return {
      label,
      style,
      className: cx('badge', { active }, className)
    };
  }

  template({ label, className, style }) {
    return (
      <FlexView vAlignContent='center' hAlignContent='center' {...{ className, style }}>
        <span className='badge-label'>{label}</span>
      </FlexView>
    );
  }
}
