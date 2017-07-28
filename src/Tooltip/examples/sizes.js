// import Tooltip from 'buildo-react-components/lib/Tooltip';

class Example extends React.Component {

  render() {
    const popover = {
      position: 'bottom',
      anchor: 'center',
      content: 'Tooltip content',
      isOpen: true
    };

    return (
      <FlexView>
        <Tooltip popover={popover} size='small'>
          <span>Small tooltip!</span>
        </Tooltip>
        <Divider size='large' orientation='horizontal' />
        <Tooltip popover={popover} size='big'>
          <span style={{ fontSize: 16 }}>Big tooltip!</span>
        </Tooltip>
      </FlexView>
    );
  }

}
