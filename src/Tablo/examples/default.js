class Example extends React.Component {

  state = {
    sortBy: 'name',
    sortDir: 'asc',
    columnWidths: {},
    columnsOrder: []
  }

  rowHeight = 40;

  onSortChange = ({ sortBy, sortDir }) => {
    this.setState({ sortBy, sortDir });
  };

  onColumnResize = ({ width, key }) => {
    this.setState({
      columnWidths: {
        ...this.state.columnWidths,
        [key]: parseInt(width)
      }
    });
  };

  onRowsSelect = (selectedRows) => {
    this.setState({ selectedRows });
  }

  onColumnsReorder = (columnsOrder) => {
    this.setState({ columnsOrder });
  }

  render() {

    const {
      rowHeight, onSortChange, onColumnResize, onRowsSelect, onColumnsReorder,
      state: { sortBy: sortByField, sortDir, columnWidths, selectedRows, columnsOrder }
    } = this;

    const sortedData = sortBy(data, sortByField);

    return (
      <FlexView style={{ height: 300, width: '100%' }}>
        <Tablo
          rowClassNameGetter={index => `row-${index}`}
          data={sortDir === 'desc' ? sortedData.reverse() : sortedData}
          rowHeight={rowHeight}
          onSortChange={onSortChange}
          sortBy={sortByField}
          sortDir={sortDir}
          onColumnResize={onColumnResize}
          selectionType='single'
          selectedRows={selectedRows}
          onRowsSelect={onRowsSelect}
          columnsOrder={columnsOrder}
          onColumnsReorder={onColumnsReorder}
        >
          <TabloColumn name='index' fixed width={40} isResizable={false} sortable={false}>
            <Header></Header>
            <Cell>{(_, __, index) => index}</Cell>
          </TabloColumn>

          <TabloColumn name='salutation' width={columnWidths.salutation}>
            <Header>Salutation</Header>
            <Cell>
              {(_, { name, city }) => (
                <span style={{ fontStyle: 'italic' }}>"Hello! I am {name.split(' ')[0]} from {city}!"</span>
              )}
            </Cell>
          </TabloColumn>

          <TabloColumn name='avatar' fixed width={40} sortable={false} isResizable={false}>
            <Header></Header>
            <Cell>{avatar => <img src={avatar} height={40} width={40} />}</Cell>
          </TabloColumn>

          <TabloColumn name='name' fixed width={columnWidths.name}>
            <Header>Name</Header>
            <Cell>{name => <span style={{ fontWeight: 700 }}>{name}</span>}</Cell>
          </TabloColumn>

          <TabloColumn name='city' width={columnWidths.city}>
            <Header>City</Header>
          </TabloColumn>

          <TabloColumn name='email' width={columnWidths.email}>
            <Header>Email</Header>
            <Cell>{email => (
              <TextOverflow lazy label={email}>
                {self => (
                  <Tooltip popover={{ content: email, attachToBody: true}} style={{ width: '100%' }}>
                    {self}
                  </Tooltip>
                )}
              </TextOverflow>
            )}</Cell>
          </TabloColumn>

          <TabloColumn name='company' isResizable={false} flexGrow={1}>
            <Header>Company</Header>
          </TabloColumn>

        </Tablo>
      </FlexView>
    );
  }
}

const getRandomRow = () => {
  return {
    avatar: faker.image.avatar(),
    name: faker.name.findName(),
    city: faker.address.city(),
    email: faker.internet.email(),
    company: faker.company.companyName()
  };
};

const data = Array.apply(null, Array(30)).reduce(acc => [...acc, getRandomRow()], []);
