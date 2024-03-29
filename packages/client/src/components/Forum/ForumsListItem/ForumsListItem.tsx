import { Typography, Col, Row } from 'antd';
import { Link } from 'react-router-dom';

import { ROUTES } from 'constants/routes';
import { ForumModel } from 'models/forum.model';

import './ForumsListItem.scss';

export const ForumsListItem: React.FC<{ forumsListItemData: ForumModel }> = ({
  forumsListItemData,
}) => {
  return (
    <Row key={forumsListItemData.id} align="middle" gutter={[20, 50]}>
      <Col span={16}>
        <Link to={`${ROUTES.FORUM_MAIN_PAGE_PATH}/${forumsListItemData.id}`}>
          <Typography.Text>{forumsListItemData.title}</Typography.Text>
        </Link>
      </Col>

      <Col span={4}>
        <Typography.Text className="forumsListItem__topicQuantity">
          {forumsListItemData.threadCount}
        </Typography.Text>
      </Col>

      <Col span={4}>
        <Typography.Text className="forumsListItem__answerQuantity">
          {forumsListItemData.messageCount}
        </Typography.Text>
      </Col>
    </Row>
  );
};
