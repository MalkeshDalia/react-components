import React from 'react';
import MobileDetect from 'mobile-detect';
import { props, t } from '../utils';

export const Props = {
  children: t.Function,
  forceDesktop: t.maybe(t.Boolean),
  userAgent: t.maybe(t.String)
};

/**
 * Top-level component which detects device type and passes this info to children as context
 * @param children - children must be passed as function so to propagte context correctly. Environment info is also passed as first argument to the callback
 * @param forceDesktop - ignores real device type and considers it as desktop
 * @param userAgent - custom user-agent
 */
@props(Props)
export default class MobileDetector extends React.Component {

  static childContextTypes = {
    isDesktop: React.PropTypes.bool.isRequired,
    isMobile: React.PropTypes.bool.isRequired,
    isPhone: React.PropTypes.bool.isRequired,
    isTablet: React.PropTypes.bool.isRequired
  };

  getChildContext = () => this.getEnvironmentInfo();

  getEnvironmentInfo = () => {
    const md = new MobileDetect(this.props.userAgent || window.navigator.userAgent);
    return {
      isDesktop: !this.isMobile(md),
      isMobile: this.isMobile(md),
      isPhone: this.isPhone(md),
      isTablet: this.isTablet(md)
    };
  };

  isPhone = (md) => !this.props.forceDesktop && !!md.phone();

  isTablet = (md) => !this.props.forceDesktop && !!md.tablet();

  isMobile = (md) => !this.props.forceDesktop && !!md.mobile();

  render() {
    return this.props.children(this.getEnvironmentInfo());
  }

}
