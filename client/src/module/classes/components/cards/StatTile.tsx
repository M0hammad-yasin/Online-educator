import { Card, theme, Typography } from "antd";
const { Text } = Typography;

const StatTile: React.FC<{
    title: string;
    value?: number;
    icon: React.ReactNode;
    bg: string;
    fg: string;
}> = ({ title, value, icon, bg, fg }) => {
    const { token } = theme.useToken();
    return (
        <Card
            size="small"
            styles={{ body: { padding: 8 } }}
            style={{
                borderRadius: 12,
                background: token.colorBgContainer,
                boxShadow: token.boxShadowTertiary,
                height: '100%'
            }}
        >
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', justifyContent:'space-around' }}>
                <div
                    style={{
                        width: 37,
                        height: 37,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: bg,
                        color: fg,
                        fontSize: 15,
                    }}
                >
                    {icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Text style={{  textAlign: 'center' }}>
                        {/* {title.split(' ').map((word, index) => (
                            <span style={{fontWeight:'bold', fontSize:13}} key={index}>
                                {word}
                                {index < title.split(' ').length - 1 && <br />}
                            </span>
                        ))} */}
                            <span style={{fontWeight:'bold', fontSize:13}} >{title}</span>

                    </Text>
                    <Text strong style={{ fontSize: 18 }}>{value ?? 0}</Text>
                </div>
            </div>
        </Card>
    );
};
export default StatTile;