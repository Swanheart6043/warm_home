import { Typography } from "antd"

const { Link } = Typography

export const LinkText: React.FC<any> = (props: React.ComponentProps<any>) => {
  return <Link {...props}>{ props.children }</Link>
}
