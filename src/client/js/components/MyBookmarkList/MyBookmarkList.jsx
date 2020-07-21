import React from 'react';
import PropTypes from 'prop-types';

import loggerFactory from '@alias/logger';
import { withUnstatedContainers } from '../UnstatedUtils';


import AppContainer from '../../services/AppContainer';
import PageContainer from '../../services/PageContainer';
import { toastError } from '../../util/apiNotification';

import PaginationWrapper from '../PaginationWrapper';

import Page from '../PageList/Page';

const logger = loggerFactory('growi:MyBookmarkList');
class MyBookmarkList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pages: [],
      activePage: 1,
      totalPages: 0,
      pagingLimit: Infinity,
    };

    this.handlePage = this.handlePage.bind(this);
  }

  componentWillMount() {
    this.getMyBookmarkList(1);
  }

  async handlePage(selectedPage) {
    await this.getMyBookmarkList(selectedPage);
  }

  async getMyBookmarkList(selectPageNumber) {
    const { appContainer, pageContainer } = this.props;
    const { pageId } = pageContainer.state;

    const userId = appContainer.currentUserId;
    /* TODO GW-3255 get config from customize settings */
    const limit = appContainer.getConfig().recentCreatedLimit;
    const offset = (selectPageNumber - 1) * limit;


    /* /pages.myBookmarks is not exitst. TODO GW-3251 Create api v3 /pages.myBookmarks */

    // This block is cited from MyDraftList
    /* await this.props.appContainer.apiGet('/pages.myBookmarks', {
      page_id: pageId, user: userId, limit, offset,
    })
      .then((res) => {
        const totalPages = res.totalCount;
        const pages = res.pages;
        const activePage = selectPageNumber;
        this.setState({
          pages,
          activePage,
          totalPages,
          pagingLimit: limit,
        });
      }); */
    try {
      await pageContainer.retrieveMyBookmarkList(pageId, userId, limit, offset);
    }
    catch (error) {
      logger.error('failed to fetch data', error);
      toastError(error, 'Error occurred in bookmark list');
    }
  }

  /**
   * generate Elements of Page
   *
   * @param {any} pages Array of pages Model Obj
   *
   */
  generatePageList(pages) {
    /* TODO GW-3251 */
    return pages.map(page => (
      <li key={`my-bookmarks-list:list-view:${page._id}`}>
        <Page page={page} />
      </li>
    ));
  }


  render() {
    const pageList = this.generatePageList(this.state.pages);

    return (
      <div className="page-list-container-create">
        <ul className="page-list-ul page-list-ul-flat mb-3">
          {pageList}
        </ul>
        <PaginationWrapper
          activePage={this.state.activePage}
          changePage={this.handlePage}
          totalItemsCount={this.state.totalPages}
          pagingLimit={this.state.pagingLimit}
        />
      </div>
    );
  }

}

/**
 * Wrapper component for using unstated
 */
const MyBookmarkListWrapper = withUnstatedContainers(MyBookmarkList, [AppContainer, PageContainer]);

MyBookmarkList.propTypes = {
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  pageContainer: PropTypes.instanceOf(PageContainer).isRequired,
};

export default MyBookmarkListWrapper;
