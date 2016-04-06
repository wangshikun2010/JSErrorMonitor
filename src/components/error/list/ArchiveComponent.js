'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Panel, ListGroup, ListGroupItem, Row, Col, Input, Button, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router';

import DropdownComponent from '../../common/DropdownComponent';
import PaginationComponent from '../common/PaginationComponent';
import RangeComponent from '../common/RangeComponent';
import SearchComponent from '../common/SearchComponent';
import * as dropdown from '../../../constants/dropdown';
import { jsErrorAction, filterAction } from '../../../actions';

require('styles/error/list/Archive.scss');

class ArchiveComponent extends React.Component {

  componentDidMount () {
    this.fetchErrorList();
  }

  componentWillUnmount () {
    const { dispatch } = this.props;
    dispatch(filterAction.resetFilterProps());
  }

  componentDidUpdate (prevProps, prevState) {
    // 深度遍历对象是否相等
    var flag = ['params', 'filter', 'global', 'status'].every(key => _.isEqual(this.props[key], prevProps[key]));

    if(!flag) this.fetchErrorList();
  }

  handleSelect (key, value) {
    const { dispatch, params } = this.props;
    _.set(params, 'page', 1);
    dispatch(filterAction.setFilterProps(key, value));
  }

  fetchErrorList () {
    const { dispatch, params, filter, status } = this.props;
    dispatch(jsErrorAction.fetchArchiveErrorList(Object.assign({}, params, filter, {status: status})));
  }

  render () {
    const { archives } = this.props.jsError;
    const { params, filter } = this.props;
    const header = (
      <Row>
        <Col md={5}>错误<RangeComponent meta={archives.meta} /></Col>
        <Col md={4}>地址</Col>
        <Col md={1}>最早</Col>
        <Col md={1}>最近</Col>
        <Col md={1}>数量</Col>
      </Row>
    );
    const searchButton = (
      <Button bsStyle="primary"><Glyphicon glyph="search" />&nbsp;搜索</Button>
    );
    return (
      <div className="container-fluid" id="error-list-error">
        <form action="" className="form-inline">
          <Row>
            <Col md={6}>
              <div className="form-group">
                <label htmlFor="">每页数量：</label>
                <DropdownComponent list={dropdown.pageSize.list} placeholder={dropdown.pageSize.placeholder} activeKey={filter.pageSize} id="dropdown-page-size" handleSelect={key => this.handleSelect('pageSize', key)}/>
              </div>
            </Col>
            <Col md={6}>
              <SearchComponent handleSearch={value => this.handleSelect('keyword', value)}/>
            </Col>
          </Row>
        </form>

        <Panel header={header} id="error-list-archive">
          <ListGroup fill>
            {!archives.list.length ?
              <ListGroupItem key={0} bsStyle="warning">没有符合条件的结果</ListGroupItem> :
              archives.list.map(function (archive, idx) {
                return (
                  <ListGroupItem key={archive._id}>
                    <Row>
                      <Col md={5}>
                        <p><Link to={`/error/detail/${idx}`} className="text-danger"><strong>『{archive.status === 'open' ? '未解决' : '已解决'}』</strong>{archive.message}
                        </Link></p>
                      </Col>
                      <Col md={4}>
                        <p><a href={archive.url || 'javascript:void(0)'} target="_blank">{archive.url || '无'}</a></p>
                      </Col>
                      <Col md={1}>
                        <p className="text-muted">{archive.earliest}</p>
                      </Col>
                      <Col md={1}>
                        <p className="text-muted">{archive.latest}</p>
                      </Col>
                      <Col md={1}>
                        <p><strong className="text-danger">{archive.count}</strong></p>
                      </Col>
                    </Row>
                  </ListGroupItem>
                );
              })
            }
          </ListGroup>
        </Panel>
        {archives.list.length ?
          <PaginationComponent linkPrefix="/error/list/archive/" page={params.page} total={archives.meta.total} /> :
          ''}
      </div>
    );
  }
}

ArchiveComponent.displayName = 'ErrorListArchiveComponent';

// Uncomment properties you need
ArchiveComponent.propTypes = {};
ArchiveComponent.defaultProps = {
  filter: {
    pageSize: 20,
    keyword: ''
  },
  jsError: {
    archives: {
      list: [],
      meta: {}
    }
  }
};

function mapStateToProps(state) {
  const { jsError, filter, global, status } = state;
  return { jsError, filter, global, status }
}

export default connect(mapStateToProps)(ArchiveComponent);
