import React from 'react';

import { UserPicture } from '@growi/ui';
import { PageCommentNotification, PageUpdateNotification } from './PageContent';
import { InAppNotification as IInAppNotification } from '../../interfaces/in-app-notification';

interface Props {
  notification: IInAppNotification
  onClick: any
}

export const InAppNotification = (props: Props): JSX.Element => {

  const { notification } = props;

  // TODO get actionUsers with mongoose virtual method by #79077
  const getActionUsers = () => {
    const latestActionUsers = notification.actionUsers.slice(0, 3);
    const latestUsers = latestActionUsers.map((user) => {
      return `@${user.name}`;
    });

    let actionedUsers = '';
    const latestUsersCount = latestUsers.length;
    if (latestUsersCount === 1) {
      actionedUsers = latestUsers[0];
    }
    else if (notification.actionUsers.length >= 4) {
      actionedUsers = `${latestUsers.slice(0, 2).join(', ')} and ${notification.actionUsers.length - 2} others`;
    }
    else {
      actionedUsers = latestUsers.join(', ');
    }

    return actionedUsers;
  };

  const renderUserImage = (): JSX.Element => {
    const actionUsers = notification.actionUsers;

    if (actionUsers.length < 1) {
      return <></>;
    }

    return <UserPicture user={actionUsers[0]} size="md" noTooltip />;
  };

  const componentName = `${notification.targetModel}:${notification.action}`;
  const propsNew = {
    actionUsers: getActionUsers(),
    ...props,
  };

  const renderInAppNotificationContent = (): JSX.Element => {
    switch (componentName) {
      // TODO Is the naming of componentName too subtle?
      case 'Page:UPDATE':
        return <PageUpdateNotification {...propsNew} onClick={props.onClick(props.notification)} />;
      case 'Page:COMMENT_CREATE':
        return <PageCommentNotification {...propsNew} onClick={props.onClick(props.notification)} />;
      case 'Page:COMMENT_UPDATE':
        return <PageCommentNotification {...propsNew} onClick={props.onClick(props.notification)} />;
      default:
        return <></>;
    }
  };

  return (
    <>
      {/* TODO: notification popup adjustment by #79315 */}
      <div>
        {renderUserImage()}
        {renderInAppNotificationContent()}
      </div>
    </>
  );


};
