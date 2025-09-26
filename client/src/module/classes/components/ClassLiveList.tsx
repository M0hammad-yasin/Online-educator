// client/src/module/classes/components/ClassLiveList.tsx

import React from 'react';
import { Card, List, Avatar, Typography, Tag, Button } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useClasses } from '../hooks/useClasses';
import { useClassStoreSelectors } from '../store/useClassStore';

dayjs.extend(relativeTime);

const { Text } = Typography;

const ClassLiveList: React.FC = () => {
  const filters = useClassStoreSelectors.filters();
  const { data, isLoading } = useClasses({ ...filters, page: 1, limit: 10 });

  const items = React.useMemo(() => {
    return (data?.data || []).slice(0, 5).map((c) => ({
      id: c.id,
      title: c.subject,
      description: `${c.teacher?.name || ''} with ${c.student?.name || ''}`.trim(),
      time: dayjs(c.scheduledAt).fromNow(),
    }));
  }, [data]);

  return (
    <Card style={{ borderRadius: 12, height: '100%',padding:10 }} loading={isLoading}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Text strong style={{ fontSize: 16 }}>live Classes</Text>
      </div>
      <List
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item, index) => (
          <List.Item key={item.id} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <List.Item.Meta
              avatar={<Avatar style={{ background: '#eef0ff', color: '#5955d8' }}>{index + 1}</Avatar>}
              title={<Text strong>{item.title}</Text>}
              description={<Text type="secondary">{item.description}</Text>}
            />
            <Tag color="#fff7e6" style={{ color: '#ad6800', border: '1px solid #ffe7ba' }}>{item.time}</Tag>
          </List.Item>
        )}
      />
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Button  type="link" size="small">Show more</Button>
      </div>
    </Card>
  );
};

export default ClassLiveList;


