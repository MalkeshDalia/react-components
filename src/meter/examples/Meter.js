class Example extends React.Component {
  render() {
    const ranges = [
      {startValue: 0, endValue: 30, fillingColor: 'green', backgroundColor: 'rgba(0, 255, 0, 0.1)'},
      {startValue: 30, endValue: 60, fillingColor: 'yellow'},
      {startValue: 60, endValue: 80, fillingColor: 'orange', labelColor:'orange'},
      {startValue: 80, endValue: 100, fillingColor: 'red', labelColor: 'red'}
    ];
    return (
      <div>
        <FlexView width='100%'>
          <Meter
            value={30}
            ranges={ranges}
            baseFillingColor='#ccc'
          />
        </FlexView>
        <br/>
        <div style={{minHeigth: 10, width: '50%'}}>
          <Meter
            value={45}
            ranges={ranges}
            style={{border: '1px solid black'}}
          />
        </div>
        <br/>
        <div style={{minHeigth: 10}}>
          <Meter
            value={70}
            ranges={ranges}
          />
        </div>
        <br/>
        <div style={{minHeigth: 10}}>
          <Meter
            value={100}
            ranges={ranges}
          />
        </div>
      </div>
    );
  }
};