import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
import {
  Translate,
  ICrudGetAllAction,
  TextFormat,
  JhiPagination,
  getPaginationItemsNumber,
  getSortState,
  IPaginationBaseState
} from 'react-jhipster';
import { FaPlus, FaEye, FaPencil, FaSort, FaTrash } from 'react-icons/lib/fa';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';
import { getUsers } from './user-management.reducer';

export interface IUserManagementProps {
  getUsers: ICrudGetAllAction;
  users: any[];
  account: any;
  match: any;
  totalItems: 0;
  history: any;
  location: any;
}

export class UserManagement extends React.Component<IUserManagementProps, IPaginationBaseState> {
  state: IPaginationBaseState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE)
  };

  componentDidMount() {
    this.getUsers();
  }

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.sortUsers()
    );
  };

  sortUsers() {
    this.getUsers();
    this.props.history.push(`${this.props.location.pathname}?page=${this.state.activePage}&sort=${this.state.sort},${this.state.order}`);
  }

  handlePagination = activePage => this.setState({ activePage }, () => this.sortUsers());

  getUsers = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getUsers(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  render() {
    const { users, account, match, totalItems } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="userManagement.home.title">Users</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
            <FaPlus /> <Translate contentKey="userManagement.home.createLabel" />
          </Link>
        </h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th onClick={this.sort('id')}>
                  <Translate contentKey="global.field.id">ID</Translate>
                  <FaSort />
                </th>
                <th onClick={this.sort('login')}>
                  <Translate contentKey="userManagement.login">Login</Translate>
                  <FaSort />
                </th>
                <th onClick={this.sort('email')}>
                  <Translate contentKey="userManagement.email">Email</Translate>
                  <FaSort />
                </th>
                <th />
                <th onClick={this.sort('langKey')}>
                  <Translate contentKey="userManagement.langKey">Lang Key</Translate>
                  <FaSort />
                </th>
                <th>
                  <Translate contentKey="userManagement.profiles">Profiles</Translate>
                </th>
                <th onClick={this.sort('createdDate')}>
                  <Translate contentKey="userManagement.createdDate">Created Date</Translate>
                  <FaSort />
                </th>
                <th onClick={this.sort('lastModifiedBy')}>
                  <Translate contentKey="userManagement.lastModifiedBy">Last Modified By</Translate>
                  <FaSort />
                </th>
                <th onClick={this.sort('lastModifiedDate')}>
                  <Translate contentKey="userManagement.lastModifiedDate">Last Modified Date</Translate>
                  <FaSort />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={`user-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${user.login}`} color="link" size="sm">
                      {user.id}
                    </Button>
                  </td>
                  <td>{user.login}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.activated ? (
                      <span className="badge badge-success" style={{ cursor: 'pointer' }}>
                        Activated
                      </span>
                    ) : (
                      <span className="badge badge-danger" style={{ cursor: 'pointer' }}>
                        Deactivated
                      </span>
                    )}
                  </td>
                  <td>{user.langKey}</td>
                  <td>
                    {user.authorities
                      ? user.authorities.map((authority, j) => (
                          <div key={`user-auth-${i}-${j}`}>
                            <span className="badge badge-info">{authority}</span>
                          </div>
                        ))
                      : null}
                  </td>
                  <td>
                    <TextFormat value={user.createdDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                  </td>
                  <td>{user.lastModifiedBy}</td>
                  <td>
                    <TextFormat value={user.lastModifiedDate} type="date" format={APP_DATE_FORMAT} blankOnInvalid />
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${user.login}`} color="info" size="sm">
                        <FaEye />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view" />
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${user.login}/edit`} color="primary" size="sm">
                        <FaPencil />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit" />
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`${match.url}/${user.login}/delete`}
                        color="danger"
                        size="sm"
                        disabled={account.login === user.login}
                      >
                        <FaTrash />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete" />
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row justify-content-center">
          <JhiPagination
            items={getPaginationItemsNumber(totalItems, this.state.itemsPerPage)}
            activePage={this.state.activePage}
            onSelect={this.handlePagination}
            maxButtons={5}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  users: storeState.userManagement.users,
  totalItems: storeState.userManagement.totalItems,
  account: storeState.authentication.account
});

const mapDispatchToProps = { getUsers };

export default connect(mapStateToProps, mapDispatchToProps)(UserManagement);
