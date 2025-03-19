import React from "react";
import {
  PagingState,
  IntegratedPaging,
  IntegratedSorting,
  SortingState,
  SearchState,
  EditingState,
  IntegratedFiltering,
  Sorting,
  Column,
  CustomPaging
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar,
  SearchPanel,
  TableEditColumn
} from "@devexpress/dx-react-grid-material-ui";

const tableMessages = {
  noData: "Aucune donnée disponible"
};

const searchPanelMessages = {
  searchPlaceholder: "Recherche..."
};

const tableEditColumnMessages = {
  addCommand: "Nouveau"
};

const pagingPanelMessages: any = {
  showAll: "Toutes",
  rowsPerPage: "Lignes par page",
  info: "Lignes {from} à {to} ({count} éléments)"
};

interface Props {
  add?: boolean;
  remotePaging?: boolean;
  rows: any[];
  columns: Column[];
  defaultSorting: Sorting[];
  pageSizes: number[];
  totalCount?: number;
  onChangeLimit?: (limit: number) => void;
  onChangeOffset?: (offset: number) => void;
  onAddedRowsChange?: () => void;
  onLoadData?: (limit: number, offset: number) => void;
}

interface State {
  currentPage: number;
  pageSize: number;
}

export default class TableComponent extends React.Component<Props, State> {
  static defaultProps = {
    add: false,
    remotePaging: false,
    defaultSorting: [{ columnName: "id", direction: "desc" }],
    pageSizes: [5, 10, 15, 0]
  };

  state = {
    currentPage: 0,
    pageSize: 10
  };

  refresh(limit: number, offset: number) {
    const { remotePaging } = this.props;
    if (remotePaging && this.props.onLoadData) {
      this.props.onLoadData(limit, offset);
    }
  }

  handleCurrentPageChange = (currentPage: number) => {
    const { pageSize } = this.state;
    if (this.props.onChangeLimit && this.props.onChangeOffset) {
      const limit = pageSize;
      const offset = currentPage * pageSize;
      this.props.onChangeLimit(limit);
      this.props.onChangeOffset(offset);
      this.refresh(limit, offset);
    }
    this.setState({ currentPage });
  };

  handlePageSizeChange = (pageSize: number) => {
    const { currentPage } = this.state;
    if (this.props.onChangeLimit && this.props.onChangeOffset) {
      const limit = pageSize;
      const offset = currentPage * pageSize;
      this.props.onChangeLimit(limit);
      this.props.onChangeOffset(offset);
      this.refresh(limit, offset);
    }
    this.setState({ pageSize });
  };

  render() {
    const {
      add,
      remotePaging,
      rows,
      columns,
      defaultSorting,
      pageSizes,
      totalCount
    } = this.props;
    const { currentPage, pageSize } = this.state;
    return (
      <Grid rows={rows} columns={columns}>
        {remotePaging && (
          <PagingState
            currentPage={currentPage}
            pageSize={pageSize}
            defaultCurrentPage={0}
            defaultPageSize={10}
            onCurrentPageChange={this.handleCurrentPageChange}
            onPageSizeChange={this.handlePageSizeChange}
          />
        )}
        <SortingState defaultSorting={defaultSorting} />
        <IntegratedSorting />
        <SearchState />
        <IntegratedFiltering />
        {remotePaging && <CustomPaging totalCount={totalCount} />}
        {!remotePaging && (
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
        )}
        {!remotePaging && <IntegratedPaging />}
        {add && (
          <EditingState
            onCommitChanges={() => false}
            onAddedRowsChange={this.props.onAddedRowsChange}
          />
        )}
        <Table messages={tableMessages} />
        <TableHeaderRow showSortingControls />
        <Toolbar />
        <SearchPanel messages={searchPanelMessages} />
        {add && (
          <TableEditColumn showAddCommand messages={tableEditColumnMessages} />
        )}
        <PagingPanel pageSizes={pageSizes} messages={pagingPanelMessages} />
      </Grid>
    );
  }
}
