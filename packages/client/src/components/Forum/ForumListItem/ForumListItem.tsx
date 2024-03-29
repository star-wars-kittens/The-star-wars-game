import { Typography, Col, Row } from 'antd';
import { Link } from 'react-router-dom';

import { ROUTES } from 'constants/routes';
import { ThreadModel } from 'models/forum.model';

import './ForumListItem.scss';

export const ForumListItem: React.FC<{ forumListItemData: ThreadModel }> = ({
  forumListItemData,
}) => {
  return (
    <Row key={forumListItemData.id} align="middle" gutter={[20, 50]}>
      <Col span={20}>
        <Link to={`${ROUTES.FORUM_THREAD_PAGE_PATH}/${forumListItemData.id}`}>
          <Typography.Text>{forumListItemData.name}</Typography.Text>
        </Link>
      </Col>

      <Col span={4}>
        <Typography.Text className="forumListItem__answerQuantity">
          {forumListItemData.messageCount ?? 0}
        </Typography.Text>
      </Col>
    </Row>
  );
};
