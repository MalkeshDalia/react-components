import React from 'react';
import { props, t, skinnable } from '../utils';
import { warn } from '../utils/log';
import cx from '../utils/classnames';
import FlexView from 'react-flexview';
import find from 'lodash/find';
import every from 'lodash/every';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';

const Range = t.refinement(t.struct({
  startValue: t.Number,
  endValue: t.Number,
  fillingColor: t.maybe(t.String),
  labelColor: t.maybe(t.String),
  backgroundColor: t.maybe(t.String)
}), r => r.startValue < r.endValue, 'Range');

const Ranges = t.refinement(t.list(Range), (rangeList) => {

  const isOverlapped = (range1, range2) => (
    Math.max(range1.startValue, range2.startValue) < Math.min(range1.endValue, range2.endValue)
  );

  const noOverlappingRanges = ranges => {
    return every(ranges, (range1, i) => {
      return every(ranges.slice(0, i).concat(ranges.slice(i + 1)), range2 => {
        return !isOverlapped(range1, range2);
      });
    });
  };

  return noOverlappingRanges(rangeList);
}, 'Ranges');

export const Props = t.refinement(t.struct({
  value: t.Number,
  min: t.maybe(t.Number),
  max: t.maybe(t.Number),
  labelFormatter: t.maybe(t.Function),
  ranges: t.maybe(Ranges),
  baseLabelColor: t.maybe(t.String),
  baseFillingColor: t.maybe(t.String),
  baseBackgroundColor: t.maybe(t.String),
  id: t.maybe(t.String),
  className: t.maybe(t.String),
  style: t.maybe(t.Object)
}), ({ min, max }) => min < max, 'Props');

const isFullyFilled = (ranges, min, max) => {
  if (!ranges) {
    return false;
  }
  const comparableRanges = ranges.concat({ startValue: max, endValue: min });
  const sortedStartValueList = sortBy(comparableRanges, 'startValue').map(range => range.startValue);
  const sortedEndValueList = sortBy(comparableRanges, 'endValue').map(range => range.endValue);
  return isEqual(sortedStartValueList, sortedEndValueList);
};

const computePercentage = (value, min, max) => (
  Math.abs((value - min) * 100 / (max - min))
);

const labelFormatter = (value, min, max) => (
  `${computePercentage(value, min, max)}%`
);

/**
 * A Meter is a simple UI component used to display a measurement (usually a percentage) on a known scale.
 * @param value - current value
 * @param min - minimum value
 * @param max - maximum value
 * @param labelFormatter - function in which you can define a custom label format
 * @param ranges - array of Object in which you can define startValue, endValue, labelColor, fillingColor
 * @param baseLabelColor - fallback labelColor
 * @param baseFillingColor - fallback fillingColor
 * @param baseBackgroundColor - fallback backgroundColor
 */
@skinnable()
@props(Props)
export default class Meter extends React.Component {

  static defaultProps = {
    min: 0,
    max: 100,
    labelFormatter
  };

  componentDidMount() {
    this.logWarnings();
  }

  logWarnings = () => {
    const {
      ranges,
      max,
      min,
      baseFillingColor,
      baseBackgroundColor
    } = this.props;
    warn(() => {
      if (isFullyFilled(ranges, min, max) && (baseFillingColor || baseBackgroundColor)) {
        return 'baseFillingColor or baseBackgroundColor is not needed, ranges are fully filled';
      }
      return undefined;
    });
    warn(() => {
      if (!(isFullyFilled(ranges, min, max) || (baseFillingColor && baseBackgroundColor))) {
        return 'You should pass both baseFillingColor and baseBackgroundColor, ranges are not fully filled';
      }
      return undefined;
    });
  };

  computeStyles = () => {
    const {
      value,
      min,
      max,
      ranges,
      baseFillingColor,
      baseLabelColor,
      baseBackgroundColor
    } = this.props;

    const range = find(ranges, ({ startValue, endValue }) => (
      value >= startValue && value <= endValue
    ));
    return {
      basisSize: `${computePercentage(value, min, max)}%`,
      fillingStyle: {
        backgroundColor: range ? range.fillingColor : baseFillingColor
      },
      labelStyle: {
        color: range ? range.labelColor : baseLabelColor
      },
      barStyle: {
        backgroundColor: range ? range.backgroundColor : baseBackgroundColor
      }
    };
  }

  getLocals() {
    const {
      className,
      labelFormatter,
      ...props
    } = this.props;

    const styles = this.computeStyles();

    return {
      ...props,
      className: cx('meter', className),
      fillingStyle: styles.fillingStyle,
      labelStyle: styles.labelStyle,
      barStyle: styles.barStyle,
      basisSize: styles.basisSize,
      formattedLabel: labelFormatter(props.value, props.min, props.max)
    };
  }

  template({ id, className, style, fillingStyle, labelStyle, barStyle, basisSize, formattedLabel }) {
    return (
      <FlexView {...{ id, className, style }} grow>
        <FlexView
          className='bar'
          grow
          style={barStyle}
        >
          <FlexView
            className='filling'
            basis={basisSize}
            style={fillingStyle}
          />
        </FlexView>
        <FlexView
          className='label'
          shrink={false}
          style={labelStyle}
        >
          {formattedLabel}
        </FlexView>
      </FlexView>
    );
  }
}
