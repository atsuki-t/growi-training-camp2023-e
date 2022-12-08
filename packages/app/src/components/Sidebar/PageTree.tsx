import React, { FC, memo } from 'react';

import { useTranslation } from 'next-i18next';

import {
  useCurrentPageId, useTargetAndAncestors, useIsGuestUser,
} from '~/stores/context';
import { useCurrentPagePath } from '~/stores/page';
import { useSWRxV5MigrationStatus } from '~/stores/page-listing';

import ItemsTree from './PageTree/ItemsTree';
import { PrivateLegacyPagesLink } from './PageTree/PrivateLegacyPagesLink';
import PageTreeContentSkeleton from './Skeleton/PageTreeContentSkeleton';

const PageTreeHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="grw-sidebar-content-header p-3">
      <h3 className="mb-0">{t('Page Tree')}</h3>
    </div>
  );
};

const PageTree: FC = memo(() => {
  const { t } = useTranslation();

  const { data: isGuestUser } = useIsGuestUser();
  const { data: currentPath } = useCurrentPagePath();
  const { data: targetId } = useCurrentPageId();
  const { data: targetAndAncestorsData } = useTargetAndAncestors();
  const { data: migrationStatus } = useSWRxV5MigrationStatus();

  const targetPathOrId = targetId || currentPath;

  if (migrationStatus == null) {
    return (
      <>
        <PageTreeHeader />
        <PageTreeContentSkeleton />
      </>
    );
  }

  if (!migrationStatus?.isV5Compatible) {
    // TODO : improve design
    // Story : https://redmine.weseek.co.jp/issues/83755
    return (
      <>
        <PageTreeHeader />
        <div className="mt-5 mx-2 text-center">
          <h3 className="text-gray">{t('v5_page_migration.page_tree_not_avaliable')}</h3>
          <a href="/admin">{t('v5_page_migration.go_to_settings')}</a>
        </div>
      </>
    );
  }

  /*
   * dependencies
   */
  if (isGuestUser == null) {
    return null;
  }

  const path = currentPath || '/';

  return (
    <>
      <PageTreeHeader />
      <ItemsTree
        isEnableActions={!isGuestUser}
        targetPath={path}
        targetPathOrId={targetPathOrId}
        targetAndAncestorsData={targetAndAncestorsData}
      />

      {!isGuestUser && migrationStatus?.migratablePagesCount != null && migrationStatus.migratablePagesCount !== 0 && (
        <div className="grw-pagetree-footer border-top p-3 w-100">
          <div className="private-legacy-pages-link px-3 py-2">
            <PrivateLegacyPagesLink />
          </div>
        </div>
      )}
    </>
  );
});

PageTree.displayName = 'PageTree';

export default PageTree;
